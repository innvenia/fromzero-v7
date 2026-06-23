---
name: fz-scale
description: "Usar automáticamente cuando el usuario pida revisar rendimiento, carga, escalabilidad, cache, colas, jobs, consultas, costos o despliegue, aunque lo diga como 'revisa si esto escala', 'esto soportará usuarios', 'optimiza rendimiento' o 'revisa carga antes de cerrar'."
---

# fz-scale

## Frases simples que activan esta skill

- "Revisa si esto escala."
- "Esto soportará usuarios?"
- "Optimiza rendimiento."
- "Revisa carga antes de cerrar."
- "Define cache, jobs y consultas."

## Cinco decisiones

1. Cache: no cache, Next/Data, HTTP/CDN, Redis o materialized view.
2. Async: sync, `pg_cron`, Inngest o BullMQ + Redis.
3. Queries: índices, paginación, p95 y sin N+1.
4. Load: k6 para flujos críticos.
5. Scale: stateless, multi-instancia, load balancing, quotas y observabilidad.

Redis es opcional, pero sugerido para producción multi-instancia.

Verifica los KPIs y SLOs declarados en `artifacts/FROMZERO_SPEC.md`; ningún KPI queda sin
medición o sin relajación justificada antes de release.

## Integraciones

- Redis: usar solo si cache compartida, rate limits distribuidos, locks o BullMQ lo justifican.
- Inngest: preferir para workflows async cuando se quiere evitar Redis como requisito base.
- Runpod: exigir quotas, budget, timeouts y observabilidad por tenant.
- Hostinger: validar target de deployment, healthcheck, TLS, backups y rollback.
- k6: obligatorio para release candidates críticos o flujos con carga declarada.
- Si se crea un escenario k6 como artefacto, guardarlo bajo `artifacts/k6/` usando `templates/k6-scenario.md`.

Documenta variables en `.env.example`; el agente puede leer `.env.local` para operar herramientas del TechStack dentro de la sesión (Controlled Secret Runtime Access), sin imprimir ni versionar secretos.

Cuando el gate pase y haya cambios, evidencia o artefactos actualizados, crea commit automático si es seguro. El cierre debe mostrar hash corto y mensaje completo.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir si el humano debe revisar riesgos de escala, aprobar la verificación o corregir un bloqueo.
