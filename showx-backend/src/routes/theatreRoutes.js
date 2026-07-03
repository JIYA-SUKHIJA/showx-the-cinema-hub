import express from "express";
import {
  createTheatre,
  getTheatres,
  getTheatreById,
  updateTheatre,
  deleteTheatre,
} from "../controllers/theatreController.js";

const router = express.Router();

router.post("/", createTheatre);
router.get("/", getTheatres);
router.get("/:id", getTheatreById);
router.put("/:id", updateTheatre);
router.delete("/:id", deleteTheatre);

export default router;