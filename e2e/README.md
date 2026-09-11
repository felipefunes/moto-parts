# E2E harness

Two Playwright suites, split by whether they need the real backend:

- **`tests/`** (`playwright.config.ts`) — real Postgres, real `rpm-parts-backend`, real Vite dev
  server, no MSW, no mocks. Catalog browsing (home, category, filter, product, search) and the
  full checkout golden path. Heavy (docker-compose, a sibling repo checkout) — local/dev tool,
  not a CI gate. See `docs/flows/*.md` for what each spec covers and, importantly, what it
  doesn't (checkout is still mostly client-only; see `docs/flows/checkout.md`).
- **`tests-fast/`** (`playwright.fast.config.ts`) — cart/checkout client-state behavior
  (persistence, the `version: 2` migration, route guards, quantity mutation, order lifecycle,
  empty states) against the mock catalog alone. No Docker, no backend, no sibling repo. Cheap
  enough to gate every PR — wired into `ci.yml`.

## Prerequisites

- Docker (for Postgres + the backend container).
- Playwright's browser binaries: `npx playwright install chromium` (once per machine). Without
  this, `npm run test:e2e` fails with "Executable doesn't exist" — right after paying for the
  Docker image build, which is the annoying way to find out.
- `rpm-parts-backend` checked out as a **sibling directory** of this repo:
  ```
  personal/
    moto-parts/
    rpm-parts-backend/
  ```
  `docker-compose.e2e.yml` builds the backend from `../rpm-parts-backend`. There's no cross-repo
  CI wiring for this yet — deferred until real staging exists and there's a real decision to make
  about how CI authenticates to the private backend repo (see `RELEASING.md` in that repo). For
  now this is a local/dev tool, run by hand or, later, from a `push: main` workflow in this repo
  once that decision is made.

## Running

```
npm run test:e2e:fast
```

Starts only the frontend dev server (mock mode, no `VITE_API_BASE_URL`) on port 5174 and runs
`tests-fast/`. No Docker, no sibling repo required. This is what CI runs on every PR.

```
npm run test:e2e
```

Starts Postgres + the backend (via `docker-compose.e2e.yml`) and the frontend dev server (via
`npm run dev:motos`, with `VITE_API_BASE_URL` pointed at the compose backend) as Playwright
`webServer` processes, runs `tests/`, and tears both down. First run is slow (building the
backend's Docker image); subsequent runs reuse the image unless the backend's source changed.

```
npm run test:e2e:report          # tests/
npm run test:e2e:fast:report     # tests-fast/
```

Opens the last run's HTML report.

## Why `tests/` isn't wired into `ci.yml`

Per the original catalog plan: a full two-repo E2E run is too heavy/flaky to gate every PR for a
one-person team. `tests-fast/` is the actual per-PR gate for the cart/checkout state it covers;
`tests/` is meant to run post-merge on `main` once a decision is made on cross-repo checkout auth
for CI to reach the private backend repo.

## Known gaps / planned next scenarios

From the PR #27 review — the cart/checkout-state half is now covered by `tests-fast/`
(persistence, the `version: 2` migration, rejected payment, route guards, quantity mutation,
order lifecycle, empty states). Still open, needs real seed fixtures rather than "whatever the
first product in Motor happens to be":

- Shipping threshold (`FREE_SHIPPING_THRESHOLD_CLP` crossing) and multi-line order totals.
- Stock cap and a no-images product, once the seed has a low-stock and an image-less fixture.
