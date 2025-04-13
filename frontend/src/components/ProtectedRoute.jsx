import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {Loading} from './Loading.jsx'

export const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <Loading/>;

    if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

    if (role && user.role !== role) return <Navigate to="/" replace />;

    return children ? children : <Outlet />;
};
