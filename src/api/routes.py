"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200

@api.route('/pets', methods=['GET'])
def get_pets():
    pets = Pet.query.all()
    return jsonify([{
        'id': pet.id,
        'name': pet.name,
        'breed': pet.breed,
        'sex': pet.sex,
        'age': pet.age,
        'pedigree': pet.pedigree,
        'photo': pet.photo
    } for pet in pets])

@api.route('/add_pet', methods=['POST'])
def add_pet():
    data = request.get_json()
    if not all(key in data for key in ['name', 'breed', 'sex', 'age', 'pedigree', 'photo']):
        return jsonify({'error': 'Missing data'}), 400
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
    return jsonify({'message': 'New pet added!'})

@api.route('/delete_pet/<int:id>', methods=['DELETE'])
def delete_pet(id):
    pet = Pet.query.get_or_404(id)
    db.session.delete(pet)
    db.session.commit()
    return jsonify({'message': 'Pet deleted successfully!'})

@api.route('/update_pet/<int:id>', methods=['PUT'])
def update_pet(id):
    data = request.get_json()
    pet = Pet.query.get_or_404(id)
    
    pet.name = data.get('name', pet.name)
    pet.breed = data.get('breed', pet.breed)
    pet.sex = data.get('sex', pet.sex)
    pet.age = data.get('age', pet.age)
    pet.pedigree = data.get('pedigree', pet.pedigree)
    pet.photo = data.get('photo', pet.photo)
    
    db.session.commit()
    return jsonify({'message': 'Pet updated successfully!'})