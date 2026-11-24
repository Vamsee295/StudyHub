from datetime import date, datetime
from typing import List, Optional
from pydantic import BaseModel, Field


class LogLesson(BaseModel):
    subject_slug: str
    subject_title: str
    topic_slug: str
    title: str
    minutes: int = 0


class LogDraft(BaseModel):
    """Lessons completed on a local date, plus the published log for that date if any."""
    log_date: date
    lessons: List[LogLesson]
    minutes: int
    published: Optional["StudyLogOut"] = None


class LogPublish(BaseModel):
    note: Optional[str] = Field(None, max_length=1000)


class StudyLogOut(BaseModel):
    id: str
    user_id: str
    author_name: str
    avatar_url: Optional[str] = None
    log_date: date
    note: Optional[str] = None
    lessons: List[LogLesson]
    lesson_count: int
    minutes: int
    updated_at: datetime
    is_mine: bool = False


class LogDay(BaseModel):
    log_date: date
    logs: List[StudyLogOut]
    total: int


class LogDates(BaseModel):
    dates: List[dict]   # [{"log_date": "2026-11-24", "count": 3}], newest first


LogDraft.model_rebuild()
