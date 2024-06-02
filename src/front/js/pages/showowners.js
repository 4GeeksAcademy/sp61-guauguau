import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";
import MapComponent from "./MapComponent";

export const ShowOwners = () => {
    const { store, actions } = useContext(Context);
    const [selectedOwner, setSelectedOwner] = useState(null);

    useEffect(() => {
        actions.fetchOwners();
    }, []);


    
    

    const handleDeleteOwner = async ownerId => {
        await actions.deleteOwner(ownerId);
    };

    const handleOwnerSelect = (owner) => {
        setSelectedOwner(owner);
    };

    return (
        <div className="container">
            <h2>Owners</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.owners.map(owner => (
                        <tr key={owner.id} onClick={() => handleOwnerSelect(owner)}>
                            <td>{owner.name}</td>
                            <td>{owner.email}</td>
                            <td>{owner.address}</td>
                            <td>{owner.latitude}</td>
                            <td>{owner.longitude}</td>
                            <td>
                                <Link to={`/editowner/${owner.id}`} className="btn btn-primary">
                                    <i className="fas fa-edit"></i>
                                </Link>
                                <button onClick={() => handleDeleteOwner(owner.id)} className="btn btn-danger">
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedOwner && (
                <div>
                    <h3>Owner Location</h3>
                    <MapComponent lat={selectedOwner.latitude} lng={selectedOwner.longitude} />
                </div>
            )}
            <Link to="/">
                <button className="btn btn-primary">Back home</button>
            </Link>
        </div>
    );
};
