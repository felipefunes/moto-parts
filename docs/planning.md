# Plan de trabajo — backend RPM Parts

Estos documentos viven como Claude Artifacts (privados, en tu cuenta — no en este repo).
Los enlaces de abajo son la referencia; edítalos ahí, no hay copia local que mantener sincronizada.

- **Presupuesto** — cerrado. Valorización de desarrollo por módulo + efectivo requerido para lanzar.
  https://claude.ai/code/artifact/d12b3187-ba30-47c9-bd7c-908d2a5ced3d
- **Esquema de datos (Fase 1)** — cerrado, Rev. B. Entidades núcleo: cuentas, catálogo, carrito/pedidos, pagos/facturación/inventario, reviews. Rev. B corrige la FK de categoría duplicada en `product` y agrega la matriz de permisos por rol.
  https://claude.ai/code/artifact/b5c55451-85ce-4c45-b979-bb096959cd32
- **Arquitectura y stack (Fase 2)** — cerrado, Rev. B. Kotlin/Spring Boot, monolito modular, diagramas de módulos y checkout, entornos de despliegue. Rev. B agrega refresh token revocable, guardas de estado en `payment`, y emisión asíncrona de DTE.
  https://claude.ai/code/artifact/2b8f0375-6c01-491d-867b-3aee7a91b2db
- **Integraciones y backoffice (Fase 3)** — nuevo. Detalle de integración Transbank/Mercado Pago (son mecánicamente distintas), máquina de estados de pago, flujo de reembolso, y pantallas del panel administrativo.
  https://claude.ai/code/artifact/3e955384-fa6f-4271-aee2-a752c036848e

Alcance actual: solo RPM Parts (motos). RW/carteras no está incluido en ninguno de estos documentos.

Con las Fases 1–3 cerradas, no quedan decisiones de diseño de backend abiertas — lo que sigue es implementación.
