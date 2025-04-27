import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./components/Home.jsx";
import { Login } from "./components/auth/Login.jsx";
import { UserProfile } from "./components/user/UserProfile.jsx";
import { Register } from "./components/auth/Register.jsx";
import { CreateRequest } from "./components/request/CreateRequest.jsx";
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
import { UserList } from "./components/admin/UserList.jsx";
import { ChatList } from "./components/chat/ChatList.jsx";
import { Chat } from "./components/chat/Chat.jsx";
import { VerifyEmail } from "./components/auth/VerifyEmail.jsx";
import { ForgotPassword } from "./components/auth/ForgotPassword.jsx";
import { ResetPassword } from "./components/auth/ResetPassword.jsx";

export const AppRoutes = ({ isMuted, toggleMute, volume, setVolume }) => {
    return (
        <Routes>
            <Route path="/" element={<Layout isMuted={isMuted} toggleMute={toggleMute} volume={volume} setVolume={setVolume}/>}>
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
            </Route>
        </Routes>
    );
}