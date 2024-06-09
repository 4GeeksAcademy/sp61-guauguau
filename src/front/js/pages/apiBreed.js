
import React, { useEffect, useContext, useState } from "react";
import { Context } from "../store/appContext";


export const ApiBreed = () => {
    const { store, actions } = useContext(Context);
    const [loading, setLoading] = useState(true);



    useEffect(() => {
        const fetchData = async () => {
            await actions.BreedApi();
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (!store.raza || store.raza.length === 0) {
        return <div>No se encontraron datos de razas.</div>;
    }

    return (
        <table>
            <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Raza</th>
                    <th>Esperanza de vida</th>
                    <th>Imagen</th>
                </tr>
            </thead>
            <tbody>
                {store.raza.map((raza) => (
                    <tr key={raza.id}>
                        <td>{raza.breed_group}</td>
                        <td>{raza.name}</td>
                        <td>{raza.life_span}</td>
                        <td>{raza.reference_image_id}</td>

                    </tr>
                ))}
            </tbody>
        </table>
    );
};
