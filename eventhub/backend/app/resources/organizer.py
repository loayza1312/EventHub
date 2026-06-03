from flask import Blueprint, request, jsonify
from app import db
from app.models.event import Event
from app.schemas.event import EventSchema
from app.utils.decorators import roles_required
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from marshmallow import ValidationError

organizer_bp = Blueprint('organizer', __name__, url_prefix='/api/organizer')
event_schema = EventSchema()

@organizer_bp.route('/events', methods=['POST'])
@jwt_required()
@roles_required('organizer', 'admin')
def create_event():
    try:
        # Valida i dati in ingresso dal form reattivo
        data = event_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    current_user = get_jwt_identity()

    # Crea il nuovo evento assegnando i posti disponibili uguali ai totali
    new_event = Event(
        title=data['title'],
        description=data['description'],
        date=data['date'],
        location=data['location'],
        category=data['category'],
        price=data['price'],
        total_seats=data['total_seats'],
        available_seats=data['total_seats'],
        organizer_id=current_user['id']
    )

    db.session.add(new_event)
    db.session.commit()

    return jsonify({
        "message": "Evento creato con successo!",
        "event": event_schema.dump(new_event)
    }), 201