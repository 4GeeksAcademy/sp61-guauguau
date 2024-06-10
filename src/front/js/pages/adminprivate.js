import React, { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";
import { Dropdown, DropdownButton } from 'react-bootstrap'; // Importar correctamente desde 'react-bootstrap'

export const AdminPrivate = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [petsByOwner, setPetsByOwner] = useState({});

    useEffect(() => {
        if (!store.adminAuth) {
            navigate("/adminlogin");
        } else {
            actions.fetchOwners();
        }
    }, [store.adminAuth, actions, navigate]);

    useEffect(() => {
        // Fetch pets for each owner and store them in state
        const fetchPetsForOwners = async () => {
            const petsData = {};
            for (let owner of store.owners) {
                const ownerDetails = await actions.getOwnerDetails(owner.id);
                petsData[owner.id] = ownerDetails.pets;
            }
            setPetsByOwner(petsData);
        };
        if (store.owners.length > 0) {
            fetchPetsForOwners();
        }
    }, [store.owners, actions]);

    const handleLogout = () => {
        actions.adminLogout();
        navigate("/adminlogin");
    };

    const handleDeleteOwner = (ownerId) => {
        actions.deleteOwner(ownerId);
    };

    const handleDeletePet = (petId) => {
        actions.fetchDeletePet(petId);
    };

    return (
        <div className="container">
            <h2>Admin Zone</h2>
            <button onClick={handleLogout} className="btn btn-danger float-right">
                Logout
            </button>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.owners.map(owner => (
                        <tr key={owner.id}>
                            <td>{owner.name}</td>
                            <td>{owner.email}</td>
                            <td>
                                <button onClick={() => handleDeleteOwner(owner.id)} className="btn btn-danger">
                                    <i className="fas fa-trash-alt"></i> Delete
                                </button>
                                {petsByOwner[owner.id] && (
                                    <DropdownButton
                                        id={`dropdown-pets-${owner.id}`}
                                        title="Pets"
                                        className="mt-3"
                                    >
                                        {petsByOwner[owner.id].map(pet => (
                                            <Dropdown.Item key={pet.id} className="d-flex justify-content-between align-items-center">
                                                <span>{pet.name}</span>
                                                <button
                                                    onClick={() => handleDeletePet(pet.id)}
                                                    className="btn btn-danger btn-sm ml-2"
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </Dropdown.Item>
                                        ))}
                                    </DropdownButton>
                                )}
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
