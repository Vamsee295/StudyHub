from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.core.database import Base

class LearningSubject(Base):
    __tablename__ = "learning_subjects"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    slug = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    icon = Column(String)
    category = Column(String)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    modules = relationship("LearningModule", back_populates="subject", cascade="all, delete-orphan", order_by="LearningModule.display_order")


class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(String, primary_key=True)
    subject_id = Column(String, ForeignKey("learning_subjects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    slug = Column(String)
    description = Column(Text)
    difficulty = Column(String)
    estimated_minutes = Column(Integer, default=0)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    subject = relationship("LearningSubject", back_populates="modules")
    topics = relationship("LearningTopic", back_populates="module", cascade="all, delete-orphan", order_by="LearningTopic.display_order")


class LearningTopic(Base):
    __tablename__ = "learning_topics"

    id = Column(String, primary_key=True)
    module_id = Column(String, ForeignKey("learning_modules.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    slug = Column(String)
    description = Column(Text)
    content = Column(Text)
    estimated_minutes = Column(Integer, default=0)
    display_order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    module = relationship("LearningModule", back_populates="topics")


class UserLearningProgress(Base):
    __tablename__ = "user_learning_progress"

    id = Column(String, primary_key=True)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id = Column(String, ForeignKey("learning_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String, default="not_started")  # not_started, in_progress, completed
    progress = Column(Integer, default=0)
    notes = Column(Text, nullable=True)
    started_at = Column(DateTime)
    completed_at = Column(DateTime)
    last_accessed_at = Column(DateTime)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Unique constraint for user_id and topic_id will be handled in migration or as a composite uniqueness
