"""add study logs (Study With Me daily logs)

Revision ID: e7a3c9d1b5f2
Revises: d4e8b2f6a1c3
Create Date: 2026-11-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'e7a3c9d1b5f2'
down_revision: Union[str, Sequence[str], None] = 'd4e8b2f6a1c3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'study_logs',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('log_date', sa.Date(), nullable=False),
        sa.Column('note', sa.Text(), nullable=True),
        sa.Column('lessons', sa.JSON(), nullable=False),
        sa.Column('lesson_count', sa.Integer(), nullable=False),
        sa.Column('minutes', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'log_date', name='uq_study_log_day'),
    )
    op.create_index(op.f('ix_study_logs_user_id'), 'study_logs', ['user_id'], unique=False)
    op.create_index(op.f('ix_study_logs_log_date'), 'study_logs', ['log_date'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_study_logs_log_date'), table_name='study_logs')
    op.drop_index(op.f('ix_study_logs_user_id'), table_name='study_logs')
    op.drop_table('study_logs')
