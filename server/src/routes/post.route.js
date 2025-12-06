import express from "express";
import {
  index,
  createPost,
  updatePost,
  deletePost,
  hidePost,
  unhidePost,
  getPost,
  deleteMedia,
  reorderMedia
} from "../controller/post.controller.js";
import {
  indexContent,
  showContent,
  storeContent,
  updateContent,
  deleteContent,
} from "../controller/official.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";
import { upload, uploadCloudinary } from "../middleware/upload.middleware.js";

const router = express.Router();

// Post routes
router.get("/post", ProtectRoute(), index);
router.get("/post/:id", ProtectRoute(), getPost);
router.post("/post", 
    ProtectRoute(), 
    upload, 
    uploadCloudinary, 
    createPost
);
router.put("/post/:id", 
    ProtectRoute(), 
    upload, 
    uploadCloudinary, 
    updatePost
);
router.delete("/post/:id", 
    ProtectRoute(), 
    deletePost
);

// Post media management routes
router.delete("/post/:post_id/media/:media_id", 
    ProtectRoute(), 
    deleteMedia
);
router.put("/post/:post_id/reorder", 
    ProtectRoute(), 
    reorderMedia
);

// Post moderation routes
router.put("/post/:post_id/hide", ProtectRoute(), hidePost);
router.put("/post/:post_id/unhide", ProtectRoute(), unhidePost);

// Landing page content routes
router.get("/contents", ProtectRoute(), indexContent);
router.get("/contents/:id", ProtectRoute(), showContent);
router.post(
  "/contents",
  ProtectRoute(),
  upload,
  uploadCloudinary,
  storeContent
);
router.put(
  "/contents/:id",
  ProtectRoute(),
  upload,
  uploadCloudinary,
  updateContent
);
router.delete("/contents/:id", ProtectRoute(), deleteContent);

export default router;