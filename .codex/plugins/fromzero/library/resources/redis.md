# Redis

## Activar cuando

- Se requiere cache compartida multi-instancia.
- Hay rate limits distribuidos.
- Hay colas BullMQ, locks, quotas o invalidación compartida.

## Reglas

- Redis es opcional para la base FromZero.
- Si se usa, debe existir fallback o decisión explícita de dependencia.
- No hardcodear `REDIS_URL`.
- Documentar `REDIS_URL` en `.env.example`.
- Definir TTL, invalidación, namespace por tenant y política de errores.

## Gates

- Decisión: no cache, Next/Data, HTTP/CDN, Redis o materialized view.
- Decisión: sync, `pg_cron`, Inngest o BullMQ + Redis.
- Verificar que rate limits no dependan de memoria local si hay multiples instancias.
- Documentar impacto de caida de Redis.
