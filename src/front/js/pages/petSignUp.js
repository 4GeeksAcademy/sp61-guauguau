import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/home.css";

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
    const navigate = useNavigate();

    useEffect(() => {
        actions.populateBreeds();
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
    
                if (formData.photo) {
                    await actions.uploadPetPhoto(petId, formData.photo);
                }
    
                if (formData.additional_photos.length > 0) {
                    await actions.uploadPetAdditionalPhotos(petId, formData.additional_photos);
                }
    
                setSuccessMessage("Pet created successfully!");
                setShowBackButton(true);

                // Redirigir a la ruta /private después de un breve retraso
                setTimeout(() => {
                    navigate("/private");
                }, 2000); // 2000ms = 2 segundos

            } else {
                console.error("Failed to add pet");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <section className="section-signuppet section-full section-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <form className="form-styled" onSubmit={handleSubmit}>
                            <h1 className="text-center px-3 mb-4">Add your dog</h1>
                            <h5 className="text-center text-muted mb-5">Fill out the form with your dog's information so other users can get to know them.</h5>
                            {successMessage && <div className="alert alert-success" role="alert">{successMessage}</div>}
                            <div className="form-group position-relative">
                                <label htmlFor="name" className="form-label">Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    id="name" 
                                    name="name" 
                                    placeholder="Your dog's name"
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="form-group position-relative">
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
                                    {store.breeds && store.breeds.map(breed => (
                                        <option key={breed.id} value={breed.id}>{breed.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group position-relative">
                                <label htmlFor="sex" className="form-label">Sex</label>
                                <select 
                                    className="form-select" 
                                    id="sex" 
                                    name="sex" 
                                    value={formData.sex} 
                                    onChange={handleChange} 
                                    required
                                >
                                    <option value="">Select Sex</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div className="form-group position-relative">
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
                            <div className="custom-control custom-checkbox mb-3 mb-md-0">
                                <input 
                                    type="checkbox" 
                                    className="custom-control-input mr-2" 
                                    id="pedigree" 
                                    name="pedigree" 
                                    checked={formData.pedigree} 
                                    onChange={handleChange} 
                                />
                                <label htmlFor="pedigree" className="custom-control-label d-flex align-items-center">Pedigree</label>
                            </div>
                            <div className="form-group position-relative mt-3">
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
                            <div className="form-group position-relative">
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
                            <button type="submit" className="primary-btn primary-btn2 mt-2">Submit</button>
                            
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};
