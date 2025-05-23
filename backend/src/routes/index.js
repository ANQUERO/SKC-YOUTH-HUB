import express from 'express';
import adminAuth from './adminAuth.route.js';
import admins from './admin.route.js'
import post from './post.route.js'

const router = express.Router();

//Admin Authentication and List ROUTES
router.use("/adminAuth", adminAuth);
router.use("/admins", admins);
router.use("/post", post);


export default router;

