import express from "express";
import auth from "../middlewares/authMiddleware.js";
import { saveAssessment } from "../controllers/assessmentController.js";
import Assessment from "../models/assessmentModel.js"; // <-- Import your model
import fetch from "node-fetch";

const router = express.Router();

// Save new assessment
router.post("/", auth, saveAssessment);

// Get latest assessment
router.get("/latest", auth, async (req, res) => {
  try {
    // Use the Assessment model directly
    const assessment = await Assessment.findOne({ user: req.user.id })
      .sort({ createdAt: -1 });

    if (!assessment) {
      return res.status(404).json({ message: "No assessment found" });
    }

    // 🔹 Call ML service to compute Potential Harvest
    const mlResponse = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roof_area: assessment.roofArea,
        annual_rainfall: assessment.rainfall,
        roof_type: assessment.roofType,
        soil_type: assessment.soilType,
      }),
    });

    let mlData;
    try {
      mlData = await mlResponse.json();
    } catch (e) {
      const text = await mlResponse.text();
      console.error("ML API error response:", text);
      return res.status(500).json({ message: "ML API error", details: text });
    }
    console.log("ML API response:", mlData); // <-- Add this line
    // Attach result from Python model
    const responseData = {
      ...assessment.toObject(),
      potentialHarvest: mlData.potential_harvest || 0,
      tankVolume: mlData.tank_volume || 0,
      efficiency: mlData.efficiency || 0,
      inertia: mlData.inertia || 0,
    };

    res.json(responseData);
  } catch (err) {
    console.error("Error fetching assessment:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;







