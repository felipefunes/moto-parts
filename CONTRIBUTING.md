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
funciones (de leer `src/data/*` a hacer `fetch`), sin tocar componentes ni tipos. Mantené esa
disciplina al agregar funcionalidad nueva: los componentes no deberían importar `src/data/*`
directamente, solo `src/services/*`.
