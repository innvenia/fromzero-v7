# Matriz de Dependencias y Aceptación

> **Producto:** From Zero Framework  
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-07  
> **Fuente de verdad:** [`PRD.md`](./PRD.md), [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md), [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md), [`SCALABILITY_ASSURANCE.md`](./SCALABILITY_ASSURANCE.md).  
> **Propósito:** Ordenar las dependencias técnicas entre módulos y declarar los criterios de calidad verificables del framework.  
> **Alcance:** Documenta dependencias entre módulos y criterios de calidad del framework, de forma abstracta a cualquier metodología de construcción (no referencia fases, sprints ni gates de proceso).

---

## 1. Capas de dependencia

> Orden lógico de dependencia entre la base y los grupos de módulos: qué debe existir antes de qué. Es una propiedad del framework, independiente de cómo se planifique su construcción.

| Capa | Grupo de base / módulos | Owner documental | Resultado | Depende de | Paralelizable | Complejidad |
|---:|---|---|---|---|---|---:|
| 1 | Base: stack, bootstrap, estructura, skeleton Next.js/Supabase/Core AI | Stack / Bootstrap | Proyecto base operativo | — | Parcial | Alta |
| 2 | Auth, tenancy, RLS, logs base | Security / Data | Aislamiento por tenant | Base | No | Alta |
| 3 | `settings`, `modules` | Modules / Data | Runtime gobernado por BD | Auth/RLS/logs | Parcial | Alta |
| 4 | `plans`, `profiles`, `tenants`, `users` | Modules / Security | RBAC y membresías | settings/modules | Parcial | Alta |
| 5 | UI transversal, Grid, i18n, layout | UI / Modules | Grid/layout responsive | settings/modules/RBAC | Sí | Alta |
| 6 | Módulos tenant operativos, metadata y relaciones | Modules / Security / Data | CRUD seguro con metadata y relaciones | core admin | Sí por grupos | Alta |
| 7 | files/tags/bookmarks/filters/task | Modules / Data | Integraciones de módulo demostradas | UI transversal | Sí | Media |
| 8 | Core AI completo | Stack / Security | Invocación IA auditada y limitada | settings/logs/integrations | Parcial | Alta |
| 9 | Endurecimiento y calidad | Security / Scalability / Stack | Calidad, carga y build reproducible | Todo lo anterior | Parcial | Alta |

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
| `ai-model` | `ai_models`, `ai_budgets` | settings | Super Admin | CRUD models/budgets | No | model selection, budget enforcement |
| `invitation` | `invitations` | users, tenants | token TTL, RLS | create/accept/revoke | expiry | token abuse |
| `notification` | `notifications` | users, templates | tenant RLS | create/read/archive | delivery | channel validation |
| `rule` | `rules`, executions/logs | event bus, modules | tenant RLS, loop guard | CRUD/run | async events | loop/rate tests |
| `custom-field` | `custom_fields` + `custom_data` | modules | tenant RLS, type validation | CRUD definitions | No | payload size/types |
| `email-template` | `email_templates` | tenant/settings | tenant RLS, sanitization | CRUD/preview | No | template injection |
| `api-key` | `api_keys` | tenant, logs | hash, scopes, expiry | create/revoke/list | rotation optional | scope denial |
| `integration` | `integrations` | tenant/settings | encrypted secrets | CRUD/test | No | secret masking |
| `webhook` | `webhooks`, `webhook_deliveries` | integrations/logs | HMAC, SSRF guard, anti-replay | CRUD entrantes/salientes, send/test | retries | signature/SSRF/replay |
| `document` | `documents`, `document_versions` | record relationships, files/tags optional | tenant RLS, append-only versions | CRUD/version/relationships | No | version/audit/ancestry |
| `legal-template` | `legal_templates`, `legal_template_versions` | settings, consent | tenant RLS; lectura pública solo `published` | CRUD/version/publish, fetch público | No | versionado, acceso público, jurisdicción/locale |
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

## 3. Criterios de calidad por grupo

### Fundacional

- Build local reproducible.
- Typecheck estricto.
- Base de datos conectada según la **jerarquía de entornos de datos** (ver abajo).
- Migraciones versionadas.
- `.env.example` completo sin secretos reales.

**Jerarquía de entornos de datos:**

| Entorno | Rol | Uso |
|---|---|---|
| **Supabase cloud dev** | Fuente operativa | Aplicar migraciones versionadas y validar integración real (RLS, Auth, Storage, policies). |
| **Postgres local / Supabase Local** | Desechable | Pruebas aisladas, CI y desarrollo **offline-first**. No sustituye la validación contra el entorno dev. |
| **Producción** | Intocable | Solo con aprobación puntual, backup y rollback. |

> "Validado localmente" **no** equivale a "validado contra el entorno dev". El framework admite trabajar **offline-first** (contra Postgres/Supabase Local) siempre que las mismas validaciones se ejecuten después contra el entorno dev al conectarlo.

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
- Cada flujo crítico tiene escenario k6 o justificación documentada.
- APIs y workers son stateless y aptos para múltiples instancias.

### Calidad y endurecimiento

- Análisis de calidad estático (p. ej. SonarQube/SonarCloud) **cuando el proyecto lo habilite**: es una herramienta **configurable/opt-in**, no obligatoria para todo proyecto.
- Playwright cubre login, CRUD, permisos y responsive.
- Pruebas de abuso cubren rate limit, injection, IDOR/BOLA y secrets.
- k6 (CLI local open source, ejecución bajo demanda) cubre flujos críticos.
- Quotas, costos y observabilidad están definidos por tenant.
- Build Docker reproducible.
