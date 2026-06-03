from app import db
from datetime import datetime

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(100), nullable=False)      # Città o via
    category = db.Column(db.String(50), nullable=False)      # concerto, workshop, ecc.
    price = db.Column(db.Float, default=0.0, nullable=False)
    total_seats = db.Column(db.Integer, nullable=False)
    available_seats = db.Column(db.Integer, nullable=False)
    image_path = db.Column(db.String(255), nullable=True)     # Percorso del file sul server
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relazioni
    tickets = db.relationship('Ticket', backref='event', lazy='dynamic', cascade="all, delete-orphan")
    reviews = db.relationship('Review', backref='event', lazy='dynamic', cascade="all, delete-orphan")