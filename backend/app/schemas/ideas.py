from datetime import datetime
from typing import List, Literal, Optional
from pydantic import BaseModel, Field, field_validator

Category = Literal["learn", "practice", "tools", "community", "other"]
Status = Literal["open", "planned", "in_progress", "shipped", "declined"]


class IdeaCreate(BaseModel):
    title: str = Field(..., min_length=8, max_length=120)
    description: Optional[str] = Field(None, max_length=2000)
    category: Category = "other"

    @field_validator("title", "description")
    @classmethod
    def strip(cls, v):
        return v.strip() if isinstance(v, str) else v


class IdeaStatusUpdate(BaseModel):
    status: Status
    status_note: Optional[str] = Field(None, max_length=1000)


class IdeaOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    category: str
    status: str
    status_note: Optional[str] = None
    vote_count: int
    author_name: str
    created_at: datetime
    has_voted: bool = False
    is_mine: bool = False


class IdeaList(BaseModel):
    items: List[IdeaOut]
    total: int
    counts: dict  # status -> number of ideas, for the filter tabs
    is_admin: bool = False
