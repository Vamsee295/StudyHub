"""
Deterministic resume facts: skill dictionary, per-role requirements, job-description keywords and
section-based extraction of education, experience and projects. Used on its own when the AI is
unavailable, and to check the AI's output against the resume text.
"""
from __future__ import annotations

import re
from dataclasses import dataclass, field

# ---------- skill dictionary: a name and other spellings that count as the same skill ----------
@dataclass(frozen=True)
class Term:
    name: str
    alts: tuple[str, ...] = ()

    def spellings(self) -> tuple[str, ...]:
        return (self.name, *self.alts)


def T(name: str, *alts: str) -> Term:
    return Term(name, alts)


TERMS: list[Term] = [
    T("Java"), T("Python"), T("JavaScript", "JS", "ECMAScript"), T("TypeScript"), T("C++", "CPP"), T("C#"), T("Go", "Golang"),
    T("Kotlin"), T("Swift"), T("Ruby"), T("PHP"), T("Scala"), T("SQL"), T("Bash", "Shell scripting"),
    T("React", "React.js", "ReactJS"), T("Next.js", "NextJS"), T("Angular"), T("Vue", "Vue.js"), T("HTML", "HTML5"), T("CSS", "CSS3"),
    T("Tailwind", "Tailwind CSS"), T("Redux"), T("Node.js", "NodeJS", "Node"), T("Express", "Express.js"), T("Spring Boot", "Spring"),
    T("Django"), T("Flask"), T("FastAPI"), T(".NET", "ASP.NET"), T("REST APIs", "REST", "RESTful", "REST API"), T("GraphQL"),
    T("Microservices", "microservice"), T("PostgreSQL", "Postgres"), T("MySQL"), T("MongoDB", "Mongo"), T("Redis"), T("Kafka"),
    T("Elasticsearch"), T("NoSQL"), T("Spark", "Apache Spark", "PySpark"), T("Hadoop"), T("Airflow"), T("ETL"),
    T("Data warehouse", "data warehousing", "Redshift", "BigQuery"), T("Snowflake"), T("Pandas"), T("NumPy"), T("Excel"), T("Power BI"),
    T("Tableau"), T("Machine learning", "ML"), T("Deep learning"), T("TensorFlow"), T("PyTorch"), T("scikit-learn", "sklearn"),
    T("AWS", "Amazon Web Services"), T("Azure"), T("GCP", "Google Cloud"), T("Docker"), T("Kubernetes", "k8s"), T("Terraform"),
    T("CI/CD", "continuous integration", "GitHub Actions", "Jenkins"), T("Linux"), T("Git", "GitHub", "GitLab"),
    T("Data structures", "data structure", "DSA"), T("Algorithms", "algorithm"), T("OOP", "object-oriented", "object oriented"),
    T("System design"), T("Unit testing", "unit tests", "JUnit", "pytest", "Jest"), T("Operating systems"), T("DBMS"),
    T("Computer networks", "networking"), T("Agile", "Scrum"), T("Selenium"), T("Cypress"), T("Playwright"),
    T("Automation testing", "test automation", "automated testing"), T("Manual testing", "test cases", "test case"),
    T("API testing", "Postman"), T("JIRA"), T("Responsive design", "responsive"), T("Accessibility", "a11y", "WCAG"),
]
_BY_NAME = {t.name.lower(): t for t in TERMS}

# "Any one of these" requirements, e.g. a backend role needs one server language, not all of them.
LANG_ANY = T("A core language (Java, Python or C++)", "Java", "Python", "C++", "C#", "Go")
SERVER_ANY = T("A backend language (Java, Python, Node.js or Go)", "Java", "Python", "Node.js", "Node", "Go", "C#")
DB_ANY = T("A database (SQL or NoSQL)", "SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle")
BACKEND_FW_ANY = T("A backend framework", "Spring Boot", "Spring", "Django", "Flask", "FastAPI", "Express", "Node.js", ".NET")

_t = lambda *names: [_BY_NAME[n.lower()] for n in names]  # noqa: E731

