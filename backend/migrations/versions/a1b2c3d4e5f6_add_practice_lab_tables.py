"""add_practice_lab_tables

Revision ID: a1b2c3d4e5f6
Revises: 30d943549662
Create Date: 2026-09-27 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '30d943549662'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Create Practice Lab persistence tables."""
    op.create_table(
        'practice_sessions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('ide_type', sa.String(), nullable=False),
        sa.Column('language', sa.String(), nullable=True),
        sa.Column('title', sa.String(), nullable=True),
        sa.Column('code', sa.Text(), nullable=True),
        sa.Column('extra', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_practice_sessions_user_id', 'practice_sessions', ['user_id'])

    op.create_table(
        'code_executions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('session_id', sa.String(), nullable=True),
        sa.Column('language', sa.String(), nullable=True),
        sa.Column('source_code', sa.Text(), nullable=True),
        sa.Column('stdin', sa.Text(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('stdout', sa.Text(), nullable=True),
        sa.Column('stderr', sa.Text(), nullable=True),
        sa.Column('execution_time_ms', sa.Integer(), nullable=True),
        sa.Column('memory_used_kb', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['session_id'], ['practice_sessions.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_code_executions_user_id', 'code_executions', ['user_id'])

    op.create_table(
        'web_projects',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('name', sa.String(), nullable=True),
        sa.Column('html', sa.Text(), nullable=True),
        sa.Column('css', sa.Text(), nullable=True),
        sa.Column('javascript', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_web_projects_user_id', 'web_projects', ['user_id'])

    op.create_table(
        'sql_sessions',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=True),
        sa.Column('query', sa.Text(), nullable=True),
        sa.Column('database_template', sa.String(), nullable=True),
        sa.Column('result_snapshot', sa.JSON(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_sql_sessions_user_id', 'sql_sessions', ['user_id'])


def downgrade() -> None:
    op.drop_table('sql_sessions')
    op.drop_table('web_projects')
    op.drop_table('code_executions')
    op.drop_table('practice_sessions')