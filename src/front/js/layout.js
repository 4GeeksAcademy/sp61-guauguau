import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import Login from "./pages/login";
import { Private } from "./pages/private";
import { OwnerSignUp } from "./pages/ownersignup";
import { ShowOwners } from "./pages/showowners";
import { EditOwner } from "./pages/editowner";
import { Single } from "./pages/single";
import { City } from "./pages/city";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import { Pets } from "./pages/pets";

import { Breed } from "./pages/breed";

import { PetSignUp } from "./pages/petSignUp";
import { OnePet } from "./pages/onePet";

const Layout = () => {
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />                
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Breed/>} path="/breed" />
                        <Route element={<OnePet/>} path="/pet/:petId" />
                        <Route element={<PetSignUp/>} path="/petSignUp" />
                        <Route element={<OwnerSignup />} path="/ownersignup" />
                        <Route element={<ShowOwners />} path="/showowners" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Private />} path="/private" />
                        <Route element={<City/>} path="/city" />
                        <Route element={<Pets/>} path="/pets" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<EditOwner />} path="/editowner/:ownerId" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
