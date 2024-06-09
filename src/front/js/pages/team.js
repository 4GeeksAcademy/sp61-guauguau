import React from 'react';
import '../../styles/home.css'; // Asegúrate de que esta ruta sea correcta

const teamMembers = [
    {
        name: "Juan",
        imgSrc: "https://img.freepik.com/foto-gratis/hombre-feliz-pie-playa_107420-9868.jpg?t=st=1717894016~exp=1717897616~hmac=6d76c1b62095073a1fdda1ec136dc1fd455b7ff03cce0c62fc6bf5d97e9ba9ac&w=1800" // Reemplaza con la ruta correcta
    },
    {
        name: "Estrella",
        imgSrc: "https://img.freepik.com/foto-gratis/mujer-hermosa-joven-mirando-camara-chica-moda-verano-casual-camiseta-blanca-pantalones-cortos-hembra-positiva-muestra-emociones-faciales-modelo-divertido-aislado-amarillo_158538-15796.jpg?t=st=1717893953~exp=1717897553~hmac=c5066d3aa8ec3166728e4a2946c6f65eb8b943afe4459edb36f1513e891652ca&w=1380" // Reemplaza con la ruta correcta
    },
    {
        name: "Pedro",
        imgSrc: "https://img.freepik.com/foto-gratis/joven-barbudo-camisa-rayas_273609-5677.jpg?t=st=1717894038~exp=1717897638~hmac=8773ff51e02780af286624c6d7aac08e1ae181f2e0ba0e669ec74639a6cb7241&w=1800" // Reemplaza con la ruta correcta
    },
    {
        name: "Cris",
        imgSrc: "https://img.freepik.com/foto-gratis/chica-agradable-cabello-castano-brillante-sonriendo-foto-interior-dama-caucasica-pie-brazos-cruzados_197531-9395.jpg?t=st=1717893991~exp=1717897591~hmac=021871108b29ed3f88e0576cc0599c837b25aea01bdff971bede33e2926b97bb&w=1800" // Reemplaza con la ruta correcta
    }
];

export const Team = () => {
    return (
        
        
        <div className="team-container">
        <h1 className='mt-3 p-3'>Know the developers</h1>
            {teamMembers.map((member, index) => (
                <div key={index} className="team-member">
                    <div className="image-circle">
                        <img src={member.imgSrc} alt={member.name} className="team-img"/>
                    </div>
                    <h4 className="team-name">{member.name}</h4>
                </div>
            ))}
        </div>
        
    );
};
