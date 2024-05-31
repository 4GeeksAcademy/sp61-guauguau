import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditCity = () => {
    const { store, actions } = useContext(Context);
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [petFriendly, setPetFriendly] = useState("No");

    useEffect(() => {
        const city = store.city.find(city => city.id === parseInt(id));
        if (city) {
            setName(city.name);
            setPetFriendly(city.pet_friendly);
        }
    }, [id, store.city]);

    const handleEditCity = () => {
        const updatedCity = {
            id: parseInt(id),
            name: name,
            pet_friendly: petFriendly
        };
        actions.editCity(updatedCity);
        navigate("/city");
    };

    return (
        <div className="container">
            <h2>Edit City</h2>
            <div className="form-group">
                <label htmlFor="cityName">Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="cityName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="petFriendly">Pet Friendly:</label>
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="petFriendly"
                    checked={petFriendly === "Yes"}
                    onChange={(e) => setPetFriendly(e.target.checked ? "Yes" : "No")}
                />
            </div>
            <button onClick={handleEditCity} className="btn btn-success">
                Update City
            </button>
            <button onClick={() => navigate("/city")} className="btn btn-secondary">
                Cancel
            </button>
        </div>
    );
};
