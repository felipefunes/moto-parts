import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const THEMES = ['motos', 'carteras'] as const;

// Cada tema es un build distinto (`vite --mode <tema>`), no un registry en
// runtime: `@theme-active` resuelve a la carpeta del tema en tiempo de build,
// así un build nunca empaqueta los datos/imágenes de los otros temas.
export default defineConfig(({ mode }) => {
  const theme = (THEMES as readonly string[]).includes(mode) ? mode : 'motos';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(dirname, './src'),
        '@theme-active': path.resolve(dirname, `./src/themes/${theme}`),
      },
    },
  };
});
