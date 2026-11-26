"""
AI features: the StudyHub assistant (answers grounded in StudyHub's lessons) and resume writing.
The provider (Groq or Ollama) is picked in app/ai/provider/factory.py; keys stay on the server.
"""
from __future__ import annotations

import logging
import time
from collections import defaultdict, deque
from typing import Any, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.ai.provider.factory import configured_provider_name, get_ai_provider
from app.ai.rag import index
from app.core.security import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/ai", tags=["ai"])

# ---------- limits ----------
WINDOW, MAX_CALLS = 600, 40  # per user: 40 AI calls every 10 minutes
_calls: dict[str, deque] = defaultdict(deque)


def _user_id(user: Any) -> str:
    return str(getattr(user, "id", None) or (user.get("sub") if isinstance(user, dict) else "anon"))


def limited(user: Any = Depends(get_current_user)) -> Any:
    # ponytail: in-process counter, resets on restart and isn't shared across workers; move to Redis if scaled out
    q, now = _calls[_user_id(user)], time.time()
    while q and now - q[0] > WINDOW:
        q.popleft()
    if len(q) >= MAX_CALLS:
        raise HTTPException(429, "Too many AI requests. Try again in a few minutes.")
    q.append(now)
    return user


def _provider():
    try:
        return get_ai_provider()
    except ValueError as e:
        raise HTTPException(503, "AI isn't set up on this server yet.") from e


def _provider_error(e: Exception, fallback: str) -> HTTPException:
    """Turns a provider failure into a message a student can act on; the provider's own reason goes to the log."""
    resp = getattr(e, "response", None)  # httpx.HTTPStatusError and groq.APIStatusError both carry it
    code = getattr(e, "status_code", None) or getattr(resp, "status_code", None)
    detail = getattr(resp, "text", "")[:300] if resp is not None else str(e)[:300]
    logger.error("AI provider failed (%s): %s", code, detail)
    if code in (401, 402, 403):  # bad key, no credits, model not allowed: the server owner has to fix it
        return HTTPException(503, "AI is unavailable right now. Please try again later.")
    if code == 429:
        return HTTPException(429, "AI is busy right now. Try again in a minute.")
    return HTTPException(502, fallback)


async def _ask(messages: list[dict[str, str]], max_tokens=900, temperature=0.4) -> str:
    try:
        text, _ = await _provider().generate(messages, max_tokens=max_tokens, temperature=temperature)
        return text.strip()
    except HTTPException:
        raise
    except Exception as e:
        raise _provider_error(e, "The AI service didn't respond. Try again.") from e


async def _ask_json(messages: list[dict[str, str]], schema, max_tokens=3000):
    try:
        return await _provider().structured_output(messages, schema, max_tokens=max_tokens)
    except HTTPException:
        raise
    except Exception as e:
        raise _provider_error(e, "The AI couldn't produce a valid result. Try again.") from e


@router.get("/status")
async def status():
    name = configured_provider_name()
    if not name:
        return {"available": False}
    try:
        p = get_ai_provider()
        return {"available": True, "provider": p.provider_name, "model": p.default_model}
    except ValueError:
        return {"available": False}


# ---------- assistant ----------
class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(max_length=4000)


class ChatIn(BaseModel):
    messages: list[ChatMessage] = Field(min_length=1, max_length=20)
    page: Optional[str] = Field(default=None, max_length=200)  # the path the student is on


ASSISTANT = """You are the StudyHub assistant. StudyHub is a placement-preparation app for engineering students in India: lessons on DSA, programming, OOP, SQL, DBMS, operating systems, computer networks, system design and aptitude, plus coding practice, a daily problem, labs, tools and resume templates.

How to answer:
- Use the StudyHub material below when it is relevant, and link the lesson or page with a markdown link using its path, like [Two Sum](/learn/dsa/two-sum). Only link paths that appear in the material.
- If the material doesn't cover the question, answer from general knowledge and say it isn't covered in StudyHub yet.
- Teach like a patient senior: short paragraphs, a small example or code when it helps, then one next step the student can take in StudyHub.
- For any coding problem (practice, daily, interview or their own), NEVER write the solution code or a step-by-step algorithm that amounts to it, even if the student asks or insists. Give the pattern to use (e.g. "two pointers", "prefix sums + hash map"), a guiding question, the key observation, and edge cases to check. If they share code, point at the line that's wrong and why, without rewriting it. Short snippets of syntax unrelated to the answer (how to declare a HashMap) are fine.
- Stay on studies, placements and careers. Politely decline anything else.
- Be concise: under 250 words unless the student asks for more.
- Format: short paragraphs, "-" bullet lists, **bold**, `inline code` and ``` code blocks only. No tables, no headings, no LaTeX: write maths in plain text like (n-1) x q."""


