import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            console.log("Attempting login with", email, password); // Log para depuración
            await actions.login(email, password);
            navigate('/private');
        } catch (error) {
            console.error("Login failed:", error); // Log para depuración
            setError(error.message);
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    useEffect(() => {
        if (store.auth) {
            navigate('/private');
        }
    }, [store.auth, navigate]);

    return (
        <section className="section section-full section-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <form className="form-styled" onSubmit={handleSubmit}>
                            <h1 className="text-center px-3 mb-4">Log in as a GuauuGuauu User!</h1>
                            <h5 className="text-center text-muted mb-5">Please fill out the form to log in.</h5>
                            <div className="form-group position-relative">
                                <label htmlFor="email" className="form-label">Email address</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-envelope me-2" viewBox="0 0 16 16">
                                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
                                    </svg>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="form-group position-relative">
                                <label htmlFor="password" className="form-label">Password</label>
                                <div className="input-icon d-flex align-items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-lock me-2" viewBox="0 0 16 16">
                                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2m3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2M5 8h6a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1" />
                                    </svg>
                                    <input
                                        type={passwordVisible ? "text" : "password"}
                                        className="form-control"
                                        placeholder="Enter your password"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button type="button" id="toggle-password" onClick={togglePasswordVisibility} className="btn btn-link">
                                        <i className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"}`} id="toggle-icon"></i>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" className="primary-btn primary-btn2 mt-2">Login</button>
                            {error && <div className="alert alert-danger mt-3">{error}</div>}
                            <div className="login-redirect">
                                <Link to="/home">Back home</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
