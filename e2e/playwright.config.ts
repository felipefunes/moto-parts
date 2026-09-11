import { defineConfig } from '@playwright/test';
import { repoRoot, sharedConfig } from './playwright.base';

const backendUrl = 'http://localhost:18080';
const frontendUrl = 'http://localhost:5173';

// Real stack, no mocks: docker-compose.e2e.yml (Postgres + rpm-parts-backend) and the actual
// Vite dev server, both driven by Playwright's own webServer lifecycle -- see e2e/README.md for
// why this stays a local/dev tool rather than a CI gate for now.
export default defineConfig({
  ...sharedConfig,
  testDir: './tests',
  fullyParallel: false,
  reporter: [['html', { open: 'never', outputFolder: './playwright-report' }]],
  outputDir: './test-results',
  use: {
    ...sharedConfig.use,
    baseURL: frontendUrl,
  },
  webServer: [
    {
      command: 'docker compose -f docker-compose.e2e.yml up --build --force-recreate --renew-anon-volumes',
      cwd: repoRoot,
      url: `${backendUrl}/actuator/health`,
      timeout: 180_000,
      // Same reasoning as the frontend entry below: this is the thing the harness exists to
      // test, so silently reusing whatever already answers on :18080 (a stale stack from an
      // older checkout, an interrupted previous run, or a manual `docker compose up` left
      // running) would run every "real backend" assertion -- including catalog.spec.ts's
      // Motor/Mahle counts -- against stale code and a stale database, green and meaningless.
      reuseExistingServer: false,
      // Without gracefulShutdown, Playwright SIGKILLs `docker compose up`, which can't forward
      // that to the containers it started (they're children of the Docker daemon, not of this
      // process) -- they're left running. `docker compose up` in the foreground does stop its
      // containers on SIGTERM.
      gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
    },
    {
      command: 'npm run dev:motos',
      cwd: repoRoot,
      url: frontendUrl,
      timeout: 30_000,
      // Never reuse an existing dev server here, CI or not: the whole point of this harness is
      // testing against the real backend, and a plain `npm run dev:motos` someone already has
      // running on :5173 has no VITE_API_BASE_URL -- reusing it would silently run every spec
      // against catalogServiceMock instead, passing green while testing nothing this harness
      // exists to test. Fail loudly (port already in use) instead of lying.
      reuseExistingServer: false,
      env: { VITE_API_BASE_URL: backendUrl },
    },
  ],
});
