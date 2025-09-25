import express from "express";
import auth from "../middlewares/authMiddleware.js";
// Import both controller functions
import {
  saveAssessment,
  getLatestAssessment,
} from "../controllers/assessmentController.js";

const router = express.Router();

// Route to save a new assessment
// POST /api/assessments
router.post("/", auth, saveAssessment);

// Route to get the latest assessment for the logged-in user
// GET /api/assessments/latest
router.get("/latest", auth, getLatestAssessment); // <-- This now correctly calls the function from your controller

export default router;