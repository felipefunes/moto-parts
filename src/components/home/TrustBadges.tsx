import { MOTORCYCLE_BRANDS } from '@/data/motorcycleModels';

export function TrustBadges() {
  return (
    <section className="border-b border-border bg-bg-secondary/60 py-5">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Compatible con
        </span>
        {MOTORCYCLE_BRANDS.map((brand) => (
          <span key={brand} className="font-heading text-sm font-bold text-text-secondary">
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}
