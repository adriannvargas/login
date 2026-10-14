import { test, expect } from '@playwright/test';
import { registerViaApi } from '../helpers.js';

test.describe('Test 5 · UI Perfil', () => {
  test('bloquea /profile sin sesión y guarda los cambios del perfil tras recargar', async ({ page, request }) => {
    await page.goto('/profile');
    await expect(page).toHaveURL(/\/login$/);

    const { body } = await registerViaApi(request, { name: 'Mario Editor' });
    await page.evaluate((token) => localStorage.setItem('token', token), body.token);

    await page.goto('/profile');
    await expect(page.getByTestId('profile-title')).toHaveText('Hola, Mario Editor');

    await page.getByTestId('profile-name').fill('Mario Actualizado');
    await page.getByTestId('profile-city').fill('Cochabamba');
    await page.getByTestId('profile-phone').fill('76543210');
    await page.getByTestId('profile-bio').fill('Me gusta automatizar pruebas');
    await page.getByTestId('profile-save').click();

    await expect(page.getByRole('status')).toHaveText('Perfil actualizado');
    await expect(page.getByTestId('profile-title')).toHaveText('Hola, Mario Actualizado');

    await page.reload();
    await expect(page.getByTestId('profile-name')).toHaveValue('Mario Actualizado');
    await expect(page.getByTestId('profile-city')).toHaveValue('Cochabamba');
    await expect(page.getByTestId('profile-phone')).toHaveValue('76543210');
    await expect(page.getByTestId('profile-bio')).toHaveValue('Me gusta automatizar pruebas');
  });
});
