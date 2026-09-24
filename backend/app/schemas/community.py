from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ---------------------------------------------------------------------------
# Author (embedded in post responses)
# ---------------------------------------------------------------------------
class AuthorOut(BaseModel):
    id: str
    full_name: str
    avatar_url: Optional[str] = None
    university: Optional[str] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Learning Activity
# ---------------------------------------------------------------------------
class LearningActivityCreate(BaseModel):
    activity_type: str = Field(..., description="LEARNING_COMPLETED | PROBLEM_SOLVED | RESOURCE_SHARED | PROJECT_SHARED | COURSE_COMPLETED | MILESTONE | CUSTOM_POST")
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    subject_slug: Optional[str] = None
    topic_slug: Optional[str] = None
    problem_id: Optional[str] = None
    resource_id: Optional[str] = None
    roadmap_id: Optional[str] = None
    tags: Optional[str] = None       # comma-separated
    visibility: str = "public"


class LearningActivityOut(BaseModel):
    id: str
    user_id: str
    activity_type: str
    title: str
    description: Optional[str] = None
    subject_slug: Optional[str] = None
    topic_slug: Optional[str] = None
    problem_id: Optional[str] = None
    resource_id: Optional[str] = None
    roadmap_id: Optional[str] = None
    tags: Optional[str] = None
    visibility: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Community Post
# ---------------------------------------------------------------------------
class CommunityPostCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=2000)
    tags: Optional[str] = Field(None, max_length=200)
    post_type: str = "custom"
    visibility: str = "public"
    # Optional: link to an existing learning activity
    activity_type: Optional[str] = None
    activity_title: Optional[str] = None
    subject_slug: Optional[str] = None
    topic_slug: Optional[str] = None
    problem_id: Optional[str] = None
    resource_id: Optional[str] = None


class CommunityPostOut(BaseModel):
    id: str
    user_id: str
    content: str
    post_type: str
    tags: Optional[str] = None
    visibility: str
    created_at: datetime
    updated_at: datetime

    # Resolved at query time (not from ORM relationships to avoid N+1)
    author: Optional[AuthorOut] = None
    activity: Optional[LearningActivityOut] = None
    like_count: int = 0
    comment_count: int = 0
    user_has_liked: bool = False

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Comment
# ---------------------------------------------------------------------------
class PostCommentCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=1000)


class PostCommentOut(BaseModel):
    id: str
    post_id: str
    user_id: str
    content: str
    created_at: datetime
    author: Optional[AuthorOut] = None

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Feed Response
# ---------------------------------------------------------------------------
class DateGroup(BaseModel):
    label: str      # "TODAY", "YESTERDAY", "September 22", etc.
    date: str       # ISO date string e.g. "2026-09-24"
    posts: List[CommunityPostOut]


class FeedResponse(BaseModel):
    groups: List[DateGroup]
    total: int
    has_more: bool
    next_offset: Optional[int] = None


# ---------------------------------------------------------------------------
# Community Stats
# ---------------------------------------------------------------------------
class CommunityStats(BaseModel):
    active_today: int
    total_posts: int
    trending_tags: List[str]


# ---------------------------------------------------------------------------
# Follow
# ---------------------------------------------------------------------------
class FollowOut(BaseModel):
    follower_id: str
    following_id: str
    created_at: datetime

    model_config = {"from_attributes": True}
