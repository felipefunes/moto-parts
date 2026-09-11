import { test, expect } from '@playwright/test';

// Cart, address, and payment are still client-only (zustand + sessionStorage + a simulated
// gateway) -- catalogService is the only piece of this flow talking to the real backend today.
// This test is still worth having: it's the one thing that exercises the full app, start to
// finish, the way a person actually would. See e2e/README.md and CONTRIBUTING.md #7.
test('golden path: browse catalog, add to cart, and complete a mock checkout', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Motor' }).click();
  await page.locator('a[href^="/producto/"]').first().click();
  await expect(page).toHaveURL(/\/producto\//);

  const productName = (await page.getByRole('heading', { level: 1 }).textContent())!.trim();
  await page.getByRole('button', { name: 'Agregar al carrito' }).first().click();

  // Adding an item opens the cart drawer automatically -- follow it to the full cart page
  // instead of page.goto(), which would force a full reload and isn't how a user gets there.
  // toBeInViewport() (not toBeVisible()) actually verifies it opened: the drawer is always
  // mounted and only translated off-screen when closed, so toBeVisible() would pass regardless.
  await expect(page.getByRole('dialog', { name: 'Carrito de compras' })).toBeInViewport();
  await page.getByRole('link', { name: 'Ver carrito completo' }).click();

  await expect(page).toHaveURL(/\/carrito$/);
  await expect(page.getByRole('heading', { level: 1, name: /^Tu carrito/ })).toBeVisible();
  // The cart drawer stays mounted (translated off-screen, not unmounted) after navigating away,
  // so scope to the page content to avoid matching its now-hidden copy of the same line item.
  await expect(page.getByRole('main').getByText(productName)).toBeVisible();
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
  await page.getByPlaceholder('Número de tarjeta').fill('4111 1111 1111 1234');
  await page.getByPlaceholder('Nombre en la tarjeta').fill('CLIENTE DE PRUEBA');
  await page.getByPlaceholder('MM/AA').fill('12/30');
  await page.getByPlaceholder('CVV').fill('123');
  await page.getByRole('button', { name: /^Pagar/ }).click();

  await expect(page).toHaveURL(/\/checkout\/confirmacion\//, { timeout: 10_000 });
  await expect(page.getByText('¡Pedido confirmado!')).toBeVisible();
  await expect(page.getByText(productName)).toBeVisible();
});
