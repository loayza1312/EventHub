from app import db
from datetime import datetime

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # Valore da 1 a 5
    comment = db.Column(db.Text, nullable=True)
    is_reported = db.Column(db.Boolean, default=False, nullable=False) # Per moderazione admin
    created_at = db.Column(db.DateTime, default=datetime.utcnow)