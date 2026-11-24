import asyncio
from datetime import datetime

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base
from app.main import app
from app.models.learning import LearningModule, LearningSubject, LearningTopic, UserLearningProgress
from app.models.profile import Profile
from app.services import user_sync_service as svc
from app.services.user_sync_service import SyncError

_open = []


def run(coro):
    async def wrapped():
        try:
            return await coro
        finally:
            while _open:
                s, e = _open.pop()
                await s.close()
                await e.dispose()
    return asyncio.run(wrapped())


async def _session():
    engine = create_async_engine("sqlite+aiosqlite://")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    s = async_sessionmaker(engine, expire_on_commit=False)()
    _open.append((s, engine))
    s.add_all([Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi")])
    await s.commit()
    return s


def item(key, value, t):
    return {"key": key, "value": value, "updated_at": t}


def test_last_write_wins_per_key_and_users_are_isolated():
    async def go():
        s = await _session()
        await svc.put_items(s, "u1", [item("studyhub_lesson_bookmarks_v1", ["a"], 1000)])
        # An older write loses; the response hands back the newer server value.
        r = await svc.put_items(s, "u1", [item("studyhub_lesson_bookmarks_v1", ["stale"], 500)])
        assert r["items"][0]["value"] == ["a"] and r["items"][0]["updated_at"] == 1000
        await svc.put_items(s, "u1", [item("studyhub_lesson_bookmarks_v1", [], 2000)])   # deletions sync as newer values
        assert (await svc.get_all(s, "u1"))["items"] == [item("studyhub_lesson_bookmarks_v1", [], 2000)]
        assert (await svc.get_all(s, "u2"))["items"] == []
    run(go())


def test_key_allowlist_size_limit_and_clock_clamp():
    async def go():
        s = await _session()
        for bad in ("pathward_access_token", "studyhub:tests:../x", "studyhub:review:" + "a" * 61):
            with pytest.raises(SyncError):
                await svc.put_items(s, "u1", [item(bad, 1, 1000)])
        with pytest.raises(SyncError) as e:
            await svc.put_items(s, "u1", [item("studyhub:daily", "x" * (svc.MAX_VALUE_BYTES + 10), 1000)])
        assert e.value.status == 413
        far_future = svc.now_ms() + 10**12
        stored = (await svc.put_items(s, "u1", [item("studyhub:tests:dsa", [1], far_future)]))["items"][0]
        assert stored["updated_at"] <= svc.now_ms() + svc.MAX_CLOCK_SKEW_MS
    run(go())


def test_key_count_limit():
    async def go():
        s = await _session()
        for i in range(svc.MAX_KEYS_PER_USER):
            await svc.put_items(s, "u1", [item(f"studyhub:tests:c{i}", [], 1000)])
        with pytest.raises(SyncError):
            await svc.put_items(s, "u1", [item("studyhub:tests:one-more", [], 1000)])
        await svc.put_items(s, "u1", [item("studyhub:tests:c0", [1], 2000)])   # updating an existing key still works
    run(go())


def test_lesson_progress_is_included_by_slug():
    async def go():
        s = await _session()
        s.add_all([
            LearningSubject(id="s1", name="DSA", slug="dsa"),
            LearningModule(id="m1", subject_id="s1", title="Arrays"),
            LearningTopic(id="t1", module_id="m1", title="Two Sum", slug="two-sum-lesson"),
            UserLearningProgress(id="u1_t1", user_id="u1", topic_id="t1", status="completed", progress=100,
                                 completed_at=datetime(2026, 11, 24, 6, 0)),
        ])
        await s.commit()
        lp = (await svc.get_all(s, "u1"))["learn_progress"]
        assert lp["two-sum-lesson"]["status"] == "completed" and lp["two-sum-lesson"]["updated_at"].endswith("Z")
        assert (await svc.get_all(s, "u2"))["learn_progress"] == {}
    run(go())


def test_routes_require_auth():
    client = TestClient(app)
    assert client.get("/api/sync").status_code in (401, 403)
    assert client.put("/api/sync", json={"items": [item("studyhub:daily", {}, 1)]}).status_code in (401, 403)
