import React, { useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";

const NavItem = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <li className="nav-item">
            <Link to={to} className={`nav-link ${isActive ? "active" : ""}`}>
                {children}
            </Link>
        </li>
    );
};

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const handleLogout = () => {
        actions.logout();
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ backgroundColor: '#0a0e1a' }}>
            <div className="container-fluid">
                <h2 className="navbar-brand" href="/">
                    <img alt="logo" className="img-fluid" src={logo} />
                    <span className="d-none d-lg-inline">GuauuuGuauuu</span>
                </h2>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <NavItem to="/pets">Find a match</NavItem>
                        <NavItem to="/login">Login</NavItem>
                        <NavItem to="/ownersignup">Signup</NavItem>
                    </ul>
                    {store.auth && store.owner && (
                        <div className="ms-auto d-flex align-items-center">
                            <Link to="/private" className="d-flex align-items-center text-decoration-none">
                                {store.profilePictureUrl ? (
                                    <img
                                        src={store.profilePictureUrl}
                                        alt="Profile"
                                        className="rounded-circle"
                                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                    />
                                ) : (
                                    <i className="fas fa-user"></i>
                                )}
                                <span className="ms-2 user-name" id="owner-name">{store.owner.name}</span>
                            </Link>
                            <button className="Bttn btn-link ms-2" onClick={handleLogout}>
                                <div className="sign">
                                    <svg viewBox="0 0 512 512">
                                        <path
                                            d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                                        ></path>
                                    </svg>
                                </div>
                                <div className="text">Logout</div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};
