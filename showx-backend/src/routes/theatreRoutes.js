import express from "express";
import {
  createTheatre,
  getTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
} from "../controllers/theatreController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createTheatre);
router.get("/", getTheatres);
router.get("/:id", getTheatreById);
router.put("/:id", protect, isAdmin, updateTheatre);
router.delete("/:id", protect, isAdmin, deleteTheatre);

export default router;