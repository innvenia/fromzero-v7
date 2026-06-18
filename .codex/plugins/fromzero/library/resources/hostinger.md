# Hostinger

## Activar cuando

- El PRD o plan menciona Hostinger, VPS, hosting, dominio o despliegue en Hostinger.

## Reglas

- Tratar Hostinger como target de deployment.
- No guardar claves SSH o tokens en el repo.
- Documentar DNS, TLS, backups y rollback.
- Validar compatibilidad del stack antes de comprometer deployment.

## Variables

Públicas:

- `APP_BASE_URL`

Secretas:

- `HOSTINGER_API_TOKEN`
- `SSH_PRIVATE_KEY`

## Gates

- TLS activo.
- Backups definidos.
- Rollback documentado.
- Healthcheck y logs disponibles.
