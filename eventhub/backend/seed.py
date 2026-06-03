from flask import Flask
from models import db, User, Event
from werkzeug.security import generate_password_hash
import os

app = Flask(__name__)

# Configurazione dello stesso database SQLite di run.py
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(BASE_DIR, 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def seed_data():
    with app.app_context():
        # 1. Puliamo il database prima di inserire i dati per evitare duplicati
        db.drop_all()
        db.create_all()
        print("🧹 Database ripulito e tabelle ricreate.")

        # 2. Generiamo le password cifrate
        pwd_user = generate_password_hash('user123', method='pbkdf2:sha256')
        pwd_organizer = generate_password_hash('orga123', method='pbkdf2:sha256')
        pwd_admin = generate_password_hash('admin123', method='pbkdf2:sha256')

        # 3. Creazione degli Utenti con Ruoli Diversi
        u1 = User(username='mario_rossi', email='mario@email.com', password_hash=pwd_user, role='user')
        u2 = User(username='dj_festa', email='organizzatore@email.com', password_hash=pwd_organizer, role='organizer')
        u3 = User(username='mirko', email='admin@eventhub.com', password_hash=pwd_admin, role='admin')

        db.session.add_all([u1, u2, u3])
        db.session.commit() # Salviamo prima gli utenti per generare gli ID
        print("👤 Utenti di test inseriti (mario_rossi, dj_festa, mirko).")

        # 4. Creazione degli Eventi agganciati all'organizzatore (dj_festa ha ID 2)
        e1 = Event(
            title='Concerto Rock Live',
            description='Il grande ritorno della musica dal vivo in uno stadio infuocato.',
            date='2026-06-15',
            location='Milano',
            price=15.00,
            capacity=147,
            organizer_id=u2.id
        )
        e2 = Event(
            title='Techno Night Clubbing',
            description='I migliori DJ internazionali della scena underground.',
            date='2026-08-22',
            location='Roma',
            price=20.00,
            capacity=60,
            organizer_id=u2.id
        )
        e3 = Event(
            title='Pop Festival 2026',
            description='Tre giorni di pura energia con le hit estive del momento.',
            date='2026-07-05',
            location='Firenze',
            price=35.00,
            capacity=250,
            organizer_id=u2.id
        )

        db.session.add_all([e1, e2, e3])
        db.session.commit()
        print("📅 Eventi iniziali caricati con successo nel database!")

if __name__ == '__main__':
    seed_data()