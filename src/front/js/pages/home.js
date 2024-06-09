import React, { useContext } from "react";
import { Context } from "../store/appContext";
import logoGuauuGuauu from "../../img/logo.png";
import "../../styles/home.css";
import { ApiBreed } from "./apiBreed";

export const Home = () => {
	const { store, actions } = useContext(Context);
	
	return (
		
		<div className="text-center mt-5">
			

			<p>
				<img src={logoGuauuGuauu} />
			</p>
			<div className="alert alert-info">
				{store.message || "Loading message from the backend (make sure your python backend is running)..."}
			</div>
			<p>
				This boilerplate comes with lots of documentation:{" "}
				<a href="https://start.4geeksacademy.com/starters/react-flask">
					Read documentation
				</a>
			</p>
		</div>
	);
};
