import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link } from 'react-router-dom';

export const SinglePet = () => {
    const { petId } = useParams();
    const { store, actions } = useContext(Context);
    const [petDetails, setPetDetails] = useState({
        name: '',
        age: '',
        sex: '',
        pedigree: false,
        description: '',
        photos: [],
        profile_photo_url: '',
        owner: '',
        ownerPhoto: '',
        ownerId: '' // Añadir ownerId para poder enlazarlo
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);

        const fetchPetDetails = async () => {
            try {
                const pet = await actions.getPetDetails(petId);
                if (isMounted) {
                    setPetDetails({
                        name: pet.name || '',
                        age: pet.age || '',
                        sex: pet.sex || '',
                        pedigree: pet.pedigree || false,
                        description: pet.description || '',
                        photos: pet.photos || [],
                        profile_photo_url: pet.profile_photo_url || '',
                        owner: pet.owner_name || '',
                        ownerPhoto: pet.owner_photo_url || '',
                        ownerId: pet.owner_id || '' // Asignar ownerId aquí
                    });
                }
            } catch (error) {
                console.error("Failed to fetch pet details:", error);
                if (isMounted) {
                    setErrorMessage('Failed to fetch pet details. Please try again.');
                }
            }
        };
        fetchPetDetails();

        return () => {
            setIsMounted(false);
        };
    }, [petId]);

    return (
        <div className="container">
            <h2 className='p-5 ps-0'>{petDetails.name}, {petDetails.age} years</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="row">
                <div className="col-md-4">
                    {petDetails.profile_photo_url && (
                        <img src={petDetails.profile_photo_url} alt="Pet Profile" className="img-thumbnail w-100 mb-3" />
                    )}
                </div>
                <div className="col-md-8">
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Name:</label>
                        <span className="me-2">{petDetails.name}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Age:</label>
                        <span className="me-2">{petDetails.age}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Sex:</label>
                        <span className="me-2">{petDetails.sex}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Pedigree:</label>
                        <span className="me-2">{petDetails.pedigree ? 'Sí' : 'No'}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Description:</label>
                        <span className="me-2">{petDetails.description}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Owner:</label>
                        <span className="me-2 d-flex align-items-center">
                            {petDetails.ownerPhoto && (
                                <Link to={`/singleowner/${petDetails.ownerId}`}>
                                    <img
                                        src={petDetails.ownerPhoto}
                                        alt="Owner Profile"
                                        className="rounded-circle me-2"
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    />
                                </Link>
                            )}
                            {petDetails.owner}
                        </span>
                    </div>
                </div>
            </div>
            <h3 className='p-5 ps-0'>Additional pictures</h3>
            <div className="row">
                {petDetails.photos.map((photo, index) => (
                    <div className="col-md-3 mb-3" key={index}>
                        <img src={photo.url} alt={`Pet ${index}`} className="img-fluid" />
                    </div>
                ))}
            </div>
            <Link to="/pets" className="btn btn-secondary mt-3">
                <i className="fas fa-arrow-left"></i> Back to the list of pets
            </Link>
        </div>
    );
};
