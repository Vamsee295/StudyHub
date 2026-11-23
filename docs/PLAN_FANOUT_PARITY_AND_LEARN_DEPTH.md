# Plan: Fanout-style features (free) + deeper Learn theory

Date: 2026-11-23 · Status: **Phases 0–2 shipped; see §7 for current gaps**

Goal: match what makes fanout.sh useful (its *working functionality*, not its UI), keep everything free, and make the Learn courses genuinely deep.

---

## 1. What fanout.sh actually does (observed on the live site)

| Surface | How it works | Free on fanout? |
|---|---|---|
| **Courses** (AI research, System Design, ML Math, Inference, AI eng; 9 more "soon") | Each course = numbered modules → lessons. System Design: 18 modules / 200 lessons. Lessons are tagged with real tech (PostgreSQL, Redis, Kafka) and "Asked in" companies (Amazon, Google…). | First lessons free, rest paid |
| **Lesson page** | ~10 min video **plus** long-form written notes (~900+ words of prose, one running example, tables, invariants, failure checks), "Used in" links to design walkthroughs, Next lesson, progress tracking | Text readable free; video needs sign-in |
| **Design walkthroughs** | "Design a URL shortener / payment system / collaborative editor …", built step-by-step, tagged with companies that ask them | Paid |
| **Roadmaps** | One roadmap per course: chapters → units, "Next on your path", completion carried over from courses | Free |
| **Knowledge Topography** | Interactive concept graph: 273 nodes / 640 relations across all courses, filter by course/progress, "neighbors" view | Free |
| **Labs** (16) | Browser-local interactive instruments: back-of-the-envelope capacity calculator with a 1–100× workload slider and exportable "decision receipt", latency numbers, tokenizer, RAG chunking, KV cache, gradient descent, sampling, timeout architect, eval confidence, model router, daily planner… | Free |
| **Daily** | One research paper per day, explained with an interactive illustration; calendar of past days | Free |
| **Papers** | Foundational papers per track in **reading order**, each with a 2-line "why it matters" + mini visual | Free |
| **Math Decoder** | Short notation videos, searchable symbol library, worked formula guides ("what it says / common trap / read aloud") | Free |
| **Study With Me** | Public day-by-day learning logs ("learn in public"), daily archive | Free |
| **Ideas board** | Users post feature requests, upvote; Open / Planned / Shipped statuses | Free |
| **Jobs** | Live job feed (Adzuna + Remotive APIs), filters by role | 5 free, rest paid |
| **Companies** | Directory of AI companies: focus, founders, public work, contacts | Contacts paid |
| **Updates / Blog** | Weekly changelog, archive notes | Free |

Their positioning: *curation and sequencing* ("material that takes years to discover, filtered and connected, maintained weekly").

## 2. Where StudyHub stands today

Already have (some partly): Learn courses (12, now with real modules), Roadmaps (DSA + programming), Practice (problems IDE, SQL Lab, code playground, timed sprints), AI tutor, Resume analyzer, Interview simulator, Community feed, Study With Me page, Companies (43, seeded data), Resources (218 MB PDFs in `frontend/materials`), Templates.

Measured gaps:
- **Theory is thin.** Average *explanatory prose* per lesson: DSA 58 words, CN 75, SQL 76, OS 92, DBMS 113, OOP 168, Programming Fundamentals 198. Fanout's lesson I read had ~900. Our lessons are structured (tables/code/quizzes) but under-explained.
- **21 of 25 Tools links are dead.** `lib/data/toolsData.ts` links to `/tools/aptitude-timer`, `/tools/company-prep`, `/tools/star-builder`, `/tools/hr-practice`, … — only `dsa-visualizer`, `interview-simulator`, `resume-analyzer`, `sql-playground` have pages.
- No System Design course (the most-asked topic for SDE roles after DSA).
- No concept graph, no daily feed, no reading-order lists, no interactive labs beyond SQL/code.
- Companies data is seeded/static; no "asked in" tagging on lessons/problems.
- Open bugs from earlier audits: 3 prerequisite links point to missing pages; schema drift (`test_migrations` fails); resume-route security fixes lost in the reset.

## 3. What to add / improve — prioritized

### P0 — fix what's broken (before adding anything)
1. **Dead tool links**: either build the 21 tools or hide them. Recommendation: hide all, then rebuild the 6 that matter most (Aptitude timer, Company prep, STAR builder, HR practice, Readiness calculator, Interview timer) — most are client-only and small.
2. Prerequisite chips → link to `/learn/{subject}/{lesson}` (renderer needs the subject slug).
3. Finish the lost resume security fixes + migration repair (tests already exist and fail).