# Entry-level expectations per role in the analyzer's role picker (core = expected, secondary = strengthens).
ROLE_SKILLS: dict[str, tuple[list[Term], list[Term]]] = {
    "software_developer": ([LANG_ANY, *_t("Data structures", "Algorithms", "OOP", "SQL", "Git")],
                           _t("REST APIs", "System design", "Unit testing", "Linux", "DBMS", "Operating systems", "Computer networks")),
    "frontend_engineer": (_t("JavaScript", "HTML", "CSS", "React", "Git"),
                          _t("TypeScript", "Next.js", "Redux", "Tailwind", "REST APIs", "Unit testing", "Responsive design", "Accessibility")),
    "backend_engineer": ([SERVER_ANY, DB_ANY, *_t("REST APIs", "SQL", "Git")],
                         [BACKEND_FW_ANY, *_t("Microservices", "Redis", "Docker", "System design", "Unit testing", "Linux")]),
    "full_stack_engineer": ([*_t("JavaScript", "React", "HTML", "CSS"), SERVER_ANY, DB_ANY, *_t("REST APIs", "Git")],
                            _t("TypeScript", "Next.js", "Express", "Docker", "AWS", "Unit testing")),
    "data_engineer": (_t("Python", "SQL", "ETL", "Spark", "Data warehouse"),
                      _t("Airflow", "Kafka", "AWS", "Hadoop", "Snowflake", "Pandas", "Docker", "Linux")),
    "qa_engineer": (_t("Manual testing", "Automation testing", "Selenium", "SQL", "API testing"),
                    [LANG_ANY, *_t("JIRA", "CI/CD", "Cypress", "Playwright", "Unit testing", "Git", "Agile")]),
}
ROLE_SKILLS["custom"] = ROLE_SKILLS["software_developer"]


def role_requirements(role: str) -> tuple[list[Term], list[Term]]:
    return ROLE_SKILLS.get(role, ROLE_SKILLS["software_developer"])


def _has(text: str, word: str) -> bool:
    # whole-word match that also works for C++, C#, .NET and Node.js; short words must match case
    pattern = r"(?<![A-Za-z0-9+#.])" + re.escape(word) + r"(?![A-Za-z0-9+#])"
    return re.search(pattern, text, 0 if len(word) <= 2 else re.IGNORECASE) is not None


def term_in(text: str, term: Term) -> bool:
    return any(_has(text, w) for w in term.spellings())


def mentions(text: str, term: Term) -> int:
    return sum(len(re.findall(r"(?<![A-Za-z0-9+#.])" + re.escape(w) + r"(?![A-Za-z0-9+#])", text, re.IGNORECASE)) for w in term.spellings())


def terms_in(text: str) -> list[Term]:
    """Dictionary skills mentioned in a text (used for job descriptions without the AI)."""
    return [t for t in TERMS if term_in(text, t)]


def term_for(name: str) -> Term:
    return _BY_NAME.get(name.lower().strip(), Term(name.strip()))


# ---------- section extraction ----------
HEADINGS = {
    "education": ("education", "academic", "academics", "qualification", "qualifications"),
    "experience": ("experience", "work experience", "professional experience", "internship", "internships", "employment", "work history"),
    "projects": ("projects", "project", "personal projects", "academic projects", "key projects"),
    "skills": ("skills", "technical skills", "core skills", "technologies"),
    "certifications": ("certifications", "certification", "certificates", "courses"),
    "achievements": ("achievements", "awards", "honors", "activities", "extracurricular"),
    "summary": ("summary", "objective", "profile", "about"),
}
_HEADING_OF = {alias: key for key, aliases in HEADINGS.items() for alias in aliases}
_BULLET = re.compile(r"^\s*(?:[-•●▪◦*·]|\d+[.)])\s*")
_EMPTY = re.compile(r"^(?:none|none yet|n/?a|nil|-)\.?$", re.IGNORECASE)
DATE_RANGE = re.compile(
    r"((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4})\s*(?:-|–|—|to)\s*"
    r"((?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{4}|\d{4}|present|current|now)",
    re.IGNORECASE,
)
NUMBER = re.compile(r"\d")


def split_sections(text: str) -> dict[str, list[str]]:
    """Lines grouped under recognised headings (a heading is a short line naming a section)."""
    out: dict[str, list[str]] = {}
    current = None
    for raw in text.splitlines():
        line = raw.strip()
        if not line:
            continue
        key = _HEADING_OF.get(re.sub(r"[:\s]+$", "", line).lower())
        if key and len(line.split()) <= 4:
            current = key
            out.setdefault(key, [])
            continue
        if current:
            out[current].append(line)
    return out


