# Pathward Engine — System Architecture & Backend Blueprint

This document specifies the current frontend application architecture, the target backend architecture, database schema design, and integration blueprint for the Pathward placement preparation platform.

---

## 1. System Overview & Technology Stack

```
                               ┌──────────────────────────────────────────────┐
                               │                 PATHWARD UI                  │
                               │          Next.js 16.3 + React 19             │
                               │               TypeScript 5                   │
                               └──────────────────────┬───────────────────────┘
                                                      │ HTTP / REST API (JWT)
                                                      ▼
                               ┌──────────────────────────────────────────────┐
                               │             PYTHON FASTAPI ENGINE            │
                               │           Pydantic v2 + SQLAlchemy          │
                               │       Deterministic Recommendation Engine    │
                               │           Resource Stream / PDF Pipeline     │
                               └──────────┬───────────────────────┬───────────┘
                                          │                       │
                     Database & Auth Pool │                       │ Direct Storage / Signed URLs
                                          ▼                       ▼
                        ┌────────────────────────┐      ┌────────────────────────┐
                        │      SUPABASE DB       │      │    SUPABASE STORAGE    │
                        │  PostgreSQL 15+ & RLS  │      │  PDFs, Resumes, Notes  │
                        │  Supabase Auth Engine  │      │  (400–500+ Page Docs)  │
                        └────────────────────────┘      └────────────────────────┘
```

### Stack Components:
- **Frontend**: Next.js 16.3 (Turbopack, App Router), React 19.2, Tailwind CSS v4, Lucide React, Framer Motion.
- **Backend Application**: Python 3.13 + FastAPI + Pydantic v2 + SQLAlchemy 2.0 + AsyncPG.
- **Authoritative Database**: Supabase PostgreSQL with Row Level Security (RLS) policies.
- **Authentication**: Supabase Auth (Email/Password, OAuth, Session Tokens, JWT validation in FastAPI).
- **Document & File Storage**: Supabase Storage buckets (`resources`, `resumes`, `templates`).
- **PDF Viewing**: Production PDF viewer (PDF.js / react-pdf) with byte-range lazy loading and page virtualization.
- **AI / Recommendation Engine**: Deterministic recommendation engine inside FastAPI first, abstracted provider layer for future LLMs (Ollama, Groq, Gemini, OpenAI).

---

## 2. Current Frontend Architecture Audit

