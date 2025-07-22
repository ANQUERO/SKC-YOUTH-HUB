import { Route, Routes } from 'react-router-dom';

import NotFound from '@pages/NotFound';

import LandingPage from '@pages/LandingPage';
import Signin from '@pages/Signin';
import Signup from '@pages/Signup';
import ForgotPassword from '@pages/ForgotPasword/index.jsx';

import AdminAuth from '@pages/AdminAuth';

import NewsFeedRoutes from '@pages/NewsFeed/index';

import Authenticated from '@pages/Authenticated';
import DashBoard from '@pages/Dashboard';
import Youth from '@pages/Youth';
import Purok from '@pages/Purok';
import Inbox from '@pages/Inbox';
import Verification from '@pages/Verification';
import Officials from '@pages/Officials';
import Settings from '@pages/Account';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/adminAuth" element={<AdminAuth />} />

            {/* Admin Protected Routes */}
            <Route path="/dashboard" element={<Authenticated />}>
                <Route index element={<DashBoard />} />
                <Route path="youth" element={<Youth />} />
                <Route path="purok" element={<Purok />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="verification" element={<Verification />} />
                <Route path="officials" element={<Officials />} />
                <Route path="account" element={<Settings />} />
            </Route>

            {/* Youth Feed */}
            <Route path="/feed/*" element={<NewsFeedRoutes />} />

            {/* 404 Fallback */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
