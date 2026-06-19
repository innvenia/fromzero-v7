# FROMZERO_STATE

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_STATE |
| Propósito o subtítulo | Estado operativo central para reanudar ejecución |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-19 |
| Estado actual | activo |
| Historial de estados | 2026-06-18: creado junto con Plan tras aprobación explícita de Spec; 2026-06-18: Plan/Spec/ADR corregidos por Task path, pg_cron y FCP, requiere re-aprobación; 2026-06-18: propagados ajustes Core AI, auditoría, RBAC, rules e integraciones a Spec/Plan/ADRs, requiere re-aprobación; 2026-06-18: plan vigente aprobado explícitamente, Sprint 1 pendiente de confirmación pre-código; 2026-06-18: Sprint 1 iniciado por aprobación explícita del usuario; 2026-06-18: Sprint 1 completado; 2026-06-18: Sprint 2 iniciado por solicitud `continua con el siguiente sprint`; 2026-06-18: Sprint 2 completado y commiteado; 2026-06-18: Sprint 3 iniciado por solicitud literal `ejecuta sprint 3`; 2026-06-18: Sprint 3 completado localmente con migración SQL versionada, bootstrap, contratos Zod, health API y pruebas; 2026-06-18: `.mcp.json` local preparado para Supabase y SonarQube con servidores deshabilitados y sin secretos inline; 2026-06-18: SonarQube MCP alineado a Docker stdio sin token inline; 2026-06-18: Supabase MCP alineado a npx stdio en modo read-only sin token inline; 2026-06-19: Sprint 4 iniciado por aprobación explícita del usuario; 2026-06-19: Sprint 4 completado localmente con auth/RBAC/API keys, migración SQL versionada, contratos Zod y pruebas |
| Aprobación del usuario | aprobada para Sprint 4 |
| Fecha de aprobación | 2026-06-19 |
| Frase literal de aprobación | apruebo continuar con el sprint 4 |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md` aprobado |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/adr/`, Git |
| Artefactos derivados o relacionados | `artifacts/handoffs/`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado | Sprint 1: `6d158ff chore(fromzero): completa sprint 1 base inicial`; Sprint 2: `1133fad feat(shell): add localized app shell`; Sprint 3: `b57c807 feat(db): add foundation schema and bootstrap`; Sprint 4: pendiente de commit de implementación; MCP config: commits `chore(mcp): prepare local server config`, `chore(mcp): align sonarqube server config`, `chore(mcp): align supabase server config` |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Sin migraciones cloud. MCP preparado pero deshabilitado. |

## Resumen para el dueño

- Estado actual: Sprint 4 completado localmente.
- Último avance: auth Supabase SSR, tenant context, RBAC server-side, módulos user/profile/invitation/API key, migración SQL y pruebas.
- Sprint actual: Sprint 4 cerrado localmente.
- Siguiente acción: preparar Sprint 5 cuando el dueño solicite continuar.
- Bloqueos o riesgos: migración Sprint 4 no fue aplicada contra Supabase local/cloud; MCP preparado pero no autenticado ni conectado.
- Qué necesita decidir o aprobar el dueño: aplicar migraciones reales o activar MCP requiere aprobación separada.

## 1. Estado general

- Estado del proyecto: build.
- Plugin FromZero runtime: fallback desde workspace local `.codex/plugins/fromzero`.
- Cuestionario: aprobado.
- Spec: aprobada.
- Plan: aprobado.
- ADRs afectados: 001, 003 y 005 aprobados.
- Git: inicializado.
- Branch: `main`.
- Working tree: validar con `git status --short` antes de continuar.
- Commit base antes de MCP config: `b57c807 feat(db): add foundation schema and bootstrap`.
- Último commit FromZero: pendiente de commit Sprint 4.

## 2. Artefactos vigentes

- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Contexto: `artifacts/FROMZERO_CONTEXT.md`.
- Spec: `artifacts/FROMZERO_SPEC.md`.
- Diseño técnico: `artifacts/adr/`.
- Plan: `artifacts/FROMZERO_PLAN.md`.
- Recursos instalados: plugin local FromZero en `.codex/plugins/fromzero`.
- Lockfile FromZero: no creado; no se instalaron recursos FromZero empaquetados.

## 3. Sprint actual

- Sprint actual: Sprint 4.
- Estado: completado localmente.
- Objetivo completado: auth email/password, MFA configurable, tenant context seguro, usuarios, membresías, perfiles, roles, permisos, invitaciones y API keys.
- Fuente en plan: `artifacts/FROMZERO_PLAN.md` -> `### Sprint 4 - Auth, tenant context, RBAC y API keys`.
- Commit asociado: pendiente de cierre.

