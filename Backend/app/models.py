from datetime import datetime, timezone
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
from .extensions import db

def uid(): return str(uuid.uuid4())
def utcnow(): return datetime.now(timezone.utc)

class User(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=uid)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default="citizen")
    created_at = db.Column(db.DateTime(timezone=True), default=utcnow, nullable=False)
    def set_password(self, value): self.password_hash = generate_password_hash(value)
    def check_password(self, value): return check_password_hash(self.password_hash, value)
    def json(self): return {"id": self.id, "name": self.name, "email": self.email, "role": self.role}

class HazardReport(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=uid); hazard = db.Column(db.String(40), nullable=False)
    district = db.Column(db.String(100), nullable=False); municipality = db.Column(db.String(100), nullable=False)
    lat = db.Column(db.Float, nullable=True); lng = db.Column(db.Float, nullable=True)
    description = db.Column(db.Text, nullable=False); observed_at = db.Column(db.DateTime(timezone=True), nullable=False)
    status = db.Column(db.String(30), default="unverified", nullable=False); source = db.Column(db.String(20), default="community")
    reporter_id = db.Column(db.String(36), db.ForeignKey("user.id")); created_at = db.Column(db.DateTime(timezone=True), default=utcnow)
    updated_at = db.Column(db.DateTime(timezone=True), default=utcnow, onupdate=utcnow); is_demo = db.Column(db.Boolean, default=False)
    evidence_name=db.Column(db.String(255)); evidence_mime=db.Column(db.String(100)); evidence_size=db.Column(db.Integer)
    def json(self): return {"id":self.id,"hazard":self.hazard,"district":self.district,"municipality":self.municipality,"location":{"lat":self.lat,"lng":self.lng} if self.lat is not None and self.lng is not None else None,"description":self.description,"observedAt":self.observed_at.isoformat(),"createdAt":self.created_at.isoformat(),"updatedAt":self.updated_at.isoformat(),"status":self.status,"source":self.source,"hasImage":bool(self.evidence_name),"isDemo":self.is_demo}

class RescueRequest(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); reference=db.Column(db.String(30),unique=True,index=True,nullable=False)
    category=db.Column(db.String(40),nullable=False); urgency=db.Column(db.String(30),nullable=False); name=db.Column(db.String(120)); phone=db.Column(db.String(40)); contact_method=db.Column(db.String(20),default="none")
    district=db.Column(db.String(100),nullable=True); municipality=db.Column(db.String(100),nullable=True); lat=db.Column(db.Float); lng=db.Column(db.Float); people=db.Column(db.Integer,default=1)
    description=db.Column(db.Text,nullable=False); medical_concerns=db.Column(db.Text); status=db.Column(db.String(30),default="submitted"); assigned_to=db.Column(db.String(120))
    owner_id=db.Column(db.String(36),db.ForeignKey("user.id")); created_at=db.Column(db.DateTime(timezone=True),default=utcnow); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow,onupdate=utcnow); is_demo=db.Column(db.Boolean,default=False)
    evidence_name=db.Column(db.String(255)); evidence_mime=db.Column(db.String(100)); evidence_size=db.Column(db.Integer)
    def json(self, private=False): return {"id":self.id,"reference":self.reference,"category":self.category,"urgency":self.urgency,"name":self.name if private else None,"phone":self.phone if private else None,"contactMethod":self.contact_method if private else "none","district":self.district,"municipality":self.municipality,"location":{"lat":self.lat,"lng":self.lng} if private and self.lat is not None else None,"people":self.people,"description":self.description,"medicalConcerns":self.medical_concerns if private else None,"hasImage":bool(self.evidence_name),"status":self.status,"assignedTo":self.assigned_to if private else None,"createdAt":self.created_at.isoformat(),"updatedAt":self.updated_at.isoformat(),"ownerId":self.owner_id if private else None,"isDemo":self.is_demo}

class Shelter(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); name=db.Column(db.String(150),nullable=False); district=db.Column(db.String(100),nullable=False); municipality=db.Column(db.String(100),nullable=False); address=db.Column(db.String(255),nullable=False); lat=db.Column(db.Float,nullable=False); lng=db.Column(db.Float,nullable=False); capacity=db.Column(db.Integer); occupancy=db.Column(db.Integer,default=0); water=db.Column(db.Boolean,default=False); food=db.Column(db.Boolean,default=False); medical=db.Column(db.Boolean,default=False); sanitation=db.Column(db.Boolean,default=True); accessible=db.Column(db.Boolean,default=False); contact=db.Column(db.String(80)); verified=db.Column(db.Boolean,default=False); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow,onupdate=utcnow); is_demo=db.Column(db.Boolean,default=False)
    def json(self): return {"id":self.id,"name":self.name,"district":self.district,"municipality":self.municipality,"address":self.address,"location":{"lat":self.lat,"lng":self.lng},"capacity":self.capacity,"occupancy":self.occupancy,"water":self.water,"food":self.food,"medical":self.medical,"sanitation":self.sanitation,"accessible":self.accessible,"contact":self.contact,"verified":self.verified,"updatedAt":self.updated_at.isoformat(),"isDemo":self.is_demo}

