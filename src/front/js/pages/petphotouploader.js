import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../store/appContext";



const PetPhotoUploader = ({ petId }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { actions, store } = useContext(Context); // Utiliza el contexto proporcionado por tu flujo de datos

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }
        setUploading(true);
        try {
            await actions.uploadPetPhoto(petId, selectedFile);
        } catch (error) {
            console.error('Error uploading photo:', error);
            alert('Error uploading photo.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={!selectedFile || uploading}>
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
            {store.petProfilePictureUrl && (
                <div>
                    <h3>Preview:</h3>
                    <img src={store.petProfilePictureUrl} alt="Pet" style={{ maxWidth: '200px', maxHeight: '200px' }} />
                </div>
            )}
        </div>
    );
};

export default PetPhotoUploader;