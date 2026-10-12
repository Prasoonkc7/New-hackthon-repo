import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-only-change-me")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-only-jwt-change-me")
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{Path(__file__).resolve().parent.parent / 'jalrakshak.db'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    CORS_ORIGINS = [x.strip() for x in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")]
    SEED_DEMO = os.getenv("SEED_DEMO", "true").lower() == "true"
    WEATHER_API_BASE_URL = os.getenv("WEATHER_API_BASE_URL", "https://api.open-meteo.com")
    WEATHER_TIMEOUT_SECONDS = float(os.getenv("WEATHER_TIMEOUT_SECONDS", "5"))
    WEATHER_CACHE_SECONDS = int(os.getenv("WEATHER_CACHE_SECONDS", "300"))
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", str(Path(__file__).resolve().parent.parent / "private_uploads"))
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_UPLOAD_BYTES", str(5 * 1024 * 1024)))
    ALLOWED_UPLOAD_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "pdf"}
