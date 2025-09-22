import express from 'express'
import {
    signupAdmin,
    signup,
    verifyEmail,
    googleLogin,
    login,
    logout,
    resetPassword,
    forgotPassword,
    resetPasswordWithToken
} from '../controller/auth.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js'
import {
    signupYouthValidator,
    signupAdminValidator,
    loginValidator
} from '../utils/validators.js'
import {
    upload,
    uploadCloudinary
} from '../middleware/upload.middleware.js';

const router = express.Router();

// Youth signup
router.post("/signup",
    upload,
    uploadCloudinary,
    signupYouthValidator,
    signup
);

// Email verification
router.post("/verify-email", verifyEmail);

// Google OAuth login
router.post("/google-login", googleLogin);

// Admin signup (moved to settings)
router.post("/adminSignup",
    signupAdminValidator,
    signupAdmin
);

// Login
router.post("/login",
    loginValidator,
    login
);

// Logout
router.post("/logout", logout);

// Password reset (authenticated)
router.post('/reset-password', ProtectRoute(), (req, res, next) => next(), resetPassword);

// Forgot password (public)
router.post('/forgot-password', forgotPassword);

// Reset password with token (public)
router.post('/reset-password-token', resetPasswordWithToken);

export default router;