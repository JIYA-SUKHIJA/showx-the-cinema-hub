import express from "express";
import {
  getAdminNotifications,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
} from "../controllers/notificationController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/admin", protect, isAdmin, getAdminNotifications);
router.get("/my", protect, getMyNotifications);
router.put("/read-all", protect, markAllAsRead);
router.put("/:id/read", protect, markAsRead);

export default router;