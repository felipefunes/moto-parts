# Plataforma de e-commerce por temas (prototipo)

Frontend de e-commerce genérico, con la tienda concreta resuelta por **tema** en tiempo de
build: mismo código de catálogo, carrito y checkout, distinta identidad/datos por cliente. Hoy
incluye dos temas de demostración:

- **`motos`** — RPM Parts, repuestos de motocicletas (dark mode, estética MotoGP/cripto).
- **`carteras`** — RW, carteras artesanales de cuero (light mode, cálido, tipografía serif).

Cada tema es un build independiente, pensado para desplegarse como instancia separada por
cliente (no un SaaS multi-tenant compartido) — ver `CONTRIBUTING.md` para el detalle de la
arquitectura. Construido para presentar a inversionistas — todo el estado vive en el navegador
(mock data + `localStorage`), sin backend, con checkout y pasarela de pago chilena **simulados**
(estilo Webpay Plus / Transbank).

## Stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) para estilos (colores/tipografías vía CSS custom
  properties, definidas por tema)
- [React Router](https://reactrouter.com/) para el ruteo
- [Zustand](https://github.com/pmndrs/zustand) para el carrito (persistido en `localStorage`)
- Datos e imágenes 100% mock (fotos reales de Unsplash referenciadas por URL)

## Desarrollo local

```bash
npm install

npm run dev             # tema motos (equivalente a dev:motos), http://localhost:5173
npm run dev:carteras    # tema carteras, mismo puerto por defecto

npm run build           # build de producción del tema motos (equivalente a build:motos)
npm run build:carteras  # build de producción del tema carteras

npm run preview         # sirve el último build de producción localmente
npm run lint
```

## Estructura

```
src/
  theme/          Contrato ThemeConfig + punto de acceso al tema activo (src/theme/index.ts)
  themes/
    motos/        Todo lo específico de RPM Parts: datos, logo, copy, panel de compatibilidad
    carteras/     Todo lo específico de RW: datos, logo, copy
  types/          Modelos de datos compartidos (Product, Category, Cart, Address, Payment, Order)
  services/       Capa de acceso a datos con la misma forma que tendrá la futura API REST
  store/          Estado global (carrito, UI) con Zustand
  hooks/          Hooks de UI (carrito, filtros de catálogo, debounce)
  components/     Componentes compartidos por ambos temas (layout, home, producto, filtros,
                  carrito, checkout, ui) — leen copy/datos vía `@/theme`, no hardcodeado
  pages/          Páginas ruteadas (home, listado, detalle, carrito, checkout, informativas)
```

## Notas del prototipo

- **Pago simulado**: en el paso de pago, cualquier número de tarjeta funciona; si termina en
  `0000` se simula un pago rechazado, para poder demostrar ambos flujos.
- **Imágenes**: fotos reales de Unsplash, verificadas manualmente antes de usarse (ver
  `CONTRIBUTING.md`). En el tema motos, cinco subcategorías (filtros, carrocería, refrigeración,
  combustible/admisión y herramientas) todavía reutilizan la imagen más cercana disponible.
- **Roadmap de backend**: la capa `services/` ya está diseñada con las mismas firmas que tendrá
  una futura API REST sobre PostgreSQL (paginación, filtros, ids), de modo que conectar un
  backend real no debería requerir tocar componentes ni tipos. Cuando eso ocurra, cada tema
  probablemente se conecte a su propia base de datos — el backoffice de inventario y esa
  arquitectura de datos son las siguientes piezas planeadas, condicionadas a validación con el
  inversionista.

## Despliegue

Este repo incluye `render.yaml` para desplegar el tema **motos** como Static Site en el plan
gratuito de [Render](https://render.com/) vía Blueprint (`buildCommand: npm ci && npm run
build`, publica `dist/`). Desplegar el tema `carteras` (o futuros temas) como una instancia
separada queda fuera de este alcance por ahora — el `buildCommand` sería
`npm ci && npm run build:carteras`.
