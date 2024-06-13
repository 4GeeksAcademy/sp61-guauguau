import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import "../../styles/singlepet.css"; // Import the same CSS for consistent styling

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
        profile_photo_url: '',
        breed: '',
        likes: [],
        matches: []
    });
    const [isEditing, setIsEditing] = useState({
        name: false,
        age: false,
        sex: false,
        pedigree: false,
        description: false,
    });
    const [file, setFile] = useState(null);
    const [additionalFiles, setAdditionalFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [careInfo, setCareInfo] = useState("");
    const [compatibilityInfo, setCompatibilityInfo] = useState("");
    const [isFetchingCareInfo, setIsFetchingCareInfo] = useState(false);
    const [isFetchingCompatibilityInfo, setIsFetchingCompatibilityInfo] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        const fetchPetDetails = async () => {
            try {
                const pet = await actions.getPetDetails(petId);
                const likes = await actions.fetchPetLikes(petId);
                const matches = await actions.fetchPetMatches(petId);
                if (isMounted) {
                    setPetDetails({
                        name: pet.name || '',
                        age: pet.age || '',
                        sex: pet.sex || '',
                        pedigree: pet.pedigree || false,
                        description: pet.description || '',
                        photos: pet.photos || [],
                        profile_photo_url: pet.profile_photo_url || '',
                        breed: pet.breed || '',
                        likes: likes || [],
                        matches: matches || []
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

    const handleChange = e => {
        const { name, value, type, checked } = e.target;
        setPetDetails(prevDetails => ({
            ...prevDetails,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const handleAdditionalFilesChange = e => {
        setAdditionalFiles(e.target.files);
    };

    const handleEditClick = field => {
        setIsEditing(prevEditing => ({
            ...prevEditing,
            [field]: !prevEditing[field]
        }));
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (file) {
                const photoResponse = await actions.uploadPetPhoto(petId, file);
                if (photoResponse && photoResponse.photo_url && isMounted) {
                    setPetDetails(prevDetails => ({
                        ...prevDetails,
                        profile_photo_url: photoResponse.photo_url
                    }));
                }
            }

            if (additionalFiles.length > 0) {
                const additionalPhotosResponse = await actions.uploadPetAdditionalPhotos(petId, additionalFiles);
                if (additionalPhotosResponse && additionalPhotosResponse.photo_urls && isMounted) {
                    setPetDetails(prevDetails => ({
                        ...prevDetails,
                        photos: [...prevDetails.photos, ...additionalPhotosResponse.photo_urls.map((url, index) => ({ id: `${Date.now()}-${index}`, url }))]
                    }));
                }
            }

            await actions.updatePet(petId, petDetails);
            if (isMounted) {
                setIsLoading(false);
                setIsEditing({
                    name: false,
                    breed: false,
                    age: false,
                    sex: false,
                    pedigree: false,
                    description: false,
                });
            }
        } catch (error) {
            if (isMounted) {
                setIsLoading(false);
                setErrorMessage('Failed to update pet or upload photo. Please try again.');
            }
        }
    };

    const handleOnDragEnd = async (result) => {
        if (!result.destination) return;
        const items = Array.from(petDetails.photos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPetDetails({ ...petDetails, photos: items });

        const photoOrders = items.map((photo, index) => ({
            id: photo.id,
            order: index
        }));
        try {
            await actions.updatePhotoOrder(photoOrders);
        } catch (error) {
            console.error("Error updating photo order:", error);
        }
    };

    const handleDeletePhoto = async (photoId) => {
        try {
            await actions.deletePhoto(photoId);
            setPetDetails(prevDetails => ({
                ...prevDetails,
                photos: prevDetails.photos.filter(photo => photo.id !== photoId)
            }));
        } catch (error) {
            console.error('Error deleting photo:', error);
            setErrorMessage('Failed to delete photo. Please try again.');
        }
    };

    const fetchCareInfo = async () => {
        setIsFetchingCareInfo(true);
        try {
            const careInfo = await actions.fetchCuidados(petDetails.breed);
            setCareInfo(careInfo);
        } catch (error) {
            console.error("Error fetching care info:", error);
        } finally {
            setIsFetchingCareInfo(false);
        }
    };

    const fetchCompatibilityInfo = async () => {
        setIsFetchingCompatibilityInfo(true);
        try {
            const compatibilityInfo = await actions.fetchCompatibilidad(petDetails.breed);
            setCompatibilityInfo(compatibilityInfo);
        } catch (error) {
            console.error("Error fetching compatibility info:", error);
        } finally {
            setIsFetchingCompatibilityInfo(false);
        }
    };

    return (
        <div className="container single-pet-container">
            <div className="pet-card">
                <div className="pet-card-header">
                    <h1>{petDetails.name}, {petDetails.age} years</h1>
                    {petDetails.profile_photo_url && (
                        <img src={petDetails.profile_photo_url} alt="Pet Profile" className="pet-profile-photo" />
                    )}
                    <input type="file" onChange={handleFileChange} className="form-control mb-2 " />
                    <input type="file" onChange={handleAdditionalFilesChange} className="form-control" multiple />
                    <h3>Additional Photos</h3>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="photos" direction="horizontal">
                            {(provided) => (
                                <div className="additional-photos" {...provided.droppableProps} ref={provided.innerRef}>
                                    {petDetails.photos.map((photo, index) => (
                                        <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className="additional-photo"
                                                >
                                                    <img src={photo.url} alt={`Pet ${index}`} className="img-fluid" />
                                                    <button
                                                        className="btn mt-2 delete-button"
                                                        onClick={() => handleDeletePhoto(photo.id)}
                                                    >
                                                        <i className="fa-solid fa-xmark"></i>
                                                    </button>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
                <form onSubmit={handleSubmit} className="onepet-form">
                    <h1>Edit Pet Details</h1>
                    {errorMessage && <p className="text-danger">{errorMessage}</p>}
                    <div className="pet-info-container">
                        <div className="detail-item">
                            <label>Name:</label>
                            {isEditing.name ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={petDetails.name}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                <span>{petDetails.name}</span>
                            )}
                            <i className="fas fa-edit cursor-pointer ms-3" onClick={() => handleEditClick('name')}></i>
                        </div>
                        <div className="detail-item">
                            <label>Breed:</label>
                            {isEditing.breed ? (
                                <input
                                    type="text"
                                    name="breed"
                                    value={petDetails.breed}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                <span>{petDetails.breed}</span>
                            )}
                            <i className="fas fa-edit cursor-pointer ms-3" onClick={() => handleEditClick('breed')}></i>
                        </div>
                        <div className="detail-item">
                            <label>Age:</label>
                            {isEditing.age ? (
                                <input
                                    type="number"
                                    name="age"
                                    value={petDetails.age}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                <span>{petDetails.age}</span>
                            )}
                            <i className="fas fa-edit cursor-pointer ms-3" onClick={() => handleEditClick('age')}></i>
                        </div>
                        <div className="detail-item">
                            <label>Sex:</label>
                            {isEditing.sex ? (
                                <select
                                    name="sex"
                                    value={petDetails.sex}
                                    onChange={handleChange}
                                    className="form-control"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : (
                                <span>{petDetails.sex}</span>
                            )}
                            <i className="fas fa-edit cursor-pointer ms-3" onClick={() => handleEditClick('sex')}></i>
                        </div>
                        <div className="detail-item">
                            <label>Pedigree:</label>
                            {isEditing.pedigree ? (
                                <input
                                    type="checkbox"
                                    name="pedigree"
                                    checked={petDetails.pedigree}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                            ) : (
                                <span>{petDetails.pedigree ? 'Sí' : 'No'}</span>
                            )}
                            <i className="fas fa-edit cursor-pointer ms-3" onClick={() => handleEditClick('pedigree')}></i>
                        </div>
                        <div className="detail-item-description">
                            <label>Description:</label>
                            {isEditing.description ? (
                                <textarea
                                    name="description"
                                    value={petDetails.description}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            ) : (
                                <span>{petDetails.description}</span>
                            )}
                            <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('description')}></i>
                        </div>
                        <button type="submit" className="btn btn-primary mt-2 btn-save-changes" disabled={isLoading}>
                            {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>
            <div className="additional-section">
                <div className="info-buttons">
                    <h1>Discover everything about your furry friend's care and compatibility!</h1>
                    <p className="p-3">With just one click, our advanced AI provides real-time information on how to care for your dog and its compatibility with other pets. Click now to ensure the best life for your canine companion!</p>
                    <button className="btn me-2 btn-multicolor info-buttons" onClick={fetchCareInfo} disabled={isFetchingCareInfo}>
                        {isFetchingCareInfo ? 'Loading...' : 'Cares'}
                    </button>
                    <button className="btn me-2 btn-multicolor info-buttons" onClick={fetchCompatibilityInfo} disabled={isFetchingCompatibilityInfo}>
                        {isFetchingCompatibilityInfo ? 'Loading...' : 'Compatibility'}
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
                <Link to="/private" className="btn btn-back mt-3">
                    <i className="fas fa-arrow-left"></i> Back to Private
                </Link>
                <h3 className="p-5 ps-0">Likes Received</h3>
                <div className="row">
                    {petDetails.likes.map((like, index) => (
                        <div className="col-md-3 mb-3" key={index}>
                            <div className="d-flex align-items-center">
                                {like.liker_pet_photo && (
                                    <img
                                        src={like.liker_pet_photo}
                                        alt={`${like.liker_pet_name} profile`}
                                        className="rounded-circle me-2"
                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                    />
                                )}
                                <Link to={`/singlepet/${like.liker_pet_id}`}>
                                    {like.liker_pet_name} likes you
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                <h3 className="p-5 ps-0">Matches</h3>
                <div className="row">
                    {petDetails.matches.map((match, index) => (
                        <div className="col-md-3 mb-3" key={index}>
                            <div className="d-flex align-items-center">
                                {match.match_pet_photo && (
                                    <img
                                        src={match.match_pet_photo}
                                        alt={`${match.match_pet_name} profile`}
                                        className="img-fluid rounded-circle me-2"
                                        style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                    />
                                )}
                                <Link to={`/singlepet/${match.match_pet_id}`} className="me-2">
                                    {match.match_pet_name}
                                </Link>
                                <Link to={`/chat/${match.match_id}`} className="btn btn-secondary">
                                    Chat
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
