from flask import Flask, request, jsonify, Blueprint, current_app
from api.models import db, User, Pet, City, Owner, Breed, Photo, Adminn, Like, Match, Message
import cloudinary.uploader
from cloudinary.uploader import upload
from geopy.geocoders import Nominatim
from api.utils import generate_sitemap, APIException
from flask_cors import CORS, cross_origin
import requests
import os
from openai import OpenAI
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
from flask_socketio import join_room, leave_room, send, emit, SocketIO
# Inicializar el cliente de OpenAI
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

api = Blueprint('api', __name__)
socketio = SocketIO()


# Allow CORS requests to this API
CORS(api)

# Inicializar JWTManager
jwt = JWTManager()

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# OWNER

@api.route('/owner', methods=['GET'])
def get_owners():
    all_owners = Owner.query.all()
    results = list(map(lambda owner: owner.serialize(), all_owners))
    return jsonify(results), 200

@api.route('/add_owner', methods=['POST'])
def create_owner():
    try:
        data = request.json
        current_app.logger.info(f"Received data: {data}")
        required_fields = ["email", "password", "name", "address", "latitude", "longitude"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"The '{field}' cannot be empty"}), 400

        existing_owner = Owner.query.filter_by(email=data['email']).first()
        if existing_owner:
            return jsonify({"error": "Email already exists!"}), 409

        # Obtener la ciudad basada en la latitud y longitud
        geolocator = Nominatim(user_agent="geoapiExercises", timeout=10)  # Aumentar el tiempo de espera a 10 segundos
        location = geolocator.reverse(f"{data['latitude']}, {data['longitude']}")
        city_name = location.raw['address'].get('city', location.raw['address'].get('town', ''))
        current_app.logger.info(f"Geolocation result: {location.raw}")

        # Buscar o crear la ciudad en la base de datos
        city = City.query.filter_by(name=city_name).first()
        if not city:
            city = City(name=city_name, pet_friendly='Unknown')  # Ajustar según sea necesario
            db.session.add(city)
            db.session.commit()
            current_app.logger.info(f"Created new city: {city_name}")

        new_owner = Owner(
            email=data['email'], 
            password=data['password'], 
            name=data['name'],
            address=data['address'],
            latitude=data['latitude'],
            longitude=data['longitude'],
            city_id=city.id  # Asociar la ciudad con el propietario
        )
        db.session.add(new_owner)
        db.session.commit()

        current_app.logger.info(f"New owner created: {new_owner.email}")

        return jsonify({"message": "Owner created!"}), 200
    except Exception as e:
        current_app.logger.error(f"Error creating owner: {str(e)}")
        return jsonify({"error": str(e)}), 500






@api.route("/owner/<int:owner_id>", methods=["GET"])
def get_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    owner_data = owner.serialize()
    owner_data["pets"] = [pet.serialize() for pet in owner.pets]
    return jsonify(owner_data), 200

@api.route("/owner/<int:owner_id>", methods=["DELETE"])
def delete_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    db.session.delete(owner)
    db.session.commit()
    return jsonify({'message': 'Owner deleted'}), 200

@api.route("/owner/<int:owner_id>", methods=["PUT"])
def update_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"message": "Owner not found"}), 404
    
    data = request.json
    if "email" in data:
        owner.email = data["email"]
    if "password" in data:
        owner.password = data["password"]
    if "name" in data:
        owner.name = data["name"]
    if "address" in data:
        owner.address = data["address"]
    if "latitude" in data and "longitude" in data:
        owner.latitude = data["latitude"]
        owner.longitude = data["longitude"]
        # Actualizar la ciudad basada en la nueva latitud y longitud
        geolocator = Nominatim(user_agent="geoapiExercises")
        location = geolocator.reverse(f"{data['latitude']}, {data['longitude']}")
        city_name = location.raw['address'].get('city', location.raw['address'].get('town', ''))
        city = City.query.filter_by(name=city_name).first()
        if not city:
            city = City(name=city_name, pet_friendly='Unknown')
            db.session.add(city)
            db.session.commit()
        owner.city_id = city.id

    db.session.commit()
    return jsonify(owner.serialize()), 200



