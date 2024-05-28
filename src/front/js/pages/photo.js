import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

export const Photo = () => {
    const { store, actions } = useContext(Context);
    const [file, setFile] = useState(null);

    useEffect(() => {
        actions.getPhoto();
    }, [actions]);

    const handleDeletePhoto = photoId => {
        actions.deletePhoto(photoId); 
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (file) {
            actions.uploadPhoto(file);
        }
    };

    return (
        <div className="container">
           <h1>Listar URL</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>URL</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                {store.photo.map(photo => (
                    <tr key={photo.id}>
                        <td> <p>{photo.url}</p> </td>
                        <td>
                            <button onClick={() => handleDeletePhoto(photo.id)} className="btn btn-danger">
                                <i className="fas fa-trash-alt"></i> 
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <form onSubmit={handleUpload}>
                <div className="form-group">
                    <label htmlFor="fileInput">Subir Archivo</label>
                    <input type="file" className="form-control" id="fileInput" onChange={handleFileChange} />
                </div>
                <button type="submit" className="btn btn-primary" id="SubirArchivo">
                    <i className="fa-solid fa-upload"></i> enviar
                </button>
            </form>
        </div>
    );
};
