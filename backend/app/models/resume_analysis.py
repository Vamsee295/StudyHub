from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import Column, DateTime, ForeignKey, Index, Integer, String, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class ResumeAnalysis(Base):
    __tablename__ = "resume_analyses"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    # Target snapshot
    company = Column(String, nullable=False)
    company_type = Column(String, nullable=False)
    role = Column(String, nullable=False)
    custom_role = Column(String, nullable=True)
    job_description = Column(Text, nullable=True)

    # Resume metadata
    source_type = Column(String, nullable=False)  # "pdf" or "text"
    original_filename = Column(String, nullable=False)
    mime_type = Column(String, nullable=False)
    file_size_bytes = Column(Integer, nullable=False)
    page_count = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=False)  # Supabase Storage object path

    # Processing state
    status = Column(String, nullable=False, default="pending")  # pending, processing, completed, failed
    current_stage = Column(String, nullable=True)
    stage_state = Column(Text, nullable=False)  # JSON array of stage objects
    request_snapshot = Column(Text, nullable=False)  # JSON of the original request for retry

    # Results
    parsed_resume = Column(Text, nullable=True)  # JSON of parsed resume
    analysis_result = Column(Text, nullable=True)  # JSON of the final analysis report

    # Error handling
    error_code = Column(String, nullable=True)
    error_message = Column(Text, nullable=True)
    failed_stage = Column(String, nullable=True)  # stage ID that failed

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    failed_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("Profile", back_populates="resume_analyses")

    __table_args__ = (
        Index("ix_resume_analyses_user_id_created_at", "user_id", "created_at"),
    )