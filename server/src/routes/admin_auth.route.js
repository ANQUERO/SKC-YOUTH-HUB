import express from 'express'
import {
    signup,
    login,
    logout
} from '../controller/admin_auth.controller'
import { signupAdminValidator, loginValidator } from '../utils/validators'

const router = express.Router();

router.post("/signup", signupAdminValidator, signup);
router.post("/login", loginValidator, login);
router.post("/logout", logout);

export default router;