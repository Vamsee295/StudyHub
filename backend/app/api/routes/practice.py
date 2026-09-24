from fastapi import APIRouter, Depends, HTTPException
from typing import Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.models.practice import PracticeSet, PracticeQuestion, UserPracticeAttempt
from pydantic import BaseModel

router = APIRouter(prefix="/api/practice", tags=["practice"])

class AttemptCreate(BaseModel):
    set_id: str
    score: int
    total_questions: int
    duration_seconds: int

@router.get("/sets/")
@router.get("/sets")
async def get_practice_sets():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(PracticeSet))
        sets = result.scalars().all()
        return {"sets": sets}

@router.get("/sets/{set_id}")
async def get_practice_set(set_id: str):
    async with AsyncSessionLocal() as session:
        # Get the set
        result = await session.execute(
            select(PracticeSet).where(PracticeSet.id == set_id)
        )
        practice_set = result.scalars().first()
        if not practice_set:
            raise HTTPException(status_code=404, detail="Practice set not found")
            
        # Get questions
        q_result = await session.execute(
            select(PracticeQuestion).where(PracticeQuestion.set_id == set_id)
        )
        questions = q_result.scalars().all()
        
        return {
            "set": practice_set,
            "questions": questions
        }

@router.post("/attempts/")
@router.post("/attempts")
async def create_attempt(attempt: AttemptCreate, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        new_attempt = UserPracticeAttempt(
            user_id=user.id,
            set_id=attempt.set_id,
            score=attempt.score,
            total_questions=attempt.total_questions,
            duration_seconds=attempt.duration_seconds
        )
        session.add(new_attempt)
        await session.commit()
        await session.refresh(new_attempt)
        
        return {"status": "success", "attempt_id": new_attempt.id}

@router.get("/ledger/")
@router.get("/ledger")
async def get_practice_ledger(user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        # Get recent attempts
        result = await session.execute(
            select(UserPracticeAttempt)
            .where(UserPracticeAttempt.user_id == user.id)
            .order_by(UserPracticeAttempt.completed_at.desc())
        )
        attempts = result.scalars().all()
        
        # Hydrate with practice set details
        ledger = []
        for a in attempts:
            s_result = await session.execute(
                select(PracticeSet).where(PracticeSet.id == a.set_id)
            )
            ps = s_result.scalars().first()
            if ps:
                ledger.append({
                    "id": a.id,
                    "title": ps.title,
                    "score": a.score,
                    "total_questions": a.total_questions,
                    "completed_at": a.completed_at,
                    "duration_seconds": a.duration_seconds,
                    "domain": ps.domain
                })
                
        return {"ledger": ledger}

class TutorMessage(BaseModel):
    role: str
    content: str

class TutorRequest(BaseModel):
    query: str
    chat_history: List[TutorMessage] = []

@router.post("/questions/{question_id}/tutor")
async def ask_tutor(question_id: str, request: TutorRequest, user: Any = Depends(get_current_user)):
    from app.ai.tutor_service import TutorService
    from sse_starlette.sse import EventSourceResponse
    
    async with AsyncSessionLocal() as session:
        # Get question
        result = await session.execute(
            select(PracticeQuestion).where(PracticeQuestion.id == question_id)
        )
        question = result.scalars().first()
        if not question:
            raise HTTPException(status_code=404, detail="Question not found")
            
        # Get user skill baseline
        from app.models.profile import ProfileSkillBaseline
        sb_result = await session.execute(
            select(ProfileSkillBaseline).where(ProfileSkillBaseline.profile_id == user.id)
        )
        skill_baseline = sb_result.scalars().first()
        
    tutor_service = TutorService()
    chat_history_dicts = [{"role": msg.role, "content": msg.content} for msg in request.chat_history]
    
    generator = tutor_service.get_tutor_stream(
        question=question,
        query=request.query,
        user_skills=skill_baseline,
        chat_history=chat_history_dicts
    )
    
    return EventSourceResponse(generator)
