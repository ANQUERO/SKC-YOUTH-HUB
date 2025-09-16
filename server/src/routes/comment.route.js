import express from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getComments,
    hideComment,
    unhideComment,
    banUserFromCommenting,
    unbanUserFromCommenting
} from "../controller/comment.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

// Comments
router.get('/:post_id/comments', ProtectRoute(), getComments);
router.post('/:post_id/comments', ProtectRoute(), createComment);
router.put('/comments/:comment_id', ProtectRoute(), updateComment);
router.delete('/comments/:comment_id', ProtectRoute(), deleteComment);

// Comment Moderation
router.put('/comments/:comment_id/hide', ProtectRoute(), hideComment);
router.put('/comments/:comment_id/unhide', ProtectRoute(), unhideComment);

// User Banning
router.put('/ban/:user_type/:user_id', ProtectRoute(), banUserFromCommenting);
router.put('/unban/:user_type/:user_id', ProtectRoute(), unbanUserFromCommenting);

export default router;