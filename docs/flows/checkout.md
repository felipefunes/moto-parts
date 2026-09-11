# Flow: cart → checkout → confirmation

**E2E test:** `e2e/tests/checkout.spec.ts`

A visitor adds one product to their cart and completes checkout with a simulated payment.

## What's real vs. mocked

Unlike catalog browsing, **only the product data in this flow comes from the real backend.**
Cart, address, and payment are still client-only, by design (see `CONTRIBUTING.md` #7 and the
`moto-parts` PR #25/#26 descriptions):

- **Cart** — `useCartStore` (zustand), held in memory, not `rpm-parts-backend`'s
  `POST /cart` / `POST /cart/{id}/items`.
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

Once cart/checkout are migrated to `catalogService`-style real HTTP calls (tracked as an open
item from the PR #26 review — `useCart.ts` / `CheckoutPaymentPage.tsx` still import `PRODUCTS`
directly), this doc and test need a pass to reflect what's actually hitting the backend.
