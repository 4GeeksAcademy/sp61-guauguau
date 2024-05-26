import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const ShowOwners = () => {
	const { store, actions } = useContext(Context);
    

    const [owners, setOwners] = useState([]);

    
    useEffect(() => {
        fetchOwners();
    }, []);

    const fetchOwners = () => {
        fetch(process.env.BACKEND_URL + "/api/owner")
            .then(response => response.json())
            .then(data => setOwners(data))
            .catch(error => console.error("Error fetching owners:", error));
    };
    
    const handleDeleteBreed = ownerId => {
        actions.deleteBreed(ownerId); 
    };

	return (
		<div className="container">
            <h2>Owners</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {owners.map(owner => (
                        <tr key={owner.id}>
                            <td>{owner.name}</td>
                            <td>{owner.email}</td>
                            <td>
                                <button onClick={() => handleDeleteOwner(owner.id)} className="btn btn-danger">
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