// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // Note the .js extension in ES modules

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Auth routes
app.use('/auth', authRoutes);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
