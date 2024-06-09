import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import perroImage from "../../img/perro4.png";
import "../../styles/home.css";
import { ApiBreed } from "./apiBreed";
import { CardContainer } from "./cardContainer";
import { PetsFinder } from "./finder";
import { Team } from "./team";

export const Home = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="text-center">
            <div className="container-home">
                
                <div className="jumbotron p-4 p-md-5">
                    <div className="row jumbo-contain">
                        <div className="col-md-6 px-0">
                            <h1 className="display-4 main-text">Connect Your Dog with New Friends<br/>Join Our Community Today!</h1>
                            <p className="lead my-3">
                                <button className="btn btn-multicolor m-2 ps-5 pe-5">Login</button>
                                <button className="btn btn-multicolor-border m-2 ps-5 pe-5">Signup</button>
                            </p>
                        </div>
                        <div className="col-md-6 main-img">
                            <div className="image-container">
                                <img src="https://img.freepik.com/foto-gratis/pareja-joven-caminando-sus-bulldogs-franceses-parque_1303-17957.jpg" alt="Imagen con máscara de recorte"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
			<PetsFinder />
            <CardContainer />

			<div className="jumbotron-container">
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

           
            <div className="alert alert-info">
                {store.message || "Loading message from the backend (make sure your python backend is running)..."}
            </div>
            
        </div>
    );
};
