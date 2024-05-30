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
                    <p className="signup pe-2">Do you want to exit?</p>
                    <Link to="/">
                        <button className="btn btn-danger m-2" onClick={() => actions.logout()}>Log Out</button>
                    </Link>
                    <Link to="/petSignUp">
                        <button className="btn btn-warning m-2" onClick={() => actions.addPet()}>Add new pet</button>
                    </Link>
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
