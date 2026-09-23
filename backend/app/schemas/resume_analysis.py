from __future__ import annotations

from datetime import datetime
from typing import Annotated, Literal

from pydantic import BaseModel, ConfigDict, Field, StringConstraints, field_validator


NonEmptyString = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1)]
CompanyField = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
RoleField = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]
OptionalRoleField = Annotated[
    str | None,
    StringConstraints(strip_whitespace=True, max_length=120),
]
JobDescriptionField = Annotated[
    str | None,
    StringConstraints(strip_whitespace=True, max_length=12_000),
]
EvidenceList = list[str]


class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class ResumeAnalysisTarget(StrictModel):
    company: CompanyField
    company_type: Literal[
        "product",
        "high_volume",
        "fintech_consulting",
        "startup",
        "mass_hiring",
        "other",
    ]
    role: RoleField
    custom_role: OptionalRoleField = None
    job_description: JobDescriptionField = None

    @field_validator("custom_role")
    @classmethod
    def validate_custom_role(cls, value: str | None) -> str | None:
        if not value:
            return None
        return value


class ResumeAnalysisCreateRequest(StrictModel):
    source: Literal["pdf", "text"]
    file_name: str | None = Field(default=None, max_length=180)
    file_size: int | None = Field(default=None, ge=0)
    file_mime_type: str | None = Field(default=None, max_length=120)
    resume_text: Annotated[str | None, StringConstraints(max_length=50_000)] = None
    target: ResumeAnalysisTarget


class CandidateProfile(StrictModel):
    full_name: str | None = None
    email: str | None = None
    phone: str | None = None
    location: str | None = None
    headline: str | None = None
    summary: str | None = None
    current_role: str | None = None
    years_of_experience: float | None = Field(default=None, ge=0, le=60)


class ParsedResume(StrictModel):
    source_type: Literal["pdf", "text"]
    text: Annotated[str, StringConstraints(min_length=1, max_length=50_000)]
    page_count: int = Field(ge=1, le=20)
    word_count: int = Field(ge=1)
    character_count: int = Field(ge=1)
    candidate: CandidateProfile = Field(default_factory=CandidateProfile)


class AnalysisStage(StrictModel):
    id: NonEmptyString
    label: NonEmptyString
    status: Literal["pending", "processing", "completed", "failed"]
    message: str | None = Field(default=None, max_length=300)
    started_at: datetime | None = None
    completed_at: datetime | None = None
    failed_at: datetime | None = None


class AnalysisError(StrictModel):
    code: NonEmptyString
    message: NonEmptyString


class ResumeAnalysisSummary(StrictModel):
    id: NonEmptyString
    status: Literal["pending", "processing", "completed", "failed"]
    current_stage: str | None = None
    stages: list[AnalysisStage]
    created_at: datetime
    updated_at: datetime
    started_at: datetime | None = None
    completed_at: datetime | None = None
    failed_at: datetime | None = None
    error: AnalysisError | None = None


class CreateAnalysisResponse(StrictModel):
    analysis: ResumeAnalysisSummary


class GetAnalysisResponse(StrictModel):
    analysis: ResumeAnalysisSummary
    report: "ResumeAnalysisReport | None" = None


class AtsCheck(StrictModel):
    id: NonEmptyString
    label: NonEmptyString
    status: Literal["pass", "warning", "fail", "not_assessed"]
    detail: NonEmptyString
    evidence: EvidenceList = Field(default_factory=list)


class AtsCompatibility(StrictModel):
    score: int = Field(ge=0, le=100)
    checks: list[AtsCheck]
    summary: NonEmptyString


class SkillMatch(StrictModel):
    name: NonEmptyString
    status: Literal["matched", "partial", "missing"]
    evidence: EvidenceList
    recommendation: str | None = None


class SkillMatching(StrictModel):
    matched: list[SkillMatch]
    partial: list[SkillMatch]
    missing: list[SkillMatch]
    summary: NonEmptyString


