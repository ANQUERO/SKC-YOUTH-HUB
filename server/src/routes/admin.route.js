import express from 'express'
import {
    index,
    show,
    update
} from '../controller/official.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js'

const router = express.Router();

router.get('/official', ProtectRoute(), index);
router.get('/official/:id', ProtectRoute(), show);
router.put('/official/:id', ProtectRoute(), update);

export default router