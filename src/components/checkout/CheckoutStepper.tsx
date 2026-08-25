import { Check } from 'lucide-react';
import { clsx } from 'clsx';

const STEPS = [
  { key: 'direccion', label: 'Dirección' },
  { key: 'pago', label: 'Pago' },
  { key: 'confirmacion', label: 'Confirmación' },
] as const;

export function CheckoutStepper({ current }: { current: (typeof STEPS)[number]['key'] }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);

  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4">
      {STEPS.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;
        return (
          <li key={step.key} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  isDone && 'bg-success text-white',
                  isActive && 'bg-brand-gradient text-white',
                  !isDone && !isActive && 'border border-border bg-bg-elevated text-text-muted',
                )}
              >
                {isDone ? <Check size={16} /> : i + 1}
              </span>
              <span
                className={clsx(
                  'hidden font-heading text-sm font-semibold sm:inline',
                  isActive || isDone ? 'text-text-primary' : 'text-text-muted',
                )}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <span className="h-px w-8 bg-border sm:w-16" />}
          </li>
        );
      })}
    </ol>
  );
}
