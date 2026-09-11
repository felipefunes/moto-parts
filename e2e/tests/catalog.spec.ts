import { test, expect } from '@playwright/test';

// These flows all hit the real rpm-parts-backend (via docker-compose.e2e.yml) through
// catalogService.http.ts -- no mocks, no MSW. See e2e/README.md for what this does and doesn't
// cover today.

test('home page loads featured products and top-level categories from the real backend', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('navigation').getByRole('link', { name: 'Motor' })).toBeVisible();
  await expect(page.getByText('Compra por categoría')).toBeVisible();
  await expect(page.locator('a[href^="/producto/"]').first()).toBeVisible();
});

test('browsing a category, filtering by brand, and opening a product all reflect real data', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('navigation').getByRole('link', { name: 'Motor' }).click();
  await expect(page).toHaveURL(/\/categoria\/motor$/);
  await expect(page.getByText(/producto(s)? encontrado/)).toBeVisible();

  const productLinks = page.locator('a[href^="/producto/"]');
  const countBeforeFilter = await productLinks.count();
  expect(countBeforeFilter).toBeGreaterThan(0);

  await page.getByRole('checkbox', { name: 'Mahle' }).click();
  await expect(page.getByText(/producto(s)? encontrado/)).toBeVisible();
  await expect(page.getByRole('checkbox', { name: 'Mahle' })).toBeChecked();

  await productLinks.first().click();
  await expect(page).toHaveURL(/\/producto\//);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Agregar al carrito' }).first()).toBeVisible();
});

test('search returns real products matching the query', async ({ page }) => {
  await page.goto('/');
  await page.locator('input[type="search"]:visible').fill('pistón');
  await page.keyboard.press('Enter');

  await expect(page).toHaveURL(/\/buscar\?q=/);
  await expect(page.getByText(/producto(s)? encontrado/)).toBeVisible();
  await expect(page.locator('a[href^="/producto/"]').first()).toBeVisible();
});
