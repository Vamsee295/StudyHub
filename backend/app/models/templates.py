from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class TemplateCategory(Base):
    __tablename__ = "template_categories"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)

class Template(Base):
    __tablename__ = "templates"
    id = Column(String, primary_key=True)
    category_id = Column(String, ForeignKey("template_categories.id"))
    name = Column(String, nullable=False)
    description = Column(String)
    content = Column(String)
    target_role = Column(String)

class TemplateUsage(Base):
    __tablename__ = "template_usage"
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"))
    template_id = Column(String, ForeignKey("templates.id", ondelete="CASCADE"))
    used_at = Column(DateTime, default=datetime.utcnow)
