"""
Application configuration.

All values can be overridden with environment variables (see .env.example).
Never commit a real .env file with real secrets — it is git-ignored on purpose.
"""
import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    # --- Core Flask / security ---
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key-change-me")
    JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", "24"))

    # --- Database ---
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "sqlite:///" + os.path.join(BASE_DIR, "travel.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- CORS ---
    # Comma separated list of allowed origins, e.g. "http://localhost:5173,https://myapp.com"
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*")

    # --- Default admin account (created automatically on first run) ---
    DEFAULT_ADMIN_USERNAME = os.getenv("DEFAULT_ADMIN_USERNAME", "admin")
    DEFAULT_ADMIN_EMAIL = os.getenv("DEFAULT_ADMIN_EMAIL", "admin@craftmytravel.com")
    DEFAULT_ADMIN_PASSWORD = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")

    # --- Optional third-party enrichment keys (live POI fetching) ---
    FOURSQUARE_API_KEY = os.getenv("FOURSQUARE_API_KEY", "")
    UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY", "")

    JWT_EXPIRES_DELTA = timedelta(hours=JWT_EXPIRES_HOURS)
