import express from "express";
import {
  getDashboardStats,
  getWeeklyTrend,
  getAllBookings,
  getAllUsers,
  updateUserRole,
} from "../controllers/adminController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/dashboard-stats", protect, isAdmin, getDashboardStats);
router.get("/weekly-trend", protect, isAdmin, getWeeklyTrend);
router.get("/bookings", protect, isAdmin, getAllBookings);
router.get("/users", protect, isAdmin, getAllUsers);
router.put("/users/:id/role", protect, isAdmin, updateUserRole);

export default router;