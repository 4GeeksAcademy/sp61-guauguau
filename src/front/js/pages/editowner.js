// src/views/EditOwner.js
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditOwner = () => {
    const { store, actions } = useContext(Context);
    const { ownerId } = useParams();
    const [owner, setOwner] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const currentOwner = store.owners.find(o => o.id === parseInt(ownerId));
        if (currentOwner) {
            setOwner(currentOwner);
        }
    }, [store.owners, ownerId]);

    const handleSave = async () => {
        await actions.updateOwner(owner);
        navigate("/showowners"); // Redirige a la vista de ShowOwners después de guardar
    };

    return (
        <div className="container">
            <h2>Edit Owner</h2>
            <form>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={owner.name}
                        onChange={e => setOwner({ ...owner, name: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={owner.email}
                        onChange={e => setOwner({ ...owner, email: e.target.value })}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={owner.password}
                        onChange={e => setOwner({ ...owner, password: e.target.value })}
                    />
                </div>
                <Link to="/showowners" className="btn btn-primary" onClick={handleSave}>
                    Save
                </Link>
                <Link to="/showowners" className="btn btn-secondary">
                    Cancel
                </Link>
            </form>
        </div>
    );
};


