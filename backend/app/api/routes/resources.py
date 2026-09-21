from fastapi import APIRouter, Depends, HTTPException
from typing import Any
from app.core.security import get_current_user
from app.core.database import AsyncSessionLocal
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.resource import Resource, ResourceCategory, UserResourceProgress, UserSavedResource
from app.core.config import settings
from supabase import create_client, Client

router = APIRouter(prefix="/api/resources", tags=["resources"])

class ProgressUpdate(BaseModel):
    last_page_read: int
    completion_percentage: int

def get_storage_client():
    from app.core.supabase import get_service_role_client, get_supabase_client
    if settings.supabase_service_role_key:
        return get_service_role_client()
    return get_supabase_client()

@router.get("/")
@router.get("")
async def get_resources(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Get all categories
        cat_res = await session.execute(select(ResourceCategory))
        categories = cat_res.scalars().all()
        
        # Get all resources
        res_res = await session.execute(select(Resource))
        resources = res_res.scalars().all()
        
        return {
            "categories": categories,
            "resources": resources
        }

@router.get("/history")
async def get_resource_history(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Get recently viewed
        recent_res = await session.execute(
            select(UserResourceProgress).where(UserResourceProgress.user_id == user.id)
        )
        recent_progress = recent_res.scalars().all()
        
        # Hydrate recent
        recent_hydrated = []
        for r in recent_progress:
            res_info = await session.execute(select(Resource).where(Resource.id == r.resource_id))
            resource = res_res = res_info.scalars().first()
            if resource:
                recent_hydrated.append({
                    "id": r.resource_id,
                    "title": resource.title,
                    "track": resource.category_id,
                    "typeBadge": resource.file_type.upper(),
                    "unitProgress": f"Page {r.last_page_read} of {resource.page_count}",
                    "percentage": r.completion_percentage,
                    "timeEstimate": "Continue",
                    "href": f"/resources/{r.resource_id}",
                    "last_page_read": r.last_page_read,
                    "updated_at": r.updated_at
                })
        
        # Get saved resources
        saved_res = await session.execute(
            select(UserSavedResource).where(UserSavedResource.user_id == user.id)
        )
        saved_resources = saved_res.scalars().all()
        
        # Hydrate saved
        saved_hydrated = []
        for s in saved_resources:
            res_info = await session.execute(select(Resource).where(Resource.id == s.resource_id))
            resource = res_info.scalars().first()
            if resource:
                saved_hydrated.append({
                    "id": s.resource_id,
                    "title": resource.title,
                    "topic": resource.category_id,
                    "type": resource.file_type.upper(),
                    "savedAt": str(s.saved_at.date()),
                    "iconName": "book",
                    "href": f"/resources/{s.resource_id}"
                })
        
        return {
            "recent": recent_hydrated,
            "saved": saved_hydrated
        }

@router.post("/{resource_id}/save")
async def toggle_save_resource(resource_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Check if resource exists
        res = await session.execute(select(Resource).where(Resource.id == resource_id))
        if not res.scalars().first():
            raise HTTPException(status_code=404, detail="Resource not found")
            
        # Check if already saved
        saved = await session.execute(
            select(UserSavedResource)
            .where(UserSavedResource.user_id == user.id)
            .where(UserSavedResource.resource_id == resource_id)
        )
        existing = saved.scalars().first()
        
        if existing:
            # Unsave
            await session.delete(existing)
            status = "unsaved"
        else:
            # Save
            new_save = UserSavedResource(user_id=user.id, resource_id=resource_id)
            session.add(new_save)
            status = "saved"
            
        await session.commit()
        return {"status": status}

@router.post("/{resource_id}/progress")
async def update_resource_progress(resource_id: str, progress: ProgressUpdate, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Check if resource exists
        res = await session.execute(select(Resource).where(Resource.id == resource_id))
        if not res.scalars().first():
            raise HTTPException(status_code=404, detail="Resource not found")
            
        # Update or create progress
        prog_res = await session.execute(
            select(UserResourceProgress)
            .where(UserResourceProgress.user_id == user.id)
            .where(UserResourceProgress.resource_id == resource_id)
        )
        existing = prog_res.scalars().first()
        
        if existing:
            existing.last_page_read = progress.last_page_read
            existing.completion_percentage = progress.completion_percentage
        else:
            new_prog = UserResourceProgress(
                user_id=user.id,
                resource_id=resource_id,
                last_page_read=progress.last_page_read,
                completion_percentage=progress.completion_percentage
            )
            session.add(new_prog)
            
        await session.commit()
        return {"status": "success"}

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
