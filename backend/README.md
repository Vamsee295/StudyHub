# Pathward Backend

High-performance asynchronous REST API backend for **Pathward**, powering student profile synchronization, company tracking, roadmap computation, and Groq-powered AI learning path generation.

---

## 🚀 Tech Stack

- **Web Framework:** [FastAPI](https://fastapi.tiangolo.com/) (Python 3.11+)
- **ASGI Server:** [Uvicorn](https://www.uvicorn.org/) (Standard)
- **Data Validation & Settings:** [Pydantic v2](https://docs.pydantic.dev/latest/) & [Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)
- **ORM & Async DB:** [SQLAlchemy 2.0 (AsyncIO)](https://docs.sqlalchemy.org/en/20/) + [aiosqlite](https://github.com/omnilib/aiosqlite) / [asyncpg](https://github.com/MagicStack/asyncpg)
- **Database Migrations:** [Alembic](https://alembic.sqlalchemy.org/)
- **Authentication & Cloud Services:** [Supabase Python SDK](https://supabase.com/docs/reference/python/introduction)
- **AI / LLM Orchestration:** [Groq Python SDK](https://github.com/groq/groq-python) (Llama-3.3-70b-versatile / Llama-3-70b-8192)

---

## 📁 Project Structure

```text
backend/
├── app/
│   ├── api/
│   │   └── routes/           # REST API endpoints
│   │       ├── ai.py         # AI-generated personalized roadmaps via Groq
│   │       ├── dashboard.py  # Progress metrics, readiness score & daily plans
│   │       ├── profile.py    # Profile management, onboarding sync & target companies
│   │       └── resources.py  # Study materials & signed PDF storage URLs
│   ├── core/
│   │   ├── config.py         # App configuration & environment loader
│   │   ├── database.py       # Async SQLAlchemy engine & session factory
│   │   ├── security.py       # Supabase JWT token verification & auth dependencies
│   │   └── supabase.py       # Supabase client singleton (Anon & Service Role)
│   ├── models/               # SQLAlchemy ORM database models
│   │   ├── company.py        # Company & user target tracking models
│   │   ├── profile.py        # User profile, skills baseline & career track models
│   │   ├── resource.py       # Study resources & storage reference models
│   │   └── roadmap.py        # Roadmaps, stages & user progress models
│   ├── schemas/              # Pydantic request & response models
│   │   ├── ai.py             # AI generation schemas
│   │   ├── profile.py        # Profile & onboarding schemas
│   │   └── resource.py       # Resource schemas
│   ├── services/             # Domain business logic
│   │   └── groq_service.py   # LLM prompt pipelines & structured JSON outputs
│   └── main.py               # FastAPI application setup, CORS & router inclusion
├── migrations/               # Alembic database migration scripts
├── scripts/                  # Seed scripts & database utilities
│   └── seed_data.py          # Database initializer script
├── alembic.ini               # Alembic configuration
├── requirements.txt          # Python project dependencies
└── .env                      # Environment configuration file
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Application Environment
ENVIRONMENT=development

# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Database Connection (SQLite for local dev, PostgreSQL for production)
DATABASE_URL=sqlite+aiosqlite:///./pathward.db

# Groq LLM API Configuration (Never exposed to frontend)
GROQ_API_KEY=gsk_your_groq_api_key_here
GROQ_MODEL=llama3-70b-8192

# CORS Frontend Allowed Origin
FRONTEND_URL=http://localhost:3000
```

---

## 🛠️ Getting Started & Commands

Ensure you have **Python 3.11+** installed.

### 1. Set Up Virtual Environment

#### Windows (PowerShell):
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

#### macOS / Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Initialize & Seed the Database (Optional)
```bash
python scripts/seed_data.py
```

### 4. Run the Development Server
```bash
uvicorn app.main:app --reload --port 8000
```
- API Base URL: [http://localhost:8000](http://localhost:8000)
- Interactive API Documentation (Swagger UI): [http://localhost:8000/docs](http://localhost:8000/docs)
- Alternative API Documentation (ReDoc): [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 📡 API Endpoint Overview

| Endpoint | Method | Description | Auth Required |
| :--- | :---: | :--- | :---: |
| `/health` | `GET` | Health status and environment check | No |
| `/api/profile/status` | `GET` | Check if user completed onboarding | Yes (Bearer) |
| `/api/profile/onboarding/complete` | `POST` | Save onboarding answers & profile | Yes (Bearer) |
| `/api/profile/target-companies` | `GET` | Retrieve user's tracked companies | Yes (Bearer) |
| `/api/dashboard/` | `GET` | Dashboard readiness metrics & tasks | Yes (Bearer) |
| `/api/resources/{id}` | `GET` | Resource metadata & details | Yes (Bearer) |
| `/api/resources/{id}/url` | `GET` | Generate signed Supabase storage URL | Yes (Bearer) |
| `/api/ai/generate-plan` | `POST` | Generate custom roadmap with Groq LLM | Yes (Bearer) |
