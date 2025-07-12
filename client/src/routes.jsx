import { Route, Routes } from 'react-router-dom';

import NotFound from '@pages/NotFound';

//Guest Routes
import LandingPage from '@pages/LandingPage';
import Signin from '@pages/Signin';
import Signup from '@pages/Signup';

import NewsFeedRoutes from '@pages/NewsFeed/index';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup />} />

            <Route path="/feed/*" element={<NewsFeedRoutes />} />



            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}
