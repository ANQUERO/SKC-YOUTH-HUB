import express from 'express';
import { 
    index, 
    create, 
    destroy, 
    restore,
    disable,
    enable 
} from '../controllers/adminFeatures.controller.js';

const router = express.Router();

router.get('/youths', index);
router.post('/youths', create);
router.delete('/youths/:youth_id', destroy);
router.put('/youths/:youth_id/restore', restore);
router.put('/youths/:youth_id/disable_comment', disable);
router.put('/youths/:youth_id/enable_comment', enable);

export default router;





