import express from 'express'
import { index, show } from '../controller/admin.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js'

const router = express.Router();

router.get('/admin', ProtectRoute(), index);
router.get('/admin/:id', ProtectRoute(), show);

export default router