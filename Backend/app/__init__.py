from flask import Flask, jsonify
from pathlib import Path
from .config import Config
from .extensions import cors, db, jwt
from sqlalchemy import inspect, text
from .api.routes import api, auth

def create_app(config_object=Config):
    app = Flask(__name__)
    app.config.from_object(config_object)
    Path(app.config.get("UPLOAD_FOLDER", "private_uploads")).mkdir(parents=True, exist_ok=True)
    db.init_app(app); jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": app.config["CORS_ORIGINS"]}}, supports_credentials=True)
    app.register_blueprint(api); app.register_blueprint(auth)
    @app.get("/health")
    def health(): return jsonify({"status":"ok","service":"jalrakshak-api"})
    @app.errorhandler(404)
    def not_found(_): return jsonify({"error":"Resource not found"}),404
    @app.errorhandler(500)
    def server_error(_): db.session.rollback(); return jsonify({"error":"Internal server error"}),500
    with app.app_context():
        from .models import Alert
        db.create_all()
        _upgrade_schema()
        if app.config.get("SEED_DEMO") and not Alert.query.first():
            seed_demo()
    return app

def _upgrade_schema():
    _make_report_location_optional()
    additions = {
        "hazard_report": [
            ("evidence_name", "VARCHAR(255)"), ("evidence_mime", "VARCHAR(100)"), ("evidence_size", "INTEGER")
        ],
        "rescue_request": [
            ("evidence_name", "VARCHAR(255)"), ("evidence_mime", "VARCHAR(100)"), ("evidence_size", "INTEGER")
        ],
        "recovery_application": [
            ("evidence_name", "VARCHAR(255)"), ("evidence_mime", "VARCHAR(100)"), ("evidence_size", "INTEGER")
        ],
    }
    inspector = inspect(db.engine)
    for table, columns in additions.items():
        existing = {column["name"] for column in inspector.get_columns(table)}
        for name, definition in columns:
            if name not in existing:
                db.session.execute(text(f"ALTER TABLE {table} ADD COLUMN {name} {definition}"))
    db.session.commit()
    _make_rescue_location_fields_optional()

def _make_report_location_optional():
    columns = {column["name"]: column for column in inspect(db.engine).get_columns("hazard_report")}
    if not columns or columns["lat"]["nullable"]:
        return
    db.session.execute(text("""
        CREATE TABLE hazard_report_new (
            id VARCHAR(36) PRIMARY KEY,
            hazard VARCHAR(40) NOT NULL,
            district VARCHAR(100) NOT NULL,
            municipality VARCHAR(100) NOT NULL,
            lat FLOAT,
            lng FLOAT,
            description TEXT NOT NULL,
            observed_at DATETIME NOT NULL,
            status VARCHAR(30) NOT NULL,
            source VARCHAR(20),
            reporter_id VARCHAR(36),
            created_at DATETIME,
            updated_at DATETIME,
            is_demo BOOLEAN,
            evidence_name VARCHAR(255),
            evidence_mime VARCHAR(100),
            evidence_size INTEGER,
            FOREIGN KEY (reporter_id) REFERENCES user (id)
        )
    """))
    db.session.execute(text("""
        INSERT INTO hazard_report_new
        SELECT id, hazard, district, municipality, lat, lng, description, observed_at,
               status, source, reporter_id, created_at, updated_at, is_demo,
               evidence_name, evidence_mime, evidence_size
        FROM hazard_report
    """))
    db.session.execute(text("DROP TABLE hazard_report"))
    db.session.execute(text("ALTER TABLE hazard_report_new RENAME TO hazard_report"))

def _make_rescue_location_fields_optional():
    columns = {column["name"]: column for column in inspect(db.engine).get_columns("rescue_request")}
    if not columns or columns["district"]["nullable"] and columns["municipality"]["nullable"]:
        return
    db.session.execute(text("DROP TABLE IF EXISTS rescue_request_new"))
    db.session.execute(text("""
        CREATE TABLE rescue_request_new (
            id VARCHAR(36) PRIMARY KEY,
            reference VARCHAR(30) NOT NULL UNIQUE,
            category VARCHAR(40) NOT NULL,
            urgency VARCHAR(30) NOT NULL,
            name VARCHAR(120),
            phone VARCHAR(40),
            contact_method VARCHAR(20),
            district VARCHAR(100),
            municipality VARCHAR(100),
            lat FLOAT,
            lng FLOAT,
            people INTEGER,
            description TEXT NOT NULL,
            medical_concerns TEXT,
            status VARCHAR(30),
            assigned_to VARCHAR(120),
            owner_id VARCHAR(36),
            created_at DATETIME,
            updated_at DATETIME,
            is_demo BOOLEAN,
            evidence_name VARCHAR(255),
            evidence_mime VARCHAR(100),
            evidence_size INTEGER,
            FOREIGN KEY (owner_id) REFERENCES user (id)
        )
    """))
    db.session.execute(text("""
        INSERT INTO rescue_request_new
        SELECT id, reference, category, urgency, name, phone, contact_method,
               district, municipality, lat, lng, people, description,
               medical_concerns, status, assigned_to, owner_id, created_at,
               updated_at, is_demo, evidence_name, evidence_mime, evidence_size
        FROM rescue_request
    """))
    db.session.execute(text("DROP TABLE rescue_request"))
    db.session.execute(text("ALTER TABLE rescue_request_new RENAME TO rescue_request"))

def seed_demo():
    from datetime import datetime, timezone
    from .models import Alert, Shelter, Facility, User
    admin=User(name="Demo Administrator",email="admin@jalrakshak.local",role="admin"); admin.set_password("change-this-password"); db.session.add(admin)
    now=datetime.now(timezone.utc)
    db.session.add(Alert(title="Demo river monitoring advisory",district="Kathmandu",municipality="Kageshwori",hazard="river_rise",severity="moderate",source="JalRakshak demo",published_at=now,updated_at=now,verified=False))
    db.session.add(Shelter(name="Community Hall (Demo)",district="Kathmandu",municipality="Kageshwori",address="Demo location — verify before travel",lat=27.72,lng=85.36,capacity=100,occupancy=18,water=True,food=True,medical=False,sanitation=True,accessible=True,verified=False))
    db.session.add(Facility(kind="medical",name="Demo medical facility",district="Kathmandu",lat=27.71,lng=85.32))
    db.session.commit()
