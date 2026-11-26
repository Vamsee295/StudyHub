"""
Retrieval for the StudyHub assistant.

The corpus is StudyHub's own material: every Learn lesson (backend/data/courses.json, written by
frontend/dump_courses.ts) split into sections, plus a short guide to the app's pages. Retrieval is
BM25 over words, so it needs no embedding model and works with Groq, which has no embeddings API.
ponytail: BM25 misses synonyms ("fn" vs "function"); add Ollama embeddings (provider.get_embeddings)
and blend the scores if answers start missing obvious lessons.
"""
from __future__ import annotations

import json
import math
import re
from collections import Counter
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

COURSES = Path(__file__).resolve().parents[2] / "data" / "courses.json"

# What the assistant should know about the product itself. Keep in step with the sidebar.
APP_GUIDE: list[tuple[str, str, str]] = [
    ("Dashboard", "/dashboard", "Home page: today's plan, streak, recent activity and shortcuts to continue learning."),
    ("Learn", "/learn", "Courses with lessons: Programming Fundamentals, OOP, SQL, DSA, DBMS, Operating Systems, Computer Networks, System Design, and aptitude (quantitative, logical reasoning, verbal, data interpretation). Each lesson has explanations, code, quick checks and interview traps. Mark lessons complete to track progress; review and revise pages per subject."),
    ("Daily problem", "/learn/daily", "One coding problem a day in a LeetCode-style editor. It resets at midnight; solved days count toward the streak shown on the Practice page and the heatmap on the Profile progress page."),
    ("Practice", "/practice", "Coding problems with an in-browser editor; code runs in a sandbox on the server with hidden tests. Includes a warm-up ladder of easier problems. Shows the solving streak."),
    ("Roadmaps", "/roadmaps", "Step-by-step study paths per subject (DSA, programming, CS fundamentals) explaining what to learn in which order."),
    ("Labs", "/labs", "Interactive labs that teach a concept from theory to visualizer: Big-O growth, CPU scheduling (FCFS, SJF, Round Robin), page replacement (FIFO, LRU, Optimal), subnet calculator, and system-design capacity estimator."),
    ("Tools", "/tools", "Placement tools: aptitude timer, CGPA to percentage converter, company prep guides, DSA visualizer, interview simulator, placement readiness calculator, SQL playground, STAR answer builder for behavioural questions, and technical interview questions."),
    ("Templates", "/templates", "Ready-made, ATS-friendly resumes for roles like software engineer, frontend, backend, data analyst and fresher; edit them with your own details, check the ATS match against a job description, rewrite with AI, then download PDF or LaTeX or open in Overleaf. Also cover letters, emails and other placement templates."),
    ("Resources", "/resources", "Curated study links and materials, plus your saved resources."),
    ("Community", "/community", "Discussion board: ask questions, share wins and resources, upvote what helps, reply and @-mention people. Daily study logs live here too."),
    ("Companies", "/companies", "Company pages with hiring process and preparation notes."),
    ("Profile progress", "/profile/progress", "Your heatmap of solved problems and studied lessons, and overall progress."),
    ("Settings", "/settings", "Account, appearance (light and dark theme), notifications, data export and account deletion."),
]


@dataclass
class Chunk:
    title: str  # "DSA · Two Sum · What Is the Two Sum Problem?"
    url: str
    text: str


def _flatten(v) -> str:
    """All strings inside a lesson section (text, code, table cells, list items...)."""
    if isinstance(v, str):
        return v
    if isinstance(v, dict):
        return " ".join(_flatten(x) for k, x in v.items() if k not in ("type", "id", "slug", "language"))
    if isinstance(v, list):
        return " ".join(_flatten(x) for x in v)
    return ""


def _chunks() -> list[Chunk]:
    out = [Chunk(f"StudyHub · {name}", url, f"{name} page ({url}). {desc}") for name, url, desc in APP_GUIDE]
    if not COURSES.exists():
        return out
    for course in json.loads(COURSES.read_text(encoding="utf-8")):
        for module in course.get("modules", []):
            for lesson in module.get("lessons", []):
                url = f"/learn/{course['slug']}/{lesson['slug']}"
                head = f"{course['title']} · {lesson['title']}"
                sections = (lesson.get("content") or {}).get("sections") or []
                if not sections:
                    out.append(Chunk(head, url, lesson.get("description", "")))
                buf, buf_title = "", head
                for s in sections:
                    text = _flatten(s).strip()
                    if not text:
                        continue
                    # merge small sections so each chunk carries enough context
                    title = f"{head} · {s['title']}" if s.get("title") else head
                    if buf and len(buf) + len(text) > 1500:
                        out.append(Chunk(buf_title, url, buf))
                        buf, buf_title = "", title
                    if not buf:
                        buf_title = title
                    buf = f"{buf}\n{text}" if buf else text
                if buf:
                    out.append(Chunk(buf_title, url, buf))
    return out


_WORD = re.compile(r"[a-z0-9+#]+")
_STOP = set("a an the and or of to in is are was be for on with as by it this that at from how what why when which do does can i you we".split())


def _tokens(s: str) -> list[str]:
    return [w for w in _WORD.findall(s.lower()) if w not in _STOP]


class Index:
    k1, b = 1.5, 0.75

    def __init__(self, chunks: list[Chunk]):
        self.chunks = chunks
        self.docs = [Counter(_tokens(c.title + " " + c.title + " " + c.text)) for c in chunks]  # title counted twice
        self.lens = [sum(d.values()) for d in self.docs]
        self.avg = sum(self.lens) / max(len(self.lens), 1)
        df: Counter = Counter()
        for d in self.docs:
            df.update(d.keys())
        n = len(self.docs)
        self.idf = {w: math.log(1 + (n - f + 0.5) / (f + 0.5)) for w, f in df.items()}

    def search(self, query: str, k: int = 5) -> list[Chunk]:
        q = set(_tokens(query))
        if not q:
            return []
        scores = []
        for i, d in enumerate(self.docs):
            s = 0.0
            for w in q:
                f = d.get(w)
                if f:
                    s += self.idf[w] * f * (self.k1 + 1) / (f + self.k1 * (1 - self.b + self.b * self.lens[i] / self.avg))
            if s:
                scores.append((s, i))
        scores.sort(reverse=True)
        seen, out = set(), []
        for _, i in scores:
            c = self.chunks[i]
            if (c.url, c.title) in seen:
                continue
            seen.add((c.url, c.title))
            out.append(c)
            if len(out) == k:
                break
        return out


@lru_cache(maxsize=1)
def index() -> Index:
    return Index(_chunks())


if __name__ == "__main__":
    idx = index()
    print(len(idx.chunks), "chunks")
    for q in ["two sum hash map", "round robin scheduling", "where is the daily problem", "normalization 3NF"]:
        hits = idx.search(q, 3)
        print(q, "->", [h.title for h in hits])
        assert hits, q
