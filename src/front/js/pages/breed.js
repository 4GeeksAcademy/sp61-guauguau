import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ApiBreed } from "./apiBreed";
import { Autocomplete } from "./autocompletbreed";

export const Breed = () => {
	const { store, actions } = useContext(Context);
	const [name, setName] = useState("");
	const [type, setType] = useState("");
	const [life_span, setLifeSpan] = useState("");
	const [editMode, setEditMode] = useState(false);
	const [editBreedId, setEditBreedId] = useState(null);
	const [editName, setEditName] = useState("");
	const [editType, setEditType] = useState("");
	const [editLife, setEditLife] = useState("");

	const handleSelectBreed = (raza) => {
		setName(raza.name);
		setType(raza.breed_group);
		setLifeSpan(raza.life_span);
	};


    return (
        <section className="section section-full section-top">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6">
                        <form className="form-styled">
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
                                    {store.breed.map(breed =>(
                                            <tr key={breed.id} >
                                            <td> <p>{breed.name}</p> </td>
                                            <td><p>{breed.type}</p></td>
                                            <td>
                                            <button onClick={() => handleDeleteBreed(breed.id)} className="btn btn-danger">
                                                    <i className="fas fa-trash-alt"></i> 
                                                </button>
                                            </td>
                                            <td>
                                            <button onClick={() => handleEditClick(breed)} className="btn btn-primary">
                                            <i className="fa-solid fa-pen-to-square"></i>
                                                </button>
                                            </td>
                                            </tr>
                                    ))}
                                    </tbody>
                                </table>

                                <div className="container bg-dark p-3">
                                    <form className="row g-3 p-3 bg-light rounded m-3" onSubmit={handleSubmit}>
                                        <h1 className="text-center p-3">{editMode ? "Editar Raza" : "Registrar Raza"}</h1>
                                        <div className="col-12">
                                            <label htmlFor="inputName" className="form-label">Name</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="inputName" 
                                                placeholder="your name" 
                                                value={editMode ? editName : name}
                                                onChange={(e) => editMode ? setEditName(e.target.value) : setName(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <label htmlFor="inputType" className="form-label">Type</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="inputType" 
                                                placeholder="your type"
                                                value={editMode ? editType : type}
                                                onChange={(e) => editMode ? setEditType(e.target.value) : setType(e.target.value)}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <button type="submit" className="btn btn-primary">{editMode ? "Guardar Cambios" : "Registrar"}</button>
                                        </div>
                                    </form>
                                </div>
                        </form>
                    </div>
                </div>    
            </div>
        </section>
    );
};
