from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base

app = FastAPI(
    title="StudyHub API",
    description="Backend API for StudyHub placement preparation platform",
    version="1.0.0",
)

from app.models import company, daily_plans, learning, practice, profile, resource, roadmap, templates, tools, settings as user_settings_model, community
from sqlalchemy import text

def sync_table_columns(connection):
    for table_name, table in Base.metadata.tables.items():
        try:
            result = connection.execute(text(f"PRAGMA table_info({table_name})"))
            db_cols = {row[1] for row in result.fetchall()}
            if not db_cols:
                continue
            for col in table.columns:
                if col.name not in db_cols:
                    col_type = col.type.compile(connection.dialect)
                    connection.execute(text(f"ALTER TABLE {table_name} ADD COLUMN {col.name} {col_type}"))
        except Exception:
            pass

@app.on_event("startup")
async def startup_event():
    async with engine.begin() as conn:
        # Create all tables (safe because it only creates tables that don't exist yet)
        await conn.run_sync(Base.metadata.create_all)
        # Sync any newly added columns in models
        await conn.run_sync(sync_table_columns)

from app.api.routes import profile, dashboard, learn, ai, resources, roadmaps, practice, community

# Configure CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    settings.frontend_url,
]
origins = list(set([o for o in origins if o]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

app.include_router(profile.router)
app.include_router(dashboard.router)
app.include_router(learn.router)
app.include_router(ai.router)
app.include_router(resources.router)
app.include_router(roadmaps.router)
app.include_router(practice.router)
app.include_router(community.router)

@app.get("/")

async def root():
    return {"message": "Welcome to StudyHub API"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "environment": settings.environment,
        "version": "1.0.0"
    }
