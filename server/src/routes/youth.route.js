import express from 'express';
import {
    index,
    show
} from '../controller/youth.controller.js'
import ProtectRoute from '../middleware/protectRoute.middleware.js'


const router = express.Router();

router.get('/youth', ProtectRoute(), index);
router.get('/youth/:id', ProtectRoute(), show);

export default router