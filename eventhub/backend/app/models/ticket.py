from app import db
from datetime import datetime
import uuid

class Ticket(db.Model):
    __tablename__ = 'tickets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    qr_code_token = db.Column(db.String(64), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    purchased_at = db.Column(db.DateTime, default=datetime.utcnow)