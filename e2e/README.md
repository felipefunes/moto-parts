# E2E harness

Playwright tests against the real stack — real Postgres, real `rpm-parts-backend`, real Vite dev
server — no MSW, no mocks, for the parts of the app that actually talk to the backend today. See
`docs/flows/*.md` for what each spec covers and, importantly, what it doesn't (checkout is still
mostly client-only; see `docs/flows/checkout.md`).

## Prerequisites

- Docker (for Postgres + the backend container).
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
npm run test:e2e
```

This starts Postgres + the backend (via `docker-compose.e2e.yml`) and the frontend dev server
(via `npm run dev:motos`, with `VITE_API_BASE_URL` pointed at the compose backend) as Playwright
`webServer` processes, runs the specs, and tears both down. First run is slow (building the
backend's Docker image); subsequent runs reuse it unless the backend's source changed.

```
npm run test:e2e:report
```

Opens the last run's HTML report.

## Why this isn't wired into `ci.yml`

Per the original catalog plan: a full two-repo E2E run is too heavy/flaky to gate every PR for a
one-person team. The fast per-PR gate stays each repo's own unit/integration suite. This harness
is meant to run post-merge on `main`, once a decision is made on cross-repo checkout auth.
