import express from 'express';
import { index, show, update, disable, enable} from '../controllers/admin.controller.js'

const adminRouter = express.Router();

adminRouter.get('/', index);
adminRouter.get('/:admin_id', show);
adminRouter.put('/:admin_id', update);
adminRouter.patch('/:admin_id/disable', disable);
adminRouter.patch('/:admin_id/enable', enable);


export default adminRouter