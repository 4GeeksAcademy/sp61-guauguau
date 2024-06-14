import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const AdminLogin = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (store.adminErrorMessage) {
            setErrorMessage(store.adminErrorMessage);
        }
    }, [store.adminErrorMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await actions.adminLogin(email, password);
            navigate("/adminprivate");
        } catch (error) {
            setErrorMessage(store.adminErrorMessage || "El mail o password no son correctos, inténtelo de nuevo");
        }
    };
    
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setErrorMessage("");
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <section className="section section-full">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <form className="form-styled" onSubmit={handleSubmit}>
                        <h1 className="text-center px-3 mb-4">Log in as a GuauuGuauu Admin!</h1>
                        <h5 className="text-center text-muted mb-5">Please fill out the form to log in.</h5>
                            <div className="form-group position-relative">
                                <label className="form-label">Email</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                    </svg>
                                <input
                                    type="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={handleInputChange(setEmail)}
                                    />
                                </div>
                            </div>
                            <div className="form-group position-relative">
                                <label className="form-label">Password</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Create your password"
                                        value={password}
                                        onChange={handleInputChange(setPassword)}
                                        />
                                    <button type="button" id="toggle-password" onClick={togglePasswordVisibility} className="btn btn-link">
                                        <i className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`} id="toggle-icon"></i>
                                    </button>
                                </div>
                            </div>
                            {errorMessage && (
                                <div className="alert alert-danger" role="alert">
                                    {errorMessage}
                                </div>
                            )}
                            <button type="submit" className="primary-btn primary-btn2 mt-2">Login</button>
                            <div className="login-redirect">
                                <Link to="/">Back home</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};


