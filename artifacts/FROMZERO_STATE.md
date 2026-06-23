# FROMZERO_STATE

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_STATE |
| Propósito o subtítulo | Estado operativo central para reanudar ejecución |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-22 |
| Estado actual | activo |
| Historial de estados | 2026-06-18: creado junto con Plan tras aprobación explícita de Spec; 2026-06-18: Plan/Spec/ADR corregidos por Task path, pg_cron y FCP, requiere re-aprobación; 2026-06-18: propagados ajustes Core AI, auditoría, RBAC, rules e integraciones a Spec/Plan/ADRs, requiere re-aprobación; 2026-06-18: plan vigente aprobado explícitamente, Sprint 1 pendiente de confirmación pre-código; 2026-06-18: Sprint 1 iniciado por aprobación explícita del usuario; 2026-06-18: Sprint 1 completado; 2026-06-18: Sprint 2 iniciado por solicitud `continua con el siguiente sprint`; 2026-06-18: Sprint 2 completado y commiteado; 2026-06-18: Sprint 3 iniciado por solicitud literal `ejecuta sprint 3`; 2026-06-18: Sprint 3 completado localmente con migración SQL versionada, bootstrap, contratos Zod, health API y pruebas; 2026-06-18: `.mcp.json` local preparado para Supabase y SonarQube con servidores deshabilitados y sin secretos inline; 2026-06-18: SonarQube MCP alineado a Docker stdio sin token inline; 2026-06-18: Supabase MCP alineado a npx stdio en modo read-only sin token inline; 2026-06-19: Sprint 4 iniciado por aprobación explícita del usuario; 2026-06-19: Sprint 4 completado localmente con auth/RBAC/API keys, migración SQL versionada, contratos Zod y pruebas; 2026-06-19: Sprint 5 iniciado por aprobación explícita del usuario; 2026-06-19: Sprint 5 completado localmente con Module Factory, Grid Universal, custom fields, filters, relationships, DataGrid, pruebas y documentación; 2026-06-19: Sprint 6 iniciado por aprobación explícita del usuario con Stripe mockeable y sin cobros reales; 2026-06-19: Sprint 6 completado localmente con billing core, subscriptions, statements, invoices, adapter Stripe mockeable, webhook HMAC, PDF individual, migración SQL versionada y pruebas; 2026-06-19: Sprint 7 iniciado por aprobación explícita del usuario; 2026-06-19: Sprint 7 completado localmente con storage, documents, tags, bookmarks, consent records, SQL versionado, pg_cron de purga y pruebas; 2026-06-19: Sprint 8 iniciado por aprobación explícita del usuario; 2026-06-19: Sprint 8 completado localmente con event outbox, jobs, rules, notifications, email templates, integrations/webhooks, SSRF/HMAC, import/export, SQL versionado y pruebas; 2026-06-21: Fase 1 Sprint 1-8 ejecutada con GitHub origin, Supabase cloud dev, Sonar config, UI capturas, handler privado de referencia y separación demo/fundacional; 2026-06-21: validación final local y cloud ejecutada sin tocar `docs/`, `.codex/` ni `.env.local`; 2026-06-21: GitHub Actions pasó en run `27921644951` y SonarQube publicó baseline para `fromzero-framework`; 2026-06-22: dependencias Sprint 1-8 revalidadas localmente y Sprint 9 iniciado por solicitud del usuario; 2026-06-22: Sprint 9 completado localmente con Core AI, OpenRouter adapter mockeable, ai_models, ai_budgets, redaction, budgets y pruebas; 2026-06-22: Sprint 9 reabierto como schema/RLS, entorno resuelto como cloud dev, migración `20260622222347_core_ai_openrouter.sql` aplicada a Supabase Cloud dev y RLS negativa cross-tenant validada con rollback; 2026-06-22: plan pre-Sprint 10 aprobado por el usuario, rama `codex/pre-sprint-10-readiness` creada para PR, commits Sprint 9 reales registrados y advisory RLS global documentado como deuda aceptada sin migración |
| Aprobación del usuario | aprobada para cierre pre-Sprint 10 |
| Fecha de aprobación | 2026-06-22 |
| Frase literal de aprobación | PLEASE IMPLEMENT THIS PLAN |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md` aprobado |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/adr/`, Git |
| Artefactos derivados o relacionados | `artifacts/handoffs/`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado | Sprint 1: `6d158ff chore(fromzero): completa sprint 1 base inicial`; Sprint 2: `1133fad feat(shell): add localized app shell`; Sprint 3: `b57c807 feat(db): add foundation schema and bootstrap`; Sprint 4: `b1bc9a4 feat(auth): add tenant rbac and api key contracts`; Sprint 5: `f7b3b86 feat(factory): add module factory grid contracts`; Sprint 6: `66b458e feat(billing): add billing core contracts`; Sprint 7: `bf4478c feat(storage): add document file shared module contracts`; Sprint 8: `c124575 feat(events): add automation and data exchange contracts`; MCP config: commits `chore(mcp): prepare local server config`, `chore(mcp): align sonarqube server config`, `chore(mcp): align supabase server config`; Fase 1: `c494b9f feat(fromzero): complete phase 1 guided sanitation`; CI fix: `3ff5c76 ci: use project npm version`; Sprint 9 cierre local/cloud: `f5fd78e fix(sonar): resolve quality findings before sprint 9`, `0696b33 feat(ai): validate sprint 9 cloud schema and rls`, `e173e0e fix(ai): resolve sonar quality gate findings` |
| Restricciones de seguridad | Sin secretos impresos. `.env.local` leído solo para presencia/conexión. `bootstrap.json` local-only. Proveedores reales, purgas reales, MCP y migraciones nuevas requieren aprobación separada. |

