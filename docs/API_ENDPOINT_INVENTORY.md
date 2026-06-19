# Inventario API

## Metadatos

| Campo | Valor |
|---|---|
| Proyecto | From Zero Framework v7.4 |
| Fecha de creacion | 2026-06-18 |
| Ultima actualizacion | 2026-06-19 |
| Estado | Sprint 8: eventos/jobs/notificaciones/rules/webhooks/import-export versionados localmente; handlers CRUD pendientes |
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
| Users | `/api/v1/users` | contrato Zod versionado, endpoint pendiente | Sprint 4 | Usuarios y membresias. |
| Profiles | `/api/v1/profiles` | contrato Zod versionado, endpoint pendiente | Sprint 4 | RBAC efectivo. |
| Invitations | `/api/v1/invitations` | contrato Zod versionado, endpoint pendiente | Sprint 4 | Tokens con TTL y auditoria. |
| API keys | `/api/v1/api-keys` | contrato Zod versionado, endpoint pendiente | Sprint 4 | Hash, scopes y expiracion opcional. |
| Custom fields | `/api/v1/custom-fields` | contrato Zod versionado, endpoint pendiente | Sprint 5 | Solo modulos permitidos. |
| Filters | `/api/v1/filters` | contrato Zod versionado, endpoint pendiente | Sprint 5 | Filtros guardados por usuario/tenant. |
| Relationships | `/api/v1/relationships` | contrato Zod versionado, endpoint pendiente | Sprint 5 | Extremos dentro del mismo tenant. |
| Subscriptions | `/api/v1/billing/subscriptions` | contrato Zod versionado, endpoint pendiente | Sprint 6 | Provider por adapter, sin cobros reales sin aprobacion. |
| Statements | `/api/v1/billing/statements` | contrato Zod versionado, endpoint pendiente | Sprint 6 | Jobs y conciliacion. |
| Invoices | `/api/v1/billing/invoices` | contrato Zod versionado, endpoint pendiente | Sprint 6 | PDF individual desde UI. |
| Stripe billing webhook | `/api/v1/billing/webhooks/stripe` | contrato HMAC versionado, endpoint pendiente | Sprint 6 | Firma obligatoria, adapter mockeable, sin provider real. |
| Files | `/api/v1/files` | contrato Zod versionado, endpoint pendiente | Sprint 7 | Storage, MIME, size y signed URLs. |
| Documents | `/api/v1/documents` | contrato Zod versionado, endpoint pendiente | Sprint 7 | Versionado acotado. |
| Tags | `/api/v1/tags` | contrato Zod versionado, endpoint pendiente | Sprint 7 | Scope tenant. |
| Bookmarks | `/api/v1/bookmarks` | contrato Zod versionado, endpoint pendiente | Sprint 7 | Scope usuario. |
| Consent records | `/api/v1/consent-records` | contrato Zod versionado, endpoint pendiente | Sprint 7 | Registro legal auditable. |
| Events | `/api/v1/events` | contrato Zod versionado, endpoint pendiente | Sprint 8 | Event outbox e idempotency key. |
| Jobs | `/api/v1/jobs` | contrato Zod versionado, endpoint pendiente | Sprint 8 | Inngest adapter local y pg_cron separado. |
| Notifications | `/api/v1/notifications` | contrato Zod versionado, endpoint pendiente | Sprint 8 | In-app default. |
| Rules | `/api/v1/rules` | contrato Zod versionado, endpoint pendiente | Sprint 8 | Gramatica cerrada y loop guard. |
| Email templates | `/api/v1/email-templates` | contrato Zod versionado, endpoint pendiente | Sprint 8 | Adapter email. |
| Integrations | `/api/v1/integrations` | contrato Zod versionado, endpoint pendiente | Sprint 8 | Credenciales cifradas por adapter. |
| Webhooks | `/api/v1/webhooks` | contrato Zod versionado, endpoint pendiente | Sprint 8 | HMAC, timestamp y anti-replay. |
| Imports | `/api/v1/import-jobs` | contrato Zod versionado, endpoint pendiente | Sprint 8 | CSV/XLSX, no JSON import. |
| Exports | `/api/v1/export-jobs` | contrato Zod versionado, endpoint pendiente | Sprint 8 | CSV/XLSX y URLs firmadas. |
| AI models | `/api/v1/ai/models` | reservado, no implementado | Sprint 9 | Catalogo, pricing y fallback. |
| AI invocations | `/api/v1/ai/invocations` | reservado, no implementado | Sprint 9 | Opt-in, redaccion y budgets. |
| Task | `/api/v1/tasks` | reservado, no implementado | Sprint 10 | Modulo ejemplo en `src/web/modules/task`. |

## Pendiente

- Implementar handlers autenticados de Settings, Modules, Plans, Tenants, Users, Profiles, Invitations y API keys en Sprints posteriores.
- Agregar metodos, codigos de respuesta y contratos de error al implementar cada dominio.
- Confirmar rate limits y scopes concretos por endpoint antes de exponer rutas.
