import express from 'express'
import {
    signupAdmin,
    signup,
    login,
    logout
} from '../controller/auth.controller.js'
import { signupYouthValidator, signupAdminValidator, loginValidator } from '../utils/validators.js'
import { upload, uploadCloudinary } from '../middleware/upload.middleware.js';

const router = express.Router();

router.post("/signup", upload, uploadCloudinary, signupYouthValidator, signup);

router.post("/adminSignup", signupAdminValidator, signupAdmin);

router.post("/login", loginValidator, login);
router.post("/logout", logout);

export default router;