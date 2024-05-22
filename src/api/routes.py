"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Owner
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

#OWNER

@api.route('/owner', methods=['GET'])
def get_owners():
    all_owners= Owner.query.all()
    results = list(map(lambda owner: owner.serialize(), all_owners))
   
    return jsonify(results), 200

@api.route('/owner', methods=['POST'])
def create_owner():
    data = request.json
    required_fields = ["email", "password", "name"]
    for field in required_fields:
        if field not in data: return "The '" + field + "' cannot be empty", 400
    new_owner = Owner(email = data['email'], password = data['password'], name = data['name'])
    db.session.add(new_owner)
    db.session.commit()

    return "Owner created!", 200

@api.route("/owner/<int:owner_id>", methods=["GET"])
def get_owner(owner_id):
    owner = Owner.query.get(owner_id)
    return jsonify(owner.serialize()), 200

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