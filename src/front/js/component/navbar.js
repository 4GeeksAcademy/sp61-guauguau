import React, { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Context } from "../store/appContext";
import logo from "../../img/logo.png";

const NavItem = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <li>
            <Link to={to} className={isActive ? "active" : ""}>
                {children}
            </Link>
        </li>
    );
};

const UserMenu = ({ store, handleLogout }) => {
    return store.auth && store.owner ? (
        <div className="d-flex align-items-center">
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
        </div>
    ) : null;
};

export const Navbar = () => {
    const { store, actions } = useContext(Context);
    const handleLogout = () => {
        actions.logout();
    };

    return (
        <header className="header-area sticky">
            <div className="container-fluid d-flex justify-content-between align-items-center container-navbar">
                <div className="header-logo">
                    <Link to="/">
                        <img alt="logo" className="img-fluid" src={logo} />
                    </Link>
                </div>
                <div className="main-menu">
                    <ul className="menu-list">
                        <NavItem to="/login">Owner Login</NavItem>
                        <NavItem to="/ownersignup">Owner Signup</NavItem>
                        <NavItem to="/showowners">View Owners</NavItem>
                        <NavItem to="/city">View Cities</NavItem>
                        <NavItem to="/pets">View Pets</NavItem>
                        <NavItem to="/petSignUp">Pet SignUp</NavItem>
                        <NavItem to="/breed">Agrega Raza</NavItem>
                        <NavItem to="/photo">Agrega Fotos</NavItem>
                        <NavItem to="/adminlogin">Admin Login</NavItem>
                        <NavItem to="/adminsignup">Admin SignUp</NavItem>
                    </ul>
                </div>
                <div className="header-icons d-flex align-items-center">
                    <Link to="/private"><i className="fas fa-user"></i></Link>
                </div>
                <UserMenu store={store} handleLogout={handleLogout} />
            </div>
        </header>
    );
};