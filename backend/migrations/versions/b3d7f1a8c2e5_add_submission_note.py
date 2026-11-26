"""add note to code submissions

Revision ID: b3d7f1a8c2e5
Revises: a9c4e2f7b1d3
Create Date: 2026-11-26
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'b3d7f1a8c2e5'
down_revision: Union[str, Sequence[str], None] = 'a9c4e2f7b1d3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('code_submissions') as batch:
        batch.add_column(sa.Column('note', sa.String(length=500), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('code_submissions') as batch:
        batch.drop_column('note')
