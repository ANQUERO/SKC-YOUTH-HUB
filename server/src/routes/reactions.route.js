import express from "express";
import { createReaction, removeReaction, getReactions } from "../controller/reactions.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.post("/:post_id/react", ProtectRoute(), createReaction);
router.delete("/:post_id/react", ProtectRoute(), removeReaction);
router.get("/:post_id/reactions", ProtectRoute(), getReactions);

export default router;
