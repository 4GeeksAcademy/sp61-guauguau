import React, {useState, useEffect, useContext} from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const City = () => {
    const { store } = useContext (Context);
    const [name, setName] = useState ("");
    const [petFriendly, setPetFriendly] = ("");

    return (
    <div className="container">
                <h2>City</h2>
                <button onClick={() => handleAddCity(city.id)} className="btn btn-danger">
                    <i class="bi bi-plus-circle"></i>
                </button>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Pet Friendly</th>
                        </tr>
                    </thead>
                    <tbody>
                        {store.city.map(city => (
                            <tr key={city.id}>
                                <td>{city.name}</td>
                                <td>{city.pet_friendly}</td>
                                <td>
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
            )
};