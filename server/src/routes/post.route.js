import express from "express";
import {
    index,
    createPost,
    updatePost,
    deletePost,
    hidePost,
    unhidePost
} from "../controller/post.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";
import { upload, uploadCloudinary } from "../middleware/upload.middleware.js"

const router = express.Router();

router.get("/post", ProtectRoute(), index);

router.post("/post", ProtectRoute(), upload, uploadCloudinary, createPost);

router.put("/post/:id", ProtectRoute(), upload, uploadCloudinary, updatePost);

router.delete("/post/:id", ProtectRoute(), uploadCloudinary, deletePost);

// Post moderation routes
router.put("/post/:post_id/hide", ProtectRoute(), hidePost);
router.put("/post/:post_id/unhide", ProtectRoute(), unhidePost);

export default router;
