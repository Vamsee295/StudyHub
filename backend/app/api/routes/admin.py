"""
Admin API: moderation of the Community board. Admins only (require_admin); everyone else gets a 404.
Accounts, reports and the audit log live in Supabase (backend/supabase/admin.sql); this covers the
data that lives in the backend database.

GET    /api/admin/stats                       posts, replies and learners
GET    /api/admin/posts?q=&limit=&offset=     every post, newest first, including other people's
GET    /api/admin/content/{kind}/{id}         one post or reply, for reviewing a report
DELETE /api/admin/posts/{post_id}             delete any post
DELETE /api/admin/comments/{comment_id}       delete any reply
"""

from datetime import datetime, timedelta
from typing import Any, Literal

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload

from app.core.database import AsyncSessionLocal
from app.core.security import require_admin
from app.models.community import CommunityPost, LearningActivity, PostComment
from app.models.profile import Profile
from app.services import community_service

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/stats")
async def stats(_: Any = Depends(require_admin)):
    week_ago = datetime.utcnow() - timedelta(days=7)
    async with AsyncSessionLocal() as s:
        count = lambda stmt: s.scalar(stmt)  # noqa: E731
        return {
            "posts": await count(select(func.count(CommunityPost.id))),
            "posts_7d": await count(select(func.count(CommunityPost.id)).where(CommunityPost.created_at > week_ago)),
            "replies": await count(select(func.count(PostComment.id))),
            "learners": await count(select(func.count(Profile.id))),
            "active_learners_7d": await count(
                select(func.count(func.distinct(LearningActivity.user_id))).where(LearningActivity.created_at > week_ago)
            ),
        }


@router.get("/posts")
async def posts(
    q: str = Query("", max_length=100),
    limit: int = Query(25, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: Any = Depends(require_admin),
):
    async with AsyncSessionLocal() as s:
        # load each post's activity up front, as the feed does (async sessions can't lazy-load)
        stmt = select(CommunityPost).options(selectinload(CommunityPost.activity)).order_by(CommunityPost.created_at.desc()).limit(limit).offset(offset)
        if q.strip():
            stmt = stmt.where(CommunityPost.content.ilike(f"%{q.strip()}%"))
        rows = list((await s.execute(stmt)).scalars())
        return await community_service._posts_out(s, rows, user.id)


@router.get("/content/{kind}/{item_id}")
async def content(kind: Literal["post", "comment"], item_id: str, _: Any = Depends(require_admin)):
    async with AsyncSessionLocal() as s:
        model = CommunityPost if kind == "post" else PostComment
        item = await s.get(model, item_id)
        if not item:
            return {"exists": False}
        author = await s.get(Profile, item.user_id)
        return {
            "exists": True,
            "kind": kind,
            "id": item.id,
            "post_id": item.id if kind == "post" else item.post_id,
            "content": item.content,
            "created_at": item.created_at,
            "author": {"id": item.user_id, "full_name": author.full_name if author else "Unknown"},
        }


@router.delete("/posts/{post_id}", status_code=204)
async def delete_post(post_id: str, user: Any = Depends(require_admin)):
    async with AsyncSessionLocal() as s:
        try:
            await community_service.delete_post(s, post_id, user.id, as_admin=True)
        except ValueError:
            raise HTTPException(status_code=404, detail="Post not found")


@router.delete("/comments/{comment_id}", status_code=204)
async def delete_comment(comment_id: str, user: Any = Depends(require_admin)):
    async with AsyncSessionLocal() as s:
        try:
            await community_service.delete_comment(s, comment_id, user.id, as_admin=True)
        except ValueError:
            raise HTTPException(status_code=404, detail="Reply not found")
