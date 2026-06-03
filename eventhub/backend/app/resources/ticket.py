from flask import Blueprint, request, jsonify
from app import db
from app.models.event import Event
from app.models.ticket import Ticket
from app.utils.decorators import roles_required
from flask_jwt_extended import jwt_required, get_jwt_identity

ticket_bp = Blueprint('ticket', __name__, url_prefix='/api/tickets')

@ticket_bp.route('/book', methods=['POST'])
@jwt_required()
def book_ticket():
    """Consente a un utente registrato di prenotare un biglietto se ci sono posti"""
    data = request.get_json() or {}
    event_id = data.get('event_id')

    if not event_id:
        return jsonify({"message": "ID evento mancante"}), 400

    # Blocca la riga dell'evento per evitare problemi di concorrenza sui posti (Race Condition)
    event = Event.query.with_for_update().get(event_id)
    
    if not event:
        return jsonify({"message": "Evento non trovato"}), 404

    # REQUISITO FUNZIONALE: Verifica disponibilità posti
    if event.available_seats <= 0:
        return jsonify({"message": "Spiacenti, i posti per questo evento sono esauriti!"}), 400

    current_user = get_jwt_identity()

    # Controlla se l'utente è già iscritto all'evento per evitare doppi biglietti
    existing_ticket = Ticket.query.filter_by(user_id=current_user['id'], event_id=event_id).first()
    if existing_ticket:
        return jsonify({"message": "Sei già iscritto a questo evento"}), 400

    # Decrementa il posto disponibile e crea il biglietto (il token QR viene generato dal modello)
    event.available_seats -= 1
    new_ticket = Ticket(
        user_id=current_user['id'],
        event_id=event.id
    )

    db.session.add(new_ticket)
    db.session.commit()

    return jsonify({
        "message": "Iscrizione completata con successo!",
        "ticket": {
            "id": new_ticket.id,
            "event_title": event.title,
            "qr_code_token": new_ticket.qr_code_token,
            "purchased_at": new_ticket.purchased_at
        }
    }), 201

@ticket_bp.route('/my-tickets', methods=['GET'])
@jwt_required()
def get_my_tickets():
    """Restituisce la lista dei biglietti dell'utente loggato con i dati dell'evento"""
    current_user = get_jwt_identity()
    tickets = Ticket.query.filter_by(user_id=current_user['id']).all()
    
    result = []
    for t in tickets:
        # Recupera i dettagli dell'evento legato al biglietto
        ev = Event.query.get(t.event_id)
        result.append({
            "ticket_id": t.id,
            "qr_code_token": t.qr_code_token,
            "purchased_at": t.purchased_at,
            "event": {
                "id": ev.id,
                "title": ev.title,
                "date": ev.date,
                "location": ev.location
            }
        })
        
    return jsonify(result), 200