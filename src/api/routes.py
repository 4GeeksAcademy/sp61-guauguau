"""
Este módulo se encarga de iniciar el servidor API, cargar la base de datos y agregar los puntos finales.
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet, City, Owner, Breed, Adminn
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_mail import Mail, Message


api = Blueprint('api', __name__)

# Permitir solicitudes CORS a esta API
CORS(api)

# Configuración de correo electrónico
mail = Mail()


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "¡Hola! Soy un mensaje que vino del backend, revisa la pestaña de red en el inspector de Google y verás la solicitud GET"
    }
    return jsonify(response_body), 200

# PROPIETARIO
@api.route('/owner', methods=['GET'])
def get_owners():
    all_owners = Owner.query.all()
    results = list(map(lambda owner: owner.serialize(), all_owners))
    return jsonify(results), 200

@api.route('/add_owner', methods=['POST'])
def create_owner():
    data = request.json
    required_fields = ["email", "password", "name"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' no puede estar vacío"}), 400
    
    existing_owner = Owner.query.filter_by(email=data['email']).first()
    if existing_owner:
        return jsonify({"error": "¡El correo electrónico ya existe!"}), 409
    
    new_owner = Owner(email=data['email'], password=data['password'], name=data['name'])
    db.session.add(new_owner)
    db.session.commit()
    return jsonify({"message": "¡Propietario creado!"}), 201

@api.route("/owner/<int:owner_id>", methods=["GET"])
def get_owner(owner_id):
    owner = Owner.query.get_or_404(owner_id)
    return jsonify(owner.serialize()), 200

@api.route("/owner/<int:owner_id>", methods=["DELETE"])
def delete_owner(owner_id):
    owner = Owner.query.get_or_404(owner_id)
    db.session.delete(owner)
    db.session.commit()
    return jsonify({'message': 'Propietario eliminado'}), 200

@api.route("/owner/<int:owner_id>", methods=["PUT"])
def update_owner(owner_id):
    owner = Owner.query.get_or_404(owner_id)
    data = request.json
    if "email" in data:
        owner.email = data["email"]
    if "password" in data:
        owner.password = data["password"]
    if "name" in data:
        owner.name = data["name"]
    db.session.commit()
    return jsonify(owner.serialize()), 200

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"message": "Correo electrónico y contraseña son obligatorios"}), 400

    owner = Owner.query.filter_by(email=email).first()
    if owner is None or password != owner.password:
        return jsonify({"message": "Correo electrónico o contraseña inválidos"}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_owner = get_jwt_identity()
    return jsonify(logged_in_as=current_owner), 200 

# RUTAS DE MASCOTAS
@api.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify([pet.serialize() for pet in pets]), 200

@api.route('/pets/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    return jsonify(pet.serialize()), 200

@api.route('/pets', methods=['POST'])
def add_pet():
    data = request.get_json()
    required_fields = ['name', 'breed', 'sex', 'age', 'pedigree', 'photo']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Faltan datos'}), 400

    new_pet = Pet(
        name=data['name'],
        breed=data['breed'],
        sex=data['sex'],
        age=data['age'],
        pedigree=data['pedigree'],
        photo=data['photo']
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({"message": "¡Nueva mascota añadida!"}), 201

@api.route('/pets/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    pet = Pet.query.get_or_404(pet_id)
    data = request.json
    pet.name = data.get('name', pet.name)
    pet.breed = data.get('breed', pet.breed)
    pet.sex = data.get('sex', pet.sex)
    pet.age = data.get('age', pet.age)
    pet.pedigree = data.get('pedigree', pet.pedigree)
    pet.photo = data.get('photo', pet.photo)
    db.session.commit()
    return jsonify(pet.serialize()), 200

@api.route('/delete_pet/<int:id>', methods=['DELETE'])
def delete_pet(id):
    pet = Pet.query.get_or_404(id)
    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': '¡Mascota eliminada con éxito!'}), 200

# CIUDAD
@api.route('/city', methods=['GET'])
def get_city():
    cities = City.query.all()
    return jsonify([city.serialize() for city in cities]), 200

@api.route('/city', methods=['POST'])
def add_city():
    data = request.get_json()
    new_city = City(
        name=data['name'],
        pet_friendly=data['pet_friendly']
    )
    db.session.add(new_city)
    db.session.commit()
    return jsonify({'message': '¡Nueva ciudad añadida!'}, new_city.serialize()), 201

@api.route('/city/<int:id>', methods=['DELETE'])
def delete_city(id):
    city = City.query.get_or_404(id)
    db.session.delete(city)
    db.session.commit()
    return jsonify({'message': 'Ciudad eliminada con éxito!'}), 200

@api.route('/city/<int:id>', methods=['PUT'])
def update_city(id):
    data = request.get_json()
    city = City.query.get_or_404(id)
    city.name = data.get('name', city.name)
    city.pet_friendly = data.get('pet_friendly', city.pet_friendly)
    db.session.commit()
    return jsonify({'message': 'Ciudad actualizada con éxito!'}), 200

# RAZA
@api.route('/breed', methods=['GET'])
def get_breed():
    breeds = Breed.query.all()
    return jsonify([breed.serialize() for breed in breeds]), 200

@api.route('/breed', methods=['POST'])
def add_breed():
    data = request.get_json()
    new_breed = Breed(
        name=data['name'],
        type=data['type']
    )
    db.session.add(new_breed)
    db.session.commit()
    return jsonify({'message': '¡Nueva raza añadida!'}, new_breed.serialize()), 201

@api.route('/breed/<int:id>', methods=['DELETE'])
def delete_breed(id):
    breed = Breed.query.get_or_404(id)
    db.session.delete(breed)
    db.session.commit()
    return jsonify({'message': '¡Raza eliminada con éxito!'}), 200

@api.route('/breed/<int:id>', methods=['PUT'])
def update_breed(id):
    data = request.get_json()
    breed = Breed.query.get_or_404(id)
    breed.name = data.get('name', breed.name)
    breed.type = data.get('type', breed.type)
    db.session.commit()
    return jsonify({'message': '¡Raza actualizada con éxito!'}), 200

# ADMINISTRADOR
@api.route('/admin', methods=['GET'])
def get_admins():
    all_admins = Adminn.query.all()
    results = list(map(lambda admin: admin.serialize(), all_admins))
    return jsonify(results), 200

@api.route('/add_admin', methods=['POST'])
def create_admin():
    data = request.json
    required_fields = ["email", "password", "name"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"El campo '{field}' no puede estar vacío"}), 400
    
    existing_admin = Adminn.query.filter_by(email=data['email']).first()
    if existing_admin:
        return jsonify({"error": "¡El correo electrónico ya existe!"}), 409
    
    new_admin = Adminn(email=data['email'], password=data['password'], name=data['name'])
    db.session.add(new_admin)
    db.session.commit()
    return jsonify({"message": "¡Administrador creado!"}), 201

@api.route("/admin/<int:admin_id>", methods=["GET"])
def get_admin(admin_id):
    admin = Adminn.query.get_or_404(admin_id)
    return jsonify(admin.serialize()), 200

@api.route("/admin/<int:admin_id>", methods=["DELETE"])
def delete_admin(admin_id):
    admin = Adminn.query.get_or_404(admin_id)
    db.session.delete(admin)
    db.session.commit()
    return jsonify({'message': 'Administrador eliminado'}), 200

@api.route("/admin/<int:admin_id>", methods=["PUT"])
def update_admin(admin_id):
    admin = Adminn.query.get_or_404(admin_id)
    data = request.json
    if "email" in data:
        admin.email = data["email"]
    if "password" in data:
        admin.password = data["password"]
    if "name" in data:
        admin.name = data["name"]
    db.session.commit()
    return jsonify(admin.serialize()), 200

@api.route('/admin_login', methods=['POST'])
def login_admin():
    email = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"message": "Correo electrónico y contraseña son obligatorios"}), 400

    admin = Adminn.query.filter_by(email=email).first()
    if admin is None or password != admin.password:
        return jsonify({"message": "Correo electrónico o contraseña inválidos"}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200

@api.route("/admin_protected", methods=["GET"])
@jwt_required()
def protected_admin():
    current_admin = get_jwt_identity()
    return jsonify(logged_in_as=current_admin), 200

@api.route("/protected", methods=["GET"])
@jwt_required()
def protecteds():
    current_admin = get_jwt_identity()
    return jsonify(logged_in_as=current_admin), 200 
