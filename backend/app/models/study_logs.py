from datetime import datetime
import uuid
from sqlalchemy import Column, String, Integer, DateTime, Date, ForeignKey, Text, JSON, UniqueConstraint
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class StudyLog(Base):
    """
    A learner's published daily log on the Community board. Only exists when the learner chooses to
    publish; the draft is computed on the fly from lesson completions and never stored.
    `lessons` is a snapshot taken at publish time so the log stays stable if courses change.
    """
    __tablename__ = "study_logs"
    __table_args__ = (UniqueConstraint("user_id", "log_date", name="uq_study_log_day"),)

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    log_date = Column(Date, nullable=False, index=True)       # the learner's local calendar date
    note = Column(Text, nullable=True)
    lessons = Column(JSON, nullable=False, default=list)       # [{subject_slug, subject_title, topic_slug, title, minutes}]
    lesson_count = Column(Integer, nullable=False, default=0)
    minutes = Column(Integer, nullable=False, default=0)       # sum of the lessons' estimated minutes
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("Profile", foreign_keys=[user_id])
