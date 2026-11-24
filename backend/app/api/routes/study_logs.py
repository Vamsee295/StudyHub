"""
Study With Me daily logs
========================
GET    /api/community/logs/draft?date=&tz=      your auto-filled log for a local date (signed in, private)
PUT    /api/community/logs/{date}?tz=           publish or update your log (signed in)
DELETE /api/community/logs/{date}               unpublish your log (signed in)
GET    /api/community/logs?date=                published logs for a date (public)
GET    /api/community/logs/dates                recent dates with published logs (public)
GET    /api/community/logs/users/{user_id}      one learner's published logs (public)

`tz` is JavaScript's Date.getTimezoneOffset(): minutes to add to local time to get UTC.
"""
from datetime import date
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.schemas.study_logs import LogDates, LogDay, LogDraft, LogPublish, StudyLogOut
from app.services import study_logs_service as svc
from app.services.study_logs_service import LogError

router = APIRouter(prefix="/api/community/logs", tags=["study-logs"])
_optional_bearer = HTTPBearer(auto_error=False)
TZ = Query(0, ge=-svc.MAX_TZ_OFFSET, le=svc.MAX_TZ_OFFSET)


async def optional_user(credentials: Optional[HTTPAuthorizationCredentials] = Depends(_optional_bearer)) -> Optional[Any]:
    if not credentials:
        return None
    try:
        return get_current_user(credentials)
    except Exception:
        return None


def _raise(e: LogError):
    raise HTTPException(status_code=e.status, detail=e.detail)


@router.get("/draft", response_model=LogDraft)
async def draft(date: Optional[date] = None, tz: int = TZ, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            return await svc.get_draft(session, user.id, date or svc.local_today(tz), tz)
        except LogError as e:
            _raise(e)


@router.get("/dates", response_model=LogDates)
async def dates(limit: int = Query(30, ge=1, le=90)):
    async with AsyncSessionLocal() as session:
        return LogDates(dates=await svc.recent_dates(session, limit))


@router.get("/users/{user_id}", response_model=List[StudyLogOut])
async def for_user(user_id: str, limit: int = Query(30, ge=1, le=90), viewer: Optional[Any] = Depends(optional_user)):
    async with AsyncSessionLocal() as session:
        return await svc.user_logs(session, user_id, viewer.id if viewer else None, limit)


@router.get("", response_model=LogDay)
async def for_day(date: date, limit: int = Query(20, ge=1, le=50), offset: int = Query(0, ge=0),
                  viewer: Optional[Any] = Depends(optional_user)):
    async with AsyncSessionLocal() as session:
        return await svc.logs_for_day(session, date, viewer.id if viewer else None, limit, offset)


@router.put("/{log_date}", response_model=StudyLogOut)
async def publish(log_date: date, data: LogPublish, tz: int = TZ, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            return await svc.publish(session, user.id, log_date, tz, data.note)
        except LogError as e:
            _raise(e)


@router.delete("/{log_date}")
async def unpublish(log_date: date, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        return {"deleted": await svc.unpublish(session, user.id, log_date)}
