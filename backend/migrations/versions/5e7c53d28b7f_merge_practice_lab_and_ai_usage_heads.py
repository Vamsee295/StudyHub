"""merge practice lab and ai usage heads

Revision ID: 5e7c53d28b7f
Revises: 6ccc0a6b626a, a1b2c3d4e5f6
Create Date: 2026-10-24 19:03:26.605145

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5e7c53d28b7f'
down_revision: Union[str, Sequence[str], None] = ('6ccc0a6b626a', 'a1b2c3d4e5f6')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
