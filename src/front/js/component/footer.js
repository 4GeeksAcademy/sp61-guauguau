import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
	<footer className="footer mt-auto p-5 text-center">
		<div className="container">
			<div className="row footer-row">
				<div className="col-md-3">
					<h3 className="footer-title">Contacts</h3>
					<ul className="list-unstyled">
						<li><i className="fa fa-phone" /> Phone: +1 234 567 890</li>
						<li><i className="fa fa-envelope" /> Email: contact@example.com</li>
						<li><i className="fa fa-map-marker" /> Address: 1234 Street Name, City</li>
					</ul>
				</div>
				<div className="col-md-6">
					<h1>Want To Know<br/>More About Us?</h1>
					<button className="btn btn-multicolor mt-2 ps-5 pe-5">About Us</button>
				</div>
				<div className="col-md-3">
					<h3 className="footer-title">Our social networks:</h3>
					<ul className="list-unstyled">
						<li><i className="fa-brands fa-github" /> <a href="https://github.com">Github</a></li>
						<li><i className="fa-brands fa-linkedin" /> <a href="https://linkedin.com">LinkedIn</a></li>
						<li><i className="fa-brands fa-facebook" /> <a href="https://facebook.com">Facebook</a></li>
					</ul>
				</div>
			</div>
			
			<p className="mt-4 footer-text">
				Made with <i className="fa fa-heart text-danger" /> by{" "}
				<a href="http://www.4geeksacademy.com"className="geeks-footer">4Geeks Academy</a>
			</p>
			<div className="">
					<h5>Are you the admin?</h5>
					<Link to="/adminlogin" className="link-admin-login">Login</Link>
					
				</div>

		</div>
	</footer>
);
