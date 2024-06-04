import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { store, actions } = useContext(Context);

    const handleLogout = () => {
        actions.logout();
    };

    return (
        <nav className="navbar navbar-light bg-light">
            <div className="container d-flex justify-content-between">
                <div>
                    <Link to="/">
                        <span className="navbar-brand mb-0 h1">React Boilerplate</span>
                    </Link>
                    <Link to="/demo">
                        <button className="btn btn-primary">Check the Context in action</button>
                    </Link>
                    <Link to="/login">
                        <button className="btn btn-warning m-2">Owner Login</button>
                    </Link>
                    <Link to="/ownersignup">
                        <button className="btn btn-warning m-2">Owner Signup</button>
                    </Link>
                    <Link to="/showowners">
                        <button className="btn btn-warning m-2">View Owners</button>
                    </Link>
                    <Link to="/city">
                        <button className="btn btn-warning m-2">View Cities</button>
                    </Link>
                    <Link to="/pets">
                        <button className="btn btn-warning m-2">View Pets</button>
                    </Link>
                    <Link to="/petSignUp">
                        <button className="btn btn-warning m-2">Pet SignUp</button>
                    </Link>
                    <Link to="/breed">
                        <button className="btn btn-warning m-2">Agrega Raza</button>
                    </Link>
                    <Link to="/photo">
                        <button className="btn btn-warning m-2">Agrega Fotos</button>
                    </Link>
                    <Link to="/adminlogin">
                        <button className="btn btn-warning m-2">Admin Login</button>
                    </Link>
                    <Link to="/adminsignup">
                        <button className="btn btn-warning m-2">Admin SignUp</button>
                    </Link>
                </div>
                <div className="d-flex align-items-center">
                    {store.auth && store.owner ? (
                        <>
                            <span className="me-2">{store.owner.name}</span>
                            {store.profilePictureUrl && (
                                <img
                                    src={store.profilePictureUrl}
                                    alt="Profile"
                                    className="rounded-circle"
                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                            )}
                            <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
                        </>
                    ) : null}
                </div>
            </div>
        </nav>
    );
};
