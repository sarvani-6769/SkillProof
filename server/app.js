import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import internshipRoutes from './routes/internshipRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
// Dynamic CORS to support Vercel frontend, preview domains, localhost, and production clients
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins with reflection so credentials: true works seamlessly
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    exposedHeaders: ['Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Serve uploaded proof files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.status(200).json({
    status: isDbConnected ? 'OK' : 'DEGRADED',
    database: isDbConnected ? 'connected' : 'connecting_or_auth_failed',
    message: isDbConnected
      ? 'SkillProof API is operating normally.'
      : 'SkillProof API is running, but database authentication is pending or failed.',
    timestamp: new Date().toISOString(),
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/search', searchRoutes);

// In production or when client/dist exists, serve client static files & SPA fallback
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Safe SPA wildcard fallback compatible with Express 5 (no path-to-regexp wildcard parsing)
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  next();
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
