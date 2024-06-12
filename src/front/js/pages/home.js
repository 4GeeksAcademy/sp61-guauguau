import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";

import salchichas from "../../img/salchichas.png";
import corazonesrojos from "../../img/corazonesrojos.png";


import "../../styles/home.css";


import { PetsFinder } from "./finder";
import { Team } from "./team";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="container-fluid text-center">
            <header>
                <div className="row justify-content-center">
                    <div className="col-lg-11">
                        <div className="row">
                            <div className="col-xxl-6 col-xl-5 d-flex align-items-center">
                                <div className="banner-content">
                                    <h1 className="display-4 main-text">Connect Your <span className="dog-title">Dog</span> with New Friends<br/>Join Our Community Today!</h1>
                                        <p className="lead my-4">
                                            <Link to="/login">
                                                <button className="btn btn-multicolor ps-5 pe-5">Login</button>
                                            </Link>
                                            <Link to="/ownersignup">
                                                <button className="btn btn-multicolor-border ps-5 pe-5">Signup</button>
                                            </Link>
                                        </p>
                                </div>
                            </div>
                            <div className="col-xxl-6 col-xl-7 d-flex align-items-center justify-content-md-start justify-content-center">
                                <div className="banner-img">
                                    <img className="img-fluid salchichas" src={salchichas} alt=""/>
                                    <img src={corazonesrojos} alt="Imagen de fondo" className="img-fluid corazones" />
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            
			<PetsFinder />
            

			<div className=" container-fluid jumbotron-container">
            <div className="jumbotron-content">
                <div className="jumbotron-image">
                    <img src={"https://img.freepik.com/foto-gratis/hermosa-mujer-morena-juega-dos-perros-shiba-inu-mira-otro-lado-piensa-como-alimentar-mascotas-ensenar-comandos-expresa-caricias-aisladas-sobre-fondo-rosa_273609-34195.jpg?t=st=1717894956~exp=1717898556~hmac=3f05cee4ff23049d132967897d049f4c37a01c52fecab0d36b786904197c133a&w=1800"} alt="title" />
                </div>
                <div className="jumbotron-text">
                    <h1>We Are Providing Pet Care</h1>
                    <h3>"With our advanced AI technology, you can access real-time advice on the best care for your pet. Whether it's nutrition, exercise, or general wellness, our AI-driven insights provide you with the latest and most accurate information. Visit the pet pages to discover how you can enhance your pet's well-being and ensure they live a happy, healthy life."</h3>
                </div>
            </div>
        </div>

			<Team />

           
            
            
        </div>
    );
};
