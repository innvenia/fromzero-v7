# Inventario API

## Metadatos

| Campo | Valor |
|---|---|
| Proyecto | From Zero Framework v7.4 |
| Fecha de creacion | 2026-06-18 |
| Ultima actualizacion | 2026-06-18 |
| Estado | Sprint 3: health implementado; contratos fundacionales versionados |
| Fuente | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_MODULES.md` |

## Reglas base

- Rutas REST versionadas bajo `/api/v1/*`.
- Server Actions permitidas para mutaciones internas de UI.
- Autenticacion por Supabase JWT para usuarios.
- API keys bearer para integraciones M2M.
- El contexto de tenant lo emite y valida el backend.
- RBAC server-side y RLS son obligatorios antes de exponer datos tenant-aware.
- Validacion de entrada con Zod en TypeScript.
- Errores seguros, sin secretos ni stack traces sensibles.
- Rate limit global, por tenant y por endpoint sensible.
- Auditoria obligatoria para mutaciones, webhooks, import/export, billing, API keys y acciones admin.

## Inventario inicial

| Dominio | Ruta base prevista | Estado Sprint 1 | Sprint dueno | Notas |
|---|---|---|---|---|
| Health | `/api/v1/health` | implementado | Sprint 3 | Readiness/liveness sin datos sensibles. |
| Settings | `/api/v1/settings` | contrato Zod versionado, endpoint pendiente | Sprint 3 | Global y tenant-aware segun permisos. |
| Modules | `/api/v1/modules` | contrato Zod versionado, endpoint pendiente | Sprint 3 | Registry de modulos. |
| Plans | `/api/v1/plans` | contrato Zod versionado, endpoint pendiente | Sprint 3 | Planes base y feature gates. |
| Tenants | `/api/v1/tenants` | contrato Zod versionado, endpoint pendiente | Sprint 3 | Contexto seguro y aislamiento. |
| Users | `/api/v1/users` | reservado, no implementado | Sprint 4 | Usuarios y membresias. |
| Profiles | `/api/v1/profiles` | reservado, no implementado | Sprint 4 | RBAC efectivo. |
| Invitations | `/api/v1/invitations` | reservado, no implementado | Sprint 4 | Tokens con TTL y auditoria. |
| API keys | `/api/v1/api-keys` | reservado, no implementado | Sprint 4 | Hash, scopes y expiracion opcional. |
| Custom fields | `/api/v1/custom-fields` | reservado, no implementado | Sprint 5 | Solo modulos permitidos. |
| Filters | `/api/v1/filters` | reservado, no implementado | Sprint 5 | Filtros guardados por usuario/tenant. |
| Relationships | `/api/v1/relationships` | reservado, no implementado | Sprint 5 | Extremos dentro del mismo tenant. |
| Subscriptions | `/api/v1/billing/subscriptions` | reservado, no implementado | Sprint 6 | Provider por adapter, sin cobros reales sin aprobacion. |
| Statements | `/api/v1/billing/statements` | reservado, no implementado | Sprint 6 | Jobs y conciliacion. |
| Invoices | `/api/v1/billing/invoices` | reservado, no implementado | Sprint 6 | PDF individual desde UI. |
| Files | `/api/v1/files` | reservado, no implementado | Sprint 7 | Storage, MIME, size y signed URLs. |
| Documents | `/api/v1/documents` | reservado, no implementado | Sprint 7 | Versionado acotado. |
| Tags | `/api/v1/tags` | reservado, no implementado | Sprint 7 | Scope tenant. |
| Bookmarks | `/api/v1/bookmarks` | reservado, no implementado | Sprint 7 | Scope usuario. |
| Notifications | `/api/v1/notifications` | reservado, no implementado | Sprint 8 | In-app default. |
| Rules | `/api/v1/rules` | reservado, no implementado | Sprint 8 | Gramatica cerrada y loop guard. |
| Email templates | `/api/v1/email-templates` | reservado, no implementado | Sprint 8 | Adapter email. |
| Integrations | `/api/v1/integrations` | reservado, no implementado | Sprint 8 | Credenciales cifradas por adapter. |
| Webhooks | `/api/v1/webhooks` | reservado, no implementado | Sprint 8 | HMAC, timestamp y anti-replay. |
| Imports | `/api/v1/import-jobs` | reservado, no implementado | Sprint 8 | CSV/XLSX, no JSON import. |
| Exports | `/api/v1/export-jobs` | reservado, no implementado | Sprint 8 | CSV/XLSX y URLs firmadas. |
| AI models | `/api/v1/ai/models` | reservado, no implementado | Sprint 9 | Catalogo, pricing y fallback. |
| AI invocations | `/api/v1/ai/invocations` | reservado, no implementado | Sprint 9 | Opt-in, redaccion y budgets. |
| Task | `/api/v1/tasks` | reservado, no implementado | Sprint 10 | Modulo ejemplo en `src/web/modules/task`. |

## Pendiente

- Implementar handlers autenticados de Settings, Modules, Plans y Tenants en Sprints posteriores.
- Agregar metodos, codigos de respuesta y contratos de error al implementar cada dominio.
- Confirmar rate limits y scopes concretos por endpoint antes de exponer rutas.
