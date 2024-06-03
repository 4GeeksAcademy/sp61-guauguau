
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Pet, City, Owner, Breed, Photo
import cloudinary.uploader
from cloudinary.uploader import upload
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask import current_app as app
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import openai  # Importamos el paquete openai
from dotenv import load_dotenv
import os

load_dotenv()  # Cargar variables de entorno desde el archivo .env

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Configuración de la API de OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

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
    data = request.json
    required_fields = ["email", "password", "name", "address", "latitude", "longitude"]
    for field in required_fields:
        if field not in data:
            return jsonify({"error": "The '" + field + "' cannot be empty"}), 400

    existing_owner = Owner.query.filter_by(email=data['email']).first()
    if existing_owner:
        return jsonify({"error": "Email already exists!"}), 409
    
    new_owner = Owner(
        email=data['email'], 
        password=data['password'], 
        name=data['name'],
        address=data['address'],
        latitude=data['latitude'],
        longitude=data['longitude']
    )
    db.session.add(new_owner)
    db.session.commit()
    return jsonify({"message": "Owner created!"}), 200

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
        return jsonify({"message": "Owner not found"}), 404
    
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
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    owner = Owner.query.filter_by(email=email).first()
    if owner is None:
        return jsonify({"message": "Email not found"}), 401
    if password != owner.password:
        return jsonify({"message": "Wrong password"}), 401
    
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    current_owner = get_jwt_identity()
    owner = Owner.query.filter_by(email=current_owner).first()
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    return jsonify({"owner": owner.serialize()}), 200

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
        'profile_photo_url': pet.profile_photo_url,  # Asegúrate de que esta propiedad está incluida
        'owner_id': pet.owner_id,
        'owner_name': pet.owner.name if pet.owner else None
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
            'owner_photo_url': pet.owner.profile_picture_url if pet.owner else None,  # Añadir esta línea
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

    # Log the received data
    app.logger.info(f"Received data: {data}")

    required_fields = ['name', 'breed_id', 'sex', 'age', 'pedigree', 'photo_url', 'owner_id']
    if not all(field in data for field in required_fields):
        missing_fields = [field for field in required_fields if field not in data]
        app.logger.error(f"Missing fields: {missing_fields}")
        return jsonify({'error': 'Missing data', 'missing_fields': missing_fields}), 400

    try:
        new_pet = Pet(
            name=data['name'],
            breed_id=int(data['breed_id']),  # Ensure breed_id is an integer
            sex=data['sex'],
            age=int(data['age']),  # Ensure age is an integer
            pedigree=bool(data['pedigree']),  # Ensure pedigree is a boolean
            photo_url=data['photo_url'],  # Updated field
            owner_id=int(data['owner_id'])  # Ensure owner_id is an integer
        )
        db.session.add(new_pet)
        db.session.commit()
        app.logger.info(f"New pet added with ID: {new_pet.id}")
        return jsonify({'message': 'New pet added!', 'pet_id': new_pet.id}), 201
    except Exception as e:
        app.logger.error(f"Error adding pet: {str(e)}")
        return jsonify({'error': 'Failed to add pet'}), 500


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

@api.route('/upload_pet_profile_picture', methods=['POST'])
def upload_pet_profile_picture():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    result = upload(file, public_id=f"pet_profile_pictures/{file.filename}")
    photo_url = result['secure_url']

    return jsonify({"photo_url": photo_url}), 200


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
    } for breed in breed]), 200

@api.route('/breed', methods=['POST'])
def add_breed():
    data = request.get_json()
    new_breed = Breed(
        name=data['name'],
        type=data['type'],
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
    db.session.commit()
    return jsonify({'message': 'Breed updated successfully!'})

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

# Nuevas Rutas para Cuidados y Compatibilidad usando OpenAI
@api.route('/cuidados/<string:raza>', methods=['GET'])
def get_cuidados(raza):
    prompt = f"Cuidados necesarios para {raza}:\n1. Alimentación:\n- \n2. Ejercicio:\n- \n3. Higiene:\n- \n4. Salud:\n- \n5. Entorno:\n-"
    try:
        current_app.logger.info(f"Prompt enviado a OpenAI: {prompt}")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        current_app.logger.info(f"Respuesta de OpenAI: {response}")
        return jsonify({"text": response.choices[0].message['content'].strip()}), 200
    except Exception as e:
        current_app.logger.error(f"Error al obtener cuidados: {str(e)}")
        return jsonify({"error": str(e)}), 500

@api.route('/compatibilidad/<string:raza>', methods=['GET'])
def get_compatibilidad(raza):
    prompt = f"Compatibilidad de {raza} con otras razas:\n1. Compatibilidad Alta:\n- \n2. Compatibilidad Moderada:\n- \n3. Compatibilidad Baja:\n-"
    try:
        current_app.logger.info(f"Prompt enviado a OpenAI: {prompt}")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ]
        )
        current_app.logger.info(f"Respuesta de OpenAI: {response}")
        return jsonify({"text": response.choices[0].message['content'].strip()}), 200
    except Exception as e:
        current_app.logger.error(f"Error al obtener compatibilidad: {str(e)}")
        return jsonify({"error": str(e)}), 500

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

# OBTENER OWNER PETS

@api.route('/owner_pets', methods=['GET'])
@jwt_required()
def get_owner_pets():
    current_owner_email = get_jwt_identity()
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
