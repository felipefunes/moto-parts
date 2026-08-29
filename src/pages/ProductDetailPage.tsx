import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, ShoppingCart, Zap } from 'lucide-react';
import type { Product } from '@/types';
import { catalogService } from '@/services';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { ProductGallery } from '@/components/product/ProductGallery';
import { PriceTag } from '@/components/product/PriceTag';
import { RatingStars } from '@/components/product/RatingStars';
import { StockBadge } from '@/components/product/StockBadge';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getCategoryBySlug, getSubcategoryBySlug } from '@theme-active/data/categories';
import { themeConfig } from '@/theme';
import { NotFoundPage } from './NotFoundPage';

export function ProductDetailPage() {
  const { productSlug = '' } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [related, setRelated] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setQuantity(1);
    catalogService.getProductBySlug(productSlug).then((p) => {
      if (!active) return;
      if (!p) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setProduct(p);
      setLoading(false);
      catalogService.getRelatedProducts(p, 4).then((rel) => {
        if (active) setRelated(rel);
      });
    });
    return () => {
      active = false;
    };
  }, [productSlug]);

  if (notFound) return <NotFoundPage />;
  if (loading || !product) {
    return <div className="container-page py-16 text-center text-text-muted">Cargando producto…</div>;
  }

  const category = getCategoryBySlug(product.categoryId);
  const subcategory = getSubcategoryBySlug(product.categoryId, product.subcategoryId.replace(`${product.categoryId}-`, ''));

  function handleAddToCart() {
    if (!product) return;
    addItem(product, quantity);
    openCart();
  }

  function handleBuyNow() {
    if (!product) return;
    addItem(product, quantity);
    navigate('/checkout/direccion');
  }

  return (
    <div className="container-page py-6">
      <Breadcrumbs
        items={[
          { label: category?.name ?? '', to: `/categoria/${product.categoryId}` },
          ...(subcategory
            ? [{ label: subcategory.name, to: `/categoria/${product.categoryId}/${subcategory.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr] xl:grid-cols-[5fr_4fr]">
        <ProductGallery images={product.images} />

        <div>
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-cyan">{product.brand}</span>
          <h1 className="mt-1 font-heading text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            {product.name}
          </h1>
          <div className="mt-2 flex items-center gap-3">
            <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} size={16} />
            <span className="text-xs text-text-muted">SKU: {product.sku}</span>
          </div>

          <div className="mt-5">
            <PriceTag priceClp={product.priceClp} compareAtPriceClp={product.compareAtPriceClp} size="lg" />
          </div>

          <div className="mt-3">
            <StockBadge stock={product.stock} />
          </div>

          <p className="mt-5 text-sm leading-relaxed text-text-secondary">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-xl border border-border">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-text-secondary hover:text-text-primary"
                aria-label="Disminuir cantidad"
              >
                <Minus size={16} />
              </button>
              <span className="w-10 text-center font-heading font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="flex h-11 w-11 items-center justify-center text-text-secondary hover:text-text-primary"
                aria-label="Aumentar cantidad"
              >
                <Plus size={16} />
              </button>
            </div>
            <span className="text-xs text-text-muted">{product.stock} disponibles</span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              size="lg"
              fullWidth
              icon={<ShoppingCart size={18} />}
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Agregar al carrito
            </Button>
            <Button
              size="lg"
              fullWidth
              icon={<Zap size={18} />}
              className="flex-row-reverse"
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
            >
              Comprar ahora
            </Button>
          </div>

          <Card className="mt-6 p-4">
            <h3 className="mb-3 font-heading text-sm font-bold uppercase tracking-wide text-text-primary">
              Especificaciones
            </h3>
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between border-b border-border/60 py-1.5 text-sm">
                  <dt className="text-text-muted">{spec.label}</dt>
                  <dd className="font-medium text-text-primary">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>

      {themeConfig.ProductExtraSection && <themeConfig.ProductExtraSection product={product} />}

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-heading text-lg font-bold text-text-primary">También te puede interesar</h2>
          <ProductGrid products={related} />
        </div>
      )}
    </div>
  );
}
