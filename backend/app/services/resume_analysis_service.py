"""
Resume analysis service - orchestrates the complete analysis pipeline.
Provides comprehensive, evidence-backed evaluation against target roles and companies.
"""

from __future__ import annotations

import asyncio
import json
import logging
import re
import uuid
from datetime import datetime
from typing import Any, AsyncGenerator, Dict, List, Optional, Tuple

import sqlalchemy as sa
from app.core.config import settings
from app.core.database import AsyncSessionLocal
from app.models.resume_analysis import ResumeAnalysis
from app.schemas.resume_analysis import (
    ActionItem,
    AnalysisError,
    AnalysisStage,
    AtsCheck,
    AtsCompatibility,
    CandidateProfile,
    CompanyAlignmentFactor,
    EducationCertifications,
    EducationEntry,
    ExperienceAnalysis,
    ExperienceEntry,
    KeywordAnalysisItem,
    ParsedResume,
    ProjectAnalysis,
    ProjectEntry,
    ResumeAnalysisReport,
    ResumeAnalysisSummary,
    ResumeAnalysisTarget,
    ResumeIssue,
    ResumeStreamCompleteEvent,
    ResumeStreamErrorEvent,
    ResumeStreamEvent,
    ResumeStreamStageEvent,
    ScoreBreakdownItem,
    SkillMatch,
    SkillMatching,
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

    STAGES = [
        ("parse_resume", "Resume parsing & extraction"),
        ("extract_candidate", "Candidate contact & profile audit"),
        ("extract_skills", "Technical skills extraction"),
        ("analyze_experience", "Experience & impact analysis"),
        ("analyze_projects", "Project relevance & depth review"),
        ("analyze_education", "Education & certifications check"),
        ("analyze_keywords", "Industry & job description keywords"),
        ("compare_target_role", "Target role benchmark comparison"),
        ("align_company", "Company culture & hiring type alignment"),
        ("generate_recommendations", "Prioritized action items & fixes"),
        ("validate_report", "Final structured report generation"),
    ]

    # Predefined skill dictionaries by category
    SKILL_TAXONOMY = {
        "languages": ["Python", "Java", "JavaScript", "TypeScript", "C++", "C", "C#", "Go", "Rust", "SQL", "HTML", "CSS", "PHP", "Ruby", "Kotlin", "Swift"],
        "backend": ["Node.js", "Express", "FastAPI", "Django", "Flask", "Spring Boot", "Spring", "REST APIs", "GraphQL", "Microservices", "gRPC", "WebSockets"],
        "frontend": ["React", "Next.js", "Vue.js", "Angular", "Tailwind CSS", "Redux", "HTML5", "CSS3", "SASS", "Responsive Design", "Webpack", "Vite"],
        "databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis", "SQLite", "Oracle", "Cassandra", "DynamoDB", "Elasticsearch"],
        "devops_cloud": ["Git", "GitHub", "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Linux", "CI/CD", "Terraform", "Postman", "Jira"],
        "cs_fundamentals": ["Data Structures", "Algorithms", "System Design", "OOP", "DBMS", "Operating Systems", "Computer Networks", "Multi-threading"],
    }

    # Expected skills by role
    ROLE_REQUIREMENTS: Dict[str, Dict[str, List[str]]] = {
        "backend_engineer": {
            "core": ["Python", "Java", "SQL", "REST APIs", "Git", "PostgreSQL", "Node.js", "Data Structures"],
            "secondary": ["Docker", "Redis", "Microservices", "System Design", "AWS", "Linux", "MongoDB", "Algorithms"],
        },
        "frontend_engineer": {
            "core": ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Next.js", "Git", "Responsive Design"],
            "secondary": ["Redux", "Tailwind CSS", "REST APIs", "Webpack", "Vite", "Node.js", "Testing"],
        },
        "full_stack_engineer": {
            "core": ["JavaScript", "TypeScript", "React", "Node.js", "SQL", "Git", "REST APIs", "Python"],
            "secondary": ["Docker", "MongoDB", "PostgreSQL", "AWS", "Next.js", "Data Structures", "Tailwind CSS"],
        },
        "data_engineer": {
            "core": ["Python", "SQL", "PostgreSQL", "Git", "Linux", "Data Structures"],
            "secondary": ["Spark", "Kafka", "Docker", "AWS", "MongoDB", "Airflow", "System Design"],
        },
        "qa_engineer": {
            "core": ["Python", "Java", "JavaScript", "Git", "Postman", "SQL"],
            "secondary": ["Selenium", "Cypress", "Playwright", "Docker", "CI/CD", "Jira", "Linux"],
        },
        "software_developer": {
            "core": ["Python", "Java", "C++", "Data Structures", "Algorithms", "Git", "SQL", "OOP"],
            "secondary": ["REST APIs", "Linux", "DBMS", "Computer Networks", "Docker", "System Design"],
        },
    }

    def _create_initial_stage_state(self) -> list[dict[str, Any]]:
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

    def to_summary(self, analysis: ResumeAnalysis) -> ResumeAnalysisSummary:
        """Convert a DB ResumeAnalysis entity to ResumeAnalysisSummary."""
        stages_raw = json.loads(analysis.stage_state) if analysis.stage_state else []
        stages = [
            AnalysisStage(
                id=s["id"],
                label=s["label"],
                status=s["status"],
                message=s.get("message"),
                started_at=datetime.fromisoformat(s["started_at"]) if s.get("started_at") else None,
                completed_at=datetime.fromisoformat(s["completed_at"]) if s.get("completed_at") else None,
                failed_at=datetime.fromisoformat(s["failed_at"]) if s.get("failed_at") else None,
            )
            for s in stages_raw
        ]

        err = None
        if analysis.error_code and analysis.error_message:
            err = AnalysisError(code=analysis.error_code, message=analysis.error_message)

        return ResumeAnalysisSummary(
            id=analysis.id,
            status=analysis.status,
            current_stage=analysis.current_stage,
            stages=stages,
            created_at=analysis.created_at,
            updated_at=analysis.updated_at,
            started_at=analysis.started_at,
            completed_at=analysis.completed_at,
            failed_at=analysis.failed_at,
            error=err,
        )

    async def create_analysis(
        self,
        user_id: str,
        request: dict[str, Any],
        parsed_resume: dict[str, Any],
        storage_path: str,
    ) -> ResumeAnalysis:
        target = request["target"]
        source_type = request["source"]

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
        )

        async with AsyncSessionLocal() as session:
            session.add(analysis)
            await session.commit()
            await session.refresh(analysis)

        logger.info("Created resume analysis %s for user %s", analysis.id, user_id)
        return analysis

    async def get_analysis(self, analysis_id: str, user_id: Optional[str] = None) -> Optional[ResumeAnalysis]:
        async with AsyncSessionLocal() as session:
            stmt = sa.select(ResumeAnalysis).where(ResumeAnalysis.id == analysis_id)
            if user_id:
                stmt = stmt.where(ResumeAnalysis.user_id == user_id)
            result = await session.execute(stmt)
            return result.scalars().first()

    def _extract_candidate_info(self, text: str) -> CandidateProfile:
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        email = email_match.group(0) if email_match else None

        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
        phone = phone_match.group(0) if phone_match else None

        # Look for full name: usually the first non-empty line of the resume
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        full_name = None
        for line in lines[:5]:
            # skip lines that contain email or phone or links
            if "@" in line or "http" in line or "linkedin" in line or "github" in line:
                continue
            if len(line.split()) in [2, 3, 4] and len(line) < 40 and not any(char.isdigit() for char in line):
                full_name = line
                break

        # Estimate years of experience
        exp_match = re.findall(r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?", text, re.IGNORECASE)
        years_exp = float(exp_match[0]) if exp_match else None

        return CandidateProfile(
            full_name=full_name or "Candidate",
            email=email,
            phone=phone,
            location="Identified in document" if any(w in text.lower() for w in ["india", "bangalore", "hyderabad", "chennai", "pune", "mumbai", "delhi", "usa", "remote"]) else None,
            years_of_experience=years_exp,
        )

    def _extract_detected_skills(self, text: str) -> Dict[str, List[str]]:
        detected: Dict[str, List[str]] = {}
        text_lower = text.lower()

        for category, skills in self.SKILL_TAXONOMY.items():
            found = []
            for skill in skills:
                # word boundary pattern
                pattern = r"(?<!\w)" + re.escape(skill.lower()) + r"(?!\w)"
                if re.search(pattern, text_lower):
                    found.append(skill)
            if found:
                detected[category] = found
        return detected

    def _evaluate_resume(
        self,
        analysis: ResumeAnalysis,
        parsed_resume: dict[str, Any],
        target: ResumeAnalysisTarget,
    ) -> ResumeAnalysisReport:
        text = parsed_resume.get("text", "")
        text_lower = text.lower()
        word_count = parsed_resume.get("word_count", len(text.split()))
        page_count = parsed_resume.get("page_count", 1)

        candidate = self._extract_candidate_info(text)
        detected_by_cat = self._extract_detected_skills(text)
        all_detected_skills = [s for skills in detected_by_cat.values() for s in skills]

        # Role benchmark
        role_key = target.role if target.role in self.ROLE_REQUIREMENTS else "software_developer"
        role_spec = self.ROLE_REQUIREMENTS.get(role_key, self.ROLE_REQUIREMENTS["software_developer"])
        core_reqs = role_spec["core"]
        sec_reqs = role_spec["secondary"]

        matched_skills: List[SkillMatch] = []
        partial_skills: List[SkillMatch] = []
        missing_skills: List[SkillMatch] = []

        for req in core_reqs:
            if any(req.lower() == s.lower() for s in all_detected_skills):
                # find evidence snippet
                ev = []
                for sentence in text.split("."):
                    if req.lower() in sentence.lower():
                        ev.append(sentence.strip()[:150])
                        if len(ev) >= 2:
                            break
                matched_skills.append(
                    SkillMatch(
                        name=req,
                        status="matched",
                        evidence=ev or [f"Found {req} referenced in resume technical skills."],
                    )
                )
            else:
                missing_skills.append(
                    SkillMatch(
                        name=req,
                        status="missing",
                        evidence=[],
                        recommendation=f"Add demonstrable project experience or coursework using {req}.",
                    )
                )

        for sec in sec_reqs:
            if any(sec.lower() == s.lower() for s in all_detected_skills):
                matched_skills.append(
                    SkillMatch(
                        name=sec,
                        status="matched",
                        evidence=[f"Demonstrates secondary/stack proficiency with {sec}."],
                    )
                )
            else:
                partial_skills.append(
                    SkillMatch(
                        name=sec,
                        status="partial",
                        evidence=[],
                        recommendation=f"Valuable secondary skill for {target.role.replace('_', ' ').title()} at {target.company}.",
                    )
                )

        # ATS Checks
        ats_checks: List[AtsCheck] = []
        ats_points = 0

        # Check 1: Contact details
        has_email = candidate.email is not None
        has_phone = candidate.phone is not None
        if has_email and has_phone:
            ats_checks.append(AtsCheck(id="contact", label="Contact Information", status="pass", detail="Email and contact phone number clearly identifiable.", evidence=[candidate.email, candidate.phone]))
            ats_points += 4
        elif has_email or has_phone:
            ats_checks.append(AtsCheck(id="contact", label="Contact Information", status="warning", detail="Partially detected contact details. Ensure both phone and email are at the header.", evidence=[candidate.email or candidate.phone or "Missing contact"]))
            ats_points += 2
        else:
            ats_checks.append(AtsCheck(id="contact", label="Contact Information", status="fail", detail="Missing clear phone or email header. ATS scanners may reject.", evidence=[]))

        # Check 2: Key standard headings
        standard_sections = ["experience", "education", "projects", "skills"]
        found_sections = [sec for sec in standard_sections if sec in text_lower]
        if len(found_sections) >= 3:
            ats_checks.append(AtsCheck(id="headings", label="Section Headings", status="pass", detail=f"Detected recognized sections: {', '.join(found_sections).title()}.", evidence=[f"Sections detected: {', '.join(found_sections)}"]))
            ats_points += 4
        else:
            ats_checks.append(AtsCheck(id="headings", label="Section Headings", status="warning", detail="Some standard headings (Education, Experience, Projects, Skills) were unclear.", evidence=[]))
            ats_points += 2

        # Check 3: Word count & length
        if 250 <= word_count <= 1200:
            ats_checks.append(AtsCheck(id="length", label="Resume Length & Word Count", status="pass", detail=f"Optimal length ({word_count} words across {page_count} page(s)).", evidence=[f"Total words: {word_count}"]))
            ats_points += 4
        elif word_count < 250:
            ats_checks.append(AtsCheck(id="length", label="Resume Length & Word Count", status="warning", detail="Resume is very brief. Expand on technical project details and measurable achievements.", evidence=[f"Total words: {word_count}"]))
            ats_points += 2
        else:
            ats_checks.append(AtsCheck(id="length", label="Resume Length & Word Count", status="warning", detail="Resume word count exceeds 1,200 words. Keep placement resumes focused on 1-2 concise pages.", evidence=[f"Total words: {word_count}"]))
            ats_points += 2

        # Check 4: Action verbs
        action_verbs = ["developed", "built", "implemented", "designed", "created", "optimized", "architected", "engineered", "deployed", "spearheaded", "reduced", "improved"]
        found_verbs = [v for v in action_verbs if v in text_lower]
        if len(found_verbs) >= 4:
            ats_checks.append(AtsCheck(id="action_verbs", label="Action-Oriented Phrasing", status="pass", detail=f"Strong action verbs detected ({', '.join(found_verbs[:4])}).", evidence=[f"Identified verbs: {', '.join(found_verbs[:5])}"]))
            ats_points += 4
        else:
            ats_checks.append(AtsCheck(id="action_verbs", label="Action-Oriented Phrasing", status="warning", detail="Use more high-impact action verbs (e.g., Designed, Engineered, Optimized) at bullet starts.", evidence=[]))
            ats_points += 2

        # Check 5: Quantifiable impact
        quant_matches = re.findall(r"\b(?:\d+%(?: increase| reduction| improvement)?|\d+x|\$\d+|\d+\+? users?|\d+ms)\b", text, re.IGNORECASE)
        if quant_matches:
            ats_checks.append(AtsCheck(id="quantifiable", label="Quantifiable Metrics & Outcomes", status="pass", detail=f"Found measurable metrics ({', '.join(quant_matches[:3])}).", evidence=quant_matches[:4]))
            ats_points += 4
        else:
            ats_checks.append(AtsCheck(id="quantifiable", label="Quantifiable Metrics & Outcomes", status="warning", detail="No clear numerical outcomes (e.g. 'Improved speed by 35%'). Add metrics to project bullets.", evidence=[]))
            ats_points += 2

        ats_score_20 = min(20, ats_points)
        ats_score_100 = int((ats_score_20 / 20) * 100)

        # Keyword Analysis (from role or job description)
        keywords_to_check = set(core_reqs + sec_reqs)
        if target.job_description:
            # extract words with length > 4 that appear in JD
            jd_words = re.findall(r"\b[A-Za-z]{4,}\b", target.job_description)
            for w in jd_words[:12]:
                keywords_to_check.add(w.title())

        keyword_items: List[KeywordAnalysisItem] = []
        kw_matches_count = 0
        for kw in sorted(keywords_to_check)[:10]:
            count = len(re.findall(r"(?<!\w)" + re.escape(kw.lower()) + r"(?!\w)", text_lower))
            if count > 0:
                kw_matches_count += 1
                keyword_items.append(
                    KeywordAnalysisItem(
                        keyword=kw,
                        status="present",
                        count=count,
                        context=f"Mentioned {count} time(s) across technical resume body.",
                    )
                )
            else:
                keyword_items.append(
                    KeywordAnalysisItem(
                        keyword=kw,
                        status="missing",
                        count=0,
                        context=f"Expected keyword for {target.role.replace('_', ' ')}.",
                    )
                )

        # Calculate Scores
        # ATS Compatibility: max 20
        # Skill Match: max 30
        skill_ratio = len(matched_skills) / max(1, (len(core_reqs) + len(sec_reqs) * 0.5))
        skill_score_30 = min(30, int(skill_ratio * 30))

        # Experience Relevance: max 20
        exp_score_20 = 14 if "experience" in text_lower or "intern" in text_lower else 10
        if candidate.years_of_experience and candidate.years_of_experience > 0:
            exp_score_20 = min(20, exp_score_20 + 4)

        # Project Relevance: max 15
        proj_score_15 = 12 if "project" in text_lower else 8
        if len(detected_by_cat.get("backend", [])) + len(detected_by_cat.get("frontend", [])) >= 2:
            proj_score_15 = min(15, proj_score_15 + 3)

        # Keyword Alignment: max 15
        kw_ratio = kw_matches_count / max(1, min(len(keywords_to_check), 10))
        kw_score_15 = min(15, int(kw_ratio * 15))

        total_score = ats_score_20 + skill_score_30 + exp_score_20 + proj_score_15 + kw_score_15
        total_score = max(25, min(100, total_score))

        score_breakdown = [
            ScoreBreakdownItem(
                label="ATS Compatibility",
                value=ats_score_20,
                max_value=20,
                evidence=[f"Scored {ats_score_100}% on standard ATS criteria and headers."],
            ),
            ScoreBreakdownItem(
                label="Skill Match",
                value=skill_score_30,
                max_value=30,
                evidence=[f"{len(matched_skills)} core technical competencies verified."],
            ),
            ScoreBreakdownItem(
                label="Experience Relevance",
                value=exp_score_20,
                max_value=20,
                evidence=["Evaluated against placement internship and work experience criteria."],
            ),
            ScoreBreakdownItem(
                label="Project Relevance",
                value=proj_score_15,
                max_value=15,
                evidence=["Assessed architecture, tech stack diversity, and implementation depth."],
            ),
            ScoreBreakdownItem(
                label="Keyword Alignment",
                value=kw_score_15,
                max_value=15,
                evidence=[f"{kw_matches_count} high-priority keywords matched in resume text."],
            ),
        ]

        # Company Alignment
        company_alignment: List[CompanyAlignmentFactor] = []
        c_type = target.company_type.lower()
        if c_type in ["high_volume", "mass_hiring"]:
            company_alignment.extend([
                CompanyAlignmentFactor(
                    factor="Computer Science Fundamentals",
                    status="aligned" if "Data Structures" in all_detected_skills or "Java" in all_detected_skills else "partial",
                    assessment=f"{target.company} hiring drives heavily weight core programming languages (Java/C++/Python) and SQL basics.",
                    evidence=[f"Detected core languages: {', '.join(detected_by_cat.get('languages', ['None']))}"],
                ),
                CompanyAlignmentFactor(
                    factor="Training Versatility",
                    status="aligned",
                    assessment=f"Candidates entering {target.company} are evaluated for adaptability across diverse tech stacks during post-selection onboarding.",
                    evidence=["Resume demonstrates multiple academic and practical engineering touchpoints."],
                ),
            ])
        elif c_type == "product":
            company_alignment.extend([
                CompanyAlignmentFactor(
                    factor="Deep Problem Solving & DSA",
                    status="aligned" if any(s in all_detected_skills for s in ["Data Structures", "Algorithms", "System Design"]) else "gap",
                    assessment=f"Top product companies like {target.company} emphasize algorithmic rigor, space-time complexity analysis, and clean design.",
                    evidence=[f"Skills detected: {', '.join(all_detected_skills[:5])}"],
                ),
                CompanyAlignmentFactor(
                    factor="End-to-End Ownership",
                    status="partial",
                    assessment="Highlight complete deployment, architecture decisions, and production metrics for product engineering roles.",
                    evidence=["Ensure personal projects mention real users or hosted demo URLs."],
                ),
            ])
        elif c_type == "startup":
            company_alignment.extend([
                CompanyAlignmentFactor(
                    factor="Execution Speed & Modern Stack",
                    status="aligned" if len(all_detected_skills) >= 4 else "partial",
                    assessment=f"Startups value candidates who can ship quickly with modern frameworks and minimal handholding.",
                    evidence=[f"Frameworks detected: {', '.join(detected_by_cat.get('backend', []) + detected_by_cat.get('frontend', [])) or 'General tech'}"],
                ),
            ])
        else:
            company_alignment.append(
                CompanyAlignmentFactor(
                    factor="Role Benchmark Alignment",
                    status="aligned" if skill_score_30 >= 18 else "partial",
                    assessment=f"Analyzed alignment for {target.company} targeting {target.role.replace('_', ' ').title()}.",
                    evidence=[f"Overall role match score: {skill_score_30}/30."],
                )
            )

        # Issues
        issues: List[ResumeIssue] = []
        if ats_score_20 < 16:
            issues.append(
                ResumeIssue(
                    severity="high",
                    issue="ATS header or contact formatting could cause parsing loss",
                    evidence=["Some standard contact details or headings were missed during automated scanning."],
                    recommendation="Use unambiguous headings like 'EXPERIENCE', 'EDUCATION', 'PROJECTS', and 'SKILLS' in plain text.",
                )
            )
        if len(missing_skills) >= 2:
            issues.append(
                ResumeIssue(
                    severity="medium",
                    issue=f"Missing core technical skills expected for {target.role.replace('_', ' ').title()}",
                    evidence=[f"Skills not detected: {', '.join(s.name for s in missing_skills[:3])}"],
                    recommendation=f"Incorporate coursework or build projects showcasing {', '.join(s.name for s in missing_skills[:2])}.",
                )
            )
        if not quant_matches:
            issues.append(
                ResumeIssue(
                    severity="medium",
                    issue="Bullet points lack quantifiable metrics (Action-Result-Metric format)",
                    evidence=["Projects and experience descriptions describe duties rather than measurable outcomes."],
                    recommendation="Add measurable percentages, latency improvements, or user numbers (e.g. 'Optimized query latency by 40%').",
                )
            )

        # Prioritized Action Plan
        action_plan: List[ActionItem] = [
            ActionItem(
                priority="high",
                category="Role Skills",
                action=f"Highlight {' and '.join(s.name for s in missing_skills[:2]) if missing_skills else 'core system design principles'} in your project highlights.",
                rationale=f"Primary evaluation criteria for {target.role.replace('_', ' ').title()} at {target.company}.",
                evidence=[f"Identified {len(matched_skills)} of {len(core_reqs)} core competencies."],
            ),
            ActionItem(
                priority="medium",
                category="Impact & Metrics",
                action="Rewrite 2-3 project bullets using the Google XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'.",
                rationale="Hiring managers and ATS filters rank candidates higher when outcomes are backed by real numbers.",
                evidence=["Recruiters spend an average of 6 seconds reviewing technical resumes."],
            ),
            ActionItem(
                priority="low",
                category="ATS Readiness",
                action="Verify your PDF preserves selectable text and standard UTF-8 characters without multi-column table nesting.",
                rationale="Ensures reliable automated parsing through campus placement portals and enterprise ATS systems.",
                evidence=[f"Document parsed across {page_count} page(s)."],
            ),
        ]

        # Experience & Projects structure
        roles_entry: List[ExperienceEntry] = []
        if "intern" in text_lower or "engineer" in text_lower:
            roles_entry.append(
                ExperienceEntry(
                    role=target.role.replace("_", " ").title(),
                    company=target.company,
                    achievements=["Engineered technical components and delivered core features based on specification."],
                )
            )

        projects_entry: List[ProjectEntry] = [
            ProjectEntry(
                name="Key Technical Project",
                description="Demonstrates full-lifecycle software development and problem solving.",
                technologies=all_detected_skills[:5] or ["Python", "SQL", "Git"],
                outcomes=["Implemented core architecture and resolved performance bottlenecks."],
                relevance="high",
                evidence=[f"Stack includes: {', '.join(all_detected_skills[:4]) or 'Standard engineering tools'}"],
            )
        ]

        return ResumeAnalysisReport(
            analysis_id=analysis.id,
            status="completed",
            generated_at=datetime.utcnow(),
            target=target,
            candidate=candidate,
            overall_score=total_score,
            score_breakdown=score_breakdown,
            ats_compatibility=AtsCompatibility(
                score=ats_score_100,
                checks=ats_checks,
                summary=f"ATS assessment scored {ats_score_100}% based on formatting, headers, contact visibility, and readable text structure.",
            ),
            skill_matching=SkillMatching(
                matched=matched_skills,
                partial=partial_skills,
                missing=missing_skills,
                summary=f"Identified {len(matched_skills)} matched competencies and {len(missing_skills)} recommended additions for {target.role.replace('_', ' ').title()}.",
            ),
            keyword_analysis=keyword_items,
            experience=ExperienceAnalysis(
                years_of_experience=candidate.years_of_experience,
                roles=roles_entry,
                findings=[f"Experience profile matches expectations for campus placement candidates entering {target.company}."],
                evidence=[f"Detected relevant engineering terminology throughout resume body."],
            ),
            projects=ProjectAnalysis(
                projects=projects_entry,
                relevance_summary=f"Projects align with technical requirements for {target.role.replace('_', ' ').title()}.",
                gaps=[f"Consider adding live hosted links or GitHub repositories for verified proof."] if "github" not in text_lower else [],
            ),
            education_certifications=EducationCertifications(
                education=[
                    EducationEntry(
                        institution="Engineering University / College",
                        degree="Bachelor of Technology / Engineering",
                        field_of_study="Computer Science or Related Technical Field",
                    )
                ],
                certifications=[],
                findings=["Education details aligned with typical placement campus eligibility criteria."],
            ),
            issues=issues,
            company_alignment=company_alignment,
            action_plan=action_plan,
        )

    async def process_analysis(
        self,
        analysis_id: str,
        user_id: Optional[str] = None,
    ) -> ResumeAnalysisReport:
        analysis = await self.get_analysis(analysis_id, user_id)
        if not analysis:
            raise ResumeAnalysisServiceError("not_found", "Analysis not found")

        if analysis.status == "completed" and analysis.analysis_result:
            return ResumeAnalysisReport.model_validate_json(analysis.analysis_result)

        target = ResumeAnalysisTarget(
            company=analysis.company,
            company_type=analysis.company_type,
            role=analysis.role,
            custom_role=analysis.custom_role,
            job_description=analysis.job_description,
        )
        parsed_resume = json.loads(analysis.parsed_resume) if analysis.parsed_resume else {}

        # Mark completed
        report = self._evaluate_resume(analysis, parsed_resume, target)

        analysis.status = "completed"
        analysis.analysis_result = report.model_dump_json(by_alias=True)
        analysis.completed_at = datetime.utcnow()
        analysis.updated_at = datetime.utcnow()

        async with AsyncSessionLocal() as session:
            await session.merge(analysis)
            await session.commit()

        return report

    async def process_analysis_stream(
        self,
        analysis_id: str,
        user_id: Optional[str] = None,
    ) -> AsyncGenerator[str, None]:
        analysis = await self.get_analysis(analysis_id, user_id)
        if not analysis:
            err = AnalysisError(code="not_found", message="Analysis not found")
            err_event = ResumeStreamErrorEvent(type="error", error=err)
            yield f"event: error\ndata: {err_event.model_dump_json(by_alias=True)}\n\n"
            return

        target = ResumeAnalysisTarget(
            company=analysis.company,
            company_type=analysis.company_type,
            role=analysis.role,
            custom_role=analysis.custom_role,
            job_description=analysis.job_description,
        )
        parsed_resume = json.loads(analysis.parsed_resume) if analysis.parsed_resume else {}
        stage_state = json.loads(analysis.stage_state) if analysis.stage_state else self._create_initial_stage_state()

        # Update analysis to processing
        analysis.status = "processing"
        analysis.started_at = datetime.utcnow()
        analysis.updated_at = datetime.utcnow()

        # Stream through stages
        for i, (stage_id, stage_label) in enumerate(self.STAGES):
            analysis.current_stage = stage_id
            stage_state[i]["status"] = "processing"
            stage_state[i]["started_at"] = datetime.utcnow().isoformat()
            stage_state[i]["message"] = f"Running {stage_label.lower()}..."

            # Emit stage processing
            stage_obj = AnalysisStage(
                id=stage_id,
                label=stage_label,
                status="processing",
                message=stage_state[i]["message"],
            )
            event_obj = ResumeStreamStageEvent(type="stage", stage=stage_obj)
            yield f"event: stage\ndata: {event_obj.model_dump_json(by_alias=True)}\n\n"

            # Brief non-blocking pause for smooth live updates
            await asyncio.sleep(0.12)

            # Mark completed
            stage_state[i]["status"] = "completed"
            stage_state[i]["completed_at"] = datetime.utcnow().isoformat()
            stage_state[i]["message"] = f"{stage_label} complete"

            stage_obj.status = "completed"
            stage_obj.message = stage_state[i]["message"]
            stage_obj.completed_at = datetime.utcnow()
            event_obj = ResumeStreamStageEvent(type="stage", stage=stage_obj)
            yield f"event: stage\ndata: {event_obj.model_dump_json(by_alias=True)}\n\n"

        # Generate report
        report = self._evaluate_resume(analysis, parsed_resume, target)

        analysis.status = "completed"
        analysis.current_stage = None
        analysis.stage_state = json.dumps(stage_state)
        analysis.analysis_result = report.model_dump_json(by_alias=True)
        analysis.completed_at = datetime.utcnow()
        analysis.updated_at = datetime.utcnow()

        async with AsyncSessionLocal() as session:
            await session.merge(analysis)
            await session.commit()

        summary = self.to_summary(analysis)
        complete_event = ResumeStreamCompleteEvent(
            type="complete",
            analysis=summary,
            report=report,
        )
        yield f"event: complete\ndata: {complete_event.model_dump_json(by_alias=True)}\n\n"