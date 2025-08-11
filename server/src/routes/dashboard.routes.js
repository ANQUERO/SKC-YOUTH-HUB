import express from 'express';
import { getTotalVoters } from '../controller/dashboard.controller.js';
import ProtectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get('/dashbord/v1', ProtectRoute(), getTotalVoters);

export default router;