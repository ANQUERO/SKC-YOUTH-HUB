import express from 'express';
import adminAuth from './adminAuth.route.js';
import admins from './admin.route.js';
import post from './post.route.js';
import youth from './auth.route.js';
import youths from './youth.route.js'
import adminFeatures from './adminFeatures.route.js';
import comment from './comment.routes.js';
import reaction from './reactions.route.js';

const router = express.Router();

//Admin Authentication and List ROUTES
router.use("/adminAuth", adminAuth);
router.use("/admins", admins);
router.use("/post", post);
router.use("/auth", youth);
router.use("/youth", youths);
router.use("/adminFeatures", adminFeatures);
router.use("/comment", comment);
router.use("/reaction", reaction);


export default router;

