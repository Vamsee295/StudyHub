from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(String, primary_key=True)
    subject = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    level = Column(String)
    estimated_time = Column(String)
    total_topics = Column(Integer, default=0)
    icon = Column(String)
    sort_order = Column(Integer, default=0)
    
    topics = relationship("LearningTopic", back_populates="module")


class LearningTopic(Base):
    __tablename__ = "learning_topics"

    id = Column(String, primary_key=True)
    module_id = Column(String, ForeignKey("learning_modules.id", ondelete="CASCADE"))
    title = Column(String, nullable=False)
    summary = Column(String)
    content = Column(String)
    concept_key = Column(String)
    sort_order = Column(Integer, default=0)

    module = relationship("LearningModule", back_populates="topics")


class UserTopicProgress(Base):
    __tablename__ = "user_topic_progress"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    topic_id = Column(String, ForeignKey("learning_topics.id", ondelete="CASCADE"), primary_key=True)
    status = Column(String, default="not_started") # not_started, in_progress, completed
    completed_at = Column(DateTime)


class UserSubjectProgress(Base):
    __tablename__ = "user_subject_progress"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    subject = Column(String, primary_key=True)
    progress_percentage = Column(Integer, default=0)
    topics_completed = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
