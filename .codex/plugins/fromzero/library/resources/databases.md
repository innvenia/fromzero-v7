# Databases

## Cobertura

Postgres, MySQL, MariaDB, MongoDB, SQLite, SQL Server, DynamoDB, ORMs y persistencia equivalente.

## Gates

- Ownership de datos definido.
- Tenant boundary definido.
- Migraciones revisadas.
- Entorno objetivo (local vs cloud dev) resuelto antes de migrar con `tools/resolve-db-environment.mjs` o la decisión declarada; no asumir local por defecto.
- Índices para filtros, FKs y queries críticas.
- Backup/restore considerado.
- Acceso mínimo necesario.

## Seguridad

- No construir queries con concatenación insegura.
- Secrets de conexion solo en entorno seguro.
- RLS o equivalente cuando aplique.
- Validar aislamiento inter-tenant.

## Faltantes

Si la base no soporta RLS, documentar mecanismo equivalente de aislamiento y pruebas.
