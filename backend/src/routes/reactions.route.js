import express from 'express';
import {
  deleteReaction,
} from '../controllers/post.controller.js';

const router = express.Router();

// Delete own reaction (admin or youth)
router.delete('/:reaction_id', deleteReaction);

export default router;
