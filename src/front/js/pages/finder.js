import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import perroImage from "../../img/perro2.png";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // Importa los estilos del slider
import ReactPaginate from 'react-paginate'; // Importa la biblioteca de paginación

export const PetsFinder = () => {
    const { store, actions } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        breed: "",
        sex: "",
        ageRange: [0, 20],
        city: ""
    });
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            await actions.fetchPets();
            await actions.populateBreeds();
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
            (filters.city === "" || pet.owner_city === filters.city)
        );
    });

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const offset = currentPage * itemsPerPage;
    const currentPets = filteredPets.slice(offset, offset + itemsPerPage);
    const pageCount = Math.ceil(filteredPets.length / itemsPerPage);

    return (
        <div className="container-fluid finder-main-container">
            <h1 className="my-4 pt-4 text-center">You can filter and find the pet</h1>
            <div className="finder-bg container">
                <div className="image-wrapper">
                    <img src={perroImage} className="floating-image" alt="Perro" />
                </div>
            </div>
            <div className="mb-4 form-finder">
                <form className="form-finder-main">
                    <div className="row d-flex flex-row form-finder-filters ">
                        <div className="col-3 filter ">
                            <label htmlFor="breed">Breed</label>
                            <select
                                name="breed"
                                className="form-control input-finder"
                                value={filters.breed}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                {store.breeds && store.breeds.map(breed => (
                                    <option key={breed.id} value={breed.name}>{breed.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-3 filter">
                            <label htmlFor="sex">Sex</label>
                            <select
                                name="sex"
                                className="form-control input-finder"
                                value={filters.sex}
                                onChange={handleChange}
                            >
                                <option value="">All</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                        <div className="col-3 filter">
                            <label htmlFor="city">City</label>
                            <input
                                type="text"
                                name="city"
                                className="form-control input-finder"
                                value={filters.city}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="col-md-3 col-6 filter">
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
                    </div>
                </form>
            </div>
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="row finder-gallery">
                    {currentPets.length > 0 ? (
                        currentPets.map(pet => (
                            <div key={pet.id} className="col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-4">
                                <div className="card position-relative p-0 border border-0">
                                    {pet.profile_photo_url && (
                                        <div className="position-relative">
                                            <img src={pet.profile_photo_url} className="card-img-top" alt={pet.name} />
                                            <h2 className="card-title-overlay">
                                                <Link to={`/singlepet/${pet.id}`} className="text-white">{pet.name}</Link>
                                            </h2>
                                        </div>
                                    )}
                                    <div className="card-body card-body-gallery">
                                        <p className="card-text-finder text-gallery">{pet.owner_city}</p>
                                        <span className="card-text-finder">{pet.breed} </span> 
                                        <span className="card-text-finder">{pet.age} years </span> 
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No pets available</p>
                    )}
                </div>
            )}
            {filteredPets.length > itemsPerPage && (
                <ReactPaginate
                    previousLabel={"← "}
                    nextLabel={" →"}
                    breakLabel={"..."}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination"}
                    activeClassName={"active"}
                    previousClassName={"previous"}
                    nextClassName={"next"}
                    breakClassName={"break-me"}
                    pageClassName={"page"}
                    pageLinkClassName={"page-link"}
                    previousLinkClassName={"previous-link"}
                    nextLinkClassName={"next-link"}
                    activeLinkClassName={"active-link"}
                />
            )}
        </div>
    );
};
