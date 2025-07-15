import express from 'express'
import {
    signup,
    login,
    logout
} from '../controller/auth.controller.js'
import { signupAdminValidator, loginValidator } from '../utils/validators.js'

const router = express.Router();

router.post("/signup", signupAdminValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);

export default router;