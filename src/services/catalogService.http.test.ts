import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '@/test/msw/server';
import { API_BASE_URL, catalogFixtures, catalogHandlers } from '@/test/msw/handlers/catalog';
import { catalogServiceHttp } from './catalogService.http';

beforeEach(() => {
  vi.stubEnv('VITE_API_BASE_URL', API_BASE_URL);
  server.use(...catalogHandlers);
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('catalogServiceHttp', () => {
  it('maps GET /categories to top-level Category objects', async () => {
    const categories = await catalogServiceHttp.getTopLevelCategories();

    expect(categories).toEqual([
      { id: 'motor', slug: 'motor', name: 'Motor', parentId: null, iconKey: 'cog', imageUrl: expect.any(String) },
    ]);
  });

  it('gets the full category tree from a single GET /categories call', async () => {
    let requestCount = 0;
    server.use(
      http.get(`${API_BASE_URL}/categories`, () => {
        requestCount += 1;
        return HttpResponse.json([catalogFixtures.categoryDetail]);
      }),
    );

    const tree = await catalogServiceHttp.getCategoryTree();

    expect(requestCount).toBe(1);
    expect(tree).toEqual([
      {
        id: 'motor',
        slug: 'motor',
        name: 'Motor',
        parentId: null,
        iconKey: 'cog',
        imageUrl: expect.any(String),
        subcategories: [
          { id: 'motor-pistones-anillos', slug: 'pistones-anillos', name: 'Pistones y anillos', parentId: 'motor' },
        ],
      },
    ]);
  });

  it('returns undefined for a category slug the backend 404s on', async () => {
    await expect(catalogServiceHttp.getCategoryBySlug('no-existe')).resolves.toBeUndefined();
  });

  it('maps a category detail response into subcategories with composite ids', async () => {
    const subcategories = await catalogServiceHttp.getSubcategories('motor');

    expect(subcategories).toEqual([
      { id: 'motor-pistones-anillos', slug: 'pistones-anillos', name: 'Pistones y anillos', parentId: 'motor' },
    ]);
  });

  it('finds one subcategory by slug within a parent, or undefined if absent', async () => {
    await expect(catalogServiceHttp.getSubcategoryBySlug('motor', 'pistones-anillos')).resolves.toMatchObject({
      slug: 'pistones-anillos',
    });
    await expect(catalogServiceHttp.getSubcategoryBySlug('motor', 'no-existe')).resolves.toBeUndefined();
  });

  it('maps a paginated product search response, preserving isPrimary/isFeatured field names', async () => {
    const result = await catalogServiceHttp.getProducts({ page: 2, pageSize: 24 });

    expect(result.total).toBe(1);
    expect(result.items[0].images[0].isPrimary).toBe(true);
    expect(result.items[0].isFeatured).toBe(true);
  });

  it('sends array filters as repeated query params the backend can bind to a List<String>', async () => {
    let receivedBrands: string[] = [];
    server.use(
      http.get(`${API_BASE_URL}/products`, ({ request }) => {
        receivedBrands = new URL(request.url).searchParams.getAll('brands');
        return HttpResponse.json({ items: [], total: 0, page: 1, pageSize: 12, totalPages: 1 });
      }),
    );

    await catalogServiceHttp.getProducts({ brands: ['DID', 'NGK'] });

    expect(receivedBrands).toEqual(['DID', 'NGK']);
  });

  it('gets a product by slug, or undefined on 404', async () => {
    const product = await catalogServiceHttp.getProductBySlug(catalogFixtures.product.slug);
    expect(product?.name).toBe(catalogFixtures.product.name);

    await expect(catalogServiceHttp.getProductBySlug('no-existe')).resolves.toBeUndefined();
  });

  it('gets featured products', async () => {
    const featured = await catalogServiceHttp.getFeaturedProducts();
    expect(featured).toHaveLength(1);
  });

  it('gets related products for a given product, or [] on 404', async () => {
    const related = await catalogServiceHttp.getRelatedProducts({
      ...(await catalogServiceHttp.getProductBySlug(catalogFixtures.product.slug))!,
    });
    expect(related).toHaveLength(1);

    const none = await catalogServiceHttp.getRelatedProducts({
      ...(await catalogServiceHttp.getProductBySlug(catalogFixtures.product.slug))!,
      slug: 'no-existe',
    });
    expect(none).toEqual([]);
  });

  it('gets available brands as a flat string list', async () => {
    await expect(catalogServiceHttp.getAvailableBrands()).resolves.toEqual(['DID', 'NGK']);
  });
});
