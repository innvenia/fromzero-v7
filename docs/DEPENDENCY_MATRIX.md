# Matriz de Dependencias y Aceptación

> **Producto:** From Zero Framework  
> **Versión:** 7.0.0  
> **Última actualización:** 2026-06-07  
> **Fuente de verdad:** [`PRD.md`](./PRD.md), [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md), [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md), [`SCALABILITY_ASSURANCE.md`](./SCALABILITY_ASSURANCE.md).  
> **Propósito:** Ordenar la ejecución técnica por dependencias, carga y criterios verificables.  
> **Alcance:** Documenta dependencias y gates de aceptación del framework.

---

## 1. Orden base

| Fase | Grupo | Owner documental | Gate | Salida verificable | Dependencias | Paralelizable | Complejidad |
|---:|---|---|---|---|---|---:|---|
| 0 | Stack, Bootstrap, seguridad, escalabilidad, estructura | Stack / Bootstrap / Security / Scalability / Data | Bloqueante | Decisiones canónicas cerradas | Ninguna | Parcial | Alta |
| 1 | Base Next.js/Supabase/Core AI skeleton | Stack | Bloqueante | Proyecto levanta localmente | Stack definido | Parcial | Media |
| 2 | Auth, tenancy, RLS, logs base | Security / Data | Bloqueante | Aislamiento tenant probado | Base técnica | No | Alta |
| 3 | `settings`, `modules` | Modules / Data | Bloqueante | Runtime gobernado por BD | Auth/RLS/logs | Parcial | Alta |
| 4 | `plans`, `profiles`, `tenants`, `users` | Modules / Security | Bloqueante | RBAC y membresías operativas | settings/modules | Parcial limitada | Alta |
| 5 | UI transversal, Grid, i18n, layout | UI / Modules | Recomendable | Grid/layout responsive validado | settings/modules/RBAC | Sí | Alta |
| 6 | módulos tenant operativos, metadata y relaciones | Modules / Security / Data | Bloqueante por módulo | CRUD seguro por grupo con metadata y relaciones validadas | core admin | Sí por grupos | Alta |
| 7 | files/tags/bookmarks/filters/task | Modules / Data | Recomendable | módulo `task` prueba integraciones | UI transversal | Sí | Media |
| 8 | Core AI completo | Stack / Security | Recomendable | invocación IA auditada y limitada | settings/logs/integrations | Parcial | Alta |
| 9 | hardening/release | Security / Scalability / Stack | Bloqueante release | gate de calidad, carga y build reproducible | Todo lo anterior | Parcial | Alta |

### Owners documentales

| Owner | Documento rector | Responsabilidad |
|---|---|---|
| Stack | `REFERENCE_STACK.md` | Versiones, herramientas, conectores y compatibilidad. |
| Bootstrap | `BOOTSTRAP_REFERENCE.md` | Genesis inicial del framework y transición a BD. |
| Security | `SECURITY_ASSURANCE.md` / `REFERENCE_THREAT_MODEL.md` | OWASP, ASVS, RLS, RBAC, secrets y anti-abuso. |
| Scalability | `SCALABILITY_ASSURANCE.md` / `REFERENCE_ARCHITECTURE.md` | Cache, async, queries, k6, stateless, quotas, costos y observabilidad. |
| Modules | `REFERENCE_MODULES.md` / `PRD.md` | Contrato funcional y técnico de módulos. |
| Data | `REFERENCE_DATABASE_SCHEMA.md` | Ownership, RLS, índices y soft delete. |
| UI | `REFERENCE_DESIGN_SYSTEM.md` | Contrato del Design System objetivo del framework. |

### Tipos de gate

| Gate | Significado |
|---|---|
| Bloqueante | No se avanza a la siguiente fase si falla. |
| Recomendable | Puede avanzar con riesgo explícito y issue abierto. |
| Post-MVP | Se documenta, pero no bloquea el MVP web. |

---

## 2. Matriz de módulos

