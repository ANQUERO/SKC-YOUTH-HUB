import { Route, Routes } from 'react-router-dom';

import NotFound from '@pages/NotFound';

//Guest Routes
import LandingPage from '@pages/LandingPage';
import Signin from '@pages/Signin';
import Signup from '@pages/Signup';
import ForgotPassword from '@pages/ForgotPasword/index.jsx';

import AdminAuth from '@pages/AdminAuth';

import NewsFeedRoutes from '@pages/NewsFeed/index';


export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot" element={<ForgotPassword />} />

            <Route path="/adminAuth" element={<AdminAuth />} />


            <Route path="/feed/*" element={<NewsFeedRoutes />} />




            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
