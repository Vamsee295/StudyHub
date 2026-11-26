"""
Notifications to *other* learners (someone liked or replied to your post).

The bell reads the Supabase `notifications` table, whose row-level security lets a user create
notifications only for themselves. Notifying someone else is therefore done here, on the server,
which knows the like or reply is real, using the service-role key. Without that key this does
nothing (and logs once), so the community features keep working.

Sending happens in the background so a slow Supabase never slows down liking or replying.
"""
import asyncio
import logging
from typing import Optional, Set

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)
_tasks: Set[asyncio.Task] = set()   # keep references so background sends aren't garbage-collected
_warned = False


def _configured() -> bool:
    global _warned
    if settings.supabase_url and settings.supabase_service_role_key:
        return True
    if not _warned:
        logger.info("SUPABASE_SERVICE_ROLE_KEY not set: like/reply notifications are off")
        _warned = True
    return False


async def _post(user_id: str, type_: str, title: str, message: str, link: Optional[str]) -> None:
    key = settings.supabase_service_role_key
    base = f"{settings.supabase_url.rstrip('/')}/rest/v1/notifications"
    headers = {"apikey": key, "Authorization": f"Bearer {key}", "Content-Type": "application/json"}
    async with httpx.AsyncClient(timeout=8) as client:
        # one unread "X liked your post" is enough: liking, unliking and liking again doesn't stack up
        existing = await client.get(base, headers=headers, params={
            "select": "id", "user_id": f"eq.{user_id}", "type": f"eq.{type_}", "message": f"eq.{message}",
            "read": "eq.false", "limit": "1",
        })
        existing.raise_for_status()
        if existing.json():
            return
        r = await client.post(base, headers=headers, json={
            "user_id": user_id, "type": type_, "title": title, "message": message, "link": link,
        })
        r.raise_for_status()


async def _send(*args) -> None:
    try:
        await _post(*args)
    except Exception as e:  # a lost notification must never break the action that caused it
        logger.warning("Couldn't send notification: %s", e)


def notify(user_id: str, type_: str, title: str, message: str, link: Optional[str] = None) -> None:
    """Queue a notification for `user_id`. Returns at once."""
    if not _configured():
        return
    task = asyncio.get_running_loop().create_task(_send(user_id, type_, title, message, link))
    _tasks.add(task)
    task.add_done_callback(_tasks.discard)
