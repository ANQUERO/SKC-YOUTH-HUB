// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthContext } from "@context/AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
    const location = useLocation();
    const { authUser, activeRole } = useAuthContext();

    const isAuthenticated = Boolean(authUser?.verified || authUser);
    const isAuthorized = !allowedRoles || allowedRoles.includes(activeRole);

    if (!isAuthenticated || !isAuthorized) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children || <Outlet />;
};

export default ProtectedRoute;
