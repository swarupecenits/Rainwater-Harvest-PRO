import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js'; 
import assessmentRoutes from "./routes/assessmentRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());
// Routes
app.use('/api/auth', authRoutes);
app.use("/api/assessments", assessmentRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch(err => console.error('❌ MongoDB connection failed:', err.message));
