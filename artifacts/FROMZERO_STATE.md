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
| Historial de estados | 2026-06-18: creado junto con Plan tras aprobación explícita de Spec; 2026-06-18: Plan/Spec/ADR corregidos por Task path, pg_cron y FCP, requiere re-aprobación; 2026-06-18: propagados ajustes Core AI, auditoría, RBAC, rules e integraciones a Spec/Plan/ADRs, requiere re-aprobación; 2026-06-18: plan vigente aprobado explícitamente, Sprint 1 pendiente de confirmación pre-código; 2026-06-18: Sprint 1 iniciado por aprobación explícita del usuario; 2026-06-18: Sprint 1 completado sin commit automático por cambio previo ajeno en `artifacts/START_HERE.md`; 2026-06-18: commit de Sprint 1 solicitado explícitamente por el usuario |
| Aprobación del usuario | no aplica |
| Fecha de aprobación | no aplica |
| Frase literal de aprobación | no aplica |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md` creado |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/adr/`, Git |
| Artefactos derivados o relacionados | `artifacts/handoffs/`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado | commit de Sprint 1 solicitado explícitamente; hash reportado en cierre |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Resumen para el dueño

- Estado actual: Sprint 1 completado.
- Último avance: estructura base, `.env.example`, inventario API, lockfile npm y verificaciones creadas.
- Sprint actual: ninguno en ejecución.
- Siguiente acción: revisar cierre y aprobar Sprint 2 si corresponde.
- Bloqueos o riesgos: `artifacts/START_HERE.md` contiene un cambio previo ajeno y queda fuera del commit de Sprint 1.
- Qué necesita decidir o aprobar el dueño: confirmar si se debe continuar con Sprint 2 o corregir algo de Sprint 1.

## 1. Estado general

- Estado del proyecto: build.
- Plugin FromZero runtime: fallback desde workspace local `.codex/plugins/fromzero`.
- Cuestionario: aprobado.
- Spec: aprobada.
- Plan: aprobado.
- ADRs afectados: 001, 003 y 005 aprobados.
- Git: inicializado.
- Branch: `main`.
- Working tree: commit de Sprint 1 en preparación; `artifacts/START_HERE.md` contiene un cambio previo ajeno fuera de alcance.
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
- Estado: Sprint 1 completado.
- Objetivo completado: preparación, base inicial, estructura, placeholders, inventario API y verificaciones.
- Fuente en plan: `artifacts/FROMZERO_PLAN.md` -> `### Sprint 1 - Preparación y base inicial`.
- Commit asociado: commit de cierre solicitado por el usuario.

## 4. Último Sprint completado

- Sprint: Sprint 1.
- Fecha: 2026-06-18.
- Evidencia: `package.json`, `package-lock.json`, `.env.example`, `README.md`, `tsconfig.json`, `docs/API_ENDPOINT_INVENTORY.md`, estructura `src/`, `core-ai/`, `supabase/migrations/`, `public/` y `tests/`.
- Tests/comandos: `node --version` -> `v24.13.1`; `npm --version` -> `11.14.0`; `npm install --ignore-scripts`; `npm run check`; `npm audit --audit-level=moderate`; `git diff --check`; secret scan con `rg`.
- Commit: creado por solicitud explícita posterior al cierre; hash reportado en respuesta del agente.

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

## 5. Siguiente Sprint

- Sprint: Sprint 2.
- Objetivo: crear base Next.js App Router, TypeScript strict, Tailwind v4, UI FromZero, i18n es/en, shell operacional, navegación, layout y pruebas visuales iniciales.
- Dependencias: Sprint 1 completado; revisar working tree antes de iniciar por cambio previo ajeno en `artifacts/START_HERE.md`.
- Verificaciones requeridas: UI responsive, Playwright 375/768/1920, sin marcas/deuda UI heredada, tokens centralizados, controles accesibles.
- Archivos objetivo: `src/app/`, `src/web/`, `src/framework/ui/`, `src/framework/theme/`, `messages/`, `tests/e2e/`.
- Tests/comandos previstos: `npm run lint` si se configura, `npm run typecheck`, `npm run build`, `npx playwright test`, verificación visual.

## 6. Verificaciones y decisiones

| Item | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Aprobación de Plan | aprobada | antes de Sprint 1 | frase literal `Apruebo el plan.` |
| Confirmación pre-código Sprint 1 | aprobada | antes de modificar código | frase literal `Apruebo el plan. Ejecuta el siguiente Sprint aprobado` |
| Sprint 1 | completado | antes de Sprint 2 | `npm run check`, `npm audit --audit-level=moderate`, secret scan, `git diff --check` |
| Commit Sprint 1 | creado por solicitud explícita | cierre Sprint 1 | `artifacts/START_HERE.md` queda fuera por cambio previo ajeno |
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

- Bloqueos actuales: `artifacts/START_HERE.md` mantiene un cambio previo ajeno; Sprint 2 requiere revisar working tree antes de iniciar.
- Riesgos activos: RLS/RBAC, billing/webhooks, Core AI/OpenRouter, jobs automatizados pg_cron/Inngest, import/export, performance FCP/LCP/API p95, revisión legal.
- Decisiones abiertas: activación MCP, observabilidad concreta por app derivada, Redis activo, legal final, servicios cloud reales.
- Secretos o accesos requeridos: ninguno para revisar Plan; serán requeridos por Sprint con aprobación separada.
- Estado de aprobación humana requerido: aprobar continuar a Sprint 2 o pedir correcciones de Sprint 1.

## 8. Próxima acción

Revisar el cierre de Sprint 1 y decidir si se corrige algo o se continúa con Sprint 2.

Frase recomendada para continuar:

```text
Apruebo continuar con Sprint 2.
```

También es válido reanudar con esta frase si el cierre de Sprint 1 queda aceptado:

```text
Continua con la ejecucion del proyecto.
```

Antes de iniciar Sprint 2, revisar el working tree porque `artifacts/START_HERE.md` contiene un cambio previo ajeno fuera del commit de Sprint 1.

## 9. Reglas de actualización

- Crear este archivo al crear `artifacts/FROMZERO_PLAN.md`; actualizarlo al aprobar plan, iniciar Sprint, completar Sprint, bloquear Sprint, cambiar verificaciones o hacer handoff.
- No registrar secretos reales, tokens, llaves, dumps ni contenido de `.env`.
- Si este archivo falta o parece desactualizado, reconstruirlo desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`, explicar la inferencia y pedir confirmación antes de ejecutar cambios.
- Si un artefacto aprobado cambia por corrección, actualización o reconciliación, actualizar su estado a `requiere re-aprobación`, registrar cambio, fecha y frase literal cuando el usuario lo apruebe otra vez.
- Las actualizaciones del plugin no deben reescribir artefactos `FROMZERO_*` aprobados; deben reportar drift y esperar aprobación explícita.
