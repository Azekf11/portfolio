import { defineConfig, devices } from '@playwright/test';

// BASE_URL lets the same tests run against the live site:
//   BASE_URL=https://example.vercel.app npm test
const baseURL = process.env.BASE_URL ?? 'http://localhost:4321';

export default defineConfig({
  testDir: 'tests',
  timeout: 60_000,
  reporter: 'list',
  use: { baseURL },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: process.env.BASE_URL
    ? undefined
    : { command: 'npm run build && npm run preview -- --port 4321', url: baseURL, reuseExistingServer: true, timeout: 120_000 },
});
