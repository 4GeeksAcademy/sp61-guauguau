import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Pets = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            await actions.fetchPets();
            setIsLoading(false);
        };

        fetchData();
    }, []);

    return (
        <div className="container">
            <h1>List of Pets</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {store.pets && store.pets.length > 0 ? (
                        store.pets.map(pet => (
                            <li key={pet.id}>
                                <div>
                                    <h2>
                                        <Link to={`/pet/${pet.id}`}>{pet.name}</Link>
                                    </h2>
                                    <p>Breed: {pet.breed}</p>
                                    <p>Sex: {pet.sex}</p>
                                    <p>Age: {pet.age}</p>
                                    <p>Pedigree: {pet.pedigree ? "Yes" : "No"}</p>
                                    {pet.profile_photo_url && <img src={pet.profile_photo_url} alt={pet.name} style={{ maxWidth: "200px", height: "auto" }} />}
                                    <button onClick={() => actions.fetchDeletePet(pet.id)}>Delete</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>No pets available</li>
                    )}
                </ul>
            )}
        </div>
    );
};
