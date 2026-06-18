# Supabase

## Activar cuando

- El PRD menciona Supabase, Postgres, Auth, RLS, Storage o Realtime.
- Hay datos por tenant.
- Hay reglas de permisos por cuenta, organización o usuario.

## Reglas

- RLS obligatorio en tablas tenant-aware.
- RBAC debe validarse server-side.
- `SUPABASE_SERVICE_ROLE_KEY` solo puede usarse en servidor, jobs o scripts controlados.
- Documentar variables en `.env.example`; no leer `.env` reales.
- Migraciones y policies deben revisarse antes de release.

## Variables

Públicas en cliente cuando aplique:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Secretas:

- `SUPABASE_SERVICE_ROLE_KEY`

## Gates

- Prueba: tenant A no lee datos de tenant B.
- Prueba: usuario sin permiso no muta.
- Prueba: service role no se expone al cliente.
- Revisión: policies, índices y migraciones.
