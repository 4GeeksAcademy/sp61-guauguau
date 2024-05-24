import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Pets = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchPets(); 
    }, []);

    return (
        <div className="container">
            <h1>List of Pets</h1>
            <ul>
                {store.pets && store.pets.length > 0 ? (
                    store.pets.map(pet => (
                        <li key={pet.id}>
                            <div>
                                <h2>{pet.name}</h2>
                                <p>Breed: {pet.breed}</p>
                                <p>Sex: {pet.sex}</p>
                                <p>Age: {pet.age}</p>
                                <p>Pedigree: {pet.pedigree ? "Yes" : "No"}</p>
                                {pet.photo && <img src={pet.photo} alt={pet.name} />}
                                <button onClick={() => actions.fetchDeletePet(pet.id)}>Delete</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No pets available</li>
                )}
            </ul>
        </div>
    );
};

