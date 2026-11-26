"""The resume report comes only from the resume: weak resumes score low, nothing is invented."""
import asyncio
from types import SimpleNamespace

import pytest

from app.schemas.resume_analysis import ResumeAnalysisTarget
from app.services import llm_analyzer
from app.services.resume_analysis_service import ResumeAnalysisService

WEAK = """Test Student
test@example.com
EDUCATION
Some College
SKILLS
Python
EXPERIENCE
None yet.
PROJECTS
Made a calculator."""

STRONG = """Aarav Mehta
aarav@example.com | +91 98765 43210 | Bengaluru | github.com/aarav
EDUCATION
National Institute of Technology, Trichy    2022 - 2026
B.Tech, Computer Science, CGPA 8.7/10
EXPERIENCE
Frontend Intern, Kirana Cloud    Jun 2025 - Aug 2025
- Rebuilt the order dashboard in React and TypeScript, cutting load time from 3.8 s to 1.6 s
- Created 24 reusable components with Jest tests used across 3 apps
PROJECTS
StudyBuddy | Next.js, TypeScript, Tailwind
- Built a study planner used by 2,300 students with responsive design
- Added accessibility fixes to meet WCAG 2.1 AA
Pixel Editor | React, JavaScript, HTML, CSS
- Designed a browser image editor handling 20 MP images at 60 fps
SKILLS
JavaScript, TypeScript, React, Next.js, Redux, HTML, CSS, Tailwind, Git, REST APIs, Jest"""


@pytest.fixture(autouse=True)
def no_ai(monkeypatch):
    async def down(*_a, **_k):
        raise RuntimeError("AI unavailable")

    for name in ("extract_jd", "extract_resume", "judge_skills"):
        monkeypatch.setattr(llm_analyzer, name, down)


def report_for(text, role="frontend_engineer", jd=None):
    svc = ResumeAnalysisService()
    target = ResumeAnalysisTarget(company="Flipkart", company_type="product", role=role, custom_role=None, job_description=jd)
    parsed = {"text": text, "word_count": len(text.split()), "page_count": 1}

    async def run():
        found = {}
        stages = [sid async for sid, _ in svc._collect(target, parsed, found)]
        return stages, svc._evaluate_resume(SimpleNamespace(id="t"), parsed, target, found)

    return asyncio.run(run())


def test_weak_resume_gets_no_invented_entries_and_a_low_score():
    _, r = report_for(WEAK)
    assert r.overall_score < 25, r.overall_score
    assert r.experience.roles == [], "no experience is invented from the target company"
    assert [p.name for p in r.projects.projects] == ["Made a calculator."]
    assert [e.institution for e in r.education_certifications.education] == ["Some College"]
    assert r.score_breakdown[2].value == 0, "no experience points for an empty section"
    assert {"React", "HTML", "CSS"} <= {s.name for s in r.skill_matching.missing}, "frontend role checks frontend skills"
    assert r.company_alignment[0].status == "not_assessed"
    assert "Rule-based" in r.skill_matching.summary


def test_strong_resume_scores_high_from_real_entries():
    stages, r = report_for(STRONG)
    assert r.overall_score >= 80, r.overall_score
    assert [(e.role, e.company) for e in r.experience.roles] == [("Frontend Intern", "Kirana Cloud")]
    assert [p.name for p in r.projects.projects] == ["StudyBuddy", "Pixel Editor"]
    assert r.education_certifications.education[0].details == "Score: 8.7/10"
    assert r.candidate.location == "Bengaluru"
    assert not r.skill_matching.missing
    assert stages[0] == "parse_resume" and stages[-1] == "generate_recommendations"


def test_parser_keeps_lines_so_headings_name_and_phone_are_found():
    from app.services.resume_parser import ResumeParser

    parsed = ResumeParser().parse_text(STRONG.replace("\n", "\n   "))  # messy indentation, as pasted text often is
    assert parsed["text"].splitlines()[0] == "Aarav Mehta"
    _, r = report_for(parsed["text"])
    assert r.candidate.full_name == "Aarav Mehta" and r.candidate.phone == "+91 98765 43210"
    checks = {c.id: c.status for c in r.ats_compatibility.checks}
    assert checks["headings"] == "pass" and checks["contact"] == "pass"


def test_job_description_keywords_are_skills_not_filler_words():
    _, r = report_for(STRONG, jd="We need React, TypeScript, CSS and testing with Jest.")
    words = {k.keyword for k in r.keyword_analysis}
    assert {"React", "TypeScript", "CSS"} <= words and not words & {"Need", "With"}
