import React, { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Context } from "../store/appContext";

const AdminPrivate = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    useEffect(() => {
        if (!store.adminAuth) {
            navigate("/adminlogin");
        } else {
            actions.fetchAdmins();
        }
    }, [store.adminAuth, actions, navigate]);

    const handleDeleteAdmin = async (adminId) => {
        const currentAdminEmail = store.admins.find(admin => admin.id === adminId)?.email;
        await actions.deleteAdmin(adminId, store.adminEmail);

        if (currentAdminEmail === store.adminEmail) {
            navigate("/adminlogin");
        }
    };

    return (
        <div className="container">
            <h2>Admin Zone</h2>
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

export default AdminPrivate;