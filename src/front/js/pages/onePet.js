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
        profile_photo_url: ''
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
    const [isMounted, setIsMounted] = useState(true); // Nuevo estado para manejar el desmontaje del componente

    useEffect(() => {
        setIsMounted(true); // Montar el componente

        const fetchPetDetails = async () => {
            try {
                const pet = await actions.getPetDetails(petId);
                if (isMounted) { // Comprobar si el componente sigue montado
                    setPetDetails({
                        name: pet.name || '',
                        age: pet.age || '',
                        sex: pet.sex || '',
                        pedigree: pet.pedigree || false,
                        description: pet.description || '',
                        photos: pet.photos || [],
                        profile_photo_url: pet.profile_photo_url || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch pet details:", error);
                if (isMounted) { // Comprobar si el componente sigue montado
                    setErrorMessage('Failed to fetch pet details. Please try again.');
                }
            }
        };
        fetchPetDetails();

        return () => {
            setIsMounted(false); // Desmontar el componente
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
                if (photoResponse && photoResponse.photo_url && isMounted) { // Comprobar si photo_url existe y el componente sigue montado
                    setPetDetails(prevDetails => ({
                        ...prevDetails,
                        profile_photo_url: photoResponse.photo_url
                    }));
                }
            }

            if (additionalFiles.length > 0) {
                const additionalPhotosResponse = await actions.uploadPetAdditionalPhotos(petId, additionalFiles);
                if (additionalPhotosResponse && additionalPhotosResponse.photo_urls && isMounted) { // Comprobar si photo_urls existe y el componente sigue montado
                    setPetDetails(prevDetails => ({
                        ...prevDetails,
                        photos: [...prevDetails.photos, ...additionalPhotosResponse.photo_urls.map((url, index) => ({ id: `${Date.now()}-${index}`, url }))]
                    }));
                }
            }

            await actions.updatePet(petId, petDetails);
            if (isMounted) { // Comprobar si el componente sigue montado
                setIsLoading(false);
                setIsEditing({
                    name: false,
                    age: false,
                    sex: false,
                    pedigree: false,
                    description: false,
                });
            }
        } catch (error) {
            if (isMounted) { // Comprobar si el componente sigue montado
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

    return (
        <div className="container">
            <h2>Detalles de la Mascota</h2>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('name')}></i>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('age')}></i>
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
                        <i className="fas fa-edit cursor-pointer" onClick={() => handleEditClick('description')}></i>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2" disabled={isLoading}>
                        {isLoading ? <i className="fas fa-spinner fa-spin"></i> : <><i className="fas fa-save"></i> Guardar Cambios</>}
                    </button>
                </div>
            </form>
            <h3>Fotos Adicionales</h3>
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
                                                Eliminar
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
            <Link to="/private" className="btn btn-secondary mt-3">
                <i className="fas fa-arrow-left"></i> Volver a Private
            </Link>
        </div>
    );
};
