"""
Community daily study logs.

A draft is computed from the learner's own lesson completions on a local calendar date and is
never stored. Publishing snapshots that draft (plus an optional note) into study_logs, which the
public archive reads. Nothing is public unless the learner publishes it.
"""
from datetime import date, datetime, timedelta
from typing import List, Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.learning import LearningModule, LearningSubject, LearningTopic, UserLearningProgress
from app.models.profile import Profile
from app.models.study_logs import StudyLog
from app.schemas.study_logs import LogDraft, LogLesson, StudyLogOut, LogDay

MAX_TZ_OFFSET = 14 * 60   # minutes; covers every real time zone


class LogError(Exception):
    def __init__(self, status: int, detail: str):
        self.status, self.detail = status, detail


def local_day_window(day: date, tz_offset_minutes: int) -> tuple[datetime, datetime]:
    """UTC start and end of a local calendar day. tz_offset follows JavaScript's
    getTimezoneOffset(): minutes to add to local time to get UTC (India is -330)."""
    if abs(tz_offset_minutes) > MAX_TZ_OFFSET:
        raise LogError(400, "Invalid time zone offset")
    start = datetime(day.year, day.month, day.day) + timedelta(minutes=tz_offset_minutes)
    return start, start + timedelta(days=1)


def local_today(tz_offset_minutes: int, now: Optional[datetime] = None) -> date:
    return ((now or datetime.utcnow()) - timedelta(minutes=tz_offset_minutes)).date()


async def lessons_completed(session: AsyncSession, user_id: str, day: date, tz_offset: int) -> List[LogLesson]:
    start, end = local_day_window(day, tz_offset)
    rows = (await session.execute(
        select(LearningTopic, LearningSubject)
        .join(UserLearningProgress, UserLearningProgress.topic_id == LearningTopic.id)
        .join(LearningModule, LearningModule.id == LearningTopic.module_id)
        .join(LearningSubject, LearningSubject.id == LearningModule.subject_id)
        .where(
            UserLearningProgress.user_id == user_id,
            UserLearningProgress.status == "completed",
            UserLearningProgress.completed_at >= start,
            UserLearningProgress.completed_at < end,
        )
        .order_by(UserLearningProgress.completed_at)
    )).all()
    return [LogLesson(subject_slug=s.slug, subject_title=s.name, topic_slug=t.slug or t.id,
                      title=t.title, minutes=t.estimated_minutes or 0) for t, s in rows]


def _out(log: StudyLog, author: Optional[Profile], viewer_id: Optional[str]) -> StudyLogOut:
    return StudyLogOut(
        id=log.id, user_id=log.user_id,
        author_name=(author.full_name if author and author.full_name else "StudyHub Learner"),
        avatar_url=getattr(author, "avatar_url", None) if author else None,
        log_date=log.log_date, note=log.note, lessons=[LogLesson(**x) for x in (log.lessons or [])],
        lesson_count=log.lesson_count, minutes=log.minutes, updated_at=log.updated_at,
        is_mine=bool(viewer_id and log.user_id == viewer_id),
    )


async def _own_log(session: AsyncSession, user_id: str, day: date) -> Optional[StudyLog]:
    return (await session.execute(select(StudyLog).where(
        StudyLog.user_id == user_id, StudyLog.log_date == day))).scalars().first()


def _check_publishable_day(day: date, tz_offset: int, now: Optional[datetime] = None):
    today = local_today(tz_offset, now)
    # Logs are for today or yesterday only, so the archive reflects real day-by-day study.
    if day > today or day < today - timedelta(days=1):
        raise LogError(400, "You can publish a log for today or yesterday only")


async def get_draft(session: AsyncSession, user_id: str, day: date, tz_offset: int) -> LogDraft:
    lessons = await lessons_completed(session, user_id, day, tz_offset)
    existing = await _own_log(session, user_id, day)
    author = await session.get(Profile, user_id) if existing else None
    return LogDraft(log_date=day, lessons=lessons, minutes=sum(l.minutes for l in lessons),
                    published=_out(existing, author, user_id) if existing else None)


async def publish(session: AsyncSession, user_id: str, day: date, tz_offset: int, note: Optional[str],
                  now: Optional[datetime] = None) -> StudyLogOut:
    _check_publishable_day(day, tz_offset, now)
    lessons = await lessons_completed(session, user_id, day, tz_offset)
    note = (note or "").strip() or None
    if not lessons and not note:
        raise LogError(400, "Complete a lesson or write a note before publishing")

    log = await _own_log(session, user_id, day)
    if not log:
        log = StudyLog(user_id=user_id, log_date=day)
        session.add(log)
    log.note = note
    log.lessons = [l.model_dump() for l in lessons]
    log.lesson_count = len(lessons)
    log.minutes = sum(l.minutes for l in lessons)
    log.updated_at = now or datetime.utcnow()
    await session.commit()
    author = await session.get(Profile, user_id)
    return _out(log, author, user_id)


async def unpublish(session: AsyncSession, user_id: str, day: date) -> bool:
    log = await _own_log(session, user_id, day)
    if not log:
        return False
    await session.delete(log)
    await session.commit()
    return True


async def logs_for_day(session: AsyncSession, day: date, viewer_id: Optional[str], limit: int = 20, offset: int = 0) -> LogDay:
    base = select(StudyLog, Profile).join(Profile, Profile.id == StudyLog.user_id, isouter=True).where(StudyLog.log_date == day)
    total = (await session.execute(select(func.count()).select_from(StudyLog).where(StudyLog.log_date == day))).scalar_one()
    rows = (await session.execute(base.order_by(StudyLog.lesson_count.desc(), StudyLog.updated_at.desc()).limit(limit).offset(offset))).all()
    return LogDay(log_date=day, logs=[_out(l, p, viewer_id) for l, p in rows], total=total)


async def recent_dates(session: AsyncSession, limit: int = 30) -> list[dict]:
    rows = (await session.execute(
        select(StudyLog.log_date, func.count()).group_by(StudyLog.log_date).order_by(StudyLog.log_date.desc()).limit(limit)
    )).all()
    return [{"log_date": d.isoformat(), "count": c} for d, c in rows]


async def user_logs(session: AsyncSession, user_id: str, viewer_id: Optional[str], limit: int = 30) -> List[StudyLogOut]:
    author = await session.get(Profile, user_id)
    rows = (await session.execute(select(StudyLog).where(StudyLog.user_id == user_id)
                                  .order_by(StudyLog.log_date.desc()).limit(limit))).scalars().all()
    return [_out(l, author, viewer_id) for l in rows]
