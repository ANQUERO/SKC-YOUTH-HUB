import express from "express";
import {
    getNotifications,
    getUnreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    debugNotifications
} from "../controller/notification.controller.js";
import ProtectRoute from "../middleware/protectRoute.middleware.js";

const router = express.Router();

router.get("/", ProtectRoute(), getNotifications);
router.get("/unread-count", ProtectRoute(), getUnreadCount);
router.get("/debug", ProtectRoute(), debugNotifications);
router.put("/:notification_id/read", ProtectRoute(), markNotificationRead);
router.put("/mark-all-read", ProtectRoute(), markAllNotificationsRead);

export default router;

