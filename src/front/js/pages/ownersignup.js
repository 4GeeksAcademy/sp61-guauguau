import React, { useState, useContext, useEffect } from "react";
import GeocodingService from "./GeocodingService";
import { Context } from "../store/appContext";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const mapContainerStyle = {
    width: "100%",
    height: "400px"
};

const center = {
    lat: 40.712776,
    lng: -74.005974
};

export const OwnerSignUp = () => {
    const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        latitude: center.lat,
        longitude: center.lng
    });

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

    const handleAddressChange = async (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        if (name === "address") {
            try {
                const data = await GeocodingService.getCoordinates(value);
                if (data.results && data.results.length > 0) {
                    const location = data.results[0].geometry.location;
                    setFormData({
                        ...formData,
                        address: value,
                        latitude: location.lat,
                        longitude: location.lng
                    });
                }
            } catch (error) {
                console.error("Error during geocoding:", error);
            }
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
                setFormData({
                    ...formData,
                    address: data.results[0].formatted_address
                });
            }
        } catch (error) {
            console.error("Error fetching address from coordinates:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.signUp(formData.name, formData.email, formData.password, formData.address, formData.latitude, formData.longitude);
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div className="container">
            <h2>Owner Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                        type="email" 
                        className="form-control" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        id="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleAddressChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="latitude" className="form-label">Latitude</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="latitude" 
                        name="latitude" 
                        value={formData.latitude} 
                        readOnly 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="longitude" className="form-label">Longitude</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="longitude" 
                        name="longitude" 
                        value={formData.longitude} 
                        readOnly 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            <div className="mt-4">
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
        </div>
    );
};
