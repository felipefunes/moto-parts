import { useState } from 'react';
import { formatClp } from '@/lib/formatCurrency';

const PRESETS: [number, number | undefined][] = [
  [0, 10000],
  [10000, 30000],
  [30000, 80000],
  [80000, undefined],
];

export function PriceRangeFilter({
  min,
  max,
  onChange,
}: {
  min?: number;
  max?: number;
  onChange: (min?: number, max?: number) => void;
}) {
  const [localMin, setLocalMin] = useState(min?.toString() ?? '');
  const [localMax, setLocalMax] = useState(max?.toString() ?? '');

  return (
    <div className="border-b border-border py-4">
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-text-primary">
        Precio
      </h3>
      <div className="mb-3 flex flex-col gap-1.5">
        {PRESETS.map(([presetMin, presetMax]) => (
          <button
            key={`${presetMin}-${presetMax}`}
            onClick={() => onChange(presetMin, presetMax)}
            className="rounded-md px-2 py-1 text-left text-sm text-text-secondary hover:bg-bg-elevated hover:text-text-primary"
          >
            {formatClp(presetMin)} {presetMax ? `– ${formatClp(presetMax)}` : 'y más'}
          </button>
        ))}
      </div>
      <form
        className="flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          onChange(localMin ? Number(localMin) : undefined, localMax ? Number(localMax) : undefined);
        }}
      >
        <input
          type="number"
          placeholder="Mín"
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg-elevated px-2 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-cyan focus:outline-none"
        />
        <span className="text-text-muted">–</span>
        <input
          type="number"
          placeholder="Máx"
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-full rounded-lg border border-border bg-bg-elevated px-2 py-1.5 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-cyan focus:outline-none"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-bg-elevated px-2.5 py-1.5 text-sm font-semibold text-brand-cyan hover:bg-border"
        >
          Ir
        </button>
      </form>
    </div>
  );
}
