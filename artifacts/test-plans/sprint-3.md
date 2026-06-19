# Sprint 3 - Plan de pruebas local

## Alcance

- Migracion SQL fundacional versionada en `supabase/migrations/`.
- Bootstrap declarativo en `bootstrap.json`.
- Contratos Zod para settings, modules, plans, logs, tenant, API y rate limit.
- Endpoint tecnico `GET /api/v1/health`.

## Pruebas ejecutables sin Supabase cloud

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run check
```

## Verificaciones cubiertas

- Bootstrap SaaS con `allow_multi_tenant_users = false`.
- 27 modulos core en registry.
- RLS habilitado en tablas fundacionales tenant-aware.
- Logs append-only por trigger.
- Trial vencido alineado a `degrade_to_free`.
- Tenants sin grants anonimos.
- Tenant context via `auth.jwt().app_metadata.tenant_id`, sin `x-tenant-id`.
- Health API sin secretos.

## Limitaciones

- Supabase CLI no esta instalado en la maquina, por eso no se ejecuto `supabase migration new`.
- No se ejecutaron migraciones cloud ni MCP Supabase.
- Las pruebas de RLS son estaticas sobre SQL; la ejecucion real queda pendiente de entorno Supabase aprobado.
