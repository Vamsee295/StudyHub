"""add user sync data

Revision ID: f2b6d8e4a9c1
Revises: e7a3c9d1b5f2
Create Date: 2026-11-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'f2b6d8e4a9c1'
down_revision: Union[str, Sequence[str], None] = 'e7a3c9d1b5f2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'user_sync_data',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('key', sa.String(length=100), nullable=False),
        sa.Column('value', sa.JSON(), nullable=True),
        sa.Column('updated_at', sa.BigInteger(), nullable=False),
        sa.Column('server_updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'key', name='uq_user_sync_key'),
    )
    op.create_index(op.f('ix_user_sync_data_user_id'), 'user_sync_data', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_sync_data_user_id'), table_name='user_sync_data')
    op.drop_table('user_sync_data')
