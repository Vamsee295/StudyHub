import asyncio
from datetime import datetime, timedelta

import pytest
from fastapi.testclient import TestClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core.database import Base
from app.main import app
from app.models.profile import Profile
from app.schemas.ideas import IdeaCreate, IdeaStatusUpdate
from app.services import ideas_service as svc
from app.services.ideas_service import IdeaError


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
    session = async_sessionmaker(engine, expire_on_commit=False)()
    _open.append((session, engine))
    session.add_all([Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi")])
    await session.commit()
    return session


def test_author_auto_votes_and_votes_are_counted_once():
    async def go():
        s = await _session()
        idea = await svc.create_idea(s, "u1", IdeaCreate(title="Add a dark mode toggle", category="tools"))
        assert idea.vote_count == 1 and idea.has_voted and idea.is_mine
        assert (await svc.set_vote(s, idea.id, "u2", True))["vote_count"] == 2
        assert (await svc.set_vote(s, idea.id, "u2", True))["vote_count"] == 2   # idempotent
        assert (await svc.set_vote(s, idea.id, "u2", False))["vote_count"] == 1
        listing = await svc.list_ideas(s, "u2")
        assert listing.total == 1 and not listing.items[0].has_voted and not listing.items[0].is_mine
    run(go())


def test_daily_limit_and_duplicate_titles():
    async def go():
        s = await _session()
        now = datetime.utcnow()
        for i in range(svc.MAX_IDEAS_PER_DAY):
            await svc.create_idea(s, "u1", IdeaCreate(title=f"Feature request number {i}"), now=now)
        with pytest.raises(IdeaError) as e:
            await svc.create_idea(s, "u1", IdeaCreate(title="One more feature idea"), now=now)
        assert e.value.status == 429
        # The limit resets after a day.
        await svc.create_idea(s, "u1", IdeaCreate(title="Tomorrow's feature idea"), now=now + timedelta(days=1, seconds=1))
        with pytest.raises(IdeaError) as e:
            await svc.create_idea(s, "u2", IdeaCreate(title="FEATURE REQUEST NUMBER 0"))
        assert e.value.status == 409
    run(go())


def test_sorting_filters_and_status_counts():
    async def go():
        s = await _session()
        a = await svc.create_idea(s, "u1", IdeaCreate(title="Offline lesson downloads"))
        b = await svc.create_idea(s, "u2", IdeaCreate(title="Hindi translations of notes"))
        await svc.set_vote(s, b.id, "u1", True)
        top = await svc.list_ideas(s, None, sort="top")
        assert [i.id for i in top.items] == [b.id, a.id]
        await svc.update_status(s, b.id, IdeaStatusUpdate(status="shipped", status_note="Live now"))
        active = await svc.list_ideas(s, None)
        assert [i.id for i in active.items] == [a.id]
        shipped = await svc.list_ideas(s, None, status="shipped")
        assert shipped.items[0].status_note == "Live now" and shipped.counts == {"open": 1, "shipped": 1}
        assert (await svc.list_ideas(s, None, status="all", q="hindi")).total == 1
    run(go())


def test_delete_rules():
    async def go():
        s = await _session()
        idea = await svc.create_idea(s, "u1", IdeaCreate(title="Weekly progress email"))
        with pytest.raises(IdeaError) as e:
            await svc.delete_idea(s, idea.id, "u2", is_admin=False)
        assert e.value.status == 403
        await svc.update_status(s, idea.id, IdeaStatusUpdate(status="planned"))
        with pytest.raises(IdeaError) as e:
            await svc.delete_idea(s, idea.id, "u1", is_admin=False)
        assert e.value.status == 409
        await svc.delete_idea(s, idea.id, "u2", is_admin=True)
        assert (await svc.list_ideas(s, None, status="all")).total == 0
    run(go())


def test_write_routes_require_auth():
    client = TestClient(app)
    assert client.post("/api/ideas", json={"title": "A new idea here"}).status_code in (401, 403)
    assert client.post("/api/ideas/x/vote").status_code in (401, 403)
    assert client.patch("/api/ideas/x/status", json={"status": "planned"}).status_code in (401, 403)
    assert client.delete("/api/ideas/x").status_code in (401, 403)


def test_title_validation():
    with pytest.raises(Exception):
        IdeaCreate(title="short")
