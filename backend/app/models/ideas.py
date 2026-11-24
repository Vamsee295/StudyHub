from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, UniqueConstraint, Integer
from sqlalchemy.orm import relationship
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class Idea(Base):
    """A feature request on the public ideas board. Status is changed only by admins."""
    __tablename__ = "ideas"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(30), nullable=False, default="other")   # learn | practice | tools | community | other
    status = Column(String(20), nullable=False, default="open", index=True)  # open | planned | in_progress | shipped | declined
    status_note = Column(Text, nullable=True)   # admin's explanation shown with the status
    vote_count = Column(Integer, nullable=False, default=0)  # denormalized for sorting; kept in sync with idea_votes
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("Profile", foreign_keys=[user_id])
    votes = relationship("IdeaVote", back_populates="idea", cascade="all, delete-orphan")


class IdeaVote(Base):
    """One upvote per user per idea."""
    __tablename__ = "idea_votes"
    __table_args__ = (UniqueConstraint("idea_id", "user_id", name="uq_idea_vote"),)

    id = Column(String, primary_key=True, default=generate_uuid)
    idea_id = Column(String, ForeignKey("ideas.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    idea = relationship("Idea", back_populates="votes")
