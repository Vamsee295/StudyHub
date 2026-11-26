import logging
from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field
from typing import Optional, Any
import subprocess

from app.core.database import AsyncSessionLocal
from app.services import submissions_service

from app.services.execution_service import execute_java, execute_python, execute_cpp, ExecutionRequest, ExecutionResult, TestCase
from app.services.problem_registry import get_hidden_tests
from app.services.groq_service import explain_code_error
from app.core.security import get_current_user

class ExplainErrorRequest(BaseModel):
    code: str
    error_message: str
    language: str

router = APIRouter(
    prefix="/api/execution",
    tags=["Execution"],
    dependencies=[Depends(get_current_user)],
)


def route_execution(request: ExecutionRequest) -> ExecutionResult:
    lang = request.functionSignature.language.lower()
    if lang == "java":
        return execute_java(request)
    elif lang == "python":
        return execute_python(request)
    elif lang == "cpp":
        return execute_cpp(request)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported language: {lang}")


@router.post("/run", response_model=ExecutionResult)
def run_code(request: ExecutionRequest):
    return route_execution(request)


logger = logging.getLogger(__name__)


@router.post("/submit", response_model=ExecutionResult)
async def submit_code(request: ExecutionRequest, user: Any = Depends(get_current_user)):
    # Append hidden tests for submission
    hidden_tests = get_hidden_tests(request.problemId)
    for ht in hidden_tests:
        request.testCases.append(TestCase(**ht))

    result = await run_in_threadpool(route_execution, request)  # compiling and running blocks; keep the event loop free

    # Keep the code and verdict in the learner's history. A storage failure never costs them the verdict.
    try:
        async with AsyncSessionLocal() as session:
            result.submissionId = await submissions_service.record(
                session, str(user.id), request.problemId, request.functionSignature.language.lower(), request.code, result
            )
    except Exception:
        logger.exception("Could not save submission")
    return result


@router.get("/submissions")
async def list_submissions(
    problem_id: Optional[str] = Query(None, max_length=100),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user: Any = Depends(get_current_user),
):
    """Your submissions, newest first, without code. Filter to one problem with problem_id."""
    async with AsyncSessionLocal() as session:
        return await submissions_service.list_for(session, str(user.id), problem_id, limit, offset)


class NoteIn(BaseModel):
    note: str = Field(max_length=500)


@router.patch("/submissions/{submission_id}")
async def update_note(submission_id: str, body: NoteIn, user: Any = Depends(get_current_user)):
    """Sets your note on one of your submissions (empty clears it)."""
    async with AsyncSessionLocal() as session:
        s = await submissions_service.set_note(session, str(user.id), submission_id, body.note)
        if not s:
            raise HTTPException(status_code=404, detail="Submission not found")
        return {"id": s.id, "note": s.note}


@router.get("/submissions/{submission_id}")
async def get_submission(submission_id: str, user: Any = Depends(get_current_user)):
    """One of your submissions with its code and the first failing test."""
    async with AsyncSessionLocal() as session:
        s = await submissions_service.get_for(session, str(user.id), submission_id)
        if not s:
            raise HTTPException(status_code=404, detail="Submission not found")
        return submissions_service.detail(s)

@router.post("/explain-error")
async def explain_error(request: ExplainErrorRequest):
    try:
        explanation = await explain_code_error(request.code, request.error_message, request.language)
        return {"explanation": explanation}
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate explanation.")
