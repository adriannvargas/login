// Cloud Function que expone el mismo backend Express de backend/ en /api/**
// (Firebase Hosting reescribe /api/** hacia esta función, ver firebase.json).
import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import mongoose from 'mongoose';
import { createApp } from '../backend/src/app.js';

const MONGODB_URI = defineSecret('MONGODB_URI');
const JWT_SECRET = defineSecret('JWT_SECRET');

// Fuera del handler: la conexión y la app se reutilizan entre invocaciones "calientes".
let conexion = null;
let app = null;

function conectar() {
  conexion ??= mongoose
    .connect(MONGODB_URI.value(), {
      maxPoolSize: 5, // cada instancia de la función tiene su propio pool; Atlas M0 admite 500 conexiones
      minPoolSize: 0, // sin conexiones ociosas cuando no hay tráfico
      maxIdleTimeMS: 30_000, // libera conexiones sin uso tras 30 s (la instancia puede congelarse)
      serverSelectionTimeoutMS: 5_000, // falla rápido si Atlas no responde (p. ej. IP no permitida)
      socketTimeoutMS: 30_000, // las consultas de login/perfil son cortas
    })
    .catch((err) => {
      conexion = null; // permite reintentar en la siguiente petición
      throw err;
    });
  return conexion;
}

export const api = onRequest(
  { region: 'us-central1', secrets: [MONGODB_URI, JWT_SECRET], maxInstances: 10 },
  async (req, res) => {
    process.env.JWT_SECRET = JWT_SECRET.value();
    try {
      await conectar();
    } catch (err) {
      console.error('No se pudo conectar a MongoDB', err);
      res.status(503).json({ error: 'Base de datos no disponible' });
      return;
    }
    app ??= createApp();
    app(req, res);
  },
);
