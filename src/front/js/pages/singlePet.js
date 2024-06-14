import "../../styles/singlepet.css";
import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link, useNavigate } from 'react-router-dom';

export const SinglePet = () => {
    const { petId } = useParams();
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [petDetails, setPetDetails] = useState({
        name: '',
        age: '',
        sex: '',
        breed: '',
        city: '',
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
    const [matches, setMatches] = useState([]);
    const [isLoadingCareInfo, setIsLoadingCareInfo] = useState(false);
    const [isLoadingCompatibilityInfo, setIsLoadingCompatibilityInfo] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [matchMessage, setMatchMessage] = useState("");
    const [matchedPet, setMatchedPet] = useState(null);

    useEffect(() => {
        setIsMounted(true);

        const fetchPetDetails = async () => {
            try {
                const pet = await actions.getPetDetails(petId);
                const matches = await actions.fetchPetMatches(petId);
                if (isMounted) {
                    setPetDetails({
                        name: pet.name || '',
                        age: pet.age || '',
                        sex: pet.sex || '',
                        breed: pet.breed || '',
                        city: pet.owner_city || '',
                        pedigree: pet.pedigree || false,
                        description: pet.description || '',
                        photos: pet.photos || [],
                        profile_photo_url: pet.profile_photo_url || '',
                        owner: pet.owner_name || '',
                        ownerPhoto: pet.owner_photo_url || '',
                        ownerId: pet.owner_id || ''
                    });
                    setMatches(matches);
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
                    setModalTitle("Notice");
                    setMatchMessage("You need to select one of your pets to like another pet.");
                    setShowModal(true);
                    var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
                    myModal.show();
                    return;
                }
                const result = await actions.likePet(selectedPetId, petId);
                if (result.match) {
                    setModalTitle("It's a Match!");
                    setMatchedPet(result.matchPet);
                    setMatchMessage("It's a match!");
                    setShowModal(true);
                    var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
                    myModal.show();
                    setMatches(prevMatches => [...prevMatches, result.matchPet]);
                } else {
                    setModalTitle("Notice");
                    setMatchMessage("You liked this pet!");
                    setShowModal(true);
                    var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
                    myModal.show();
                }
            } else {
                setModalTitle("Notice");
                setMatchMessage("You need to be logged in to like a pet.");
                setShowModal(true);
                var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
                myModal.show();
            }
        } catch (error) {
            console.error('Error liking the pet:', error);
            setModalTitle("Error");
            setMatchMessage('Failed to like the pet. Please try again.');
            setShowModal(true);
            var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
            myModal.show();
        }
    };

    const fetchCareInfo = async () => {
        setIsLoadingCareInfo(true);
        try {
            const careInfo = await actions.fetchCuidados(petDetails.breed);
            setCareInfo(careInfo);
        } catch (error) {
            console.error("Error fetching care info:", error);
        }
        setIsLoadingCareInfo(false);
    };

    const fetchCompatibilityInfo = async () => {
        setIsLoadingCompatibilityInfo(true);
        try {
            const compatibilityInfo = await actions.fetchCompatibilidad(petDetails.breed);
            setCompatibilityInfo(compatibilityInfo);
        } catch (error) {
            console.error("Error fetching compatibility info:", error);
        }
        setIsLoadingCompatibilityInfo(false);
    };

    return (
        <div className="container single-pet-container">
            <div className="pet-card">
                <div className="pet-card-header">
                    <h1>{petDetails.name}, {petDetails.age} years</h1>
                    {petDetails.profile_photo_url && (
                        <img src={petDetails.profile_photo_url} alt="Pet Profile" className="pet-profile-photo" />
                    )}
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
                    <div className="additional-photos">
                        {petDetails.photos.slice(0, 4).map((photo, index) => (
                            <img src={photo.url} alt={`Pet ${index}`} className="additional-photo" key={index} />
                        ))}
                    </div>
                </div>
                <div className="pet-card-body">
                    <h1>More About Me</h1>
                    <div className="pet-info-container">
                        <div className="detail-item-description">
                            <p>{petDetails.description}</p>
                        </div>
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
                                <label>City:</label>
                                <span>{petDetails.city}</span>
                            </div>
                            <div className="detail-item">
                                <label>Pedigree:</label>
                                <span>{petDetails.pedigree ? 'Yes' : 'No'}</span>
                            </div>
                        </div>
                    </div>
                    <div className="owner-info">
                        <span>My Owner:</span>
                        {petDetails.ownerPhoto && (
                            <Link to={`/singleowner/${petDetails.ownerId}`}>
                                <img src={petDetails.ownerPhoto} alt="Owner Profile" className="owner-photo" />
                            </Link>
                        )}
                        <span>{petDetails.owner}</span>
                    </div>
                </div>
            </div>
            <div className="additional-section">
                <div className="info-buttons">
                    <h1>Discover everything about your furry friend's care and compatibility!</h1>
                    <p className="p-3">With just one click, our advanced AI provides real-time information on how to care for your dog and its compatibility with other pets. Click now to ensure the best life for your canine companion!</p>
                    <button className="btn me-2 btn-multicolor info-buttons" onClick={fetchCareInfo} disabled={isLoadingCareInfo}>
                        {isLoadingCareInfo ? 'Loading...' : 'Cares'}
                    </button>
                    <button className="btn me-2 btn-multicolor info-buttons" onClick={fetchCompatibilityInfo} disabled={isLoadingCompatibilityInfo}>
                        {isLoadingCompatibilityInfo ? 'Loading...' : 'Compatibility'}
                    </button>
                </div>
                {careInfo && (
                    <div className="care-info">
                        <h3>Cares</h3>
                        <p>{careInfo}</p>
                    </div>
                )}
                {compatibilityInfo && (
                    <div className="compatibility-info">
                        <h3>Compatibility</h3>
                        <p>{compatibilityInfo}</p>
                    </div>
                )}
                <h3 className='p-5 ps-0'>Matches</h3>
                <div className="row">
                    {matches.map((match, index) => (
                        <div className="col-md-3 mb-3" key={index}>
                            <div className="d-flex align-items-center">
                                <img src={match.match_pet_photo} alt={match.match_pet_name} className="img-fluid rounded-circle me-2" style={{ width: '50px', height: '50px' }} />
                                <span>{match.match_pet_name}</span>
                                <button className="btn btn-secondary ms-2" onClick={() => navigate(`/chat/${petId}/${match.match_pet_id}`)}>
                                    <i className="fas fa-comments"></i> Chat
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <Link to="/pets" className="btn btn-back mt-3">
                    <i className="fas fa-arrow-left"></i> Back to the list of pets
                </Link>
            </div>
            <div className="modal fade" id="matchModal" tabIndex="-1" aria-labelledby="matchModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content match-modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="matchModalLabel">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {modalTitle === "It's a Match!" && matchedPet ? (
                                <div className="match-container">
                                    <img src={petDetails.profile_photo_url} alt={petDetails.name} className="match-photo" />
                                    <div className="match-heart">❤️</div>
                                    <img src={matchedPet.match_pet_photo} alt={matchedPet.match_pet_name} className="match-photo" />
                                </div>
                            ) : (
                                <div className="notice-content">
                                    <p>{matchMessage}</p>
                                    <i className="fas fa-exclamation-circle notice-icon"></i>
                                </div>
                            )}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
