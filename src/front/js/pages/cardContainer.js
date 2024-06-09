import React from 'react';
import { Link } from "react-router-dom";

export const CardContainer = () => {
    return (
        <div className="card-container mt-4">
            <div className="row">
                <div className="col-md-3 mb-3">
                    <div className="card card-bg-1 p-0">
                        <div className="card-body card-body-container d-flex flex-row">
                            <div>
                                <i className="fa-solid fa-location-dot card-icon"></i>
                            </div>
                            <div className="pe-3">
                                <h3 className="card-title pb-2">Find</h3>
                                <p className="card-text-home">Locate and connect with dogs in your area.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card card-bg-2 p-0">
                        <div className="card-body card-body-container d-flex flex-row">
                            <div>
                                <i className="fa-solid fa-hand-holding-medical card-icon"></i>
                            </div>
                            <div className="pe-3">
                                <h3 className="card-title">Care</h3>
                                <p className="card-text-home">Learn about compatibility and the best care for your pet.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card card-bg-3 p-0">
                        <div className="card-body card-body-container d-flex flex-row">
                            <div>
                                <i className="fa-solid fa-comments card-icon"></i>
                            </div>
                            <div className="pe-3">
                                <h3 className="card-title">Chat</h3>
                                <p className="card-text-home">Chat with their owners when you make a match.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-3 mb-3">
                    <div className="card card-bg-4 p-0">
                        <div className="card-body  card-body-container d-flex flex-row">
                            <div>
                                <i className="fa-solid fa-magnifying-glass card-icon"></i>
                            </div>
                            <div className="pe-3">
                                <h3 className="card-title">Explore</h3>
                                <p className="card-text-home">Discover a world full of pets and new friendships.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
