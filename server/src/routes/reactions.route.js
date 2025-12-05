import express from "express";
import {
    createReaction,
    removeReaction,
    getReactions,
    createCommentReaction,
    removeCommentReaction,
    getCommentReactions
} from "../controller/reactions.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

// Post reactions
router.post("/post/:post_id/react", ProtectRoute(), createReaction);
router.delete("/post/:post_id/react", ProtectRoute(), removeReaction);
router.get("/post/:post_id/reactions", ProtectRoute(), getReactions);

// Comment reactions
router.post("/comment/:comment_id/react", ProtectRoute(), createCommentReaction);
router.delete("/comment/:comment_id/react", ProtectRoute(), removeCommentReaction);
router.get("/comment/:comment_id/reactions", ProtectRoute(), getCommentReactions);

export default router;
