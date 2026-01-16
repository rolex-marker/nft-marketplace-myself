// backend/server.js
import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // Note the .js extension in ES modules
import profileRoutes from "./routes/profile.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);
app.use("/profile", profileRoutes);


app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
