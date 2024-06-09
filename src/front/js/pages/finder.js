import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export const PetsFinder = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        breed: "",
        sex: "",
        ageRange: [0, 20],
        city: ""
    });

    useEffect(() => {
        const fetchData = async () => {
            await actions.fetchPets();
            setIsLoading(false);
        };

        fetchData();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setFilters({
            ...filters,
            [name]: value
        });
    };

    const handleAgeRangeChange = range => {
        setFilters({
            ...filters,
            ageRange: range
        });
    };

    const filteredPets = store.pets.filter(pet => {
        return (
            (filters.breed === "" || pet.breed === filters.breed) &&
            (filters.sex === "" || pet.sex === filters.sex) &&
            (pet.age >= filters.ageRange[0] && pet.age <= filters.ageRange[1]) &&
            (filters.city === "" || pet.city === filters.city)
        );
    });

    return (
        <div className="container">
            <h1 className="my-4">List of Pets</h1>
            <div className="mb-4">
                <h4>Search Filters</h4>
                <form>
                    <div className="row">
                        <div className="col-md-3">
                            <label htmlFor="breed">Breed</label>
                            <input
                                type="text"
                                name="breed"
                                className="form-control"
                                value={filters.breed}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="sex">Sex</label>
                            <select
                                name="sex"
                                className="form-control"
                                value={filters.sex}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="age">Age Range</label>
                            <Slider
                                range
                                min={0}
                                max={20}
                                defaultValue={[0, 20]}
                                value={filters.ageRange}
                                onChange={handleAgeRangeChange}
                                className="mt-2"
                            />
                            <div className="d-flex justify-content-between mt-2">
                                <span>{filters.ageRange[0]}</span>
                                <span>{filters.ageRange[1]}</span>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control"
                                value={filters.city}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </form>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="row">
                    {filteredPets.length > 0 ? (
                        filteredPets.map(pet => (
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
                                        <p className="card-text">City: {pet.city}</p> {/* Add city to the card */}
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
