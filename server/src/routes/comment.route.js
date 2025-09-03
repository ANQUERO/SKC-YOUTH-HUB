import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getComments
} from "../controller/comment.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get('/:id/comments', ProtectRoute(), getComments);
router.post("/:id/comments", ProtectRoute(), createComment);
router.put("/comments/:id", ProtectRoute(), updateComment);
router.delete("/comments/:id", ProtectRoute(), deleteComment);

export default router;