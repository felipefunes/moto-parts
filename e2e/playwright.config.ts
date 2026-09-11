import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(dirname, '..');
const backendUrl = 'http://localhost:18080';
const frontendUrl = 'http://localhost:5173';

// Real stack, no mocks: docker-compose.e2e.yml (Postgres + rpm-parts-backend) and the actual
// Vite dev server, both driven by Playwright's own webServer lifecycle -- see e2e/README.md for
// why this stays a local/dev tool rather than a CI gate for now.
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [['html', { open: 'never', outputFolder: './playwright-report' }]],
  outputDir: './test-results',
  use: {
    baseURL: frontendUrl,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: [
    {
      command: 'docker compose -f docker-compose.e2e.yml up --build',
      cwd: repoRoot,
      url: `${backendUrl}/actuator/health`,
      timeout: 180_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev:motos',
      cwd: repoRoot,
      url: frontendUrl,
      timeout: 30_000,
      reuseExistingServer: !process.env.CI,
      env: { VITE_API_BASE_URL: backendUrl },
    },
  ],
});
