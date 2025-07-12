import express from "express";

import { signupAdmin  } from '../controllers/adminAuth.controller.js'

const router = express.Router();

router.post("/sign-up", signupAdmin);

export default router;