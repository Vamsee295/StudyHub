import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.core.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True) # UUID string or Supabase auth id
    full_name = Column(String, nullable=False)
    university = Column(String)
    degree = Column(String)
    branch = Column(String)
    graduation_year = Column(String)
    current_semester = Column(String)
    drive_cycle = Column(String)
    target_role = Column(String)
    preferred_job_type = Column(String)
    location_preference = Column(String)
    avatar_url = Column(String)
    profile_completed = Column(Boolean, default=False)
    completion_percentage = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    skill_baseline = relationship("ProfileSkillBaseline", back_populates="profile", uselist=False)
    career_paths = relationship("ProfileCareerPath", back_populates="profile")


class CareerPath(Base):
    __tablename__ = "career_paths"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(String)
    estimated_weeks = Column(Integer)
    resource_count = Column(Integer)
    is_active = Column(Boolean, default=True)


class ProfileCareerPath(Base):
    __tablename__ = "profile_career_paths"

    profile_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    career_path_id = Column(String, ForeignKey("career_paths.id", ondelete="CASCADE"), primary_key=True)
    is_primary = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="career_paths")
    career_path = relationship("CareerPath")


class ProfileSkillBaseline(Base):
    __tablename__ = "profile_skill_baselines"

    profile_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    programming = Column(String, default="Beginner")
    dsa = Column(String, default="Beginner")
    sql = Column(String, default="Beginner")
    core_cs = Column(String, default="Beginner")
    aptitude = Column(String, default="Beginner")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    profile = relationship("Profile", back_populates="skill_baseline")
