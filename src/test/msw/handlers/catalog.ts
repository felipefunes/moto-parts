import { http, HttpResponse } from 'msw';

export const API_BASE_URL = 'https://api.test.local';

const category = {
  slug: 'motor',
  name: 'Motor',
  iconKey: 'cog',
  imageUrl: 'https://images.example.com/motor.jpg',
};

const categoryDetail = {
  ...category,
  subcategories: [{ slug: 'pistones-anillos', name: 'Pistones y anillos' }],
};

const product = {
  id: 'prod-1',
  slug: 'piston-forjado-125cc',
  sku: 'SKU-001',
  name: 'Pistón forjado 125cc',
  brand: 'DID',
  categoryId: 'motor',
  subcategoryId: 'motor-pistones-anillos',
  description: 'Descripción larga.',
  shortDescription: 'Descripción corta.',
  priceClp: 18990,
  compareAtPriceClp: null,
  currency: 'CLP',
  stock: 12,
  condition: 'new',
  images: [{ url: 'https://images.example.com/p1.jpg', alt: 'Pistón', isPrimary: true }],
  specs: [{ label: 'Diámetro', value: '52.4mm' }],
  compatibility: [{ brand: 'Honda', model: 'CG 150', yearFrom: 2010, yearTo: 2020 }],
  rating: 4.5,
  reviewsCount: 20,
  warrantyMonths: 6,
  weightKg: 0.3,
  tags: ['destacado'],
  isFeatured: true,
  createdAt: '2026-01-01T00:00:00Z',
};

export const catalogHandlers = [
  http.get(`${API_BASE_URL}/categories`, () => HttpResponse.json([category])),

  http.get(`${API_BASE_URL}/categories/:slug`, ({ params }) => {
    if (params.slug !== 'motor') return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(categoryDetail);
  }),

  http.get(`${API_BASE_URL}/products`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json({
      items: [product],
      total: 1,
      page: Number(url.searchParams.get('page') ?? 1),
      pageSize: Number(url.searchParams.get('pageSize') ?? 12),
      totalPages: 1,
    });
  }),

  http.get(`${API_BASE_URL}/products/featured`, () => HttpResponse.json([product])),

  http.get(`${API_BASE_URL}/products/brands`, () => HttpResponse.json(['DID', 'NGK'])),

  http.get(`${API_BASE_URL}/products/:slug/related`, ({ params }) => {
    if (params.slug !== product.slug) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json([product]);
  }),

  http.get(`${API_BASE_URL}/products/:slug`, ({ params }) => {
    if (params.slug !== product.slug) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(product);
  }),
];

export const catalogFixtures = { category, categoryDetail, product };
