import React from "react";
import { BrowserRouter as Route, Routes } from "react-router-dom";
import { Home } from "./Home.jsx";
import { Login } from "./auth/Login.jsx";
import { UserProfile } from "./user/UserProfile.jsx";
import { Register } from "./auth/Register.jsx";
import { CreateRequest } from "./request/CreateRequest.jsx";
import { AdminPanel } from "./admin/AdminPanel.jsx";
import { CreateUser } from "./admin/CreateUser.jsx";
import { EditProfile } from "./user/EditProfile.jsx";
import { ROUTES } from "../constants/routes.js";
import { RequestList } from "./request/RequestList.jsx";
import { RequestDetail } from "./request/RequestDetail.jsx";
import { Layout } from "./Layout.jsx";
import { CreatePoll } from "./poll/CreatePoll.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";

export const AppRoutes = () => {
    return (
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path={ROUTES.LOGIN} element={<Login />} />
                    <Route path={ROUTES.PROFILE} element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path={ROUTES.USER_PROFILE} element={<UserProfile />} />
                    <Route path={ROUTES.REGISTER} element={<Register />} />
                    <Route path={ROUTES.REQUEST_LIST} element={<RequestList />} />
                    <Route path={ROUTES.ADD_REQUEST} element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
                    <Route path={ROUTES.REQUEST_DETAILS} element={<RequestDetail />} />
                    <Route path={ROUTES.ADMIN} element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
                    <Route path={ROUTES.CREATE_USER} element={<ProtectedRoute role="admin"><CreateUser /></ProtectedRoute>} />
                    <Route path={ROUTES.EDIT_PROFILE} element={<EditProfile />} />
                    <Route path={ROUTES.ADD_POLL} element={<ProtectedRoute role="admin"><CreatePoll/></ProtectedRoute>}/>
                </Route>
            </Routes>
    );
}