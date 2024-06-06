import React from "react";


export const Footer = () => (
  <footer className="footer mt-auto">
    <div className="footer-top">
      <div className="jumbotron text-white">
        <h1>They Met On Guau...Guau </h1>
        <p>Please share your story with us! We need our a daily love fix.</p>
        <button className="btn btn-pink">Coming Soon</button>
      </div>
    </div>
    <div className="footer-middle text-white">
      <ul>
        <li>About Us</li>
        <li>Política de Privacidad</li>
        <li>Contacto</li>
      </ul>
    </div>
    <div className="footer-bottom text-center">
      <div className="footer-logo">
        <img src="https://img.freepik.com/vector-gratis/esquema-impresion-pata-corazon-rojo_78370-2364.jpg?t=st=1717710854~exp=1717714454~hmac=a166f636a220e99be9dfaba6763470e85fff62f8dd88d115c8b53c06db696f1e&w=740" alt="Logo" />
        <span>¡Guau...Guau!</span>
      </div>
      <div className="footer-text">
        Made with <i className="fa fa-heart text-danger" /> by{" "}
        <a href="http://www.4geeksacademy.com">4Geeks Academy</a>
      </div>
      <div className="footer-icons">
	  	<i className="fa-brands fa-github"></i>
		<i className="fa-brands fa-instagram"></i>
		<i className="fa-brands fa-facebook"></i>
      </div>
    </div>
  </footer>
);
