from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, BigInteger, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class ResourceCategory(Base):
    __tablename__ = "resource_categories"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)


class Resource(Base):
    __tablename__ = "resources"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    description = Column(String)
    category_id = Column(String, ForeignKey("resource_categories.id"))
    subject = Column(String, nullable=False)
    file_path = Column(String, nullable=False) # Supabase Storage bucket path
    file_type = Column(String, default="pdf")
    file_size_bytes = Column(BigInteger)
    page_count = Column(Integer, default=0)
    author = Column(String)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class UserResourceProgress(Base):
    __tablename__ = "user_resource_progress"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    resource_id = Column(String, ForeignKey("resources.id", ondelete="CASCADE"), primary_key=True)
    last_page_read = Column(Integer, default=1)
    completion_percentage = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class UserSavedResource(Base):
    __tablename__ = "user_saved_resources"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    resource_id = Column(String, ForeignKey("resources.id", ondelete="CASCADE"), primary_key=True)
    saved_at = Column(DateTime, default=datetime.utcnow)
