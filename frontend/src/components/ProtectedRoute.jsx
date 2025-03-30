import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Loading...</p>;

    if (!user) return <Navigate to="/login" replace />;

    if (role && user.role !== role) return <Navigate to="/" replace />;

    return children ? children : <Outlet />;
};
