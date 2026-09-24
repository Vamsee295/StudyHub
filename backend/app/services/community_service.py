"""
Community Service
=================
Business logic for the Study With Me learning activity feed.
All database reads use single efficient queries with joins to avoid N+1 issues.
Server-side pagination is enforced — feeds are never fully loaded.
"""

from datetime import datetime, date, timedelta
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc, delete
from sqlalchemy.orm import selectinload

from app.models.community import LearningActivity, CommunityPost, PostLike, PostComment, UserFollow
from app.models.profile import Profile
from app.schemas.community import (
    LearningActivityCreate, CommunityPostCreate,
    AuthorOut, LearningActivityOut, CommunityPostOut,
    PostCommentCreate, PostCommentOut, DateGroup, FeedResponse,
    CommunityStats,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

ACTIVITY_TYPE_VALUES = {
    "LEARNING_COMPLETED", "PROBLEM_SOLVED", "RESOURCE_SHARED",
    "PROJECT_SHARED", "COURSE_COMPLETED", "MILESTONE", "CUSTOM_POST",
}

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


# ---------------------------------------------------------------------------
# Core Feed Query
# ---------------------------------------------------------------------------

async def get_feed(
    session: AsyncSession,
    current_user_id: Optional[str],
    filter_by: str = "all",
    limit: int = 20,
    offset: int = 0,
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
        from sqlalchemy import or_
        stmt = stmt.where(or_(*tag_conditions))

    # Count total before pagination
    count_stmt = select(func.count()).select_from(stmt.subquery())
    total_result = await session.execute(count_stmt)
    total = total_result.scalar() or 0

    # Apply pagination
    stmt = stmt.offset(offset).limit(limit)

    # Eager-load activity
    stmt = stmt.options(selectinload(CommunityPost.activity))

    result = await session.execute(stmt)
    posts = result.scalars().all()

    if not posts:
        return FeedResponse(groups=[], total=total, has_more=False, next_offset=None)

    # Batch-load authors
    user_ids = list({p.user_id for p in posts})
    profile_result = await session.execute(
        select(Profile).where(Profile.id.in_(user_ids))
    )
    profile_map = {p.id: p for p in profile_result.scalars().all()}

    # Batch-load like counts
    post_ids = [p.id for p in posts]
    like_count_result = await session.execute(
        select(PostLike.post_id, func.count(PostLike.id).label("cnt"))
        .where(PostLike.post_id.in_(post_ids))
        .group_by(PostLike.post_id)
    )
    like_count_map = {row.post_id: row.cnt for row in like_count_result}

    # Batch-load comment counts
    comment_count_result = await session.execute(
        select(PostComment.post_id, func.count(PostComment.id).label("cnt"))
        .where(PostComment.post_id.in_(post_ids))
        .group_by(PostComment.post_id)
    )
    comment_count_map = {row.post_id: row.cnt for row in comment_count_result}

    # Batch-load current user's likes
    liked_set: set = set()
    if current_user_id:
        liked_result = await session.execute(
            select(PostLike.post_id)
            .where(PostLike.post_id.in_(post_ids), PostLike.user_id == current_user_id)
        )
        liked_set = {row.post_id for row in liked_result}

    # Build post output objects
    post_outs: List[CommunityPostOut] = []
    for p in posts:
        post_outs.append(CommunityPostOut(
            id=p.id,
            user_id=p.user_id,
            content=p.content,
            post_type=p.post_type,
            tags=p.tags,
            visibility=p.visibility,
            created_at=p.created_at,
            updated_at=p.updated_at,
            author=_author_from_profile(profile_map.get(p.user_id)),
            activity=_activity_out(p.activity),
            like_count=like_count_map.get(p.id, 0),
            comment_count=comment_count_map.get(p.id, 0),
            user_has_liked=p.id in liked_set,
        ))

    # Group by date
    from collections import defaultdict
    groups_dict: dict = defaultdict(list)
    for po in post_outs:
        d = po.created_at.date()
        groups_dict[d].append(po)

    groups: List[DateGroup] = []
    for d in sorted(groups_dict.keys(), reverse=True):
        groups.append(DateGroup(
            label=_label_for_date(d),
            date=d.isoformat(),
            posts=groups_dict[d],
        ))

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
            tags=data.tags,
            visibility=data.visibility,
        )
        session.add(activity)
        await session.flush()   # get the generated id

    post = CommunityPost(
        user_id=user_id,
        content=data.content,
        post_type="activity" if activity else "custom",
        tags=data.tags,
        visibility=data.visibility,
        activity_id=activity.id if activity else None,
    )
    session.add(post)
    await session.commit()
    await session.refresh(post)

    # Load author profile
    profile_result = await session.execute(select(Profile).where(Profile.id == user_id))
    profile = profile_result.scalars().first()

    return CommunityPostOut(
        id=post.id,
        user_id=post.user_id,
        content=post.content,
        post_type=post.post_type,
        tags=post.tags,
        visibility=post.visibility,
        created_at=post.created_at,
        updated_at=post.updated_at,
        author=_author_from_profile(profile),
        activity=_activity_out(activity),
        like_count=0,
        comment_count=0,
        user_has_liked=False,
    )


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
        tags=data.tags,
        visibility=data.visibility,
    )
    session.add(activity)
    await session.flush()

    if data.visibility == "public":
        post = CommunityPost(
            user_id=user_id,
            content=data.description or data.title,
            post_type="activity",
            tags=data.tags,
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
    if not post_result.scalars().first():
        raise ValueError("Post not found")

    comment = PostComment(post_id=post_id, user_id=user_id, content=data.content)
    session.add(comment)
    await session.commit()
    await session.refresh(comment)

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
) -> None:
    result = await session.execute(select(PostComment).where(PostComment.id == comment_id))
    comment = result.scalars().first()
    if not comment:
        raise ValueError("Comment not found")
    if comment.user_id != user_id:
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

    return CommunityStats(
        active_today=active_today,
        total_posts=total_posts,
        trending_tags=trending,
    )
