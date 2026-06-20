# Stack Tecnológico - From Zero Framework

> **Producto:** From Zero Framework  
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-07  
> **Fuente de verdad:** [`PRD.md`](./PRD.md), [`REFERENCE_ARCHITECTURE.md`](./REFERENCE_ARCHITECTURE.md).  
> **Propósito:** Centralizar stack, política de versiones, herramientas y canales de conexión.  
> **Alcance:** Web, backend, base de datos, Core AI, jobs, testing, calidad, operación, recomendación móvil y Design System del framework.

---

## 1. Política de versiones

El framework debe usar versiones recientes, estables y compatibles entre sí. La matriz exacta se fija al implementar el scaffold, después de validar compatibilidad contra fuentes oficiales vigentes.

Reglas:

- Usar LTS o stable para runtimes e infraestructura.
- Evitar beta, RC, canary, experimental y preview en el core.
- Fijar versiones exactas en lockfiles.
- Justificar cualquier versión no última por compatibilidad o estabilidad.
- Validar versiones exactas contra documentación oficial al iniciar implementación.
- No actualizar dependencias críticas junto con features funcionales.
- Mantener una matriz de compatibilidad Node.js, Next.js, React, TypeScript, Tailwind, Supabase CLI, Playwright y Vitest.

---

## 2. Stack principal

| Capa | Tecnología | Rol | Política |
|---|---|---|---|
| Runtime web | Node.js LTS | Ejecutar Next.js, tooling y CI. | LTS estable compatible con la matriz validada. |
| Frontend/API | Next.js App Router | SSR/RSC, Server Actions, API Routes. | Stable compatible con React y Node LTS. |
| UI | React + Tailwind v4 + shadcn/ui | Interfaz web y componentes base. | Implementado como Design System propio en `src/framework/ui`. |
| Lenguaje | TypeScript strict | Tipado, contratos y refactor seguro. | Stable, sin beta. |
| Validación | Zod | Validación cliente/servidor. | Stable compatible con TypeScript. |
| i18n | next-intl | Internacionalización web. | Stable compatible con Next.js. |
| Base de datos | Supabase PostgreSQL | Datos, RLS, PostgREST. | Versión soportada por Supabase. |
| Auth | Supabase Auth | Sesiones, JWT, MFA, OAuth opcional. | SDK estable. |
| Storage | Supabase Storage | Archivos y signed URLs. | SDK estable. |
| Billing | Adapter de pagos configurable | Checkout, billing, webhooks y conciliación. | Stripe puede ser default inicial; el contrato no depende de un proveedor único. |
| Core AI | Python + FastAPI + Pydantic v2 | IA, RAG, embeddings, LLM orchestration. | Python final compatible, sin beta. |
| Jobs programados | `pg_cron` | Purga, trials, tareas temporales. | Extensión soportada por Supabase. |
| Jobs asíncronos | Inngest | Import/export, workflows, retries. | SDK en código; motor ejecutable en local (Dev Server) o self-hosted (Docker/Coolify). No requiere SaaS; base sin Redis. |
| Cache/colas opcionales | Redis + BullMQ | Cache compartida, rate limits, quotas, locks, invalidación y colas dedicadas. | Opcional, pero sugerido para producción multi-instancia. |
| Unit/integration | Vitest | Lógica TS y Server Actions. | Compatible con Node LTS. |
| E2E/visual | Playwright | Flujos reales y responsive. | Compatible con browsers soportados. |
| Load testing | k6 | Flujos críticos. | CLI local open source (AGPL-3.0), ejecución bajo demanda; no es servicio hosteado ni requiere registro. |
| Contenedores | Docker + Compose | Local reproducible y despliegue. | Imágenes mantenidas. |
| Calidad | SonarQube/SonarCloud | Quality gates, seguridad, deuda técnica. | Configurable/opt-in por proyecto; recomendado, no obligatorio para todo proyecto. |

---

## 3. Justificación por capa

| Decisión | Justificación |
|---|---|
| Next.js App Router | Permite una sola base web con SSR/RSC, Server Actions, API Routes, layouts e i18n. |
| Supabase | PostgreSQL real, RLS nativo, Auth, Storage y CLI local. Reduce infraestructura propia. |
| TypeScript strict | Reduce ambigüedad para humanos y agentes IA. |
| Python solo para Core AI | Aísla ecosistema IA sin fragmentar backend de negocio. |
| Inngest + `pg_cron` | Cubre jobs sin hacer Redis obligatorio. |
| Redis opcional, pero sugerido | Acelera lecturas frecuentes, habilita cache compartida, rate limits distribuidos, quotas tenant, locks, invalidación y BullMQ en despliegues multi-instancia. |
| Adapter de pagos configurable | Permite iniciar con Stripe y sustituir o extender proveedor sin cambiar el contrato del framework. |
| SonarQube/SonarCloud | Convierte calidad y seguridad en una métrica accionable; se habilita por proyecto. |

