import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getComments
} from "../controller/comment.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

// Prefix all routes with /post
router.get("/post/:post_id/comments", ProtectRoute(), getComments);
router.post("/post/:post_id/comments", ProtectRoute(), createComment);
router.put("/post/comments/:comment_id", ProtectRoute(), updateComment);
router.delete("/post/comments/:comment_id", ProtectRoute(), deleteComment);

export default router;
