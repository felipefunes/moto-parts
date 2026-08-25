import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { TOP_LEVEL_CATEGORIES, getSubcategories } from '@/data/categories';
import { getCategoryIcon } from '@/lib/categoryIcons';

export function CategoryNav({ className }: { className?: string }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <nav className={clsx('relative border-b border-border bg-bg-secondary/60', className)}>
      <div className="container-page scrollbar-none flex items-center gap-1 overflow-x-auto py-1">
        {TOP_LEVEL_CATEGORIES.map((category) => {
          const Icon = getCategoryIcon(category.iconKey);
          const subcategories = getSubcategories(category.slug);
          const isOpen = openSlug === category.slug;
          return (
            <div
              key={category.id}
              className="relative shrink-0"
              onMouseEnter={() => setOpenSlug(category.slug)}
              onMouseLeave={() => setOpenSlug((prev) => (prev === category.slug ? null : prev))}
            >
              <Link
                to={`/categoria/${category.slug}`}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-elevated hover:text-text-primary"
              >
                <Icon size={15} className="text-brand-cyan" />
                {category.name}
                <ChevronDown size={13} className="text-text-muted" />
              </Link>
              {isOpen && subcategories.length > 0 && (
                <div className="absolute left-0 top-full z-30 w-64 rounded-xl border border-border bg-bg-elevated p-2 shadow-card">
                  {subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/categoria/${category.slug}/${sub.slug}`}
                      className="block rounded-lg px-3 py-2 text-sm text-text-secondary hover:bg-bg-secondary hover:text-brand-cyan"
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
