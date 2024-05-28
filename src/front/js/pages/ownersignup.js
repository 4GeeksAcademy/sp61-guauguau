import React, { useState } from "react";
import GeocodingService from "./GeocodingService";

export const OwnerSignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        address: "",
        latitude: "",
        longitude: ""
    });

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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Llamar a la acción de registrar dueño con formData
    };

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
        </div>
    );
};


