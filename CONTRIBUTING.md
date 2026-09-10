# Guía de contribución y aprendizajes del dev flow

Este documento recoge prácticas que surgieron trabajando en este proyecto — casos reales que
costó tiempo diagnosticar y que vale la pena no repetir. Se va actualizando a medida que
aparecen nuevos aprendizajes.

## 1. Antes del primer commit en un repo nuevo

- **Verifica la identidad de git** (`git config user.name` / `user.email`) antes de commitear.
  Si no está seteada globalmente, git la infiere del usuario/hostname del sistema
  (ej. `usuario@Mi-MacBook-Pro.local`), y esos commits aparecen en GitHub sin vincular a tu
  cuenta. Corregirlo después implica reescribir historia (`filter-branch` o `rebase`).
- **Confirma que la rama `main` exista en el remoto antes de crear ramas de feature.** Un repo
  de GitHub recién creado sin ningún push no tiene una rama por defecto real: la primera rama
  que se sube pasa a ser el default. Si primero se sube una rama de feature, GitHub no puede
  abrir un PR contra `main` porque no comparten historia. Conviene inicializar `main` (aunque
  sea con un commit vacío) y fijarlo como default **antes** de la primera rama de trabajo.

## 2. Toda interacción "hover" necesita un plan para touch

Los menús/dropdowns que solo abren con `:hover` (o `onMouseEnter`) no tienen equivalente en
touch — no existe "hover" en un celular. Si un componente de navegación o de filtros depende
de hover como único mecanismo, en mobile queda inutilizable sin que ningún error lo delate:
compila, pasa lint, se ve bien en un screenshot de escritorio.

**Regla:** cualquier menú desplegable debe abrir con `click`/`tap` como mecanismo primario
(hover puede ser un extra en desktop, nunca el único camino). Pruébalo siempre en un viewport
mobile antes de darlo por terminado.

Ejemplo real en este repo: `CategoryNav` abría subcategorías solo con `onMouseEnter`; se
corrigió a un toggle por click con cierre al hacer click afuera
(`src/components/layout/CategoryNav.tsx`).

## 3. `overflow-x-auto` sin `overflow-y` explícito recorta contenido vertical

Por spec de CSS, si un eje de `overflow` no es `visible` y el otro no se especifica, el eje no
especificado deja de comportarse como `visible` (el navegador lo trata como `auto`). En la
práctica: un contenedor con scroll horizontal (`overflow-x-auto`, típico en un carrusel de
categorías) **recorta silenciosamente** cualquier dropdown posicionado `absolute` dentro de él,
aunque el dropdown "exista" en el DOM — no hay error en consola, simplemente no se ve.

**Regla:** un menú desplegable que vive dentro de un contenedor con scroll horizontal debe
posicionarse con `position: fixed` y coordenadas calculadas por JS
(`getBoundingClientRect()` del disparador), no `absolute` relativo a un ancestro con overflow.
Recuerda además acotar la posición al viewport (`Math.min(rect.left, innerWidth - menuWidth)`)
para que no se corte por el borde derecho en pantallas angostas.

## 4. Guards de "estado inválido → redirigir" deben ser de una sola vez, no reactivos

Un patrón común en checkout es: "si el carrito está vacío al entrar a este paso, redirige".
Si ese guard vive en un `useEffect` que depende de `lines.length` (o cualquier estado que la
misma página puede mutar), **se vuelve a disparar cada vez que ese estado cambia** — incluida
la vez en que la propia página vacía el carrito tras un pago exitoso. El resultado: justo
después de pagar, el usuario es redirigido de vuelta al carrito vacío en lugar de a la
confirmación del pedido.

Esto pasó en `CheckoutPaymentPage`: `clear()` (Zustand, un store externo a React) y el
`navigate()` a la confirmación no quedan garantizados en el mismo render/commit que las
actualizaciones de estado de React — el guard reactivo alcanzaba a ejecutarse con el carrito ya
vacío antes de que la navegación a la confirmación tomara efecto.

