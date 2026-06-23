# DEFERRED_ACTIVATIONS

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | DEFERRED_ACTIVATIONS |
| Propósito o subtítulo | Activaciones externas que no deben ejecutarse sin aprobación explícita |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-21 |
| Última actualización | 2026-06-22 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-21: creado durante Fase 1 para registrar activaciones pendientes; 2026-06-22: Sprint 9 implementó contrato Core AI local y mantuvo OpenRouter real diferido; 2026-06-22: Supabase Cloud dev verificado por conexión directa sin imprimir secretos; 2026-06-22: migración cloud Sprint 9 activada y validada con RLS negativa cross-tenant; 2026-06-22: plan pre-Sprint 10 aprobado, advisory RLS global de `settings`, `modules` y `plans` documentado como diferido aceptado sin migración; 2026-06-22: dueño pidió conservar el advisory RLS global como diferido del proyecto y revisarlo al finalizar todos los Sprints |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-21 |
| Frase literal de aprobación | PLEASE IMPLEMENT THIS PLAN |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_DECISIONS.md` |
| Documentos o fuentes asociadas | GitHub Actions, SonarQube, Supabase, Stripe, Resend, Inngest, OpenRouter, k6 |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md` |
| Commit asociado | Sprint 9: `f5fd78e fix(sonar): resolve quality findings before sprint 9`; `0696b33 feat(ai): validate sprint 9 cloud schema and rls`; `e173e0e fix(ai): resolve sonar quality gate findings` |
| Restricciones de seguridad | Sin secretos impresos. `.env.local` solo para presencia/conexión. Valores reales fuera del repo. |

## Activaciones diferidas

| Activación | Estado | Razón | Evidencia requerida para cerrar |
|---|---|---|---|
| GitHub Actions run | operativo en `main`, PR pre-Sprint 10 pendiente | Workflow pasó en `main`; falta push de rama `codex/pre-sprint-10-readiness` y CI del PR | Run del PR verde |
| SonarQube baseline | operativo con limitación | Baseline publicado para `fromzero-framework`; API de métricas requiere token y no se imprimen secretos | Análisis visible en project key `fromzero-framework` y gate del PR verde |
| Sonar token | bloqueado por gate externo | No fue provisto como secret externo | Secret presente sin valor impreso |
| OpenRouter real | contrato implementado, integración pendiente | Modelo revalidado y adapter mockeable implementado; falta secret externo y prueba controlada | Secret externo, smoke test real y evidencia de costo/log sin PII |
| Migración cloud Sprint 9 | activada | `20260622222347_core_ai_openrouter.sql` aplicada en Supabase Cloud dev por conexión directa; `public.ai_models` y `public.ai_budgets` verificadas con RLS | `schema_migrations.version=20260622222347`; `ai_models`/`ai_budgets` existen con RLS; prueba rollback-only: `visible_same_tenant=1`, `visible_cross_tenant=0`, `visible_total=1` |
| Advisory RLS global `settings`/`modules`/`plans` | diferido aceptado hasta cierre de Sprints | El dueño eligió documentar sin migración antes de Sprint 10 y revisarlo al finalizar todos los Sprints; tablas documentadas como globales sin `tenant_id`, pero el advisory remoto reporta RLS deshabilitado y `modules`/`plans` tienen grants de lectura para `authenticated` | Revisión obligatoria al cierre de Sprint 12, antes de release final: decidir migración/policies o justificar server-only/RBAC; confirmar matriz `settings` CRUD Super Admin, `modules` lectura limitada UI, `plans` plan propio/lectura limitada |
| Stripe real | bloqueado por gate externo | Fase 1 usa contratos y mocks; no cobros reales | Sandbox aprobado y webhooks probados |
| Resend real | bloqueado por gate externo | Secreto externo y política de envío pendiente | Secret externo y prueba controlada |
| Inngest cloud | bloqueado por gate externo | Fase 1 usa contrato local/self-hosted | Proyecto/keys externos aprobados |
| Webhooks reales | bloqueado por gate externo | Requieren destinos, HMAC y anti-replay aprobados | Endpoint de prueba firmado |
| Purgas reales | bloqueado por gate externo | No ejecutar borrados sin preview | Preview, backup y aprobación |
| k6 staging | bloqueado por gate externo | Falta URL staging estable | Resultado `k6 run` o issue de carga |
| Coolify/deploy público | bloqueado por gate externo | No forma parte del saneamiento Sprint 1-8 | Ambiente aprobado y variables externas |

## Regla de cierre

Ninguna activación externa se considera cerrada por existir un contrato local. Debe existir evidencia operacional y aprobación humana registrada.
