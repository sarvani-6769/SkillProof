import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
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
app.use(
  cors({
    origin: process.env.CLIENT_URL || '*',
    credentials: true,
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
  res.status(200).json({
    status: 'OK',
    message: 'SkillProof API is operating normally.',
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
app.use(express.static(clientDistPath));

app.get('*', (req, res, next) => {
  // Pass API and Uploads requests down to 404 handler
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      next();
    }
  });
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

export default app;
