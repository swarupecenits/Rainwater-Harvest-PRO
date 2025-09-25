import Assessment from "../models/assessmentModel.js";
import fetch from "node-fetch";

// Controller to save a new assessment
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
      rainfall, // Correctly receives 'rainfall'
    } = req.body;

    const newAssessment = new Assessment({
      user: req.user.id, // Ensure your auth middleware provides req.user.id
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
      rainfall, // Correctly saves 'rainfall'
    });

    const saved = await newAssessment.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in saveAssessment:", err);
    res.status(500).json({ message: "Failed to save assessment." });
  }
};

// Controller to get the latest assessment and enrich it with ML data
export const getLatestAssessment = async (req, res) => {
  try {
    // 1. Get the latest assessment document from MongoDB for the logged-in user
    const latest = await Assessment.findOne({ user: req.user.id }).sort({
      createdAt: -1,
    });

    if (!latest) {
      return res.status(404).json({ message: "No assessment found for this user." });
    }

    // 2. Check for the ML service URL in environment variables
    const mlServiceUrl = process.env.ML_SERVICE_URL;
    if (!mlServiceUrl) {
      console.error("ML_SERVICE_URL environment variable is not set!");
      return res.status(500).json({ message: "ML service is not configured on the server." });
    }

    // 3. Call the Python ML service with data from the assessment
    const mlResponse = await fetch(`${mlServiceUrl}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        roof_area: latest.roofArea,
        roof_type: latest.roofType,
        soil_type: latest.soilType,
        annual_rainfall: latest.rainfall, // <-- FIX: Use 'latest.rainfall' which exists in your model
      }),
    });

    // 4. Handle a non-successful response from the ML service
    if (!mlResponse.ok) {
      const errorText = await mlResponse.text();
      console.error("ML service returned an error:", mlResponse.status, errorText);
      // Forward the error from the ML service to the client
      return res.status(502).json({ message: "Error from prediction service.", details: errorText });
    }

    const mlData = await mlResponse.json();
    console.log("Received data from ML service:", mlData);

    // 5. Merge the database data with the ML model's results
    const responseData = {
      ...latest.toObject(), // Using .toObject() is a Mongoose best practice
      potentialHarvest: mlData.potential_harvest || 0,
      tankVolume: mlData.tank_volume || 0,
      efficiency: mlData.efficiency || 0,
      inertia: mlData.inertia || 0,
    };

    // 6. Send the final combined data to the frontend
    res.status(200).json(responseData);

  } catch (err) {
    console.error("Error in getLatestAssessment controller:", err);
    res.status(500).json({ message: "An internal server error occurred." });
  }
};