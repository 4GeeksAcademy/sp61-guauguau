from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }

class Owner(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    profile_picture_url = db.Column(db.String(255))
    address = db.Column(db.String(250), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    
    pets = db.relationship('Pet', backref='owner', lazy=True)

    def __repr__(self):
        return f'<Owner {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "profile_picture_url": self.profile_picture_url,
            "address": self.address,
            "latitude": self.latitude,
            "longitude": self.longitude
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)
    sex = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    pedigree = db.Column(db.Boolean, nullable=False)
    photo_id = db.Column(db.Integer, db.ForeignKey('photo.id'), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'), nullable=False)
    description = db.Column(db.String(500), nullable=True)  # Campo de descripción añadido
    breed = db.relationship('Breed', backref='pets')
    photo = db.relationship('Photo', backref='pet_photo', foreign_keys=[photo_id])
    photos = db.relationship('Photo', backref='pet', lazy=True, foreign_keys='Photo.pet_id')

    def __repr__(self):
        return f'<Pet {self.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "breed_id": self.breed_id,
            "sex": self.sex,
            "age": self.age,
            "pedigree": self.pedigree,
            "photo": self.photo.url if self.photo else None,
            "owner_id": self.owner_id,
            "photos": [photo.url for photo in self.photos],
            "description": self.description  # Incluir la descripción en la serialización
        }

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    pet_friendly = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<City {self.name}>'

    def serialize(self): 
        return {
        "id": self.id,
        "name": self.name,
        "pet_friendly_id": self.pet_friendly_id,
        }

class Breed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    type = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f'<Breed {self.name}>'

class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(100), nullable=True)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=True)

    def __repr__(self):
        return f'<Photo {self.url}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
        }
