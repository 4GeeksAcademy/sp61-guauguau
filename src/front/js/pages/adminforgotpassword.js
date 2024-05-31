import React, { useState } from "react";

const AdminForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/admin/forgot_password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
            } else {
                setErrorMessage(data.message);
            }
        } catch (error) {
            setErrorMessage("An error occurred while processing your request.");
        }
    };

    return (
        <div className="container">
            <h2>Forgot Password</h2>
            {message && <p className="text-success">{message}</p>}
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Send Recovery Email</button>
            </form>
        </div>
    );
};

export default AdminForgotPassword;