class KeywordAnalysisItem(StrictModel):
    keyword: NonEmptyString
    status: Literal["present", "partial", "missing"]
    count: int = Field(ge=0)
    context: str | None = None


class ExperienceEntry(StrictModel):
    role: NonEmptyString
    company: NonEmptyString
    start_date: str | None = None
    end_date: str | None = None
    duration: str | None = None
    summary: str | None = None
    achievements: EvidenceList


class ExperienceAnalysis(StrictModel):
    years_of_experience: float | None = Field(default=None, ge=0, le=60)
    roles: list[ExperienceEntry]
    findings: list[str]
    evidence: EvidenceList


class ProjectEntry(StrictModel):
    name: NonEmptyString
    description: str | None = None
    technologies: list[str]
    outcomes: EvidenceList
    relevance: Literal["high", "medium", "low", "not_assessed"]
    evidence: EvidenceList


class ProjectAnalysis(StrictModel):
    projects: list[ProjectEntry]
    relevance_summary: NonEmptyString
    gaps: list[str]


class EducationEntry(StrictModel):
    institution: NonEmptyString
    degree: str | None = None
    field_of_study: str | None = None
    graduation_date: str | None = None
    details: str | None = None


class EducationCertifications(StrictModel):
    education: list[EducationEntry]
    certifications: list[str]
    findings: list[str]


class ResumeIssue(StrictModel):
    severity: Literal["low", "medium", "high"]
    issue: NonEmptyString
    evidence: EvidenceList
    recommendation: NonEmptyString


class CompanyAlignmentFactor(StrictModel):
    factor: NonEmptyString
    status: Literal["aligned", "partial", "gap", "not_assessed"]
    assessment: NonEmptyString
    evidence: EvidenceList


class ActionItem(StrictModel):
    priority: Literal["high", "medium", "low"]
    category: NonEmptyString
    action: NonEmptyString
    rationale: NonEmptyString
    evidence: EvidenceList


class ScoreBreakdownItem(StrictModel):
    label: NonEmptyString
    value: int = Field(ge=0)
    max_value: int = Field(gt=0)
    evidence: EvidenceList


class ResumeAnalysisReport(StrictModel):
    analysis_id: NonEmptyString
    status: Literal["completed"]
    generated_at: datetime
    target: ResumeAnalysisTarget
    candidate: CandidateProfile
    overall_score: int = Field(ge=0, le=100)
    score_breakdown: list[ScoreBreakdownItem]
    ats_compatibility: AtsCompatibility
    skill_matching: SkillMatching
    keyword_analysis: list[KeywordAnalysisItem]
    experience: ExperienceAnalysis
    projects: ProjectAnalysis
    education_certifications: EducationCertifications
    issues: list[ResumeIssue]
    company_alignment: list[CompanyAlignmentFactor]
    action_plan: list[ActionItem]

    @field_validator("score_breakdown")
    @classmethod
    def validate_score_breakdown(cls, value: list[ScoreBreakdownItem]) -> list[ScoreBreakdownItem]:
        if not value:
            raise ValueError("At least one score component is required")
        total_max = sum(item.max_value for item in value)
        if total_max != 100:
            raise ValueError("Score component maximums must total 100")
        if sum(item.value for item in value) > 100:
            raise ValueError("Score component values cannot exceed 100")
        return value


class ResumeStreamStageEvent(StrictModel):
    type: Literal["stage"]
    stage: AnalysisStage


class ResumeStreamCompleteEvent(StrictModel):
    type: Literal["complete"]
    analysis: ResumeAnalysisSummary
    report: ResumeAnalysisReport


class ResumeStreamErrorEvent(StrictModel):
    type: Literal["error"]
    error: AnalysisError


ResumeStreamEvent = (
    ResumeStreamStageEvent | ResumeStreamCompleteEvent | ResumeStreamErrorEvent
)


# Imported late to keep the request schema available before the report definition.
ResumeAnalysisCreateRequest.model_rebuild()
GetAnalysisResponse.model_rebuild()
ResumeStreamCompleteEvent.model_rebuild()
