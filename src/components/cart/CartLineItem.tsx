import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartLine } from '@/hooks/useCart';
import { formatClp } from '@/lib/formatCurrency';
import { useCartStore } from '@/store/cartStore';

export function CartLineItem({ line, compact }: { line: CartLine; compact?: boolean }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  if (!line.product) return null;
  const image = line.product.images[0];

  return (
    <div className="flex gap-3 py-3">
      <Link to={`/producto/${line.product.slug}`} className="shrink-0">
        <img
          src={image.url}
          alt={image.alt}
          className={compact ? 'h-16 w-16 rounded-lg object-cover' : 'h-24 w-24 rounded-lg object-cover'}
        />
      </Link>
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <Link
            to={`/producto/${line.product.slug}`}
            className="line-clamp-2 font-heading text-sm font-semibold text-text-primary hover:text-brand-cyan"
          >
            {line.product.name}
          </Link>
          <p className="text-xs text-text-muted">{line.product.brand}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 rounded-lg border border-border">
            <button
              onClick={() => updateQuantity(line.productId, line.quantity - 1)}
              className="flex h-7 w-7 items-center justify-center text-text-secondary hover:text-text-primary"
              aria-label="Disminuir cantidad"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-sm font-semibold">{line.quantity}</span>
            <button
              onClick={() => updateQuantity(line.productId, line.quantity + 1)}
              disabled={line.quantity >= line.product.stock}
              className="flex h-7 w-7 items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-40"
              aria-label="Aumentar cantidad"
            >
              <Plus size={14} />
            </button>
          </div>
          <span className="font-mono text-sm font-semibold text-price">{formatClp(line.subtotalClp)}</span>
        </div>
      </div>
      <button
        onClick={() => removeItem(line.productId)}
        className="h-fit text-text-muted hover:text-danger"
        aria-label="Eliminar del carrito"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
