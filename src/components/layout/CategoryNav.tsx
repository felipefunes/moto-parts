import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { catalogService } from '@/services';
import { useAsyncData } from '@/hooks/useAsyncData';
import { getCategoryIcon } from '@/lib/categoryIcons';

/**
 * El submenú se abre con click/tap (no solo :hover) porque en touch no
 * existe hover: en mobile, antes de este cambio, no había forma de ver
 * las subcategorías sin entrar primero a la categoría completa.
 *
 * El dropdown se posiciona con `fixed` (coordenadas calculadas por JS) en
 * vez de `absolute` porque el carrusel horizontal (`overflow-x-auto`) fuerza
 * a `overflow-y` a recortar contenido (regla del spec CSS: si un eje no es
 * "visible" el otro deja de serlo también), lo que cortaba el menú.
 */
export function CategoryNav({ className }: { className?: string }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { data: categoryTree } = useAsyncData('category-tree', () => catalogService.getCategoryTree());
  const topLevelCategories = categoryTree ?? [];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenSlug(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function toggleMenu(slug: string, triggerEl: HTMLElement) {
    if (openSlug === slug) {
      setOpenSlug(null);
      return;
    }
    const rect = triggerEl.getBoundingClientRect();
    const menuWidth = 256; // w-64
    const left = Math.min(rect.left, window.innerWidth - menuWidth - 8);
    setMenuPosition({ top: rect.bottom + 4, left: Math.max(8, left) });
    setOpenSlug(slug);
  }

  const openCategory = topLevelCategories.find((c) => c.slug === openSlug);
  const openSubcategories = openCategory?.subcategories ?? [];

  return (
    <nav ref={navRef} className={clsx('relative border-b border-border bg-bg-secondary/60', className)}>
      <div className="container-page scrollbar-none flex items-center gap-1 overflow-x-auto py-1">
        {topLevelCategories.map((category) => {
          const Icon = getCategoryIcon(category.iconKey);
          const hasSubcategories = category.subcategories.length > 0;
          const isOpen = openSlug === category.slug;
          return (
            <div
              key={category.id}
              className="flex shrink-0 items-center whitespace-nowrap rounded-lg text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
            >
              <Link to={`/categoria/${category.slug}`} className="flex items-center gap-1.5 py-2 pl-3">
                <Icon size={15} className="text-brand-cyan" />
                {category.name}
              </Link>
              {hasSubcategories && (
                <button
                  type="button"
                  onClick={(e) => toggleMenu(category.slug, e.currentTarget)}
                  aria-expanded={isOpen}
                  aria-label={`Ver subcategorías de ${category.name}`}
                  className="flex h-full items-center py-2 pl-1 pr-3 text-text-muted"
                >
                  <ChevronDown size={13} className={clsx('transition-transform', isOpen && 'rotate-180')} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {openCategory && menuPosition && openSubcategories.length > 0 && (
        <div
          className="fixed z-30 w-64 rounded-xl border border-border bg-bg-elevated p-2 shadow-card"
          style={{ top: menuPosition.top, left: menuPosition.left }}
        >
          {openSubcategories.map((sub) => (
            <Link
              key={sub.id}
              to={`/categoria/${openCategory.slug}/${sub.slug}`}
              onClick={() => setOpenSlug(null)}
              className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-brand-cyan"
            >
              {sub.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
