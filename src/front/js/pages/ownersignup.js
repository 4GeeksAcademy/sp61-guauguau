import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

export const OwnerSignup = () => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Resetea el mensaje de error una vez enviado el formulario
        setSuccessMessage(""); // Resetea el mensaje de success una vez enviado el formulario

        actions.signUp(name, email, password)
        .then(data => {
            // deja los campos del formulario en blanco y actualiza el successMessage si ha habido exito
            setName("");
            setEmail("");
            setPassword("");
            setSuccessMessage("Owner created!");
    })
    .catch(error => {
        // En caso de error actualiza errorMesage con los mensajes de error que toma de flux en signup y si no muestra un mensaje generico
        setErrorMessage(error.message || "An error occurred while signing up. Please try again later.");
    });
    };

    return (
        <div className="container bg-dark p-3">
            <form className="row g-3 p-3 bg-light rounded m-3" onSubmit={handleSubmit}>
                <h1 className="text-center p-3">Fill the form and sign up!</h1>
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
                <div className="col-12">
                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="inputName" placeholder="your name" value={name}
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputEmail4" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputEmail4" value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPassword4" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputPassword4" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Sign in</button>
                </div>
            </form>
            <br />
            <Link to="/">
                <button className="btn btn-primary">Back home</button>
            </Link>
        </div>
    );
};
