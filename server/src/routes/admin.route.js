import express from "express";
import {
    index,
    show,
    update,
    getPublicOfficials
} from "../controller/official.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

// Public route for landing page (no auth required)
router.get("/public/officials", getPublicOfficials);

// Protected routes (auth required)
router.get("/official", ProtectRoute(), index);
router.get("/official/:id", ProtectRoute(), show);
router.put("/official/:id", ProtectRoute(), update);

export default router;