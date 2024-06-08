import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const AdminSignUp = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");
        try {
            await actions.createAdmin(name, email, password);
            setName("");
            setEmail("");
            setPassword("");
            setSuccessMessage("Admin created!");
        } catch (error) {
            setErrorMessage("An error occurred while signing up. Please try again later.");
        }
    };

    return (
        <section className="section section-full section-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <form className="form-styled" onSubmit={handleSubmit}>
                            <h1 className="text-center px-3 mb-4">Sign up as a GuauuGuauu Admin!</h1>
                            <h5 className="text-center text-muted mb-5">Please fill out the form to sign up.</h5>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            {successMessage && (
                                <div className="alert alert-success" role="alert">
                                    {successMessage}
                                </div>
                            )}
                            <div className="form-group position-relative">
                                <label htmlFor="inputName" className="form-label">Full name*</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person me-2" viewBox="0 0 16 16">
                                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z"/>
                                    </svg>
                                    <input
                                    type="text"
                                    className="form-control mb-3"
                                    id="inputName"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                </div>
                            <div className="form-group position-relative">
                                <label htmlFor="inputEmail4" className="form-label">Email*</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                    </svg>
                                    <input
                                        type="email"
                                        className="form-control mb-3"
                                        id="inputEmail4"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-group position-relative">
                                <label htmlFor="inputPassword4" className="form-label">Password*</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                    <input
                                        type="password"
                                        className="form-control mb-3"
                                        id="inputPassword4"
                                        placeholder="Create your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)} />
                                </div>
                            </div>
                            <div className="form-row align-items-center">
                                <div className="col-md-auto">
                                    <div className="custom-control custom-checkbox mb-3 mb-md-0">
                                        <input type="checkbox" name="checkbox"  className="custom-control-input mr-2" id="sign-in-checkbox"></input>
                                        <label className="custom-control-label d-flex align-items-center" htmlFor="sign-in-checkbox">
                                            <p className="mb-0 me-1">I agree to</p>
                                            <a href="#">terms and conditions</a>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="button-group">
                                <button type="submit" className="primary-btn primary-btn2 mt-2">Sign up now</button>
                            </div>   
                                <div className="login-redirect">
                                <Link to="/home">Back home</Link>
                            </div>
                            <div className="login-redirect">
                                <p>Already have an account? <Link to="/adminlogin">Log In Here as Admin</Link></p>
                            </div>
                        </form>
                        <br />
                    </div>
                </div>
            </div>
        </section>
    );
};