from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List, Dict, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from pydantic import BaseModel
from datetime import datetime
import uuid

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.models.learning import LearningSubject, LearningModule, LearningTopic, UserLearningProgress
from app.models.roadmap import UserDsaProblemProgress, UserRoadmapItemProgress

router = APIRouter(prefix="/api/roadmaps", tags=["roadmaps"])

@router.get("/")
@router.get("")
async def get_roadmap_progress(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Fetch all subjects in order
        result = await session.execute(
            select(LearningSubject).order_by(LearningSubject.display_order)
        )
        subjects = result.scalars().all()
        
        roadmap_data = []
        previous_completed = True  # The first subject is unlocked by default
        
        for subject in subjects:
            topics_query = await session.execute(
                select(LearningTopic.id)
                .join(LearningModule, LearningTopic.module_id == LearningModule.id)
                .where(LearningModule.subject_id == subject.id)
            )
            topic_ids = [t_id for t_id, in topics_query.all()]
            
            total_topics = len(topic_ids)
            completed_topics = 0
            in_progress_count = 0
            
            if total_topics > 0:
                progress_query = await session.execute(
                    select(UserLearningProgress)
                    .where(
                        UserLearningProgress.user_id == user.id,
                        UserLearningProgress.topic_id.in_(topic_ids)
                    )
                )
                progress_records = progress_query.scalars().all()
                completed_topics = sum(1 for p in progress_records if p.status == "completed")
                in_progress_count = sum(1 for p in progress_records if p.status == "in_progress")
                
            progress_pct = int((completed_topics / total_topics) * 100) if total_topics > 0 else 0
            
            # Determine status
            status = "upcoming"
            statusText = "Upcoming"
            
            if progress_pct == 100 and total_topics > 0:
                status = "completed"
                statusText = "Completed"
            elif progress_pct > 0 or in_progress_count > 0 or previous_completed:
                status = "in-progress"
                statusText = f"In progress ({progress_pct}%)"
            else:
                status = "upcoming"
                statusText = "Upcoming milestone"
                
            # If this module is not 100% completed, then the next module is locked (upcoming)
            # unless the current module has 0 topics (edge case)
            if progress_pct < 100 and total_topics > 0:
                previous_completed = False
            else:
                previous_completed = True
                
            roadmap_data.append({
                "slug": subject.slug,
                "progressPct": progress_pct,
                "status": status,
                "statusText": statusText
            })
            
        return {"roadmaps": roadmap_data}

class DsaProblemStatusUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

@router.get("/dsa")
async def get_dsa_roadmap(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        query = await session.execute(
            select(UserDsaProblemProgress).where(UserDsaProblemProgress.user_id == user.id)
        )
        records = query.scalars().all()
        
        solved_ids = [r.problem_id for r in records if r.status == "solved"]
        attempted_ids = [r.problem_id for r in records if r.status == "attempted"]
        
        return {
            "solved_ids": solved_ids,
            "attempted_ids": attempted_ids,
            "total_solved": len(solved_ids),
            "total_attempted": len(attempted_ids)
        }

@router.get("/dsa/progress")
async def get_dsa_progress(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        query = await session.execute(
            select(UserDsaProblemProgress).where(UserDsaProblemProgress.user_id == user.id)
        )
        records = query.scalars().all()
        
        progress_dict = {}
        solved_ids = []
        attempted_ids = []
        
        for r in records:
            progress_dict[r.problem_id] = {
                "status": r.status,
                "notes": r.notes,
                "attempts": r.attempts,
                "solved_at": r.solved_at.isoformat() if r.solved_at else None,
                "attempted_at": r.attempted_at.isoformat() if r.attempted_at else None
            }
            if r.status == "solved":
                solved_ids.append(r.problem_id)
            elif r.status == "attempted":
                attempted_ids.append(r.problem_id)
                
        return {
            "progress": progress_dict,
            "stats": {
                "total_solved": len(solved_ids),
                "total_attempted": len(attempted_ids),
                "solved_ids": solved_ids,
                "attempted_ids": attempted_ids
            }
        }

@router.patch("/dsa/problems/{problem_id}")
async def update_dsa_problem_progress(
    problem_id: int, 
    update: DsaProblemStatusUpdate, 
    user: Any = Depends(get_current_user)
):
    if update.status is not None and update.status not in ["not_started", "attempted", "solved"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    async with AsyncSessionLocal() as session:
        query = await session.execute(
            select(UserDsaProblemProgress).where(
                UserDsaProblemProgress.user_id == user.id,
                UserDsaProblemProgress.problem_id == problem_id
            )
        )
        record = query.scalars().first()
        
        if record:
            if update.status is not None and update.status != record.status:
                record.status = update.status
                if update.status in ["attempted", "solved"]:
                    record.attempts += 1
                if update.status == "solved" and not record.solved_at:
                    record.solved_at = datetime.utcnow()
                elif update.status == "attempted":
                    record.attempted_at = datetime.utcnow()
                    
            if update.notes is not None:
                record.notes = update.notes
                
        else:
            record = UserDsaProblemProgress(
                id=str(uuid.uuid4()),
                user_id=user.id,
                problem_id=problem_id,
                status=update.status if update.status else "not_started",
                notes=update.notes,
                attempts=1 if update.status in ["attempted", "solved"] else 0,
                solved_at=datetime.utcnow() if update.status == "solved" else None,
                attempted_at=datetime.utcnow() if update.status == "attempted" else None,
            )
            session.add(record)
            
        await session.commit()
        
        # Return recalculated stats
        stats_query = await session.execute(
            select(UserDsaProblemProgress).where(UserDsaProblemProgress.user_id == user.id)
        )
        all_records = stats_query.scalars().all()
        solved_ids = [r.problem_id for r in all_records if r.status == "solved"]
        attempted_ids = [r.problem_id for r in all_records if r.status == "attempted"]
        
        return {
            "success": True,
            "problem_id": problem_id,
            "progress": {
                "status": record.status,
                "notes": record.notes,
                "attempts": record.attempts,
                "solved_at": record.solved_at.isoformat() if record.solved_at else None,
                "attempted_at": record.attempted_at.isoformat() if record.attempted_at else None
            },
            "stats": {
                "total_solved": len(solved_ids),
                "total_attempted": len(attempted_ids),
                "solved_ids": solved_ids,
                "attempted_ids": attempted_ids
            }
        }

class RoadmapItemStatusUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

@router.get("/{roadmap_slug}/progress")
async def get_roadmap_item_progress(roadmap_slug: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        query = await session.execute(
            select(UserRoadmapItemProgress).where(
                UserRoadmapItemProgress.user_id == user.id,
                UserRoadmapItemProgress.roadmap_slug == roadmap_slug
            )
        )
        records = query.scalars().all()
        
        progress_dict = {}
        solved_ids = []
        attempted_ids = []
        
        for r in records:
            progress_dict[r.item_id] = {
                "status": r.status,
                "notes": r.notes,
                "attempts": r.attempts,
                "solved_at": r.solved_at.isoformat() if r.solved_at else None,
                "attempted_at": r.attempted_at.isoformat() if r.attempted_at else None
            }
            if r.status in ["solved", "completed"]:
                solved_ids.append(r.item_id)
            elif r.status == "attempted":
                attempted_ids.append(r.item_id)
                
        return {
            "progress": progress_dict,
            "stats": {
                "total_solved": len(solved_ids),
                "total_attempted": len(attempted_ids),
                "solved_ids": solved_ids,
                "attempted_ids": attempted_ids
            }
        }

@router.patch("/{roadmap_slug}/items/{item_id}")
async def update_roadmap_item_progress(
    roadmap_slug: str,
    item_id: str, 
    update: RoadmapItemStatusUpdate, 
    user: Any = Depends(get_current_user)
):
    if update.status is not None and update.status not in ["not_started", "attempted", "solved", "completed"]:
        raise HTTPException(status_code=400, detail="Invalid status")
        
    async with AsyncSessionLocal() as session:
        query = await session.execute(
            select(UserRoadmapItemProgress).where(
                UserRoadmapItemProgress.user_id == user.id,
                UserRoadmapItemProgress.roadmap_slug == roadmap_slug,
                UserRoadmapItemProgress.item_id == item_id
            )
        )
        record = query.scalars().first()
        
        if record:
            if update.status is not None and update.status != record.status:
                record.status = update.status
                if update.status in ["attempted", "solved", "completed"]:
                    record.attempts += 1
                if update.status in ["solved", "completed"] and not record.solved_at:
                    record.solved_at = datetime.utcnow()
                elif update.status == "attempted":
                    record.attempted_at = datetime.utcnow()
                    
            if update.notes is not None:
                record.notes = update.notes
                
        else:
            record = UserRoadmapItemProgress(
                id=str(uuid.uuid4()),
                user_id=user.id,
                roadmap_slug=roadmap_slug,
                item_id=item_id,
                status=update.status if update.status else "not_started",
                notes=update.notes,
                attempts=1 if update.status in ["attempted", "solved", "completed"] else 0,
                solved_at=datetime.utcnow() if update.status in ["solved", "completed"] else None,
                attempted_at=datetime.utcnow() if update.status == "attempted" else None,
            )
            session.add(record)
            
        await session.commit()
        
        # Return recalculated stats
        stats_query = await session.execute(
            select(UserRoadmapItemProgress).where(
                UserRoadmapItemProgress.user_id == user.id,
                UserRoadmapItemProgress.roadmap_slug == roadmap_slug
            )
        )
        all_records = stats_query.scalars().all()
        solved_ids = [r.item_id for r in all_records if r.status in ["solved", "completed"]]
        attempted_ids = [r.item_id for r in all_records if r.status == "attempted"]
        
        return {
            "success": True,
            "item_id": item_id,
            "progress": {
                "status": record.status,
                "notes": record.notes,
                "attempts": record.attempts,
                "solved_at": record.solved_at.isoformat() if record.solved_at else None,
                "attempted_at": record.attempted_at.isoformat() if record.attempted_at else None
            },
            "stats": {
                "total_solved": len(solved_ids),
                "total_attempted": len(attempted_ids),
                "solved_ids": solved_ids,
                "attempted_ids": attempted_ids
            }
        }

