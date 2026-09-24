from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Text, UniqueConstraint, Boolean
from sqlalchemy.orm import relationship
import uuid
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class LearningActivity(Base):
    """
    Represents a structured learning event: lesson completed, problem solved,
    resource shared, milestone reached, etc.
    References existing StudyHub entities (topics, problems, resources) by ID
    rather than duplicating their data.
    """
    __tablename__ = "learning_activities"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    # Activity classification
    activity_type = Column(String, nullable=False, index=True)
    # LEARNING_COMPLETED | PROBLEM_SOLVED | RESOURCE_SHARED | PROJECT_SHARED
    # COURSE_COMPLETED   | MILESTONE      | CUSTOM_POST

    # Optional references to existing StudyHub entities (do not duplicate their data)
    subject_slug  = Column(String, nullable=True)   # e.g. "programming-fundamentals"
    topic_slug    = Column(String, nullable=True)   # e.g. "variables"
    problem_id    = Column(String, nullable=True)   # DSA problem id
    resource_id   = Column(String, nullable=True)   # resource id
    roadmap_id    = Column(String, nullable=True)   # roadmap id

    # Human-readable snapshot for display (snapshot, NOT duplicated learning content)
    title         = Column(String, nullable=False)
    description   = Column(Text, nullable=True)

    # Searchable tags, stored as comma-separated string e.g. "java,oop,inheritance"
    tags          = Column(String, nullable=True)

    # Visibility: public | followers | private
    visibility    = Column(String, default="public", nullable=False)

    created_at    = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user          = relationship("Profile", foreign_keys=[user_id])
    post          = relationship("CommunityPost", back_populates="activity", uselist=False)


class CommunityPost(Base):
    """
    A published post in the Study With Me feed. May wrap a LearningActivity
    (auto-generated) or be a standalone custom progress post.
    """
    __tablename__ = "community_posts"

    id          = Column(String, primary_key=True, default=generate_uuid)
    user_id     = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    activity_id = Column(String, ForeignKey("learning_activities.id", ondelete="SET NULL"), nullable=True)

    content     = Column(Text, nullable=False)
    post_type   = Column(String, default="custom")   # activity | custom
    tags        = Column(String, nullable=True)       # comma-separated

    # Visibility mirrors the wrapped activity visibility (or can be overridden)
    visibility  = Column(String, default="public", nullable=False)

    created_at  = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user        = relationship("Profile", foreign_keys=[user_id])
    activity    = relationship("LearningActivity", back_populates="post")
    likes       = relationship("PostLike",    back_populates="post", cascade="all, delete-orphan")
    comments    = relationship("PostComment", back_populates="post", cascade="all, delete-orphan",
                               order_by="PostComment.created_at")


class PostLike(Base):
    """One like per user per post. Unique constraint enforced in DB."""
    __tablename__ = "post_likes"
    __table_args__ = (UniqueConstraint("post_id", "user_id", name="uq_post_like"),)

    id         = Column(String, primary_key=True, default=generate_uuid)
    post_id    = Column(String, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id    = Column(String, ForeignKey("profiles.id",  ondelete="CASCADE"), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("CommunityPost", back_populates="likes")
    user = relationship("Profile", foreign_keys=[user_id])


class PostComment(Base):
    """Simple flat comments on community posts (V1 — no threading)."""
    __tablename__ = "post_comments"

    id         = Column(String, primary_key=True, default=generate_uuid)
    post_id    = Column(String, ForeignKey("community_posts.id", ondelete="CASCADE"), nullable=False, index=True)
    user_id    = Column(String, ForeignKey("profiles.id",  ondelete="CASCADE"), nullable=False, index=True)
    content    = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    post = relationship("CommunityPost", back_populates="comments")
    user = relationship("Profile", foreign_keys=[user_id])


class UserFollow(Base):
    """Directed follow relationship between learners."""
    __tablename__ = "user_follows"
    __table_args__ = (UniqueConstraint("follower_id", "following_id", name="uq_follow"),)

    id           = Column(String, primary_key=True, default=generate_uuid)
    follower_id  = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    following_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    created_at   = Column(DateTime, default=datetime.utcnow)

    follower  = relationship("Profile", foreign_keys=[follower_id])
    following = relationship("Profile", foreign_keys=[following_id])
