"""A first visit can send several topic/progress requests at once; none of them may 500."""
import asyncio
import sqlite3
from types import SimpleNamespace

import httpx
import pytest

from app.core.security import get_current_user
from app.main import app

TOPIC = "programming-fundamentals-pf-compiler-vs-interpreter"
USER = "race-test-user"


def _has_topic() -> bool:
    try:
        return bool(sqlite3.connect("pathward.db").execute("select 1 from learning_topics where id = ?", (TOPIC,)).fetchone())
    except sqlite3.Error:
        return False


@pytest.fixture
def first_visit():
    db = sqlite3.connect("pathward.db")
    db.execute("delete from user_learning_progress where user_id = ?", (USER,))
    db.commit()
    app.dependency_overrides[get_current_user] = lambda: SimpleNamespace(id=USER, email="race@test.local")
    yield
    app.dependency_overrides.clear()
    db.execute("delete from user_learning_progress where user_id = ?", (USER,))
    db.commit()


@pytest.mark.skipif(not _has_topic(), reason="curriculum not seeded in pathward.db")
def test_concurrent_first_visit_does_not_500(first_visit):
    async def go():
        transport = httpx.ASGITransport(app=app, raise_app_exceptions=False)
        async with httpx.AsyncClient(transport=transport, base_url="http://t") as c:
            return await asyncio.gather(
                c.get(f"/api/learn/topics/{TOPIC}"),
                c.get(f"/api/learn/topics/{TOPIC}"),
                c.post(f"/api/learn/topics/{TOPIC}/progress", json={"status": "in_progress", "progress": 40}),
                c.post(f"/api/learn/topics/{TOPIC}/progress", json={"status": "completed"}),
            )

    responses = asyncio.run(go())
    assert [r.status_code for r in responses] == [200, 200, 200, 200], [r.text[:120] for r in responses]
    rows = sqlite3.connect("pathward.db").execute(
        "select count(*) from user_learning_progress where user_id = ? and topic_id = ?", (USER, TOPIC)
    ).fetchone()[0]
    assert rows == 1
