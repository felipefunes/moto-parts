import { themeConfig } from '@/theme';

export function TrustBadges() {
  return (
    <section className="border-b border-border bg-bg-secondary/60 py-5">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {themeConfig.strip.title}
        </span>
        {themeConfig.strip.items.map((item) => (
          <span key={item} className="font-heading text-sm font-bold text-text-secondary">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
