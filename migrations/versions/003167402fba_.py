from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '003167402fba'
down_revision = '8673d8554277'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table('message',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('room', sa.String(length=50), nullable=False),
    sa.Column('sender', sa.Integer(), nullable=False),
    sa.Column('content', sa.String(length=500), nullable=False),
    sa.Column('timestamp', sa.DateTime(), nullable=False, default=sa.func.now()),
    sa.PrimaryKeyConstraint('id')
    )

def downgrade():
    op.drop_table('message')
