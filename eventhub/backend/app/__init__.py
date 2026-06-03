import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from celery import Celery

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def make_celery(app):
    celery = Celery(
        app.import_name,
        backend=os.environ.get('REDIS_URL', 'redis://localhost:6379/0'),
        broker=os.environ.get('REDIS_URL', 'redis://localhost:6379/0')
    )
    celery.conf.update(app.config)
    return celery

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///eventhub.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-super-segreta')
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-dev-key-super-segreta')
    
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    @app.route('/')
    def index():
        return {"message": "EventHub API attiva e funzionante!"}
        
    # REGISTRAZIONE COMPLETA BLUEPRINTS
    from app.resources.auth import auth_bp
    from app.resources.event import event_bp
    from app.resources.organizer import organizer_bp
    from app.resources.ticket import ticket_bp
    
    app.register_blueprint(auth_bp)
    app.register_blueprint(event_bp)
    app.register_blueprint(organizer_bp)
    app.register_blueprint(ticket_bp)
        
    from app.models import user, event, ticket, review
        
    return app