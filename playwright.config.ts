import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  fullyParallel: true,
  use: {
    baseURL: 'http://localhost:4200',
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'clear db cache',
      testMatch: /global\.setup\.ts/,
    },
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, dependencies: ['clear db cache'] },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] }, dependencies: ['clear db cache'] },
  ],
});
