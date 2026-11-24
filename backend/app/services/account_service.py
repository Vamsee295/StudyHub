"""Permanent account deletion: every row that belongs to a user, then the profile itself."""
from sqlalchemy import delete, false, func, or_, select, update
from sqlalchemy.ext.asyncio import AsyncSession

import app.models  # noqa: F401  (registers every table on Base.metadata)
from app.core.database import Base


def _doomed(table, user_id: str):
    """WHERE clause for the rows of `table` that go when `user_id` is deleted: rows the user owns, and rows
    that hang off a doomed parent row (another learner's comment on the user's post, a vote on their idea).

    Done by hand rather than with ON DELETE CASCADE, which SQLite ignores unless PRAGMA foreign_keys=ON.
    """
    conds = []
    for c in table.columns:
        for fk in c.foreign_keys:
            parent = fk.column.table
            if parent.name == "profiles":
                conds.append(c == user_id)
            elif parent is not table:  # self-references (reply-to) are covered by the row's own owner
                conds.append(c.in_(select(fk.column).where(_doomed(parent, user_id))))
        if c.name == "user_id" and not c.foreign_keys:
            conds.append(c == user_id)
    return or_(*conds) if conds else false()


async def delete_user_data(session: AsyncSession, user_id: str) -> int:
    """Deletes the user's rows from every table (children first) and their profile. Returns rows removed."""
    ideas, votes = Base.metadata.tables["ideas"], Base.metadata.tables["idea_votes"]
    voted = (await session.execute(select(votes.c.idea_id).where(votes.c.user_id == user_id))).scalars().all()

    removed = 0
    for table in reversed(Base.metadata.sorted_tables):  # children before parents
        if table.name == "profiles":
            continue
        res = await session.execute(delete(table).where(_doomed(table, user_id)))
        removed += res.rowcount or 0
    profiles = Base.metadata.tables["profiles"]
    removed += (await session.execute(delete(profiles).where(profiles.c.id == user_id))).rowcount or 0

    # ideas.vote_count is denormalised: recount the ideas this user had voted on
    if voted:
        count = select(func.count()).where(votes.c.idea_id == ideas.c.id).scalar_subquery()
        await session.execute(update(ideas).where(ideas.c.id.in_(voted)).values(vote_count=count))

    await session.commit()
    return removed
