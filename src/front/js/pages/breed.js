import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Breed = (props) => {
	const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [breed, setBreed] = useState([]);
// ----------------------------------------------------------------------------------------

// ------------------------------------------------------------------------------------------
    const handleSubmit = (e) => {
        e.preventDefault();
        actions.signUpBreed(name, type);
    };
	useEffect(() => {
		actions.getBreed();
	  }, []);

  
	return (
		<div className="container">
            
        
			
		
            <div className="container bg-dark p-3">
						<form className="row g-3 p-3 bg-light rounded m-3" onSubmit={handleSubmit}>
                            <h1 className="text-center p-3">Registar Raza</h1>
                            <div className="col-12">
                                <label htmlFor="inputName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="inputName" placeholder="your name" value={name}
                            onChange={(e) => setName(e.target.value)}/>
                            </div>
                            
                            <div className="col-12">
                                <label htmlFor="inputName" className="form-label">type</label>
                                <input type="text" className="form-control" id="inputName" placeholder="your type"
                            onChange={(e) => setType(e.target.value)}/>
                            </div>
                            
                            <div className="col-12">
                                <button type="submit" className="btn btn-primary">Sign in</button>
                            </div>
                        </form>
                        </div>
                       
                        </div>
		
	);
};
