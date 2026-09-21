from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Roadmap(Base):
    __tablename__ = "roadmaps"

    id = Column(String, primary_key=True)
    career_path_id = Column(String, ForeignKey("career_paths.id"))
    title = Column(String, nullable=False)
    description = Column(String)
    target_rubric = Column(String)
    total_stages = Column(Integer, default=0)

    stages = relationship("RoadmapStage", back_populates="roadmap")


class RoadmapStage(Base):
    __tablename__ = "roadmap_stages"

    id = Column(String, primary_key=True)
    roadmap_id = Column(String, ForeignKey("roadmaps.id", ondelete="CASCADE"))
    phase = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String)
    sort_order = Column(Integer, default=0)
    
    roadmap = relationship("Roadmap", back_populates="stages")


class UserRoadmapProgress(Base):
    __tablename__ = "user_roadmap_progress"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    roadmap_id = Column(String, ForeignKey("roadmaps.id", ondelete="CASCADE"), primary_key=True)
    current_stage_id = Column(String, ForeignKey("roadmap_stages.id"))
    completed_stages = Column(Integer, default=0)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
