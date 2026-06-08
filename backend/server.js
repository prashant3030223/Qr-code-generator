import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Load routes
import authRoutes from './routes/auth.js';
import qrRoutes from './routes/qrcode.js';
import redirectRoutes from './routes/redirect.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting routes
app.use('/r', redirectRoutes); // Redirection links: /r/:shortId
app.use('/api/auth', authRoutes); // Authentication: signup/login
app.use('/api/qrcode', qrRoutes); // QR actions: CRUD & analytics

// Simple API status check
app.get('/', (req, res) => {
  res.send('QR Code Generator API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
