import express from "express";
import {
  createShow,
  getShows,
  getShowById,
  updateShow,
  deleteShow,
  getShowSeats,
} from "../controllers/showController.js";

const router = express.Router();

router.post("/", createShow);
router.get("/", getShows);
router.get("/:id", getShowById);
router.get("/:id/seats", getShowSeats);
router.put("/:id", updateShow);
router.delete("/:id", deleteShow);

export default router;