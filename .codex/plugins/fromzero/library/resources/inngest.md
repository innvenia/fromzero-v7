# Inngest

## Activar cuando

- Hay background jobs, workflows, jobs programados o procesos async.
- Se quiere evitar Redis como requisito base.

## Reglas

- Jobs deben ser idempotentes.
- Incluir tenant context en eventos.
- Definir retries, errores permanentes y observabilidad.
- No enviar secretos ni PII innecesaria en payloads.

## Variables

Públicas o configuración:

- `INNGEST_EVENT_KEY`

Secretas:

- `INNGEST_SIGNING_KEY`

## Gates

- Retry policy definida.
- Idempotency definida.
- Tenant context preservado.
- Fallos visibles en logs/monitoring.
