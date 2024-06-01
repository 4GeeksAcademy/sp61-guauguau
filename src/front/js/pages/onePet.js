import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link } from 'react-router-dom';


export const OnePet = () => {
    const { petId } = useParams();
    const { store, actions } = useContext(Context);
    const [petDetails, setPetDetails] = useState({
        name: '',
        age: '',
        sex: '',
        pedigree: false,
        description: '',
        photos: [],
    });
    const [isEditing, setIsEditing] = useState({
        name: false,
        age: false,
        sex: false,
        pedigree: false,
        description: false,
    });
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPetDetails = async () => {
            try {
                const pet = await actions.getPetDetails(petId);
                setPetDetails(pet);
            } catch (error) {
                console.error("Failed to fetch pet details:", error);
                setErrorMessage('Failed to fetch pet details. Please try again.');
            }
        };
        fetchPetDetails();
    }, [petId]);

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setPetDetails({
            ...petDetails,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const handleEditClick = field => {
        setIsEditing({
            ...isEditing,
            [field]: !isEditing[field]
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await actions.updatePet(petId, petDetails);
            if (file) {
                await actions.uploadPetPhoto(petId, file);
            }
            setIsLoading(false);
            setIsEditing({
                name: false,
                age: false,
                sex: false,
                pedigree: false,
                description: false,
            });
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('Failed to update pet or upload photo. Please try again.');
        }
    };

    return (
        <div className="container">
            <h2>Detalles de la Mascota</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-4">
                    {petDetails.photo && (
                        <img src={petDetails.photo} alt="Pet Profile" className="img-thumbnail w-100 mb-3" />
                    )}
                    <input type="file" onChange={handleFileChange} className="form-control" />
                </div>
                <div className="col-md-8">
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Nombre:</label>
                        {isEditing.name ? (
                            <input
                                type="text"
                                name="name"
                                value={petDetails.name}
                                onChange={handleChange}
                                className="form-control me-2"
                            />
                        ) : (
                            <span className="me-2">{petDetails.name}</span>
                        )}
                        <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={() => handleEditClick('name')} ></i>
                        
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Edad:</label>
                        {isEditing.age ? (
                            <input
                                type="number"
                                name="age"
                                value={petDetails.age}
                                onChange={handleChange}
                                className="form-control me-2"
                            />
                        ) : (
                            <span className="me-2">{petDetails.age}</span>
                        )}
                        <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={() => handleEditClick('age')} ></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Sexo:</label>
                        {isEditing.sex ? (
                            <select
                                name="sex"
                                value={petDetails.sex}
                                onChange={handleChange}
                                className="form-control me-2"
                            >
                                <option value="Male">Macho</option>
                                <option value="Female">Hembra</option>
                            </select>
                        ) : (
                            <span className="me-2">{petDetails.sex}</span>
                        )}
                        <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={() => handleEditClick('sex')} ></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Pedigree:</label>
                        {isEditing.pedigree ? (
                            <input
                                type="checkbox"
                                name="pedigree"
                                checked={petDetails.pedigree}
                                onChange={handleChange}
                                className="form-check-input me-2"
                            />
                        ) : (
                            <span className="me-2">{petDetails.pedigree ? 'Sí' : 'No'}</span>
                        )}
                        <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={() => handleEditClick('pedigree')} ></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Descripción:</label>
                        {isEditing.description ? (
                            <textarea
                                name="description"
                                value={petDetails.description}
                                onChange={handleChange}
                                className="form-control me-2"
                            />
                        ) : (
                            <span className="me-2">{petDetails.description}</span>
                        )}
                        <i className="fa-solid fa-pen-to-square cursor-pointer" onClick={() => handleEditClick('description')} ></i>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">
                         Guardar Cambios
                    </button>
                </div>
            </form>
            {isLoading && <div className="mt-3">Cargando...</div>}
            <div className="row mt-3">
                {petDetails.photos.map((photo, index) => (
                    <div key={index} className="col-6 col-md-3 mb-3">
                        <img src={photo} alt={`Pet photo ${index}`} className="img-thumbnail w-100" />
                    </div>
                ))}
            </div>
            <Link to="/private" className="btn btn-secondary mt-3">
                 Volver a Private
            </Link>
        </div>
    );
};
