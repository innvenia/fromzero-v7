# Inventario API

## Metadatos

| Campo | Valor |
|---|---|
| Proyecto | From Zero Framework v7.4 |
| Fecha de creacion | 2026-06-18 |
| Ultima actualizacion | 2026-06-19 |
| Estado | Inventario de la superficie HTTP prevista del framework, por dominio y nivel de auth. |
| Fuente | `docs/PRD.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_MODULES.md` |

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

| Dominio | Ruta base | Nivel de auth | Notas |
|---|---|---|---|
| Health | `/api/v1/health` | Público | Readiness/liveness sin datos sensibles. |
| Settings | `/api/v1/settings` | Privado (RBAC) | Global y tenant-aware según permisos. |
| Modules | `/api/v1/modules` | Privado (RBAC) | Registry de módulos. |
| Plans | `/api/v1/plans` | Privado (RBAC) | Planes base y feature gates. |
| Tenants | `/api/v1/tenants` | Privado (RBAC) | Contexto seguro y aislamiento. |
| Users | `/api/v1/users` | Privado (RBAC) | Usuarios y membresías. |
| Profiles | `/api/v1/profiles` | Privado (RBAC) | RBAC efectivo. |
| Invitations | `/api/v1/invitations` | Privado (RBAC) | Tokens con TTL y auditoría. |
| API keys | `/api/v1/api-keys` | Privado (RBAC) | Hash, scopes y expiración opcional. |
| Custom fields | `/api/v1/custom-fields` | Privado (RBAC) | Definiciones de campos reutilizables; límites por aplicación y por plan. |
| Filters | `/api/v1/filters` | Privado (RBAC) | Filtros guardados por usuario/tenant. |
| Relationships | `/api/v1/relationships` | Privado (RBAC) | Extremos dentro del mismo tenant; sin límite de niveles. |
| Subscriptions | `/api/v1/billing/subscriptions` | Privado (RBAC) | Proveedor por adapter. |
| Statements | `/api/v1/billing/statements` | Privado (RBAC) | Jobs y conciliación. |
| Invoices | `/api/v1/billing/invoices` | Privado (RBAC) | PDF individual desde UI. |
| Stripe billing webhook | `/api/v1/billing/webhooks/stripe` | Webhook (HMAC) | Entrante; firma obligatoria; adapter de proveedor configurable. |
| Files | `/api/v1/files` | Privado (RBAC) | Storage, MIME, size y signed URLs. |
| Documents | `/api/v1/documents` | Privado (RBAC) | Versionado acotado. |
| Tags | `/api/v1/tags` | Privado (RBAC) | Scope tenant. |
| Bookmarks | `/api/v1/bookmarks` | Privado (RBAC) | Scope usuario. |
| Consent records | `/api/v1/consent-records` | Privado (RBAC) | Registro legal auditable. |
| Legal templates (público) | `/api/v1/legal/templates` | Público | Obtener documento legal publicado por código/versión (privacidad, términos), por locale/jurisdicción. |
| Legal templates (gestión) | `/api/v1/legal-templates` | Privado (RBAC) | Editor WYSIWYG, versionado y publicación de documentos legales. |
| Events | `/api/v1/events` | Privado (RBAC) | Event outbox e idempotency key. |
| Jobs | `/api/v1/jobs` | Privado (RBAC) | Inngest adapter local y pg_cron separado. |
| Notifications | `/api/v1/notifications` | Privado (RBAC) | In-app default. |
| Rules | `/api/v1/rules` | Privado (RBAC) | Gramática cerrada y loop guard. |
| Email templates | `/api/v1/email-templates` | Privado (RBAC) | Adapter email. |
| Integrations | `/api/v1/integrations` | Privado (RBAC) | Credenciales cifradas por adapter. |
| Webhooks (gestión) | `/api/v1/webhooks` | Privado (RBAC) | Gestión y visibilidad de webhooks entrantes y salientes. |
| Webhooks (entrega entrante) | `/api/v1/webhooks/inbound/{id}` | Webhook (HMAC) | Recepción entrante; verificación de firma, timestamp y anti-replay. |
| Imports | `/api/v1/import-jobs` | Privado (RBAC) | CSV/XLSX, no JSON import. |
| Exports | `/api/v1/export-jobs` | Privado (RBAC) | CSV/XLSX y URLs firmadas. |
| AI models | `/api/v1/ai/models` | Privado (RBAC) | Catálogo, pricing y fallback. |
| AI invocations | `/api/v1/ai/invocations` | Privado (RBAC) | Opt-in, redacción y budgets. |
| AI budgets | `/api/v1/ai/budgets` | Privado (RBAC) | Topes de gasto por proveedor/modelo y por tenant. |
| AI usage | `/api/v1/ai/usage` | Privado (RBAC) | Métricas de consumo y costo por tenant. |
| Task | `/api/v1/tasks` | Privado (RBAC) | Módulo ejemplo en `src/web/modules/task`. |

## Notas de implementación

- Cada dominio implementa su handler según su nivel de auth: **privado** (auth + contexto de tenant + RBAC + rate limit + errores seguros + auditoría) o **público** (sin auth de usuario, con su propia verificación y rate limit).
- Agregar métodos, códigos de respuesta y contratos de error al implementar cada dominio.
- Confirmar rate limits y scopes concretos por endpoint antes de exponer rutas.