| Módulo | Tablas principales | Depende de | Seguridad | APIs/Actions | Jobs | Tests mínimos |
|---|---|---|---|---|---|---|
| `settings` | `settings` | logs base | Super Admin only | get/update settings | No | singleton, audit, validation |
| `module` | `modules` | settings | Super Admin only | CRUD/config | No | registry, grid config |
| `plan` | `plans` | settings/modules | Super Admin write, tenant read own | CRUD plans | billing hooks | feature gating |
| `tenant` | `tenants` | plans, profiles | RLS + role split | CRUD/support view | cleanup | tenant isolation |
| `profile` | `profiles`, `profile_permissions` | modules, tenants | Super Admin manages | CRUD/matrix | No | permission matrix |
| `user` | `users`, `user_memberships`, `user_preferences` | tenants, profiles, auth | RLS + RBAC | CRUD/invite/suspend | cleanup | membership isolation |
| `log` | `logs` | base tables | append-only, RLS nullable | read/export | retention | immutability |
| `ai-model` | `ai_models` | settings | Super Admin | CRUD models | No | model selection |
| `invitation` | `invitations` | users, tenants | token TTL, RLS | create/accept/revoke | expiry | token abuse |
| `notification` | `notifications` | users, templates | tenant RLS | create/read/archive | delivery | channel validation |
| `rule` | `rules`, executions/logs | event bus, modules | tenant RLS, loop guard | CRUD/run | async events | loop/rate tests |
| `custom-field` | `custom_fields` + `custom_data` | modules | tenant RLS, type validation | CRUD definitions | No | payload size/types |
| `email-template` | `email_templates` | tenant/settings | tenant RLS, sanitization | CRUD/preview | No | template injection |
| `api-key` | `api_keys` | tenant, logs | hash, scopes, expiry | create/revoke/list | rotation optional | scope denial |
| `integration` | `integrations` | tenant/settings | encrypted secrets | CRUD/test | No | secret masking |
| `webhook` | `webhooks` | integrations/logs | HMAC, SSRF guard | CRUD/send/test | retries | signature/SSRF |
| `document` | `documents`, `document_versions` | record relationships, files/tags optional | tenant RLS, append-only versions | CRUD/version/relationships | No | version/audit/ancestry |
| `record-relationship` | `record_relationship_types`, `record_relationships`, `record_relationship_paths` | tenants, modules, logs | tenant RLS, no cross-tenant, cycle guard | create/delete/read graph | No | cycles, depth, tenant isolation |
| `import` | `imports` + source metadata on target tables | modules/files/jobs | tenant RLS, validation, idempotency | create/status | Inngest | invalid rows/source trace |
| `export` | `exports` | modules/files/jobs | tenant RLS, RBAC | create/status/download | Inngest | permissions |
| `subscription` | `subscriptions` | plans, tenants | server-side billing | CRUD/status | billing cycle | lifecycle |
| `statement` | `statements` | subscriptions | read tenant, admin all | read/generate | billing cycle | totals |
| `invoice` | `invoices` | statements/payment adapter | immutable after issue | read/status | webhook sync | immutability |
| `file` | `files` | storage, tenant | RLS, signed URLs, current-version constraint | upload/download/version | cleanup | MIME/size/RLS/version |
| `tag` | `tags`, joins | tenant/modules | tenant RLS | CRUD/attach | No | duplicate/tenant |
| `bookmark` | `bookmarks` | users/modules | user+tenant RLS | CRUD | No | ownership |
| `filter` | `filters` | users/modules | user+tenant RLS | CRUD/share | No | visibility |
| `task` | `tasks` | all common infra | tenant RLS/RBAC | CRUD/demo | optional rules | full integration |

---

## 3. Criterios de aceptación por grupo

### Fundacional

- Build local reproducible.
- Typecheck estricto.
- Supabase local o proyecto dev conectado.
- Migraciones versionadas.
- `.env.example` completo sin secretos reales.

### Seguridad y tenancy

- RLS probado en tablas tenant-aware.
- JWT/custom claims resuelven tenant activo.
- RBAC se valida server-side.
- Service role no aparece en cliente.
- Logs registran operaciones críticas.

### Core administrativo

- `settings` gobierna runtime.
- `modules` registra configuración de grids y capacidades.
- `profiles` controla permisos por acción.
- `users` y `tenants` respetan aislamiento.

### Módulos operativos

- Cada módulo cumple tabla, grid y formulario si aplica.
- Cada mutación valida input server-side.
- Cada acción sensible audita.
- Cada tabla importable persiste metadata de origen cuando un job de Import crea o actualiza registros.
- Cada relación entre registros valida Tenant, tipo permitido, profundidad y bloqueo de ciclos cuando aplique.
- Cada vista respeta RLS/RBAC.
- Cada módulo declara decisión de cache y jobs.
- Cada query crítica tiene índice o justificación.
- Cada flujo crítico tiene escenario k6 o issue bloqueante.
- APIs y workers son stateless y aptos para múltiples instancias.

### Hardening

- SonarQube/SonarCloud quality gate aprobado.
- Playwright cubre login, CRUD, permisos y responsive.
- Pruebas de abuso cubren rate limit, injection, IDOR/BOLA y secrets.
- k6 cubre flujos críticos y release candidates.
- Quotas, costos y observabilidad están definidos por tenant.
- Build Docker reproducible.
