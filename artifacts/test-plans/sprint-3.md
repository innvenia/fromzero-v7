# Sprint 3 - Plan de pruebas reconciliado

## Alcance

- Migracion SQL fundacional versionada en `supabase/migrations/`.
- Bootstrap declarativo local-only en `bootstrap.json` y estructura segura versionada en `bootstrap.example.json`.
- Contratos Zod para settings, modules, plans, logs, tenant, API y rate limit.
- Endpoint tecnico `GET /api/v1/health`.

## Pruebas ejecutadas

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm run check
supabase migration list --linked
supabase db push --linked
supabase db query --linked "begin; set local role authenticated; select count(*)::int as visible_tenants_without_claims from public.tenants; rollback;"
```

## Verificaciones cubiertas

- Bootstrap SaaS con `allow_multi_tenant_users = false` por default y configurable a `true`.
- 27 modulos core en registry.
- RLS habilitado en tablas fundacionales tenant-aware.
- Logs append-only por trigger.
- Trial vencido alineado a `degrade_to_free`.
- Tenants sin grants anonimos.
- Tenant context via `auth.jwt().app_metadata.tenant_id`, sin `x-tenant-id`.
- Health API sin secretos.
- Migraciones aplicadas contra Supabase cloud dev.
- RLS negativa real: rol `authenticated` sin claims no ve tenants.

## Limitaciones

- Docker Desktop no estaba activo; Supabase CLI no pudo cachear catalogo local pg-delta, pero el push remoto finalizo.
- No se leyo ningun `.env` real ni se imprimieron secretos.
- No se tocaron `docs/` por regla del dueño.
