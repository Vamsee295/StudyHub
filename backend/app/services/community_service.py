"""
Community Service
=================
Business logic for the Community board (discussions, questions, wins and resources).
All database reads use single efficient queries with joins to avoid N+1 issues.
Server-side pagination is enforced — feeds are never fully loaded.
"""

from datetime import datetime, date, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc, delete, or_, literal
from sqlalchemy.orm import selectinload

from app.models.community import LearningActivity, CommunityPost, PostLike, PostComment, UserFollow
from app.models.profile import Profile
from app.services import notify_service
from app.schemas.community import (
    LearningActivityCreate, CommunityPostCreate,
    AuthorOut, LearningActivityOut, CommunityPostOut,
    PostCommentCreate, PostCommentOut, DateGroup, FeedResponse,
    CommunityStats, UserSummary,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

ACTIVITY_TYPE_VALUES = {
    "LEARNING_COMPLETED", "PROBLEM_SOLVED", "RESOURCE_SHARED",
    "PROJECT_SHARED", "COURSE_COMPLETED", "MILESTONE", "CUSTOM_POST",
}

# Board post types. Posts store their type in post_type; older posts used "custom" (now discussion)
# and "activity" (an auto/learning post, now a win).
CATEGORIES = ("question", "discussion", "win", "resource")
CATEGORY_ALIASES = {"discussion": ("discussion", "custom"), "win": ("win", "activity"),
                    "question": ("question",), "resource": ("resource",)}


def category_of(post_type: Optional[str]) -> str:
    for cat, names in CATEGORY_ALIASES.items():
        if post_type in names:
            return cat
    return "discussion"


FILTER_TAG_MAP = {
    "dsa":       ["dsa", "arrays", "dp", "graphs", "trees", "sorting", "strings", "binary-search"],
    "java":      ["java", "oop", "spring", "jvm"],
    "python":    ["python", "django", "flask", "pandas", "numpy"],
    "sql":       ["sql", "mysql", "postgresql", "queries", "joins"],
    "aptitude":  ["aptitude", "quant", "logical", "verbal", "reasoning"],
    "interview": ["interview", "hr", "system-design", "behavioural"],
    "resources": ["resource", "book", "paper", "link", "playlist"],
    "projects":  ["project", "portfolio", "open-source", "hackathon"],
}


def _label_for_date(d: date) -> str:
    today = date.today()
    if d == today:
        return "TODAY"
    if d == today - timedelta(days=1):
        return "YESTERDAY"
    return f"{d.strftime('%B')} {d.day}"   # e.g. "September 22"


def _author_from_profile(p: Optional[Profile]) -> Optional[AuthorOut]:
    if not p:
        return None
    return AuthorOut(
        id=p.id,
        full_name=p.full_name or "StudyHub Learner",
        avatar_url=p.avatar_url,
        university=p.university,
    )


def _activity_out(a: Optional[LearningActivity]) -> Optional[LearningActivityOut]:
    if not a:
        return None
    return LearningActivityOut(
        id=a.id,
        user_id=a.user_id,
        activity_type=a.activity_type,
        title=a.title,
        description=a.description,
        subject_slug=a.subject_slug,
        topic_slug=a.topic_slug,
        problem_id=a.problem_id,
        resource_id=a.resource_id,
        roadmap_id=a.roadmap_id,
        tags=a.tags,
        visibility=a.visibility,
        created_at=a.created_at,
    )


def normalize_tags(tags: Optional[str]) -> Optional[str]:
    """'Java, #OOP ,java' -> 'java,oop' (lowercase, no '#', no duplicates, at most 8)."""
    out: List[str] = []
    for t in (tags or "").split(","):
        t = t.strip().lstrip("#").lower().replace(" ", "-")[:30]
        if t and t not in out:
            out.append(t)
    return ",".join(out[:8]) or None


def _has_tag(tag: str):
    tag = tag.strip().lstrip("#").lower()
    return (literal(",") + func.lower(func.coalesce(CommunityPost.tags, "")) + literal(",")).like(f"%,{tag},%")


async def _posts_out(session: AsyncSession, posts: List[CommunityPost], viewer_id: Optional[str]) -> List[CommunityPostOut]:
    """Posts with authors, counts, and the viewer's like / follow state, in a fixed number of queries."""
    if not posts:
        return []
    post_ids = [p.id for p in posts]
    user_ids = list({p.user_id for p in posts})
    profile_map = {p.id: p for p in (await session.execute(select(Profile).where(Profile.id.in_(user_ids)))).scalars()}
    likes = dict((await session.execute(
        select(PostLike.post_id, func.count(PostLike.id)).where(PostLike.post_id.in_(post_ids)).group_by(PostLike.post_id))).all())
    comments = dict((await session.execute(
        select(PostComment.post_id, func.count(PostComment.id)).where(PostComment.post_id.in_(post_ids)).group_by(PostComment.post_id))).all())
    liked: set = set()
    followed: set = set()
    if viewer_id:
        liked = set((await session.execute(
            select(PostLike.post_id).where(PostLike.post_id.in_(post_ids), PostLike.user_id == viewer_id))).scalars())
        followed = set((await session.execute(
            select(UserFollow.following_id).where(UserFollow.follower_id == viewer_id, UserFollow.following_id.in_(user_ids)))).scalars())
    return [
        CommunityPostOut(
            id=p.id, user_id=p.user_id, content=p.content, post_type=p.post_type, tags=p.tags,
            visibility=p.visibility, created_at=p.created_at, updated_at=p.updated_at,
            author=_author_from_profile(profile_map.get(p.user_id)), activity=_activity_out(p.activity),
            like_count=likes.get(p.id, 0), comment_count=comments.get(p.id, 0),
            user_has_liked=p.id in liked, author_followed=p.user_id in followed,
            is_mine=bool(viewer_id and p.user_id == viewer_id),
        )
        for p in posts
    ]


def _snippet(text: str, n: int = 60) -> str:
    text = " ".join((text or "").split())
    return text if len(text) <= n else text[: n - 1].rstrip() + "…"


async def _notify_author(session: AsyncSession, post: CommunityPost, actor_id: str, type_: str, title: str, what: str) -> None:
    """Tell a post's author that someone else interacted with it (never yourself)."""
    if post.user_id == actor_id:
        return
    actor = await session.get(Profile, actor_id)
    name = (actor.full_name if actor and actor.full_name else "A learner")
    notify_service.notify(post.user_id, type_, title, f"{name} {what}", f"/community?post={post.id}")


async def _notify_mentions(session: AsyncSession, post: CommunityPost, actor_id: str, content: str, mention_ids: List[str]) -> None:
    """Notify learners @-mentioned in a reply. Only names actually written in the text count, so nobody can be
    pinged silently; you can't mention yourself, and the post's author already gets the reply notification."""
    ids = {i for i in mention_ids if i not in (actor_id, post.user_id)}
    if not ids:
        return
    actor = await session.get(Profile, actor_id)
    name = actor.full_name if actor and actor.full_name else "A learner"
    text = content.lower()
    for p in (await session.execute(select(Profile).where(Profile.id.in_(ids)))).scalars():
        if p.full_name and f"@{p.full_name.lower()}" in text:
            notify_service.notify(p.id, "MENTION", "New mention", f'{name} mentioned you: "{_snippet(content)}"',
                                  f"/community?post={post.id}")


async def search_learners(session: AsyncSession, q: str, viewer_id: Optional[str], limit: int = 6) -> List[AuthorOut]:
    """Learners whose name matches, for the @ picker. Only people active in the community (a public post or
    a reply) are searchable, and their names are already public there."""
    q = q.strip()
    if not q:
        return []
    active = select(CommunityPost.user_id).where(CommunityPost.visibility == "public").union(select(PostComment.user_id))
    like = f"%{q.lower()}%"
    stmt = (select(Profile).where(Profile.id.in_(active), func.lower(Profile.full_name).like(like))
            .order_by(Profile.full_name).limit(limit))
    if viewer_id:
        stmt = stmt.where(Profile.id != viewer_id)
    return [_author_from_profile(p) for p in (await session.execute(stmt)).scalars()]


# ---------------------------------------------------------------------------
# Core Feed Query
# ---------------------------------------------------------------------------

async def get_feed(
    session: AsyncSession,
    current_user_id: Optional[str],
    filter_by: str = "all",
    limit: int = 20,
    offset: int = 0,
    author_id: Optional[str] = None,
    category: Optional[str] = None,
    sort: str = "new",
) -> FeedResponse:
    """
    Retrieve paginated community posts for the feed.
    Groups them by date. Uses a single query with explicit joins.
    """
    # Build base query — only public posts (or posts by users you follow)
    stmt = (
        select(CommunityPost)
        .where(CommunityPost.visibility == "public")
        .order_by(desc(CommunityPost.created_at))
    )

    if author_id:
        stmt = stmt.where(CommunityPost.user_id == author_id)
    if category in CATEGORY_ALIASES:
        stmt = stmt.where(CommunityPost.post_type.in_(CATEGORY_ALIASES[category]))

    # "Following" filter
    if filter_by == "following" and current_user_id:
        following_subq = select(UserFollow.following_id).where(
            UserFollow.follower_id == current_user_id
        ).scalar_subquery()
        stmt = stmt.where(CommunityPost.user_id.in_(following_subq))

    # Tag-based filters
    elif filter_by in FILTER_TAG_MAP:
        tag_patterns = FILTER_TAG_MAP[filter_by]
        tag_conditions = [CommunityPost.tags.ilike(f"%{t}%") for t in tag_patterns]
        stmt = stmt.where(or_(*tag_conditions))

    # One exact hashtag, e.g. "tag:arrays" (from a #arrays link or a trending tag)
    elif filter_by.startswith("tag:") and filter_by[4:].strip():
        stmt = stmt.where(_has_tag(filter_by[4:]))

    # Count total before pagination
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar() or 0

    # "Top": most upvoted first (newest breaks ties)
    if sort == "top":
        votes = (select(PostLike.post_id, func.count(PostLike.id).label("n")).group_by(PostLike.post_id).subquery())
        stmt = (stmt.outerjoin(votes, votes.c.post_id == CommunityPost.id)
                .order_by(None).order_by(func.coalesce(votes.c.n, 0).desc(), desc(CommunityPost.created_at)))

    # Apply pagination
    stmt = stmt.offset(offset).limit(limit)

    # Eager-load activity
    stmt = stmt.options(selectinload(CommunityPost.activity))

    result = await session.execute(stmt)
    posts = result.scalars().all()

    if not posts:
        return FeedResponse(groups=[], total=total, has_more=False, next_offset=None)

    post_outs = await _posts_out(session, posts, current_user_id)

    # Group consecutive posts from the same day, keeping the query's order (date order for "new",
    # vote order for "top" — re-sorting groups by date here would undo "top")
    groups: List[DateGroup] = []
    for po in post_outs:
        d = po.created_at.date()
        if groups and groups[-1].date == d.isoformat():
            groups[-1].posts.append(po)
        else:
            groups.append(DateGroup(label=_label_for_date(d), date=d.isoformat(), posts=[po]))

    has_more = (offset + limit) < total
    return FeedResponse(
        groups=groups,
        total=total,
        has_more=has_more,
        next_offset=(offset + limit) if has_more else None,
    )


# ---------------------------------------------------------------------------
# Create Post (with optional activity)
# ---------------------------------------------------------------------------

async def create_post(
    session: AsyncSession,
    user_id: str,
    data: CommunityPostCreate,
) -> CommunityPostOut:
    activity = None
    tags = normalize_tags(data.tags)
    if data.post_type not in CATEGORIES + ("custom",):
        raise ValueError(f"Invalid post type: {data.post_type}")

    # If the post has an activity type, create a LearningActivity record first
    if data.activity_type and data.activity_title:
        if data.activity_type not in ACTIVITY_TYPE_VALUES:
            raise ValueError(f"Invalid activity_type: {data.activity_type}")

        activity = LearningActivity(
            user_id=user_id,
            activity_type=data.activity_type,
            title=data.activity_title,
            description=data.content,
            subject_slug=data.subject_slug,
            topic_slug=data.topic_slug,
            problem_id=data.problem_id,
            resource_id=data.resource_id,
            tags=tags,
            visibility=data.visibility,
        )
        session.add(activity)
        await session.flush()   # get the generated id

    post = CommunityPost(
        user_id=user_id,
        content=data.content,
        post_type="win" if activity else data.post_type,
        tags=tags,
        visibility=data.visibility,
        activity_id=activity.id if activity else None,
    )
    session.add(post)
    await session.commit()
    post = (await session.execute(
        select(CommunityPost).options(selectinload(CommunityPost.activity)).where(CommunityPost.id == post.id))).scalar_one()
    return (await _posts_out(session, [post], user_id))[0]


async def get_post(session: AsyncSession, post_id: str, viewer_id: Optional[str]) -> Optional[CommunityPostOut]:
    post = (await session.execute(
        select(CommunityPost).options(selectinload(CommunityPost.activity))
        .where(CommunityPost.id == post_id, CommunityPost.visibility == "public"))).scalars().first()
    return (await _posts_out(session, [post], viewer_id))[0] if post else None


async def delete_post(session: AsyncSession, post_id: str, user_id: str, as_admin: bool = False) -> None:
    """Deletes your own post (or any post, for an admin), its likes and replies, and the activity it wraps."""
    post = await session.get(CommunityPost, post_id)
    if not post:
        raise ValueError("Post not found")
    if post.user_id != user_id and not as_admin:
        raise PermissionError("You can only delete your own posts")
    await session.execute(delete(PostLike).where(PostLike.post_id == post_id))
    await session.execute(delete(PostComment).where(PostComment.post_id == post_id))
    activity_id = post.activity_id
    await session.delete(post)
    if activity_id:
        await session.execute(delete(LearningActivity).where(LearningActivity.id == activity_id))
    await session.commit()


# ---------------------------------------------------------------------------
# Learner profiles and suggestions
# ---------------------------------------------------------------------------

async def _count(session: AsyncSession, model, *where) -> int:
    return (await session.execute(select(func.count()).select_from(model).where(*where))).scalar_one()


async def user_summary(session: AsyncSession, user_id: str, viewer_id: Optional[str]) -> Optional[UserSummary]:
    profile = await session.get(Profile, user_id)
    if not profile:
        return None
    return UserSummary(
        author=_author_from_profile(profile),
        post_count=await _count(session, CommunityPost, CommunityPost.user_id == user_id, CommunityPost.visibility == "public"),
        followers=await _count(session, UserFollow, UserFollow.following_id == user_id),
        following=await _count(session, UserFollow, UserFollow.follower_id == user_id),
        is_following=bool(viewer_id) and await _count(
            session, UserFollow, UserFollow.follower_id == viewer_id, UserFollow.following_id == user_id) > 0,
        is_me=viewer_id == user_id,
    )


async def suggestions(session: AsyncSession, viewer_id: Optional[str], limit: int = 5) -> List[UserSummary]:
    """Learners who posted most in the last 14 days, minus you and people you already follow."""
    since = datetime.utcnow() - timedelta(days=14)
    stmt = (select(CommunityPost.user_id, func.count().label("n"))
            .where(CommunityPost.visibility == "public", CommunityPost.created_at >= since)
            .group_by(CommunityPost.user_id).order_by(desc("n")).limit(limit))
    if viewer_id:
        stmt = stmt.where(CommunityPost.user_id != viewer_id, CommunityPost.user_id.not_in(
            select(UserFollow.following_id).where(UserFollow.follower_id == viewer_id)))
    out = []
    for uid, _ in (await session.execute(stmt)).all():
        summary = await user_summary(session, uid, viewer_id)
        if summary:
            out.append(summary)
    return out


# ---------------------------------------------------------------------------
# Activity Logger (called by learnService / practice on completion events)
# ---------------------------------------------------------------------------

async def log_activity(
    session: AsyncSession,
    user_id: str,
    data: LearningActivityCreate,
) -> LearningActivity:
    """
    Low-level helper to record a structured learning event.
    Also auto-publishes a community post if visibility is public.
    """
    if data.activity_type not in ACTIVITY_TYPE_VALUES:
        raise ValueError(f"Invalid activity_type: {data.activity_type}")

    activity = LearningActivity(
        user_id=user_id,
        activity_type=data.activity_type,
        title=data.title,
        description=data.description,
        subject_slug=data.subject_slug,
        topic_slug=data.topic_slug,
        problem_id=data.problem_id,
        resource_id=data.resource_id,
        roadmap_id=data.roadmap_id,
        tags=normalize_tags(data.tags),
        visibility=data.visibility,
    )
    session.add(activity)
    await session.flush()

    if data.visibility == "public":
        post = CommunityPost(
            user_id=user_id,
            content=data.description or data.title,
            post_type="activity",
            tags=activity.tags,
            visibility="public",
            activity_id=activity.id,
        )
        session.add(post)

    await session.commit()
    await session.refresh(activity)
    return activity


# ---------------------------------------------------------------------------
# Likes
# ---------------------------------------------------------------------------

async def toggle_like(
    session: AsyncSession,
    post_id: str,
    user_id: str,
) -> Tuple[bool, int]:
    """Returns (now_liked, new_like_count)."""
    # Verify post exists
    post_result = await session.execute(select(CommunityPost).where(CommunityPost.id == post_id))
    post = post_result.scalars().first()
    if not post:
        raise ValueError("Post not found")

    existing = await session.execute(
        select(PostLike).where(PostLike.post_id == post_id, PostLike.user_id == user_id)
    )
    like = existing.scalars().first()

    if like:
        await session.delete(like)
        now_liked = False
    else:
        session.add(PostLike(post_id=post_id, user_id=user_id))
        now_liked = True

    await session.commit()
    if now_liked:
        await _notify_author(session, post, user_id, "POST_LIKED", "New like", f'liked your post "{_snippet(post.content)}"')

    count_result = await session.execute(
        select(func.count(PostLike.id)).where(PostLike.post_id == post_id)
    )
    return now_liked, count_result.scalar() or 0


# ---------------------------------------------------------------------------
# Comments
# ---------------------------------------------------------------------------

async def get_comments(
    session: AsyncSession,
    post_id: str,
    limit: int = 50,
    offset: int = 0,
) -> List[PostCommentOut]:
    result = await session.execute(
        select(PostComment)
        .where(PostComment.post_id == post_id)
        .order_by(PostComment.created_at)
        .offset(offset)
        .limit(limit)
    )
    comments = result.scalars().all()

    if not comments:
        return []

    user_ids = list({c.user_id for c in comments})
    profiles = await session.execute(select(Profile).where(Profile.id.in_(user_ids)))
    profile_map = {p.id: p for p in profiles.scalars().all()}

    return [
        PostCommentOut(
            id=c.id,
            post_id=c.post_id,
            user_id=c.user_id,
            content=c.content,
            created_at=c.created_at,
            author=_author_from_profile(profile_map.get(c.user_id)),
        )
        for c in comments
    ]


async def create_comment(
    session: AsyncSession,
    post_id: str,
    user_id: str,
    data: PostCommentCreate,
) -> PostCommentOut:
    post_result = await session.execute(select(CommunityPost).where(CommunityPost.id == post_id))
    post = post_result.scalars().first()
    if not post:
        raise ValueError("Post not found")

    comment = PostComment(post_id=post_id, user_id=user_id, content=data.content)
    session.add(comment)
    await session.commit()
    await session.refresh(comment)
    await _notify_author(session, post, user_id, "POST_REPLY", "New reply", f'replied: "{_snippet(data.content)}"')
    await _notify_mentions(session, post, user_id, data.content, data.mention_ids)

    profile_result = await session.execute(select(Profile).where(Profile.id == user_id))
    profile = profile_result.scalars().first()

    return PostCommentOut(
        id=comment.id,
        post_id=comment.post_id,
        user_id=comment.user_id,
        content=comment.content,
        created_at=comment.created_at,
        author=_author_from_profile(profile),
    )


async def delete_comment(
    session: AsyncSession,
    comment_id: str,
    user_id: str,
    as_admin: bool = False,
) -> None:
    result = await session.execute(select(PostComment).where(PostComment.id == comment_id))
    comment = result.scalars().first()
    if not comment:
        raise ValueError("Comment not found")
    if comment.user_id != user_id and not as_admin:
        raise PermissionError("Cannot delete another user's comment")
    await session.delete(comment)
    await session.commit()


# ---------------------------------------------------------------------------
# Follows
# ---------------------------------------------------------------------------

async def toggle_follow(
    session: AsyncSession,
    follower_id: str,
    following_id: str,
) -> Tuple[bool, str]:
    """Returns (now_following, message)."""
    if follower_id == following_id:
        raise ValueError("You cannot follow yourself")

    existing = await session.execute(
        select(UserFollow).where(
            UserFollow.follower_id == follower_id,
            UserFollow.following_id == following_id,
        )
    )
    follow = existing.scalars().first()

    if follow:
        await session.delete(follow)
        await session.commit()
        return False, "Unfollowed"
    else:
        session.add(UserFollow(follower_id=follower_id, following_id=following_id))
        await session.commit()
        follower = await session.get(Profile, follower_id)
        name = follower.full_name if follower and follower.full_name else "A learner"
        # one unread notice per follower, so follow / unfollow / follow doesn't stack up
        notify_service.notify(following_id, "NEW_FOLLOWER", "New follower", f"{name} started following you",
                              f"/community?user={follower_id}")
        return True, "Followed"


# ---------------------------------------------------------------------------
# Community Stats
# ---------------------------------------------------------------------------

async def get_stats(session: AsyncSession) -> CommunityStats:
    today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

    # Active today: distinct users who posted in last 24h
    active_result = await session.execute(
        select(func.count(func.distinct(CommunityPost.user_id)))
        .where(CommunityPost.created_at >= today_start, CommunityPost.visibility == "public")
    )
    active_today = active_result.scalar() or 0

    # Total public posts
    total_result = await session.execute(
        select(func.count(CommunityPost.id)).where(CommunityPost.visibility == "public")
    )
    total_posts = total_result.scalar() or 0

    # Trending tags (last 24h) — simple substring count approach
    recent_tags_result = await session.execute(
        select(CommunityPost.tags)
        .where(CommunityPost.created_at >= today_start, CommunityPost.tags != None)
    )
    tag_rows = recent_tags_result.scalars().all()
    tag_freq: dict = {}
    for row in tag_rows:
        if row:
            for t in row.split(","):
                t = t.strip().lower()
                if t:
                    tag_freq[t] = tag_freq.get(t, 0) + 1
    trending = [t for t, _ in sorted(tag_freq.items(), key=lambda x: -x[1])[:8]]

    by_type = dict((await session.execute(
        select(CommunityPost.post_type, func.count()).where(CommunityPost.visibility == "public").group_by(CommunityPost.post_type))).all())
    category_counts = {c: sum(by_type.get(n, 0) for n in CATEGORY_ALIASES[c]) for c in CATEGORIES}

    return CommunityStats(
        active_today=active_today,
        total_posts=total_posts,
        trending_tags=trending,
        category_counts=category_counts,
    )
