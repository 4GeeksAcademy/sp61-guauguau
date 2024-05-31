from flask import Flask, request, jsonify, url_for, Blueprint
import cloudinary.uploader
from cloudinary.uploader import upload
from api.models import db, User, Pet, City, Owner, Breed

from api.utils import generate_sitemap, APIException
from flask_cors import CORS

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200

# OWNER
@api.route('/owner', methods=['GET'])
def get_owners():
    all_owners= Owner.query.all()
    results = list(map(lambda owner: owner.serialize(), all_owners))
    return jsonify(results), 200

@api.route('/add_owner', methods=['POST'])
def create_owner():
    data = request.json
    required_fields = ["email", "password", "name"]
    for field in required_fields:
        if field not in data: return "The '" + field + "' cannot be empty", 400
    existing_owner = Owner.query.filter_by(email=data['email']).first()
    if existing_owner:
        return jsonify({"error": "Email already exists!"}), 409
    
    new_owner = Owner(email = data['email'], password = data['password'], name = data['name'])
    db.session.add(new_owner)
    db.session.commit()

    return jsonify({"message": "Owner created!"}), 200

@api.route("/owner/<int:owner_id>", methods=["GET"])
def get_owner(owner_id):
    owner = Owner.query.get(owner_id)
    if not owner:
        return jsonify({"error": "Owner not found"}), 404

    owner_data = owner.serialize()
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
        'photo': pet.photo,
        'owner_id': pet.owner_id,
        'owner_name': pet.owner.name if pet.owner else None
    } for pet in pets])

@api.route('/pet/<int:pet_id>', methods=['GET'])
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
    data = request.json
    if not all(key in data for key in ['name', 'breed_id', 'sex', 'age', 'pedigree', 'photo', 'owner_id']):
        return jsonify({'error': 'Missing data'}), 400
    
    # Create the new pet with the provided data
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

@api.route('/upload_pet_profile_picture/<int:pet_id>', methods=['POST'])
def upload_pet_profile_picture(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'error': 'Pet not found'}), 404

    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    try:
        upload_result = cloudinary.uploader.upload(file)
        pet.photo = upload_result['secure_url']
        db.session.commit()
        return jsonify({'message': 'Pet profile picture updated!', 'photo_url': pet.photo}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@api.route('/pets/<int:pet_id>', methods=['DELETE'])
def delete_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if pet:
        db.session.delete(pet)
        db.session.commit()
        return jsonify({'message': 'Pet deleted!'}), 200
    else:
        return jsonify({'error': 'Pet not found'}), 404

@api.route('/pet/<int:pet_id>', methods=['PUT'])
def update_pet(pet_id):
    pet = Pet.query.get(pet_id)
    if not pet:
        return jsonify({'error': 'Pet not found'}), 404

    data = request.json
    pet.name = data.get('name', pet.name)
    pet.breed_id = data.get('breed_id', pet.breed_id)
    pet.sex = data.get('sex', pet.sex)
    pet.age = data.get('age', pet.age)
    pet.pedigree = data.get('pedigree', pet.pedigree)
    pet.photo = data.get('photo', pet.photo)
    pet.owner_id = data.get('owner_id', pet.owner_id)
    db.session.commit()
    return jsonify({'message': 'Pet updated!'}), 200

##### ROUTES CITIES ######################################
@api.route('/city', methods=['GET'])
def get_city():
    cities = City.query.all()
    return jsonify([city.serialize() for city in cities]), 200

@api.route('/city/<int:city_id>', methods=['GET'])
def get_city_by_id(city_id):
    city = City.query.get(city_id)
    if not city:
        return jsonify({'message': 'City not found'}), 404
    return jsonify(city.serialize()), 200

@api.route('/city', methods=['POST'])
def create_city():
    data = request.json
    new_city = City(
        name=data['name'],
        pet_friendly=data['pet_friendly']
    )
    db.session.add(new_city)
    db.session.commit()
    return jsonify({'message': 'City created!'}), 201

@api.route('/city/<int:city_id>', methods=['DELETE'])
def delete_city(city_id):
    city = City.query.get(city_id)
    if not city:
        return jsonify({'message': 'City not found'}), 404
    db.session.delete(city)
    db.session.commit()
    return jsonify({'message': 'City deleted!'}), 200

@api.route('/city/<int:city_id>', methods=['PUT'])
def update_city(city_id):
    data = request.json
    city = City.query.get(city_id)
    if not city:
        return jsonify({'message': 'City not found'}), 404
    city.name = data['name']
    city.pet_friendly = data['pet_friendly']
    db.session.commit()
    return jsonify({'message': 'City updated!'}), 200

##### ROUTES BREEDS ######################################
@api.route('/breeds', methods=['GET'])
def get_breeds():
    try:
        breeds = Breed.query.all()
        # Serialize the data to JSON
        breed_data = [{
            'id': breed.id,
            'name': breed.name,
            'type': breed.type
        } for breed in breeds]
        # Return the data as JSON response
        return jsonify(breed_data), 200
    except Exception as e:
        # Handle any errors and return an error response
        return jsonify({'error': str(e)}), 500

@api.route('/breeds/<int:breed_id>', methods=['GET'])
def get_breed_by_id(breed_id):
    breed = Breed.query.get(breed_id)
    if not breed:
        return jsonify({'error': 'Breed not found'}), 404
    return jsonify({
        'id': breed.id,
        'name': breed.name,
        'type': breed.type
    }), 200

@api.route('/breeds', methods=['POST'])
def create_breed():
    data = request.json
    new_breed = Breed(
        name=data['name'],
        type=data['type']
    )
    db.session.add(new_breed)
    db.session.commit()
    return jsonify({'message': 'Breed created!'}), 201

@api.route('/breeds/<int:breed_id>', methods=['DELETE'])
def delete_breed(breed_id):
    breed = Breed.query.get(breed_id)
    if not breed:
        return jsonify({'error': 'Breed not found'}), 404
    db.session.delete(breed)
    db.session.commit()
    return jsonify({'message': 'Breed deleted!'}), 200

@api.route('/breeds/<int:breed_id>', methods=['PUT'])
def update_breed(breed_id):
    breed = Breed.query.get(breed_id)
    if not breed:
        return jsonify({'error': 'Breed not found'}), 404

    data = request.json
    breed.name = data.get('name', breed.name)
    breed.type = data.get('type', breed.type)
    db.session.commit()
    return jsonify({'message': 'Breed updated!'}), 200

# UPLOAD PHOTO
    
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