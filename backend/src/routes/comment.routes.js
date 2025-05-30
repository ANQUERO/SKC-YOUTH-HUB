import express from 'express';
import {
    editComment,
    deleteComment,
    hideComment
} from '../controllers/post.controller.js'

const router = express.Router();

router.put('/:comment_id', editComment);
router.delete('/:comment_id', deleteComment);
router.patch('/:comment_id/hide', hideComment);

export default router;

