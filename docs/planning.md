# Plan de trabajo — backend RPM Parts

Estos documentos viven como Claude Artifacts (privados, en tu cuenta — no en este repo).
Los enlaces de abajo son la referencia; edítalos ahí, no hay copia local que mantener sincronizada.

- **Presupuesto** — cerrado. Valorización de desarrollo por módulo + efectivo requerido para lanzar.
  https://claude.ai/code/artifact/d12b3187-ba30-47c9-bd7c-908d2a5ced3d
- **Esquema de datos (Fase 1)** — cerrado, Rev. C. Entidades núcleo: cuentas, catálogo, carrito/pedidos, pagos/facturación/inventario, reviews. Rev. B corrige la FK de categoría duplicada en `product` y agrega la matriz de permisos por rol. Rev. C agrega `brand` (compartida entre fabricante de repuestos y de motos, discriminada por `kind`) y `motorcycle_model`, reemplazando los strings libres que tenían `product.brand` y `compatibility.brand/model`.
  https://claude.ai/code/artifact/b5c55451-85ce-4c45-b979-bb096959cd32
- **Arquitectura y stack (Fase 2)** — cerrado, Rev. B. Kotlin/Spring Boot, monolito modular, diagramas de módulos y checkout, entornos de despliegue. Rev. B agrega refresh token revocable, guardas de estado en `payment`, y emisión asíncrona de DTE.
  https://claude.ai/code/artifact/2b8f0375-6c01-491d-867b-3aee7a91b2db
- **Integraciones y backoffice (Fase 3)** — nuevo. Detalle de integración Transbank/Mercado Pago (son mecánicamente distintas), máquina de estados de pago, flujo de reembolso, y pantallas del panel administrativo.
  https://claude.ai/code/artifact/3e955384-fa6f-4271-aee2-a752c036848e
- **Cuentas y accesos (UX)** — propuesta de diseño, sin cerrar. Auditoría de header/rutas/checkout actuales, separación explícita entre auth de cliente y portal laboral (no implementada en el schema hoy — `user_.role` sigue siendo un único campo), especificación de pantallas (login, cuenta, pedidos, back-office), estados de pedido y plan de entregas. Escrito antes de que exista una sola pantalla de esto en `moto-parts` — es la referencia para construirlas, no una descripción de algo ya hecho.
  https://claude.ai/code/artifact/2a874edb-396b-49e4-a7c5-1297d2a8811c

Alcance actual: solo RPM Parts (motos). RW/carteras no está incluido en ninguno de estos documentos.

Con las Fases 1–3 cerradas, no quedan decisiones de diseño de backend *ya construido* abiertas — lo que sigue es implementación. La propuesta de Cuentas y accesos es la excepción: es anterior a la implementación de su propia área y deja preguntas explícitamente abiertas (ver su sección 17).

## Implementación

Backend en `felipefunes/rpm-parts-backend` (repo privado). Empezando por el catálogo, sin
backoffice — ver ese repo para estado actual, `RELEASING.md` para el flujo de releases entre
ambos repos, y `docs/velocity-log.md` para tiempo real vs. estimado por PR.
