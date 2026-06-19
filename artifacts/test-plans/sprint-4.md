# Test Plan - Sprint 4

Ruta de salida: `artifacts/test-plans/sprint-4.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Test Plan |
| Propósito o subtítulo | Auth, tenant context, RBAC y API keys |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-19 |
| Última actualización | 2026-06-19 |
| Estado actual | ejecutado localmente |
| Historial de estados | 2026-06-19: creado al iniciar Sprint 4; 2026-06-19: pruebas locales ejecutadas |
| Aprobación del usuario | aprobada para Sprint 4 |
| Fecha de aprobación | 2026-06-19 |
| Frase literal de aprobación | apruebo continuar con el sprint 4 |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas | `docs/REFERENCE_MODULES.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`, `docs/SECURITY_ASSURANCE.md`, `docs/REFERENCE_THREAT_MODEL.md`, documentación Supabase SSR/Auth/RLS |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `supabase/migrations/`, `src/framework/auth/`, `src/framework/modules/` |
| Commit asociado | pendiente de cierre |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Sin MCP. Sin migraciones cloud. |

## Unit

- Validar contratos Zod de usuarios, perfiles, invitaciones y API keys.
- Validar que el contexto de tenant sale de `app_metadata`, no de headers/body/query.
- Validar escalación MFA: un override de Tenant no puede relajar la política global.
- Validar hash SHA-256 de API keys y verificación con comparación segura.
- Validar scopes de API key por `module:action`, comodines y expiración.

## Integration

- Validar contratos de clientes Supabase SSR/browser/service con variables públicas o server-only.
- Validar inventario API Sprint 4 sin implementar handlers prematuros.

## RLS/RBAC

- Validar SQL versionado para `users`, `user_preferences`, `invitations` y `api_keys`.
- Validar RLS habilitado en tablas tenant-aware.
- Validar grants explícitos y revocación de `anon`.
- Validar guard server-side `requirePermission(action, moduleSlug)`.
- Validar casos negativos BOLA/IDOR por tenant spoofing.

## Playwright

- No aplica. Sprint 4 no cambia UI visual.

## Visual

- No aplica. Sprint 4 no cambia superficies visuales.

## k6

- No aplica. Performance de auth/API se valida en Sprint 11 contra staging.

## Limitaciones

- `supabase` CLI existe como devDependency local (`2.107.0`), pero no se ejecuta `supabase db reset` ni advisors porque no hay Supabase local/cloud conectado en este Sprint.
- La migración queda como SQL versionado local y no se aplica a Supabase local/cloud.
- No se activa MCP Supabase ni se autentica ningún servicio externo.
