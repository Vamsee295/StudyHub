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
from app.services import llm_analyzer as llm
from app.services import resume_facts as facts
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
        # any 10-13 digit number written with spaces, dashes or brackets (+91 98765 43210, (555) 123-4567), but not a year range
        phone_match = next((m for m in re.finditer(r"\+?\(?\d[\d\s().-]{8,18}\d", text)
                            if 10 <= sum(ch.isdigit() for ch in m.group(0)) <= 13
                            and not re.search(r"(?:19|20)\d{2}\s*[-–]\s*(?:19|20)\d{2}", m.group(0))), None)

        # the name is usually the first short line without contact details or digits
        full_name = None
        for line in [l.strip() for l in text.split("\n") if l.strip()][:5]:
            if any(s in line.lower() for s in ("@", "http", "linkedin", "github")):
                continue
            if len(line.split()) in (2, 3, 4) and len(line) < 40 and not any(ch.isdigit() for ch in line):
                full_name = line
                break

        exp_match = re.findall(r"(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of\s+experience)?", text, re.IGNORECASE)
        return CandidateProfile(
            full_name=full_name,
            email=email_match.group(0) if email_match else None,
            phone=phone_match.group(0).strip() if phone_match else None,
            location=facts.location_in(text),
            years_of_experience=float(exp_match[0]) if exp_match else None,
        )

    # ------------------------------------------------------------------ facts
    async def _collect(self, target: ResumeAnalysisTarget, parsed: dict[str, Any], out: dict[str, Any]) -> AsyncGenerator[tuple[str, str], None]:
        """Does the real work stage by stage, filling `out`; yields (stage id, what was found) as it goes.
        AI steps fall back to the deterministic extraction when the provider is unavailable."""
        text = parsed.get("text", "")
        out["ai_parts"] = []

        yield "parse_resume", f"Read {parsed.get('word_count', len(text.split()))} words from {parsed.get('page_count', 1)} page(s)."
        out["candidate"] = self._extract_candidate_info(text)
        c = out["candidate"]
        yield "extract_candidate", "Found " + (", ".join(x for x, ok in (("email", c.email), ("phone", c.phone), ("name", c.full_name)) if ok) or "no contact details") + "."

        # requirements: the job description if given, otherwise the role's entry-level expectations
        core, secondary, keywords = [], [], []
        jd = (target.job_description or "").strip()
        if jd:
            try:
                req = await llm.extract_jd(jd)
                core = [facts.term_for(s) for s in req.required_skills if s.strip()]
                secondary = [facts.term_for(s) for s in req.preferred_skills if s.strip()]
                keywords = [k for k in req.keywords if k.strip()][:15]
                out["ai_parts"].append("job description")
            except Exception as e:  # noqa: BLE001
                logger.warning("AI job-description extraction failed, using the skill dictionary: %s", e)
            if not core:
                core = facts.terms_in(jd)
            if not keywords:
                keywords = [t.name for t in facts.terms_in(jd)][:15]
        out["requirements_source"] = "job description" if core else "role"
        if not core:
            core, secondary = facts.role_requirements(target.role)
        if not keywords:
            keywords = [t.name for t in [*core, *secondary]][:15]
        out.update(core=core, secondary=secondary, keywords=keywords)
        yield "extract_skills", f"Checking {len(core)} required and {len(secondary)} preferred skills from the {out['requirements_source']}."

        # resume structure: the AI first, every entry checked against the resume text
        structure = None
        try:
            s = await llm.extract_resume(text)
            structure = {
                "education": [e.model_dump() for e in s.education if facts.grounded(e.institution, text)],
                "experience": [e.model_dump() for e in s.experience if facts.grounded(e.role, text) or facts.grounded(e.company, text)],
                "projects": [p.model_dump() for p in s.projects if facts.grounded(p.name, text)],
                "certifications": [x for x in s.certifications if facts.grounded(x, text)],
            }
            for e in structure["experience"]:
                e["achievements"] = [a for a in e["achievements"] if facts.grounded(a, text)]
            for p in structure["projects"]:
                p["outcomes"] = [o for o in p["outcomes"] if facts.grounded(o, text)]
            out["ai_parts"].append("resume structure")
        except Exception as e:  # noqa: BLE001
            logger.warning("AI resume extraction failed, using section headings: %s", e)
        if structure is None:
            structure = {"education": facts.education_from(text), "experience": facts.experience_from(text),
                         "projects": facts.projects_from(text), "certifications": facts.certifications_from(text)}
        out["structure"] = structure
        yield "analyze_experience", f"Found {len(structure['experience'])} job or internship entr{'y' if len(structure['experience']) == 1 else 'ies'}."
        yield "analyze_projects", f"Found {len(structure['projects'])} project(s)."
        yield "analyze_education", f"Found {len(structure['education'])} education entr{'y' if len(structure['education']) == 1 else 'ies'} and {len(structure['certifications'])} certification(s)."

        out["keyword_counts"] = {k: facts.mentions(text, facts.term_for(k)) for k in keywords}
        yield "analyze_keywords", f"{sum(1 for n in out['keyword_counts'].values() if n)} of {len(keywords)} keywords appear in the resume."

        # semantic judgement of skills the exact match missed, plus company alignment
        out["judged"], out["alignment"] = {}, []
        unmatched = [t.name for t in [*core, *secondary] if not facts.term_in(text, t)]
        try:
            m = await llm.judge_skills(unmatched or [t.name for t in core][:5], text, target.company, target.custom_role or target.role, target.company_type)
            out["judged"] = {j.skill.lower(): j for j in m.skills if j.status == "missing" or facts.grounded(j.evidence, text)}
            out["alignment"] = [a for a in m.company_alignment if all(facts.grounded(q, text) for q in a.evidence)]
            out["ai_parts"].append("skill judgement")
        except Exception as e:  # noqa: BLE001
            logger.warning("AI skill judgement failed, exact matches only: %s", e)
        yield "compare_target_role", f"Compared against {target.custom_role or target.role}."
        yield "align_company", f"{len(out['alignment'])} company alignment factor(s) assessed." if out["alignment"] else "Company alignment needs the AI and wasn't assessed."
        yield "generate_recommendations", "Built the action plan from the gaps found."

    # ------------------------------------------------------------------ report
    def _evaluate_resume(self, analysis: ResumeAnalysis, parsed_resume: dict[str, Any], target: ResumeAnalysisTarget, f: dict[str, Any]) -> ResumeAnalysisReport:
        """Scores only what was found in the resume; nothing is assumed or filled in."""
        text = parsed_resume.get("text", "")
        text_lower = text.lower()
        word_count = parsed_resume.get("word_count", len(text.split()))
        page_count = parsed_resume.get("page_count", 1)
        candidate: CandidateProfile = f["candidate"]
        core, secondary, judged, st = f["core"], f["secondary"], f["judged"], f["structure"]
        role_label = target.custom_role or target.role.replace("_", " ").title()

        # ---- skills
        matched_skills: List[SkillMatch] = []
        partial_skills: List[SkillMatch] = []
        missing_skills: List[SkillMatch] = []
        core_hits = core_partial = sec_hits = 0
        for term, is_core in [*((t, True) for t in core), *((t, False) for t in secondary)]:
            j = judged.get(term.name.lower())
            if facts.term_in(text, term):
                n = facts.mentions(text, term)
                matched_skills.append(SkillMatch(name=term.name, status="matched", evidence=[f"Mentioned {n} time(s) in the resume."]))
                core_hits += is_core
                sec_hits += not is_core
            elif j and j.status == "matched":
                matched_skills.append(SkillMatch(name=term.name, status="matched", evidence=[j.evidence]))
                core_hits += is_core
                sec_hits += not is_core
            elif j and j.status == "partial":
                partial_skills.append(SkillMatch(name=term.name, status="partial", evidence=[j.evidence], recommendation=f"Related experience shown; name {term.name} explicitly if you've used it."))
                core_partial += is_core
            elif is_core:
                missing_skills.append(SkillMatch(name=term.name, status="missing", evidence=[], recommendation=f"Add {term.name} only if you've genuinely used it: in a project's stack, a bullet or your skills line."))
            else:
                partial_skills.append(SkillMatch(name=term.name, status="partial", evidence=[], recommendation=f"Preferred for {role_label}; worth learning or mentioning if you know it."))

        # ---- ATS checks on the actual text
        ats_checks: List[AtsCheck] = []
        ats_points = 0
        if candidate.email and candidate.phone:
            ats_checks.append(AtsCheck(id="contact", label="Contact Information", status="pass", detail="Email and phone number found.", evidence=[candidate.email, candidate.phone]))
            ats_points += 4
        elif candidate.email or candidate.phone:
            ats_checks.append(AtsCheck(id="contact", label="Contact Information", status="warning", detail="Only one of email and phone was found. Put both in the header.", evidence=[candidate.email or candidate.phone]))
            ats_points += 2
        else:
            ats_checks.append(AtsCheck(id="contact", label="Contact Information", status="fail", detail="No email or phone number found.", evidence=[]))

        found_sections = [k for k in ("education", "experience", "projects", "skills") if k in facts.split_sections(text)]
        if len(found_sections) >= 3:
            ats_checks.append(AtsCheck(id="headings", label="Section Headings", status="pass", detail=f"Recognised headings: {', '.join(found_sections).title()}.", evidence=found_sections))
            ats_points += 4
        else:
            ats_checks.append(AtsCheck(id="headings", label="Section Headings", status="warning" if found_sections else "fail",
                                       detail="Use plain headings on their own line: Education, Experience, Projects, Skills.", evidence=found_sections))
            ats_points += 2 if found_sections else 0

        if 250 <= word_count <= 1000:
            ats_checks.append(AtsCheck(id="length", label="Resume Length", status="pass", detail=f"{word_count} words on {page_count} page(s).", evidence=[f"{word_count} words"]))
            ats_points += 4
        else:
            short = word_count < 250
            ats_checks.append(AtsCheck(id="length", label="Resume Length", status="warning",
                                       detail="Very short: describe what you built and its results." if short else "Long for a fresher: aim for one page.", evidence=[f"{word_count} words"]))
            ats_points += 2

        bullets = [b for e in st["experience"] for b in e.get("achievements", [])] + [o for p in st["projects"] for o in p.get("outcomes", [])]
        verbs = ("developed", "built", "implemented", "designed", "created", "optimized", "optimised", "architected", "engineered", "deployed",
                 "led", "reduced", "improved", "automated", "migrated", "launched", "integrated", "analyzed", "analysed", "scaled", "tested")
        verb_bullets = [b for b in bullets if b.split()[0].lower().strip(",.") in verbs] if bullets else []
        if bullets and len(verb_bullets) / len(bullets) >= 0.6:
            ats_checks.append(AtsCheck(id="action_verbs", label="Action Verbs", status="pass", detail=f"{len(verb_bullets)} of {len(bullets)} bullets start with an action verb.", evidence=verb_bullets[:3]))
            ats_points += 4
        else:
            ats_checks.append(AtsCheck(id="action_verbs", label="Action Verbs", status="warning" if bullets else "fail",
                                       detail=f"{len(verb_bullets)} of {len(bullets)} bullets start with an action verb (Built, Designed, Reduced…)." if bullets else "No bullet points found under experience or projects.",
                                       evidence=verb_bullets[:3]))
            ats_points += 2 if bullets else 0

        quant = [b for b in bullets if facts.NUMBER.search(b)]
        if bullets and len(quant) / len(bullets) >= 0.4:
            ats_checks.append(AtsCheck(id="quantifiable", label="Measurable Results", status="pass", detail=f"{len(quant)} of {len(bullets)} bullets include a number.", evidence=quant[:3]))
            ats_points += 4
        else:
            ats_checks.append(AtsCheck(id="quantifiable", label="Measurable Results", status="warning" if quant else "fail",
                                       detail=f"{len(quant)} of {len(bullets)} bullets include a number. Add users, time saved or % improved where true.", evidence=quant[:3]))
            ats_points += 2 if quant else 0
        ats_score_100 = int(min(20, ats_points) / 20 * 100)

        # ---- keywords
        counts = f["keyword_counts"]
        keyword_items = [KeywordAnalysisItem(keyword=k, status="present" if n else "missing", count=n,
                                             context=f"Mentioned {n} time(s)." if n else f"Expected for {role_label}.") for k, n in counts.items()]
        kw_hits = sum(1 for n in counts.values() if n)

        # ---- scores, each from what was found
        skill_score = round(35 * (core_hits + 0.5 * core_partial) / max(1, len(core)))
        kw_score = round(20 * kw_hits / max(1, len(counts)))
        exps = st["experience"]
        exp_score = 0 if not exps else min(20, 10 + 5 * (len(exps) - 1) + (5 if any(facts.NUMBER.search(a) for e in exps for a in e.get("achievements", [])) else 0))
        projs = st["projects"]
        req_names = {t.name.lower() for t in [*core, *secondary]}
        relevant_projs = [p for p in projs if any(t.lower() in req_names or any(facts.term_in(t, r) for r in [*core, *secondary]) for t in p.get("technologies", []))]
        proj_score = min(10, 4 * len(projs)) + (5 if relevant_projs else 0) if projs else 0
        edu = st["education"]
        edu_score = 5 if any(e.get("degree") for e in edu) else 3 if edu else 0
        pref_score = round(5 * sec_hits / len(secondary)) if secondary else round(5 * core_hits / max(1, len(core)))
        total_score = max(0, min(100, skill_score + kw_score + exp_score + proj_score + edu_score + pref_score))

        score_breakdown = [
            ScoreBreakdownItem(label="Required Skills", value=skill_score, max_value=35, evidence=[f"{core_hits} of {len(core)} required skills shown" + (f", {core_partial} partly" if core_partial else "") + f" (from the {f['requirements_source']})."]),
            ScoreBreakdownItem(label="Technical Keywords", value=kw_score, max_value=20, evidence=[f"{kw_hits} of {len(counts)} keywords appear."]),
            ScoreBreakdownItem(label="Experience Match", value=exp_score, max_value=20, evidence=[f"{len(exps)} job or internship entr{'y' if len(exps) == 1 else 'ies'} found."]),
            ScoreBreakdownItem(label="Project Relevance", value=proj_score, max_value=15, evidence=[f"{len(projs)} project(s), {len(relevant_projs)} using required or preferred skills."]),
            ScoreBreakdownItem(label="Education Match", value=edu_score, max_value=5, evidence=["Degree found." if edu_score == 5 else "Institution found without a degree." if edu else "No education entry found."]),
            ScoreBreakdownItem(label="Preferred Skills", value=pref_score, max_value=5, evidence=[f"{sec_hits} of {len(secondary)} preferred skills shown." if secondary else "No preferred list; based on required skills."]),
        ]

        company_alignment = [CompanyAlignmentFactor(factor=a.factor, status=a.status, assessment=a.assessment, evidence=a.evidence) for a in f["alignment"]]
        if not company_alignment:
            company_alignment.append(CompanyAlignmentFactor(factor="Company alignment", status="not_assessed",
                                                            assessment="Needs the AI, which wasn't available for this analysis. Skill and ATS results above don't depend on it.", evidence=[]))

        issues: List[ResumeIssue] = []
        if ats_score_100 < 80:
            weak = [c.label for c in ats_checks if c.status != "pass"]
            issues.append(ResumeIssue(severity="high" if ats_score_100 < 50 else "medium", issue="Formatting may lose information in tracking systems", evidence=weak, recommendation="Fix the ATS checks marked warning or fail."))
        if missing_skills:
            issues.append(ResumeIssue(severity="high" if len(missing_skills) >= 3 else "medium", issue=f"Required skills for {role_label} not shown",
                                      evidence=[s.name for s in missing_skills[:5]], recommendation="Show them through projects or coursework if you have them; learn the most important ones if not."))
        if bullets and len(quant) / len(bullets) < 0.4:
            issues.append(ResumeIssue(severity="medium", issue="Few bullets show measurable results", evidence=[f"{len(quant)} of {len(bullets)} bullets include a number."], recommendation="Add real numbers: users, data size, time saved, % improved."))
        if not exps and not projs:
            issues.append(ResumeIssue(severity="high", issue="No experience or projects found", evidence=["No entries under Experience or Projects."], recommendation="Add 2-3 projects with what you built, the stack and the result."))

        action_plan: List[ActionItem] = []
        if missing_skills:
            action_plan.append(ActionItem(priority="high", category="Role Skills", action=f"Show {', '.join(s.name for s in missing_skills[:3])} if you've used them; otherwise build a small project with the most important one.",
                                          rationale=f"Required for {role_label}.", evidence=[f"{len(missing_skills)} required skill(s) not found."]))
        if not exps:
            action_plan.append(ActionItem(priority="medium", category="Experience", action="No internship yet: put Projects above Education and add open-source contributions, freelance work or hackathons if you have them.",
                                          rationale="For freshers, projects carry the weight that work experience would.", evidence=["No job or internship entries found."]))
        if bullets and len(quant) / len(bullets) < 0.4:
            action_plan.append(ActionItem(priority="medium", category="Impact & Metrics", action="Rewrite your weakest bullets as: did X, using Y, which achieved Z (with a number).",
                                          rationale="Results with numbers are what reviewers remember.", evidence=[f"{len(quant)} of {len(bullets)} bullets include a number."]))
        if ats_score_100 < 80:
            action_plan.append(ActionItem(priority="low", category="ATS Readiness", action="Use plain section headings, a text-based PDF (not a scan) and both email and phone in the header.",
                                          rationale="So automated screening reads everything.", evidence=[f"ATS score {ats_score_100}%."]))

        roles = [ExperienceEntry(role=e["role"], company=e.get("company") or "Not stated", duration=e.get("dates"), achievements=e.get("achievements", [])) for e in exps]
        projects = [ProjectEntry(name=p["name"], description=p.get("description"), technologies=p.get("technologies", []), outcomes=p.get("outcomes", []),
                                 relevance="high" if p in relevant_projs else "low" if p.get("technologies") else "not_assessed",
                                 evidence=[f"Uses {', '.join(p['technologies'][:5])}."] if p.get("technologies") else []) for p in projs]
        education = [EducationEntry(institution=e["institution"], degree=e.get("degree"), field_of_study=e.get("field_of_study"), graduation_date=e.get("graduation_date"),
                                    details=f"Score: {e['score']}" if e.get("score") else None) for e in edu]
        source = "AI-assisted (" + ", ".join(f["ai_parts"]) + ")" if f["ai_parts"] else "Rule-based (AI unavailable)"

        return ResumeAnalysisReport(
            analysis_id=analysis.id,
            status="completed",
            generated_at=datetime.utcnow(),
            target=target,
            candidate=candidate,
            overall_score=total_score,
            score_breakdown=score_breakdown,
            ats_compatibility=AtsCompatibility(score=ats_score_100, checks=ats_checks, summary=f"{sum(c.status == 'pass' for c in ats_checks)} of {len(ats_checks)} checks passed."),
            skill_matching=SkillMatching(matched=matched_skills, partial=partial_skills, missing=missing_skills,
                                         summary=f"{len(matched_skills)} skills shown, {len(missing_skills)} required skills missing. {source}."),
            keyword_analysis=keyword_items,
            experience=ExperienceAnalysis(years_of_experience=candidate.years_of_experience, roles=roles,
                                          findings=[f"{len(roles)} job or internship entr{'y' if len(roles) == 1 else 'ies'} found."] if roles else ["No jobs or internships found. That's normal for freshers; projects carry the weight."],
                                          evidence=[b for r in roles for b in r.achievements][:3]),
            projects=ProjectAnalysis(projects=projects,
                                     relevance_summary=f"{len(relevant_projs)} of {len(projects)} project(s) use skills this role asks for." if projects else "No projects found.",
                                     gaps=[] if relevant_projs else [f"Add a project that uses {', '.join(t.name for t in core[:2])}."]),
            education_certifications=EducationCertifications(education=education, certifications=st["certifications"],
                                                             findings=[f"{len(education)} education entr{'y' if len(education) == 1 else 'ies'} found."] if education else ["No education entry found."]),
            issues=issues,
            company_alignment=company_alignment,
            action_plan=action_plan,
        )

    # ------------------------------------------------------------------ runs
    def _target_of(self, analysis: ResumeAnalysis) -> ResumeAnalysisTarget:
        return ResumeAnalysisTarget(company=analysis.company, company_type=analysis.company_type, role=analysis.role,
                                    custom_role=analysis.custom_role, job_description=analysis.job_description)

    async def _save(self, analysis: ResumeAnalysis, report: ResumeAnalysisReport, stage_state: Optional[list] = None) -> None:
        analysis.status = "completed"
        analysis.current_stage = None
        if stage_state is not None:
            analysis.stage_state = json.dumps(stage_state)
        analysis.analysis_result = report.model_dump_json(by_alias=True)
        analysis.completed_at = datetime.utcnow()
        analysis.updated_at = datetime.utcnow()
        async with AsyncSessionLocal() as session:
            await session.merge(analysis)
            await session.commit()

    async def process_analysis(self, analysis_id: str, user_id: Optional[str] = None) -> ResumeAnalysisReport:
        analysis = await self.get_analysis(analysis_id, user_id)
        if not analysis:
            raise ResumeAnalysisServiceError("not_found", "Analysis not found")
        if analysis.status == "completed" and analysis.analysis_result:
            return ResumeAnalysisReport.model_validate_json(analysis.analysis_result)
        target, parsed = self._target_of(analysis), json.loads(analysis.parsed_resume) if analysis.parsed_resume else {}
        found: dict[str, Any] = {}
        async for _ in self._collect(target, parsed, found):
            pass
        report = self._evaluate_resume(analysis, parsed, target, found)
        await self._save(analysis, report)
        return report

    async def process_analysis_stream(self, analysis_id: str, user_id: Optional[str] = None) -> AsyncGenerator[str, None]:
        analysis = await self.get_analysis(analysis_id, user_id)
        if not analysis:
            err_event = ResumeStreamErrorEvent(type="error", error=AnalysisError(code="not_found", message="Analysis not found"))
            yield f"event: error\ndata: {err_event.model_dump_json(by_alias=True)}\n\n"
            return

        target, parsed = self._target_of(analysis), json.loads(analysis.parsed_resume) if analysis.parsed_resume else {}
        stage_state = self._create_initial_stage_state()
        index = {sid: i for i, (sid, _) in enumerate(self.STAGES)}
        analysis.status = "processing"
        analysis.started_at = datetime.utcnow()

        def emit(sid: str, status: str, message: str) -> str:
            i = index[sid]
            now = datetime.utcnow()
            stage_state[i]["status"] = status
            stage_state[i]["message"] = message[:300]
            stage_state[i]["started_at"] = stage_state[i]["started_at"] or now.isoformat()
            if status == "completed":
                stage_state[i]["completed_at"] = now.isoformat()
            stage = AnalysisStage(id=sid, label=self.STAGES[i][1], status=status, message=message[:300],
                                  completed_at=now if status == "completed" else None)
            return f"event: stage\ndata: {ResumeStreamStageEvent(type='stage', stage=stage).model_dump_json(by_alias=True)}\n\n"

        # each stage is reported when its real work finishes, with what it found
        found: dict[str, Any] = {}
        pending = [sid for sid, _ in self.STAGES]
        yield emit(pending[0], "processing", "Starting…")
        async for sid, message in self._collect(target, parsed, found):
            for earlier in pending[: pending.index(sid)]:  # stages with no separate work finish alongside
                yield emit(earlier, "completed", "Done.")
            pending = pending[pending.index(sid) + 1:]
            yield emit(sid, "completed", message)
            if pending:
                yield emit(pending[0], "processing", "Working…")

        report = self._evaluate_resume(analysis, parsed, target, found)
        for sid in pending:
            yield emit(sid, "completed", f"Score {report.overall_score}/100." if sid == "validate_report" else "Done.")
        await self._save(analysis, report, stage_state)

        complete_event = ResumeStreamCompleteEvent(type="complete", analysis=self.to_summary(analysis), report=report)
        yield f"event: complete\ndata: {complete_event.model_dump_json(by_alias=True)}\n\n"
