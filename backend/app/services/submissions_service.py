"""Stores graded submissions (with their code) and reads a learner's history back."""
from typing import Optional

from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.submissions import CodeSubmission

KEEP_PER_PROBLEM = 50  # newest submissions kept per learner per problem
MAX_ERROR_CHARS = 4000


def _summary(s: CodeSubmission) -> dict:
    return {
        "id": s.id,
        "problemId": s.problem_id,
        "language": s.language,
        "status": s.status,
        "passed": s.passed,
        "total": s.total,
        "runtimeMs": s.runtime_ms,
        "note": s.note,
        "createdAt": s.created_at.isoformat() + "Z",
    }


def detail(s: CodeSubmission) -> dict:
    return {**_summary(s), "code": s.code, "failedCase": s.failed_case, "error": s.error}


async def record(session: AsyncSession, user_id: str, problem_id: str, language: str, code: str, result) -> str:
    """Saves one graded submission and trims that problem's history to the newest KEEP_PER_PROBLEM."""
    failed = next((t for t in result.testResults if t.status != "passed"), None)
    sub = CodeSubmission(
        user_id=user_id,
        problem_id=problem_id,
        language=language,
        code=code,
        status=result.status,
        passed=result.passedTests,
        total=result.totalTests,
        runtime_ms=result.runtimeMs,
        failed_case=failed.model_dump(include={"id", "input", "expectedOutput", "actualOutput", "error"}) if failed else None,
        error=(result.compilerError or result.runtimeError or "")[:MAX_ERROR_CHARS] or None,
    )
    session.add(sub)
    await session.flush()
    old = (
        select(CodeSubmission.id)
        .where(CodeSubmission.user_id == user_id, CodeSubmission.problem_id == problem_id)
        .order_by(CodeSubmission.created_at.desc())
        .offset(KEEP_PER_PROBLEM)
    )
    await session.execute(delete(CodeSubmission).where(CodeSubmission.id.in_(old.scalar_subquery())))
    await session.commit()
    return sub.id


async def list_for(session: AsyncSession, user_id: str, problem_id: Optional[str], limit: int, offset: int) -> dict:
    q = select(CodeSubmission).where(CodeSubmission.user_id == user_id)
    count = select(func.count()).select_from(CodeSubmission).where(CodeSubmission.user_id == user_id)
    if problem_id:
        q = q.where(CodeSubmission.problem_id == problem_id)
        count = count.where(CodeSubmission.problem_id == problem_id)
    rows = (await session.execute(q.order_by(CodeSubmission.created_at.desc()).offset(offset).limit(limit))).scalars().all()
    return {"total": (await session.execute(count)).scalar_one(), "items": [_summary(s) for s in rows]}


async def set_note(session: AsyncSession, user_id: str, submission_id: str, note: str) -> Optional[CodeSubmission]:
    s = await get_for(session, user_id, submission_id)
    if s:
        s.note = note.strip() or None
        await session.commit()
    return s


async def get_for(session: AsyncSession, user_id: str, submission_id: str) -> Optional[CodeSubmission]:
    s = await session.get(CodeSubmission, submission_id)
    return s if s and s.user_id == user_id else None
