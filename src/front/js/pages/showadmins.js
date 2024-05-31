import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const ShowAdmins = () => {
    const { store, actions } = useContext(Context);

    useEffect(() => {
        actions.fetchAdmins();
    }, [actions]);

    const handleDeleteAdmin = async adminId => {
        await actions.deleteAdmin(adminId);
    };

    return (
        <div className="container">
            <h2>Admins</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {store.admins.map(admin => (
                        <tr key={admin.id}>
                            <td>{admin.name}</td>
                            <td>{admin.email}</td>
                            <td>
                                <Link to={`/editadmin/${admin.id}`} className="btn btn-primary">
                                    <i className="fas fa-edit"></i>
                                </Link>
                                <button onClick={() => handleDeleteAdmin(admin.id)} className="btn btn-danger">
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
