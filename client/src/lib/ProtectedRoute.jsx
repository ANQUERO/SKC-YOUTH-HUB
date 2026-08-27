import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser, activeRole, loading } = useAuthContext();
  const location = useLocation();

  if (loading) return null;

  if (!authUser)
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(activeRole))
    return <Navigate to="/" replace />;

  return children;
};
