# Test Plan - Sprint 6

Ruta de salida: `artifacts/test-plans/sprint-6.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Test Plan |
| Propósito o subtítulo | Plan de pruebas para billing, suscripciones, statements, invoices y PDF |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-19 |
| Última actualización | 2026-06-19 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-19: creado al iniciar Sprint 6 por aprobación explícita del usuario |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-19 |
| Frase literal de aprobación | apruebo sprint 6 |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas | `docs/PRD.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`, `artifacts/FROMZERO_PLAN.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `supabase/migrations/` |
| Commit asociado | `66b458e feat(billing): add billing core contracts` |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Sin cobros reales. Sin migraciones cloud. |

## Unit

- Subscription: validar estados, owner `tenant`/`user`, plan vinculado, fechas de trial y `external_subscription_id` nullable.
- Trial lifecycle: validar que un trial vencido degrada a plan Free cuando existe plan freemium.
- Statement: validar line items, currency única, total calculado y estados `draft`, `finalized`, `paid`, `voided`.
- Invoice: validar DTO read-only, transición de status permitida y bloqueo de cambios contables inmutables.
- Payment adapter: validar contrato mockeable sin llamadas reales.
- Stripe webhook: validar firma HMAC, tolerancia de timestamp, rechazo de firma inválida y normalización de evento.
- PDF individual: validar descriptor PDF por invoice/statement, nombre de archivo estable y bytes con cabecera PDF.

## Integration

- Contratos API reservados para `/api/v1/billing/subscriptions`, `/api/v1/billing/statements`, `/api/v1/billing/invoices` y `/api/v1/billing/webhooks/stripe`.
- Exports públicos desde `src/framework/index.ts`, `src/framework/modules/index.ts`, `src/framework/billing` y `src/framework/integrations/stripe`.

## RLS/RBAC

- SQL versionado debe crear `subscriptions`, `statements` e `invoices` con RLS.
- Authenticated solo lee datos tenant-aware; escrituras quedan reservadas a backend/service role.
- Webhooks se procesan por backend con firma obligatoria, idempotencia y auditoría.
- Invoices bloquean cambios de contenido contable después de emitirse; solo cambia status.

## Playwright

- No aplica en Sprint 6 porque no se agrega pantalla de billing nueva.
- UI de billing completa queda para módulos visuales posteriores si el plan lo solicita.

## Visual

- No aplica en Sprint 6. El PDF se valida como artefacto binario mínimo, no como pantalla.

## k6

- No aplica en Sprint 6. Billing webhooks y APIs críticas se cubren en Sprint 11 contra staging.

## Limitaciones

- No se conecta Stripe real.
- No se ejecutan cobros reales.
- No se aplican migraciones reales en Supabase local/cloud.
- Webhooks quedan validados por contrato y HMAC local.
