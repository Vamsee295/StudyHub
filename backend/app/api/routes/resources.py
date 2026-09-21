from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.core.security import get_current_user
from app.core.database import AsyncSessionLocal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.resource import Resource
from app.core.config import settings
from supabase import create_client, Client

router = APIRouter(prefix="/api/resources", tags=["resources"])

def get_storage_client():
    from app.core.supabase import get_service_role_client, get_supabase_client
    if settings.supabase_service_role_key:
        return get_service_role_client()
    return get_supabase_client()

@router.get("/{resource_id}")
async def get_resource(resource_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Resource).where(Resource.id == resource_id))
        resource = result.scalars().first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
            
        return {
            "id": resource.id,
            "title": resource.title,
            "subject": resource.subject,
            "file_type": resource.file_type,
            "page_count": resource.page_count
        }

@router.get("/{resource_id}/url")
async def get_resource_url(resource_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Resource).where(Resource.id == resource_id))
        resource = result.scalars().first()
        if not resource:
            raise HTTPException(status_code=404, detail="Resource not found")
            
        if not resource.file_path:
            raise HTTPException(status_code=404, detail="Resource has no file path")
            
        try:
            client = get_storage_client()
            # Generate a signed URL valid for 3600 seconds (1 hour)
            res = client.storage.from_("resources").create_signed_url(resource.file_path, 3600)
            return {"url": res.get("signedURL") or res.get("signedUrl") or ""}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate secure URL: {str(e)}")
