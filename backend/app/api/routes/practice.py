from fastapi import APIRouter, Depends, HTTPException
from typing import Any, Dict, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.models.practice import PracticeSet, PracticeQuestion, UserPracticeAttempt
from pydantic import BaseModel

router = APIRouter(prefix="/api/practice", tags=["practice"])

MAX_DURATION_SECONDS = 6 * 60 * 60
MAX_ANSWER_CHARS = 5000


class AnswerIn(BaseModel):
    choice: Optional[str] = None       # MCQ option id
    text: Optional[str] = None         # free-form approach for open questions
    self_solved: bool = False          # student's own verdict on open questions


class AttemptCreate(BaseModel):
    set_id: str
    answers: Dict[str, AnswerIn] = {}
    duration_seconds: int


def is_mcq(q: PracticeQuestion) -> bool:
    return bool(q.options) and bool(q.correct_option)


def grade_attempt(questions: List[PracticeQuestion], answers: Dict[str, AnswerIn]) -> tuple[int, dict]:
    """MCQs are graded against the stored key; open questions have no tests, so they count the student's self-assessment."""
    score, graded = 0, {}
    for q in questions:
        a = answers.get(q.id) or AnswerIn()
        if is_mcq(q):
            ok = a.choice == q.correct_option
            graded[q.id] = {"choice": a.choice, "is_correct": ok, "graded_by": "auto"}
        else:
            ok = a.self_solved
            graded[q.id] = {"text": (a.text or "")[:MAX_ANSWER_CHARS], "self_solved": ok, "is_correct": ok, "graded_by": "self"}
        score += ok
    return score, graded


def public_question(q: PracticeQuestion) -> dict:
    """Question as shown during a session: no answer key, no explanation."""
    return {
        "id": q.id,
        "set_id": q.set_id,
        "title": q.title,
        "problem_statement": q.problem_statement,
        "difficulty": q.difficulty,
        "options": [{"id": o["id"], "text": o["text"]} for o in (q.options or [])],
    }

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
            "questions": [public_question(q) for q in questions]
        }

@router.post("/attempts/")
@router.post("/attempts")
async def create_attempt(attempt: AttemptCreate, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        q_result = await session.execute(
            select(PracticeQuestion).where(PracticeQuestion.set_id == attempt.set_id)
        )
        questions = q_result.scalars().all()
        if not questions:
            raise HTTPException(status_code=404, detail="Practice set not found")

        score, graded = grade_attempt(questions, attempt.answers)
        new_attempt = UserPracticeAttempt(
            user_id=user.id,
            set_id=attempt.set_id,
            score=score,
            total_questions=len(questions),
            duration_seconds=max(0, min(attempt.duration_seconds, MAX_DURATION_SECONDS)),
            answers=graded,
        )
        session.add(new_attempt)
        await session.commit()
        await session.refresh(new_attempt)
        
        return {"status": "success", "attempt_id": new_attempt.id, "score": score, "total_questions": len(questions)}


@router.get("/attempts/{attempt_id}")
async def get_attempt(attempt_id: str, user: Any = Depends(get_current_user)):
    async with AsyncSessionLocal() as session:
        attempt = await session.get(UserPracticeAttempt, attempt_id)
        if not attempt or attempt.user_id != user.id:
            raise HTTPException(status_code=404, detail="Attempt not found")
        practice_set = await session.get(PracticeSet, attempt.set_id)
        q_result = await session.execute(
            select(PracticeQuestion).where(PracticeQuestion.set_id == attempt.set_id)
        )
        answers = attempt.answers or {}
        return {
            "id": attempt.id,
            "set_id": attempt.set_id,
            "title": practice_set.title if practice_set else "Practice Session",
            "domain": practice_set.domain if practice_set else "",
            "score": attempt.score,
            "total_questions": attempt.total_questions,
            "duration_seconds": attempt.duration_seconds,
            "completed_at": attempt.completed_at,
            "questions": [
                {
                    **public_question(q),
                    "correct_option": q.correct_option if is_mcq(q) else None,
                    "explanation": q.explanation,
                    "answer": answers.get(q.id),
                }
                for q in q_result.scalars().all()
            ],
        }

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
        set_ids = {a.set_id for a in attempts}
        s_result = await session.execute(select(PracticeSet).where(PracticeSet.id.in_(set_ids)))
        sets_by_id = {ps.id: ps for ps in s_result.scalars().all()}
        ledger = []
        for a in attempts:
            ps = sets_by_id.get(a.set_id)
            if ps:
                ledger.append({
                    "id": a.id,
                    "set_id": a.set_id,
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


class CodeFileItem(BaseModel):
    path: str
    content: str


class CodeExecuteRequest(BaseModel):
    language: str
    files: List[CodeFileItem]
    entryFile: Optional[str] = None
    stdin: Optional[str] = ""


@router.post("/code/execute")
def execute_code(req: CodeExecuteRequest, user=Depends(get_current_user)):
    from app.services.code_execution_service import CodeExecutionService
    service = CodeExecutionService()
    files_list = [{"path": f.path, "content": f.content} for f in req.files]
    result = service.execute_project(
        language=req.language,
        files=files_list,
        entry_file=req.entryFile,
        stdin=req.stdin or "",
    )
    return result

