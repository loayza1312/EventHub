import os
from app import create_app, make_celery

# Crea l'istanza dell'applicazione Flask
app = create_app()

# Crea l'istanza di Celery legata all'app
celery = make_celery(app)
app.extensions['celery'] = celery

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)