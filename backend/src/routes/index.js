import express from 'express';
import adminAuth from './adminAuth.route.js';

const router = express.Router();

//Admin Authentication and List ROUTES
router.use("/adminAuth", adminAuth);


export default router;