## Resumen para el dueño

- Estado actual: Sprint 9 cerrado validado en cloud dev.
- Último avance: Core AI interno, OpenRouter adapter mockeable, catálogo `ai_models`, presupuestos `ai_budgets` y redacción/logs sin prompts.
- Sprint actual: Sprint 9 cerrado validado; Sprint 10 pendiente no iniciado.
- Siguiente acción: cerrar PR pre-Sprint 10 y no iniciar Sprint 10 hasta CI verde y working tree limpio.
- Bloqueos o riesgos: OpenRouter real sigue diferido; advisory preexistente detectó RLS deshabilitado en `public.modules`, `public.plans` y `public.settings`; el dueño aprobó documentarlo sin migración antes de Sprint 10.
- Qué necesita decidir o aprobar el dueño: mergear o pedir correcciones del PR pre-Sprint 10; activar OpenRouter real queda como gate separado.

## 1. Estado general

- Estado del proyecto: build.
- Plugin FromZero runtime: fallback desde workspace local `.codex/plugins/fromzero`.
- Cuestionario: aprobado.
- Spec: aprobada.
- Plan: aprobado.
- ADRs afectados: 001, 002, 003, 004 y 005 aprobados o reconciliados.
- Git: inicializado.
- Branch: `codex/pre-sprint-10-readiness`.
- Working tree: debe quedar limpio al cerrar el PR pre-Sprint 10.
- Commit base antes de MCP config: `b57c807 feat(db): add foundation schema and bootstrap`.
- Último commit FromZero: `e173e0e fix(ai): resolve sonar quality gate findings`.
- Último commit publicado en `origin/main`: `160c5c5 security(sonar): remove notification sms regex hotspot`.

## 2. Artefactos vigentes

- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Contexto: `artifacts/FROMZERO_CONTEXT.md`.
- Spec: `artifacts/FROMZERO_SPEC.md`.
- Diseño técnico: `artifacts/adr/`.
- Plan: `artifacts/FROMZERO_PLAN.md`.
- Recursos instalados: plugin local FromZero en `.codex/plugins/fromzero`.
- Lockfile FromZero: no creado; no se instalaron recursos FromZero empaquetados.

