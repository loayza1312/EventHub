from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def roles_required(*roles):
    """
    Decoratore personalizzato per controllare i ruoli degli utenti tramite JWT.
    Uso: @roles_required('organizer', 'admin')
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            # Forza la verifica che un token JWT valido sia presente nella richiesta
            verify_jwt_in_request()
            
            # Estrae i dati dell'utente dal token (id e role salvati al login)
            current_user = get_jwt_identity()
            user_role = current_user.get('role')

            # Se il ruolo dell'utente non è tra quelli concessi, blocca l'accesso
            if user_role not in roles:
                return jsonify({"message": "Accesso negato: permessi insufficienti"}), 403
            
            return fn(*args, **kwargs)
        return wrapper
    return decorator