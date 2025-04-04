import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Login } from "./components/auth/Login.jsx";
import { Profile } from "./components/user/Profile.jsx";
import { Register } from "./components/auth/Register.jsx";
import { CreateRequest } from "./components/request/CreateRequest.jsx";
import { AdminPanel } from "./components/admin/AdminPanel.jsx";
import { CreateUser } from "./components/admin/CreateUser.jsx";
import { UpdateUser } from "./components/user/UpdateUser.jsx";
import { ROUTES } from "./constants/routes.js";
import { RequestList } from "./components/request/RequestList.jsx";
import { RequestDetail } from "./components/request/RequestDetail.jsx";
import { Layout } from "./components/Layout.jsx";
import { CreatePoll } from "./components/poll/CreatePoll.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { ReportList } from "./components/report/ReportList.jsx";
import { ThiefPanel } from "./components/thieves/ThievesPanel.jsx";

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path={ROUTES.LOGIN} element={<Login />} />
                <Route path={ROUTES.PROFILE} element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path={ROUTES.USER_PROFILE} element={<Profile />} />
                <Route path={ROUTES.REGISTER} element={<Register />} />
                <Route path={ROUTES.REQUEST_LIST} element={<RequestList />} />
                <Route path={ROUTES.ADD_REQUEST} element={<ProtectedRoute><CreateRequest /></ProtectedRoute>} />
                <Route path={ROUTES.REQUEST_DETAILS} element={<RequestDetail />} />
                <Route path={ROUTES.ADMIN} element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
                <Route path={ROUTES.CREATE_USER} element={<ProtectedRoute role="admin"><CreateUser /></ProtectedRoute>} />
                <Route path={ROUTES.EDIT_PROFILE} element={<UpdateUser />} />
                <Route path={ROUTES.ADD_POLL} element={<ProtectedRoute role="admin"><CreatePoll /></ProtectedRoute>} />
                <Route path={ROUTES.REPORT_LIST} element={<ProtectedRoute role="admin"><ReportList /></ProtectedRoute>} />
                <Route path={ROUTES.THIEVES} element={<ProtectedRoute role="phantom_thief"><ThiefPanel /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}