import React, { useState, useContext, useEffect } from "react";
import GeocodingService from "./GeocodingService";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";


const mapContainerStyle = {
    width: "100%",
    height: "400px"
};


const center = {
    lat: 40.4169473,
    lng: -3.7035285
};


export const OwnerSignUp = () => {
    const { actions } = useContext(Context);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        latitude: center.lat,
        longitude: center.lng
    });


    const [successMessage, setSuccessMessage] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);


    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GEOCODING_API_KEY
    });


    useEffect(() => {
        if (formData.latitude && formData.longitude) {
            getAddressFromCoordinates(formData.latitude, formData.longitude);
        }
    }, [formData.latitude, formData.longitude]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };


    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });


        if (name === "address") {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }


            setTypingTimeout(
                setTimeout(async () => {
                    try {
                        const data = await GeocodingService.getCoordinates(value);
                        if (data.results && data.results.length > 0) {
                            const location = data.results[0].geometry.location;
                            setFormData((prevState) => ({
                                ...prevState,
                                address: value,
                                latitude: location.lat,
                                longitude: location.lng
                            }));
                        }
                    } catch (error) {
                        console.error("Error during geocoding:", error);
                    }
                }, 500) // Ajusta el retraso según sea necesario (500 ms en este caso)
            );
        }
    };


    const handleMarkerDragEnd = async (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setFormData({
            ...formData,
            latitude: lat,
            longitude: lng
        });
    };


    const getAddressFromCoordinates = async (lat, lng) => {
        try {
            const data = await GeocodingService.getCoordinates(`${lat},${lng}`);
            if (data.results && data.results.length > 0) {
                setFormData((prevState) => ({
                    ...prevState,
                    address: data.results[0].formatted_address
                }));
            }
        } catch (error) {
            console.error("Error fetching address from coordinates:", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.signUp(formData.name, formData.email, formData.password, formData.address, formData.latitude, formData.longitude);
            setSuccessMessage("Owner created successfully!");
            setFormData({
                name: "",
                email: "",
                password: "",
                address: "",
                latitude: center.lat,
                longitude: center.lng
            });
        } catch (error) {
            console.error("Error signing up:", error);
        }
    };
    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <section className="section section-full section-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <form className="form-styled" onSubmit={handleSubmit}>
                            <h1 className="text-center px-3 mb-4">Sign up as a GuauuGuauu Owner!</h1>
                            <h5 className="text-center text-muted mb-5">Please fill out the form to sign up.</h5>
                                {successMessage && (
                                    <div className="alert alert-success" role="alert">
                                        {successMessage}
                                    </div>
                                )}
                                <div className="form-group position-relative">
                                    <label htmlFor="name" className="form-label">Name*</label>
                                    <div className="input-icon d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16">
                                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                        </svg>
                                        <input 
                                            type="text" 
                                            className="form-control" 
                                            id="name" 
                                            name="name" 
                                            placeholder="Your name"
                                            value={formData.name} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                    </div>
                                </div>    
                                <div className="form-group position-relative">
                                    <label htmlFor="email" className="form-label">Email*</label>
                                    <div className="input-icon d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                                            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                        </svg>
                                    <input 
                                        type="email" 
                                        className="form-control mb-3" 
                                        id="email" 
                                        name="email" 
                                        placeholder="Enter your email"
                                        value={formData.email} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                    </div>
                                </div>
                                <div className="form-group position-relative">
                                    <label htmlFor="password" className="form-label">Password*</label>
                                    <div className="input-icon d-flex align-items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
                                            <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                        </svg>
                                        <input 
                                            type={passwordVisible ? "text" : "password"} 
                                            className="form-control mb-3" 
                                            id="password" 
                                            name="password" 
                                            placeholder="Create your password"
                                            value={formData.password} 
                                            onChange={handleChange} 
                                            required 
                                        />
                                        <button type="button" id="toggle-password" onClick={togglePasswordVisibility} className="btn btn-link toggle-password">
                                            <i className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`} id="toggle-icon"></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="form-group position-relative">
                                    <label htmlFor="address" className="form-label">Address</label>
                                    <div className="input-icon d-flex align-items-center">
                                        <i className="fa fa-map-location-dot me-2"></i>
                                        <input 
                                            type="text" 
                                            className="form-control mb-3" 
                                            id="address" 
                                            name="address" 
                                            placeholder="Enter your address"
                                            value={formData.address} 
                                            onChange={handleAddressChange} 
                                            required 
                                        />  
                                    </div>
                                </div>
                                <div className="form-group position-relative">
                                    <label htmlFor="latitude" className="form-label">Latitude</label>
                                    <input 
                                        type="text" 
                                        className="form-control mb-3" 
                                        id="latitude" 
                                        name="latitude" 
                                        value={formData.latitude} 
                                        readOnly 
                                    />
                                </div>
                                <div className="form-group position-relative">
                                    <label htmlFor="longitude" className="form-label">Longitude</label>
                                    <input 
                                        type="text" 
                                        className="form-control mb-3" 
                                        id="longitude" 
                                        name="longitude" 
                                        value={formData.longitude} 
                                        readOnly 
                                    />
                                </div>
                                <div className="form-group position-relative">
                                    <GoogleMap
                                        mapContainerStyle={mapContainerStyle}
                                        zoom={14}
                                        center={{ lat: formData.latitude, lng: formData.longitude }}
                                    >
                                        <Marker
                                            position={{ lat: formData.latitude, lng: formData.longitude }}
                                            draggable={true}
                                            onDragEnd={handleMarkerDragEnd}
                                        />
                                    </GoogleMap>
                                </div>  
                            <div className="form-row align-items-center">
                                <div className="col-md-auto">
                                    <div className="custom-control custom-checkbox mb-3 mb-md-0">
                                        <input type="checkbox" name="checkbox"  className="custom-control-input mr-2" id="sign-in-checkbox"></input>
                                        <label className="custom-control-label d-flex align-items-center" htmlFor="sign-in-checkbox">
                                            <p className="mb-0 me-1">I agree to</p>
                                            <a href="#">terms and conditions</a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="button-group">
                                <button type="submit" className="primary-btn primary-btn2 mt-2">Submit</button>   
                            </div>
                            <div className="login-redirect">
                                <Link to="/home">Back home</Link>
                            </div>
                            <div className="login-redirect">
                                <p>Already have an account? <Link to="/login">Log In Here</Link></p>
                            </div>
                         </form>      
                    </div>
                </div>
            </div>
        </section>
    );
};
