import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const PetSignUp = () => {
    const { store, actions } = useContext(Context);
    const [formData, setFormData] = useState({
        name: "",
        breed_id: "",
        sex: "",
        age: "",
        pedigree: false,
        photo: null,
        additional_photos: []
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [showBackButton, setShowBackButton] = useState(false);

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
        setFormData({
            ...formData,
            photo: e.target.files[0]
        });
    };

    const handleAdditionalFilesChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({
            ...formData,
            additional_photos: files
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const addedPet = await actions.addPet({
                ...formData,
                photo: null,
                additional_photos: []
            });

            if (addedPet) {
                const petId = addedPet.pet_id;

                // Upload profile photo
                if (formData.photo) {
                    const photoFormData = new FormData();
                    photoFormData.append("file", formData.photo);
                    
                    const response = await fetch(`${process.env.BACKEND_URL}/api/upload_pet_profile_picture/${petId}`, {
                        method: 'POST',
                        body: photoFormData
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        console.error("Failed to upload profile photo:", result.error);
                    }
                }

                // Upload additional photos
                for (let photo of formData.additional_photos) {
                    const additionalPhotoFormData = new FormData();
                    additionalPhotoFormData.append("file", photo);
                    
                    const response = await fetch(`${process.env.BACKEND_URL}/api/upload_pet_additional_photos/${petId}`, {
                        method: 'POST',
                        body: additionalPhotoFormData
                    });

                    const result = await response.json();

                    if (!response.ok) {
                        console.error("Failed to upload additional photo:", result.error);
                    }
                }

                setSuccessMessage("Pet created successfully!");
                setShowBackButton(true); // Show the back button
            } else {
                console.error("Failed to add pet");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="container">
            <h2>Add New Pet</h2>
            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
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
                    <label htmlFor="photo" className="form-label">Profile Photo</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="photo" 
                        name="photo" 
                        onChange={handleFileChange} 
                        accept="image/*"
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="additional_photos" className="form-label">Additional Photos (up to 4)</label>
                    <input 
                        type="file" 
                        className="form-control" 
                        id="additional_photos" 
                        name="additional_photos" 
                        onChange={handleAdditionalFilesChange} 
                        multiple 
                        accept="image/*"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
            {showBackButton && (
                <Link to="/private" className="btn btn-secondary mt-3">Back to Private</Link>
            )}
        </div>
    );
};
