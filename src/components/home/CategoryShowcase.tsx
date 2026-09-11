import { Link } from 'react-router-dom';
import { catalogService } from '@/services';
import { useAsyncData } from '@/hooks/useAsyncData';

export function CategoryShowcase() {
  const { data: categories } = useAsyncData('top-level-categories', () => catalogService.getTopLevelCategories());

  return (
    <section className="container-page py-12">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-2xl font-bold text-text-primary">Compra por categoría</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {(categories ?? []).map((category) => (
          <Link
            key={category.id}
            to={`/categoria/${category.slug}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border"
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/20 to-transparent" />
            <span className="absolute bottom-2 left-2 right-2 font-heading text-sm font-bold text-text-primary">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
