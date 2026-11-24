"""add ideas board

Revision ID: d4e8b2f6a1c3
Revises: c3f1a7e2b9d4
Create Date: 2026-11-24
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

revision: str = 'd4e8b2f6a1c3'
down_revision: Union[str, Sequence[str], None] = 'c3f1a7e2b9d4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'ideas',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('title', sa.String(length=120), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=30), nullable=False),
        sa.Column('status', sa.String(length=20), nullable=False),
        sa.Column('status_note', sa.Text(), nullable=True),
        sa.Column('vote_count', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index(op.f('ix_ideas_user_id'), 'ideas', ['user_id'], unique=False)
    op.create_index(op.f('ix_ideas_status'), 'ideas', ['status'], unique=False)
    op.create_index(op.f('ix_ideas_created_at'), 'ideas', ['created_at'], unique=False)

    op.create_table(
        'idea_votes',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('idea_id', sa.String(), nullable=False),
        sa.Column('user_id', sa.String(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['idea_id'], ['ideas.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['profiles.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('idea_id', 'user_id', name='uq_idea_vote'),
    )
    op.create_index(op.f('ix_idea_votes_idea_id'), 'idea_votes', ['idea_id'], unique=False)
    op.create_index(op.f('ix_idea_votes_user_id'), 'idea_votes', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_idea_votes_user_id'), table_name='idea_votes')
    op.drop_index(op.f('ix_idea_votes_idea_id'), table_name='idea_votes')
    op.drop_table('idea_votes')
    op.drop_index(op.f('ix_ideas_created_at'), table_name='ideas')
    op.drop_index(op.f('ix_ideas_status'), table_name='ideas')
    op.drop_index(op.f('ix_ideas_user_id'), table_name='ideas')
    op.drop_table('ideas')
