import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Navigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Private = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            actions.verifyToken();
            actions.fetchOwnerPets();  // Fetch owner's pets when component mounts
        }
        setLoading(false);
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (file) {
            await actions.uploadProfilePicture(file);
            setFile(null);  // Reset file input after upload
        }
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
                <p><span style={{ fontWeight: "bolder" }}>Welcome</span> {store.email}</p>
                <p className="title">This is your private area</p>
                <p className="title">Profile</p>
                <div>
                    {store.profilePictureUrl && (
                        <img src={store.profilePictureUrl} alt="Profile" className="img-thumbnail" />
                    )}
                </div>
                <div>
                    <input type="file" onChange={handleFileChange} />
                    <button onClick={handleUpload}>Upload Profile Picture</button>
                </div>
                <div className="container d-flex flex-column justify-content-center align-items-center">
                    <Link to="/petSignUp">
                        <button className="btn btn-warning m-2">Add new pet</button>
                    </Link>
                    <p className="signup pe-2">Do you want to exit?</p>
                    <Link to="/">
                        <button className="btn btn-danger m-2" onClick={() => actions.logout()}>Log Out</button>
                    </Link>
                </div>
                <div className="container mt-4">
                    <h3>Your Pets</h3>
                    {store.ownerPets && store.ownerPets.length > 0 ? (
                        <div className="row">
                            {store.ownerPets.map(pet => (
                                <div key={pet.id} className="col-md-4">
                                    <div className="card mb-4">
                                        {pet.photo && (
                                            <img src={pet.photo} alt={pet.name} className="card-img-top" />
                                        )}
                                        <div className="card-body">
                                            <h5 className="card-title">{pet.name}</h5>
                                            <p className="card-text">Breed: {pet.breed}</p>
                                            <p className="card-text">Age: {pet.age}</p>
                                            <p className="card-text">Sex: {pet.sex}</p>
                                            <p className="card-text">Pedigree: {pet.pedigree ? 'Yes' : 'No'}</p>
                                            <Link to={`/pet/${pet.id}`} className="btn btn-primary">View Details</Link>
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
            <Link to="/">
                <span className="btn btn-primary btn-lg" role="button">Back home</span>
            </Link>
        </div>
    );
};

Private.propTypes = {
    match: PropTypes.object
};
