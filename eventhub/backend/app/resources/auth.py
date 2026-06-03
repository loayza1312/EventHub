from flask import Blueprint, request, jsonify
from app import db
from app.models.user import User
from app.schemas.auth import RegisterSchema, LoginSchema
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from marshmallow import ValidationError

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

register_schema = RegisterSchema()
login_schema = LoginSchema()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = register_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    if User.query.filter((User.email == data['email']) | (User.username == data['username'])).first():
        return jsonify({"message": "Username o Email già esistenti"}), 400

    new_user = User(
        username=data['username'],
        email=data['email'],
        role=data.get('role', 'user')
    )
    new_user.set_password(data['password'])

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "Utente registrato con successo!"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = login_schema.load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    user = User.query.filter_by(email=data['email']).first()

    if not user or not user.check_password(data['password']):
        return jsonify({"message": "Credenziali errate"}), 401

    if user.is_banned:
        return jsonify({"message": "Questo account è stato bannato"}), 403

    # Genera i Token inserendo l'ID e il Ruolo nell'identity
    identity = {"id": user.id, "role": user.role}
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    return jsonify({
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"access_token": new_access_token}), 200