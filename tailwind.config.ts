import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0B0E14',
          secondary: '#12161F',
          elevated: '#1A1F2B',
          overlay: '#060810',
        },
        border: {
          DEFAULT: '#262B38',
          subtle: '#1D2230',
        },
        text: {
          primary: '#F5F7FA',
          secondary: '#9AA3B2',
          muted: '#6B7280',
        },
        brand: {
          violet: '#7C3AED',
          blue: '#3B82F6',
          cyan: '#06B6D4',
        },
        racing: {
          red: '#FF3B30',
          amber: '#F59E0B',
          lime: '#C6FF00',
        },
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        price: '#22D3EE',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Rajdhani', 'sans-serif'],
        display: ['Orbitron', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #06B6D4 100%)',
        'racing-gradient': 'linear-gradient(135deg, #FF3B30 0%, #F59E0B 100%)',
        'hero-fade': 'linear-gradient(180deg, rgba(11,14,20,0) 0%, #0B0E14 90%)',
        'radial-glow':
          'radial-gradient(circle at 50% 0%, rgba(124,58,237,0.25) 0%, rgba(11,14,20,0) 60%)',
      },
      boxShadow: {
        glow: '0 0 40px -10px rgba(124,58,237,0.45)',
        card: '0 4px 24px -8px rgba(0,0,0,0.5)',
      },
    },
  },
  plugins: [],
} satisfies Config;
