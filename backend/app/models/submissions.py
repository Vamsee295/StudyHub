from datetime import datetime
import uuid

from sqlalchemy import JSON, Column, DateTime, Index, Integer, String, Text

from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class CodeSubmission(Base):
    """
    One press of Submit on a coding problem: the code as submitted and how it was graded.
    `user_id` has no foreign key on purpose: submissions work before a profile row exists, and
    account deletion removes every table's plain `user_id` rows (services/account_service.py).
    """
    __tablename__ = "code_submissions"
    __table_args__ = (Index("ix_code_submissions_user_problem", "user_id", "problem_id", "created_at"),)

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, nullable=False, index=True)
    problem_id = Column(String(100), nullable=False)
    language = Column(String(20), nullable=False)
    code = Column(Text, nullable=False)
    status = Column(String(30), nullable=False)  # accepted, wrong_answer, compile_error, runtime_error, time_limit
    passed = Column(Integer, nullable=False, default=0)
    total = Column(Integer, nullable=False, default=0)
    runtime_ms = Column(Integer, nullable=True)
    failed_case = Column(JSON, nullable=True)  # first failing test: {id, input, expectedOutput, actualOutput, error}
    error = Column(Text, nullable=True)  # compiler or runtime error text, truncated
    note = Column(String(500), nullable=True)  # the learner's own note on this submission
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
