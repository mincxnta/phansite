import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Login } from "./components/Login.jsx";
import { Profile } from "./components/Profile.jsx";
import { Register } from "./components/Register.jsx";
import { AddRequest } from "./components/AddRequest.jsx";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/register" element={<Register />} />
                <Route path="/newrequest" element={<AddRequest />} />
            </Routes>
        </Router>
    );
}