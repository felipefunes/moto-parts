# Flow: cart → checkout → confirmation

**E2E test:** `e2e/tests/checkout.spec.ts`

A visitor adds one product to their cart and completes checkout with a simulated payment.

## What's real vs. mocked

Unlike catalog browsing, **only the product data in this flow comes from the real backend.**
Cart, address, and payment are still client-only, by design (see `CONTRIBUTING.md` #7 and the
`moto-parts` PR #25/#26 descriptions):

- **Cart** — `useCartStore` (zustand), persisted to `localStorage` (survives a reload/new tab,
  not just in-memory), not `rpm-parts-backend`'s `POST /cart` / `POST /cart/{id}/items`. Each
  cart item snapshots its product's display fields at add-time rather than re-looking them up
  later, so it renders correctly regardless of which catalog source (mock or real backend) the
  product came from — see the comment on `addItem` in `cartStore.ts`.
- **Address** — written to `sessionStorage`, never sent anywhere.
- **Payment** — `paymentService.confirmTransaction` simulates a Chilean gateway
  (Webpay Plus/Transbank-style) locally; a card ending in `0000` simulates a rejection, anything
  else succeeds. `rpm-parts-backend`'s real `POST /checkout` (with its inventory reservation) is
  never called from this UI yet.

This test is still worth having despite that: it's the one thing that exercises the full app,
start to finish, the way a person actually would, and it would catch a regression in any of the
handoffs between pages (cart → address → payment → confirmation) even though the backend
integration for this half of the flow doesn't exist yet.

## Steps

1. Browse to a product (see `catalog-browsing.md`) and click "Agregar al carrito".
2. `/carrito` — the product appears in the cart summary.
3. "Continuar con la compra" → `/checkout/direccion` — fill the address form, submit.
4. `/checkout/pago` — fill card details (any number not ending in `0000`), submit.
5. `/checkout/confirmacion/:orderNumber` — "¡Pedido confirmado!" with the order's line items.

## Follow-up

`useCart.ts` / `CheckoutPaymentPage.tsx` no longer import `PRODUCTS` directly (fixed in PR #27,
alongside this harness — see `cartStore.ts`'s `addItem` comment). What's left, tracked in
`e2e/README.md`'s "Known gaps" section: cart/address/payment are still client-only by design (not
a bug to fix, a scope boundary for this milestone), and the actual `POST /checkout` integration —
with its inventory reservation — isn't wired into this UI yet.
