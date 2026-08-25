import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { PriceTag } from './PriceTag';
import { RatingStars } from './RatingStars';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useUiStore((s) => s.openCart);
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    openCart();
  }

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-colors hover:border-brand-blue/50">
      <Link to={`/producto/${product.slug}`} className="flex h-full flex-col">
        <div className="relative aspect-square overflow-hidden bg-bg-elevated">
          <img
            src={primaryImage.url}
            alt={primaryImage.alt}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {product.tags?.includes('oferta') && <Badge tone="danger">Oferta</Badge>}
            {product.tags?.includes('destacado') && <Badge tone="brand">Destacado</Badge>}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {product.brand}
          </span>
          <h3 className="line-clamp-2 min-h-[2.5rem] font-heading text-base font-semibold leading-tight text-text-primary">
            {product.name}
          </h3>
          <RatingStars rating={product.rating} reviewsCount={product.reviewsCount} />
          <div className="mt-auto pt-2">
            <PriceTag priceClp={product.priceClp} compareAtPriceClp={product.compareAtPriceClp} />
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-bg-elevated py-2.5 text-sm font-heading font-semibold text-text-primary transition-colors hover:border-brand-cyan hover:text-brand-cyan disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ShoppingCart size={16} />
          Agregar al carrito
        </button>
      </div>
    </Card>
  );
}
