import "../../styles/singlepet.css";

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
        breed: '',
        pedigree: false,
        description: '',
        photos: [],
        profile_photo_url: '',
        owner: '',
        ownerPhoto: '',
        ownerId: ''
    });
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(true);
    const [careInfo, setCareInfo] = useState("");
    const [compatibilityInfo, setCompatibilityInfo] = useState("");

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
                        breed: pet.breed || '',
                        pedigree: pet.pedigree || false,
                        description: pet.description || '',
                        photos: pet.photos || [],
                        profile_photo_url: pet.profile_photo_url || '',
                        owner: pet.owner_name || '',
                        ownerPhoto: pet.owner_photo_url || '',
                        ownerId: pet.owner_id || ''
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

    const handleLike = async () => {
        try {
            if (store.auth) {
                if (!selectedPetId) {
                    alert("You need to select one of your pets to like another pet.");
                    return;
                }
                const result = await actions.likePet(selectedPetId, petId);
                if (result.match) {
                    alert("It's a match!");
                } else {
                    alert("You liked this pet!");
                }
            } else {
                alert("You need to be logged in to like a pet.");
            }
        } catch (error) {
            console.error('Error liking the pet:', error);
            alert('Failed to like the pet. Please try again.');
        }
    };

    const fetchCareInfo = async () => {
        try {
            const careInfo = await actions.fetchCuidados(petDetails.breed);
            setCareInfo(careInfo);
        } catch (error) {
            console.error("Error fetching care info:", error);
        }
    };

    const fetchCompatibilityInfo = async () => {
        try {
            const compatibilityInfo = await actions.fetchCompatibilidad(petDetails.breed);
            setCompatibilityInfo(compatibilityInfo);
        } catch (error) {
            console.error("Error fetching compatibility info:", error);
        }
    };

    return (
        <div className="container single-pet-container">
            <div className="pet-card">
                <div className="pet-card-header">
                    <h2>{petDetails.name}, {petDetails.age} years</h2>
                    <div className="owner-info">
                        {petDetails.ownerPhoto && (
                            <Link to={`/singleowner/${petDetails.ownerId}`}>
                                <img src={petDetails.ownerPhoto} alt="Owner Profile" className="owner-photo" />
                            </Link>
                        )}
                        <span>{petDetails.owner}</span>
                    </div>
                </div>
                <div className="pet-card-body">
                    {petDetails.profile_photo_url && (
                        <img src={petDetails.profile_photo_url} alt="Pet Profile" className="pet-profile-photo" />
                    )}
                    <div className="pet-details">
                        <div className="detail-item">
                            <label>Breed:</label>
                            <span>{petDetails.breed}</span>
                        </div>
                        <div className="detail-item">
                            <label>Sex:</label>
                            <span>{petDetails.sex}</span>
                        </div>
                        <div className="detail-item">
                            <label>Pedigree:</label>
                            <span>{petDetails.pedigree ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="detail-item-description">
                            <label>About me:</label>
                            <span>{petDetails.description}</span>
                        </div>
                    </div>
                </div>
                <div className="pet-card-footer">
                    {store.auth && (
                        <div className="like-section">
                            <select
                                className="form-select mb-3 narrow-select"
                                value={selectedPetId || ''}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                            >
                                <option value="" disabled>Select your pet</option>
                                {store.owner && store.owner.pets && store.owner.pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary like-button" onClick={handleLike}>
                                <i className="fas fa-heart"></i> Like
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="additional-section">
                <div className="additional-text"><h3>Additional pictures</h3></div>
                <div className="additional-photos">
                    {petDetails.photos.map((photo, index) => (
                        <img src={photo.url} alt={`Pet ${index}`} className="additional-photo" key={index} />
                    ))}
                </div>
                <div className="info-buttons">
                    <button className="btn  me-2 ia-btn" onClick={fetchCareInfo}>Cuidados </button>
                    <button className="btn  me-2 ia-btn" onClick={fetchCompatibilityInfo}>Compatibilidad </button>
                </div>
                {careInfo && (
                    <div className="care-info">
                        <h3>Cuidados</h3>
                        <p>{careInfo}</p>
                    </div>
                )}
                {compatibilityInfo && (
                    <div className="compatibility-info">
                        <h3>Compatibilidad</h3>
                        <p>{compatibilityInfo}</p>
                    </div>
                )}
                <Link to="/pets" className="btn btn-secondary back-button">
                    <i className="fas fa-arrow-left"></i> Back to the list of pets
                </Link>
            </div>
        </div>
    );
};
