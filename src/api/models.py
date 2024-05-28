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
    profile_picture_url = db.Column(db.String(200), nullable=True)  # Nuevo campo para la foto de perfil del owner
    pets = db.relationship('Pet', backref='owner', lazy=True)

    def __repr__(self):
        return f'<Owner {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "password": self.password,
            "profile_picture_url": self.profile_picture_url #nuevo
        }

class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    breed_id = db.Column(db.Integer, db.ForeignKey('breed.id'), nullable=True)
    sex = db.Column(db.String(10), nullable=False)
    age = db.Column(db.Integer, nullable=False)
    pedigree = db.Column(db.Boolean, nullable=False)
    photo = db.Column(db.String(100), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('owner.id'), nullable=False)
    breed = db.relationship('Breed', backref='pets')

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
            "photo": self.photo,
            "owner_id": self.owner_id
        }

class City(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    pet_friendly = db.Column(db.String(80), nullable=False)

    def __repr__(self):
        return f'<City {self.name}>'

class Breed(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(250), nullable=False)
    type = db.Column(db.String(250), nullable=False)

    def __repr__(self):
        return f'<Breed {self.name}>'


