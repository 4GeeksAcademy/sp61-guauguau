import React, { useEffect, useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const OnePet = () => {
    const { store, actions } = useContext(Context);
    const { petId } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [petDetails, setPetDetails] = useState({
        name: '',
        breed: '',
        sex: '',
        age: '',
        pedigree: false,
        photo: ''
    });
    const [careInfo, setCareInfo] = useState("");
    const [compatibilityInfo, setCompatibilityInfo] = useState("");

    useEffect(() => {
        actions.fetchPetById(petId);
    }, [petId]);

    useEffect(() => {
        if (store.currentPet) {
            setPetDetails(store.currentPet);
        }
    }, [store.currentPet]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetDetails({
            ...petDetails,
            [name]: value
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setPetDetails({
            ...petDetails,
            [name]: checked
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.updatePet(petId, petDetails);
        setIsEditing(false);
    };

    const fetchCareInfo = async () => {
        const response = await fetch(`/api/cuidados/${petDetails.breed}`);
        const data = await response.json();
        setCareInfo(data.text);
    };

    const fetchCompatibilityInfo = async () => {
        const response = await fetch(`/api/compatibilidad/${petDetails.breed}`);
        const data = await response.json();
        setCompatibilityInfo(data.text);
    };

    const pet = store.currentPet;

    return (
        <div className="container">
            {pet ? (
                <>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Name:</label>
                                <input type="text" name="name" value={petDetails.name} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Breed:</label>
                                <input type="text" name="breed" value={petDetails.breed} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Sex:</label>
                                <input type="text" name="sex" value={petDetails.sex} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Age:</label>
                                <input type="text" name="age" value={petDetails.age} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Pedigree:</label>
                                <input type="checkbox" name="pedigree" checked={petDetails.pedigree} onChange={handleCheckboxChange} />
                            </div>
                            <div>
                                <label>Photo URL:</label>
                                <input type="text" name="photo" value={petDetails.photo} onChange={handleChange} />
                            </div>
                            <button type="submit">Save</button>
                        </form>
                    ) : (
                        <>
                            <h1>{pet.name}</h1>
                            <p>Breed: {pet.breed}</p>
                            <p>Sex: {pet.sex}</p>
                            <p>Age: {pet.age}</p>
                            <p>Pedigree: {pet.pedigree ? "Yes" : "No"}</p>
                            {pet.photo && <img src={pet.photo} alt={pet.name} />}
                            <button onClick={() => setIsEditing(true)}>Edit</button>
                            <button onClick={fetchCareInfo}>Cuidados</button>
                            <button onClick={fetchCompatibilityInfo}>Compatibilidad</button>
                            {careInfo && (
                                <div>
                                    <h3>Cuidados</h3>
                                    <p>{careInfo}</p>
                                </div>
                            )}
                            {compatibilityInfo && (
                                <div>
                                    <h3>Compatibilidad</h3>
                                    <p>{compatibilityInfo}</p>
                                </div>
                            )}
                        </>
                    )}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};