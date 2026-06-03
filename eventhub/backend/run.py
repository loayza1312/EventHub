from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os

app = Flask(__name__)
# Consente ad Angular (porta 4200) di comunicare liberamente con Flask
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Percorso del database JSON di prova
DB_FILE = 'events.json'

def load_events():
    if os.path.exists(DB_FILE):
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    # Dati di fallback se il file events.json non esiste ancora
    return [
        {
            "id": 1,
            "title": "Concerto Rock Live",
            "description": "Il grande ritorno della musica live sul palco di EventHub.",
            "date": "2026-06-15",
            "location": "Milano, Alcatraz",
            "price": 15.0,
            "available_slots": 150,
            "category": "Concerti"
        },
        {
            "id": 2,
            "title": "Workshop Angular & Flask",
            "description": "Impara a creare applicazioni web moderne.",
            "date": "2026-06-22",
            "location": "Roma, Hub Digitale",
            "price": 0.0,
            "available_slots": 50,
            "category": "Workshop"
        }
    ]

@app.route('/api/events', methods=['GET'])
def get_events():
    events = load_events()
    return jsonify(events)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    # Mock di login per testare subito il frontend
    return jsonify({
        "token": "mock-jwt-token-xyz",
        "user": {"username": "utente_test", "email": data.get('email'), "role": "user"}
    }), 200

@app.route('/api/register', methods=['POST'])
def register():
    return jsonify({"message": "Utente registrato con successo"}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
