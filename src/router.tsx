import { createBrowserRouter } from 'react-router-dom';
import { App } from '@/App';
import { HomePage } from '@/pages/HomePage';
import { CategoryListingPage } from '@/pages/CategoryListingPage';
import { SearchResultsPage } from '@/pages/SearchResultsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CartPage } from '@/pages/CartPage';
import { CheckoutAddressPage } from '@/pages/checkout/CheckoutAddressPage';
import { CheckoutPaymentPage } from '@/pages/checkout/CheckoutPaymentPage';
import { CheckoutConfirmationPage } from '@/pages/checkout/CheckoutConfirmationPage';
import { AboutPage } from '@/pages/AboutPage';
import { HowToBuyPage } from '@/pages/HowToBuyPage';
import { NotFoundPage } from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'categoria/:categorySlug', element: <CategoryListingPage /> },
      { path: 'categoria/:categorySlug/:subSlug', element: <CategoryListingPage /> },
      { path: 'buscar', element: <SearchResultsPage /> },
      { path: 'producto/:productSlug', element: <ProductDetailPage /> },
      { path: 'carrito', element: <CartPage /> },
      { path: 'checkout/direccion', element: <CheckoutAddressPage /> },
      { path: 'checkout/pago', element: <CheckoutPaymentPage /> },
      { path: 'checkout/confirmacion/:orderNumber', element: <CheckoutConfirmationPage /> },
      { path: 'nosotros', element: <AboutPage /> },
      { path: 'como-comprar', element: <HowToBuyPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
