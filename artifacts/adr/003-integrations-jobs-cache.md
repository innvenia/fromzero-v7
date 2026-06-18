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
| Estado actual | borrador |
| Historial de estados | 2026-06-18: creado desde Spec aprobada para alimentar el Plan |
| Aprobación del usuario | pendiente |
| Fecha de aprobación | pendiente |
| Frase literal de aprobación | pendiente |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado como base |
| Documentos o fuentes asociadas | `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_STACK.md`, `docs/SCALABILITY_ASSURANCE.md`, `artifacts/FROMZERO_SPEC.md`, recursos `stripe`, `inngest`, `redis`, `k6` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `.env.example`, `src/framework/integrations/`, `src/framework/jobs/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se activaron servicios externos. |

## Decisión

Implementar integraciones por adapters: Stripe default para pagos, Resend default para email, OpenRouter default para IA, Inngest default para event bus/jobs, reCAPTCHA como adapter anti-abuso y Redis default off. Toda integración debe tener placeholders en `.env.example`, wrapper interno, feature flag o setting de activación y gate de seguridad antes de producción.

## Contexto

La Spec activa billing, webhooks, notifications, rules, import/export, Core AI, budgets, rate limits, observabilidad diferida y MCP posterior con acción separada. También exige que automatizaciones peligrosas no dependan de aciertos parciales.

## Opciones

| Opción | Resultado |
|---|---|
| Adapters con defaults y placeholders | Elegida. Entrega base vendible sin acoplar secretos. |
| Integraciones directas por módulo | Rechazada. Duplica lógica y dificulta gates. |
| Redis obligatorio desde inicio | Rechazada. La decisión aprobada es default off. |

## Tradeoffs

- Hay que diseñar interfaces y fallbacks antes de activar proveedores.
- Reduce riesgo de lock-in y facilita apps derivadas.
- Jobs críticos requieren idempotencia, retries, auditoría y evidencia.

## Impacto seguridad

- No se leen ni imprimen `.env` reales.
- Webhooks deben validar HMAC y anti-replay.
- Integraciones salientes deben incluir SSRF guard.
- MCP Supabase/SonarQube queda prohibido hasta aprobación dedicada.

## Impacto escalabilidad

- Jobs de billing, import/export, notifications y rules deben ser idempotentes.
- Redis puede activarse por entorno si rate limit/cache lo exige.
- k6 valida flujos críticos en staging antes de release candidate.

## Resultado

El Plan debe ubicar jobs y automatizaciones después de datos/auth/API, incluir filtro automatización vs augmentación, y bloquear release si faltan idempotencia, retries, auditoría, SSRF guard, webhook signatures o pruebas k6.
