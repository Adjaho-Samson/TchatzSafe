const { defineConfig } = require('@playwright/test');
const baseURL = process.env.TEST_BASE_URL || 'http://127.0.0.1:4173';
module.exports = defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.cjs',
  timeout: 30000,
  expect: { timeout: 8000 },
  fullyParallel: true,
  workers: 2,
  reporter: 'list',
  use: { baseURL, headless: true, trace: 'retain-on-failure' },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : {
        command: 'node tools/server.mjs --port 4173',
        url: baseURL + '/index.html',
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
      },
});
