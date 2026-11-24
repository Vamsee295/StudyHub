"""
Ideas board API
===============
GET    /api/ideas                     list (public; marks your votes when signed in)
POST   /api/ideas                     create (signed in, max 5 a day)
POST   /api/ideas/{idea_id}/vote      upvote (signed in)
DELETE /api/ideas/{idea_id}/vote      remove upvote (signed in)
PATCH  /api/ideas/{idea_id}/status    change status (admins listed in ADMIN_EMAILS)
DELETE /api/ideas/{idea_id}           delete (author while open, or admin); returns {"deleted": true}
"""
from typing import Any, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.schemas.ideas import IdeaCreate, IdeaList, IdeaOut, IdeaStatusUpdate
from app.services import ideas_service
from app.services.ideas_service import IdeaError

router = APIRouter(prefix="/api/ideas", tags=["ideas"])
_optional_bearer = HTTPBearer(auto_error=False)


async def optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(_optional_bearer)) -> Optional[Any]:
    if not credentials:
        return None
    try:
        return get_current_user(credentials)
    except Exception:
        return None


def is_admin(user: Optional[Any]) -> bool:
    emails = {e.strip().lower() for e in settings.admin_emails.split(",") if e.strip()}
    email = (getattr(user, "email", None) or "").lower()
    return bool(user and email and email in emails)


def _raise(e: IdeaError):
    raise HTTPException(status_code=e.status, detail=e.detail)


@router.get("", response_model=IdeaList)
async def list_ideas(
    status: Literal["active", "all", "open", "planned", "in_progress", "shipped", "declined"] = "active",
    sort: Literal["top", "new"] = "top",
    q: str = Query("", max_length=100),
    limit: int = Query(20, ge=1, le=50),
    offset: int = Query(0, ge=0),
    user: Optional[Any] = Depends(optional_user),
):
    async with AsyncSessionLocal() as session:
        return await ideas_service.list_ideas(session, user.id if user else None, status, sort, q, limit, offset, is_admin(user))


@router.post("", response_model=IdeaOut, status_code=201)
async def create_idea(data: IdeaCreate, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            return await ideas_service.create_idea(session, user.id, data)
        except IdeaError as e:
            _raise(e)


@router.post("/{idea_id}/vote")
async def vote(idea_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            return await ideas_service.set_vote(session, idea_id, user.id, True)
        except IdeaError as e:
            _raise(e)


@router.delete("/{idea_id}/vote")
async def unvote(idea_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            return await ideas_service.set_vote(session, idea_id, user.id, False)
        except IdeaError as e:
            _raise(e)


@router.patch("/{idea_id}/status", response_model=IdeaOut)
async def update_status(idea_id: str, data: IdeaStatusUpdate, user: Any = Depends(get_current_user)):
    if not is_admin(user):
        raise HTTPException(status_code=403, detail="Only admins can change an idea's status")
    async with AsyncSessionLocal() as session:
        try:
            return await ideas_service.update_status(session, idea_id, data)
        except IdeaError as e:
            _raise(e)


@router.delete("/{idea_id}")
async def delete_idea(idea_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            await ideas_service.delete_idea(session, idea_id, user.id, is_admin(user))
        except IdeaError as e:
            _raise(e)
    return {"deleted": True}   # JSON body: the frontend client always parses responses
