# Velocity log

One row per PR, added when the PR is opened. Goal: compare actual time against whatever
estimate was given up front, so future estimates get better. Same convention as
`rpm-parts-backend`'s `docs/velocity-log.md` — see that file for the fuller methodology note.

**What "Real" measures, honestly**: wall-clock time between the first commit touching this
work and the PR being opened, or (for a single-commit PR) between the previous PR in *this*
repo merging and this one opening — whichever is meaningful. When work is interleaved with the
other repo (`rpm-parts-backend`) for an extended stretch, that heuristic overstates the actual
time on this specific task; noted per row when it applies, rather than reporting a misleading
number.

| Date | Feature (PR) | Estimated | Real | Notes |
|---|---|---|---|---|
| 2026-09-10 | Vitest + RTL + MSW harness ([#24](https://github.com/felipefunes/moto-parts/pull/24)) | — (no estimate given) | not meaningful | The "previous PR merged" anchor (#22, ~19h earlier) would overstate this — that whole gap was spent on `rpm-parts-backend` work, not on this repo. First entry in this log; no better anchor available for a single-commit PR after a cross-repo gap. |
| 2026-09-10 | HTTP-backed catalogService behind `VITE_API_BASE_URL` ([#25](https://github.com/felipefunes/moto-parts/pull/25)) | — (no estimate given) | ~21 min (previous PR #24 merged 19:56 UTC → this one opened 20:17 UTC) | Includes a short side trip to `rpm-parts-backend` (tagging `v0.1.0` so the frontend had a real version to sync against) — a few seconds of the window, not worth a bigger caveat. |
| 2026-09-10 | Wire CategoryNav/CategoryShowcase/Footer/FilterSidebar to catalogService ([#26](https://github.com/felipefunes/moto-parts/pull/26)) | — (no estimate given) | ~49 min, not meaningful | Measured PR #25 merged (21:00 UTC) → this one opened. Most of the window was in `rpm-parts-backend` (v0.2.0: categories now include subcategories, plus the CORS fix that manual browser verification surfaced), not this repo. |
| 2026-09-11 | E2E harness (Playwright + docker-compose) | — (no estimate given) | not meaningful | Measured PR #26 merged (2026-09-10 01:00 UTC) → this one opened (2026-09-11), a ~12.5h span including an overnight gap and unrelated `rpm-parts-backend` work (ktlint, reservation-expiry sweep) in the parallel session. Building the checkout spec against the real backend surfaced a genuine bug, not just a style bypass: `useCart.ts` resolved cart lines by looking up `productId` in the static mock catalog, so a real backend product (Postgres UUID, never in that array) silently vanished from the cart UI while still counting toward the subtotal. Fixed by snapshotting the product's display fields on the cart item at add-time instead of looking it up later by id anywhere — also let `CheckoutPaymentPage.tsx` drop its own `PRODUCTS` import, closing both bypasses the PR #26 review flagged (one directly, one as a body comment) in the same pass. |
