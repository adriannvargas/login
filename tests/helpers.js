import mongoose from 'mongoose';

export const PASSWORD = 'secreto123';

export function uniqueEmail(prefix = 'user') {
  return `${prefix}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@test.com`;
}

export async function registerViaApi(request, overrides = {}) {
  const data = { name: 'Usuario Test', email: uniqueEmail(), password: PASSWORD, ...overrides };
  const res = await request.post('/api/auth/register', { data });
  const body = await res.json();
  return { res, body, credentials: data };
}

/** Conexión directa a MongoDB para verificar lo que realmente quedó guardado. */
export async function connectDb() {
  const conn = await mongoose.createConnection(process.env.MONGODB_URI).asPromise();
  return { users: conn.collection('users'), close: () => conn.close() };
}
