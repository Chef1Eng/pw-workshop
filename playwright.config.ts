import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  retries: 1,
  fullyParallel: true,
  workers: 4, 
  //shard: { total: 5, current: 2 }, // este es el shard 2 de 5
  use: {
    baseURL: 'https://www.saucedemo.com/',
    viewport: { width: 1280, height: 720 },
    headless: false,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
