// @ts-check
import { defineConfig, devices } from '@playwright/test';

const PORT = 4100; // puerto propio para pruebas: no choca con `npm start` (4000)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/login_app_test';
process.env.MONGODB_URI = MONGODB_URI;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI
    ? [['list'], ['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    // En CI MongoDB es un service container; en local se levanta un mongod real si no hay uno
    ...(process.env.CI
      ? []
      : [{ command: 'npm run db:local', port: 27017, reuseExistingServer: true, timeout: 120_000 }]),
    {
      command: 'npm run build && npm start',
      url: `http://localhost:${PORT}/api/health`,
      reuseExistingServer: false, // siempre prueba el código actual
      timeout: 120_000,
      env: { PORT: String(PORT), MONGODB_URI, JWT_SECRET: 'test-secret' },
    },
  ],
});
