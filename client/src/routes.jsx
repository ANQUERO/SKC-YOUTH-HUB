import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '@context/AuthContext';

import NotFound from '@pages/NotFound';

import LandingPage from '@pages/LandingPage';
import Signin from '@pages/Signin';
import Signup from '@pages/Signup';
import ForgotPassword from '@pages/ForgotPasword/index.jsx';

import AdminAuth from '@pages/AdminAuth';

import NewsFeedRoutes from '@pages/NewsFeed/index';

import Authenticated from '@pages/Authenticated';
import YouthProfile from '@pages/Youth';
import Purok from '@pages/Purok'

const GuestRoute = ({ children }) => {
    const { authUser } = useAuthContext();
    const isAuthenticated = Boolean(authUser?.verified && authUser?.role?.length > 0);

    if (isAuthenticated) {
        return <Navigate to="/" />
    }

    return children;
}

const ProtectedRoute = ({ children }) => {
    const location = useLocation();
    const { authUser } = useAuthContext();
    const isAuthenticated = Boolean(authUser?.verified);

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{
            from: location
        }} />
    };

    if (authUser?.role.length === 0 && location.pathname !== "/account/setup") {
        return <Navigate to="/account/setup" />;
    }

    return children;

}

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            <Route
                path="/signin"
                element={
                    <GuestRoute>
                        <Signin />
                    </GuestRoute>
                }
            />
            <Route
                path="/signup"
                element={
                    <GuestRoute>
                        <Signup />
                    </GuestRoute>
                }
            />
            <Route
                path="/forgot"
                element={
                    <GuestRoute>
                        <ForgotPassword />
                    </GuestRoute>
                }
            />

            <Route
                path="/authenticated"
                element={
                    <GuestRoute>
                        <Authenticated />
                    </GuestRoute>
                }
            />

            <Route
                path="/youth"
                element={
                    <GuestRoute>
                        <YouthProfile />
                    </GuestRoute>
                }
            />

            <Route
                path="/purok"
                element={
                    <GuestRoute>
                        <Purok />
                    </GuestRoute>
                }
            />

            <Route path="/adminAuth" element={<AdminAuth />} />

            {/* Protected Route */}
            <Route
                path="/feed/*"
                element={
                    <GuestRoute>
                        <NewsFeedRoutes />
                    </GuestRoute>
                }
            />

            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
