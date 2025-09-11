import express from "express";
import {
    index,
    createPost,
    updatePost,
    deletePost
} from "../controller/post.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";
import { upload, uploadCloudinary } from "../middleware/upload.middleware.js"

const router = express.Router();

router.get("/post", ProtectRoute(), index);

router.post("/post", ProtectRoute(), upload, uploadCloudinary, createPost);

router.put("/post/:id", ProtectRoute(), upload, uploadCloudinary, updatePost);

router.delete("/post/:id", ProtectRoute(), uploadCloudinary, deletePost);

export default router;
