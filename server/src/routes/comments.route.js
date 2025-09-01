import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getComments
} from "../controller/comment.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get('/:post_id/comments', ProtectRoute(), getComments);
router.post("/:post_id/comments", ProtectRoute(), createComment);
router.put("/comments/:comment_id", ProtectRoute(), updateComment);
router.delete("/comments/:comment_id", ProtectRoute(), deleteComment);

export default router;
