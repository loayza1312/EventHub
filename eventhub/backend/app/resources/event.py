from flask import Blueprint, request, jsonify
from app import db
from app.models.event import Event
from app.schemas.event import EventSchema
from datetime import datetime

event_bp = Blueprint('event', __name__, url_prefix='/api/events')
event_schema = EventSchema()
events_schema = EventSchema(many=True)

@event_bp.route('', methods=['GET'])
def get_events():
    # Estrazione parametri di query per la ricerca avanzata e i filtri
    category = request.args.get('category')
    city = request.args.get('city')
    max_price = request.args.get('price', type=float)
    date_str = request.args.get('date')

    query = Event.query

    # Filtro: Mostra solo eventi futuri di default
    query = query.filter(Event.date >= datetime.utcnow())

    if category:
        query = query.filter_by(category=category)
    if city:
        query = query.filter(Event.location.ilike(f"%{city}%"))
    if max_price is not None:
        query = query.filter(Event.price <= max_price)
    if date_str:
        try:
            target_date = datetime.strptime(date_str, '%Y-%m-%d').date()
            query = query.filter(db.func.date(Event.date) == target_date)
        except ValueError:
            return jsonify({"message": "Formato data non valido. Usa YYYY-MM-DD"}), 400

    events = query.order_by(Event.date.asc()).all()
    return jsonify(events_schema.dump(events)), 200

@event_bp.route('/<int:event_id>', methods=['GET'])
def get_event_detail(event_id):
    event = Event.query.get_or_404(event_id)
    return jsonify(event_schema.dump(event)), 200