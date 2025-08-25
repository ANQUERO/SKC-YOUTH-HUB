import express from "express";
import { createComment, updateComment, deleteComment, getComments } from "../controllers/comments.controller.js";
import protectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.post("/:post_id/comments", protectRoute, createComment);
router.put("/comments/:comment_id", protectRoute, updateComment);
router.delete("/comments/:comment_id", protectRoute, deleteComment);
router.get("/:post_id/comments", getComments);

export default router;
