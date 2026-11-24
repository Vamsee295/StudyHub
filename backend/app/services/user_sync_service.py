"""
Per-user sync of study data that previously lived only in localStorage.

The server stores each allow-listed key as an opaque JSON value with the client's change
timestamp and applies last-write-wins. Merging (for append-only data such as test history)
happens on the client, which pulls, merges, and pushes the merged result.
"""
import json
import re
import time
from datetime import datetime
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learning import LearningTopic, UserLearningProgress
from app.models.user_sync import UserSyncData

ALLOWED_KEY = re.compile(
    r"^(studyhub:daily"
    r"|studyhub:tests:[a-z0-9-]{1,60}"
    r"|studyhub:review:[a-z0-9-]{1,60}"
    r"|studyhub_lesson_bookmarks_v1"
    r"|studyhub_star_stories_v1"
    r"|studyhub_readiness_subjects_v1"
    r"|studyhub_recent_tools_v1)$"
)
MAX_VALUE_BYTES = 200_000
MAX_KEYS_PER_USER = 60
MAX_CLOCK_SKEW_MS = 5 * 60_000


class SyncError(Exception):
    def __init__(self, status: int, detail: str):
        self.status, self.detail = status, detail


def now_ms() -> int:
    return int(time.time() * 1000)


def validate_item(key: str, value, updated_at: int) -> int:
    if not ALLOWED_KEY.match(key):
        raise SyncError(400, f"Key not allowed: {key}")
    if len(json.dumps(value, separators=(",", ":"))) > MAX_VALUE_BYTES:
        raise SyncError(413, f"Value too large for {key}")
    if updated_at <= 0:
        raise SyncError(400, "updated_at must be a positive millisecond timestamp")
    # A client clock far in the future would win every later conflict, so clamp it.
    return min(updated_at, now_ms() + MAX_CLOCK_SKEW_MS)


def _item(row: UserSyncData) -> dict:
    return {"key": row.key, "value": row.value, "updated_at": row.updated_at}


async def get_all(session: AsyncSession, user_id: str) -> dict:
    rows = (await session.execute(select(UserSyncData).where(UserSyncData.user_id == user_id))).scalars().all()
    progress = (await session.execute(
        select(LearningTopic.slug, LearningTopic.id, UserLearningProgress.status, UserLearningProgress.progress,
               UserLearningProgress.updated_at, UserLearningProgress.completed_at)
        .join(LearningTopic, LearningTopic.id == UserLearningProgress.topic_id)
        .where(UserLearningProgress.user_id == user_id)
    )).all()
    learn = {}
    for slug, tid, status, prog, updated, completed in progress:
        stamp = updated or completed
        learn[slug or tid] = {"status": status or "not_started", "progress": prog or 0,
                              "updated_at": stamp.isoformat() + "Z" if stamp else None}
    return {"items": [_item(r) for r in rows], "learn_progress": learn, "server_time": now_ms()}


async def put_items(session: AsyncSession, user_id: str, items: list[dict]) -> dict:
    """Stores each item unless the server already has a newer change for that key.
    Returns the server's resulting state for every submitted key, so the client can adopt
    any newer value it lost to."""
    existing = {r.key: r for r in (await session.execute(
        select(UserSyncData).where(UserSyncData.user_id == user_id, UserSyncData.key.in_([i["key"] for i in items]))
    )).scalars().all()}
    count = (await session.execute(select(func.count()).select_from(UserSyncData).where(UserSyncData.user_id == user_id))).scalar_one()

    results = []
    for it in items:
        stamp = validate_item(it["key"], it.get("value"), it["updated_at"])
        row = existing.get(it["key"])
        if row is None:
            if count >= MAX_KEYS_PER_USER:
                raise SyncError(413, "Too many synced keys")
            row = UserSyncData(user_id=user_id, key=it["key"], value=it.get("value"), updated_at=stamp)
            session.add(row)
            existing[it["key"]] = row
            count += 1
        elif stamp >= row.updated_at:
            row.value = it.get("value")
            row.updated_at = stamp
            row.server_updated_at = datetime.utcnow()
        results.append(row)
    await session.commit()
    return {"items": [_item(r) for r in results]}
