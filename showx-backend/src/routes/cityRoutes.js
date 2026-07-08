import express from "express";
import { getCities, createCity, deleteCity } from "../controllers/cityController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/", getCities);
router.post("/", protect, isAdmin, createCity);
router.delete("/:id", protect, isAdmin, deleteCity);

export default router;