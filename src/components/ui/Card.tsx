import type { HTMLAttributes } from 'react';
import { clsx } from 'clsx';

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        'rounded-2xl border border-border bg-bg-secondary shadow-card',
        className,
      )}
      {...rest}
    />
  );
}
