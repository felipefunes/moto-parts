import type { ReactNode } from 'react';
import { clsx } from 'clsx';

type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'lime';

const toneClasses: Record<Tone, string> = {
  neutral: 'bg-bg-elevated text-text-secondary border border-border',
  brand: 'bg-brand-violet/15 text-brand-cyan border border-brand-violet/30',
  success: 'bg-success/15 text-success border border-success/30',
  warning: 'bg-warning/15 text-warning border border-warning/30',
  danger: 'bg-danger/15 text-danger border border-danger/30',
  lime: 'bg-racing-lime/15 text-racing-lime border border-racing-lime/30',
};

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide',
        toneClasses[tone],
      )}
    >
      {children}
    </span>
  );
}
