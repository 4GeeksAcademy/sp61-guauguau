import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
        <div className="container">
            <h2>Pet Details</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-4">
                    {petDetails.profile_photo_url && (
                        <img src={petDetails.profile_photo_url} alt="Pet Profile" className="img-thumbnail w-100 mb-3" />
                    )}
                    <input type="file" onChange={handleFileChange} className="form-control mb-2" />
                    <input type="file" onChange={handleAdditionalFilesChange} className="form-control" multiple />
                </div>
                <div className="col-md-8">
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Name:</label>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('name')}></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Breed:</label>
                        {isEditing.breed ? (
                            <input
                                type="string"
                                name="breed"
                                value={petDetails.breed}
                                onChange={handleChange}
                                className="form-control me-2"
                            />
                        ) : (
                            <span className="me-2">{petDetails.breed}</span>
                        )}
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('breed')}></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Age:</label>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('age')}></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Sex:</label>
                        {isEditing.sex ? (
                            <select
                                name="sex"
                                value={petDetails.sex}
                                onChange={handleChange}
                                className="form-control me-2"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        ) : (
                            <span className="me-2">{petDetails.sex}</span>
                        )}
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('sex')}></i>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('pedigree')}></i>
                    </div>
                    <div className="mb-2 d-flex align-items-center">
                        <label className="me-2">Description:</label>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('description')}></i>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" disabled={isLoading}>
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> Save Changes</>}
                    </button>
                </div>
            </form>
            <h3>Additional Photos</h3>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="photos" direction="horizontal">
                    {(provided) => (
                        <div className="row" {...provided.droppableProps} ref={provided.innerRef}>
                            {petDetails.photos.map((photo, index) => (
                                <Draggable key={photo.id} draggableId={photo.id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            className="col-md-3 mb-3"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <img src={photo.url} alt={`Pet ${index}`} className="img-fluid" />
                                            <button
                                                className="btn btn-danger mt-2"
                                                onClick={() => handleDeletePhoto(photo.id)}
                                            >
                                                Delete
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
            <button className="btn btn-secondary me-2" onClick={fetchCareInfo}>
                {isFetchingCareInfo ? (
                    <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                        <div className="wheel"></div>
                        <div className="hamster">
                            <div className="hamster__body">
                                <div className="hamster__head">
                                    <div className="hamster__ear"></div>
                                    <div className="hamster__eye"></div>
                                    <div className="hamster__nose"></div>
                                </div>
                                <div className="hamster__limb hamster__limb--fr"></div>
                                <div className="hamster__limb hamster__limb--fl"></div>
                                <div className="hamster__limb hamster__limb--br"></div>
                                <div className="hamster__limb hamster__limb--bl"></div>
                                <div className="hamster__tail"></div>
                            </div>
                        </div>
                        <div className="spoke"></div>
                    </div>
                ) : (
                    "Care Info"
                )}
            </button>
            {careInfo && (
                <div>
                    <h3>Care Info</h3>
                    <p>{careInfo}</p>
                </div>
            )}
            <button className="btn btn-secondary me-2" onClick={fetchCompatibilityInfo}>
                {isFetchingCompatibilityInfo ? (
                    <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster">
                        <div className="wheel"></div>
                        <div className="hamster">
                            <div className="hamster__body">
                                <div className="hamster__head">
                                    <div className="hamster__ear"></div>
                                    <div className="hamster__eye"></div>
                                    <div className="hamster__nose"></div>
                                </div>
                                <div className="hamster__limb hamster__limb--fr"></div>
                                <div className="hamster__limb hamster__limb--fl"></div>
                                <div className="hamster__limb hamster__limb--br"></div>
                                <div className="hamster__limb hamster__limb--bl"></div>
                                <div className="hamster__tail"></div>
                            </div>
                        </div>
                        <div className="spoke"></div>
                    </div>
                ) : (
                    "Compatibility Info"
                )}
            </button>
            {compatibilityInfo && (
                <div>
                    <h3>Compatibility Info</h3>
                    <p>{compatibilityInfo}</p>
                </div>
            )}
            <Link to="/private" className="btn btn-primary mt-3">
                Back to Private
            </Link>
            <h3>Likes Received</h3>
            <ul>
                {petDetails.likes.map((like, index) => (
                    <li key={index}>
                        <Link to={`/singlepet/${like.liker_pet_id}`}>
                            {like.liker_pet_photo && (
                                <img
                                    src={like.liker_pet_photo}
                                    alt={`${like.liker_pet_name} profile`}
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                            )}
                            {like.liker_pet_name} likes you
                        </Link>
                    </li>
                ))}
            </ul>
            <h3>Matches</h3>
            <ul>
                {petDetails.matches.map((match, index) => (
                    <li key={index} className="d-flex align-items-center">
                        <Link to={`/singlepet/${match.match_pet_id}`} className="me-2">
                            {match.match_pet_photo && (
                                <img
                                    src={match.match_pet_photo}
                                    alt={`${match.match_pet_name} profile`}
                                    className="rounded-circle me-2"
                                    style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                                />
                            )}
                            {match.match_pet_name}
                        </Link>
                        <Link to={`/chat/${match.match_id}`} className="btn btn-primary">Chat</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
