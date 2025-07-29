import express from 'express';
import {
    unverified,
    verifying,
    deleteSignup,
    getYouthDetails,
    deletedSignup
} from '../controller/verification.controller.js';
import ProtectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get('/unverified', ProtectRoute(), unverified);
router.get('/details/:id', ProtectRoute(), getYouthDetails);
router.get('/deleted', ProtectRoute(), deletedSignup);
router.put('/verify/:id', ProtectRoute(), verifying);
router.delete('/delete/:id', ProtectRoute(), deleteSignup);

export default router;
