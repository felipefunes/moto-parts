import { devices, type PlaywrightTestConfig } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Shared between playwright.config.ts and playwright.fast.config.ts -- both configs live
// directly in e2e/, so this resolves the same repo root for either.
export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// fullyParallel is deliberately not here: playwright.config.ts runs sequentially (one shared
// docker-compose backend/DB to avoid contending with itself), playwright.fast.config.ts doesn't
// need to.
export const sharedConfig = {
  retries: process.env.CI ? 1 : 0,
  use: {
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
} satisfies PlaywrightTestConfig;
