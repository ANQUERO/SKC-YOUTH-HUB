// routes/index.js
import LandingPage from "@pages/LandingPage";
import Signin from "@pages/Signin";
import Signup from "@pages/Signup";
import ForgotPassword from "@pages/ForgotPasword";
import AdminAuth from "@pages/AdminAuth";

import NewsFeedRoutes from "@pages/NewsFeed";
import Authenticated from "@pages/Authenticated";
import Dashboard from "@pages/Dashboard";
import Youth from "@pages/Youth/";
import Purok from "@pages/Purok";
import Inbox from "@pages/Inbox";
import Verification from "@pages/Verification";
import Officials from "@pages/Officials";
import Settings from "@pages/Account";
import NotFound from "@pages/NotFound";

import ProtectedRoute from "@lib/ProtectedRoute.jsx";

export const routes = [
    // Public Routes
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/login",
        element: <Signin />,
    },
    {
        path: "/signup",
        element: <Signup />,
    },
    {
        path: "/forgot",
        element: <ForgotPassword />,
    },

    // Shared Feed Route (for youth + admin roles)
    {
        path: "/feed/*",
        element: (
            <ProtectedRoute allowedRoles={["youth", "admin", "super_sk_admin", "natural_sk_admin"]}>
                <NewsFeedRoutes />
            </ProtectedRoute>
        ),
    },

    // Admin-only routes (admin + super/natural sk admin)
    {
        path: "/dashboard",
        element: (
            <ProtectedRoute allowedRoles={["admin", "super_sk_admin", "natural_sk_admin"]}>
                <Authenticated />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },
            {
                path: "youth",
                element: <Youth />,
            },
            { path: "purok", element: <Purok /> },
            { path: "inbox", element: <Inbox /> },
            { path: "verification", element: <Verification /> },
            { path: "officials", element: <Officials /> },

            // 👇 Settings parent route
            {
                path: "account",
                element: <Settings />,
                children: [
                    // ✅ Nested route for /dashboard/account/signupAdmin
                    { path: "signupAdmin", element: <AdminAuth /> },
                ],
            },
        ],
    },

    // 404 fallback
    {
        path: "*",
        element: <NotFound />,
    },
];
