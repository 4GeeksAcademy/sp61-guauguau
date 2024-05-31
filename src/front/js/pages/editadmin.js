import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Context } from "../store/appContext";

export const EditAdmin = () => {
    const { store, actions } = useContext(Context);
    const { adminId } = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const admin = store.admins.find(admin => admin.id === parseInt(adminId));
        if (admin) {
            setName(admin.name);
            setEmail(admin.email);
        }
    }, [store.admins, adminId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedAdmin = { id: adminId, name, email, password };
        await actions.updateAdmin(updatedAdmin);
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className="btn btn-primary">Update Admin</button>
            </form>
        </div>
    );
};
