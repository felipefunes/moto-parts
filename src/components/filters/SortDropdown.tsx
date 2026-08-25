const OPTIONS: { value: string; label: string }[] = [
  { value: 'relevance', label: 'Más relevantes' },
  { value: 'price_asc', label: 'Menor precio' },
  { value: 'price_desc', label: 'Mayor precio' },
  { value: 'rating', label: 'Mejor calificados' },
  { value: 'newest', label: 'Más nuevos' },
];

export function SortDropdown({ value, onChange }: { value?: string; onChange: (value: string) => void }) {
  return (
    <select
      value={value ?? 'relevance'}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-lg border border-border bg-bg-elevated px-3 py-2 text-sm text-text-primary focus:border-brand-cyan focus:outline-none"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
