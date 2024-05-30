import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams } from 'react-router-dom';

export const OnePet = () => {
    const { petId } = useParams();
    const { store, actions } = useContext(Context);
    const [petDetails, setPetDetails] = useState({
        name: '',
        age: '',
        sex: '',
        pedigree: false
    });
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
    
        const fetchPetDetails = async () => {
            try {
                const pet = await actions.getPetDetails(petId);
                if (isMounted && pet) {
                    setPetDetails(pet);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch pet details:", error);
                    setErrorMessage('Failed to fetch pet details. Please try again.');
                }
            }
        };
        fetchPetDetails();
    
        return () => {
            isMounted = false;
        };
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;
        setPetDetails({
            ...petDetails,
            [name]: value
        });
    };

    const handleFileChange = e => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await actions.updatePet(petId, petDetails);
            if (file) {
                await actions.uploadPetPhoto(petId, file);
            }
            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            setErrorMessage('Failed to update pet or upload photo. Please try again.');
        }
    };

    return (
        <div>
            <h2>Editar Mascota</h2>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" value={petDetails.name} onChange={handleChange} placeholder="Nombre" />
                <input type="number" name="age" value={petDetails.age} onChange={handleChange} placeholder="Edad" />
                <select name="sex" value={petDetails.sex} onChange={handleChange}>
                    <option value="Male">Macho</option>
                    <option value="Female">Hembra</option>
                </select>
                <label>
                    Pedigree:
                    <input type="checkbox" name="pedigree" checked={petDetails.pedigree} onChange={handleChange} />
                </label>
                <input type="file" onChange={handleFileChange} />
                <button type="submit">Actualizar Mascota</button>
            </form>
            {isLoading && <div>Cargando...</div>}
            {store.petProfilePictureUrl && <img src={store.petProfilePictureUrl} alt="Mascota" />}
        </div>
    );
};
