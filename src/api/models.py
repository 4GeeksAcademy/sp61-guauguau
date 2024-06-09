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

class Breed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    type = db.Column(db.String(250), nullable=False)
    life_span = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f'<Breed {self.name}>'

class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(100), nullable=True)
    order = db.Column(db.Integer, nullable=False, default=0)
    pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)

    def __repr__(self):
        return f'<Photo {self.url}>'

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url,
            "order": self.order
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
    description = db.Column(db.String(500), nullable=True)
    city_id = db.Column(db.Integer, db.ForeignKey('city.id'), nullable=True)

    pets = db.relationship('Pet', backref='owner', lazy=True)
    city = db.relationship('City', backref='owners')

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
            "longitude": self.longitude,
            "description": self.description,
            "city": self.city.name if self.city else None
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)
    sex = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    pedigree = db.Column(db.Boolean, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'), nullable=False)
    description = db.Column(db.String(500), nullable=True)
    profile_photo_url = db.Column(db.String(255), nullable=True)

    breed = db.relationship('Breed', backref='pets')
    photos = db.relationship('Photo', backref='pet', lazy=True)

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
            "profile_photo_url": self.profile_photo_url,
            "owner_id": self.owner_id,
            "owner_name": self.owner.name if self.owner else None,
            "owner_city": self.owner.city.name if self.owner and self.owner.city else None,  # Incluye el nombre de la ciudad del dueño
            "photos": [photo.serialize() for photo in self.photos],
            "description": self.description
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
    
class Like(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    liker_pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    liked_pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    liker_pet = db.relationship('Pet', foreign_keys=[liker_pet_id], backref='liked_by')
    liked_pet = db.relationship('Pet', foreign_keys=[liked_pet_id], backref='likes')

    def __repr__(self):
        return f'<Like {self.liker_pet_id} likes {self.liked_pet_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "liker_pet_id": self.liker_pet_id,
            "liked_pet_id": self.liked_pet_id
        }

class Adminn(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)   

    def __repr__(self):
        return f'<Adminn {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password": self.password
        }

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pet1_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    pet2_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    pet1 = db.relationship('Pet', foreign_keys=[pet1_id], backref='matches_as_pet1')
    pet2 = db.relationship('Pet', foreign_keys=[pet2_id], backref='matches_as_pet2')

    def __repr__(self):
        return f'<Match {self.pet1_id} matched with {self.pet2_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "pet1_id": self.pet1_id,
            "pet2_id": self.pet2_id
        }

class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)
    sender_pet_id = db.Column(db.Integer, db.ForeignKey('pet.id'), nullable=False)
    content = db.Column(db.String(500), nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())
    
    match = db.relationship('Match', backref='messages')
    sender_pet = db.relationship('Pet', backref='sent_messages')

    def __repr__(self):
        return f'<Message from {self.sender_pet_id} in match {self.match_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "match_id": self.match_id,
            "sender_pet_id": self.sender_pet_id,
            "content": self.content,
            "timestamp": self.timestamp
        }