class ReliefRequest(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); item=db.Column(db.String(40),nullable=False); quantity=db.Column(db.Integer,nullable=False); area=db.Column(db.String(120),nullable=False); district=db.Column(db.String(100),nullable=False); urgency=db.Column(db.String(20),nullable=False); status=db.Column(db.String(30),default="pending"); provider=db.Column(db.String(120)); created_at=db.Column(db.DateTime(timezone=True),default=utcnow); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow,onupdate=utcnow); is_demo=db.Column(db.Boolean,default=False)
    def json(self): return {"id":self.id,"item":self.item,"quantity":self.quantity,"area":self.area,"district":self.district,"urgency":self.urgency,"status":self.status,"provider":self.provider,"createdAt":self.created_at.isoformat(),"updatedAt":self.updated_at.isoformat(),"isDemo":self.is_demo}

class InventoryItem(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); provider=db.Column(db.String(120),nullable=False); item=db.Column(db.String(40),nullable=False); quantity=db.Column(db.Integer,nullable=False); district=db.Column(db.String(100),nullable=False); confirmed=db.Column(db.Boolean,default=False); lat=db.Column(db.Float,nullable=False); lng=db.Column(db.Float,nullable=False); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow,onupdate=utcnow); is_demo=db.Column(db.Boolean,default=False)
    def json(self): return {"id":self.id,"provider":self.provider,"item":self.item,"quantity":self.quantity,"district":self.district,"confirmed":self.confirmed,"updatedAt":self.updated_at.isoformat(),"location":{"lat":self.lat,"lng":self.lng},"isDemo":self.is_demo}

class RecoveryApplication(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); reference=db.Column(db.String(30),unique=True,index=True,nullable=False); type=db.Column(db.String(40),nullable=False); household=db.Column(db.String(150),nullable=False); district=db.Column(db.String(100),nullable=False); municipality=db.Column(db.String(100),nullable=False); description=db.Column(db.Text,nullable=False); estimated_loss=db.Column(db.Float); has_evidence=db.Column(db.Boolean,default=False); assessment=db.Column(db.String(30),default="community_reported"); status=db.Column(db.String(30),default="submitted"); decision_note=db.Column(db.Text); history=db.Column(db.JSON,default=list); owner_id=db.Column(db.String(36),db.ForeignKey("user.id")); created_at=db.Column(db.DateTime(timezone=True),default=utcnow); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow,onupdate=utcnow); is_demo=db.Column(db.Boolean,default=False)
    evidence_name=db.Column(db.String(255)); evidence_mime=db.Column(db.String(100)); evidence_size=db.Column(db.Integer)
    def json(self): return {"id":self.id,"reference":self.reference,"type":self.type,"household":self.household,"district":self.district,"municipality":self.municipality,"description":self.description,"estimatedLoss":self.estimated_loss,"hasEvidence":bool(self.evidence_name) or self.has_evidence,"assessment":self.assessment,"status":self.status,"decisionNote":self.decision_note,"history":self.history or [],"createdAt":self.created_at.isoformat(),"updatedAt":self.updated_at.isoformat(),"ownerId":self.owner_id,"isDemo":self.is_demo}

class Facility(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); kind=db.Column(db.String(30),nullable=False); name=db.Column(db.String(150),nullable=False); district=db.Column(db.String(100),nullable=False); lat=db.Column(db.Float,nullable=False); lng=db.Column(db.Float,nullable=False); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow); verified=db.Column(db.Boolean,default=True); is_demo=db.Column(db.Boolean,default=True)
    def json(self): return {"id":self.id,"kind":self.kind,"name":self.name,"district":self.district,"location":{"lat":self.lat,"lng":self.lng},"updatedAt":self.updated_at.isoformat(),"verified":self.verified,"isDemo":self.is_demo}

class Activity(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); actor=db.Column(db.String(120),nullable=False); action=db.Column(db.String(255),nullable=False); target=db.Column(db.String(120),nullable=False); at=db.Column(db.DateTime(timezone=True),default=utcnow)
    def json(self): return {"id":self.id,"actor":self.actor,"action":self.action,"target":self.target,"at":self.at.isoformat()}

class Notification(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid)
    user_id=db.Column(db.String(36),db.ForeignKey("user.id"),nullable=False,index=True)
    title=db.Column(db.String(180),nullable=False)
    message=db.Column(db.String(500),nullable=False)
    kind=db.Column(db.String(40),nullable=False,default="status")
    read=db.Column(db.Boolean,default=False,nullable=False)
    created_at=db.Column(db.DateTime(timezone=True),default=utcnow,nullable=False,index=True)
    def json(self): return {"id":self.id,"title":self.title,"message":self.message,"kind":self.kind,"read":self.read,"createdAt":self.created_at.isoformat()}

class Alert(db.Model):
    id=db.Column(db.String(36),primary_key=True,default=uid); title=db.Column(db.String(200),nullable=False); district=db.Column(db.String(100),nullable=False); municipality=db.Column(db.String(100),nullable=False); hazard=db.Column(db.String(40),nullable=False); severity=db.Column(db.String(20),nullable=False); source=db.Column(db.String(150),nullable=False); published_at=db.Column(db.DateTime(timezone=True),default=utcnow); updated_at=db.Column(db.DateTime(timezone=True),default=utcnow); verified=db.Column(db.Boolean,default=False); is_demo=db.Column(db.Boolean,default=True)
    def json(self): return {"id":self.id,"title":self.title,"district":self.district,"municipality":self.municipality,"hazard":self.hazard,"severity":self.severity,"source":self.source,"publishedAt":self.published_at.isoformat(),"updatedAt":self.updated_at.isoformat(),"verified":self.verified,"isDemo":self.is_demo}