## 3. Sprint actual

- Sprint actual: Sprint 9.
- Estado: cerrado validado.
- Objetivo completado: Core AI interno con FastAPI/Pydantic v2, provider adapter OpenRouter mockeable, model catalog, opt-in contractual, redaction, budgets y usage metadata para `ai.invocation`.
- Fuente en plan: `artifacts/FROMZERO_PLAN.md` -> `### Sprint 9 - Core AI y OpenRouter`.
- Commit asociado: `f5fd78e fix(sonar): resolve quality findings before sprint 9`; `0696b33 feat(ai): validate sprint 9 cloud schema and rls`; `e173e0e fix(ai): resolve sonar quality gate findings`.

## 4. Último Sprint completado

- Sprint: Sprint 9.
- Fecha: 2026-06-22.
- Evidencia: `core-ai/core_ai/`, `src/framework/ai/`, `src/framework/modules/ai-model/`, `supabase/migrations/20260622222347_core_ai_openrouter.sql`, `tests/unit/sprint9-contracts.test.ts`, `tests/unit/sprint9-sql.test.ts`, `core-ai/tests/test_core_ai.py`, `artifacts/test-plans/sprint-9.md`, `.env.example`, `README.md`.
- Tests/comandos: `npm test -- tests/unit/sprint9-contracts.test.ts tests/unit/sprint9-sql.test.ts`; `python -m pytest core-ai/tests`; `npm run check`; `npm audit --audit-level=moderate`; `git diff --check`; secret scan básico.
- Limitación: no se ejecutó OpenRouter real; queda diferido por secret externo y smoke test controlado.
- Supabase Cloud: cloud dev operativo por conexión directa desde `.env.local`; `20260622222347_core_ai_openrouter.sql` aplicado con `supabase db push --db-url`.
- Consulta remota: `public.ai_models` y `public.ai_budgets` existen, tienen RLS habilitado, `authenticated` tiene `SELECT`, `anon` no tiene `SELECT`, y `schema_migrations.version = 20260622222347`.
- Prueba RLS real: transacción rollback-only con usuario sintético autenticado en tenant A; resultado `visible_same_tenant=1`, `visible_cross_tenant=0`, `visible_total=1`.
- Verificación visual: no aplica; Sprint 9 no agrega UI web.
- Commit: `f5fd78e fix(sonar): resolve quality findings before sprint 9`; `0696b33 feat(ai): validate sprint 9 cloud schema and rls`; `e173e0e fix(ai): resolve sonar quality gate findings`.

## 4.1 Commits previos relevantes

