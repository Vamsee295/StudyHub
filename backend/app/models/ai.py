import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class AIUsageLog(Base):
    __tablename__ = "ai_usage_logs"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False)
    feature_name = Column(String, nullable=False) # e.g. "resume_analysis", "ai_tutor"
    provider = Column(String, nullable=False) # e.g. "groq"
    model = Column(String, nullable=False) # e.g. "llama3-70b-8192"
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    cost_estimate = Column(Float, default=0.0) # For future if we want to track cost
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("Profile")