### 2.1 Route Map & Pages (40 Total Routes)
| Route | Type | Description | Current State |
|---|---|---|---|
| `/` | Static | Landing page with syllabus strips & interactive knowledge map | UI Complete |
| `/login` | Static | Split-screen campus credentials & Google OAuth | UI Complete (Simulated Auth) |
| `/signup` | Static | Student registration with batch drive cycle selector | UI Complete (Simulated Auth) |
| `/forgot-password` | Static | Password recovery request form | UI Complete |
| `/reset-password` | Static | New credential establishment | UI Complete |
| `/verify-email` | Static | Campus email verification confirmation | UI Complete |
| `/onboarding` | Static | 4-Stage Calibration Matrix (Identity, Tracks, Baseline, Targets) | UI Complete (localStorage draft) |
| `/dashboard` | Static | Main Command Center (Readiness, Streak, Active Modules, Today's Plan) | UI Complete (Static / Seeded) |
| `/learn` | Static | Curriculum module catalog & subject tracks | UI Complete (Seeded) |
| `/learn/[subject]` | Dynamic | Subject detail & topic syllabus | UI Complete (Seeded) |
| `/learn/[subject]/[module]` | Dynamic | Interactive topic lesson viewer & concept reader | UI Complete (Seeded) |
| `/roadmaps` | Static | Interactive career roadmaps & milestone stage nodes | UI Complete (Seeded) |
| `/practice` | Static | Question bank, difficulty filters, topic sprint launcher | UI Complete (Seeded) |
| `/practice/session/[id]` | Dynamic | Timed problem-solving simulator & code editor | UI Complete (Seeded) |
| `/practice/review/[id]` | Dynamic | Performance diagnostic review & submission breakdown | UI Complete (Seeded) |
| `/companies` | Static | Target company tracker, company workspaces, directory | UI Complete (Seeded) |
| `/resources` | Static | Technical handbooks, notes, cheatsheets, guides | UI Complete (Seeded) |
| `/resources/[id]` | Dynamic | Resource reader & document study portal | UI Complete (Seeded) |
| `/templates` | Static | Placement resume, cover letter & cold email blueprints | UI Complete (Seeded) |
| `/templates/[id]` | Dynamic | Interactive template preview & LaTeX/Markdown exporter | UI Complete (Seeded) |
| `/tools` | Static | Technical utility suite (SQL playground, ATS analyzer, etc.) | UI Complete (Seeded) |
| `/profile` | Redirect | Immediate redirect to `/profile/preferences` | Implemented |
| `/profile/preferences` | Static | Full-page academic identity, targets, and edit form | UI Complete |
| `/profile/learning-path` | Static | Full-page active curriculum, streak & milestones | UI Complete |
| `/profile/target-companies` | Static | Full-page company targets list, tracker & directory modal | UI Complete |
| `/profile/progress` | Static | Full-page analytical diagnostics & subject breakdowns | UI Complete |
| `/settings` | Static | Full-page two-column configuration (Account, Alerts, Security, Danger) | UI Complete |
| `/help` | Static | Full-page search help, FAQs, bug report & feedback desk | UI Complete |

### 2.2 Data Layer & Mock Storage
- `frontend/lib/data/`: 17 domain files providing structured content (`companiesData.ts`, `learnData.ts`, `roadmapModules.ts`, `practiceData.ts`, `resourcesData.ts`, `templatesData.ts`, `toolsData.ts`, etc.).
- `frontend/lib/services/onboardingService.ts`: LocalStorage client-side persistence for profile calibration and initial deterministic roadmap generation.

---

## 3. Database Architecture (PostgreSQL / Supabase)

### 3.1 Relational Schema Design

```sql
-- 1. PROFILES & AUTHENTICATION
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    university TEXT,
    degree TEXT,
    branch TEXT,
    graduation_year TEXT,
    current_semester TEXT,
    drive_cycle TEXT,
    target_role TEXT,
    preferred_job_type TEXT,
    location_preference TEXT,
    avatar_url TEXT,
    profile_completed BOOLEAN DEFAULT FALSE,
    completion_percentage INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. CAREER TRACKS & BASELINES
CREATE TABLE career_paths (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    estimated_weeks INT,
    resource_count INT,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE profile_career_paths (
    profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    career_path_id TEXT REFERENCES career_paths(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (profile_id, career_path_id)
);

CREATE TABLE profile_skill_baselines (
    profile_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    programming TEXT DEFAULT 'Beginner',
    dsa TEXT DEFAULT 'Beginner',
    sql TEXT DEFAULT 'Beginner',
    core_cs TEXT DEFAULT 'Beginner',
    aptitude TEXT DEFAULT 'Beginner',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LEARNING MODULES & PROGRESS
CREATE TABLE learning_modules (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    level TEXT,
    estimated_time TEXT,
    total_topics INT DEFAULT 0,
    icon TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE learning_topics (
    id TEXT PRIMARY KEY,
    module_id TEXT REFERENCES learning_modules(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    concept_key TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE user_topic_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    topic_id TEXT REFERENCES learning_topics(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'not_started', -- 'in_progress', 'completed'
    completed_at TIMESTAMPTZ,
    PRIMARY KEY (user_id, topic_id)
);

CREATE TABLE user_subject_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    progress_percentage INT DEFAULT 0,
    topics_completed INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, subject)
);

-- 4. ROADMAPS
CREATE TABLE roadmaps (
    id TEXT PRIMARY KEY,
    career_path_id TEXT REFERENCES career_paths(id),
    title TEXT NOT NULL,
    description TEXT,
    target_rubric TEXT,
    total_stages INT DEFAULT 0
);

CREATE TABLE roadmap_stages (
    id TEXT PRIMARY KEY,
    roadmap_id TEXT REFERENCES roadmaps(id) ON DELETE CASCADE,
    phase TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    sort_order INT DEFAULT 0
);

CREATE TABLE user_roadmap_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    roadmap_id TEXT REFERENCES roadmaps(id) ON DELETE CASCADE,
    current_stage_id TEXT REFERENCES roadmap_stages(id),
    completed_stages INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, roadmap_id)
);

-- 5. COMPANIES & TARGETS
CREATE TABLE companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    monogram TEXT NOT NULL,
    segment TEXT NOT NULL,
    tier TEXT NOT NULL,
    category TEXT,
    location TEXT,
    salary_range TEXT,
    process_summary TEXT
);

CREATE TABLE company_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    role_name TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_company_targets (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
    readiness_score INT DEFAULT 0,
    status TEXT DEFAULT 'Tracking',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, company_id)
);

-- 6. RESOURCES (LARGE PDF SUPPORT)
CREATE TABLE resource_categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
);

CREATE TABLE resources (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    category_id TEXT REFERENCES resource_categories(id),
    subject TEXT NOT NULL,
    file_path TEXT NOT NULL,       -- Supabase Storage bucket path
    file_type TEXT DEFAULT 'pdf',
    file_size_bytes BIGINT,
    page_count INT DEFAULT 0,
    author TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_resource_progress (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    resource_id TEXT REFERENCES resources(id) ON DELETE CASCADE,
    last_page_read INT DEFAULT 1,
    completion_percentage INT DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, resource_id)
);

-- 7. PRACTICE DRILLS & ATTEMPTS
CREATE TABLE practice_sets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    domain TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    estimated_minutes INT DEFAULT 20
);

CREATE TABLE practice_questions (
    id TEXT PRIMARY KEY,
    set_id TEXT REFERENCES practice_sets(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    problem_statement TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    options JSONB,
    correct_option TEXT,
    explanation TEXT
);

CREATE TABLE user_practice_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    set_id TEXT REFERENCES practice_sets(id) ON DELETE CASCADE,
    score INT DEFAULT 0,
    total_questions INT DEFAULT 0,
    duration_seconds INT DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SETTINGS & ACTIVITY LEDGER
CREATE TABLE user_settings (
    user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
    learning_reminders BOOLEAN DEFAULT TRUE,
    practice_alerts BOOLEAN DEFAULT TRUE,
    company_alerts BOOLEAN DEFAULT TRUE,
    weekly_digest BOOLEAN DEFAULT TRUE,
    interface_density TEXT DEFAULT 'compact',
    code_theme TEXT DEFAULT 'jetbrains',
    profile_visibility TEXT DEFAULT 'campus',
    telemetry_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 4. PDF Storage & Progressive Viewing Pipeline

### 4.1 Storage Organization
Documents are stored in a dedicated private Supabase Storage bucket named `resources`:
```
resources/
  ├── java/
  │   ├── java-complete-reference.pdf    (480 pages)
  │   └── java-oop-deep-dive.pdf         (180 pages)
  ├── dsa/
  │   └── dsa-patterns-handbook.pdf      (320 pages)
  ├── sql/
  │   └── sql-interview-handbook.pdf     (150 pages)
  └── aptitude/
      └── quantitative-handbook.pdf      (420 pages)
```

### 4.2 Progressive / Range-Loading Architecture
For 400–500+ page PDFs:
1. The frontend requests resource metadata: `GET /api/resources/{id}`.
2. The FastAPI backend validates user session and signs a temporary storage URL with `range` request support enabled.
3. The React viewer uses PDF.js with standard range transport (`disableAutoFetch: true`, `disableStream: false`).
4. Only the requested page and contiguous page chunks (±2 pages) are fetched into memory.
5. Reading position is throttled and saved to `POST /api/resources/{id}/progress`.

---

## 5. Backend Service Architecture (FastAPI)

```
backend/
├── app/
│   ├── main.py                  # App entry point, CORS, lifespan, exception handlers
│   ├── core/
│   │   ├── config.py            # Settings (Supabase URL, Anon Key, Service Key, DB URI)
│   │   ├── security.py          # JWT verification & Supabase user token resolution
│   │   └── database.py          # SQLAlchemy async engine, session factory, base
│   ├── api/
│   │   ├── deps.py              # Auth dependency (get_current_user)
│   │   └── routes/
│   │       ├── health.py        # /health endpoint with database ping
│   │       ├── auth.py          # /api/auth verification & session endpoints
│   │       ├── profile.py       # /api/profile and /api/profile/onboarding
│   │       ├── dashboard.py     # /api/dashboard summary aggregate
│   │       ├── learning.py      # /api/learning modules and topic progress
│   │       ├── roadmaps.py      # /api/roadmaps catalog & stage progress
│   │       ├── companies.py     # /api/companies and /api/profile/target-companies
│   │       ├── resources.py     # /api/resources metadata, signed URLs, reading progress
│   │       ├── practice.py      # /api/practice sets, questions & attempt submissions
│   │       ├── settings.py      # /api/settings preferences persistence
│   │       ├── help.py          # /api/help FAQs & feedback submissions
│   │       └── ai.py            # /api/ai/generate-plan (deterministic recommendation)
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic v2 DTOs
│   ├── services/                # Business logic (Profile, Learning, Practice, PDF, Plan)
│   └── repositories/            # Data access queries
├── migrations/                  # Alembic migration scripts
├── scripts/
│   └── seed_data.py             # Seeding script populating initial curriculum & companies
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # Setup and execution guide
```

---

## 6. Frontend API Client Architecture

A centralized typed API layer in `frontend/lib/api/`:
- `client.ts`: Base fetch client handling Supabase JWT authorization header, request retry, and consistent error objects.
- `auth.ts`: Authentication requests and session refresh.
- `profile.ts`: Profile loading, draft sync, onboarding submission.
- `dashboard.ts`: Dashboard aggregate DTO retrieval.
- `learning.ts`: Modules, topics, topic completion.
- `companies.ts`: Companies directory, tracking/untracking targets.
- `resources.ts`: Resource list, signed PDF URL retrieval, progress recording.
- `practice.ts`: Practice sets, session submission.
- `settings.ts`: Settings persistence.

---

## 7. Deterministic Personalized Plan Engine

Before integrating paid LLM APIs, Pathward implements a rule-based diagnostic engine inside `services/recommendation_service.py`:
- **Inputs**: User's target role, baseline skill ratings (OOP, DSA, SQL, Core CS, Aptitude), tracked target companies, current topic completion rates.
- **Computation**:
  1. Identifies critical syllabus gaps (e.g. DSA rated Beginner + Target Company is Google = high priority recursion & trees).
  2. Weights upcoming drive cycle timeline (e.g. 7th semester = prioritize OA passing over deep theory).
  3. Formulates a 4-week structured milestone schedule with daily 2-hour actionable tasks.
- **Output**: Clean JSON schedule consumed directly by `/roadmaps` and `/dashboard`.
- **Future Extension**: An LLM provider interface (`services/ai_service.py`) can ingest this structured plan to generate personalized conversational explanations when an API key is provided.
