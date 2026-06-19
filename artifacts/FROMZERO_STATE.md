# FROMZERO_STATE

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_STATE |
| Propósito o subtítulo | Estado operativo central para reanudar ejecución |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | activo |
| Historial de estados | 2026-06-18: creado junto con Plan tras aprobación explícita de Spec; 2026-06-18: Plan/Spec/ADR corregidos por Task path, pg_cron y FCP, requiere re-aprobación; 2026-06-18: propagados ajustes Core AI, auditoría, RBAC, rules e integraciones a Spec/Plan/ADRs, requiere re-aprobación; 2026-06-18: plan vigente aprobado explícitamente, Sprint 1 pendiente de confirmación pre-código; 2026-06-18: Sprint 1 iniciado por aprobación explícita del usuario; 2026-06-18: Sprint 1 completado sin commit automático por cambio previo ajeno en `artifacts/START_HERE.md`; 2026-06-18: commit de Sprint 1 solicitado explícitamente por el usuario; 2026-06-18: Sprint 2 iniciado por solicitud `continua con el siguiente sprint`; 2026-06-18: Sprint 2 completado con UI shell, i18n, Next build, Playwright y evidencia visual |
| Aprobación del usuario | no aplica |
| Fecha de aprobación | no aplica |
| Frase literal de aprobación | no aplica |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md` creado |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/adr/`, Git |
| Artefactos derivados o relacionados | `artifacts/handoffs/`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado | Sprint 1: `6d158ff chore(fromzero): completa sprint 1 base inicial`; Sprint 2: commit pendiente, hash reportado en cierre |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Resumen para el dueño

- Estado actual: Sprint 2 completado.
- Último avance: UI shell responsive, i18n es/en, App Router, Tailwind v4, Playwright y capturas visuales.
- Sprint actual: ninguno en ejecución.
- Siguiente acción: revisar cierre y aprobar Sprint 3 si corresponde.
- Bloqueos o riesgos: `artifacts/START_HERE.md` contiene un cambio previo ajeno y queda fuera del Sprint 2.
- Qué necesita decidir o aprobar el dueño: aprobar explícitamente Sprint 3 antes de migraciones, RLS/RBAC y bootstrap.

## 1. Estado general

- Estado del proyecto: build.
- Plugin FromZero runtime: fallback desde workspace local `.codex/plugins/fromzero`.
- Cuestionario: aprobado.
- Spec: aprobada.
- Plan: aprobado.
- ADRs afectados: 001, 003 y 005 aprobados.
- Git: inicializado.
- Branch: `main`.
- Working tree: Sprint 2 listo para commit; `artifacts/START_HERE.md` contiene un cambio previo ajeno fuera de alcance.
- Commit base: `7b35435 docs(fromzero): registra aprobación del plan`.
- Último commit FromZero: `7b35435 docs(fromzero): registra aprobación del plan`.

## 2. Artefactos vigentes

- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Contexto: `artifacts/FROMZERO_CONTEXT.md`.
- Spec: `artifacts/FROMZERO_SPEC.md`.
- Diseño técnico: `artifacts/adr/`; `artifacts/adr/001-data-auth-rls-rbac.md`, `artifacts/adr/003-integrations-jobs-cache.md` y `artifacts/adr/005-core-ai-openrouter.md` aprobados.
- Plan: `artifacts/FROMZERO_PLAN.md`.
- Recursos instalados: plugin local FromZero en `.codex/plugins/fromzero`.
- Lockfile FromZero: no creado; no se instalaron recursos FromZero empaquetados en Sprint 1.

## 3. Sprint actual

- Sprint actual: ninguno.
- Estado: Sprint 2 completado.
- Objetivo completado: Stack web, UI shell, i18n, navegación y pruebas visuales iniciales.
- Fuente en plan: `artifacts/FROMZERO_PLAN.md` -> `### Sprint 2 - Stack web y UI shell`.
- Commit asociado: pendiente; hash reportado en cierre.

## 4. Último Sprint completado

- Sprint: Sprint 2.
- Fecha: 2026-06-18.
- Evidencia: App Router `src/app/[locale]/`, UI shell `src/framework/ui/`, i18n `src/framework/i18n/` y `src/web/i18n/`, dashboard `src/web/dashboard/`, Playwright `tests/e2e/`, capturas `artifacts/test-plans/sprint-2-*.png`.
- Tests/comandos: `npm install --ignore-scripts`; `npm run check`; `npm audit --audit-level=moderate`; `npm run test:e2e`; `npx playwright install chromium`; capturas Playwright 375/768/1920 contra `http://127.0.0.1:3001/es`.
- Commit: pendiente; hash reportado en respuesta del agente.

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

## 5. Siguiente Sprint

- Sprint: Sprint 3.
- Objetivo: crear schema base, migraciones SQL versionadas, RLS, Tenant Zero, Super Admin, settings, modules, plans, log, tenant, rate limit base, API inventory y validación Zod.
- Dependencias: Sprint 2 completado; aprobación humana antes de migraciones cloud.
- Verificaciones requeridas: RLS tenant-aware, bootstrap one-shot, `app.mode = SaaS`, plans base, logs append-only.
- Archivos objetivo: `supabase/migrations/`, `bootstrap.json`, `src/framework/db/`, `src/framework/modules/settings/`, `src/framework/modules/module/`, `src/framework/modules/plan/`, `src/framework/modules/log/`, `src/framework/modules/tenant/`.
- Tests/comandos previstos: Supabase migration test, RLS tests, Vitest, contract tests.

