# Document Inventory - Documentación de Producto (Depurada)

> **Producto:** From Zero Framework
> **Versión:** 7.0.0
> **Última actualización:** 2026-06-07
> **Propósito:** Índice maestro de la documentación **de producto** depurada.
> **Alcance:** Solo describe el producto y el framework objetivo.

---

## 1. Conjunto de Documentos de Producto

> Leyendo **únicamente** este directorio se obtiene la visión completa del producto: qué es (`STRATEGY`), qué debe hacer (`PRD`) y las especificaciones técnicas de referencia (`REFERENCE_*`, `BOOTSTRAP_REFERENCE`).

| # | Archivo | Propósito |
|---|---------|-----------|
| 1 | `README.md` | Visión general del producto y arranque. |
| 2 | `STRATEGY.md` | Estrategia de producto: visión, identidad, propuesta de valor, motor técnico, modelo comercial. |
| 3 | `PRD.md` | Product Requirements Document. Fuente de verdad técnica primaria. |
| 4 | `REFERENCE_MODULES.md` | Especificación técnica de los 27 módulos core (schema BD, server actions, UI). |
| 5 | `REFERENCE_ARCHITECTURE.md` | Arquitectura lógica: capas, flujos y patrones. |
| 6 | `REFERENCE_STRUCTURE.md` | Estructura física de directorios (separación base/aplicación). |
| 7 | `REFERENCE_DESIGN_SYSTEM.md` | Contrato documental del Design System objetivo del framework. |
| 8 | `REFERENCE_THREAT_MODEL.md` | Modelado de amenazas STRIDE y requisitos de seguridad. |
| 9 | `BOOTSTRAP_REFERENCE.md` | Referencia del bootstrap `bootstrap.json` para genesis inicial del framework. |
| 10 | `REFERENCE_DATABASE_SCHEMA.md` | Contrato consolidado de tablas, ownership, RLS y soft delete. |
| 11 | `REFERENCE_STACK.md` | Stack tecnológico canónico, política de versiones, herramientas y conectores. |
| 12 | `SECURITY_ASSURANCE.md` | Controles verificables de seguridad, OWASP, SSDLC, RLS, API keys y anti-abuso. |
| 13 | `DEPENDENCY_MATRIX.md` | Dependencias por fase/módulo, paralelización y criterios de aceptación. |
| 14 | `SCALABILITY_ASSURANCE.md` | Controles verificables de escalabilidad, cache, async, queries, k6, horizontal scaling, cuotas y observabilidad. |

---

## 2. Decisiones de Diseño Canónicas (v7.0.0)

| ID | Decisión |
|----|----------|
| D1 | **Nombre del producto:** From Zero Framework. |
| D2 | **Versión inicial homologada:** 7.0.0 en todos los documentos. |
| D3 | **Componente IA:** "Core AI", servicio Python en `core-ai/`. |
| D4 | **Estructura:** `src/app` (router Next.js) + `src/framework` (base) + `src/web` (aplicación web) + `mobile/` futuro + `core-ai/` (IA). |
| D5 | **Bootstrap:** `bootstrap.json` reemplaza cualquier archivo previo de inicialización. Solo se usa para genesis del framework; en runtime la BD y los módulos administrativos son la fuente de verdad. |
| D6 | **Formularios:** TSX específicos por módulo (`[Slug]Form.tsx`), no autogenerados. |
| D7 | **Recycle Bin:** toggle del Grid Universal, NO módulo independiente. |
| D8 | **`tenant_id`:** obligatorio en toda tabla con datos de negocio (RLS). |
| D9 | **Tareas en segundo plano:** `pg_cron` para jobs programados e Inngest para jobs disparados por usuario. Redis/BullMQ es opcional, pero sugerido cuando una app requiera cache compartida, rate limits distribuidos, quotas, locks o colas dedicadas. |
| D10 | **Terminología:** `tenant` en código/BD; "Account/Cuenta" solo como etiqueta de UI. |
| D11 | **Alcance MVP:** todo lo definido como capacidad del framework web en `docs/` forma parte del MVP. Aplicaciones móviles nativas y lógica específica de aplicaciones derivadas se construyen posteriormente sobre la base. |
| D12 | **Grid Universal:** la configuración visual y funcional de columnas del Grid se administra desde el Módulo de Módulos; los formularios son manuales/co-diseñados y se conectan mediante un registro de formularios. |
| D13 | **Stack canónico:** las decisiones de tecnología, versiones, herramientas y conectores viven en `REFERENCE_STACK.md`. |
| D14 | **Seguridad excelente:** los controles se verifican contra OWASP Top 10, OWASP API Top 10, ASVS, SSDLC y `SECURITY_ASSURANCE.md`. |
| D15 | **Escalabilidad excelente:** los controles se verifican contra cache, async, queries, load, scale, quotas, costos y `SCALABILITY_ASSURANCE.md`. |
| D16 | **Design System:** contrato propio del framework documentado en `REFERENCE_DESIGN_SYSTEM.md` y materializado por el scaffold en `src/framework/ui`. |

---

## 3. Reglas de Gobernanza

1. **Source of Truth técnico:** `PRD.md` es la fuente de verdad técnica primaria y absoluta.
2. **Prioridad de lectura:** `STRATEGY` → `PRD` → `REFERENCE_MODULES` → resto.
3. **Modificación:** cualquier cambio en un documento DEBE verificar consistencia cruzada con los demás.
4. **Independencia documental:** este conjunto describe el producto y no depende de plugins, templates externos, procesos externos o rutas locales inexistentes.
5. **Seguridad y escalabilidad:** todo cambio relevante debe validar `SECURITY_ASSURANCE.md` y `SCALABILITY_ASSURANCE.md`.
6. **Framework vs app final:** las apps finales toman decisiones de dominio; el framework provee contratos, defaults seguros, adapters y configuración.
