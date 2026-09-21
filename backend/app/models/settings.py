from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class UserSettings(Base):
    __tablename__ = "user_settings"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    learning_reminders = Column(Boolean, default=True)
    practice_alerts = Column(Boolean, default=True)
    company_alerts = Column(Boolean, default=True)
    weekly_digest = Column(Boolean, default=True)
    interface_density = Column(String, default="compact")
    code_theme = Column(String, default="jetbrains")
    profile_visibility = Column(String, default="campus")
    telemetry_enabled = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"))
    event_type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
