import type { ElementType, ReactNode } from 'react';
import { clsx } from 'clsx';

export function GradientText({
  as: Tag = 'span',
  className,
  children,
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}) {
  return <Tag className={clsx('text-gradient-brand', className)}>{children}</Tag>;
}
