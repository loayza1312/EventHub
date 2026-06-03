import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt
import datetime

app = Flask(__name__)
CORS(app)

DB_FILE = 'database.db'
SECRET_KEY = 'il_tuo_segreto_super_sicuro'

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            date TEXT NOT NULL,
            location TEXT NOT NULL,
            price REAL NOT NULL,
            available_slots INTEGER NOT NULL
        )
    ''')
    cursor.execute('SELECT COUNT(*) FROM events')
    if cursor.fetchone()[0] == 0:
        concerts = [
            ("Coldplay - Music of the Spheres", "Lo show visivo e musicale più potente del mondo arriva in Italia.", "2026-07-12", "Stadio San Siro, Milano", 85.0, 120),
            ("Techtribe: Amelie Lens Live", "Una notte intera con i bassi e l'energia della regina della techno mondiale.", "2026-08-22", "Fabrique, Milano", 35.0, 80),
            ("Pinguini Tattici Nucleari", "Il tour nei palazzetti della band indie-pop più amata d'Italia.", "2026-10-05", "Unipol Forum, Assago", 45.0, 200),
            ("The Weeknd - After Hours Tour", "L'unica ed esclusiva data italiana dell'artista pop-R&B del momento.", "2026-09-18", "Ippodromo Snai, Milano", 90.0, 15)
        ]
        cursor.executemany('''
            INSERT INTO events (title, description, date, location, price, available_slots)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', concerts)
    conn.commit()
    conn.close()

init_db()

@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_db_connection()
    events_db = conn.execute('SELECT * FROM events').fetchall()
    conn.close()
    return jsonify([dict(e) for e in events_db]), 200

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    name, email, password = data.get('name'), data.get('email'), data.get('password')
    if not name or not email or not password:
        return jsonify({"error": "Dati mancanti"}), 400
    conn = get_db_connection()
    try:
        conn.execute('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', (name, email, password))
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({"error": "Email già registrata"}), 400
    conn.close()
    return jsonify({"message": "OK"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    email, password = data.get('email'), data.get('password')
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ? AND password = ?', (email, password)).fetchone()
    conn.close()
    if user:
        token = jwt.encode({'user_id': user['id'], 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)}, SECRET_KEY, algorithm='HS256')
        return jsonify({"token": token, "username": user['name']}), 200
    return jsonify({"error": "Credenziali errate"}), 401

@app.route('/api/book', methods=['POST'])
def book_event():
    data = request.json
    event_id = data.get('event_id')
    conn = get_db_connection()
    event = conn.execute('SELECT * FROM events WHERE id = ?', (event_id,)).fetchone()
    if not event or event['available_slots'] <= 0:
        conn.close()
        return jsonify({"error": "Errore"}), 400
    conn.execute('UPDATE events SET available_slots = available_slots - 1 WHERE id = ?', (event_id,))
    conn.commit()
    updated = conn.execute('SELECT available_slots FROM events WHERE id = ?', (event_id,)).fetchone()
    conn.close()
    return jsonify({"new_slots": updated['available_slots']}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)