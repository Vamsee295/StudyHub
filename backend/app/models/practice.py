from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class PracticeSet(Base):
    __tablename__ = "practice_sets"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    domain = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    estimated_minutes = Column(Integer, default=20)


class PracticeQuestion(Base):
    __tablename__ = "practice_questions"

    id = Column(String, primary_key=True)
    set_id = Column(String, ForeignKey("practice_sets.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    problem_statement = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    options = Column(JSON)
    correct_option = Column(String)
    explanation = Column(String)


class UserPracticeAttempt(Base):
    __tablename__ = "user_practice_attempts"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"))
    set_id = Column(String, ForeignKey("practice_sets.id", ondelete="CASCADE"))
    score = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    duration_seconds = Column(Integer, default=0)
    completed_at = Column(DateTime, default=datetime.utcnow)
