from werkzeug.security import generate_password_hash, check_password_hash

# ... (il resto del tuo codice precedente rimane invariato) ...

# 📝 1. API DI REGISTRAZIONE UTENTE
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Controlliamo se l'utente o l'email esistono già
    existing_user = User.query.filter((User.username == data['username']) | (User.email == data['email'])).first()
    if existing_user:
        return jsonify({'error': 'Username o Email già utilizzati!'}), 400
    
    # Cifriamo la password prima di salvarla sul DB
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    
    # Creiamo il nuovo record (il ruolo di default è 'user', ma puoi passargli 'organizer' o 'admin')
    new_user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role=data.get('role', 'user') 
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'Utente registrato con successo!'}), 201


# 🔑 2. API DI LOGIN REALE
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    # Cerchiamo l'utente nel database tramite username
    user = User.query.filter_by(username=data['username']).first()
    
    # Controlliamo se l'utente esiste e se la password inserita coincide con l'hash cifrato
    if not user or not check_password_hash(user.password_hash, data['password']):
        return jsonify({'error': 'Credenziali errate o utente inesistente!'}), 401
    
    # Controlliamo se l'utente è stato bannato dal pannello di controllo dell'admin
    if user.status == 'bannato':
        return jsonify({'error': 'Questo account è stato sospeso dai moderatori.'}), 403
    
    # Se è tutto ok, rispondiamo ad Angular mandandogli i dettagli dell'utente loggato
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role
    }), 200