import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Login } from "./components/Login.jsx";
import { Perfil } from "./components/Perfil.jsx";
import { Register } from "./components/Register.jsx";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
}