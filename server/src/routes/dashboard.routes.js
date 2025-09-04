import express from 'express';
import {
    getTotalVoters,
    getTotalGender,
    getResidentsPerPurok
} from '../controller/dashboard.controller.js';
import ProtectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get('/dashboard/v1', ProtectRoute(), getTotalVoters);
router.get('/dashboard/v2', ProtectRoute(), getTotalGender);
router.get('/dashboard/v3', ProtectRoute(), getResidentsPerPurok);

export default router;