import { defineConfig, devices } from '@playwright/test';
import { config as dotenvConfig } from 'dotenv';

const dotenvConfigResult = dotenvConfig();

if (dotenvConfigResult.error) {
  throw new Error(
    `Please add .env file in the root of the project. Error: ${dotenvConfigResult.error}`
  );
}

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  retries: 1,
  fullyParallel: true,
  workers: 4, 
  //shard: { total: 5, current: 2 }, // este es el shard 2 de 5
  use: {
    baseURL: process.env.URL,
    viewport: { width: 1280, height: 720 },
    headless: false,
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 5, // optional, super restricted
    },
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
