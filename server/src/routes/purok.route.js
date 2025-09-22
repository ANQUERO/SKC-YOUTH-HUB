import express from 'express';
import {
    index,
    publicIndex,
    show,
    store,
    update,
    destroy
} from '../controller/purok.controller.js';
import ProtectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

// Public route for fetching puroks (no authentication required)
router.get('/purok/public', publicIndex);

// Protected routes (authentication required)
router.get('/purok', ProtectRoute(), index);
router.get('/purok/:id', ProtectRoute(), show);
router.post('/purok', ProtectRoute(), store);
router.put('/purok/:id', ProtectRoute(), update);
router.delete('/purok/:id', ProtectRoute(), destroy);

export default router;
