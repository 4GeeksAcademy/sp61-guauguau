import React from "react";
import { Link } from "react-router-dom";

export const Navbar = () => {
	return (
		<nav className="navbar navbar-light bg-light">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">React Boilerplate</span>
				</Link>
				<div className="ml-auto">
					<Link to="/demo">
						<button className="btn btn-primary">Check the Context in action</button>
					</Link>
					<Link to="/login">
						<button className="btn btn-warning m-2">Owner Login</button>
					</Link>
					<Link to="/ownersignup">
						<button className="btn btn-warning m-2">Owner Signup</button>
					</Link>
					<Link to="/showowners">
						<button className="btn btn-warning m-2">View Owners</button>
					</Link>
					<Link to="/city">
						<button className="btn btn-warning m-2">View Cities</button>
          			</Link>
					<Link to="/pets">
						<button className="btn btn-warning m-2">View Pets</button>
					</Link>
					<Link to="/petSignUp">
						<button className="btn btn-warning m-2">Pet SignUp</button>
					</Link>
					<Link to="/adminlogin">
                        <button className="btn btn-warning m-2">Admin Login</button>
                    </Link>
					<Link to="/adminsignup">
						<button className="btn btn-warning m-2">Admin SignUp</button>
					</Link>
					<Link to="/breed">
						<button className="btn btn-warning m-2">Agrega Raza</button>
					</Link>
					<Link to="/photo">
						<button className="btn btn-warning m-2">Agrega Fotos</button>
					</Link>
				</div>
				
			</div>
		</nav>
	);
};