| Hash corto | Mensaje completo | Fase o Sprint | Estado de fase | Razón de referencia |
|---|---|---|---|---|
| 2d10842 | chore: initialize project repository | Init | cerrado | Git base inicial |
| abc3a3e | docs(fromzero): add project context analysis | Context | cerrado | Contexto FromZero |
| 207a3ff | docs(fromzero): add answered questionnaire | Questionnaire | cerrado | Cuestionario respondido |
| c680921 | docs(fromzero): correct questionnaire decisions | Questionnaire | cerrado | Correcciones documentales |
| 4c960be | docs(fromzero): define project specification | Spec | cerrado | Spec creada |
| 88c9a19 | docs(fromzero): align pre-spec documentation | Spec | cerrado/inferido | Documentación pre-spec detectada en Git |
| 81505b7 | docs(fromzero): create implementation plan and state | Plan | cerrado | Plan y State iniciales |
| 4618a30 | fix(fromzero): corrige task path, agrega pg_cron y FCP en plan y fuentes | Plan | cerrado | Corrección de Plan/Spec/ADR |
| 0350528 | docs(core-ai): enriquece schema ai_models y aclara patrones de auditoria, rbac, rules e integraciones | Docs | cerrado | Ajustes documentales previos |
| 0b47791 | docs(fromzero): propaga ajustes de core-ai y patrones a spec y plan | Plan | cerrado | Propagación a artefactos FromZero |
| 7b35435 | docs(fromzero): registra aprobación del plan | Plan | cerrado | Aprobación vigente antes de Build |
| 6d158ff | chore(fromzero): completa sprint 1 base inicial | Sprint 1 | cerrado | Base inicial y lockfile |
| 1133fad | feat(shell): add localized app shell | Sprint 2 | cerrado | UI shell, i18n, Playwright y START_HERE autorizado |
| b57c807 | feat(db): add foundation schema and bootstrap | Sprint 3 | cerrado | Schema fundacional, bootstrap y contratos |
| b1bc9a4 | feat(auth): add tenant rbac and api key contracts | Sprint 4 | cerrado | Auth, RBAC, API keys y contratos |
| f7b3b86 | feat(factory): add module factory grid contracts | Sprint 5 | cerrado | Factory, Grid, filtros, custom fields y relaciones |
| 66b458e | feat(billing): add billing core contracts | Sprint 6 | cerrado | Billing core, Stripe mock, webhooks, PDF y SQL versionado |
| bf4478c | feat(storage): add document file shared module contracts | Sprint 7 | cerrado local | Storage, documents, tags, bookmarks, consent y SQL versionado |
| c124575 | feat(events): add automation and data exchange contracts | Sprint 8 | cerrado local | Event outbox, jobs, rules, notifications, webhooks, import/export y SQL versionado |
| f5fd78e | fix(sonar): resolve quality findings before sprint 9 | Pre-Sprint 9 | cerrado | Quality findings previos a Sprint 9 |
| 0696b33 | feat(ai): validate sprint 9 cloud schema and rls | Sprint 9 | cerrado validado | Migración cloud dev y RLS negativa cross-tenant |
| e173e0e | fix(ai): resolve sonar quality gate findings | Sprint 9 | cerrado validado | Hallazgos Sonar de Core AI corregidos |

## 5. Siguiente Sprint

- Sprint: Sprint 10.
- Objetivo: crear Task como módulo ejemplo de app final, páginas públicas mínimas reemplazables, help center base, command palette y documentación demo.
- Dependencias: Sprints 2, 3, 4 y 5 completados.
- Verificaciones requeridas: full triad tests, Playwright E2E, boundaries de módulo demo y documentación demo.
- Archivos objetivo: `src/web/modules/task/`, `src/app/(public)/`, `docs/demo/`, `src/framework/help/`, `src/framework/commands/`.
- Tests/comandos previstos: reference module tests, Playwright E2E y docs review.

## 6. Verificaciones y decisiones

