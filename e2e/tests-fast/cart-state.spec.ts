import { test, expect, type Page } from '@playwright/test';
import { CART_STORAGE_KEY, ORDERS_STORAGE_KEY } from '../../src/lib/constants';

// Cart/checkout client-state behavior -- deliberately mock mode (no VITE_API_BASE_URL, no
// backend), since none of this depends on where the catalog data comes from. See
// e2e/playwright.fast.config.ts and e2e/README.md.

async function goToMotorListing(page: Page) {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Motor' }).click();
  await expect(page).toHaveURL(/\/categoria\/motor$/);
  // The URL updates before the product grid's async fetch resolves -- without this, reading a
  // product's name or clicking its "Agregar al carrito" button can race the grid's own loading
  // state. Passed locally every time but flaked on CI's slower runner, which is exactly the kind
  // of race a faster machine hides.
  await expect(page.getByText(/producto(s)? encontrado/)).toBeVisible();
}

/** Adds the nth product card's own "Agregar al carrito" button from the Motor listing grid,
 * without navigating to its detail page (the button stops propagation on the card's Link).
 * Closes the cart drawer it opens afterward -- otherwise its full-viewport overlay blocks the
 * next click on the grid underneath. */
async function addProductFromListing(page: Page, index: number) {
  await page.getByRole('button', { name: 'Agregar al carrito' }).nth(index).click();
  await page.getByLabel('Cerrar carrito').click();
}

async function openCartDrawer(page: Page) {
  await page.getByRole('banner').getByLabel('Abrir carrito').click();
}

function cartPageEmptyHeading(page: Page) {
  return page.getByRole('heading', { name: 'Tu carrito está vacío' });
}

async function completeCheckout(page: Page) {
  await openCartDrawer(page);
  await page.getByRole('link', { name: 'Ver carrito completo' }).click();
  await page.getByRole('link', { name: 'Continuar con la compra' }).click();

  await expect(page).toHaveURL(/\/checkout\/direccion$/);
  await page.getByPlaceholder('Juan Pérez').fill('Cliente de Prueba');
  await page.getByPlaceholder('tu@correo.cl').fill('cliente@example.com');
  await page.getByPlaceholder('+56 9 1234 5678').fill('+56 9 1234 5678');
  await page.getByPlaceholder('Av. Providencia').fill('Av. Siempre Viva');
  await page.getByPlaceholder('1234', { exact: true }).fill('742');
  await page.getByPlaceholder('Santiago').fill('Santiago');
  await page.getByPlaceholder('Providencia', { exact: true }).fill('Providencia');
  await page.getByRole('button', { name: 'Continuar a pago' }).click();

  await expect(page).toHaveURL(/\/checkout\/pago$/);
}

async function pay(page: Page, cardNumber: string) {
  await page.getByPlaceholder('Número de tarjeta').fill(cardNumber);
  await page.getByPlaceholder('Nombre en la tarjeta').fill('CLIENTE DE PRUEBA');
  await page.getByPlaceholder('MM/AA').fill('12/30');
  await page.getByPlaceholder('CVV').fill('123');
  await page.getByRole('button', { name: /^Pagar/ }).click();
}

test.describe('cart persistence and migration', () => {
  test('a v1-shaped cart in localStorage is discarded, not crashed on, by the v2 migration', async ({ page }) => {
    await page.addInitScript(
      ({ key }) => {
        localStorage.setItem(
          key,
          JSON.stringify({
            state: {
              items: [{ productId: 'stale-id', quantity: 2, unitPriceClp: 10000, addedAt: new Date().toISOString() }],
            },
            version: 1,
          }),
        );
      },
      { key: CART_STORAGE_KEY },
    );

    await page.goto('/carrito');

    await expect(cartPageEmptyHeading(page)).toBeVisible();
  });

  test('a cart survives a reload (the snapshot the migration protects)', async ({ page }) => {
    await goToMotorListing(page);
    // Scoped to a product card link, not just any level-3 heading -- FilterSidebar's "Precio"/
    // "Marca" section titles are h3 too and come first in DOM order.
    const productCard = page.locator('a[href^="/producto/"]').first();
    const productName = (await productCard.getByRole('heading', { level: 3 }).textContent())!.trim();
    await addProductFromListing(page, 0);

    await page.goto('/carrito');
    await expect(page.getByRole('main').getByText(productName)).toBeVisible();

    await page.reload();

    await expect(page.getByRole('main').getByText(productName)).toBeVisible();
    await expect(page.getByText('1 producto', { exact: false })).toBeVisible();
  });
});

test.describe('checkout route guards', () => {
  test('an empty cart redirects away from both checkout steps', async ({ page }) => {
    await page.goto('/checkout/direccion');
    await expect(page).toHaveURL(/\/carrito$/);

    await page.goto('/checkout/pago');
    await expect(page).toHaveURL(/\/carrito$/);
  });

  test('checkout/pago redirects to the address step when there is no stored address yet', async ({ page }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);

    await page.goto('/checkout/pago');

    await expect(page).toHaveURL(/\/checkout\/direccion$/);
  });
});

