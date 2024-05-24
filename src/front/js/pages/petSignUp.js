import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const PetSignUp = () => {
	const { actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        breed: "",
        sex: "",
        age: "",
        pedigree: false,
        photo: ""
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.addPet(formData);
    };

    return (
        <div className="container">
            <h2>Add New Pet</h2>
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
                    <label htmlFor="breed" className="form-label">Breed</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="breed" 
                        name="breed" 
                        value={formData.breed} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="sex" className="form-label">Sex</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="sex" 
                        name="sex" 
                        value={formData.sex} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="age" className="form-label">Age</label>
                    <input 
                        type="number" 
                        className="form-control" 
                        id="age" 
                        name="age" 
                        value={formData.age} 
                        onChange={handleChange} 
                        required 
                    />
                </div>
                <div className="mb-3 form-check">
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="pedigree" 
                        name="pedigree" 
                        checked={formData.pedigree} 
                        onChange={handleChange} 
                    />
                    <label htmlFor="pedigree" className="form-check-label">Pedigree</label>
                </div>
                <div className="mb-3">
                    <label htmlFor="photo" className="form-label">Photo URL</label>
                    <input 
                        type="text" 
                        className="form-control" 
                        id="photo" 
                        name="photo" 
                        value={formData.photo} 
                        onChange={handleChange} 
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};
