
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import authRoutes from "./routes/auth.route"
import propertyRoutes from "./routes/property.route"
import recommendedRoutes from "./routes/recommended.route"
import favouriteRoutes from "./routes/favourite.route"
import uploadRoutes from "./routes/upload.route"

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/property', propertyRoutes);
app.use('/api/recommended', recommendedRoutes);
app.use('/api/favourite', favouriteRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (_req, res) => {
  res.send('Server is running...');
});


const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
