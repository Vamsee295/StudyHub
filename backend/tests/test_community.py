import asyncio

import pytest
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base
from app.models.profile import Profile
from app.schemas.community import CommunityPostCreate, PostCommentCreate
from app.services import community_service as svc


def test_normalize_tags():
    assert svc.normalize_tags("Java, #OOP ,java, system design") == "java,oop,system-design"
    assert svc.normalize_tags("  ,# ") is None


def test_likes_replies_and_follows_notify_the_right_person(monkeypatch):
    sent = []
    monkeypatch.setattr(svc.notify_service, "notify", lambda *a: sent.append(a))

    async def go():
        engine = create_async_engine("sqlite+aiosqlite://")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        s = async_sessionmaker(engine, expire_on_commit=False)()
        s.add_all([Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi")])
        await s.commit()
        post = await svc.create_post(s, "u1", CommunityPostCreate(content="Finished the graphs module today"))

        await svc.toggle_like(s, post.id, "u1")   # liking your own post: no notification
        await svc.toggle_like(s, post.id, "u2")   # like -> notify u1
        await svc.toggle_like(s, post.id, "u2")   # unlike -> nothing
        await svc.create_comment(s, post.id, "u2", PostCommentCreate(content="Nice work!"))
        await svc.create_comment(s, post.id, "u1", PostCommentCreate(content="Thanks"))  # own post: nothing
        await svc.toggle_follow(s, "u2", "u1")   # follow -> notify u1
        await svc.toggle_follow(s, "u2", "u1")   # unfollow -> nothing
        saved = list(sent)   # checked after go(); set aside while testing mentions
        sent.clear()
        # mentions: Meera is named in the text -> notified; Kiran is only in the ids (silent ping) -> not;
        # the post's author already gets the reply notification, and you can't mention yourself
        s.add_all([Profile(id="u3", full_name="Meera Rao"), Profile(id="u4", full_name="Kiran")])
        await s.commit()
        await svc.create_comment(s, post.id, "u2", PostCommentCreate(
            content="@Meera Rao look at this, @Asha nice", mention_ids=["u3", "u4", "u1", "u2"]))
        mentions = [(u, t, m) for u, t, _, m, _ in sent if t == "MENTION"]
        assert mentions == [("u3", "MENTION", 'Ravi mentioned you: "@Meera Rao look at this, @Asha nice"')]
        assert [u for u, t, *_ in sent if t == "POST_REPLY"] == ["u1"]
        sent.clear()
        sent.extend(saved)

        # the @ picker finds people active in the community, never yourself
        await svc.create_post(s, "u3", CommunityPostCreate(content="hello"))
        assert [a.id for a in await svc.search_learners(s, "mee", "u2")] == ["u3"]
        assert await svc.search_learners(s, "kiran", "u2") == []    # never posted or replied
        assert [a.id for a in await svc.search_learners(s, "ravi", "u2")] == []   # that's you
        await s.close()
        await engine.dispose()

    asyncio.run(go())
    link = f"/community?post="
    assert [(u, t, m) for u, t, _, m, _ in sent] == [
        ("u1", "POST_LIKED", 'Ravi liked your post "Finished the graphs module today"'),
        ("u1", "POST_REPLY", 'Ravi replied: "Nice work!"'),
        ("u1", "NEW_FOLLOWER", "Ravi started following you"),
    ]
    assert all(l.startswith(link) for *_, l in sent[:2])
    assert sent[2][4] == "/community?user=u2"   # opens the follower's profile


def test_feed_follow_state_filters_delete_and_suggestions():
    async def go():
        engine = create_async_engine("sqlite+aiosqlite://")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        s = async_sessionmaker(engine, expire_on_commit=False)()
        s.add_all([Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi"), Profile(id="u3", full_name="Meera")])
        await s.commit()

        a = await svc.create_post(s, "u1", CommunityPostCreate(content="Two pointers clicked", tags="#Arrays, DSA"))
        assert a.tags == "arrays,dsa" and a.is_mine
        await svc.create_post(s, "u2", CommunityPostCreate(content="Joins today", tags="sql"))
        await svc.create_post(s, "u3", CommunityPostCreate(content="Mock interview", tags="interview"))

        # u2 follows u1: their posts say so, and the following feed shows only u1
        await svc.toggle_follow(s, "u2", "u1")
        feed = await svc.get_feed(s, "u2")
        posts = {p.user_id: p for g in feed.groups for p in g.posts}
        assert posts["u1"].author_followed and not posts["u3"].author_followed and posts["u2"].is_mine
        following = await svc.get_feed(s, "u2", "following")
        assert [p.user_id for g in following.groups for p in g.posts] == ["u1"]

        # exact hashtag and one learner's posts
        tagged = await svc.get_feed(s, None, "tag:arrays")
        assert [p.id for g in tagged.groups for p in g.posts] == [a.id]
        assert (await svc.get_feed(s, None, "tag:arr")).total == 0
        assert (await svc.get_feed(s, None, author_id="u3")).total == 1

        # profile summary and suggestions (not yourself, not people you follow)
        summary = await svc.user_summary(s, "u1", "u2")
        assert (summary.post_count, summary.followers, summary.following, summary.is_following) == (1, 1, 0, True)
        assert [x.author.id for x in await svc.suggestions(s, "u2")] == ["u3"]

        # only the author can delete; replies and likes go with the post
        await svc.create_comment(s, a.id, "u2", PostCommentCreate(content="Nice!"))
        await svc.toggle_like(s, a.id, "u2")
        with pytest.raises(PermissionError):
            await svc.delete_post(s, a.id, "u2")
        await svc.delete_post(s, a.id, "u1")
        assert await svc.get_post(s, a.id, None) is None
        assert await svc.get_comments(s, a.id) == []

        await s.close()
        await engine.dispose()

    asyncio.run(go())


def test_board_types_top_sort_and_counts():
    async def go():
        engine = create_async_engine("sqlite+aiosqlite://")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        s = async_sessionmaker(engine, expire_on_commit=False)()
        s.add_all([Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi"), Profile(id="u3", full_name="Meera")])
        await s.commit()

        q = await svc.create_post(s, "u1", CommunityPostCreate(content="How do I start DP?", post_type="question"))
        w = await svc.create_post(s, "u2", CommunityPostCreate(content="Solved 100 problems", post_type="win"))
        d = await svc.create_post(s, "u3", CommunityPostCreate(content="Old-style post", post_type="custom"))  # legacy -> discussion
        with pytest.raises(ValueError):
            await svc.create_post(s, "u1", CommunityPostCreate(content="x", post_type="spam"))

        # spread them over different days (oldest: the question), so Top can't pass by date order alone
        from datetime import datetime, timedelta
        from app.models.community import CommunityPost
        for i, pid in enumerate([q.id, w.id, d.id]):
            (await s.get(CommunityPost, pid)).created_at = datetime(2026, 11, 1) + timedelta(days=i)
        await s.commit()

        # the question gets two votes, the win one: Top ranks by votes, New by time
        for voter in ("u2", "u3"):
            await svc.toggle_like(s, q.id, voter)
        await svc.toggle_like(s, w.id, "u1")
        ids = lambda feed: [p.id for g in feed.groups for p in g.posts]  # noqa: E731
        assert ids(await svc.get_feed(s, None, sort="top")) == [q.id, w.id, d.id]
        assert ids(await svc.get_feed(s, None)) == [d.id, w.id, q.id]

        assert ids(await svc.get_feed(s, None, category="question")) == [q.id]
        assert ids(await svc.get_feed(s, None, category="discussion")) == [d.id]
        assert svc.category_of("activity") == "win" and svc.category_of(None) == "discussion"
        stats = await svc.get_stats(s)
        assert stats.category_counts == {"question": 1, "discussion": 1, "win": 1, "resource": 0}
        await s.close()
        await engine.dispose()

    asyncio.run(go())
