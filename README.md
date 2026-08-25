# RPM Parts — Catálogo de repuestos de motos (prototipo)

Prototipo de frontend para un catálogo de e-commerce de repuestos de motocicletas en Chile:
listado por categorías, ficha de producto, carrito de compras y checkout con una pasarela de
pago chilena **simulada** (estilo Webpay Plus / Transbank). Construido para presentar a
inversionistas — todo el estado vive en el navegador (mock data + `localStorage`), sin backend.

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para estilos
- [React Router](https://reactrouter.com/) para el ruteo
- [Zustand](https://github.com/pmndrs/zustand) para el carrito (persistido en `localStorage`)
- Datos e imágenes 100% mock (fotos reales de Unsplash referenciadas por URL)

## Desarrollo local

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # build de producción en dist/
npm run preview   # sirve el build de producción localmente
npm run lint
```

## Estructura

```
src/
  types/        Modelos de datos (Product, Category, Cart, Address, Payment, Order)
  data/         Catálogo mock: 15 categorías, ~60 productos, marcas, modelos de moto
  services/     Capa de acceso a datos con la misma forma que tendrá la futura API REST
  store/        Estado global (carrito, UI) con Zustand
  hooks/        Hooks de UI (carrito, filtros de catálogo, debounce)
  components/   Componentes reutilizables (layout, home, producto, filtros, carrito, checkout, ui)
  pages/        Páginas ruteadas (home, listado, detalle, carrito, checkout, informativas)
```

## Notas del prototipo

- **Pago simulado**: en el paso de pago, cualquier número de tarjeta funciona; si termina en
  `0000` se simula un pago rechazado, para poder demostrar ambos flujos.
- **Imágenes**: fotos reales de Unsplash. Cinco subcategorías (filtros, carrocería,
  refrigeración, combustible/admisión y herramientas) todavía reutilizan la imagen más cercana
  disponible — pendiente conseguir fotografía dedicada por categoría en una siguiente iteración.
- **Roadmap de backend**: la capa `services/` ya está diseñada con las mismas firmas que tendrá
  una futura API REST sobre PostgreSQL (paginación, filtros, ids), de modo que conectar un
  backend real no debería requerir tocar componentes ni tipos. El backoffice de inventario para
  administradores es la siguiente pieza planeada, condicionada a validación con el inversionista.

## Despliegue

Este repo incluye `render.yaml` para desplegar como **Static Site** en el plan gratuito de
[Render](https://render.com/) vía Blueprint (`buildCommand: npm ci && npm run build`,
publica `dist/`).
