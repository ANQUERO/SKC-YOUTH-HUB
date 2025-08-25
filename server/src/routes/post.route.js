import express from "express";
import { createReaction, removeReaction, getReactions } from "../controllers/reactions.controller.js";
import protectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.post("/:post_id/react", protectRoute, createReaction);
router.delete("/:post_id/react", protectRoute, removeReaction);
router.get("/:post_id/reactions", getReactions);

export default router;
