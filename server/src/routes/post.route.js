import express from "express";
import {
    index,
    createPost,
    updatePost,
    deletePost
} from "../controller/post.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/", ProtectRoute(), index);

router.post("/", ProtectRoute(), createPost);

router.put("/:id", ProtectRoute(), updatePost);

router.delete("/:id", ProtectRoute(), deletePost);

export default router;
