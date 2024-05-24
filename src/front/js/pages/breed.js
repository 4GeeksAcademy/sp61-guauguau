import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const Demo = () => {
	const { store, actions } = useContext(Context);
	useEffect(() => {
		actions.getBreed();
	  }, []);

	return (
		<div className="container">
			<h1>Añade la raza de tu perro</h1>
			<form>
				<input  placeholder="ID" >
				</input>
				<input  placeholder="añade tu raza">
				</input>
				<input  placeholder="tipo">
				</input>
			</form>
			<table className="table">
				<thead>
					<tr>
						<th>Raza</th>
						<th>Pet Firendly</th>
					</tr>
				</thead>

			</table>
			
		</div>
	);
};
