import express from 'express';
import { 
    index, 
    create, 
    destroy, 
    restore,
    disable,
    enable 
} from '../controllers/adminFeatures.controller';

const router = express.Router();

router.get('/youths', index);
router.get('/youths', create);
router.get('/youths/:youth_id', destroy);
router.get('/youths/:youth_id/restore', restore);
router.get('/youths/:youth_id/disable_comment', disable);
router.get('/youths/:youth_id/enable_comment', enable);

export default router;