**Regla:** un guard de entrada a una página ("¿tengo lo que necesito para estar acá?") debe
evaluarse **una sola vez al montar** (`useEffect(() => {...}, [])`), no reactivamente. Si la
página necesita reaccionar a cambios de ese estado por otro motivo, ese es un efecto distinto,
con su propia lógica — no reutilices el mismo guard de entrada para eso.

## 5. Un E2E real (aunque sea manual o scripteado) es obligatorio antes de dar por hecho un flujo

El bug del punto 4 pasó con `npm run build`, `npm run lint` y TypeScript en modo `strict`
completamente limpios, y el código se veía correcto en revisión. Solo se detectó ejecutando el
flujo de compra de punta a punta (agregar al carrito → dirección → pago → confirmación) y
mirando a qué URL terminaba llegando el usuario.

**Regla:** antes de marcar un flujo transaccional (carrito, checkout, cualquier wizard
multi-paso) como terminado, hay que recorrerlo completo — no alcanza con que compile y pase
lint. Si no hay acceso a un navegador interactivo en la sesión, usar automatización (ver
punto 6) en vez de asumir que "si compila, funciona".

## 6. Cómo tomar screenshots / correr E2E sin la extensión de Chrome disponible

Cuando la extensión de Chrome para Claude Code no está conectada (frecuente en sesiones en
background), se puede seguir automatizando el navegador con `puppeteer-core` apuntando al
Chrome ya instalado en el sistema, sin descargar un Chromium adicional:

```bash
npm install --no-save puppeteer-core
```

```js
import puppeteer from 'puppeteer-core';

const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
});
```

Notas:
- `--no-save` evita ensuciar `package.json`/`package-lock.json` con una dependencia que es solo
  para la sesión de QA — verifica con `git diff` que no haya quedado nada trackeado.
- El script debe vivir **dentro** del proyecto (para que la resolución de módulos ESM encuentre
  `node_modules`) — bórralo al terminar, no lo commitees.
- `page.goto(url, { waitUntil: 'networkidle0' })` **no espera** delays simulados con
  `setTimeout` (como los de `mockRequest` en `services/`), porque no son actividad de red real.
  Agrega una espera explícita después de navegar en apps con latencia simulada.

## 7. Estructura de datos y servicios (recordatorio, no aprendizaje nuevo)

La capa `src/services/` está diseñada para tener la misma forma que tendrá la futura API REST
sobre PostgreSQL. Al conectar el backend real, el objetivo es que solo cambie el cuerpo de esas
funciones (de leer `@theme-active/data/*` a hacer `fetch`), sin tocar componentes ni tipos.
Mantené esa disciplina al agregar funcionalidad nueva: los componentes no deberían importar
`@theme-active/data/*` directamente, solo `src/services/*`.

**Catalog: mock vs. real HTTP.** `catalogService.ts` is the only entry point components import;
internally it picks between `catalogService.mock.ts` (data from `@theme-active/data/*`) and
`catalogService.http.ts` (fetches against `rpm-parts-backend`) based on whether
`VITE_API_BASE_URL` is set. Both implementations satisfy the same `CatalogService` type
(`catalogService.types.ts`), so they can't silently drift apart. To test against the real backend
locally: run it (`docker compose up -d && ./gradlew bootRun` in `rpm-parts-backend`) and set
`VITE_API_BASE_URL=http://localhost:8080` in a `.env.local` (gitignored -- don't add it to
`.env.motos`/`.env.carteras` until real staging exists).

**Syncing generated types**: `npm run sync:api-types` regenerates
`src/services/api/generated/types.ts` from `/v3/api-docs` on the backend running locally. Run it
by hand whenever this repo moves to point at a different backend version, not on every build --
see `BACKEND_API_VERSION` in `src/services/api/`. The generated file is committed.

