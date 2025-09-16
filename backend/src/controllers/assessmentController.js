import Assessment from "../models/assessmentModel.js";
import fetch from "node-fetch";
// Save a new assessment
export const saveAssessment = async (req, res) => {
  try {
    const {
      name,
      dwellers,
      phone,
      email,
      roofArea,
      openSpace,
      roofType,
      soilType,
      address,
      latitude,
      longitude,
      rainfall,
    } = req.body;

    const newAssessment = new Assessment({
      user: req.user._id, // from auth middleware
      name,
      dwellers,
      phone,
      email,
      roofArea,
      openSpace,
      roofType,
      soilType,
      address,
      latitude,
      longitude,
      rainfall,
    });

    const saved = await newAssessment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get latest assessment
// export const getLatestAssessment = async (req, res) => {
//   try {
//     const latest = await Assessment.findOne({ user: req.user._id })
//       .sort({ createdAt: -1 });

//     if (!latest) {
//       return res.status(404).json({ message: "No assessments found" });
//     }

//     res.json(latest);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

export const getLatestAssessment = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    // 1. Get latest assessment from MongoDB
    const latest = await Assessment.findOne({ user: userId }).sort({ createdAt: -1 });

    if (!latest) {
      return res.status(404).json({ message: "No assessment found" });
    }

    // 2. Send data to Python API
    const pyRes = await fetch("https://rainwater-harvest-pro.onrender.com/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roof_area: latest.roofArea,
        roof_type: latest.roofType,
        soil_type: latest.soilType,
        annual_rainfall: latest.annualRainfall,
      }),
    });

    const pyData = await pyRes.json();

    // 3. Merge MongoDB data + Python calculation
    res.json({
      ...latest.toObject(),
      potentialHarvest: pyData.potentialHarvest,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
