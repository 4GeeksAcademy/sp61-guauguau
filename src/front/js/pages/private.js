import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Navigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/singlepet.css";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState(store.ownerDescription || '');
    const [isEditingDescription, setIsEditingDescription] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const ownerEmail = store.email;
            if (ownerEmail) {
                await actions.fetchOwnerPets();
                setDescription(store.ownerDescription || '');
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
            setFile(null);
        }
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSaveDescription = async () => {
        await actions.updateOwnerDescription(description);
        setIsEditingDescription(false);
    };

    const handleEditDescriptionClick = () => {
        setIsEditingDescription(true);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!store.auth) {
        return <Navigate to="/" />;
    }

    return (
        <div className="container single-pet-container">
            <div className="pet-card">
                <div className="pet-card-header">
                    <p><span style={{ fontWeight: "bolder" }}>Welcome</span> {store.email}</p>
                    <p className="title">This is your private area</p>
                    <div className="owner-info">
                        {store.profilePictureUrl && (
                            <img src={store.profilePictureUrl} alt="Profile" className="owner-photo" />
                        )}
                        <input type="file" onChange={handleFileChange} className="form-control mb-2" />
                        <button onClick={handleUpload} className="btn btn-primary">Upload Profile Picture</button>
                    </div>
                    <div className="detail-item-description">
                        <h3>About Me</h3>
                        <p>This is your personal space where you can manage your pets and update your profile information.</p>
                        <p><strong>City:</strong> {store.city}</p>
                        {isEditingDescription ? (
                            <>
                                <textarea 
                                    value={description}
                                    onChange={handleDescriptionChange}
                                    className="form-control mb-2"
                                    placeholder="Add a description about yourself"
                                />
                                <button onClick={handleSaveDescription} className="btn btn-primary">Save Description</button>
                            </>
                        ) : (
                            <div className="d-flex align-items-center">
                                <span className="me-2">{description || "No description available"}</span>
                                <i className="fas fa-edit cursor-pointer" onClick={handleEditDescriptionClick}></i>
                            </div>
                        )}
                    </div>
                </div>
                <div className="additional-section">
                    <Link to="/petSignUp" className="btn btn-warning m-2">Add new pet</Link>
                    <p className="signup pe-2">Do you want to exit?</p>
                    <Link to="/" className="btn btn-danger m-2" onClick={() => actions.logout()}>Log Out</Link>
                </div>
            </div>
            <div className="additional-section">
                <h3>Your Pets</h3>
                {store.ownerPets && store.ownerPets.length > 0 ? (
                    <div className="row">
                        {store.ownerPets.map(pet => (
                            <div key={pet.id} className="col-md-4">
                                <div className="card mb-4">
                                    {pet.profile_photo_url && (
                                        <img src={pet.profile_photo_url} alt={pet.name} className="card-img-top" />
                                    )}
                                    <div className="card-body">
                                        <h5 className="card-title">{pet.name}</h5>
                                        <p className="card-text">Breed: {pet.breed}</p>
                                        <p className="card-text">Age: {pet.age}</p>
                                        <p className="card-text">Sex: {pet.sex}</p>
                                        <p className="card-text">Pedigree: {pet.pedigree ? 'Yes' : 'No'}</p>
                                        <div className="d-flex justify-content-between">
                                            <Link to={`/pet/${pet.id}`} className="btn btn-primary">View Details</Link>
                                            <button className="btn btn-danger" onClick={() => actions.fetchDeletePet(pet.id)}>Delete</button>
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
            <Link to="/" className="btn btn-primary btn-lg" role="button">Back home</Link>
        </div>
    );
};

Private.propTypes = {
    match: PropTypes.object
};
