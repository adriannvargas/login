import { test, expect } from '@playwright/test';
import { registerViaApi, uniqueEmail } from '../helpers.js';

test.describe('Test 2 · API Login', () => {
  test('devuelve token con credenciales válidas y 401 con credenciales inválidas', async ({ request }) => {
    const { credentials } = await registerViaApi(request);

    const ok = await request.post('/api/auth/login', {
      data: { email: credentials.email.toUpperCase(), password: credentials.password },
    });
    expect(ok.status()).toBe(200);
    const body = await ok.json();
    expect(body.token.split('.')).toHaveLength(3); // JWT
    expect(body.user.email).toBe(credentials.email);

    const wrongPassword = await request.post('/api/auth/login', {
      data: { email: credentials.email, password: 'incorrecta' },
    });
    expect(wrongPassword.status()).toBe(401);

    const unknownUser = await request.post('/api/auth/login', {
      data: { email: uniqueEmail('nadie'), password: 'loquesea' },
    });
    expect(unknownUser.status()).toBe(401);

    const missing = await request.post('/api/auth/login', { data: { email: credentials.email } });
    expect(missing.status()).toBe(400);
  });
});
