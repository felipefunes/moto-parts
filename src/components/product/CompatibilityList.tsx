import { Check } from 'lucide-react';
import type { MotorcycleCompatibility } from '@/types';

export function CompatibilityList({ items }: { items: MotorcycleCompatibility[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-text-secondary">Repuesto universal, compatible con la mayoría de los modelos.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {items.map((c, i) => (
        <li
          key={i}
          className="flex items-center gap-2 rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm"
        >
          <Check size={16} className="shrink-0 text-success" />
          <span className="text-text-primary">
            {c.brand} {c.model}
          </span>
          <span className="ml-auto text-xs text-text-muted">
            {c.yearFrom}–{c.yearTo}
          </span>
        </li>
      ))}
    </ul>
  );
}
