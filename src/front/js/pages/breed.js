import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ApiBreed } from "./apiBreed";
import { Autocomplete } from "./autocompletbreed";
import { AutocompleteType } from "./autocomplettype";

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



	const handleSubmit = (e) => {
		e.preventDefault();
		if ((editMode && !editName.trim()) || (!editMode && !name.trim()) || !type.trim()) {
			alert("Ambos campos son obligatorios.");
			return;
		}

		if (editMode) {
			actions.editBreed(editBreedId, { name: editName, type: editType ,life_span: editLife});
			setEditMode(false);
			setEditBreedId(null);
			setEditName("");
			setEditType("");
			setEditLife("");
		} else {
			actions.signUpBreed(name, type,life_span);
			setName("");
			setType("");
			setLifeSpan("");
		}
	};

	useEffect(() => {
		actions.getBreed();
	}, [actions]);

	const handleDeleteBreed = (breedId) => {
		actions.deleteBreed(breedId);
	};

	const handleEditClick = (breed) => {
		setEditMode(true);
		setEditBreedId(breed.id);
		setEditName(breed.name);
		setEditType(breed.type);
		setEditLife(breed.life_span);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	return (
		<div className="container">
			<div className="row flex-row flex-nowrap overflow-auto" id="ocultar">
				<ApiBreed />
			</div>

			<h1>Listar Razas</h1>
			<table className="table">
				<thead>
					<tr>
						<th>Nombre</th>
						<th>Tipo</th>
						<th>Esperanzade vida</th>
						<th>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{store.breed.map((breed) => (
						<tr key={breed.id}>
							<td>
								<p>{breed.name}</p>
							</td>
							<td>
								<p>{breed.type}</p>
							</td>
							<td>
								<p>{breed.life_span}</p>
							</td>
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
						<label htmlFor="inputName" className="form-label"></label>
						<Autocomplete onSelect={handleSelectBreed} />
						<input
							type="text"
							className="form-control"
							id="inputName"
							placeholder="Nombre"
							value={editMode ? editName : name}
							onChange={(e) => (editMode ? setEditName(e.target.value) : setName(e.target.value))}
							onKeyPress={handleKeyPress}
						/>
					</div>
					<div className="col-12">
						<label htmlFor="inputType" className="form-label"></label>
						
						<input
							type="text"
							className="form-control"
							id="inputType"
							placeholder="Tipo"
							value={editMode ? editType : type}
							onChange={(e) => (editMode ? setEditType(e.target.value) : setType(e.target.value))}
							onKeyPress={handleKeyPress}
						/>
					</div>
					<div className="col-12">
						<label htmlFor="inputLife" className="form-label"></label>
					
						<input
							type="text"
							className="form-control"
							id="inputLife"
							placeholder="Esperanza de Vida"
							value={editMode ? editLife : life_span}
							onChange={(e) => (editMode ? setEditLife(e.target.value) : setLifeSpan(e.target.value))}
							onKeyPress={handleKeyPress}
							
						/>
					</div>
					
					<div className="col-12">
						<button type="submit" className="btn btn-primary">
							{editMode ? "Guardar Cambios" : "Registrar"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
