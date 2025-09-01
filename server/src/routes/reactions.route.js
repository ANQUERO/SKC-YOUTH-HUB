import express from "express";
import {
    createReaction,
    removeReaction,
    getReactions
} from "../controller/reactions.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.post("/:id/react", ProtectRoute(), createReaction);
router.delete("/:id/react", ProtectRoute(), removeReaction);
router.get("/:id/reactions", ProtectRoute(), getReactions);

export default router;
