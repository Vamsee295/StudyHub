"""add per-question answers to practice attempts

Revision ID: c3f1a7e2b9d4
Revises: bdf7519a95bb
Create Date: 2026-11-02 12:00:00

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'c3f1a7e2b9d4'
down_revision: Union[str, Sequence[str], None] = 'bdf7519a95bb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('user_practice_attempts', sa.Column('answers', sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column('user_practice_attempts', 'answers')