## 6. Verificaciones y decisiones

| Item | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Aprobación de Plan | aprobada | antes de Sprint 1 | frase literal `Apruebo el plan.` |
| Confirmación pre-código Sprint 1 | aprobada | antes de modificar código | frase literal `Apruebo el plan. Ejecuta el siguiente Sprint aprobado` |
| Sprint 1 | completado | antes de Sprint 2 | `npm run check`, `npm audit --audit-level=moderate`, secret scan, `git diff --check` |
| Commit Sprint 1 | creado por solicitud explícita | cierre Sprint 1 | `artifacts/START_HERE.md` queda fuera por cambio previo ajeno |
| Sprint 2 | completado | antes de Sprint 3 | `npm run check`, `npm audit --audit-level=moderate`, `npm run test:e2e`, capturas 375/768/1920 |
| Sprint 3 permisos/RLS/RBAC | requiere aprobación | antes de Build Sprint 3 | confirmar ejecución de migraciones/RLS/RBAC/bootstrap |
| MCP Supabase/SonarQube | diferido | turno dedicado | aprobación explícita y tokens fuera del repo |
| OpenRouter ID | pendiente | Sprint 9 | revalidación del modelo exacto |
| Servicios cloud | pendiente | Sprint que los use | aprobación por servicio |
| Migraciones cloud | pendiente | Sprint 3 | aprobación antes de ejecutar |
| Billing real | pendiente | Sprint 6 | aprobación antes de provider real |
| Legal comercial | pendiente | Sprint 12 | revisión legal externa |

## 6.1 Historial de aprobaciones

| Artefacto | Estado | Fecha | Frase literal | Commit |
|---|---|---|---|---|
| `artifacts/FROMZERO_QUESTIONNAIRE.md` | aprobado | 2026-06-18 | Apruebo el cuestionario. | 4c960be |
| `artifacts/FROMZERO_SPEC.md` | aprobado | 2026-06-18 | Apruebo el plan. | pendiente |
| `artifacts/adr/001-data-auth-rls-rbac.md` | aprobado | 2026-06-18 | Apruebo el plan. | pendiente |
| `artifacts/adr/003-integrations-jobs-cache.md` | aprobado | 2026-06-18 | Apruebo el plan. | pendiente |
| `artifacts/adr/005-core-ai-openrouter.md` | aprobado | 2026-06-18 | Apruebo el plan. | pendiente |
| `artifacts/FROMZERO_PLAN.md` | aprobado | 2026-06-18 | Apruebo el plan. | pendiente |

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

- Bloqueos actuales: Sprint 3 requiere aprobación humana antes de migraciones/RLS/RBAC/bootstrap; `artifacts/START_HERE.md` mantiene un cambio previo ajeno fuera de alcance.
- Riesgos activos: RLS/RBAC, billing/webhooks, Core AI/OpenRouter, jobs automatizados pg_cron/Inngest, import/export, performance FCP/LCP/API p95, revisión legal.
- Decisiones abiertas: activación MCP, observabilidad concreta por app derivada, Redis activo, legal final, servicios cloud reales.
- Secretos o accesos requeridos: ninguno para revisar Plan; serán requeridos por Sprint con aprobación separada.
- Estado de aprobación humana requerido: revisar Sprint 2 y aprobar explícitamente Sprint 3 si corresponde.

## 8. Próxima acción

Revisar el cierre de Sprint 2 y decidir si se corrige algo o se continúa con Sprint 3.

Frase recomendada para continuar:

```text
Apruebo continuar con Sprint 3.
```

También es válido reanudar con esta frase si el cierre de Sprint 2 queda aceptado:

```text
Continua con la ejecucion del proyecto.
```

Antes de iniciar Sprint 3, confirmar la zona humana de permisos/RLS/RBAC y migraciones. `artifacts/START_HERE.md` contiene un cambio previo ajeno fuera de Sprint 2.

## 9. Reglas de actualización

- Crear este archivo al crear `artifacts/FROMZERO_PLAN.md`; actualizarlo al aprobar plan, iniciar Sprint, completar Sprint, bloquear Sprint, cambiar verificaciones o hacer handoff.
- No registrar secretos reales, tokens, llaves, dumps ni contenido de `.env`.
- Si este archivo falta o parece desactualizado, reconstruirlo desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`, explicar la inferencia y pedir confirmación antes de ejecutar cambios.
- Si un artefacto aprobado cambia por corrección, actualización o reconciliación, actualizar su estado a `requiere re-aprobación`, registrar cambio, fecha y frase literal cuando el usuario lo apruebe otra vez.
- Las actualizaciones del plugin no deben reescribir artefactos `FROMZERO_*` aprobados; deben reportar drift y esperar aprobación explícita.
