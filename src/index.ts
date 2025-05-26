
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());



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
