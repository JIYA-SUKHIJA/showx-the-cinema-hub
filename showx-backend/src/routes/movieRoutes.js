import express from "express";
import {
  createMovie,
  getMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
  getReleases,
  getUpcomingMovies,
} from "../controllers/movieController.js";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, isAdmin, createMovie);
router.get("/", getMovies);

// IMPORTANT: these specific routes must come BEFORE "/:id",
// otherwise Express would treat "releases"/"upcoming" as an :id value.
router.get("/releases", getReleases);
router.get("/upcoming", getUpcomingMovies);

router.get("/:id", getMovieById);
router.put("/:id", protect, isAdmin, updateMovie);
router.delete("/:id", protect, isAdmin, deleteMovie);

export default router;