| Item | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Aprobación de Plan | aprobada | antes de Sprint 1 | frase literal `Apruebo el plan.` |
| Sprint 1 | completado | antes de Sprint 2 | `npm run check`, `npm audit --audit-level=moderate`, secret scan, `git diff --check` |
| Sprint 2 | completado | antes de Sprint 3 | `npm run check`, `npm audit --audit-level=moderate`, `npm run test:e2e`, capturas 375/768/1920 |
| Sprint 3 permisos/RLS/RBAC | completado local | antes de Sprint 4 | SQL versionado, RLS estático, bootstrap, contratos, sin cloud |
| Sprint 4 auth/sesiones/RBAC efectivo | completado local | antes de Build Sprint 4 | frase literal `apruebo continuar con el sprint 4`; `npm run check`; `npm run test:e2e`; SQL versionado |
| Sprint 5 factory/grid/relaciones | completado local | antes de Sprint 6 | contratos Zod, guards de límite/allowlist/ownership, DataGrid, Playwright |
| Sprint 6 billing/pagos/webhooks | completado local | antes de Sprint 7 | contratos Zod, webhook HMAC, Stripe mock, SQL versionado, PDF mínimo |
| Sprint 7 storage/documentos/shared | completado local | antes de Sprint 8 | contratos Zod, MIME/size, signed URL intent, consent auditable, SQL versionado, pg_cron purge |
| Sprint 8 eventos/jobs/import-export | completado local | antes de Sprint 9 | contratos Zod, idempotency, SSRF guard, HMAC/replay, SQL versionado, pg_cron schedule |
| MCP Supabase/SonarQube | preparado/deshabilitado | turno dedicado | `.mcp.json` local sin secretos inline; falta autenticación/conexión explícita |
| Fase 1 validación local | aprobada | antes de commit Fase 1 | `npm run check`, `npm audit --audit-level=moderate`, `npm run test:e2e`, `git diff --cached --check` |
| Supabase cloud dev | cloud dev operativo | Sprint 9 schema/RLS | 6 migraciones remotas incluyendo `20260622222347`; `ai_models` y `ai_budgets` existen con RLS; RLS negativa cross-tenant `visible_cross_tenant=0` |
| Supabase CLI linked | bloqueada sin access token | validación CLI directa | `SUPABASE_ACCESS_TOKEN` está vacío; conexión directa por `SUPABASE_DIRECT_CONNECTION_STRING` funciona |
| GitHub Actions | aprobada | cierre Fase 1 | run `27921644951` passed en `main`; run previo `27921449589` falló por npm 10 y quedó corregido |
| SonarQube baseline | aprobada con limitación | cierre Fase 1 | scanner `ANALYSIS SUCCESSFUL`, dashboard `https://sonarqube.innvenia.ai/dashboard?id=fromzero-framework`; API de métricas 401 sin token |
| GitHub Sonar config | aprobada | antes de push Fase 1 | variable `SONARQUBE_URL` y secret `SONARQUBE_TOKEN` presentes; workflow usa ambos |
| FromZero artifact checker | no bloqueante | antes de cierre Fase 1 | falla solo por `.codex/plugins/fromzero/templates/*`, fuera de alcance de esta Fase |
| OpenRouter ID | cerrado validado | Sprint 9 | `google/gemma-4-26b-a4b-it:free` revalidado contra OpenRouter oficial |
| Sprint 9 Core AI/schema/RLS | cerrado validado | antes de Sprint 10 | contratos TS, Pydantic/FastAPI, adapter OpenRouter mockeable, redaction, budgets, SQL versionado; migración cloud aplicada; `public.ai_models`/`public.ai_budgets` verificadas; RLS cross-tenant negativa pasada |
| Advisory RLS global `settings`/`modules`/`plans` | diferido aceptado | antes de Sprint 10 | dueño aprobó documentar sin migración; tablas documentadas como globales sin `tenant_id`, con deuda de access-control/RLS para hardening |
| PR pre-Sprint 10 | en preparación | antes de Sprint 10 | rama `codex/pre-sprint-10-readiness`, CI verde, working tree limpio y PR creado |
| Servicios cloud | pendiente | Sprint que los use | aprobación por servicio |
| Migraciones cloud | pendiente | Sprint que las ejecute | aprobación antes de ejecutar |
| Billing real | pendiente | Sprint 6 | aprobación antes de provider real |
| Legal comercial | pendiente | Sprint 12 | revisión legal externa |

## 6.1 Historial de aprobaciones

| Artefacto | Estado | Fecha | Frase literal | Commit |
|---|---|---|---|---|
| `artifacts/FROMZERO_QUESTIONNAIRE.md` | aprobado | 2026-06-18 | Apruebo el cuestionario. | 4c960be |
| `artifacts/FROMZERO_SPEC.md` | aprobado | 2026-06-18 | Apruebo el plan. | 7b35435 |
| `artifacts/adr/001-data-auth-rls-rbac.md` | aprobado | 2026-06-18 | Apruebo el plan. | 7b35435 |
| `artifacts/adr/003-integrations-jobs-cache.md` | aprobado | 2026-06-18 | Apruebo el plan. | 7b35435 |
| `artifacts/adr/005-core-ai-openrouter.md` | aprobado | 2026-06-18 | Apruebo el plan. | 7b35435 |
| `artifacts/FROMZERO_PLAN.md` | aprobado | 2026-06-18 | Apruebo el plan. | 7b35435 |
| Sprint 4 | aprobado | 2026-06-19 | apruebo continuar con el sprint 4 | b1bc9a4 |
| Sprint 5 | aprobado | 2026-06-19 | apruebo ejecución de sprint 5. | f7b3b86 |
| Sprint 6 | aprobado | 2026-06-19 | apruebo sprint 6 | 66b458e |
| Sprint 7 | aprobado | 2026-06-19 | aprobar inicio sprint 7 | bf4478c |
| Sprint 8 | aprobado | 2026-06-19 | aprubo iniciar sprint 8 | c124575 |

