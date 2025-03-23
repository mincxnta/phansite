import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Login } from "./components/auth/Login.jsx";
import { Profile } from "./components/user/Profile.jsx";
import { Register } from "./components/auth/Register.jsx";
import { AddRequest } from "./components/request/AddRequest.jsx";
import { Admin } from "./components/admin/Admin.jsx";
import { CreateUser } from "./components/admin/CreateUser.jsx";
import { UpdateUser } from "./components/user/UpdateUser.jsx";
import { ROUTES } from "./constants/routes.js";

export const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.PROFILE} element={<Profile />} />
                <Route path={ROUTES.USER_PROFILE} element={<Profile />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.ADD_REQUEST} element={<AddRequest />} />
                <Route path={ROUTES.ADMIN} element={<Admin />} />
                <Route path={ROUTES.CREATE_USER} element={<CreateUser />} />
                <Route path={ROUTES.EDIT_PROFILE} element={<UpdateUser />} />
            </Routes>
        </Router>
    );
}