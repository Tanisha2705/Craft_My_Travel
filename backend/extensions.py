"""Shared extension instances, created once and imported everywhere else.

Keeping these in their own module (instead of inside app.py) avoids circular
imports between app.py, models.py and the route blueprints.
"""
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
