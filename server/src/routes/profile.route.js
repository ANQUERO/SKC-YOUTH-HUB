import express from 'express';
import {
    showAccountName,
    showGenderInfo,
    showDemoSurvey,
    showMeetingHousehold
} from '../controller/profile.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get('/profile/v1', ProtectRoute(), showAccountName);
router.get('/profile/v2', ProtectRoute(), showGenderInfo);
router.get('/profile/v3', ProtectRoute(), showDemoSurvey);
router.get('/profile/v4', ProtectRoute(), showMeetingHousehold);


export default router;