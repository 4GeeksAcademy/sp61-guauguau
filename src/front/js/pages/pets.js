import "../../styles/pets.css";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import SwipeableViews from "react-swipeable-views";
import { Context } from "../store/appContext";
import { useSpring, animated } from "react-spring";

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

    const handleLike = async () => {
        setLike(true);
        setTimeout(() => {
            setLike(false);
            handleChangeIndex(index + 1);
        }, 1000); // Adjust the delay as needed

        try {
            if (store.auth) {
                if (!selectedPetId) {
                    alert("You need to select one of your pets to like another pet.");
                    return;
                }
                const result = await actions.likePet(selectedPetId, store.pets[index].id);
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
                                    <img src={selectedPet.profile_photo_url} alt={selectedPet.name} className="selected-pet-photo" />
                                    <span>{selectedPet.name}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <div className="swipe-container">
                        {store.pets && store.pets.length > 0 ? (
                            <>
                                <div className="navigation-arrows">
                                    <div className="arrow left-arrow">
                                        <i className="fas fa-arrow-left"></i>
                                        <span className="arrow-text">dislike</span>
                                    </div>
                                    <div className="arrow right-arrow">
                                        <span className="arrow-text">like</span>
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
        </div>
    );
};