### P1 — highest-value fanout parity (all free)
| Feature | What we build | Why it matters for placements | Size |
|---|---|---|---|
| **Deep lesson notes** | Long-form "Notes" section per lesson (see §4) | Directly fixes the #1 complaint | Large (content) |
| **System Design course** | New course: fundamentals → building blocks → 10–15 design walkthroughs (URL shortener, rate limiter, chat, feed, payment, booking…) with "Asked in" tags | SDE-2+/product companies ask it; we have nothing | Large |
| **"Asked in" tags** | Add `askedIn: string[]` to lessons & practice problems; show chips; filter on Companies page | Connects Learn ↔ Companies ↔ Practice | Small |
| **Unified roadmap per course** | Auto-generate a roadmap from each course's modules/lessons, with "Next on your path" from real progress | We already have the data; fanout's best UX feature | Medium |
| **Labs (interactive tools)** | Start with 5 placement-relevant ones: Back-of-the-envelope estimator, Big-O growth visualizer, CPU-scheduling Gantt simulator, Page-replacement simulator, Subnet calculator. All browser-local, no backend | Turns our numericals into hands-on practice | Medium each |
| **Reading-order lists** | "Read in this order" per subject: our lessons + external free resources (books, MIT OCW, videos) with 2-line "why" | Fanout's curation value, cheap to build | Small |

### P2 — engagement features
| Feature | What we build | Size |
|---|---|---|
| **Concept graph** | Derive nodes = lessons, edges = prerequisites + "used in" links; render with a force graph; colour by progress | Medium |
| **Daily brief** | One interview question / concept per day (not papers — placement-focused), calendar archive, streak | Small–Medium |
| **Ideas board** | Feature requests + upvotes + status (reuse community tables) | Small |
| **Study With Me v2** | Public daily learning logs auto-filled from lesson completions | Small (we have community + activities API) |
| **Jobs/internships feed** | Adzuna/Remotive free tiers (or a curated JSON updated weekly), filtered to freshers/India | Medium |
| **Updates page** | Weekly changelog from git commits | Small |

