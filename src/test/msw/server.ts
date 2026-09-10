import { setupServer } from 'msw/node';

/**
 * Shared MSW server for tests -- empty for now (no handlers). The HTTP-backed catalogService
 * (next PR) adds real handlers here so its tests hit this same mocked network layer instead of
 * a real backend.
 */
export const server = setupServer();
