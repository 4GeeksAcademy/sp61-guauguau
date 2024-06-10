import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";
import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import Login from "./pages/login";
import { Private } from "./pages/private";
import { PrivateView } from "./pages/privateView";
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
import { SinglePet } from "./pages/singlePet";
import { SingleOwner } from "./pages/singleOwner";
import { EditCity } from "./pages/editcity";
import { Photo } from "./pages/photo";
import { AdminLogin } from "./pages/adminlogin";  // Importación correcta del componente
import { AdminSignUp } from "./pages/adminsignup";
import { AdminPrivate } from "./pages/adminprivate";  // Importación correcta del componente
import { EditAdmin } from "./pages/editadmin";
import { PetsFinder } from "./pages/finder";
import { Chat } from "./pages/chat";

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
                        <Route element={<Breed />} path="/breed" />
                        <Route element={<Photo />} path="/photo" />
                        <Route element={<SinglePet />} path="/singlepet/:petId" />
                        <Route element={<SingleOwner />} path="/singleowner/:ownerId" />
                        <Route element={<OnePet />} path="/pet/:petId" />
                        <Route element={<PetSignUp />} path="/petSignUp" />
                        <Route element={<OwnerSignUp />} path="/ownersignup" />
                        <Route element={<ShowOwners />} path="/showowners" />
                        <Route element={<Login />} path="/login" />
                        <Route element={<Private />} path="/private" />
                        <Route element={<PrivateView />} path="/privateView" />
                        <Route element={<City />} path="/city" />
                        <Route element={<EditCity />} path="/editcity/:id" />
                        <Route element={<Pets />} path="/pets" />
                        <Route element={<Chat />} path="/chat/:matchId" />
                        <Route element={<PetsFinder />} path="/petsfinder" />
                        <Route element={<Single />} path="/single/:theid" />
                        <Route element={<EditOwner />} path="/editowner/:ownerId" />                       
                        <Route element={<AdminLogin />} path="/adminlogin" />
                        <Route element={<AdminSignUp />} path="/adminsignup" />
                        <Route element={<AdminPrivate />} path="/adminprivate" />
                        <Route element={<EditAdmin />} path="/editadmin/:adminId" />
                        <Route element={<h1>Not found!</h1>} path="*" />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
