# Scalability Assurance - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.0.0
> **Última actualización:** 2026-06-07
> **Fuente de verdad:** [`PRD.md`](./PRD.md), [`REFERENCE_ARCHITECTURE.md`](./REFERENCE_ARCHITECTURE.md), [`REFERENCE_STACK.md`](./REFERENCE_STACK.md).
> **Propósito:** Definir controles verificables de escalabilidad para módulos, apps derivadas, workers y release candidates.
> **Alcance:** Cache, jobs, queries, load testing, horizontal scaling, cuotas, costos y observabilidad.

---

## 1. Principio rector

Escalabilidad es un pilar de primer nivel junto con seguridad. Ningún módulo, API, worker o release candidate se considera completo si no documenta sus decisiones de cache, async, queries, load y scale.

Redis es **opcional, pero sugerido** para entornos multi-instancia o cargas altas. El framework debe arrancar y operar sin Redis, pero cada app derivada debe evaluar si necesita cache compartida, rate limits distribuidos, quotas por tenant, locks, invalidación o colas dedicadas.

---

## 2. Cinco pilares

### 2.1 Cache

Cada módulo debe declarar una decisión de cache:

| Opción | Uso |
|---|---|
| No cache | Datos pequeños, baja frecuencia o alta volatilidad. |
| Next/Data cache | Lecturas server-side con invalidación controlada. |
| HTTP/CDN cache | Assets, respuestas públicas o contenido con `Cache-Control` seguro. |
| Redis | Cache compartida multi-instancia, rate limits, quotas, locks e invalidación. |
| Materialized view | Agregados pesados y reportes recalculables. |

Reglas:

- No cachear datos tenant-aware sin clave de cache que incluya `tenant_id`.
- Invalidar en toda mutación relevante o documentar TTL.
- No cachear secretos, tokens, API keys, payloads sensibles ni respuestas con permisos variables sin segmentación.
- Redis no es requisito del MVP, pero es sugerido para producción con múltiples instancias o carga alta.

### 2.2 Async

Cada operación costosa debe declarar si es sync, scheduled, async o queue dedicated.

| Opción | Uso |
|---|---|
| Sync | Trabajo pequeño, acotado y con p95 compatible. |
| `pg_cron` | Jobs programados basados en tiempo. |
| Inngest | Workflows disparados por usuario, retries, import/export y tareas durables sin Redis. |
| BullMQ + Redis | Colas dedicadas cuando `redis_enabled = true` y la app lo justifica. |

Reglas:

- Requests HTTP no deben bloquearse por trabajos largos.
- Jobs deben tener idempotencia, retry/backoff y auditoría.
- Workers no deben depender de estado local de proceso.
- Errores de jobs deben registrarse en `logs` y, cuando aplique, en Sentry.

### 2.3 Queries

Cada query crítica debe declarar índice o justificación.

Requisitos mínimos:

- Índices para `tenant_id`, FKs, `(tenant_id, deleted_at)`, filtros frecuentes, búsqueda y auditoría.
- Paginación obligatoria en listados.
- Prohibido `SELECT *` cuando existan columnas privadas, pesadas o innecesarias.
- Prohibido N+1 en rutas, grids y workers.
- Query p95 esperado documentado para endpoints críticos.

### 2.4 Load

k6 es obligatorio para flujos críticos y release candidates.

Escenarios mínimos:

- Auth y sesión.
- Dashboard inicial.
- Grid Universal.
- CRUD de módulo tenant-aware.
- Import/export.
- Billing y webhooks simulados.
- Core AI con budget/rate limit.

Threshold base:

- API p95 < 200ms salvo excepción documentada.
- Sin errores 5xx bajo carga esperada.
- Sin fuga cross-tenant bajo concurrencia.

### 2.5 Scale

Todo backend y worker debe ser compatible con múltiples instancias.

Requisitos:

- Backend stateless.
- Load balancing previsto.
- No estado tenant/session en memoria de proceso.
- Health checks para web, workers y Core AI.
- Graceful shutdown.
- Retry/backoff en integraciones.
- Límites, quotas y costos por tenant.
- Observabilidad con `logs`, Sentry y PostHog cuando aplique.

---

## 3. Gate por módulo

Un módulo no pasa gate si falta cualquiera de estos puntos:

- Decisión de cache.
- Decisión de jobs.
- Índices para queries críticas.
- Paginación y DTOs de lectura.
- Quotas/rate limits para operaciones costosas.
- Auditoría de operaciones relevantes.
- Escenario k6 si participa en flujos críticos.
- Confirmación stateless para APIs y workers.

---

## 4. Gate de release

Antes de release:

- Ejecutar k6 en flujos críticos.
- Revisar slow queries y planes de ejecución relevantes.
- Verificar Sentry para errores y performance.
- Verificar PostHog solo para analítica de producto autorizada por consentimiento.
- Confirmar que Redis está apagado o configurado explícitamente.
- Confirmar que quotas y costos por tenant están visibles y auditados.
- Confirmar que workers son idempotentes y multi-instancia.

---

## 5. Relación con seguridad

Seguridad y escalabilidad se validan juntas:

- Rate limiting no debe depender de estado local si hay múltiples instancias.
- Cache tenant-aware debe incluir `tenant_id`.
- Jobs deben respetar RLS/RBAC equivalente en server-side.
- Core AI debe aplicar budget caps, rate limits y tracking de costo.
- Observabilidad no debe registrar secretos, tokens ni PII innecesaria.
