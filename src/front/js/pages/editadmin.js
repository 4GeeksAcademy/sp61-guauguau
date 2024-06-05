import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditAdmin = () => {
    const { store, actions } = useContext(Context);
    const { adminId } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(() => {
        const admin = store.admins.find(admin => admin.id === parseInt(adminId));
        if (admin) {
            setName(admin.name);
            setEmail(admin.email);
            setPassword(admin.password);
        }
    }, [adminId, store.admins]);

    const handleEditAdmin = async () => {
        const updatedAdmin = {
            id: parseInt(adminId),
            name,
            email,
            password
        };
        await actions.updateAdmin(updatedAdmin);
        navigate("/adminprivate");
    };

    return (
        <div className="container">
            <h2>Edit Admin</h2>
            <div className="form-group">
                <label htmlFor="adminName">Name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="adminName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="adminEmail">Email:</label>
                <input
                    type="email"
                    className="form-control"
                    id="adminEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="adminPassword">Password:</label>
                <input
                    type="password"
                    className="form-control"
                    id="adminPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <button onClick={handleEditAdmin} className="btn btn-success">
                Update Admin
            </button>
            <button onClick={() => navigate("/adminprivate")} className="btn btn-secondary">
                Cancel
            </button>
        </div>
    );
};