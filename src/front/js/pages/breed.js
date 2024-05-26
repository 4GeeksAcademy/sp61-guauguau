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
		fetchBreed();
       
	  }, []);
    const fetchBreed = () => {
        fetch(process.env.BACKEND_URL + "/api/breed")
            .then(response => response.json())
            .then(data => setBreed(data))
            .catch(error => console.error("Error fetching breed:", error));
    };
    const handleDeleteBreed = breedId => {
        actions.deleteBreed(breedId); 
    };
  
	return (
		<div className="container">
           <h1>Listar Razas</h1>

         
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {breed.map(breed =>(
                        <tr key={breed.id} >
                        <td> <p>{breed.name}</p> </td>
                           <td><p>{breed.type}</p></td>
                          <td>
                           <button onClick={() => handleDeleteBreed(breed.id)} className="btn btn-danger">
                                 <i className="fas fa-trash-alt"></i> 
                              </button>
                         </td>
                        </tr>
    ))}
                </tbody>
            </table>
           
     
        
			
		
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
