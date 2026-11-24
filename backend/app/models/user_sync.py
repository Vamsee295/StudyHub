from datetime import datetime
import uuid
from sqlalchemy import Column, String, DateTime, BigInteger, ForeignKey, JSON, UniqueConstraint
from app.core.database import Base


def generate_uuid():
    return str(uuid.uuid4())


class UserSyncData(Base):
    """
    Study data that used to live only in one browser (streaks, mock tests, review queue,
    bookmarks, tool data), synced per user. One row per allow-listed key.
    `updated_at` is the client's millisecond timestamp of its last change, used for
    last-write-wins; `server_updated_at` records when the server stored it.
    """
    __tablename__ = "user_sync_data"
    __table_args__ = (UniqueConstraint("user_id", "key", name="uq_user_sync_key"),)

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    key = Column(String(100), nullable=False)
    value = Column(JSON, nullable=True)
    updated_at = Column(BigInteger, nullable=False)
    server_updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
