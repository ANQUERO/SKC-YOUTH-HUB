import express from "express";
import {
    showProfile,
    updateProfilePicture,
    updateProfile,
    getYouthActivity
} from "../controller/profile.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";
import { upload, uploadCloudinary } from "../middleware/upload.middleware.js";

const router = express.Router();

router.get("/profile", ProtectRoute(), showProfile);
router.post("/profile/picture", ProtectRoute(), upload, uploadCloudinary, updateProfilePicture);
router.put("/profile", ProtectRoute(), updateProfile);
router.get("/profile/activity", ProtectRoute(), getYouthActivity);

export default router;