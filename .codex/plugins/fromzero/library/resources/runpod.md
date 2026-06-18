# Runpod

## Activar cuando

- El PRD menciona Runpod, GPU, inferencia IA, model serving o workloads pesados.

## Reglas

- Runpod debe tratarse como infraestructura de ejecución, no como lógica de negocio.
- Toda llamada debe tener timeout, rate limit y budget cap.
- Auditar uso por tenant si procesa datos de cliente.
- Revisar egress, PII y retención de datos.
- No exponer `RUNPOD_API_KEY`.

## Variables

Públicas o no sensibles:

- `RUNPOD_ENDPOINT_ID`

Secretas:

- `RUNPOD_API_KEY`

## Gates

- Budget y quotas definidos.
- Rate limits por tenant o usuario.
- Logs sin PII innecesaria.
- Fallback si el endpoint no responde.