test.describe('cart quantity mutation', () => {
  test('adding the same product twice merges into one line with quantity 2, not two lines', async ({ page }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);
    await addProductFromListing(page, 0);

    await openCartDrawer(page);
    await page.getByRole('link', { name: 'Ver carrito completo' }).click();
    await expect(page).toHaveURL(/\/carrito$/);
    await expect(page.getByText('1 producto', { exact: false })).toBeVisible();
    // The quantity span sits between the two +/- buttons -- more precise than searching the
    // whole page for the digit "2", which could match a price or something else. Scoped to
    // <main>: the cart drawer stays mounted off-screen with its own copy of the same line.
    await expect(
      page.getByRole('main').locator('button[aria-label="Disminuir cantidad"] + span'),
    ).toHaveText('2');
  });

  test('adding two different products creates two separate lines', async ({ page }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);
    await addProductFromListing(page, 1);

    await openCartDrawer(page);
    await page.getByRole('link', { name: 'Ver carrito completo' }).click();

    await expect(page).toHaveURL(/\/carrito$/);
    await expect(page.getByText('2 productos', { exact: false })).toBeVisible();
  });

  test('decrementing to 0 removes the line, and so does the trash icon', async ({ page }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);
    await addProductFromListing(page, 1);
    await openCartDrawer(page);
    await page.getByRole('link', { name: 'Ver carrito completo' }).click();
    await expect(page).toHaveURL(/\/carrito$/);

    // Scoped to <main>: the cart drawer stays mounted off-screen with its own copies of these
    // same controls for the same lines.
    const main = page.getByRole('main');
    await main.getByLabel('Disminuir cantidad').first().click();
    await expect(page.getByText('1 producto', { exact: false })).toBeVisible();

    await main.getByLabel('Eliminar del carrito').first().click();
    await expect(cartPageEmptyHeading(page)).toBeVisible();
  });

  test('the header badge reflects the total item count across lines', async ({ page }) => {
    await goToMotorListing(page);
    const header = page.getByRole('banner');

    await expect(header.getByLabel('Abrir carrito')).not.toContainText(/\d/);

    await addProductFromListing(page, 0);
    await expect(header.getByLabel('Abrir carrito')).toContainText('1');

    await addProductFromListing(page, 1);
    await expect(header.getByLabel('Abrir carrito')).toContainText('2');
  });
});

test.describe('order lifecycle', () => {
  test('a successful order clears the cart and re-triggers the empty-cart guard', async ({ page }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);
    await completeCheckout(page);
    await pay(page, '4111 1111 1111 1234');

    await expect(page).toHaveURL(/\/checkout\/confirmacion\//, { timeout: 10_000 });

    await page.goto('/carrito');
    await expect(cartPageEmptyHeading(page)).toBeVisible();

    await page.goto('/checkout/pago');
    await expect(page).toHaveURL(/\/carrito$/);
  });

  test('a rejected payment shows the error, keeps the cart, and a retry with a valid card succeeds', async ({
    page,
  }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);
    await completeCheckout(page);

    await pay(page, '4111 1111 1111 0000');
    await expect(page.getByText('El pago fue rechazado')).toBeVisible();

    // orderService.createOrder has its own 150ms mockRequest delay -- a bug that skips the
    // rejected-payment guard wouldn't show up as an immediate URL change, it'd navigate ~150ms
    // later. Waiting past that and checking localStorage directly (rather than re-checking the
    // URL right away, which could pass on a technicality if it runs before that delayed
    // navigation fires) is what actually proves no order got created.
    await page.waitForTimeout(500);
    const orders = await page.evaluate((key) => localStorage.getItem(key), ORDERS_STORAGE_KEY);
    expect(orders === null ? [] : JSON.parse(orders)).toHaveLength(0);
    await expect(page).toHaveURL(/\/checkout\/pago$/);

    await page.goto('/carrito');
    await expect(cartPageEmptyHeading(page)).not.toBeVisible();

    await page.goto('/checkout/pago');
    await pay(page, '4111 1111 1111 1234');
    await expect(page).toHaveURL(/\/checkout\/confirmacion\//, { timeout: 10_000 });
  });
});

test.describe('confirmation page', () => {
  test('reloading the confirmation page still renders the order (read from localStorage)', async ({ page }) => {
    await goToMotorListing(page);
    await addProductFromListing(page, 0);
    await completeCheckout(page);
    await pay(page, '4111 1111 1111 1234');
    await expect(page).toHaveURL(/\/checkout\/confirmacion\//, { timeout: 10_000 });

    await page.reload();

    await expect(page.getByText('¡Pedido confirmado!')).toBeVisible();
  });

  test('an unknown order number renders the 404 page', async ({ page }) => {
    await page.goto('/checkout/confirmacion/MP-0000-000000');

    await expect(page.getByText('404')).toBeVisible();
  });
});

test.describe('empty states', () => {
  test('the cart page shows an empty state with no items', async ({ page }) => {
    await page.goto('/carrito');

    await expect(cartPageEmptyHeading(page)).toBeVisible();
    await expect(page.getByRole('link', { name: 'Ir al catálogo' })).toBeVisible();
  });

  test('the cart drawer can be opened empty from the header', async ({ page }) => {
    await page.goto('/');

    await openCartDrawer(page);

    await expect(page.getByRole('dialog', { name: 'Carrito de compras' })).toBeInViewport();
    await expect(page.getByText('Tu carrito está vacío.')).toBeVisible();
  });
});
