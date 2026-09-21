from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class DailyPlan(Base):
    __tablename__ = "daily_plans"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"))
    plan_date = Column(DateTime, default=datetime.utcnow)
    focus = Column(String)
    estimated_minutes = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class DailyPlanItem(Base):
    __tablename__ = "daily_plan_items"
    id = Column(String, primary_key=True, default=generate_uuid)
    plan_id = Column(String, ForeignKey("daily_plans.id", ondelete="CASCADE"))
    task = Column(String, nullable=False)
    status = Column(String, default="pending")
