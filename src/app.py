"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
import cloudinary
import cloudinary.uploader
from api.routes import api, socketio
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_swagger import swagger
from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api, socketio  # Importar socketio desde routes
from api.admin import setup_admin
from api.commands import setup_commands
from flask_cors import CORS, cross_origin
from flask_socketio import join_room, leave_room, send, emit
from api.models import Message

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

# from models import Person

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(
    os.path.realpath(__file__)), '../public/')
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.url_map.strict_slashes = False

# Configurar SocketIO
socketio.init_app(app, cors_allowed_origins="*")

# Configurar eventos de socket.io
@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    socketio.emit('response', data)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('joinRoom')
def handle_join_room(data):
    room = f"match_{data['match_id']}"
    join_room(room)
    emit('message', f"User joined room {room}", room=room)

@socketio.on('leaveRoom')
def handle_leave_room(data):
    room = f"match_{data['match_id']}"
    leave_room(room)
    emit('message', f"User left room {room}", room=room)

@socketio.on('sendMessage')
def handle_send_message(data):
    room = f"match_{data['match_id']}"
    emit('message', data['message'], room=room)

@socketio.on('join')
def on_join(data):
    match_id = data['match_id']
    join_room(f"match_{match_id}")
    emit('status', {'msg': f"Joined room match_{match_id}"}, room=f"match_{match_id}")

@socketio.on('leave')
def on_leave(data):
    match_id = data['match_id']
    leave_room(f"match_{match_id}")
    emit('status', {'msg': f"Left room match_{match_id}"}, room=f"match_{match_id}")

@socketio.on('send_message')
def on_send_message(data):
    match_id = data['match_id']
    sender_pet_id = data['sender_pet_id']
    text = data['text']

    new_message = Message(match_id=match_id, sender_pet_id=sender_pet_id, content=text)
    db.session.add(new_message)
    db.session.commit()

    emit('new_message', new_message.serialize(), room=f"match_{match_id}")


# database configuration
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace(
        "postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# Configura Cloudinary con tus credenciales
cloudinary.config(
    cloud_name='dpgju6aj2',
    api_key='182768845167919',
    api_secret='UzhOlxQhJ8Z9NQxW8iVGxqy66Jg'
)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "nbsdjhfgiuweh89fyc89W3HNHFC9V8U89Syduvhb"  # Change this!
jwt = JWTManager(app)

# add the admin
setup_admin(app)

# add the admin
setup_commands(app)

# Add all endpoints form the API with a "api" prefix
app.register_blueprint(api, url_prefix='/api')

# Handle/serialize errors like a JSON object
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# generate sitemap with all your endpoints
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# any other endpoint will try to serve it like a static file
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0  # avoid cache memory
    return response

# this only runs if `$ python src/main.py` is executed
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    socketio.run(app, host='0.0.0.0', port=PORT, debug=True)
