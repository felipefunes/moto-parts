import { catalogServiceHttp } from './catalogService.http';
import { catalogServiceMock } from './catalogService.mock';
import type { CatalogService } from './catalogService.types';

// Set VITE_API_BASE_URL to switch this repo's catalog pages from mock data to the real backend
// (rpm-parts-backend) without touching components or types -- see CONTRIBUTING.md #7. Cart and
// checkout stay mocked either way; they don't go through this service.
export const catalogService: CatalogService = import.meta.env.VITE_API_BASE_URL
  ? catalogServiceHttp
  : catalogServiceMock;

export type { PaginatedProducts } from './catalogService.types';
