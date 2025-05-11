import express from "express";

import { signupAdmin, signinAdmin } from '../controllers/adminAuth.controller.js'

const router = express.Router();

router.post("/sign-up", signupAdmin);
router.post("/sign-in", signinAdmin);

export default router;