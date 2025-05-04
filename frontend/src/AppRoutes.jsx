import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./views/layout/Home.jsx";
import { Login } from "./views/auth/Login.jsx";
import { UserProfile } from "./views/user/UserProfile.jsx";
import { Register } from "./views/auth/Register.jsx";
import { CreateRequest } from "./views/request/CreateRequest.jsx";
import { UserCreateForm } from "./views/admin/UserCreateForm.jsx";
import { UpdateUser } from "./views/user/UpdateUser.jsx";
import { ROUTES } from "./constants/routes.js";
import { RequestList } from "./views/request/RequestList.jsx";
import { RequestDetail } from "./views/request/RequestDetail.jsx";
import { Layout } from "./views/layout/Layout.jsx";
import { PollCreateForm } from "./views/poll/PollCreateForm.jsx";
import { ProtectedRoute } from "./views/routes/ProtectedRoute.jsx";
import { ReportList } from "./views/report/ReportList.jsx";
import { ThiefPanel } from "./views/thieves/ThievesPanel.jsx";
import { UserList } from "./views/admin/UserList.jsx";
import { ChatList } from "./views/chat/ChatList.jsx";
import { Chat } from "./views/chat/Chat.jsx";
import { VerifyEmail } from "./views/auth/VerifyEmail.jsx";
import { ForgotPassword } from "./views/auth/ForgotPassword.jsx";
import { ResetPassword } from "./views/auth/ResetPassword.jsx";
import { Polls } from "./views/poll/Polls.jsx";

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
                <Route path={ROUTES.USER_LIST} element={<ProtectedRoute role="admin"><UserList /></ProtectedRoute>} />
                <Route path={ROUTES.CREATE_USER} element={<ProtectedRoute role="admin"><UserCreateForm /></ProtectedRoute>} />
                <Route path={ROUTES.EDIT_PROFILE} element={<UpdateUser />} />
                <Route path={ROUTES.ADD_POLL} element={<ProtectedRoute role="admin"><PollCreateForm /></ProtectedRoute>} />
                <Route path={ROUTES.REPORT_LIST} element={<ProtectedRoute role="admin"><ReportList /></ProtectedRoute>} />
                <Route path={ROUTES.THIEVES} element={<ProtectedRoute role="phantom_thief"><ThiefPanel /></ProtectedRoute>} />
                <Route path={ROUTES.CHAT_LIST} element={<ProtectedRoute><ChatList /></ProtectedRoute>} />
                <Route path={ROUTES.CHAT} element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                <Route path={ROUTES.VERIFY_EMAIL} element={<VerifyEmail />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
                <Route path={ROUTES.POLLS} element={<Polls/>} />
            </Route>
        </Routes>
    );
}