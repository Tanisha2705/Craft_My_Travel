from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(120), nullable=True)
    phone = db.Column(db.String(30), nullable=True)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    date_joined = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)

    def set_password(self, password: str) -> None:
        self.password_hash = generate_password_hash(password, method="pbkdf2:sha256")

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "name": self.name,
            "phone": self.phone,
            "is_admin": self.is_admin,
            "date_joined": self.date_joined.strftime("%Y-%m-%d %H:%M:%S") if self.date_joined else None,
            "last_login": self.last_login.strftime("%Y-%m-%d %H:%M:%S") if self.last_login else None,
        }


class POI(db.Model):
    """A point of interest, optionally enriched from Foursquare / Wikipedia / Unsplash."""

    __tablename__ = "pois"

    id = db.Column(db.Integer, primary_key=True)
    fsq_id = db.Column(db.String(64), unique=True, nullable=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    image_url = db.Column(db.String(500), nullable=True)
    category = db.Column(db.String(120), nullable=True)
    lat = db.Column(db.Float, nullable=True)
    lon = db.Column(db.Float, nullable=True)
    destination = db.Column(db.String(120), nullable=False, index=True)


class ItineraryRequest(db.Model):
    """Log of every itinerary a visitor generated. Useful for analytics."""

    __tablename__ = "itinerary_requests"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
    destination = db.Column(db.String(120), nullable=False)
    people = db.Column(db.Integer, nullable=True)
    days = db.Column(db.Integer, nullable=True)
    budget = db.Column(db.Integer, nullable=True)
    preferences = db.Column(db.String(500), nullable=True)
    source = db.Column(db.String(20), nullable=True)  # 'curated' | 'generated'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "destination": self.destination,
            "people": self.people,
            "days": self.days,
            "budget": self.budget,
            "preferences": self.preferences,
            "source": self.source,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S") if self.created_at else None,
        }