## 6.2 Compatibilidad de estados y aprobaciones

| Tipo | Valor legacy aceptado | Valor canónico | Tratamiento |
|---|---|---|---|
| Estado | aprobada | aprobado | Normalizar y reportar drift. |
| Estado | actualizado en revision | listo para revisión | Normalizar y reportar drift. |
| Estado | plan actualizado en revision | listo para revisión | Normalizar y reportar drift. |
| Estado | en ejecucion | en ejecución | Normalizar y reportar drift. |
| Estado | aprobado con correcciones | requiere re-aprobación | Requiere nueva aprobación antes de Build. |
| Estado | ajustada para revision con invariantes documentales | requiere re-aprobación | Requiere nueva aprobación antes de Build. |
| Aprobación | Apruebo iniciar la ejecución del proyecto | Apruebo el plan | Alias de compatibilidad; registrar frase literal y normalizar internamente. |
| Aprobación | Apruebo el plan actualizado | Apruebo el plan | Variante válida si aprueba el plan vigente; registrar frase literal y normalizar internamente. |
| Aprobación | Apruebo el plan actualizado para iniciar la ejecucion del proyecto | Apruebo el plan | Alias de compatibilidad; registrar frase literal y normalizar internamente. |
| Aprobación | Variación clara equivalente | Apruebo el plan | Aceptar solo si aprueba explícitamente el plan vigente; pedir confirmación si es ambigua, condicional o parcial. |

## 7. Bloqueos y riesgos

- Bloqueos actuales: no iniciar Sprint 10 hasta cerrar PR pre-Sprint 10 con CI verde y working tree limpio.
- Riesgos activos: storage/purga física, billing/webhooks, Core AI/OpenRouter, jobs automatizados pg_cron/Inngest, import/export real, performance FCP/LCP/API p95, revisión legal, advisory RLS global documentado sin fix.
- Decisiones abiertas: activación MCP, observabilidad concreta por app derivada, Redis activo, legal final, servicios cloud reales y OpenRouter real.
- Secretos o accesos requeridos: ninguno adicional para conexión directa Supabase; serán requeridos por Sprint con aprobación separada.
- Estado de aprobación humana requerido: requerido para provider real, Inngest cloud, email/webhook real o purga real.

## 8. Próxima acción

Cerrar PR pre-Sprint 10. Sprint 10 no iniciado.

No activar OpenRouter real, purgas reales, proveedores reales, MCP ni migraciones RLS nuevas sin aprobación separada.

## 9. Reglas de actualización

- Crear este archivo al crear `artifacts/FROMZERO_PLAN.md`; actualizarlo al aprobar plan, iniciar Sprint, completar Sprint, bloquear Sprint, cambiar verificaciones o hacer handoff.
- No registrar secretos reales, tokens, llaves, dumps ni contenido de `.env`.
- Si este archivo falta o parece desactualizado, reconstruirlo desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`, explicar la inferencia y pedir confirmación antes de ejecutar cambios.
- Si un artefacto aprobado cambia por corrección, actualización o reconciliación, actualizar su estado a `requiere re-aprobación`, registrar cambio, fecha y frase literal cuando el usuario lo apruebe otra vez.
- Las actualizaciones del plugin no deben reescribir artefactos `FROMZERO_*` aprobados; deben reportar drift y esperar aprobación explícita.
