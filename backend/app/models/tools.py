from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Tool(Base):
    __tablename__ = "tools"
    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    category = Column(String)

class ToolUsage(Base):
    __tablename__ = "tool_usage"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"))
    tool_id = Column(String, ForeignKey("tools.id", ondelete="CASCADE"))
    used_at = Column(DateTime, default=datetime.utcnow)
