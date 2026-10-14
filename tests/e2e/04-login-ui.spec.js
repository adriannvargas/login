import { test, expect } from '@playwright/test';
import { uniqueEmail, PASSWORD } from '../helpers.js';

test.describe('Test 4 · UI Registro y Login', () => {
  test('el usuario se registra, cierra sesión y vuelve a entrar desde el formulario', async ({ page }) => {
    const email = uniqueEmail('ui');

    await page.goto('/login');
    await page.getByRole('link', { name: 'Regístrate' }).click();
    await expect(page).toHaveURL(/\/register$/);

    await page.getByTestId('register-name').fill('Lucía UI');
    await page.getByTestId('register-email').fill(email);
    await page.getByTestId('register-password').fill(PASSWORD);
    await page.getByTestId('register-submit').click();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByTestId('profile-title')).toHaveText('Hola, Lucía UI');

    await page.getByTestId('logout').click();
    await expect(page).toHaveURL(/\/login$/);

    // Credenciales incorrectas muestran error
    await page.getByTestId('login-email').fill(email);
    await page.getByTestId('login-password').fill('incorrecta');
    await page.getByTestId('login-submit').click();
    await expect(page.getByRole('alert')).toHaveText('Credenciales inválidas');
    await expect(page).toHaveURL(/\/login$/);

    // Credenciales correctas llevan al perfil
    await page.getByTestId('login-password').fill(PASSWORD);
    await page.getByTestId('login-submit').click();
    await expect(page).toHaveURL(/\/profile$/);
    await expect(page.getByTestId('profile-email')).toHaveText(email);
  });
});
