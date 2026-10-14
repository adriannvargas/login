import { test, expect } from '@playwright/test';
import { connectDb, registerViaApi, PASSWORD } from '../helpers.js';

test.describe('Test 1 · API Registro', () => {
  test('registra un usuario, lo guarda en MongoDB con contraseña hasheada y rechaza duplicados', async ({ request }) => {
    const { res, body, credentials } = await registerViaApi(request, { name: 'Ana Registro' });

    expect(res.status()).toBe(201);
    expect(body.token).toBeTruthy();
    expect(body.user).toMatchObject({ name: 'Ana Registro', email: credentials.email });
    expect(body.user).not.toHaveProperty('passwordHash');

    const db = await connectDb();
    try {
      const saved = await db.users.findOne({ email: credentials.email });
      expect(saved).not.toBeNull();
      expect(saved.passwordHash).toBeTruthy();
      expect(saved.passwordHash).not.toBe(PASSWORD);
      expect(saved.passwordHash).toMatch(/^\$2[aby]\$/); // formato bcrypt
    } finally {
      await db.close();
    }

    const dup = await request.post('/api/auth/register', { data: credentials });
    expect(dup.status()).toBe(409);
    expect((await dup.json()).error).toContain('ya está registrado');
  });
});
