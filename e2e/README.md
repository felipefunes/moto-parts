# E2E harness

Playwright tests against the real stack — real Postgres, real `rpm-parts-backend`, real Vite dev
server — no MSW, no mocks, for the parts of the app that actually talk to the backend today. See
`docs/flows/*.md` for what each spec covers and, importantly, what it doesn't (checkout is still
mostly client-only; see `docs/flows/checkout.md`).

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

## Known gaps / planned next scenarios

`checkout.spec.ts` today covers exactly one path (one product, quantity 1, card accepted).
From the PR #27 review, not yet built — tracked here rather than forgotten:

- Cart persistence across a reload (the direct proof the product-snapshot fix works).
- The `version: 2` localStorage migration wiping a v1-shaped cart instead of crashing.
- Rejected payment (card ending in `0000`): no order created, cart not cleared, retry works.
- The three checkout route guards (empty cart → `/carrito`, no address → `/checkout/direccion`).
- Quantity mutation from the cart (merge on re-add, decrement to removal, header badge).
- Shipping threshold, cart-cleared-after-order, confirmation page reload/unknown order,
  multi-line orders, empty states.
- Stock cap and a no-images product, once the seed has a low-stock and an image-less fixture.

**Planned split, not yet done**: the cart/checkout-state scenarios above (persistence, migration,
route guards, empty states) don't need the real backend at all — they're client-only state, so
they could run against `npm run dev:motos` alone (mock catalog, no docker-compose) in a fast spec
that's cheap enough to gate every PR, leaving only the catalog-browsing specs on this heavy
two-repo run. Worth doing before this file grows much further, but deliberately out of scope for
the PR that introduced this harness.
