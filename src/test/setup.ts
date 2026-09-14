import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './msw/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Vitest isn't run with `globals: true`, so @testing-library/react's own auto-cleanup (which
// hooks into a global `afterEach`) never fires on its own -- without this, a second `render()`
// in the same test file leaves the previous one's DOM mounted alongside it, which every existing
// component test happened to dodge by only ever rendering once per file.
afterEach(() => cleanup());
