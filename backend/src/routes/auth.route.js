import express from "express";
import { signupValidator } from '../lib/signupValidator.js'

import {
    signup,
    signin
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/signin", signin);

export default router;