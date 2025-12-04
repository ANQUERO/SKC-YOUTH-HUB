import express from "express";
import {
    getFeedbackForms,
    getFeedbackForm,
    createFeedbackForm,
    submitFeedbackReply
} from "../controller/feedback.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

// Get all feedback forms (both officials and youth can view)
router.get("/", ProtectRoute(), getFeedbackForms);

// Get a single feedback form
router.get("/:id", ProtectRoute(), getFeedbackForm);

// Create feedback form (officials only)
router.post("/", ProtectRoute(), createFeedbackForm);

// Submit feedback reply (youth only)
router.post("/:id/reply", ProtectRoute(), submitFeedbackReply);

export default router;

