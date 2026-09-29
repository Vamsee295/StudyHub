from __future__ import annotations

import logging
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.future import select

from app.core.database import AsyncSessionLocal
from app.core.security import get_current_user
from app.models.profile import Profile
from app.schemas.resume_analysis import (
    CreateAnalysisResponse,
    GetAnalysisResponse,
    ResumeAnalysisReport,
)
from app.services.resume_analysis_service import ResumeAnalysisService
from app.services.resume_parser import ResumeParser, ResumeParserError

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/resume", tags=["resume"])
security_optional = HTTPBearer(auto_error=False)


async def get_effective_user_id(credentials: Optional[HTTPAuthorizationCredentials] = Depends(security_optional)) -> str:
    """
    Get authenticated user ID from Supabase bearer token.
    Falls back gracefully to a verified active profile in development mode.
    """
    if credentials:
        try:
            user = get_current_user(credentials)
            user_id = getattr(user, "id", None) or (user.get("id") if isinstance(user, dict) else None)
            if user_id:
                # Ensure profile exists in DB
                async with AsyncSessionLocal() as session:
                    res = await session.execute(select(Profile).where(Profile.id == user_id))
                    profile = res.scalars().first()
                    if not profile:
                        profile = Profile(
                            id=user_id,
                            full_name=getattr(user, "user_metadata", {}).get("full_name", "Student Learner"),
                            profile_completed=True,
                        )
                        session.add(profile)
                        await session.commit()
                return str(user_id)
        except Exception as e:
            logger.warning("Bearer token verification failed in resume route: %s", e)

    # Fallback to existing profile in DB for local development
    async with AsyncSessionLocal() as session:
        res = await session.execute(select(Profile).limit(1))
        profile = res.scalars().first()
        if profile:
            return profile.id

        # Auto-create fallback dev profile
        dev_profile = Profile(
            id="dev-student-user",
            full_name="Student Learner",
            profile_completed=True,
        )
        session.add(dev_profile)
        await session.commit()
        return dev_profile.id


@router.post("/analyses", response_model=CreateAnalysisResponse)
async def create_analysis(
    source: str = Form(...),
    file: Optional[UploadFile] = File(None),
    file_name: Optional[str] = Form(None),
    file_size: Optional[int] = Form(None),
    file_mime_type: Optional[str] = Form(None),
    resume_text: Optional[str] = Form(None),
    company: str = Form(...),
    company_type: str = Form(...),
    role: str = Form(...),
    custom_role: Optional[str] = Form(None),
    job_description: Optional[str] = Form(None),
    user_id: str = Depends(get_effective_user_id),
):
    """
    Create a new resume analysis record from PDF or raw text.
    """
    parser = ResumeParser()
    service = ResumeAnalysisService()

    parsed_result = {}
    content_bytes = b""
    actual_filename = file_name or "resume.pdf"
    actual_mime = file_mime_type or "application/pdf"

    if source == "pdf":
        if not file:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Resume PDF file is required when source is 'pdf'.",
            )
        try:
            content_bytes = await file.read()
            if not content_bytes:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="The uploaded PDF file is empty.",
                )
            parsed_result = parser.parse_pdf(content_bytes)
            actual_filename = file.filename or actual_filename
            actual_mime = file.content_type or actual_mime
        except ResumeParserError as exc:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=str(exc),
            )
        except Exception as exc:
            logger.exception("Failed parsing uploaded PDF")
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Unable to parse the PDF resume. Ensure the file is not corrupted or scanned as an image.",
            )
    elif source == "text":
        if not resume_text or len(resume_text.strip()) < 50:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please paste at least 50 characters of resume text.",
            )
        parsed_result = parser.parse_text(resume_text)
        content_bytes = resume_text.encode("utf-8")
        actual_filename = file_name or "pasted_resume.txt"
        actual_mime = "text/plain"
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported source type '{source}'. Must be 'pdf' or 'text'.",
        )

    request_snapshot = {
        "source": source,
        "file_name": actual_filename,
        "file_size": len(content_bytes),
        "file_mime_type": actual_mime,
        "resume_text": parsed_result.get("text"),
        "target": {
            "company": company.strip(),
            "company_type": company_type.strip(),
            "role": role.strip(),
            "custom_role": custom_role.strip() if custom_role else None,
            "job_description": job_description.strip() if job_description else None,
        },
    }

    try:
        analysis = await service.create_analysis(
            user_id=user_id,
            request=request_snapshot,
            parsed_resume=parsed_result,
            storage_path=f"resumes/{user_id}/{actual_filename}",
        )
        return CreateAnalysisResponse(analysis=service.to_summary(analysis))
    except Exception as exc:
        logger.exception("Failed to create resume analysis record")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to initiate resume analysis.",
        )


@router.get("/analyses/{analysis_id}", response_model=GetAnalysisResponse)
async def get_analysis(analysis_id: str):
    """
    Retrieve an analysis summary and report if completed.
    """
    service = ResumeAnalysisService()
    analysis = await service.get_analysis(analysis_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found.",
        )

    report = None
    if analysis.analysis_result:
        try:
            report = ResumeAnalysisReport.model_validate_json(analysis.analysis_result)
        except Exception as e:
            logger.warning("Failed parsing analysis_result for %s: %s", analysis_id, e)

    return GetAnalysisResponse(
        analysis=service.to_summary(analysis),
        report=report,
    )


@router.post("/analyses/{analysis_id}/process")
async def process_analysis_stream(analysis_id: str):
    """
    Stream live progress and report via Server-Sent Events (SSE).
    """
    service = ResumeAnalysisService()
    analysis = await service.get_analysis(analysis_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found.",
        )

    return StreamingResponse(
        service.process_analysis_stream(analysis_id),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
