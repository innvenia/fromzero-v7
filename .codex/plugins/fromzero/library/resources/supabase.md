# Supabase

## Activar cuando

- El PRD menciona Supabase, Postgres, Auth, RLS, Storage o Realtime.
- Hay datos por tenant.
- Hay reglas de permisos por cuenta, organización o usuario.

## Reglas

- RLS obligatorio en tablas tenant-aware.
- RBAC debe validarse server-side.
- `SUPABASE_SECRET_KEY` (moderna) solo puede usarse en servidor, jobs o scripts controlados; la legacy `SUPABASE_SERVICE_ROLE_KEY` solo si el esquema clásico JWT sigue activo.
- Documentar variables en `.env.example`. El agente puede leer `.env.local` para operar Supabase dentro de la sesión (Controlled Secret Runtime Access); nunca imprimir ni versionar el token ni las keys.
- Migraciones y policies deben revisarse antes de release.

## Variables

Usar el mecanismo moderno de keys (publishable/secret). Formato y orden en `library/resources/env-template.md`.

Públicas en cliente cuando aplique:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Configuración:

- `SUPABASE_PROJECT_ID`

Secretas (solo servidor):

- `SUPABASE_SECRET_KEY`
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_DIRECT_CONNECTION_STRING`

Legacy (solo si se requiere el esquema clásico JWT, sección aparte):

- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Gates

- Prueba: tenant A no lee datos de tenant B.
- Prueba: usuario sin permiso no muta.
- Prueba: service role no se expone al cliente.
- Revisión: policies, índices y migraciones.

## Comandos por entorno

Antes de migrar o verificar, resuelve el entorno objetivo; no asumas `--local`.

- Resolver objetivo: `node tools/resolve-db-environment.mjs --project <ruta>` (reporta local|cloud por presencia de variables, sin imprimir valores) o lee el `Entorno objetivo de trabajo` declarado en State/Plan.
- Local (stack desechable): requiere `supabase start`; migrar con `supabase migration up --local`; las pruebas RLS corren contra `127.0.0.1`.
- Cloud dev: migrar con `supabase db push --db-url "$SUPABASE_DIRECT_CONNECTION_STRING"`; con `SUPABASE_ACCESS_TOKEN` también aplica `--linked`. No usar `--local` contra cloud.
- Antes de ejecutar, confirma que el entorno detectado coincide con el declarado; si no coincide, detente y reconcílialo.
- Ejecución real de schema/RLS: migración aplicada contra el entorno declarado + prueba RLS negativa cross-tenant; si no se logra, el Sprint queda bloqueado salvo aprobación de riesgo registrada.
