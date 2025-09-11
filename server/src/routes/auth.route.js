import express from 'express'
import {
    signupAdmin,
    signup,
    login,
    logout,
    resetPassword
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

router.post("/signup",
    upload,
    uploadCloudinary,
    signupYouthValidator,
    signup)
    ;
router.post("/adminSignup",
    signupAdminValidator,
    signupAdmin
);
router.post("/login",
    loginValidator,
    login
);
router.post("/logout", logout);

router.post('/reset-password', ProtectRoute(), (req, res, next) => next(), resetPassword);

export default router;