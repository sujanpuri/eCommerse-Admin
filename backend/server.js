import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/userRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import connectDB from './config/connect.js';

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// DB connection
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the E-commerce (Admin) Backend');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);

app.use('/api/costumers', costumerRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));