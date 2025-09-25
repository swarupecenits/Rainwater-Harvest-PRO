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

    // 🔹 Call ML service to compute Potential Harvest (configurable URL)
    const mlBase = process.env.ML_SERVICE_URL;
    if (!mlBase) {
      console.error("ML service URL missing (ML_SERVICE_URL)");
      return res.status(502).json({
        message: "ML service URL not configured",
      });
    }

    const trimmedBase = mlBase.replace(/\/+$/, "");
    const mlUrl = /(\/calculate|\/predict)$/i.test(trimmedBase)
      ? trimmedBase
      : `${trimmedBase}/calculate`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7s timeout
    let mlData = { potential_harvest: 0, tank_volume: 0, efficiency: 0, inertia: 0 };
    try {
      const mlResponse = await fetch(mlUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roof_area: assessment.roofArea,
          annual_rainfall: assessment.rainfall,
          roof_type: assessment.roofType,
          soil_type: assessment.soilType,
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
      if (!mlResponse.ok) {
        const text = await mlResponse.text();
        console.error("ML service non-OK:", mlResponse.status, text);
        return res.status(502).json({ message: "ML service error", status: mlResponse.status, details: text });
      }
      mlData = await mlResponse.json();
      console.log("ML API response:", mlData);
    } catch (e) {
      clearTimeout(timeout);
      const reason = e.name === 'AbortError' ? 'timeout' : e.message;
      console.error("ML service fetch failed:", reason);
      // Continue but flag degraded data
      return res.status(502).json({
        message: "ML service unreachable",
        details: reason,
        potentialHarvest: 0,
        tankVolume: 0,
        efficiency: 0,
        inertia: 0
      });
    }
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







