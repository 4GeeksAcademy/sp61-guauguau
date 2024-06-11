import "../../styles/pets.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { Context } from "../store/appContext";
import { useSpring, animated } from "react-spring";
import { PetsFinder } from "./finder";

export const Pets = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [index, setIndex] = useState(0);
    const [like, setLike] = useState(false);
    const [previousIndex, setPreviousIndex] = useState(0);
    const [selectedPetId, setSelectedPetId] = useState(null);
    const [selectedPet, setSelectedPet] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isComponentMounted, setIsComponentMounted] = useState(true);
    const [matchMessage, setMatchMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [matchedPet, setMatchedPet] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await actions.fetchPets();
            if (isComponentMounted) {
                setIsLoading(false);
            }
        };

        fetchData();

        return () => {
            setIsComponentMounted(false);
        };
    }, [, isComponentMounted]);

    const handleChangeIndex = (newIndex) => {
        if (newIndex >= store.pets.length) {
            setIndex(0); // Reset to first card if we reach the end
        } else if (newIndex < 0) {
            setIndex(store.pets.length - 1); // Go to last card if we go before the start
        } else {
            setIndex(newIndex);
        }
    };

    const handleNext = () => {
        handleChangeIndex(index + 1);
    };

    const handlePrevious = () => {
        handleChangeIndex(index - 1);
    };

    const handleLike = async () => {
        if (!store.auth) {
            setModalTitle("Notice");
            setMatchMessage("You need to be logged in to like a pet.");
            setShowModal(true);
            var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
            myModal.show();
            return;
        }

        setLike(true);
        setTimeout(() => {
            setLike(false);
            handleChangeIndex(index + 1);
        }, 1000); // Adjust the delay as needed

        if (!selectedPetId) {
            setModalTitle("Notice");
            setMatchMessage("You need to select one of your pets to like another pet.");
            setShowModal(true);
            var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
            myModal.show();
            return;
        }

        const result = await actions.likePet(selectedPetId, store.pets[index].id);
        if (result.match) {
            setModalTitle("Match");
            setMatchedPet(store.pets[index]);
            setMatchMessage("It's a match!");
            setShowModal(true);
            var myModal = new window.bootstrap.Modal(document.getElementById('matchModal'));
            myModal.show();
        }
    };

    const likeAnimation = useSpring({
        opacity: like ? 1 : 0,
        transform: like ? 'scale(1.2)' : 'scale(1)',
        config: { tension: 300, friction: 10 }
    });

    const handleSwitching = (currentIndex, type) => {
        if (type === 'end') {
            if (currentIndex > previousIndex) {
                handleLike(); // Swiped right
            } else if (currentIndex < previousIndex) {
                handleNext(); // Swiped left
            }
            setPreviousIndex(currentIndex);
        }
    };

    const handlePetSelection = (e) => {
        const petId = e.target.value;
        setSelectedPetId(petId);
        const pet = store.owner.pets.find(p => p.id === parseInt(petId));
        setSelectedPet(pet);
    };

    const handleToggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    const renderDescription = (description) => {
        if (!description) return ""; // Handle null or undefined descriptions
        if (description.length <= 200) {
            return description;
        } else if (showFullDescription) {
            return (
                <>
                    {description}
                    <span className="show-more" onClick={handleToggleDescription}> show less</span>
                </>
            );
        } else {
            return (
                <>
                    {description.slice(0, 200)}...
                    <span className="show-more" onClick={handleToggleDescription}> show more</span>
                </>
            );
        }
    };

    return (
        <>
        
        <div className="pets-container">
            <h1 className="my-4">Find Your Perfect Pet</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {store.auth && (
                        <div className="select-pet">
                            <select
                                className="form-select mb-3 narrow-select"
                                value={selectedPetId || ''}
                                onChange={handlePetSelection}
                            >
                                <option value="" disabled>Select your pet</option>
                                {store.owner && store.owner.pets && store.owner.pets.map((pet) => (
                                    <option key={pet.id} value={pet.id}>{pet.name}</option>
                                ))}
                            </select>
                            {selectedPet && (
                            <div className="selected-pet-info">
                                {selectedPet.profile_photo_url && (
                                <img src={selectedPet.profile_photo_url} alt={selectedPet.name} className="selected-pet-photo" />
                                )}
        <span>{selectedPet.name}</span>
    </div>
)}
                        </div>
                    )}
                    <div className="swipe-container">
                        {store.pets && store.pets.length > 0 ? (
                            <>
                                <div className="navigation-arrows">
                                    <div className="arrow left-arrow" onClick={handlePrevious}>
                                        <i className="fas fa-arrow-left"></i>
                                    </div>
                                    <div className="arrow right-arrow" onClick={handleNext}>
                                        <i className="fas fa-arrow-right"></i>
                                    </div>
                                </div>
                                <SwipeableViews
                                    index={index}
                                    onChangeIndex={handleChangeIndex}
                                    enableMouseEvents
                                    resistance
                                    onSwitching={handleSwitching}
                                >
                                    {store.pets.map((pet, idx) => (
                                        <div key={idx} className="card-container">
                                            <div className="card">
                                                {pet.profile_photo_url && (
                                                    <img src={pet.profile_photo_url} className="card-img-top" alt={pet.name} />
                                                )}
                                                <div className="card-body">
                                                    <h2 className="card-title">
                                                        <Link to={`/singlepet/${pet.id}`}>{pet.name}</Link>
                                                    </h2>
                                                    <p className="card-text">{pet.breed} • {pet.sex} • {pet.age} years old</p>
                                                    <p className="card-text">Pedigree: {pet.pedigree ? "Yes" : "No"}</p>
                                                    <p className="card-text">City: {pet.owner_city}</p> {/* Mostrar la ciudad del propietario */}
                                                </div>
                                                {like && (
                                                    <animated.div className="like-icon" style={likeAnimation}>
                                                        ❤️
                                                    </animated.div>
                                                )}
                                                <div className="card-description">
                                                    <p>{renderDescription(pet.description)}</p>
                                                    <div className="additional-photos">
                                                        {pet.photos && pet.photos.map((photo, photoIdx) => (
                                                            <img key={photoIdx} src={photo.url} alt={`Pet ${photoIdx}`} className="additional-photo" />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="card-footer p-3">
                                                    <button onClick={handleNext} className="next-button pets-button"><i className="fas fa-times"></i></button>
                                                    <button onClick={handleLike} className="like-button pets-button"><i className="fas fa-heart"></i></button>
                                                    <Link to={`/singlepet/${pet.id}`} className="view-button pets-button"><i className="fas fa-eye"></i></Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </SwipeableViews>
                            </>
                        ) : (
                            <p>No pets available</p>
                        )}
                    </div>
                </>
            )}
            <div className="modal fade" id="matchModal" tabIndex="-1" aria-labelledby="matchModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content match-modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="matchModalLabel">{modalTitle}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {modalTitle === "Match" && matchedPet && selectedPet ? (
                                <div className="match-container">
                                    <img src={selectedPet.profile_photo_url} alt={selectedPet.name} className="match-photo" />
                                    <div className="match-heart">❤️</div>
                                    <img src={matchedPet.profile_photo_url} alt={matchedPet.name} className="match-photo" />
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
        <PetsFinder/>
        
    </>
    );
};