@dataclass
class Block:
    title: str
    lines: list[str] = field(default_factory=list)  # following non-bullet lines
    bullets: list[str] = field(default_factory=list)


def blocks(lines: list[str]) -> list[Block]:
    """Entries in a section: a non-bullet line starts an entry, bullets and later lines belong to it."""
    out: list[Block] = []
    for line in lines:
        if _EMPTY.match(line):
            continue
        if _BULLET.match(line):
            text = _BULLET.sub("", line).strip()
            if out and text:
                out[-1].bullets.append(text)
            elif text:
                out.append(Block(title=text))
        elif out and not out[-1].bullets and len(out[-1].lines) < 2 and (DATE_RANGE.search(line) or len(line) < 70 and not line.endswith(".")):
            out[-1].lines.append(line)
        else:
            out.append(Block(title=line))
    return out


def _dates(s: str) -> str | None:
    m = DATE_RANGE.search(s)
    return m.group(0) if m else None


def _strip_dates(s: str) -> str:
    return DATE_RANGE.sub("", s).strip(" ,|–—-·")


def experience_from(text: str) -> list[dict]:
    out = []
    for b in blocks(split_sections(text).get("experience", [])):
        head = _strip_dates(b.title)
        parts = re.split(r"\s+(?:at|@)\s+|\s*[|,–—]\s*|\s+-\s+", head, maxsplit=1)
        role, company = (parts[0], parts[1]) if len(parts) == 2 else (head, (_strip_dates(b.lines[0]) if b.lines else ""))
        if not role or len(role) > 80:
            continue
        out.append({"role": role, "company": company or "Not stated", "dates": _dates(b.title) or next((_dates(l) for l in b.lines if _dates(l)), None),
                    "achievements": b.bullets})
    return out


def projects_from(text: str) -> list[dict]:
    out = []
    for b in blocks(split_sections(text).get("projects", [])):
        name, _, stack = _strip_dates(b.title).partition("|")
        if not name.strip() or len(name) > 90:
            continue
        body = " ".join([b.title, *b.lines, *b.bullets])
        out.append({"name": name.strip(" :"), "technologies": [t.name for t in terms_in(stack or body)], "description": " ".join(b.lines) or None,
                    "outcomes": b.bullets})
    return out


def education_from(text: str) -> list[dict]:
    out = []
    for b in blocks(split_sections(text).get("education", [])):
        title = _strip_dates(b.title)
        if not title:
            continue
        degree = next((_strip_dates(l) for l in b.lines if _strip_dates(l)), None)
        score = re.search(r"(?:cgpa|gpa|percentage)\s*[:\-]?\s*([\d.]+(?:\s*/\s*\d+)?%?)|([\d.]+\s*%)", " ".join([b.title, *b.lines, *b.bullets]), re.IGNORECASE)
        out.append({"institution": title, "degree": degree, "graduation_date": _dates(" ".join([b.title, *b.lines])),
                    "score": (score.group(1) or score.group(2)) if score else None})
    return out


def certifications_from(text: str) -> list[str]:
    return [_BULLET.sub("", l).strip() for l in split_sections(text).get("certifications", []) if not _EMPTY.match(l)]


def grounded(value: str, resume_text: str) -> bool:
    """True if most words of an AI-extracted name actually appear in the resume (drops invented entries)."""
    words = [w for w in re.findall(r"[a-z0-9+#]+", value.lower()) if len(w) > 2]
    if not words:
        return bool(value.strip()) and value.lower() in resume_text.lower()
    text = resume_text.lower()
    return sum(w in text for w in words) / len(words) >= 0.6


CITIES = ["Bangalore", "Bengaluru", "Hyderabad", "Chennai", "Pune", "Mumbai", "Delhi", "New Delhi", "Noida", "Gurgaon", "Gurugram", "Kolkata",
          "Ahmedabad", "Jaipur", "Kochi", "Coimbatore", "Indore", "Bhopal", "Lucknow", "Chandigarh", "Visakhapatnam", "Vijayawada", "Mysore",
          "Thiruvananthapuram", "Nagpur", "Remote"]


def location_in(text: str) -> str | None:
    head = "\n".join(text.splitlines()[:8])  # the contact block, so a college's city further down isn't taken as home
    return next((c for c in CITIES if re.search(r"\b" + re.escape(c) + r"\b", head, re.IGNORECASE)), None)
