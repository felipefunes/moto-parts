# Flow: browse catalog

**E2E test:** `e2e/tests/catalog.spec.ts`

A visitor with no account and no cart lands on the home page, drills into a category, narrows
results with a filter, opens a product, and separately runs a text search. Every step reads from
`rpm-parts-backend`'s real Postgres seed through `catalogService.http.ts` — nothing in this flow
is mocked.

## Steps

1. **Home** (`/`) — top-level categories in the nav, featured products, "Compra por categoría"
   showcase. All three come from independent `catalogService` calls (`getCategoryTree`,
   `getFeaturedProducts`, `getTopLevelCategories`).
2. **Category listing** (`/categoria/motor`) — clicking a top-level category link. Shows its
   subcategory pills and a product grid filtered to that category.
3. **Filter** — checking a brand in the sidebar (desktop) re-queries `GET /products` with
   `brands=<name>` and re-renders the grid without a full page reload.
4. **Product detail** (`/producto/:slug`) — clicking a result. Shows the product's own data plus
   its category/subcategory breadcrumb (a second `catalogService` round trip keyed off the loaded
   product) and related products.
5. **Search** (`/buscar?q=...`) — typing a query into the header search bar and submitting.
   Same `GET /products` endpoint, `query` param instead of `brands`.

## Known gaps

- No assertion on empty-search-result or empty-category-result states yet.
- No coverage of the mobile filter sheet (desktop-only checkbox locator today).
