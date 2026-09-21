from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List, Dict
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from datetime import datetime
import json

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.models.learning import LearningSubject, LearningModule, LearningTopic, UserLearningProgress
from pydantic import BaseModel

router = APIRouter(prefix="/api/learn", tags=["learn"])

class TopicProgressUpdate(BaseModel):
    status: str # "not_started", "in_progress", "completed"
    notes: str = None

@router.get("/subjects")
async def get_subjects(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Fetch all subjects
        result = await session.execute(
            select(LearningSubject).order_by(LearningSubject.display_order)
        )
        subjects = result.scalars().all()
        
        # Calculate progress for each subject
        subject_data = []
        for subject in subjects:
            # Get all topic IDs for this subject
            topics_query = await session.execute(
                select(LearningTopic.id)
                .join(LearningModule, LearningTopic.module_id == LearningModule.id)
                .where(LearningModule.subject_id == subject.id)
            )
            topic_ids = [t_id for t_id, in topics_query.all()]
            
            total_topics = len(topic_ids)
            completed_topics = 0
            
            if total_topics > 0:
                progress_query = await session.execute(
                    select(UserLearningProgress)
                    .where(
                        UserLearningProgress.user_id == user.id,
                        UserLearningProgress.topic_id.in_(topic_ids),
                        UserLearningProgress.status == "completed"
                    )
                )
                completed_topics = len(progress_query.scalars().all())
            
            progress_percentage = (completed_topics / total_topics * 100) if total_topics > 0 else 0
            
            subject_data.append({
                "id": subject.id,
                "name": subject.name,
                "slug": subject.slug,
                "description": subject.description,
                "icon": subject.icon,
                "category": subject.category,
                "total_topics": total_topics,
                "completed_topics": completed_topics,
                "progress_percentage": round(progress_percentage)
            })
            
        return subject_data

@router.get("/subjects/{subject_slug}")
async def get_subject_details(subject_slug: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Fetch the subject with modules and topics
        query = (
            select(LearningSubject)
            .options(
                selectinload(LearningSubject.modules).selectinload(LearningModule.topics)
            )
            .where(
                (LearningSubject.slug == subject_slug) | (LearningSubject.id == subject_slug)
            )
        )
        result = await session.execute(query)
        subject = result.scalars().first()
        
        if not subject:
            raise HTTPException(status_code=404, detail="Subject not found")
            
        # Fetch user's progress for this subject's topics
        # Gather all topic IDs
        topic_ids = []
        for m in subject.modules:
            for t in m.topics:
                topic_ids.append(t.id)
                
        user_progress = {}
        if topic_ids:
            prog_query = await session.execute(
                select(UserLearningProgress)
                .where(
                    UserLearningProgress.user_id == user.id,
                    UserLearningProgress.topic_id.in_(topic_ids)
                )
            )
            for p in prog_query.scalars().all():
                user_progress[p.topic_id] = {
                    "status": p.status,
                    "progress": p.progress
                }

        # Format output
        modules_data = []
        for module in sorted(subject.modules, key=lambda x: x.display_order):
            topics_data = []
            for topic in sorted(module.topics, key=lambda x: x.display_order):
                prog = user_progress.get(topic.id, {"status": "not_started", "progress": 0})
                topics_data.append({
                    "id": topic.id,
                    "title": topic.title,
                    "slug": topic.slug,
                    "description": topic.description,
                    "estimated_minutes": topic.estimated_minutes,
                    "status": prog["status"],
                    "progress": prog["progress"]
                })
            
            modules_data.append({
                "id": module.id,
                "title": module.title,
                "slug": module.slug,
                "description": module.description,
                "difficulty": module.difficulty,
                "estimated_minutes": module.estimated_minutes,
                "topics": topics_data
            })
            
        return {
            "id": subject.id,
            "name": subject.name,
            "slug": subject.slug,
            "description": subject.description,
            "icon": subject.icon,
            "category": subject.category,
            "modules": modules_data
        }

@router.get("/topics/{topic_id_or_slug}")
async def get_topic_content(topic_id_or_slug: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Support fetching by ID, slug, or normalized slug
        normalized = topic_id_or_slug.replace(",", "").replace("&", "").replace("/", "-").replace(" ", "-").replace("--", "-")
        query = (
            select(LearningTopic)
            .options(selectinload(LearningTopic.module).selectinload(LearningModule.subject))
            .where(
                (LearningTopic.id == topic_id_or_slug) | 
                (LearningTopic.slug == topic_id_or_slug) |
                (LearningTopic.slug == normalized)
            )
        )
        result = await session.execute(query)
        topic = result.scalars().first()
        
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
            
        # Get progress
        prog_query = await session.execute(
            select(UserLearningProgress).where(
                UserLearningProgress.user_id == user.id,
                UserLearningProgress.topic_id == topic.id
            )
        )
        progress = prog_query.scalars().first()
        
        # If user accessing topic for first time, mark as in_progress
        if not progress:
            progress = UserLearningProgress(
                id=f"{user.id}_{topic.id}",
                user_id=user.id,
                topic_id=topic.id,
                status="in_progress",
                progress=0,
                started_at=datetime.utcnow(),
                last_accessed_at=datetime.utcnow()
            )
            session.add(progress)
            await session.commit()
            await session.refresh(progress)
        else:
            progress.last_accessed_at = datetime.utcnow()
            await session.commit()
            
        content_json = {}
        if topic.content:
            try:
                content_json = json.loads(topic.content)
            except:
                content_json = {"raw": topic.content}
                
        return {
            "id": topic.id,
            "title": topic.title,
            "slug": topic.slug,
            "description": topic.description,
            "estimated_minutes": topic.estimated_minutes,
            "content": content_json,
            "module_title": topic.module.title if topic.module else None,
            "subject_title": topic.module.subject.name if topic.module and topic.module.subject else None,
            "subject_slug": topic.module.subject.slug if topic.module and topic.module.subject else None,
            "status": progress.status,
            "user_progress": progress.progress,
            "notes": progress.notes
        }

@router.post("/topics/{topic_id}/progress")
async def update_topic_progress(topic_id: str, payload: TopicProgressUpdate, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Check topic exists
        res = await session.execute(select(LearningTopic).where(LearningTopic.id == topic_id))
        topic = res.scalars().first()
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")
            
        # Get progress record
        prog_query = await session.execute(
            select(UserLearningProgress).where(
                UserLearningProgress.user_id == user.id,
                UserLearningProgress.topic_id == topic_id
            )
        )
        progress = prog_query.scalars().first()
        
        if not progress:
            progress = UserLearningProgress(
                id=f"{user.id}_{topic_id}",
                user_id=user.id,
                topic_id=topic_id,
                started_at=datetime.utcnow()
            )
            session.add(progress)
            
        progress.status = payload.status
        progress.last_accessed_at = datetime.utcnow()
        if payload.notes is not None:
            progress.notes = payload.notes
            
        if payload.status == "completed":
            progress.progress = 100
            if not progress.completed_at:
                progress.completed_at = datetime.utcnow()
        elif payload.status == "in_progress":
            if progress.progress == 100:
                progress.progress = 50
                progress.completed_at = None
                
        await session.commit()
        await session.refresh(progress)
        
        return {"success": True, "status": progress.status, "progress": progress.progress}
