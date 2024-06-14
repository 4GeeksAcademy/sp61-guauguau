import React from 'react';
import '../../styles/home.css'; // Asegúrate de que esta ruta sea correcta
import Juan from "/public/juan.jpg";
import Estrella from "/public/estrella.jpg";
import Pedro from "/public/pedro.jpg";
import Cris from "/public/fotoCris.jpg";

const teamMembers = [
    {
        name: "Juan",
        imgSrc: Juan,
        github:"https://github.com/Mogurkazan",
        linkedin:"https://www.linkedin.com/in/juan-antonio-cortes-elrio-a6a58145/",
    },
    {
        name: "Estrella",
        imgSrc: Estrella,
        github:"https://github.com/Llitabb",
        linkedin:"https://www.linkedin.com/in/estrella-benítez-buitrago/",
    },
    {
        name: "Pedro",
        imgSrc: Pedro,
        github:"https://github.com/jppe1994",
        linkedin:"https://www.linkedin.com/in/pedro-abel-mendoza-alcivar-2545bba7",
    },
    {
        name: "Cris",
        imgSrc: Cris,
        github: "https://github.com/CrisMachuca",
        linkedin: "https://www.linkedin.com/in/cristina-machuca-martínez-5636b2274/",
    }
];

export const Team = () => {
    return (
        <div className="container team-container">
            <div className="team-header">
                <h1 className='mt-3 p-3'>Know the developers</h1>
            </div>
            <div className="team-row">
                {teamMembers.map((member, index) => (
                    <div key={index} className="team-member">
                        <div className="image-circle">
                            <img src={member.imgSrc} alt={member.name} className="team-img"/>
                        </div>
                        <h4 className="team-name">{member.name}</h4>
                        <div className="team-links">
                            <a href={member.github} className='team-github' target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-github"></i>
                            </a>
                            <a href={member.linkedin} className='team-linkedin' target="_blank" rel="noopener noreferrer">
                                <i className="fab fa-linkedin"></i>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
