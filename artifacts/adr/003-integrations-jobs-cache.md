# ADR

Ruta de salida: `artifacts/adr/003-integrations-jobs-cache.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | ADR |
| Propósito o subtítulo | Integraciones, jobs, cache y procesos automatizados |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: creado desde Spec aprobada para alimentar el Plan; 2026-06-18: corregido a modelo dual pg_cron + Inngest, requiere re-aprobación; 2026-06-18: propagado patrón de credentials cifradas por adapter, requiere re-aprobación; 2026-06-18: re-aprobado por aprobación explícita del plan vigente |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-18 |
| Frase literal de aprobación | Apruebo el plan. |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado como base |
| Documentos o fuentes asociadas | `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_STACK.md`, `docs/SCALABILITY_ASSURANCE.md`, `artifacts/FROMZERO_SPEC.md`, recursos `stripe`, `inngest`, `redis`, `k6` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `.env.example`, `src/framework/integrations/`, `src/framework/jobs/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se activaron servicios externos. |

## Decisión

Implementar integraciones por adapters: Stripe default para pagos, Resend default para email, OpenRouter default para IA, pg_cron para jobs programados por tiempo, Inngest default para workflows/jobs disparados por usuario, reCAPTCHA como adapter anti-abuso, S3/R2 para storage externo cuando aplique y Redis default off. Toda integración debe tener placeholders en `.env.example`, wrapper interno, feature flag o setting de activación, credentials JSONB cifradas por adapter y gate de seguridad antes de producción.

## Contexto

La Spec activa billing, webhooks, notifications, rules, import/export, Core AI, budgets, rate limits, observabilidad diferida y MCP posterior con acción separada. La documentación D9 define `pg_cron` para jobs programados e Inngest para jobs disparados por usuario. También exige que automatizaciones peligrosas no dependan de aciertos parciales.

## Opciones

| Opción | Resultado |
|---|---|
| Modelo dual pg_cron + Inngest con adapters y placeholders | Elegida. Alinea jobs por tiempo y workflows disparados por usuario sin acoplar secretos. |
| Integraciones directas por módulo | Rechazada. Duplica lógica y dificulta gates. |
| Redis obligatorio desde inicio | Rechazada. La decisión aprobada es default off. |

## Tradeoffs

- Hay que diseñar interfaces, schedules y fallbacks antes de activar proveedores.
- Reduce riesgo de lock-in y facilita apps derivadas.
- Jobs críticos requieren idempotencia, retries, auditoría y evidencia; los basados en tiempo deben declararse como schedules pg_cron.

## Impacto seguridad

- No se leen ni imprimen `.env` reales.
- `credentials` se cifra at rest por adapter, con clave fuera del repositorio y sin registrar valores completos en logs.
- Los campos exactos de Stripe, Resend, OpenRouter, Inngest, reCAPTCHA y S3/R2 se validan contra documentación oficial en el Sprint correspondiente.
- Webhooks deben validar HMAC y anti-replay.
- Integraciones salientes deben incluir SSRF guard.
- MCP Supabase/SonarQube queda prohibido hasta aprobación dedicada.

## Impacto escalabilidad

- pg_cron cubre purga de soft-deletes, expiración de tokens, recordatorios y expiración de trial.
- Inngest cubre import/export grande, retries, notifications, rules y workflows disparados por usuario.
- Redis puede activarse por entorno si rate limit/cache lo exige.
- k6 valida flujos críticos en staging antes de release candidate.

## Resultado

El Plan debe ubicar jobs y automatizaciones después de datos/auth/API, incluir filtro automatización vs augmentación, y bloquear release si faltan idempotencia, retries, auditoría, schedules pg_cron para procesos por tiempo, SSRF guard, webhook signatures o pruebas k6.
