import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: true,          // TEST-R12
  retries: 0,                // TEST-R12: flaky tests get fixed, not retried until green
  reporter: [['list']],
  use: { baseURL: 'http://localhost:4317', trace: 'retain-on-failure' },
  // When the Playwright browser download is blocked (proxies, sandboxes), use an installed browser:
  //   PW_CHANNEL=chrome | msedge                 an installed Chrome or Edge
  //   PW_EXECUTABLE_PATH=/path/to/chromium-binary  any Chromium-based browser
  projects: [{
    name: 'chromium',
    use: {
      ...devices['Desktop Chrome'],
      ...(process.env.PW_CHANNEL ? { channel: process.env.PW_CHANNEL } : {}),
      ...(process.env.PW_EXECUTABLE_PATH ? { launchOptions: { executablePath: process.env.PW_EXECUTABLE_PATH } } : {}),
    },
  }],
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4317',
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
