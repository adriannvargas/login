import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';

const distDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../frontend/dist');

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

  // Sirve el frontend compilado (npm run build) en el mismo puerto
  if (fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => res.sendFile(path.join(distDir, 'index.html')));
  }

  app.use((err, _req, res, _next) => {
    console.error(err);
    if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });
    res.status(500).json({ error: 'Error interno del servidor' });
  });
  return app;
}
