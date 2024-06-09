import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

const Login = () => {
    const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para controlar la redirección

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await actions.login(email, password);
            setIsLoggedIn(true); // Actualiza el estado para indicar que el usuario ha iniciado sesión
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary">Login</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
            </form>
            {isLoggedIn && store.auth && (
                <div className="mt-3">
                    <Link to="/privateView" className="btn btn-success">Go to Private Area</Link>
                </div>
            )}
        </div>
    );
};

export default Login;
