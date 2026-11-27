import asyncio
from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine

from app.core import security
from app.core.database import Base
from app.models.profile import Profile
from app.schemas.community import CommunityPostCreate, PostCommentCreate
from app.services import community_service as svc


def user(role=None, banned_until=None):
    return SimpleNamespace(id="u", email="x@y.z", app_metadata={"role": role} if role else {}, banned_until=banned_until)


def test_only_admins_pass_and_others_get_404():
    assert security.require_admin(user("admin")).id == "u"
    for u in (user(), user("student"), SimpleNamespace(id="u")):
        with pytest.raises(HTTPException) as e:
            security.require_admin(u)
        assert e.value.status_code == 404


def test_suspended_accounts_are_refused(monkeypatch):
    later = (datetime.now(timezone.utc) + timedelta(days=1)).isoformat()
    earlier = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat()
    assert security._is_suspended(user(banned_until=later))
    assert not security._is_suspended(user(banned_until=earlier))
    assert not security._is_suspended(user())

    monkeypatch.setattr(security, "_verify", lambda token: user(banned_until=later))
    with pytest.raises(HTTPException) as e:
        security.get_current_user(SimpleNamespace(credentials="t"))
    assert e.value.status_code == 403


def test_admins_can_delete_anyones_post_and_reply(monkeypatch):
    monkeypatch.setattr(svc.notify_service, "notify", lambda *a: None)

    async def go():
        engine = create_async_engine("sqlite+aiosqlite://")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        s = async_sessionmaker(engine, expire_on_commit=False)()
        s.add_all([Profile(id="u1", full_name="Asha"), Profile(id="u2", full_name="Ravi")])
        await s.commit()
        post = await svc.create_post(s, "u1", CommunityPostCreate(content="spam spam"))
        reply = await svc.create_comment(s, post.id, "u1", PostCommentCreate(content="more spam"))

        with pytest.raises(PermissionError):   # a learner still can't delete someone else's
            await svc.delete_comment(s, reply.id, "u2")
        await svc.delete_comment(s, reply.id, "u2", as_admin=True)
        with pytest.raises(PermissionError):
            await svc.delete_post(s, post.id, "u2")
        await svc.delete_post(s, post.id, "u2", as_admin=True)
        assert await svc.get_post(s, post.id, None) is None
        await s.close()
        await engine.dispose()

    asyncio.run(go())


def test_admin_post_list_loads(monkeypatch):
    """The admin list serialises posts in an async session, so related rows must be preloaded."""
    from app.api.routes import admin as admin_routes
    monkeypatch.setattr(svc.notify_service, "notify", lambda *a: None)

    async def go():
        engine = create_async_engine("sqlite+aiosqlite://")
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        maker = async_sessionmaker(engine, expire_on_commit=False)
        s = maker()
        s.add(Profile(id="u1", full_name="Asha"))
        await s.commit()
        await svc.create_post(s, "u1", CommunityPostCreate(content="hello board"))
        await s.close()
        monkeypatch.setattr(admin_routes, "AsyncSessionLocal", maker)
        rows = await admin_routes.posts(q="hello", limit=25, offset=0, user=SimpleNamespace(id="admin"))
        assert [r.content for r in rows] == ["hello board"]
        await s.close()
        await engine.dispose()

    asyncio.run(go())
