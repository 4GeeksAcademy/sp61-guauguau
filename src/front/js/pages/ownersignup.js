import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const OwnerSignup = () => {
	const { store, actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.signUp(name, email, password);
    };

	return (
		<div className="container bg-dark p-3">
						<form className="row g-3 p-3 bg-light rounded m-3" onSubmit={handleSubmit}>
                            <h1 className="text-center p-3">Fill the form and sign up!</h1>
                            <div className="col-12">
                                <label htmlFor="inputName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="inputName" placeholder="your name" value={name}
                            onChange={(e) => setName(e.target.value)}/>
                            </div>
                            
                            <div className="col-md-6">
                                <label htmlfor="inputEmail4" className="form-label">Email</label>
                                <input type="email" className="form-control" id="inputEmail4" value={email}
                            onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className="col-md-6">
                                <label htmlfor="inputPassword4" className="form-label">Password</label>
                                <input type="password" className="form-control" id="inputPassword4" value={password}
                            onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            
                            
                            
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                        </form>
				
			
			<br />
			<Link to="/">
				<button className="btn btn-primary">Back home</button>
			</Link>
		</div>)
	
};