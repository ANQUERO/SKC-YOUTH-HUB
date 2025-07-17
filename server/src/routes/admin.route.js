import express from 'express'
import { index, show, update } from '../controller/admin.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js'

const router = express.Router();

router.get('/admin', ProtectRoute(), index);
router.get('/admin/:id', ProtectRoute(), show);
router.put('/admin/:id', ProtectRoute(), update);

export default router