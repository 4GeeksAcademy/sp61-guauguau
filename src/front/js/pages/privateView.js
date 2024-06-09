import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import perroImage from "../../img/perro4.png";
import "../../styles/home.css";
import { ApiBreed } from "./apiBreed";
import { CardContainer } from "./cardContainer";
import { Pets } from "./pets";
import { PetsFinder } from "./finder";
import { Team } from "./team";

export const PrivateView = () => {
    const { store, actions } = useContext(Context);

    return (
        <div className="container text-center">
            
            <Pets />
			<PetsFinder />
            

			

			

           
            
            
        </div>
    );
};
