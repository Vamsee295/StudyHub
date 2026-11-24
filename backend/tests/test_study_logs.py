import asyncio
from datetime import date, datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base
from app.main import app
from app.models.learning import LearningModule, LearningSubject, LearningTopic, UserLearningProgress
from app.models.profile import Profile
from app.services import study_logs_service as svc
from app.services.study_logs_service import LogError

IST = -330   # India: getTimezoneOffset() is -330


_open = []   # sessions and engines created by _session(), closed after each test


def run(coro):
    async def wrapped():
        try:
            return await coro
        finally:
            while _open:
                session, engine = _open.pop()
                await session.close()
                await engine.dispose()
    return asyncio.run(wrapped())


async def _session():
    engine = create_async_engine("sqlite+aiosqlite://")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    s = async_sessionmaker(engine, expire_on_commit=False)()
    _open.append((s, engine))
    s.add_all([
        Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi"),
        LearningSubject(id="s1", name="Data Structures", slug="dsa"),
        LearningModule(id="m1", subject_id="s1", title="Arrays"),
        LearningTopic(id="t1", module_id="m1", title="Two Sum", slug="two-sum", estimated_minutes=15),
        LearningTopic(id="t2", module_id="m1", title="Sliding Window", slug="sliding-window", estimated_minutes=20),
    ])
    await s.commit()
    return s


async def _complete(s, user, topic, when: datetime, status="completed"):
    s.add(UserLearningProgress(id=f"{user}_{topic}", user_id=user, topic_id=topic, status=status, completed_at=when))
    await s.commit()


def test_local_day_window_uses_the_learners_time_zone():
    start, end = svc.local_day_window(date(2026, 11, 24), IST)
    assert start == datetime(2026, 11, 23, 18, 30) and end == datetime(2026, 11, 24, 18, 30)
    assert svc.local_today(IST, now=datetime(2026, 11, 23, 19, 0)) == date(2026, 11, 24)   # 00:30 IST
    with pytest.raises(LogError):
        svc.local_day_window(date(2026, 11, 24), 9999)


def test_draft_only_includes_completions_in_the_local_day():
    async def go():
        s = await _session()
        await _complete(s, "u1", "t1", datetime(2026, 11, 23, 19, 0))   # 00:30 IST on the 24th: included
        await _complete(s, "u1", "t2", datetime(2026, 11, 23, 18, 0))   # 23:30 IST on the 23rd: excluded
        d = await svc.get_draft(s, "u1", date(2026, 11, 24), IST)
        assert [l.topic_slug for l in d.lessons] == ["two-sum"] and d.minutes == 15 and d.published is None
        assert (await svc.get_draft(s, "u2", date(2026, 11, 24), IST)).lessons == []   # other users' work never leaks
    run(go())


def test_publish_update_and_unpublish():
    async def go():
        s = await _session()
        now = datetime(2026, 11, 24, 10, 0)
        await _complete(s, "u1", "t1", datetime(2026, 11, 24, 6, 0))
        log = await svc.publish(s, "u1", date(2026, 11, 24), IST, "  Finished arrays  ", now=now)
        assert log.lesson_count == 1 and log.minutes == 15 and log.note == "Finished arrays" and log.is_mine
        await _complete(s, "u1", "t2", datetime(2026, 11, 24, 8, 0))
        log = await svc.publish(s, "u1", date(2026, 11, 24), IST, None, now=now)   # republish refreshes the snapshot
        assert log.lesson_count == 2 and log.note is None
        day = await svc.logs_for_day(s, date(2026, 11, 24), viewer_id="u2")
        assert day.total == 1 and not day.logs[0].is_mine and day.logs[0].author_name == "Asha"
        assert await svc.recent_dates(s) == [{"log_date": "2026-11-24", "count": 1}]
        assert await svc.unpublish(s, "u1", date(2026, 11, 24))
        assert (await svc.logs_for_day(s, date(2026, 11, 24), None)).total == 0
        assert not await svc.unpublish(s, "u1", date(2026, 11, 24))
    run(go())


def test_publish_rules():
    async def go():
        s = await _session()
        now = datetime(2026, 11, 24, 10, 0)
        with pytest.raises(LogError) as e:   # nothing to share
            await svc.publish(s, "u1", date(2026, 11, 24), IST, "   ", now=now)
        assert e.value.status == 400
        assert (await svc.publish(s, "u1", date(2026, 11, 24), IST, "Revised notes only", now=now)).lesson_count == 0
        assert (await svc.publish(s, "u1", date(2026, 11, 23), IST, "Yesterday counts", now=now)).log_date == date(2026, 11, 23)
        for bad in (date(2026, 11, 22), date(2026, 11, 25)):   # no backfilling older days, no future days
            with pytest.raises(LogError):
                await svc.publish(s, "u1", bad, IST, "note", now=now)
    run(go())


def test_write_routes_require_auth():
    client = TestClient(app)
    assert client.get("/api/community/logs/draft").status_code in (401, 403)
    assert client.put("/api/community/logs/2026-11-24", json={"note": "x"}).status_code in (401, 403)
    assert client.delete("/api/community/logs/2026-11-24").status_code in (401, 403)
