import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import {Loading} from '../../components/Loading.jsx'

export const ProtectedRoute = ({ children, role }) => {
    const { user, loading } = useAuth();

    if (loading) return <Loading/>;

    if (!user) return <Navigate to="/"/>;

    if (role && user.role !== role) return <Navigate to="/" replace />;

    return children ? children : <Outlet />;
};
