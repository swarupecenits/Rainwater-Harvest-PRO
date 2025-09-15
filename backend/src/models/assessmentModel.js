import mongoose from "mongoose";

const assessmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    dwellers: String,
    phone: String,
    email: String,
    roofArea: String,
    openSpace: String,
    roofType: String,
    soilType: String,
    address: String,
    latitude: String,
    longitude: String,
    rainfall: String,
  },
  { timestamps: true }
);

const Assessment = mongoose.model("Assessment", assessmentSchema);
export default Assessment;
