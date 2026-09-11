import { defineConfig } from '@playwright/test';
import { repoRoot, sharedConfig } from './playwright.base';

const frontendUrl = 'http://localhost:5174';

// Cart/checkout client-state scenarios that don't touch the backend at all -- localStorage
// migration, route guards, quantity mutation, empty states. No docker-compose, no
// VITE_API_BASE_URL: just the mock catalogService, same as this suite's own webServer. Cheap
// enough to gate every PR, unlike playwright.config.ts's two-repo run -- see e2e/README.md.
export default defineConfig({
  ...sharedConfig,
  testDir: './tests-fast',
  fullyParallel: true,
  reporter: [['html', { open: 'never', outputFolder: './playwright-report-fast' }]],
  outputDir: './test-results-fast',
  use: {
    ...sharedConfig.use,
    baseURL: frontendUrl,
  },
  webServer: {
    command: 'npm run dev:motos -- --port 5174',
    cwd: repoRoot,
    url: frontendUrl,
    timeout: 30_000,
    // Same reasoning as playwright.config.ts's frontend entry: reusing a stray dev server could
    // be running in HTTP mode, and a different port than the main harness avoids colliding with
    // it if both happen to run at once, but doesn't make reuse of a *wrong-mode* server safe.
    reuseExistingServer: false,
  },
});
