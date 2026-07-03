import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

// Router lets us define routes in a separate file,
// then plug them all into the main app at once.
const router = express.Router();

// Public routes — anyone can call these
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes — 'protect' middleware runs FIRST.
// If the JWT is missing/invalid, the request is rejected before
// ever reaching logoutUser/getProfile/updateProfile.
router.post("/logout", protect, logoutUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

export default router;