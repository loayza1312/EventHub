from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# 👤 1. TABELLA UTENTI (Gestisce utenti, organizzatori e admin)
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    role = db.Column(db.String(20), default='user')       # 'user', 'organizer', 'admin'
    status = db.Column(db.String(20), default='attivo')    # 'attivo', 'bannato'
    
    # Relazioni (Mettono in comunicazione le tabelle)
    events = db.relationship('Event', backref='organizer', lazy=True)
    bookings = db.relationship('Booking', backref='user', lazy=True)

# 📅 2. TABELLA EVENTI
class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    date = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    
    # Chiave esterna collegata all'ID dell'utente che ha creato l'evento
    organizer_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    bookings = db.relationship('Booking', backref='event', lazy=True)

# 🎟️ 3. TABELLA PRENOTAZIONI (I Biglietti acquistati)
class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    ticket_code = db.Column(db.String(50), unique=True, nullable=False)
    purchase_date = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Chiavi esterne: chi ha comprato e quale evento ha scelto
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)