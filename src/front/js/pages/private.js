import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Navigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState(store.ownerDescription || '');
    const [isEditingDescription, setIsEditingDescription] = useState(false); // Estado para controlar la edición de la descripción

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                await actions.verifyToken();
                await actions.fetchOwnerPets();
                setDescription(store.ownerDescription || ''); // Inicializar la descripción desde el estado global
            }
            setLoading(false);
        };

        fetchData();
    }, [store.ownerDescription]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            await actions.uploadProfilePicture(file);
            setFile(null);  // Reset file input after upload
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSaveDescription = async () => {
        await actions.updateOwnerDescription(description);
        setIsEditingDescription(false); // Desactivar el modo de edición después de guardar
    };

    const handleEditDescriptionClick = () => {
        setIsEditingDescription(true); // Activar el modo de edición
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!store.auth) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center gap-3 p-4">
            <div className="form-container">
                <h1><span style={{ fontWeight: "bolder" }}>Welcome</span> {store.owner.name}</h1>
                <h3>This is your private area</h3>
                <div className="row align-items-center mb-4">
                    <div className="col-md-3 text-center">
                        {store.profilePictureUrl && (
                            <img src={store.profilePictureUrl} alt="Profile" className="img-thumbnail profile-picture" />
                        )}
                    </div>
                    <div className="col-md-9">
                        <h3 className="title">About Me</h3>
                        <p>This is your personal space where you can manage your pets and update your profile information.</p>
                        {isEditingDescription ? (
                            <>
                                <textarea 
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    className="form-control mb-2"
                                    placeholder="Add a description about yourself"
                                />
                                <button onClick={handleSaveDescription} className="primary-btn2">Save Description</button>
                            </>
                        ) : (
                            <div className="d-flex align-items-center">
                                <span className="me-2">{description || "No description available"}</span>
                                <i className="fas fa-edit cursor-pointer" onClick={handleEditDescriptionClick}></i>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload} className="primary-btn2">Upload Profile Picture</button>
                </div>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <Link to="/petSignUp">
                        <button className="primary-btn2 m-2 mt-3 ">Add new pet</button>
                    </Link>
                </div>
                <div className="container mt-4">
                    <h3 className="title">Your Pets</h3>
                    {store.ownerPets && store.ownerPets.length > 0 ? (
                        <div className="row">
                            {store.ownerPets.map(pet => (
                                <div key={pet.id} className="col-md-12">
                                    <div className="card mb-4">
                                        {pet.photo && (
                                            <img src={pet.photo} alt={pet.name} className="card-img-top" />
                                        )}
                                        <div className="card-body-container">
                                            <div className="card-body">
                                                <h5 className="card-title">{pet.name}</h5>
                                                <p className="card-text">Breed: {pet.breed}</p>
                                                <p className="card-text">Age: {pet.age}</p>
                                                <p className="card-text">Sex: {pet.sex}</p>
                                                <p className="card-text">Pedigree: {pet.pedigree ? 'Yes' : 'No'}</p>
                                                <div className="buttons-container">
                                                    <Link to={`/pet/${pet.id}`} className="primary-btn primary-btn2">View Details</Link>
                                                    <button className="button" onClick={() => actions.fetchDeletePet(pet.id)}>
                                                        <svg viewBox="0 0 448 512" className="svgIcon">
                                                            <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>You have no pets.</p>
                    )}
                </div>
            </div>
            <h4 className="signup pe-2">Do you want to exit?</h4>
            <button className="Btn ms-2" onClick={() => actions.logout()}>
                    <div className="sign">
                        <svg viewBox="0 0 512 512">
                            <path
                                d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                            ></path>
                        </svg>
                    </div>
                    <div className="text">Logout</div>
            </button>
            <div className="login-redirect">
                <Link to="/">Back home</Link>
            </div>
        </div>
    );
};

Private.propTypes = {
    match: PropTypes.object
};
