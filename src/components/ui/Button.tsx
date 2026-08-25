import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-brand-gradient text-white shadow-glow hover:brightness-110 active:brightness-95 focus-visible:ring-brand-cyan',
  secondary: 'bg-bg-elevated text-text-primary border border-border hover:border-brand-blue/60 focus-visible:ring-brand-blue',
  ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated focus-visible:ring-border',
  outline: 'bg-transparent text-text-primary border border-border hover:border-brand-cyan focus-visible:ring-brand-cyan',
  danger: 'bg-danger text-white hover:brightness-110 focus-visible:ring-danger',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-12 px-7 text-base gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  icon,
  loading,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-heading font-semibold tracking-wide transition-all duration-150',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:brightness-75',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}
