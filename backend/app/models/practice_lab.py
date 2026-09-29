"""Practice Lab models — persistent storage for the three IDEs.

These tables back the developer Practice Lab (Code Playground, SQL Lab,
Web Playground). They are intentionally lightweight and user-isolated.
"""
from datetime import datetime
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class PracticeSession(Base):
    """A saved coding session in the Code Playground."""
    __tablename__ = "practice_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    ide_type = Column(String, nullable=False)  # code | sql | web
    language = Column(String)                  # python | java | c | cpp | sql | html
    title = Column(String, default="Untitled Session")
    code = Column(Text)
    extra = Column(JSON)                       # e.g. {html, css, js} for web projects
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    executions = relationship("CodeExecution", back_populates="session", cascade="all, delete-orphan")


class CodeExecution(Base):
    """A single code-run record for telemetry & progress tracking."""
    __tablename__ = "code_executions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    session_id = Column(String, ForeignKey("practice_sessions.id", ondelete="CASCADE"))
    language = Column(String)
    source_code = Column(Text)
    stdin = Column(Text)
    status = Column(String)                    # accepted | runtime_error | compile_error | timeout | memory | error
    stdout = Column(Text)
    stderr = Column(Text)
    execution_time_ms = Column(Integer)
    memory_used_kb = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    session = relationship("PracticeSession", back_populates="executions")


class WebProject(Base):
    """A saved web project (HTML/CSS/JS)."""
    __tablename__ = "web_projects"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    name = Column(String, default="Untitled Project")
    html = Column(Text)
    css = Column(Text)
    javascript = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class SQLSession(Base):
    """A saved SQL query session (query text + the database template used)."""
    __tablename__ = "sql_sessions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), index=True)
    query = Column(Text)
    database_template = Column(String, default="default")  # which sample DB was loaded
    result_snapshot = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)