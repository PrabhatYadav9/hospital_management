import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    MONGODB_URI = os.getenv("MONGODB_URI", "your_mongodb_atlas_uri_here")
    DATABASE_NAME = os.getenv("DATABASE_NAME", "hospital_management")
    JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret_change_in_production")
    JWT_EXPIRY_HOURS = int(os.getenv("JWT_EXPIRY_HOURS", "24"))
    PORT = int(os.getenv("PORT", "5000"))
    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() == "true"
