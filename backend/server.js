import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/connect.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce (Admin) Backend');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});