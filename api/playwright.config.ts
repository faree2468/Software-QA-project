import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  reporter: [['list'], ['html', { open: 'never' }]],
  fullyParallel: true,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:8091',
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'clear db cache',
      testMatch: /global\.setup\.ts/,
    },
    {
      name: 'api',
      testMatch: /.*\.spec\.ts/,
      dependencies: ['clear db cache'],
    },
  ],
});
