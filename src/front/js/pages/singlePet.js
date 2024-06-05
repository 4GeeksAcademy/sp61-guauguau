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
        <div className="container">
            <h2 className='p-5 ps-0'>{petDetails.name}, {petDetails.age} years</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="row">
                <div className="col-md-4">
                    {petDetails.profile_photo_url && (
                        <img src={petDetails.profile_photo_url} alt="Pet Profile" className="img-thumbnail w-100 mb-3" />
                    )}
                    {store.auth && (
                        <div>
                            <select
                                className="form-select mb-3"
                                value={selectedPetId || ''}
                                onChange={(e) => setSelectedPetId(e.target.value)}
                            >
                                <option value="" disabled>Select your pet</option>
                                {store.owner && store.owner.pets && store.owner.pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary mt-2" onClick={handleLike}>
                                <i className="fas fa-heart"></i> Like
                            </button>
                        </div>
                    )}
                </div>
                <div className="col-md-8">
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Name:</label>
                        <span className="me-2">{petDetails.name}</span>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Breed:</label>
                        <span className="me-2">{petDetails.breed}</span>
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
                        <span className="me-2">{petDetails.pedigree ? 'Yes' : 'No'}</span>
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
            <button className="btn btn-secondary me-2" onClick={fetchCareInfo}>
                Cuidados
            </button>
            {careInfo && (
                <div>
                    <h3>Cuidados</h3>
                    <p>{careInfo}</p>
                </div>
            )}
            <button className="btn btn-secondary me-2" onClick={fetchCompatibilityInfo}>
                Compatibilidad
            </button>
            {compatibilityInfo && (
                <div>
                    <h3>Compatibilidad</h3>
                    <p>{compatibilityInfo}</p>
                </div>
            )}
            <Link to="/pets" className="btn btn-secondary mt-3">
                <i className="fas fa-arrow-left"></i> Back to the list of pets
            </Link>
        </div>
    );
};
