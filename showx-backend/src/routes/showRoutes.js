import express from "express";
import {
  createShow,
  getShows,
  getShowById,
  updateShow,
  deleteShow,
  getShowSeats,
} from "../controllers/showController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createShow);
router.get("/", getShows);
router.get("/:id", getShowById);
router.get("/:id/seats", getShowSeats);
router.put("/:id", protect, isAdmin, updateShow);
router.delete("/:id", protect, isAdmin, deleteShow);

export default router;