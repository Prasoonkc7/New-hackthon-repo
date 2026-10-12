import pytest
from app import create_app
from app.extensions import db

@pytest.fixture()
def client():
    class TestConfig:
        TESTING=True; SECRET_KEY="test"; JWT_SECRET_KEY="test-jwt"; SQLALCHEMY_DATABASE_URI="sqlite:///:memory:"
        SQLALCHEMY_TRACK_MODIFICATIONS=False; CORS_ORIGINS=["http://localhost:5173"]; SEED_DEMO=False
        UPLOAD_FOLDER="test_uploads"; MAX_CONTENT_LENGTH=5 * 1024 * 1024; ALLOWED_UPLOAD_EXTENSIONS={"jpg","jpeg","png","webp","pdf"}
    app=create_app(TestConfig)
    with app.test_client() as c:
        yield c
    with app.app_context(): db.drop_all()
