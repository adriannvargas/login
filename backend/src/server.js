import 'dotenv/config';
import mongoose from 'mongoose';
import { createApp } from './app.js';

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/login_app';
process.env.JWT_SECRET ||= 'dev-secret-cambiar';

await mongoose.connect(MONGODB_URI);
console.log(`Conectado a MongoDB: ${MONGODB_URI}`);
createApp().listen(PORT, () => console.log(`API escuchando en http://localhost:${PORT}`));
