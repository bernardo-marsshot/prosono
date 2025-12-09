"""add unique constraints for cleveland and my sleep surveys

Revision ID: ec951403bba1
Revises: 2e77dff556ce
Create Date: 2025-07-27 17:24:15.311339

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ec951403bba1'
down_revision: Union[str, Sequence[str], None] = '2e77dff556ce'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Add unique constraint for Cleveland surveys
    op.create_unique_constraint(
        'uq_cleveland_survey_user_date', 
        'cleveland_surveys', 
        ['user_id', 'survey_date']
    )
    
    # Add unique constraint for My Sleep surveys
    op.create_unique_constraint(
        'uq_my_sleep_survey_user_date', 
        'my_sleep_surveys', 
        ['user_id', 'survey_date']
    )


def downgrade() -> None:
    """Downgrade schema."""
    # Remove unique constraint for My Sleep surveys
    op.drop_constraint('uq_my_sleep_survey_user_date', 'my_sleep_surveys', type_='unique')
    
    # Remove unique constraint for Cleveland surveys
    op.drop_constraint('uq_cleveland_survey_user_date', 'cleveland_surveys', type_='unique')
