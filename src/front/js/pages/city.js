import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const City = () => {
    const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [petFriendly, setPetFriendly] = useState("No");
    const [showForm, setShowForm] = useState(false);
    const [editingCity, setEditingCity] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        actions.getCity();
    }, []);

    const handleAddCity = () => {
        const newCity = {
            name: name,
            pet_friendly: petFriendly
        };
        actions.addCity(newCity);
        setName("");
        setPetFriendly("No");
        setShowForm(false);
    };

    const handleEditCity = () => {
        const updatedCity = {
            ...editingCity,
            name: name,
            pet_friendly: petFriendly
        };
        actions.editCity(updatedCity);
        setName("");
        setPetFriendly("No");
        setEditingCity(null);
        setShowForm(false);
    };

    const handleDeleteCity = (id) => {
        actions.deleteCity(id);
    };

    const startEditing = (city) => {
        navigate(`/editcity/${city.id}`);
    };

    return (
        <div className="container">
            <h2>City</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                {showForm ? "Cancel" : "Add City"}
            </button>

            {showForm && (
                <div className="mt-3">
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
                    <button onClick={editingCity ? handleEditCity : handleAddCity} className="btn btn-success">
                        {editingCity ? "Update City" : "Save City"}
                    </button>
                </div>
            )}

            <table className="table mt-4">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Pet Friendly</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.city.map(city => (
                        <tr key={city.id}>
                            <td>{city.name}</td>
                            <td>{city.pet_friendly}</td>
                            <td>
                                <button onClick={() => startEditing(city)} className="btn btn-warning">
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteCity(city.id)} className="btn btn-danger">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/">
                <button className="btn btn-primary">Back home</button>
            </Link>
        </div>
    );
};
