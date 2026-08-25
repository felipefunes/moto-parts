import { Link } from 'react-router-dom';
import { ShoppingCart, MapPin } from 'lucide-react';
import { LogoWordmark } from '@/assets/logo/LogoWordmark';
import { SearchBar } from './SearchBar';
import { CategoryNav } from './CategoryNav';
import { useCartStore } from '@/store/cartStore';
import { useUiStore } from '@/store/uiStore';

export function Header() {
  const itemsCount = useCartStore((s) => s.itemsCount());
  const openCart = useUiStore((s) => s.openCart);

  return (
    <header className="sticky top-0 z-30 bg-bg-primary/95 backdrop-blur">
      <div className="border-b border-border bg-bg-secondary/50">
        <div className="container-page flex items-center justify-between py-1.5 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <MapPin size={12} /> Envíos a todo Chile
          </span>
          <span className="hidden sm:inline">Prototipo de demostración — pagos simulados</span>
        </div>
      </div>

      <div className="container-page flex items-center gap-4 py-3 sm:gap-6">
        <Link to="/" className="shrink-0">
          <LogoWordmark size="sm" />
        </Link>

        <SearchBar className="hidden flex-1 sm:block" />

        <div className="ml-auto flex items-center gap-4">
          <Link
            to="/como-comprar"
            className="hidden text-sm font-medium text-text-secondary hover:text-text-primary lg:block"
          >
            Cómo comprar
          </Link>
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 rounded-xl border border-border bg-bg-elevated px-3 py-2 text-text-primary transition-colors hover:border-brand-cyan"
            aria-label="Abrir carrito"
          >
            <ShoppingCart size={20} />
            {itemsCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gradient text-[11px] font-bold text-white">
                {itemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <SearchBar className="px-4 pb-3 sm:hidden" />

      <CategoryNav />
    </header>
  );
}
