import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Login } from "./components/auth/Login.jsx";
import { UserProfile } from "./components/user/UserProfile.jsx";
import { Register } from "./components/auth/Register.jsx";
import { CreateRequest } from "./components/request/CreateRequest.jsx";
import { AdminPanel } from "./components/admin/AdminPanel.jsx";
import { UserCreateForm } from "./components/admin/UserCreateForm.jsx";
import { UpdateUser } from "./components/user/UpdateUser.jsx";
import { ROUTES } from "./constants/routes.js";
import { RequestList } from "./components/request/RequestList.jsx";
import { RequestDetail } from "./components/request/RequestDetail.jsx";
import { Layout } from "./components/Layout.jsx";
import { PollCreateForm } from "./components/poll/PollCreateForm.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { ReportList } from "./components/report/ReportList.jsx";
import { ThiefPanel } from "./components/thieves/ThievesPanel.jsx";

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
                <Route path={ROUTES.ADD_REQUEST} element={<ProtectedRoute role="fan"><CreateRequest /></ProtectedRoute>} />
                <Route path={ROUTES.REQUEST_DETAILS} element={<RequestDetail />} />
                <Route path={ROUTES.ADMIN} element={<ProtectedRoute role="admin"><AdminPanel /></ProtectedRoute>} />
                <Route path={ROUTES.CREATE_USER} element={<ProtectedRoute role="admin"><UserCreateForm /></ProtectedRoute>} />
                <Route path={ROUTES.EDIT_PROFILE} element={<UpdateUser />} />
                <Route path={ROUTES.ADD_POLL} element={<ProtectedRoute role="admin"><PollCreateForm /></ProtectedRoute>} />
                <Route path={ROUTES.REPORT_LIST} element={<ProtectedRoute role="admin"><ReportList /></ProtectedRoute>} />
                <Route path={ROUTES.THIEVES} element={<ProtectedRoute role="phantom_thief"><ThiefPanel /></ProtectedRoute>} />
            </Route>
        </Routes>
    );
}