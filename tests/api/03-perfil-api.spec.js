import { test, expect } from '@playwright/test';
import { connectDb, registerViaApi, uniqueEmail } from '../helpers.js';

test.describe('Test 3 · API Perfil', () => {
  test('protege el perfil con JWT y persiste las actualizaciones en MongoDB', async ({ request }) => {
    const noToken = await request.get('/api/profile');
    expect(noToken.status()).toBe(401);

    const badToken = await request.get('/api/profile', { headers: { Authorization: 'Bearer abc.def.ghi' } });
    expect(badToken.status()).toBe(401);

    const { body: reg, credentials } = await registerViaApi(request, { name: 'Carlos Perfil' });
    const headers = { Authorization: `Bearer ${reg.token}` };

    const me = await request.get('/api/profile', { headers });
    expect(me.status()).toBe(200);
    expect(await me.json()).toMatchObject({ name: 'Carlos Perfil', email: credentials.email, bio: '' });

    const update = await request.put('/api/profile', {
      headers,
      data: { bio: 'QA Engineer', city: 'La Paz', phone: '70012345', email: uniqueEmail('hack') },
    });
    expect(update.status()).toBe(200);
    const updated = await update.json();
    expect(updated).toMatchObject({ bio: 'QA Engineer', city: 'La Paz', phone: '70012345' });
    expect(updated.email).toBe(credentials.email); // el email no es editable

    const emptyName = await request.put('/api/profile', { headers, data: { name: '   ' } });
    expect(emptyName.status()).toBe(400);

    const db = await connectDb();
    try {
      const saved = await db.users.findOne({ email: credentials.email });
      expect(saved).toMatchObject({ name: 'Carlos Perfil', bio: 'QA Engineer', city: 'La Paz', phone: '70012345' });
    } finally {
      await db.close();
    }
  });
});