@api.route("/update_owner_description", methods=["PUT"])
@jwt_required()
def update_owner_description():
    current_owner_email = get_jwt_identity()
    owner = Owner.query.filter_by(email=current_owner_email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    data = request.get_json()
    owner.description = data.get("description", owner.description)
    db.session.commit()

    return jsonify(owner.serialize()), 200

@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email")
    password = request.json.get("password")
    owner = Owner.query.filter_by(email=email).first()
    if owner is None:
        return jsonify({"message": "Email not found"}), 401
    if password != owner.password:
        return jsonify({"message": "Wrong password"}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200



@api.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    try:
        current_owner_email = get_jwt_identity()
        owner = Owner.query.filter_by(email=current_owner_email).first()
        if not owner:
            return jsonify({"error": "Owner not found"}), 404

        # Inicializar geolocator
        geolocator = Nominatim(user_agent="geoapiExercises", timeout=10)  # Añadir un tiempo de espera más largo
        location = geolocator.reverse(f"{owner.latitude}, {owner.longitude}")
        city = location.raw['address'].get('city', location.raw['address'].get('town', ''))

        owner_data = owner.serialize()
        owner_data["pets"] = [pet.serialize() for pet in owner.pets]
        owner_data["city"] = city  # Añadir ciudad a los datos del propietario

        return jsonify({"owner": owner_data}), 200
    except Exception as e:
        current_app.logger.error(f"Error in protected route: {str(e)}")
        return jsonify({"error": str(e)}), 500


##### ROUTES PETS #########################################
@api.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify([{
        'id': pet.id,
        'name': pet.name,
        'breed': pet.breed.name if pet.breed else None,
        'sex': pet.sex,
        'age': pet.age,
        'pedigree': pet.pedigree,
        'description': pet.description,
        'profile_photo_url': pet.profile_photo_url,
        'owner_id': pet.owner_id,
        'owner_name': pet.owner.name if pet.owner else None,
        'owner_city': pet.owner.city.name if pet.owner and pet.owner.city else None  # Incluye la ciudad del dueño
    } for pet in pets]), 200

@api.route('/pet/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if pet:
        photos = sorted([photo.serialize() for photo in pet.photos], key=lambda x: x['order'])  # Ordena las fotos por el campo order
        return jsonify({
            'id': pet.id,
            'name': pet.name,
            'breed': pet.breed.name if pet.breed else None,
            'sex': pet.sex,
            'age': pet.age,
            'pedigree': pet.pedigree,
            'owner_id': pet.owner_id,
            'owner_name': pet.owner.name if pet.owner else None,
            'owner_city': pet.owner.city.name if pet.owner and pet.owner.city else None,  # Incluye la ciudad del dueño
            'owner_photo_url': pet.owner.profile_picture_url if pet.owner else None,
            'photos': photos,
            'description': pet.description,
            'profile_photo_url': pet.profile_photo_url
        }), 200
    else:
        return jsonify({'error': 'Pet not found'}), 404

@api.route('/pets', methods=['POST'])
@jwt_required()
def add_pet():
    data = request.get_json()
    if not all(key in data for key in ['name', 'breed_id', 'sex', 'age', 'pedigree']):
        return jsonify({'error': 'Missing data'}), 400
    
    current_owner_email = get_jwt_identity()
    owner = Owner.query.filter_by(email=current_owner_email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    new_pet = Pet(
        name=data['name'],
        breed_id=data['breed_id'],
        sex=data['sex'],
        age=data['age'],
        pedigree=data['pedigree'],
        owner_id=owner.id
    )

    if 'profile_photo_url' in data and data['profile_photo_url']:
        new_pet.profile_photo_url = data['profile_photo_url']

    db.session.add(new_pet)
    db.session.commit()
    
    return jsonify({'message': 'New pet added!', 'pet_id': new_pet.id}), 201

@api.route('/pet/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    data = request.get_json()
    pet = Pet.query.get(pet_id)
    if pet:
        pet.name = data.get('name', pet.name)
        pet.breed_id = data.get('breed_id', pet.breed_id)
        pet.sex = data.get('sex', pet.sex)
        pet.age = data.get('age', pet.age)
        pet.pedigree = data.get('pedigree', pet.pedigree)
        pet.description = data.get('description', pet.description or '')  # Guardar la descripción
        pet.profile_photo_url = data.get('profile_photo_url', pet.profile_photo_url)
        db.session.commit()
        return jsonify(pet.serialize()), 200
    else:
        return jsonify({'error': 'Pet not found'}), 404

@api.route('/delete_pet/<int:id>', methods=['DELETE'])
def delete_pet(id):
    pet = Pet.query.get_or_404(id)
    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Pet deleted successfully!'}), 200

@api.route('/city', methods=['GET'])
def get_city():
    city = City.query.all()
    return jsonify([{
        'id': city.id,
        'name': city.name,
        'pet_friendly': city.pet_friendly,
    } for city in city]), 200

@api.route('/city', methods=['POST'])
def add_city():
    data = request.get_json()
    new_city = City(
        name=data['name'],
        pet_friendly=data['pet_friendly'],
    )
    db.session.add(new_city)
    db.session.commit()
    return jsonify({'message': 'New city added!'}, new_city.serialize()), 201

@api.route('/city/<int:id>', methods=['DELETE'])
def delete_city(id):
    city = City.query.get_or_404(id)
    db.session.delete(city)
    db.session.commit()
    return jsonify({'message': 'City deleted successfully!'})

@api.route('/city/<int:id>', methods=['PUT'])
def update_city(id):
    data = request.get_json()
    city = City.query.get_or_404(id)
    city.name = data.get('name', city.name)
    city.pet_friendly = data.get('pet_friendly', city.pet_friendly)
    db.session.commit()
    return jsonify({'message': 'City updated successfully!'})

# Breed routes
@api.route('/breed', methods=['GET'])
def get_breed():
    breed = Breed.query.all()
    return jsonify([{
        'id': breed.id,
        'name': breed.name,
        'type': breed.type,
        'life_span': breed.life_span,
    } for breed in breed]), 200
####esta ruta es la que se carga en petsignup#########
def fetch_and_save_breeds():
    url = 'https://api.thedogapi.com/v1/breeds'
    headers = {
        'x-api-key': 'your-api-key'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        breeds = response.json()
        for breed in breeds:
            existing_breed = Breed.query.get(breed['id'])
            if not existing_breed:
                new_breed = Breed(
                    id=breed['id'],
                    name=breed['name'],
                    type=breed.get('breed_group', 'Unknown'),
                    life_span=breed.get('life_span', 'Unknown')
                )
                db.session.add(new_breed)
        db.session.commit()
    else:
        print(f"Failed to fetch breeds: {response.status_code}")
@api.route('/breed', methods=['GET'])
def get_breeds():
    breeds = Breed.query.all()
    return jsonify([breed.serialize() for breed in breeds]), 200

@api.route('/populate_breeds', methods=['POST'])
def populate_breeds():
    url = 'https://api.thedogapi.com/v1/breeds'
    headers = {
        'x-api-key': 'your-api-key'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        breeds = response.json()
        for breed in breeds:
            existing_breed = Breed.query.get(breed['id'])
            if not existing_breed:
                new_breed = Breed(
                    id=breed['id'],
                    name=breed['name'],
                    type=breed.get('breed_group', 'Unknown'),
                    life_span=breed.get('life_span', 'Unknown')
                )
                db.session.add(new_breed)
        db.session.commit()
        return jsonify({"message": "Breeds populated successfully"}), 200
    else:
        return jsonify({"error": f"Failed to fetch breeds: {response.status_code}"}), 400

@api.route('/breed', methods=['POST'])
def add_breed():
    data = request.get_json()
    new_breed = Breed(
        name=data['name'],
        type=data['type'],
        life_span=data['life_span'],
    
    )
    db.session.add(new_breed)
    db.session.commit()
    return jsonify({'message': 'New breed added!'}), 201

@api.route('/breed/<int:id>', methods=['DELETE'])
def delete_breed(id):
    breed = Breed.query.get_or_404(id)
    db.session.delete(breed)
    db.session.commit()
    return jsonify({'message': 'Breed deleted successfully!'})

@api.route('/breed/<int:id>', methods=['PUT'])
def update_breed(id):
    data = request.get_json()
    breed = Breed.query.get_or_404(id)
    breed.name = data.get('name', breed.name)
    breed.type = data.get('type', breed.type)
    breed.type = data.get('life_span', breed.life_span)
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
    return jsonify({'message': 'Admin updated successfully!'})

@api.route('/adminlogin', methods=['POST'])
def admin_login():
    email = request.json.get("email")
    password = request.json.get("password")
    if not email or not password:
        return jsonify({"message": "Correo electrónico y contraseña son obligatorios"}), 400

    admin = Adminn.query.filter_by(email=email).first()
    if admin is None or password != admin.password:
        return jsonify({"message": "Correo electrónico o contraseña inválidos"}), 401

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token), 200

# Photo routes
@api.route('/photo', methods=['GET'])
def get_photo():
    all_photo = Photo.query.all()
    results = list(map(lambda photo: photo.serialize(), all_photo))
    return jsonify(results), 200

@api.route('/photo', methods=['POST'])
def create_photo():
    data = request.get_json()
    new_photo = Photo(
        url=data['url'],
        pet_id=data['pet_id'],
    )
    db.session.add(new_photo)
    db.session.commit()
    return jsonify({'message': 'New photo added!'}), 201

@api.route('/photo/<int:id>', methods=['DELETE'])
def delete_photo(id):
    photo = Photo.query.get_or_404(id)
    db.session.delete(photo)
    db.session.commit()
    return jsonify({'message': 'Photo deleted successfully!'}), 200

@api.route('/photo/<int:id>', methods=['PUT'])
def update_photo(id):
    data = request.get_json()
    photo = Photo.query.get_or_404(id)
    photo.url = data.get('url', photo.url)
    photo.order = data.get('order', photo.order)
    db.session.commit()
    return jsonify({'message': 'Photo updated successfully!'})

# Upload profile picture
@api.route('/upload_profile_picture', methods=['POST'])
@jwt_required()
def upload_profile_picture():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    current_owner_email = get_jwt_identity()
    owner = Owner.query.filter_by(email=current_owner_email).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    result = upload(file, public_id=f"owner_{owner.id}_profile_picture")
    owner.profile_picture_url = result['secure_url']
    db.session.commit()

    return jsonify({"message": "File uploaded successfully", "profile_picture_url": owner.profile_picture_url}), 200

# Upload pet profile picture
@api.route('/upload_pet_profile_picture/<int:pet_id>', methods=['POST'])
def upload_pet_profile_picture(pet_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'error': 'Pet not found'}), 404

    try:
        upload_result = cloudinary.uploader.upload(file)
        pet.profile_photo_url = upload_result['secure_url']
        db.session.commit()
        return jsonify({'message': 'Pet profile picture updated!', 'photo_url': pet.profile_photo_url}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to upload pet photo', 'details': str(e)}), 500

# MULTIPLES FOTOS

@api.route('/upload_pet_additional_photos/<int:pet_id>', methods=['POST'])
def upload_pet_additional_photos(pet_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    files = request.files.getlist('file')
    if len(files) > 4:
        return jsonify({"error": "You can upload up to 4 photos only"}), 400

    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'error': 'Pet not found'}), 404

    uploaded_urls = []
    try:
        for file in files:
            if file.filename == '':
                return jsonify({"error": "No selected file"}), 400
            
            upload_result = cloudinary.uploader.upload(file)
            photo = Photo(url=upload_result['secure_url'], pet_id=pet_id)
            db.session.add(photo)
            uploaded_urls.append(photo.url)
        
        db.session.commit()
        return jsonify({'message': 'Pet additional pictures updated!', 'photo_urls': uploaded_urls}), 200
    except Exception as e:
        return jsonify({'error': 'Failed to upload pet photos', 'details': str(e)}), 500

@api.route('/api/update_photo_order', methods=['POST'])
def update_photo_order():
    data = request.get_json()
    try:
        for photo in data:
            photo_id = photo['id']
            new_order = photo['order']
            photo_to_update = Photo.query.get(photo_id)
            if photo_to_update:
                photo_to_update.order = new_order
        db.session.commit()
        return jsonify({"message": "Photo order updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
# Nuevas Rutas para Cuidados y Compatibilidad usando OpenAI
@api.route('/cuidados/<string:raza>', methods=['GET'])
def get_cuidados(raza):
    prompt = f"Necessary care for {raza}:\n1. Food:\n- \n2. Exercise:\n- \n3. Hygiene:\n- \n4. Health:\n- \n5. Environment:\n-"
    try:
        current_app.logger.info(f"Prompt sent to OpenAI: {prompt}")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        current_app.logger.info(f"Response from OpenAI: {response}")
        return jsonify({"text": response.choices[0].message.content.strip()}), 200
    except Exception as e:
        current_app.logger.error(f"Error obtaining care information: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/compatibilidad/<string:raza>', methods=['GET'])
def get_compatibilidad(raza):
    prompt = f"Compatibility of {raza} with other breeds:\n1. High Compatibility:\n- \n2. Moderate Compatibility:\n- \n3. Low Compatibility:\n-"
    try:
        current_app.logger.info(f"Prompt sent to OpenAI: {prompt}")
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        current_app.logger.info(f"Response from OpenAI: {response}")
        return jsonify({"text": response.choices[0].message.content.strip()}), 200
    except Exception as e:
        current_app.logger.error(f"Error obtaining compatibility information: {str(e)}")
        return jsonify({"error": str(e)}), 500



# OBTENER OWNER PETS

@api.route('/owner_pets', methods=['GET'])
@jwt_required()
def get_owner_pets():
    try:
        current_owner_email = get_jwt_identity()
        print(f"Current owner email: {current_owner_email}")  # Log para depuración
        owner = Owner.query.filter_by(email=current_owner_email).first()
        if not owner:
            return jsonify({"error": "Owner not found"}), 404

        pets = Pet.query.filter_by(owner_id=owner.id).all()
        return jsonify([{
            'id': pet.id,
            'name': pet.name,
            'breed': pet.breed.name if pet.breed else None,
            'sex': pet.sex,
            'age': pet.age,
            'pedigree': pet.pedigree,
            'photo': pet.profile_photo_url,
            'owner_id': pet.owner_id,
            'owner_name': pet.owner.name if pet.owner else None
        } for pet in pets]), 200
    except Exception as e:
        print(f"Error fetching owner's pets: {str(e)}")  # Log para depuración
        return jsonify({"error": str(e)}), 500


# LIKES Y MATCH

@api.route('/like_pet', methods=['POST'])
@jwt_required()
def like_pet():
    current_owner_email = get_jwt_identity()
    data = request.json
    liker_pet_id = data.get('liker_pet_id')
    liked_pet_id = data.get('liked_pet_id')

    if not liker_pet_id or not liked_pet_id:
        return jsonify({"error": "Missing data"}), 400

    liker_pet = Pet.query.get(liker_pet_id)
    liked_pet = Pet.query.get(liked_pet_id)

    if not liker_pet or not liked_pet:
        return jsonify({"error": "Pet not found"}), 404

    # Verifica si ya existe un "like" de esta mascota a la otra
    existing_like = Like.query.filter_by(liker_pet_id=liker_pet_id, liked_pet_id=liked_pet_id).first()
    if existing_like:
        return jsonify({"error": "You have already liked this pet"}), 400

    new_like = Like(liker_pet_id=liker_pet_id, liked_pet_id=liked_pet_id)
    db.session.add(new_like)
    db.session.commit()

    # Verifica si hay un match
    match = Like.query.filter_by(liker_pet_id=liked_pet_id, liked_pet_id=liker_pet_id).first()
    if match:
        # Si hay un match, crea una entrada en la tabla Match
        new_match = Match(pet1_id=liker_pet_id, pet2_id=liked_pet_id)
        db.session.add(new_match)
        db.session.commit()
        return jsonify({"match": True}), 200

    return jsonify({"match": False}), 200

@api.route('/pet/<int:pet_id>/likes', methods=['GET'])
def get_pet_likes(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    received_likes = Like.query.filter_by(liked_pet_id=pet_id).all()
    likes = []

    for like in received_likes:
        liker_pet = Pet.query.get(like.liker_pet_id)
        if liker_pet:
            likes.append({
                "liker_pet_id": liker_pet.id,
                "liker_pet_name": liker_pet.name,
                "liker_pet_photo": liker_pet.profile_photo_url
            })

    return jsonify(likes), 200


@api.route('/pet/<int:pet_id>/matches', methods=['GET'])
def get_pet_matches(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    given_likes = Like.query.filter_by(liker_pet_id=pet_id).all()
    matches = []

    for like in given_likes:
        reciprocal_like = Like.query.filter_by(liker_pet_id=like.liked_pet_id, liked_pet_id=pet_id).first()
        if reciprocal_like:
            matched_pet = Pet.query.get(like.liked_pet_id)
            if matched_pet:
                match = Match.query.filter(
                    ((Match.pet1_id == pet_id) & (Match.pet2_id == matched_pet.id)) |
                    ((Match.pet1_id == matched_pet.id) & (Match.pet2_id == pet_id))
                ).first()
                if match:
                    matches.append({
                        "match_id": match.id,
                        "match_pet_id": matched_pet.id,
                        "match_pet_name": matched_pet.name,
                        "match_pet_photo": matched_pet.profile_photo_url
                    })

    return jsonify(matches), 200


@api.route('/matches/<int:pet_id>', methods=['GET'])
@jwt_required()
def get_matches(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({"error": "Pet not found"}), 404

    matches = Match.query.filter((Match.pet1_id == pet_id) | (Match.pet2_id == pet_id)).all()
    matches_data = []
    for match in matches:
        matched_pet_id = match.pet2_id if match.pet1_id == pet_id else match.pet1_id
        matched_pet = Pet.query.get(matched_pet_id)
        if matched_pet:
            matches_data.append({
                "match_id": match.id,
                "pet_id": matched_pet.id,
                "name": matched_pet.name,
                "profile_photo_url": matched_pet.profile_photo_url
            })

    return jsonify(matches_data), 200

# MENSAJES

@api.route('/messages/<int:match_id>', methods=['GET'])
@jwt_required()
@cross_origin()
def get_messages(match_id):
    messages = Message.query.filter_by(match_id=match_id).order_by(Message.timestamp).all()
    return jsonify([message.serialize() for message in messages]), 200

@api.route('/message', methods=['POST'])
@jwt_required()
@cross_origin()
def send_message():
    data = request.get_json()
    match_id = data.get('match_id')
    sender_pet_id = data.get('sender_pet_id')
    content = data.get('content')

    if not match_id or not sender_pet_id or not content:
        return jsonify({"error": "Missing data"}), 400

    new_message = Message(match_id=match_id, sender_pet_id=sender_pet_id, content=content)
    db.session.add(new_message)
    db.session.commit()

    # Emitir el mensaje a los clientes conectados
    socketio.emit('new_message', new_message.serialize(), room=f"match_{match_id}")

    return jsonify(new_message.serialize()), 201 
