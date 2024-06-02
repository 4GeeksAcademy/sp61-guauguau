import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../store/appContext';
import { useParams, Link } from 'react-router-dom';

export const SingleOwner = () => {
    const { ownerId } = useParams();
    const { store, actions } = useContext(Context);
    const [ownerDetails, setOwnerDetails] = useState({
        name: '',
        description: '',
        pets: [],
        profile_picture_url: ''
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [isMounted, setIsMounted] = useState(true);

    useEffect(() => {
        setIsMounted(true);

        const fetchOwnerDetails = async () => {
            try {
                const owner = await actions.getOwnerDetails(ownerId);
                if (isMounted) {
                    setOwnerDetails({
                        name: owner.name || '',
                        description: owner.description || '',
                        pets: owner.pets || [],
                        profile_picture_url: owner.profile_picture_url || ''
                    });
                }
            } catch (error) {
                console.error("Failed to fetch owner details:", error);
                if (isMounted) {
                    setErrorMessage('Failed to fetch owner details. Please try again.');
                }
            }
        };
        fetchOwnerDetails();

        return () => {
            setIsMounted(false);
        };
    }, [ownerId]);

    return (
        <div className="container">
            <h2 className='p-5 ps-0'>{ownerDetails.name}</h2>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <div className="row">
                <div className="col-md-4">
                    {ownerDetails.profile_picture_url && (
                        <img src={ownerDetails.profile_picture_url} alt="Owner Profile" className="img-thumbnail w-100 mb-3" />
                    )}
                </div>
                <div className="col-md-8">
                    <div className="mb-2">
                        <label className="me-2">Description:</label>
                        <span className="me-2">{ownerDetails.description}</span>
                    </div>
                    <h3>Pets</h3>
                    <div className="row">
                        {ownerDetails.pets.map(pet => (
                            <div key={pet.id} className="col-md-4 mb-4">
                                <div className="card h-100">
                                    {pet.profile_photo_url && <img src={pet.profile_photo_url} className="card-img-top" alt={pet.name} />}
                                    <div className="card-body">
                                        <h4 className="card-title">{pet.name}</h4>
                                        <p className="card-text">Breed: {pet.breed}</p>
                                        <p className="card-text">Sex: {pet.sex}</p>
                                        <p className="card-text">Age: {pet.age}</p>
                                        <p className="card-text">Pedigree: {pet.pedigree ? "Yes" : "No"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Link to="/owners" className="btn btn-secondary mt-3">
                <i className="fas fa-arrow-left"></i> Back to the list of owners
            </Link>
        </div>
    );
};
