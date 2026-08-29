import type { Config } from 'tailwindcss';

/**
 * Los colores y tipografías resuelven a CSS custom properties (definidas en
 * cada src/themes/<tema>/theme.css), no a valores fijos — así un mismo build
 * de Tailwind sirve a cualquier tema sin tocar esta config. Los colores se
 * guardan como triplete "R G B" para que seguir funcionando los modificadores
 * de opacidad de Tailwind (ej. `bg-brand-violet/40`).
 */
function withOpacity(variable: string) {
  return `rgb(var(${variable}) / <alpha-value>)`;
}

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: withOpacity('--color-bg-primary'),
          secondary: withOpacity('--color-bg-secondary'),
          elevated: withOpacity('--color-bg-elevated'),
          overlay: withOpacity('--color-bg-overlay'),
        },
        border: {
          DEFAULT: withOpacity('--color-border'),
          subtle: withOpacity('--color-border-subtle'),
        },
        text: {
          primary: withOpacity('--color-text-primary'),
          secondary: withOpacity('--color-text-secondary'),
          muted: withOpacity('--color-text-muted'),
        },
        brand: {
          violet: withOpacity('--color-brand-violet'),
          blue: withOpacity('--color-brand-blue'),
          cyan: withOpacity('--color-brand-cyan'),
        },
        racing: {
          red: withOpacity('--color-racing-red'),
          amber: withOpacity('--color-racing-amber'),
          lime: withOpacity('--color-racing-lime'),
        },
        success: withOpacity('--color-success'),
        warning: withOpacity('--color-warning'),
        danger: withOpacity('--color-danger'),
        price: withOpacity('--color-price'),
      },
      fontFamily: {
        sans: 'var(--font-sans)',
        heading: 'var(--font-heading)',
        display: 'var(--font-display)',
        mono: 'var(--font-mono)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgb(var(--color-brand-violet) / 0.45)',
        card: '0 4px 24px -8px rgb(var(--color-shadow) / 0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
