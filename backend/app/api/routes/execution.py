from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, Any
import subprocess

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
    tags=["Execution"]
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
async def run_code(request: ExecutionRequest):
    return route_execution(request)


@router.post("/submit", response_model=ExecutionResult)
async def submit_code(request: ExecutionRequest):
    # Append hidden tests for submission
    hidden_tests = get_hidden_tests(request.problemId)
    for ht in hidden_tests:
        request.testCases.append(TestCase(**ht))

    result = route_execution(request)
    
    if result.status == "accepted":
        # TODO: Update student daily streak status here
        pass

    return result

@router.post("/explain-error")
async def explain_error(request: ExplainErrorRequest):
    try:
        explanation = await explain_code_error(request.code, request.error_message, request.language)
        return {"explanation": explanation}
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to generate explanation.")
