"""
Resume analysis service - orchestrates the complete analysis pipeline.
"""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime
from typing import Any

from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.core.supabase import get_service_role_client
from app.models.resume_analysis import ResumeAnalysis
from app.schemas.resume_analysis import (
    AtsCheck,
    AtsCompatibility,
    CandidateProfile,
    ParsedResume,
    ResumeAnalysisReport,
    ResumeAnalysisTarget,
    ScoreBreakdownItem,
)

logger = logging.getLogger(__name__)


class ResumeAnalysisServiceError(Exception):
    """Base exception for resume analysis service errors."""

    def __init__(self, code: str, message: str):
        self.code = code
        self.message = message
        super().__init__(message)


class ResumeAnalysisService:
    """
    Orchestrates the complete resume analysis pipeline.
    """

    # Processing stages in order
    STAGES = [
        ("parse_resume", "Resume parsing"),
        ("extract_candidate", "Candidate extraction"),
        ("extract_skills", "Skills extraction"),
        ("analyze_experience", "Experience analysis"),
        ("analyze_projects", "Project analysis"),
        ("analyze_education", "Education and certification analysis"),
        ("analyze_keywords", "Keyword analysis"),
        ("compare_target_role", "Target-role comparison"),
        ("align_company", "Company alignment"),
        ("generate_recommendations", "Recommendation generation"),
        ("validate_report", "Structured report validation"),
    ]

    def __init__(self) -> None:
        self.parser = None
        self.groq_client = None

    def _create_initial_stage_state(self) -> list[dict[str, Any]]:
        """Create the initial stage state with all stages as pending."""
        return [
            {
                "id": stage_id,
                "label": label,
                "status": "pending",
                "message": None,
                "started_at": None,
                "completed_at": None,
                "failed_at": None,
            }
            for stage_id, label in self.STAGES
        ]

    async def create_analysis(
        self,
        user_id: str,
        request: dict[str, Any],
        parsed_resume: ParsedResume,
        storage_path: str,
    ) -> ResumeAnalysis:
        """
        Create a new resume analysis record in the database.

        Args:
            user_id: The authenticated user's ID.
            request: The original request data.
            parsed_resume: The parsed resume data.
            storage_path: The Supabase Storage path for the uploaded file.

        Returns:
            The created ResumeAnalysis instance.
        """
        target = request["target"]
        source_type = request["source"]

        # Prepare candidate profile from parsed resume
        candidate = parsed_resume.get("candidate", {})

        # Create the analysis record
        analysis = ResumeAnalysis(
            id=str(uuid.uuid4()),
            user_id=user_id,
            company=target["company"],
            company_type=target["company_type"],
            role=target["role"],
            custom_role=target.get("custom_role"),
            job_description=target.get("job_description"),
            source_type=source_type,
            original_filename=request.get("file_name") or "resume.pdf",
            mime_type=request.get("file_mime_type") or "application/pdf",
            file_size_bytes=request.get("file_size", 0),
            page_count=parsed_resume.get("page_count", 1),
            storage_path=storage_path,
            status="pending",
            current_stage=None,
            stage_state=json.dumps(self._create_initial_stage_state()),
            request_snapshot=json.dumps(request),
            parsed_resume=json.dumps(parsed_resume),
            analysis_result=None,
            error_code=None,
            error_message=None,
            failed_stage=None,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            started_at=None,
            completed_at=None,
            failed_at=None,
        )

        async with AsyncSessionLocal() as session:
            session.add(analysis)
            await session.commit()
            await session.refresh(analysis)

        logger.info("Created resume analysis %s for user %s", analysis.id, user_id)
        return analysis

    async def get_analysis(self, analysis_id: str, user_id: str) -> ResumeAnalysis | None:
        """Get an analysis by ID with ownership check."""
        async with AsyncSessionLocal() as session:
            result = await session.execute(
                sa.select(ResumeAnalysis).where(
                    ResumeAnalysis.id == analysis_id,
                    ResumeAnalysis.user_id == user_id,
                )
            )
            return result.scalars().first()

    async def update_stage(
        self,
        analysis_id: str,
        stage_id: str,
        status: str,
        message: str | None = None,
        session: Any = None,
    ) -> None:
        """Update a single stage's status in the analysis record."""
        # This method will be implemented with proper session handling
        pass

    async def process_analysis(
        self,
        analysis_id: str,
        user_id: str,
    ) -> ResumeAnalysisReport:
        """
        Process the analysis through all stages and return the final report.
        This is the main orchestration method that runs all stages.

        Args:
            analysis_id: The analysis ID to process.
            user_id: The user ID (for ownership check).

        Returns:
            The completed ResumeAnalysisReport.
        """
        # Load the analysis
        analysis = await self.get_analysis(analysis_id, user_id)
        if not analysis:
            raise ResumeAnalysisServiceError("not_found", "Analysis not found")

        if analysis.status == "completed":
            # Already completed, return existing report
            return ResumeAnalysisReport.model_validate_json(analysis.analysis_result)

        # Update status to processing
        analysis.status = "processing"
        analysis.started_at = datetime.utcnow()
        analysis.updated_at = datetime.utcnow()

        # Load parsed resume
        parsed_resume_data = json.loads(analysis.parsed_resume) if analysis.parsed_resume else None
        request_snapshot = json.loads(analysis.request_snapshot) if analysis.request_snapshot else None

        # Run through all stages
        stage_state = json.loads(analysis.stage_state)

        for i, (stage_id, stage_label) in enumerate(self.STAGES):
            # Update stage to processing
            stage_state[i]["status"] = "processing"
            stage_state[i]["started_at"] = datetime.utcnow().isoformat()
            stage_state[i]["message"] = f"Running {stage_label.lower()}..."
            analysis.current_stage = stage_id
            analysis.stage_state = json.dumps(stage_state)
            analysis.updated_at = datetime.utcnow()

            async with AsyncSessionLocal() as session:
                await session.merge(analysis)
                await session.commit()

            try:
                # Execute the stage
                await self._execute_stage(
                    stage_id,
                    analysis,
                    parsed_resume_data,
                    request_snapshot,
                    stage_state,
                    i,
                )

                # Update stage to completed
                stage_state[i]["status"] = "completed"
                stage_state[i]["completed_at"] = datetime.utcnow().isoformat()
                stage_state[i]["message"] = f"{stage_label} completed"
            except Exception as exc:
                logger.exception("Stage %s failed for analysis %s", stage_id, analysis_id)

                # Update stage to failed
                stage_state[i]["status"] = "failed"
                stage_state[i]["failed_at"] = datetime.utcnow().isoformat()
                stage_state[i]["message"] = str(exc)

                analysis.status = "failed"
                analysis.error_code = getattr(exc, "code", "processing_failed")
                analysis.error_message = str(exc)
                analysis.failed_stage = stage_id
                analysis.failed_at = datetime.utcnow()
                analysis.updated_at = datetime.utcnow()
                analysis.stage_state = json.dumps(stage_state)

                async with AsyncSessionLocal() as session:
                    await session.merge(analysis)
                    await session.commit()

                raise ResumeAnalysisServiceError(
                    getattr(exc, "code", "processing_failed"),
                    str(exc),
                ) from exc

        # All stages completed - finalize
        # The final report should be generated by the last stage (validate_report)
        # For now, we'll build a basic report structure
        report = await self._build_final_report(
            analysis,
            parsed_resume_data,
            request_snapshot,
        )

        # Save the report
        analysis.status = "completed"
        analysis.completed_at = datetime.utcnow()
        analysis.current_stage = None
        analysis.analysis_result = report.model_dump_json()
        analysis.updated_at = datetime.utcnow()

        async with AsyncSessionLocal() as session:
            await session.merge(analysis)
            await session.commit()

        logger.info("Completed analysis %s", analysis_id)
        return report

    async def _execute_stage(
        self,
        stage_id: str,
        analysis: ResumeAnalysis,
        parsed_resume: dict[str, Any] | None,
        request_snapshot: dict[str, Any] | None,
        stage_state: list[dict[str, Any]],
        stage_index: int,
    ) -> None:
        """Execute a single processing stage."""
        target = ResumeAnalysisTarget(
            company=analysis.company,
            company_type=analysis.company_type,
            role=analysis.role,
            custom_role=analysis.custom_role,
            job_description=analysis.job_description,
        )

        if stage_id == "parse_resume":
            # Already done during creation, just validate
            if not parsed_resume or not parsed_resume.get("text"):
                raise ResumeAnalysisServiceError("parse_failed", "Resume text is empty")

        elif stage_id == "extract_candidate":
            # Candidate profile is already in parsed_resume
            pass

        elif stage_id == "extract_skills":
            # Placeholder - skills extraction will be done by Groq
            pass

        elif stage_id == "analyze_experience":
            # Placeholder - experience analysis will be done by Groq
            pass

        elif stage_id == "analyze_projects":
            # Placeholder - project analysis will be done by Groq
            pass

        elif stage_id == "analyze_education":
            # Placeholder - education analysis will be done by Groq
            pass

        elif stage_id == "analyze_keywords":
            # Placeholder - keyword analysis will be done by Groq
            pass

        elif stage_id == "compare_target_role":
            # Placeholder - target role comparison will be done by Groq
            pass

        elif stage_id == "align_company":
            # Placeholder - company alignment will be done by Groq
            pass

        elif stage_id == "generate_recommendations":
            # Placeholder - recommendations will be generated by Groq
            pass

        elif stage_id == "validate_report":
            # This stage will be implemented to call Groq and validate the full report
            await self._generate_full_report(analysis, parsed_resume, target, stage_state)

    async def _generate_full_report(
        self,
        analysis: ResumeAnalysis,
        parsed_resume: dict[str, Any] | None,
        target: ResumeAnalysisTarget,
        stage_state: list[dict[str, Any]],
    ) -> None:
        """Generate the complete analysis report using Groq."""
        # This will be implemented with Groq integration
        # For now, we'll create a minimal valid report structure
        report = self._create_minimal_report(analysis, parsed_resume, target)
        # Validate the report
        ResumeAnalysisReport.model_validate(report.model_dump())

    def _create_minimal_report(
        self,
        analysis: ResumeAnalysis,
        parsed_resume: dict[str, Any] | None,
        target: ResumeAnalysisTarget,
    ) -> ResumeAnalysisReport:
        """Create a minimal valid report for testing."""
        candidate = parsed_resume.get("candidate", {}) if parsed_resume else {}

        return ResumeAnalysisReport(
            analysis_id=analysis.id,
            status="completed",
            generated_at=datetime.utcnow(),
            target=target,
            candidate=CandidateProfile(**candidate),
            overall_score=0,
            score_breakdown=[
                ScoreBreakdownItem(
                    label="ATS Compatibility",
                    value=0,
                    max_value=20,
                    evidence=[],
                ),
                ScoreBreakdownItem(
                    label="Skill Match",
                    value=0,
                    max_value=30,
                    evidence=[],
                ),
                ScoreBreakdownItem(
                    label="Experience Relevance",
                    value=0,
                    max_value=20,
                    evidence=[],
                ),
                ScoreBreakdownItem(
                    label="Project Relevance",
                    value=0,
                    max_value=15,
                    evidence=[],
                ),
                ScoreBreakdownItem(
                    label="Keyword Alignment",
                    value=0,
                    max_value=15,
                    evidence=[],
                ),
            ],
            ats_compatibility=AtsCompatibility(
                score=0,
                checks=[],
                summary="Analysis not yet performed.",
            ),
            skill_matching=SkillMatching(
                matched=[],
                partial=[],
                missing=[],
                summary="Analysis not yet performed.",
            ),
            keyword_analysis=[],
            experience=ExperienceAnalysis(
                years_of_experience=None,
                roles=[],
                findings=["Analysis not yet performed."],
                evidence=[],
            ),
            projects=ProjectAnalysis(
                projects=[],
                relevance_summary="Analysis not yet performed.",
                gaps=[],
            ),
            education_certifications=EducationCertifications(
                education=[],
                certifications=[],
                findings=["Analysis not yet performed."],
            ),
            issues=[],
            company_alignment=[],
            action_plan=[],
        )

    async def _build_final_report(
        self,
        analysis: ResumeAnalysis,
        parsed_resume: dict[str, Any] | None,
        request_snapshot: dict[str, Any] | None,
    ) -> ResumeAnalysisReport:
        """Build the final report from analysis results."""
        # This will be replaced with the actual report from the validate_report stage
        if analysis.analysis_result:
            return ResumeAnalysisReport.model_validate_json(analysis.analysis_result)

        # Fallback - should not happen if pipeline completed successfully
        target = ResumeAnalysisTarget(
            company=analysis.company,
            company_type=analysis.company_type,
            role=analysis.role,
            custom_role=analysis.custom_role,
            job_description=analysis.job_description,
        )
        candidate = parsed_resume.get("candidate", {}) if parsed_resume else {}
        return self._create_minimal_report(analysis, parsed_resume, target)


# Import sqlalchemy for the get_analysis method
import sqlalchemy as sa