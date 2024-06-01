"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet, City, Owner, Breed, Photo
import cloudinary.uploader
from cloudinary.uploader import upload
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager
from openai import OpenAI, Configuration

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Configuración de la API de OpenAI
configuration = Configuration(api_key="YOUR_OPENAI_API_KEY")
openai = OpenAI(configuration)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


#OWNER

@api.route('/owner', methods=['GET'])
def get_owners():
    all_owners= Owner.query.all()
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
    
    # Obtener la URL de la foto de perfil más reciente del propietario, si existe
    profile_picture = OwnerProfilePicture.query.filter_by(owner_id=owner_id).order_by(OwnerProfilePicture.id.desc()).first()
    profile_picture_url = profile_picture.picture_url if profile_picture else None

    owner_data = owner.serialize()
    owner_data["profile_picture_url"] = profile_picture_url

    return jsonify(owner_data), 200

@api.route("/owner/<int:owner_id>", methods=["DELETE"])
def delete_owner(owner_id):
    owner = Owner.query.get(owner_id)

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


@api.route('/login', methods=['POST'])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    owner = Owner.query.filter_by(email= email).first()
    if owner is None:
        return jsonify({"message":"Email not found"}), 401
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

#####ROUTES PETS#########################################
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
        'photo': pet.photo,
        'owner_id': pet.owner_id,
        'owner_name': pet.owner.name if pet.owner else None
    } for pet in pets])

@api.route('/pets/<int:pet_id>', methods=['GET'])
def get_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if pet:
        return jsonify({
            'id': pet.id,
            'name': pet.name,
            'breed': pet.breed.name if pet.breed else None,
            'sex': pet.sex,
            'age': pet.age,
            'pedigree': pet.pedigree,
            'photo': pet.photo,
            'owner_id': pet.owner_id,
            'owner_name': pet.owner.name if pet.owner else None
        }), 200
    else:
        return jsonify({'error': 'Pet not found'}), 404

@api.route('/pets', methods=['POST'])
def add_pet():
    data = request.get_json()
    if not all(key in data for key in ['name', 'breed_id', 'sex', 'age', 'pedigree', 'photo', 'owner_id']):
        return jsonify({'error': 'Missing data'}), 400
    new_pet = Pet(
        name=data['name'],
        breed_id=data['breed_id'],
        sex=data['sex'],
        age=data['age'],
        pedigree=data['pedigree'],
        photo=data['photo'],
        owner_id=data['owner_id']
    )
    db.session.add(new_pet)
    db.session.commit()
    return jsonify({'message': 'New pet added!', 'pet_id': new_pet.id}), 201

@api.route('/pets/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if pet:
        data = request.json
        pet.name = data.get('name', pet.name)
        pet.breed_id = data.get('breed_id', pet.breed_id)
        pet.sex = data.get('sex', pet.sex)
        pet.age = data.get('age', pet.age)
        pet.pedigree = data.get('pedigree', pet.pedigree)
        pet.photo = data.get('photo', pet.photo)
        pet.owner_id = data.get('owner_id', pet.owner_id)
        db.session.commit()
        return jsonify({
            'id': pet.id,
            'name': pet.name,
            'breed': pet.breed.name if pet.breed else None,
            'sex': pet.sex,
            'age': pet.age,
            'pedigree': pet.pedigree,
            'photo': pet.photo,
            'owner_id': pet.owner_id,
            'owner_name': pet.owner.name if pet.owner else None
        }), 200
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
    } for city in city])

@api.route('/city', methods=['POST'])
def add_city():
    data = request.get_json()
    new_city = City(
        name=data['name'],
        pet_friendly=data['pet_friendly'],
    )
    db.session.add(new_city)
    db.session.commit()
    return jsonify({'message': 'New city added!'},(new_city.serialize()), 201)


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


#Breed razas de perros

@api.route('/breed', methods=['GET'])
def get_breed():
    breed = Breed.query.all()
    return jsonify([{
        'id': breed.id,
        'name': breed.name,
        'type': breed.type,

    } for breed in breed])

@api.route('/breed', methods=['POST'])
def add_breed():
    data = request.get_json()
    new_breed = Breed(
        name=data['name'],
        type=data['type'],
    )
    db.session.add(new_breed)
    db.session.commit()
    return jsonify({'message': 'New breed added!'})

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



@api.route('/photo', methods=['GET'])
def get_photo():
    all_photo= Photo.query.all()
    results = list(map(lambda photo: photo.serialize(), all_photo))
   
    return jsonify(results), 200


@api.route('/photo', methods=['POST'])
def create_photo():
    data = request.get_json()
    new_photo = Photo(
        url=data['url'],
    )
    db.session.add(new_photo)
    db.session.commit()
    return jsonify({'message': 'New photo added!'})

@api.route('/photo/<int:id>', methods=['DELETE'])
def delete_photo(id):
    photo = Photo.query.get_or_404(id)
    db.session.delete(photo)
    db.session.commit()
    return jsonify({'message': 'Photo deleted successfully!'})

@api.route('/photo/<int:id>', methods=['PUT'])
def update_photo(id):
    data = request.get_json()
    photo = Photo.query.get_or_404(id)
    
    photo.url = data.get('url', photo.url)

    db.session.commit()
    return jsonify({'message': 'Photo updated successfully!'})
#UPLOAD PHOTO 


# Ruta para subir la foto de perfil
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
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )
        return jsonify({"text": response.choices[0].text.strip()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@api.route('/compatibilidad/<string:raza>', methods=['GET'])
def get_compatibilidad(raza):
    prompt = f"Compatibilidad de {raza} con otras razas:\n1. Compatibilidad Alta:\n- \n2. Compatibilidad Moderada:\n- \n3. Compatibilidad Baja:\n-"
    try:
        response = openai.Completion.create(
            model="text-davinci-003",
            prompt=prompt,
            max_tokens=150
        )
        return jsonify({"text": response.choices[0].text.strip()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

