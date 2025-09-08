import express from 'express';
import {
    showProfile
} from '../controller/profile.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get('/profile', ProtectRoute(), showProfile);


export default router;