import asyncio

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base
from app.models.community import CommunityPost, PostComment
from app.models.ideas import Idea, IdeaVote
from app.models.learning import LearningModule, LearningSubject, LearningTopic, UserLearningProgress
from app.models.profile import Profile
from app.models.user_sync import UserSyncData
from app.services.account_service import delete_user_data


def test_delete_removes_everything_the_user_owns_and_nothing_else():
    async def go():
        engine = create_async_engine("sqlite+aiosqlite://")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        s = async_sessionmaker(engine, expire_on_commit=False)()
        s.add_all([
            Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi"),
            LearningSubject(id="s1", name="DSA", slug="dsa"),
            LearningModule(id="m1", subject_id="s1", title="Arrays"),
            LearningTopic(id="t1", module_id="m1", title="Two Sum", slug="two-sum"),
            UserLearningProgress(id="u1_t1", user_id="u1", topic_id="t1", status="completed"),
            UserLearningProgress(id="u2_t1", user_id="u2", topic_id="t1", status="in_progress"),
            UserSyncData(user_id="u1", key="theme", updated_at=1),
            Idea(id="i1", user_id="u1", title="Dark mode", vote_count=1),   # u1's idea, voted by u2
            Idea(id="i2", user_id="u2", title="Graphs", vote_count=2),      # u2's idea, voted by u1 and u2
            IdeaVote(id="v1", idea_id="i1", user_id="u2"),
            IdeaVote(id="v2", idea_id="i2", user_id="u1"),
            IdeaVote(id="v3", idea_id="i2", user_id="u2"),
            CommunityPost(id="p1", user_id="u1", content="hi"),
            PostComment(id="c1", post_id="p1", user_id="u2", content="hello"),  # u2's comment on u1's post
        ])
        await s.commit()

        await delete_user_data(s, "u1")

        async def ids(model):
            return sorted((await s.execute(select(model.id))).scalars().all())

        assert await ids(Profile) == ["u2"]
        assert await ids(UserLearningProgress) == ["u2_t1"]
        assert (await s.execute(select(func.count()).select_from(UserSyncData))).scalar() == 0
        assert await ids(Idea) == ["i2"]
        assert await ids(IdeaVote) == ["v3"]              # u1's vote and the vote on u1's idea are gone
        assert (await s.get(Idea, "i2")).vote_count == 1  # recounted
        assert await ids(CommunityPost) == [] and await ids(PostComment) == []
        assert await ids(LearningTopic) == ["t1"]         # shared catalogue untouched
        await s.close()
        await engine.dispose()

    asyncio.run(go())
