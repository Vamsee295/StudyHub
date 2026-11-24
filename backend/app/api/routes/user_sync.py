"""
Study data sync
===============
GET /api/sync   all synced keys for the signed-in user, plus their lesson progress
PUT /api/sync   store up to 30 keys; last write wins per key by the client's change timestamp
"""
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.services import user_sync_service as svc
from app.services.user_sync_service import SyncError

router = APIRouter(prefix="/api/sync", tags=["sync"])


class SyncItem(BaseModel):
    key: str = Field(..., max_length=100)
    value: Optional[Any] = None
    updated_at: int


class SyncPut(BaseModel):
    items: List[SyncItem] = Field(..., min_length=1, max_length=30)


@router.get("")
async def get_sync(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        return await svc.get_all(session, user.id)


@router.put("")
async def put_sync(data: SyncPut, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        try:
            return await svc.put_items(session, user.id, [i.model_dump() for i in data.items])
        except SyncError as e:
            raise HTTPException(status_code=e.status, detail=e.detail)
