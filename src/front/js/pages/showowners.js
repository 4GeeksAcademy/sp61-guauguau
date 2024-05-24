import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const ShowOwners = () => {
    const { store, actions } = useContext(Context);
    const [editOwner, setEditOwner] = useState(null);

    useEffect(() => {
        actions.fetchOwners();
    }, [actions]);

    const handleDeleteOwner = async ownerId => {
        await actions.deleteOwner(ownerId);
    };

    const handleEditOwner = owner => {
        setEditOwner(owner);
    };

    const handleSaveOwner = async owner => {
        await actions.updateOwner(owner);
        setEditOwner(null);
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
                    {store.owners.map(owner => (
                        <tr key={owner.id}>
                            <td>{owner.name}</td>
                            <td>{owner.email}</td>
                            <td>
                                <button onClick={() => handleEditOwner(owner)} className="btn btn-primary">
                                    <i className="fas fa-edit"></i>
                                </button>
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
            {editOwner && (
                <EditOwnerModal owner={editOwner} onSave={handleSaveOwner} onCancel={() => setEditOwner(null)} />
            )}
        </div>
    );
};

const EditOwnerModal = ({ owner, onSave, onCancel }) => {
    const [name, setName] = useState(owner.name);
    const [email, setEmail] = useState(owner.email);
    const [password, setPassword] = useState("");

    const handleSave = () => {
        onSave({ ...owner, name, email, password });
    };

    return (
        <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Edit Owner</h5>
                        <button type="button" className="close" onClick={onCancel}>
                            <span>&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" className="form-control" id="password" value={password} onChange={e => setPassword(e.target.value)} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancel</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