**Watch out for generated `isX` booleans**: springdoc mis-reports the Kotlin fields
`isPrimary`/`isFeatured` as `primary`/`featured` in the OpenAPI schema (an introspection bug --
confirmed with `curl` that the real JSON does say `isPrimary`/`isFeatured`). `catalogMappers.ts`
corrects this by hand with a comment explaining why -- don't blindly trust the generated file for
those two fields until it's fixed upstream.

## 8. Cómo funciona el sistema de temas

Este repo dejó de ser una sola tienda (RPM Parts) para ser una plataforma con **temas**
intercambiables (`src/themes/motos/`, `src/themes/carteras/`, …): mismo código de catálogo,
carrito y checkout, distinta identidad/datos por cliente. Cada tema es un **build independiente**
(`vite build --mode <tema>`), pensado para desplegarse como instancia separada por cliente — no
un registry en runtime ni un SaaS multi-tenant compartido, porque la premisa del negocio es "cada
cliente eventualmente tiene su propia base de datos", no una sola instancia sirviendo a todos.

**Cómo resuelve el build cuál tema usar:** `vite.config.ts` mapea el `mode` de Vite a un alias
`@theme-active` que apunta a `src/themes/<tema>/` en tiempo de build (no en runtime). Esto es
importante: un build de `carteras` **nunca** empaqueta los datos/imágenes de `motos` ni
viceversa, sin necesidad de tree-shaking especial. `npm run dev`/`build` (sin sufijo) son alias
de `motos` — así `render.yaml` sigue funcionando sin cambios.

**Dónde vive cada cosa:**
- `src/theme/types.ts` — el contrato `ThemeConfig` (copy, flags, componentes intercambiables
  como el logo o el panel extra de producto). Si un texto o dato es específico de un negocio,
  debería salir de `ThemeConfig`, no estar hardcodeado en un componente compartido.
- `src/themes/<tema>/theme.config.ts` — la implementación concreta del contrato para ese tema.
- `src/themes/<tema>/theme.css` — colores (como CSS custom properties, triplete "R G B" para que
  sigan funcionando los modificadores de opacidad de Tailwind) y tipografías de ese tema. Los
  colores en `tailwind.config.ts` son siempre `rgb(var(--color-x) / <alpha-value>)`, nunca hex
  fijo — así un mismo Tailwind config sirve a cualquier tema.
- `src/themes/<tema>/data/*` — el catálogo mock de ese tema (categorías, productos, imágenes).
- `.env.<tema>` — **únicamente** las variables `VITE_*` que necesita el templating de
  `index.html` (`%VITE_SITE_TITLE%`, etc.). Todo lo demás va en TypeScript vía `ThemeConfig`, no
  en variables de entorno — mezclar ambos mecanismos para el mismo tipo de dato hace que la
  configuración de un tema quede repartida e inconsistente.

**Regla para agregar un tercer tema:** copiar la carpeta de `src/themes/carteras/` (es el
ejemplo más simple, sin sub-categorías ni panel extra de producto) como punto de partida,
implementar `ThemeConfig` completo, agregar `.env.<tema>`, y los scripts `dev:<tema>`/
`build:<tema>` en `package.json`. Antes de dar por terminado un tema nuevo, correr el mismo
recorrido E2E completo (home → categoría con filtros → producto → carrito → checkout → pago →
confirmación) que se documenta en la sección 5 — no asumir que "si el otro tema funciona, este
también".

**Concesión deliberada a la genericidad total:** `Product.compatibility` (modelos de vehículo
compatibles) sigue siendo un campo del tipo `Product` compartido, ahora opcional, en vez de
vivir en un tipo genérico parametrizado por tema. Es aceptable porque solo temas tipo "vehículos"
lo usan y el costo de un array opcional vacío es nulo — pero si un tercer tema necesita otro
campo estructurado igual de específico, vale la pena reconsiderar si `Product` necesita
genéricos (`Product<TExtra>`) en vez de seguir acumulando campos opcionales uno por uno.
