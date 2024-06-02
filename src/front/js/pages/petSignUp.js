import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const PetSignUp = () => {
    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        breed_id: "",
        sex: "",
        age: "",
        pedigree: false,
        photo: "",
        owner_id: ""
    });
    const [file, setFile] = useState(null);

    useEffect(() => {
        actions.fetchOwners();
        actions.getBreed();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let updatedFormData = { ...formData };

        if (file) {
            try {
                const formData = new FormData();
                formData.append("file", file);
                const response = await fetch(`${process.env.BACKEND_URL}/api/upload_pet_profile_picture`, {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (response.ok) {
                    updatedFormData = { ...updatedFormData, photo: result.photo_url };
                } else {
                    console.error("Failed to upload photo", result.error);
                }
            } catch (error) {
                console.error("Error uploading photo:", error);
            }
        }

        await actions.addPet(updatedFormData);
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
                    <label htmlFor="breed_id" className="form-label">Breed</label>
                    <select 
                        className="form-select" 
                        id="breed_id" 
                        name="breed_id" 
                        value={formData.breed_id} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select Breed</option>
                        {store.breed && store.breed.map(breed => (
                            <option key={breed.id} value={breed.id}>{breed.name}</option>
                        ))}
                    </select>
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
                    <label htmlFor="photo" className="form-label">Photo</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="photo" 
                        name="photo" 
                        onChange={handleFileChange} 
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="owner_id" className="form-label">Owner</label>
                    <select 
                        className="form-select" 
                        id="owner_id" 
                        name="owner_id" 
                        value={formData.owner_id} 
                        onChange={handleChange} 
                        required
                    >
                        <option value="">Select Owner</option>
                        {store.owners && store.owners.map(owner => (
                            <option key={owner.id} value={owner.id}>{owner.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};