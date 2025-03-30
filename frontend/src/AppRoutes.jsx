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
import { RequestList } from "./components/request/RequestList.jsx";
import { RequestDetail } from "./components/request/RequestDetail.jsx";
import { Layout } from "./components/Layout.jsx";
import { AddPoll } from "./components/poll/AddPoll.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";

export const AppRoutes = () => {
    return (
        <AuthProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path={ROUTES.USER_PROFILE} element={<Profile />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />
                    <Route path={ROUTES.REQUEST_LIST} element={<RequestList />} />
                    <Route path={ROUTES.ADD_REQUEST} element={<AddRequest />} />
                    <Route path={ROUTES.REQUEST_DETAILS} element={<RequestDetail />} />
                    <Route path={ROUTES.ADMIN} element={<ProtectedRoute role="admin"><Admin /></ProtectedRoute>} />
                    <Route path={ROUTES.CREATE_USER} element={<CreateUser />} />
                    <Route path={ROUTES.EDIT_PROFILE} element={<UpdateUser />} />
                    <Route path={ROUTES.ADD_POLL} element={<AddPoll/>}/>
                </Route>
            </Routes>
        </Router>
        </AuthProvider>
    );
}