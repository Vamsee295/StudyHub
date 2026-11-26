"""add code submissions

Revision ID: a9c4e2f7b1d3
Revises: f2b6d8e4a9c1
Create Date: 2026-11-26
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'a9c4e2f7b1d3'
down_revision: Union[str, Sequence[str], None] = 'f2b6d8e4a9c1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'code_submissions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('problem_id', sa.String(length=100), nullable=False),
        sa.Column('language', sa.String(length=20), nullable=False),
        sa.Column('code', sa.Text(), nullable=False),
        sa.Column('status', sa.String(length=30), nullable=False),
        sa.Column('passed', sa.Integer(), nullable=False),
        sa.Column('total', sa.Integer(), nullable=False),
        sa.Column('runtime_ms', sa.Integer(), nullable=True),
        sa.Column('failed_case', sa.JSON(), nullable=True),
        sa.Column('error', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_code_submissions_user_id'), 'code_submissions', ['user_id'], unique=False)
    op.create_index('ix_code_submissions_user_problem', 'code_submissions', ['user_id', 'problem_id', 'created_at'], unique=False)


def downgrade() -> None:
    op.drop_index('ix_code_submissions_user_problem', table_name='code_submissions')
    op.drop_index(op.f('ix_code_submissions_user_id'), table_name='code_submissions')
    op.drop_table('code_submissions')
