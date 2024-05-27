import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Breed = () => {
	const { store, actions } = useContext(Context);
    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editBreedId, setEditBreedId] = useState(null);
    const [editName, setEditName] = useState("");
    const [editType, setEditType] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editMode) {
            actions.editBreed(editBreedId, { name: editName, type: editType });
            setEditMode(false);
            setEditBreedId(null);
            setEditName("");
            setEditType("");
        } else {
            actions.signUpBreed(name, type);
            setName("");
            setType("");
        }
    };
	
    useEffect(() => {
        actions.getBreed();
    }, [actions]);
    
    const handleDeleteBreed = breedId => {
        actions.deleteBreed(breedId); 
    };

    const handleEditClick = (breed) => {
        setEditMode(true);
        setEditBreedId(breed.id);
        setEditName(breed.name);
        setEditType(breed.type);
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
        </div>
    );
};
