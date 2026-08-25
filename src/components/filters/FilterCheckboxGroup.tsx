export function FilterCheckboxGroup({
  title,
  options,
  selected,
  onChange,
}: {
  title: string;
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  function toggle(option: string) {
    if (selected.includes(option)) {
      onChange(selected.filter((o) => o !== option));
    } else {
      onChange([...selected, option]);
    }
  }

  if (options.length === 0) return null;

  return (
    <div className="border-b border-border py-4">
      <h3 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wide text-text-primary">
        {title}
      </h3>
      <div className="flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
        {options.map((option) => (
          <label key={option} className="flex cursor-pointer items-center gap-2 text-sm text-text-secondary hover:text-text-primary">
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="h-4 w-4 rounded border-border bg-bg-elevated accent-brand-blue"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}