@router.post("/chat")
async def chat(body: ChatIn, user: Any = Depends(limited)):
    users = [m.content for m in body.messages if m.role == "user"]
    query = " ".join(users[-2:])  # the follow-up plus the question before it
    if body.page and body.page.startswith("/learn/"):
        # "explain this lesson": the lesson's slug words point retrieval at the page the student is reading
        query += " " + body.page.replace("/", " ").replace("-", " ").replace("learn", "")
    hits = index().search(query, k=5)
    material = "\n\n".join(f"### {h.title}\nPath: {h.url}\n{h.text[:1500]}" for h in hits) or "(nothing matched)"
    system = f"{ASSISTANT}\n\nThe student is on page: {body.page or 'unknown'}\n\nSTUDYHUB MATERIAL:\n{material}"
    reply = await _ask([{"role": "system", "content": system}, *[m.model_dump() for m in body.messages[-10:]]])
    return {"reply": reply, "sources": [{"title": h.title, "url": h.url} for h in hits[:3]]}


# ---------- resume ----------
class Line(BaseModel):
    label: Optional[str] = None
    text: str


class Entry(BaseModel):
    title: str
    date: Optional[str] = None
    subtitle: Optional[str] = None
    bullets: list[str] = []


class Section(BaseModel):
    title: str
    entries: Optional[list[Entry]] = None
    lines: Optional[list[Line]] = None


class ResumeDoc(BaseModel):
    name: str
    contacts: list[str] = []
    summary: Optional[str] = None
    sections: list[Section] = []


class ResumeResult(BaseModel):
    doc: ResumeDoc
    notes: list[str] = Field(default=[], description="Short suggestions for the student, e.g. where a number would help")


RESUME_RULES = """You write one-page, ATS-friendly resumes for students and freshers applying to tech jobs.
Rules you never break:
- Never invent facts: no employers, titles, degrees, dates, grades, numbers, awards or technologies the student didn't give. If a bullet has no number, write it without one and add a note asking for the real figure.
- Never add results, features or qualities that weren't stated: no "improving performance", "enhancing user experience", "scalable", or extra app features. Rephrase only what the student said; better wording, not new claims. Ask for the missing result in notes instead.
- Keep abbreviations exactly as given (ECE, CSE, B.Tech); don't expand them, since their meaning varies.
- Short facts with no title and date (achievements, certifications, skills) go in "lines", not "entries".
- Each bullet: starts with a strong past-tense action verb (Built, Designed, Reduced...), says what was done, how, and the result. One line or two, at most about 25 words. No "I", "my", or "responsible for".
- Plain section names (Education, Experience, Projects, Technical Skills, Achievements) so tracking systems can parse them.
- Skills as comma-separated lists. Contacts as plain text (email, phone, linkedin.com/in/..., github.com/...).
- Keep the JSON shape exactly: sections have either "entries" (title, date, subtitle, bullets) or "lines" (label, text)."""


class BuildIn(BaseModel):
    details: str = Field(min_length=20, max_length=12000)
    template: ResumeDoc  # the sample being edited: its structure and tone are the model to follow


@router.post("/resume/build", response_model=ResumeResult)
async def resume_build(body: BuildIn, user: Any = Depends(limited)):
    """Rewrites the student's raw details into the structure of the chosen sample resume."""
    msgs = [
        {"role": "system", "content": RESUME_RULES},
        {
            "role": "user",
            "content": "Here is a sample resume. Use its section order, layout and writing quality as the model, "
            "but replace ALL of its content with mine. Drop sections I have nothing for.\n\n"
            f"SAMPLE:\n{body.template.model_dump_json(exclude_none=True)}\n\nMY DETAILS (raw notes):\n{body.details}",
        },
    ]
    return await _ask_json(msgs, ResumeResult)


class TailorIn(BaseModel):
    doc: ResumeDoc
    job: str = Field(min_length=2, max_length=12000)  # a pasted job description, or a role name


@router.post("/resume/tailor", response_model=ResumeResult)
async def resume_tailor(body: TailorIn, user: Any = Depends(limited)):
    """Rewords and reorders the resume for one job, using its keywords only where they're true."""
    msgs = [
        {"role": "system", "content": RESUME_RULES},
        {
            "role": "user",
            "content": "Tailor my resume to this job. Reword bullets to use the job's terms where my experience genuinely matches, "
            "put the most relevant projects and skills first, and tighten the summary if there is one. "
            "Do not add a skill I don't show anywhere; list important missing skills in notes instead.\n\n"
            f"JOB:\n{body.job}\n\nMY RESUME:\n{body.doc.model_dump_json(exclude_none=True)}",
        },
    ]
    return await _ask_json(msgs, ResumeResult)


class BulletIn(BaseModel):
    bullet: str = Field(min_length=3, max_length=600)
    context: Optional[str] = Field(default=None, max_length=300)  # e.g. "TaskFlow | React, Node.js"
    job: Optional[str] = Field(default=None, max_length=4000)


class BulletOut(BaseModel):
    options: list[str] = Field(description="Three rewrites of the bullet")


@router.post("/resume/bullet", response_model=BulletOut)
async def resume_bullet(body: BulletIn, user: Any = Depends(limited)):
    msgs = [
        {"role": "system", "content": RESUME_RULES},
        {
            "role": "user",
            "content": f"Rewrite this resume bullet three different ways.\nBullet: {body.bullet}\n"
            + (f"It belongs to: {body.context}\n" if body.context else "")
            + (f"Target job: {body.job[:1500]}\n" if body.job else ""),
        },
    ]
    out = await _ask_json(msgs, BulletOut, max_tokens=600)
    return BulletOut(options=[o.strip() for o in out.options if o.strip()][:3])
