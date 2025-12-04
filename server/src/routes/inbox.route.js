import express from "express";
import {
    index,
    show
} from "../controller/inbox.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

// Get all feedback forms in inbox (officials only)
router.get("/", ProtectRoute(), index);

// Get feedback form with replies (officials only)
router.get("/:id", ProtectRoute(), show);

export default router;