---

## 3.1 Stack de escalabilidad

| Pilar | Herramientas base | Herramientas opcionales |
|---|---|---|
| Cache | Next/Data cache, HTTP/CDN, materialized views | Redis |
| Async | `pg_cron`, Inngest | BullMQ + Redis |
| Queries | Postgres indexes, query plans, pagination | Materialized views |
| Load | k6 | Browser traces y APM extendido |
| Scale | Stateless backend, health checks, load balancing | Redis locks, distributed quotas |

---

## 4. Stack móvil recomendado

El frontend móvil es un proyecto separado, no parte del MVP web. Debe quedar previsto desde contratos backend API-first.

| Capa móvil | Recomendación | Justificación |
|---|---|---|
| Framework | React Native + Expo | Afinidad con React/TypeScript y velocidad de entrega. |
| Lenguaje | TypeScript | Reutiliza tipos, contratos y convenciones web. |
| Navegación | Expo Router o React Navigation | Ecosistema maduro. |
| Estado/cache | TanStack Query | Consumo REST/API y cache controlado. |
| Auth | Supabase Auth compatible móvil | Reutiliza identidad y sesión. |
| Observabilidad | Sentry React Native | Errores y performance móvil. |
| Analytics | PostHog React Native | Eventos, funnels y comportamiento móvil. |
| E2E | Maestro o Detox | Validación móvil nativa. |

Condiciones:

- El backend debe exponer contratos REST/versionados.
- El contexto tenant debe resolverse con tokens seguros, no headers manipulables.
- Los payloads deben ser paginados y aptos para redes móviles.
- El móvil no debe requerir service role key ni secretos privilegiados.

---

## 5. Herramientas y conectores

| Área | Herramienta | Canal de conexión | Uso |
|---|---|---|---|
| Repositorio | GitHub | GitHub MCP, GitHub CLI, GitHub Actions | Issues, PRs, CI, reviews, releases. |
| Backend/DB | Supabase | Supabase MCP, Supabase CLI | Schema, migraciones, RLS, tipos, datos. |
| Navegador/E2E | Playwright | Browser MCP o runner Playwright | E2E, screenshots, responsive. |
| Billing | Proveedor de pagos configurado | CLI/API oficial del proveedor; Stripe CLI si Stripe es el default activo | Webhooks, checkout, billing tests. |
| Calidad | SonarQube/SonarCloud | SonarQube MCP, scanner CLI, CI gate | SAST, bugs, vulnerabilities, coverage. |
| Observabilidad | Sentry | SDK, API oficial, CI release integration | Errores, performance, tracing. |
| Producto | PostHog | SDK/API oficial; MCP solo oficial/auditado | Product analytics, funnels, feature flags. |
| IA/agentes | Herramientas del agente configurado | Docs oficiales y herramientas del agente | Implementación asistida y verificación. |
| Contenedores | Docker | CLI y CI | Local reproducible, build, deploy. |

### PostHog vs Sentry

PostHog y Sentry son complementarios:

- Sentry se usa para errores, performance técnica, tracing y diagnóstico.
- PostHog se usa para analítica de producto, funnels, cohortes, experimentos, feature flags y comportamiento.
- No debe activarse doble session replay por defecto. Se elige una fuente principal por entorno y política de privacidad.
- Todo tracking debe respetar consent management y clasificación de datos.

---

## 6. Referencias oficiales a validar

- Node.js releases: https://nodejs.org/en/about/previous-releases
- Next.js docs: https://nextjs.org/docs
- React versions: https://react.dev/versions
- TypeScript releases: https://devblogs.microsoft.com/typescript/
- Supabase JavaScript: https://supabase.com/docs/reference/javascript/installing
- Supabase CLI: https://supabase.com/docs/guides/cli
- Stripe changelog: https://docs.stripe.com/changelog
- FastAPI docs: https://fastapi.tiangolo.com/
- Pydantic docs: https://docs.pydantic.dev/
- Playwright docs: https://playwright.dev/
- SonarQube docs: https://docs.sonarsource.com/
- PostHog docs: https://posthog.com/docs
- Sentry docs: https://docs.sentry.io/
