import express from "express";
import {
    index,
    createPost,
    updatePost,
    deletePost
} from "../controller/post.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";
import { uploadCloudinary } from "../middleware/upload.middleware.js"

const router = express.Router();

router.get("/post", ProtectRoute(), uploadCloudinary, index);

router.post("/post", ProtectRoute(), uploadCloudinary, createPost);

router.put("/post/:id", ProtectRoute(), uploadCloudinary, updatePost);

router.delete("/post/:id", ProtectRoute(), uploadCloudinary, deletePost);

export default router;
