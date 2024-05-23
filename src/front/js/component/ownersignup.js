import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import { Context } from "../store/appContext";

export const OwnerSignup = () => {
	const { store, actions } = useContext(Context);

    const handleSubmit = (e) => {
        e.preventDefault();
        actions.SignUp(email, password);
    };

	return (
		<div className="container bg-dark p-3">
						<form className="row g-3 p-3 bg-light rounded m-3" onSubmit={handleSubmit}>
                            <h1 className="text-center p-3">Fill the form and sign up!</h1>
                            <div className="col-12">
                                <label for="inputName" className="form-label">Name</label>
                                <input type="text" className="form-control" id="inputName" placeholder="your name"/>
                            </div>
                            
                            <div className="col-md-6">
                                <label for="inputEmail4" className="form-label">Email</label>
                                <input type="email" className="form-control" id="inputEmail4"/>
                            </div>
                            <div className="col-md-6">
                                <label for="inputPassword4" className="form-label">Password</label>
                                <input type="password" className="form-control" id="inputPassword4"/>
                            </div>
                            
                            <div className="col-md-4">
                                <label for="inputState" className="form-label">State</label>
                                <select id="inputState" className="form-select">
                                <option selected>Choose an option</option>
                                    <option value="A Coruña">A Coruña</option>
                                    <option value="Álava">Álava</option>
                                    <option value="Albacete">Albacete</option>
                                    <option value="Alicante">Alicante</option>
                                    <option value="Almería">Almería</option>
                                    <option value="Asturias">Asturias</option>
                                    <option value="Ávila">Ávila</option>
                                    <option value="Badajoz">Badajoz</option>
                                    <option value="Baleares">Baleares</option>
                                    <option value="Barcelona">Barcelona</option>
                                    <option value="Burgos">Burgos</option>
                                    <option value="Cáceres">Cáceres</option>
                                    <option value="Cádiz">Cádiz</option>
                                    <option value="Cantabria">Cantabria</option>
                                    <option value="Castellón">Castellón</option>
                                    <option value="Ceuta">Ceuta</option>
                                    <option value="Ciudad Real">Ciudad Real</option>
                                    <option value="Córdoba">Córdoba</option>
                                    <option value="Cuenca">Cuenca</option>
                                    <option value="Girona">Girona</option>
                                    <option value="Granada">Granada</option>
                                    <option value="Guadalajara">Guadalajara</option>
                                    <option value="Guipúzcoa">Guipúzcoa</option>
                                    <option value="Huelva">Huelva</option>
                                    <option value="Huesca">Huesca</option>
                                    <option value="Jaén">Jaén</option>
                                    <option value="La Rioja">La Rioja</option>
                                    <option value="Las Palmas">Las Palmas</option>
                                    <option value="León">León</option>
                                    <option value="Lleida">Lleida</option>
                                    <option value="Lugo">Lugo</option>
                                    <option value="Madrid">Madrid</option>
                                    <option value="Málaga">Málaga</option>
                                    <option value="Melilla">Melilla</option>
                                    <option value="Murcia">Murcia</option>
                                    <option value="Navarra">Navarra</option>
                                    <option value="Ourense">Ourense</option>
                                    <option value="Palencia">Palencia</option>
                                    <option value="Pontevedra">Pontevedra</option>
                                    <option value="Salamanca">Salamanca</option>
                                    <option value="Santa Cruz de Tenerife">Santa Cruz de Tenerife</option>
                                    <option value="Segovia">Segovia</option>
                                    <option value="Sevilla">Sevilla</option>
                                    <option value="Soria">Soria</option>
                                    <option value="Tarragona">Tarragona</option>
                                    <option value="Teruel">Teruel</option>
                                    <option value="Toledo">Toledo</option>
                                    <option value="Valencia">Valencia</option>
                                    <option value="Valladolid">Valladolid</option>
                                    <option value="Vizcaya">Vizcaya</option>
                                    <option value="Zamora">Zamora</option>
                                    <option value="Zaragoza">Zaragoza</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label for="inputCity" className="form-label">City</label>
                                <input type="text" className="form-control" id="inputCity"/>
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