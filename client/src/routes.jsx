import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import LandingPage from "@pages/LandingPage";
import Signin from "@pages/Signin";
import Signup from "@pages/Signup";
import ForgotPassword from "@pages/ForgotPasword";
import AdminAuth from "@pages/AdminAuth";

import NewsFeed from "@pages/NewsFeed";
import Authenticated from "@pages/Authenticated";
import Dashboard from "@pages/Dashboard";
import Youth from "@pages/Youth";
import Purok from "@pages/Purok";
import Inbox from "@pages/Inbox";
import Verification from "@pages/Verification";
import Officials from "@pages/Officials";
import Settings from "@pages/Account";
import NotFound from "@pages/NotFound";

import { useAuthContext } from "@context/AuthContext";
import YouthProfile from "@pages/YouthProfile";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { authUser, activeRole, loading } = useAuthContext();
    const location = useLocation();


    if (!authUser)
        return <Navigate to="/login" state={{ from: location }} replace />;

    if (allowedRoles && !allowedRoles.includes(activeRole))
        return <Navigate to="/" replace />;

    return children;
};

export const routes = [
    {
        path: "/",
        element: <LandingPage />
    },
    {
        path: "/login",
        element: <Signin />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path: "/forgot",
        element: <ForgotPassword />
    },
    {
        path: "/feed/*",
        element: (
            <ProtectedRoute allowedRoles={[
                "youth",
                "super_official",
                "natural_official"
            ]}>
                <NewsFeed />
            </ProtectedRoute>
        ),
    },
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
        ],
    },
    {
        path: "/youth",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <Youth /> }],
    },
    {
        path: "/purok",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <Purok /> }],
    },
    {
        path: "/inbox",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <Inbox /> }],
    },
    {
        path: "/verification",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <Verification /> }],
    },
    {
        path: "/officials",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <Officials /> }],
    },
    {
        path: "/account",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <Settings /> }]
    },
    {
        path: "/admin",
        element: (
            <ProtectedRoute allowedRoles={[
                "super_official",
                "natural_official"
            ]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [{ index: true, element: <AdminAuth /> }]
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute
                allowedRoles={["youth"]}
            >
                <YouthProfile />
            </ProtectedRoute>
        ),
    },
    {
        path: "*",
        element: <NotFound />
    },
];