### Deliberately skip (for now)
Video lessons (production cost), AI-research/robotics tracks (not our audience), paid plans (we're free).

## 4. Learn theory expansion — plan

### Target per lesson
- **Notes block of 700–1,200 words** of real explanation: motivation → intuition (one running example) → mechanism step by step → edge cases/failure modes → how it shows up in interviews/real systems.
- Keep existing tables/code/quizzes; the notes sit at the top as the primary read.
- Every borrowed passage carries attribution (new `sources` field rendered as "Sources & further reading").

### Sources (licenses verified via GitHub API on 2026-11-23)

**Green — can adapt with attribution**
| Source | License | Use for |
|---|---|---|
| [donnemartin/system-design-primer](https://github.com/donnemartin/system-design-primer) (379k★) | CC BY 4.0 | System Design course backbone |
| [SystemsApproach/book](https://github.com/SystemsApproach/book) — *Computer Networks: A Systems Approach* | CC BY 4.0 | Deepen CN theory |
| [patmorin/ods](https://github.com/patmorin/ods) — *Open Data Structures* | CC BY (book text; verify per file) | DSA theory/proofs |
| [yangshun/tech-interview-handbook](https://github.com/yangshun/tech-interview-handbook) (144k★) | MIT | Interview tips, algorithm cheat-sheets, behavioural |
| [jwasham/coding-interview-university](https://github.com/jwasham/coding-interview-university) (365k★) | CC BY-SA 4.0 | Topic checklist / reading order (share-alike → derived pages must stay CC BY-SA) |
| [trekhleb/javascript-algorithms](https://github.com/trekhleb/javascript-algorithms), [TheAlgorithms/Java](https://github.com/TheAlgorithms/Java), [kdn251/interviews](https://github.com/kdn251/interviews) | MIT | Algorithm explanations & reference code |
| [darshanime/notes](https://github.com/darshanime/notes), [Surajv311/myCS-NOTES](https://github.com/Surajv311/myCS-NOTES), [tech-notes-hub/tech-notes](https://github.com/tech-notes-hub/tech-notes) | MIT | OS/DBMS/CN notes (small; review quality) |
| [mtdvio/every-programmer-should-know](https://github.com/mtdvio/every-programmer-should-know) | CC BY 4.0 | Reading lists |
| [ossu/computer-science](https://github.com/ossu/computer-science), [binhnguyennus/awesome-scalability](https://github.com/binhnguyennus/awesome-scalability) | MIT | Curriculum ordering, link lists |

**Yellow — link only, do not copy**
| Source | Why |
|---|---|
| ByteByteGoHq/system-design-101 | CC BY-NC-ND 4.0 (no derivatives) |
| karanpratapsingh/system-design | CC BY-NC-ND 4.0 |
| ashishps1/awesome-system-design-resources, awesome-low-level-design | GPL-3.0 (copyleft; fine to link) |
| OSTEP, CMU 15-445 notes, most university notes | Free to read, not licensed for reuse |

**Red — avoid**: repos with no license (e.g. alex/what-happens-when, Chanda-Abdul coding patterns, developer-roadmap content), GeeksforGeeks/Javatpoint copies, PDF dumps of copyrighted books. The 218 MB `frontend/materials` folder should be audited for this too.

### Pipeline
1. **Ingest** (script): clone green repos into `content-sources/` (git-ignored), record commit SHA + license per file.
2. **Map**: for each of our lessons, list candidate source sections (topic matching by headings).
3. **Write**: adapt into our voice and running examples — not copy-paste — keeping placement focus; keep facts consistent with our verified examples (SQL Lab data, tested Java).
4. **Attribute**: `sources: [{title, url, license, commit}]` on the lesson; renderer shows a "Sources" footer.
5. **Verify**: same checks as before (renderer validator, quiz validator, SQL run in SQLite, Java compiled), plus a prose-length check (≥700 words of notes).
6. **Sync**: `dump_courses.ts` → `seed_curriculum.py --sync`.

### Order of work
1. DSA, DBMS, OS, CN, SQL notes (deepest gap, most asked) — ~195 lessons.
2. New System Design course (~60 lessons + 12 walkthroughs) from system-design-primer + Systems Approach.
3. OOP / Programming Fundamentals top-ups; Aptitude prose (currently ~80 words).

## 5. Phased roadmap

| Phase | Scope | Outcome |
|---|---|---|
| **0** (1–2 days) | P0 fixes: hide/rebuild dead tools, prereq links, resume security + migrations | No broken links; tests green |
| **1** (1–2 weeks) | Lesson model gets `notes` + `sources` + `askedIn`; renderer support; ingest pipeline; deep notes for DBMS + OS | Two courses at fanout-level depth |
| **2** (2–3 weeks) | Deep notes for CN, DSA, SQL; course roadmaps auto-generated from modules | All core CS courses deep |
| **3** (2–3 weeks) | System Design course + 5 labs | New flagship course, hands-on simulators |
| **4** (1–2 weeks) | Concept graph, Daily brief, Ideas board, Study-With-Me logs, reading-order lists | Engagement parity with fanout |
| **5** (optional) | Jobs/internships feed, Updates page | |

## 6. Decisions needed from you
1. Dead tools: **hide now and rebuild a top-6**, or build all 21?
2. System Design: add as a new Learn course (recommended), or fold into Roadmaps only?
3. CC BY-SA (coding-interview-university): OK for derived pages to carry CC BY-SA? (If not, use it only as a checklist.)
4. Notes length target: 700–1,200 words per lesson OK, or shorter for Aptitude?
5. Daily brief: interview question of the day (recommended) vs. paper of the day?

## 7. Status and remaining gaps (updated 2026-11-23)

**Shipped:** P0 fixes (unbuilt tools hidden, prerequisite links, resume security, migrations); `theory` + `sources` lesson fields and renderer; 700+ word notes for all 195 DBMS, OS, CN, DSA and SQL lessons; auto-generated course roadmaps with "Next on your path"; `--sync` now prunes stale placeholder lessons (363 removed).

**Still missing for "prepare a whole subject from scratch":**
| Gap | Notes |
|---|---|
| Deep notes for Programming Fundamentals (78), OOP (41), Aptitude (64) | Same pipeline as Phase 1–2 |
| System Design course + walkthroughs | system-design-primer (CC BY 4.0) backbone |
| Subject mock tests and revision | Timed per-subject test from lesson quizzes, a revision sheet per module, spaced-repetition review queue |
| "Asked in" tags | `askedIn` on lessons and problems, filter on Companies |
| Labs | Big-O visualizer, CPU scheduling Gantt, page replacement, subnet calculator, capacity estimator |
| Reading-order lists | Per subject, our lessons + free external resources |
| Concept graph, daily question, ideas board, Study With Me logs | Phase 4 engagement |
| 16 hidden tools | Rebuild top 6 or drop |
| Content search, bookmarks, personal notes per lesson | Not built |
