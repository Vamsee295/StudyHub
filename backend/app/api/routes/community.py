"""
Community API Routes — Study With Me
=====================================
GET  /api/community/feed
POST /api/community/posts
POST /api/community/posts/{post_id}/like
DELETE /api/community/posts/{post_id}/like
GET  /api/community/posts/{post_id}/comments
POST /api/community/posts/{post_id}/comments
DELETE /api/community/comments/{comment_id}
POST /api/community/users/{user_id}/follow
DELETE /api/community/users/{user_id}/follow
POST /api/community/activities      (internal: called by learn/practice services)
GET  /api/community/stats
"""

from fastapi import APIRouter, Depends, HTTPException, Query, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Any, Optional
from app.core.security import get_current_user
from app.core.database import AsyncSessionLocal
from app.schemas.community import (
    CommunityPostCreate, CommunityPostOut,
    PostCommentCreate, PostCommentOut,
    LearningActivityCreate, LearningActivityOut,
    FeedResponse, CommunityStats,
)
from app.services import community_service

router = APIRouter(prefix="/api/community", tags=["community"])

_optional_bearer = HTTPBearer(auto_error=False)

async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(_optional_bearer),
) -> Optional[Any]:
    """Returns the user if a valid token is provided, otherwise None."""
    if not credentials:
        return None
    try:
        return get_current_user(credentials)
    except Exception:
        return None


# ---------------------------------------------------------------------------
# Feed
# ---------------------------------------------------------------------------

@router.get("/feed", response_model=FeedResponse)
async def get_feed(
    filter: str = Query("all"),
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
    user: Optional[Any] = Depends(get_optional_user),
):
    async with AsyncSessionLocal() as session:
        return await community_service.get_feed(
            session=session,
            current_user_id=user.id if user else None,
            filter_by=filter,
            limit=limit,
            offset=offset,
        )


@router.get("/feed/public", response_model=FeedResponse)
async def get_public_feed(
    filter: str = Query("all"),
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
):
    """Public feed — no authentication required."""
    async with AsyncSessionLocal() as session:
        return await community_service.get_feed(
            session=session,
            current_user_id=None,
            filter_by=filter,
            limit=limit,
            offset=offset,
        )


# ---------------------------------------------------------------------------
# Posts
# ---------------------------------------------------------------------------

@router.post("/posts", response_model=CommunityPostOut, status_code=201)
async def create_post(
    data: CommunityPostCreate,
    user: Any = Depends(get_current_user),
):
    async with AsyncSessionLocal() as session:
        try:
            return await community_service.create_post(session, user.id, data)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------------------------
# Likes
# ---------------------------------------------------------------------------

@router.post("/posts/{post_id}/like")
async def like_post(post_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            now_liked, like_count = await community_service.toggle_like(session, post_id, user.id)
            return {"liked": now_liked, "like_count": like_count}
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@router.delete("/posts/{post_id}/like")
async def unlike_post(post_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            now_liked, like_count = await community_service.toggle_like(session, post_id, user.id)
            return {"liked": now_liked, "like_count": like_count}
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


# ---------------------------------------------------------------------------
# Comments
# ---------------------------------------------------------------------------

@router.get("/posts/{post_id}/comments", response_model=list[PostCommentOut])
async def get_comments(
    post_id: str,
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: Any = Depends(get_current_user),
):
    async with AsyncSessionLocal() as session:
        return await community_service.get_comments(session, post_id, limit, offset)


@router.post("/posts/{post_id}/comments", response_model=PostCommentOut, status_code=201)
async def create_comment(
    post_id: str,
    data: PostCommentCreate,
    user: Any = Depends(get_current_user),
):
    async with AsyncSessionLocal() as session:
        try:
            return await community_service.create_comment(session, post_id, user.id, data)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))


@router.delete("/comments/{comment_id}", status_code=204)
async def delete_comment(comment_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            await community_service.delete_comment(session, comment_id, user.id)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
        except PermissionError as e:
            raise HTTPException(status_code=403, detail=str(e))


# ---------------------------------------------------------------------------
# Follows
# ---------------------------------------------------------------------------

@router.post("/users/{user_id}/follow")
async def follow_user(user_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            now_following, message = await community_service.toggle_follow(session, user.id, user_id)
            return {"following": now_following, "message": message}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))


@router.delete("/users/{user_id}/follow")
async def unfollow_user(user_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            now_following, message = await community_service.toggle_follow(session, user.id, user_id)
            return {"following": now_following, "message": message}
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------------------------
# Activity Logging (internal — called by learn/practice flow)
# ---------------------------------------------------------------------------

@router.post("/activities", response_model=LearningActivityOut, status_code=201)
async def log_activity(
    data: LearningActivityCreate,
    user: Any = Depends(get_current_user),
):
    async with AsyncSessionLocal() as session:
        try:
            activity = await community_service.log_activity(session, user.id, data)
            return LearningActivityOut(
                id=activity.id,
                user_id=activity.user_id,
                activity_type=activity.activity_type,
                title=activity.title,
                description=activity.description,
                subject_slug=activity.subject_slug,
                topic_slug=activity.topic_slug,
                problem_id=activity.problem_id,
                resource_id=activity.resource_id,
                roadmap_id=activity.roadmap_id,
                tags=activity.tags,
                visibility=activity.visibility,
                created_at=activity.created_at,
            )
        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))


# ---------------------------------------------------------------------------
# Stats
# ---------------------------------------------------------------------------

@router.get("/stats", response_model=CommunityStats)
async def get_stats():
    async with AsyncSessionLocal() as session:
        return await community_service.get_stats(session)
