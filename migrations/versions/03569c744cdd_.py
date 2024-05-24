"""empty message

Revision ID: 03569c744cdd
Revises: 
Create Date: 2024-05-22 23:17:53.411175

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '03569c744cdd'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('city',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=250), nullable=False),
    sa.Column('pet_friendly', sa.String(length=250), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('owner',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=120), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('name')
    )
    op.create_table('pets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=50), nullable=False),
    sa.Column('breed', sa.String(length=50), nullable=False),
    sa.Column('sex', sa.String(length=10), nullable=False),
    sa.Column('age', sa.Integer(), nullable=False),
    sa.Column('pedigree', sa.Boolean(), nullable=False),
    sa.Column('photo', sa.String(length=100), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('is_active', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user')
    op.drop_table('pets')
    op.drop_table('owner')
    op.drop_table('city')
    # ### end Alembic commands ###