## 4. Último Sprint completado

- Sprint: Sprint 4.
- Fecha: 2026-06-19.
- Evidencia: `supabase/migrations/20260619000400_auth_rbac_api_keys.sql`, `src/framework/auth/`, `src/framework/modules/{user,profile,invitation,api-key}/`, `src/framework/api/contracts.ts`, `tests/unit/{auth-context,api-key,sprint4-contracts,sprint4-sql}.test.ts`, `artifacts/test-plans/sprint-4.md`.
- Tests/comandos: `npm run check`; `npm audit --audit-level=moderate`; `git diff --check`; `npm run test:e2e`; secret scan sin patrones de secretos reales.
- Limitación: `supabase` CLI existe como devDependency local `2.107.0`, pero no se ejecutó `supabase db reset`, migración cloud ni MCP.
- Verificación visual: no aplica; Sprint 4 no cambió UI visual. E2E existente pasó.
- Commit: pendiente de cierre.

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

## 5. Siguiente Sprint

- Sprint: Sprint 5.
- Objetivo: construir contratos del Module Factory, Grid Universal, filtros guardados, custom fields, record relationships y patrones CRUD reutilizables.
- Dependencias: Sprints 3 y 4 completados.
- Verificaciones requeridas: no queries sin límite, ownership validado, módulos respetan allowlist.
- Archivos objetivo: `src/framework/factory/`, `src/framework/grid/`, `src/framework/relationships/`, `src/framework/modules/filter/`, `src/framework/modules/custom-field/`.
- Tests/comandos previstos: factory tests, grid tests, validation tests, relation tests, Playwright para tablas.

## 6. Verificaciones y decisiones

| Item | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Aprobación de Plan | aprobada | antes de Sprint 1 | frase literal `Apruebo el plan.` |
| Sprint 1 | completado | antes de Sprint 2 | `npm run check`, `npm audit --audit-level=moderate`, secret scan, `git diff --check` |
| Sprint 2 | completado | antes de Sprint 3 | `npm run check`, `npm audit --audit-level=moderate`, `npm run test:e2e`, capturas 375/768/1920 |
| Sprint 3 permisos/RLS/RBAC | completado local | antes de Sprint 4 | SQL versionado, RLS estático, bootstrap, contratos, sin cloud |
| Sprint 4 auth/sesiones/RBAC efectivo | completado local | antes de Build Sprint 4 | frase literal `apruebo continuar con el sprint 4`; `npm run check`; `npm run test:e2e`; SQL versionado |
| MCP Supabase/SonarQube | preparado/deshabilitado | turno dedicado | `.mcp.json` local sin secretos inline; falta autenticación/conexión explícita |
| OpenRouter ID | pendiente | Sprint 9 | revalidación del modelo exacto |
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
| Sprint 4 | aprobado | 2026-06-19 | apruebo continuar con el sprint 4 | pendiente de cierre |

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

- Bloqueos actuales: ninguno para Sprint 4 local; MCP requiere activación explícita separada.
- Riesgos activos: RLS/RBAC real pendiente de ejecución en Supabase, billing/webhooks, Core AI/OpenRouter, jobs automatizados pg_cron/Inngest, import/export, performance FCP/LCP/API p95, revisión legal.
- Decisiones abiertas: activación MCP, observabilidad concreta por app derivada, Redis activo, legal final, servicios cloud reales.
- Secretos o accesos requeridos: ninguno para revisar Sprint 4; serán requeridos por Sprint con aprobación separada.
- Estado de aprobación humana requerido: no requerido para el alcance local de Sprint 4 ya completado.

## 8. Próxima acción

Preparar Sprint 5 cuando el dueño solicite continuar.

No aplicar migraciones cloud ni activar MCP sin aprobación separada.

## 9. Reglas de actualización

- Crear este archivo al crear `artifacts/FROMZERO_PLAN.md`; actualizarlo al aprobar plan, iniciar Sprint, completar Sprint, bloquear Sprint, cambiar verificaciones o hacer handoff.
- No registrar secretos reales, tokens, llaves, dumps ni contenido de `.env`.
- Si este archivo falta o parece desactualizado, reconstruirlo desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`, explicar la inferencia y pedir confirmación antes de ejecutar cambios.
- Si un artefacto aprobado cambia por corrección, actualización o reconciliación, actualizar su estado a `requiere re-aprobación`, registrar cambio, fecha y frase literal cuando el usuario lo apruebe otra vez.
- Las actualizaciones del plugin no deben reescribir artefactos `FROMZERO_*` aprobados; deben reportar drift y esperar aprobación explícita.
