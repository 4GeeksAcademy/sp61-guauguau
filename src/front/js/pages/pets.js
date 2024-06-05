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
            <h1 className="my-4">List of Pets</h1>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="row">
                    {store.pets && store.pets.length > 0 ? (
                        store.pets.map(pet => (
                            <div key={pet.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    {pet.profile_photo_url && <img src={pet.profile_photo_url} className="card-img-top" alt={pet.name} />}
                                    <div className="card-body">
                                        <h2 className="card-title">
                                            <Link to={`/singlepet/${pet.id}`}>{pet.name}</Link>
                                        </h2>
                                        <p className="card-text">Breed: {pet.breed}</p>
                                        <p className="card-text">Sex: {pet.sex}</p>
                                        <p className="card-text">Age: {pet.age}</p>
                                        <p className="card-text">Pedigree: {pet.pedigree ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No pets available</p>
                    )}
                </div>
            )}
        </div>
    );
};
