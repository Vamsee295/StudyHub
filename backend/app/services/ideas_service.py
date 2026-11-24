"""
Ideas board service: feature requests, upvotes and admin-managed status.
"""
from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.ideas import Idea, IdeaVote
from app.models.profile import Profile
from app.schemas.ideas import IdeaCreate, IdeaOut, IdeaList, IdeaStatusUpdate

ACTIVE = ("open", "planned", "in_progress")
MAX_IDEAS_PER_DAY = 5


class IdeaError(Exception):
    def __init__(self, status: int, detail: str):
        self.status, self.detail = status, detail


def _out(idea: Idea, author: Optional[Profile], voted: set, user_id: Optional[str]) -> IdeaOut:
    return IdeaOut(
        id=idea.id, title=idea.title, description=idea.description, category=idea.category,
        status=idea.status, status_note=idea.status_note, vote_count=idea.vote_count,
        author_name=(author.full_name if author and author.full_name else "StudyHub Learner"),
        created_at=idea.created_at, has_voted=idea.id in voted, is_mine=bool(user_id and idea.user_id == user_id),
    )


async def list_ideas(session: AsyncSession, user_id: Optional[str], status: str = "active", sort: str = "top",
                     q: str = "", limit: int = 20, offset: int = 0, is_admin: bool = False) -> IdeaList:
    stmt = select(Idea, Profile).join(Profile, Profile.id == Idea.user_id, isouter=True)
    if status == "active":
        stmt = stmt.where(Idea.status.in_(ACTIVE))
    elif status != "all":
        stmt = stmt.where(Idea.status == status)
    if q.strip():
        like = f"%{q.strip()}%"
        stmt = stmt.where(or_(Idea.title.ilike(like), Idea.description.ilike(like)))

    total = (await session.execute(select(func.count()).select_from(stmt.subquery()))).scalar_one()
    order = [Idea.created_at.desc()] if sort == "new" else [Idea.vote_count.desc(), Idea.created_at.desc()]
    rows = (await session.execute(stmt.order_by(*order).limit(limit).offset(offset))).all()

    voted: set = set()
    if user_id and rows:
        ids = [i.id for i, _ in rows]
        voted = set((await session.execute(
            select(IdeaVote.idea_id).where(IdeaVote.user_id == user_id, IdeaVote.idea_id.in_(ids)))).scalars())

    counts = dict((await session.execute(select(Idea.status, func.count()).group_by(Idea.status))).all())
    return IdeaList(items=[_out(i, p, voted, user_id) for i, p in rows], total=total, counts=counts, is_admin=is_admin)


async def create_idea(session: AsyncSession, user_id: str, data: IdeaCreate, now: Optional[datetime] = None) -> IdeaOut:
    now = now or datetime.utcnow()
    recent = (await session.execute(select(func.count()).select_from(Idea).where(
        Idea.user_id == user_id, Idea.created_at >= now - timedelta(days=1)))).scalar_one()
    if recent >= MAX_IDEAS_PER_DAY:
        raise IdeaError(429, f"You can post up to {MAX_IDEAS_PER_DAY} ideas a day. Upvote existing ideas meanwhile.")

    dup = (await session.execute(select(Idea).where(
        func.lower(Idea.title) == data.title.lower(), Idea.status.in_(ACTIVE)))).scalars().first()
    if dup:
        raise IdeaError(409, f"An open idea with this title already exists: {dup.id}")

    idea = Idea(user_id=user_id, title=data.title, description=data.description or None,
                category=data.category, vote_count=1, created_at=now, updated_at=now)
    session.add(idea)
    await session.flush()
    session.add(IdeaVote(idea_id=idea.id, user_id=user_id))  # authors back their own idea
    await session.commit()
    author = await session.get(Profile, user_id)
    return _out(idea, author, {idea.id}, user_id)


async def set_vote(session: AsyncSession, idea_id: str, user_id: str, vote: bool) -> dict:
    idea = await session.get(Idea, idea_id)
    if not idea:
        raise IdeaError(404, "Idea not found")
    existing = (await session.execute(select(IdeaVote).where(
        IdeaVote.idea_id == idea_id, IdeaVote.user_id == user_id))).scalars().first()
    if vote and not existing:
        session.add(IdeaVote(idea_id=idea_id, user_id=user_id))
    elif not vote and existing:
        await session.delete(existing)
    await session.flush()
    # Recount instead of incrementing so concurrent votes can't drift the stored total.
    idea.vote_count = (await session.execute(select(func.count()).select_from(IdeaVote).where(
        IdeaVote.idea_id == idea_id))).scalar_one()
    await session.commit()
    return {"has_voted": vote, "vote_count": idea.vote_count}


async def update_status(session: AsyncSession, idea_id: str, data: IdeaStatusUpdate) -> IdeaOut:
    idea = await session.get(Idea, idea_id)
    if not idea:
        raise IdeaError(404, "Idea not found")
    idea.status = data.status
    idea.status_note = data.status_note
    await session.commit()
    author = await session.get(Profile, idea.user_id)
    return _out(idea, author, set(), None)


async def delete_idea(session: AsyncSession, idea_id: str, user_id: str, is_admin: bool) -> None:
    idea = await session.get(Idea, idea_id)
    if not idea:
        raise IdeaError(404, "Idea not found")
    if not is_admin and idea.user_id != user_id:
        raise IdeaError(403, "You can only delete your own ideas")
    if not is_admin and idea.status != "open":
        raise IdeaError(409, "Ideas that are planned or shipped can't be deleted")
    await session.delete(idea)
    await session.commit()
