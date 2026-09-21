from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Company(Base):
    __tablename__ = "companies"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    monogram = Column(String, nullable=False)
    segment = Column(String, nullable=False)
    tier = Column(String, nullable=False)
    category = Column(String)
    location = Column(String)
    salary_range = Column(String)
    process_summary = Column(String)


class CompanyRole(Base):
    __tablename__ = "company_roles"

    id = Column(String, primary_key=True, default=generate_uuid)
    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"))
    role_name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)


class UserCompanyTarget(Base):
    __tablename__ = "user_company_targets"

    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), primary_key=True)
    company_id = Column(String, ForeignKey("companies.id", ondelete="CASCADE"), primary_key=True)
    readiness_score = Column(Integer, default=0)
    status = Column(String, default="Tracking")
    created_at = Column(DateTime, default=datetime.utcnow)
