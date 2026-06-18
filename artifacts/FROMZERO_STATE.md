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
| Estado actual | requiere re-aprobación |
| Historial de estados | 2026-06-18: creado junto con Plan tras aprobación explícita de Spec; 2026-06-18: Plan/Spec/ADR corregidos por Task path, pg_cron y FCP, requiere re-aprobación |
| Aprobación del usuario | no aplica |
| Fecha de aprobación | no aplica |
| Frase literal de aprobación | no aplica |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md` creado |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/adr/`, Git |
| Artefactos derivados o relacionados | `artifacts/handoffs/`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Resumen para el dueño

- Estado actual: Spec, ADR 003 y Plan corregidos; requieren re-aprobación.
- Último avance: corrección documental de Task path, modelo dual pg_cron/Inngest y FCP.
- Sprint actual: Sprint 1 pendiente, no iniciado.
- Siguiente acción: revisar y re-aprobar Spec/ADR/Plan corregidos.
- Bloqueos o riesgos: Build bloqueado hasta re-aprobación explícita; servicios externos y secretos requieren autorización separada.
- Qué necesita decidir o aprobar el dueño: responder una aprobación explícita del plan corregido si el Plan vigente es correcto.

## 1. Estado general

- Estado del proyecto: plan.
- Plugin FromZero runtime: fallback desde workspace local `.codex/plugins/fromzero`.
- Cuestionario: aprobado.
- Spec: requiere re-aprobación.
- Plan: requiere re-aprobación.
- Git: inicializado.
- Branch: `main`.
- Working tree: corrección documental en curso hasta commit.
- Commit base: `88c9a19 docs(fromzero): align pre-spec documentation`.
- Último commit FromZero: `81505b7 docs(fromzero): create implementation plan and state`.

## 2. Artefactos vigentes

- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Contexto: `artifacts/FROMZERO_CONTEXT.md`.
- Spec: `artifacts/FROMZERO_SPEC.md`.
- Diseño técnico: `artifacts/adr/`; `artifacts/adr/003-integrations-jobs-cache.md` requiere re-aprobación.
- Plan: `artifacts/FROMZERO_PLAN.md`.
- Recursos instalados: plugin local FromZero en `.codex/plugins/fromzero`.
- Lockfile FromZero: pendiente; crear `.fromzero/fromzero.lock.json` solo si se instalan recursos en Sprint 1.

## 3. Sprint actual

- Sprint actual: Sprint 1.
- Estado: pendiente.
- Objetivo: preparación, base inicial, estructura, placeholders, inventario API y verificaciones.
- Fuente en plan: `artifacts/FROMZERO_PLAN.md` -> `### Sprint 1 - Preparación y base inicial`.
- Commit asociado: pendiente; Sprint no iniciado.

## 4. Último Sprint completado

- Sprint: ninguno.
- Fecha: no aplica.
- Evidencia: no aplica.
- Tests/comandos: no aplica.
- Commit: no aplica.

## 4.1 Commits previos relevantes

| Hash corto | Mensaje completo | Fase o Sprint | Estado de fase | Razón de referencia |
|---|---|---|---|---|
| 2d10842 | chore: initialize project repository | Init | cerrado | Git base inicial |
| abc3a3e | docs(fromzero): add project context analysis | Context | cerrado | Contexto FromZero |
| 207a3ff | docs(fromzero): add answered questionnaire | Questionnaire | cerrado | Cuestionario respondido |
| c680921 | docs(fromzero): correct questionnaire decisions | Questionnaire | cerrado | Correcciones documentales |
| 4c960be | docs(fromzero): define project specification | Spec | cerrado | Spec creada |
| 88c9a19 | docs(fromzero): align pre-spec documentation | Spec | cerrado/inferido | Documentación pre-spec detectada en Git |

## 5. Siguiente Sprint

- Sprint: Sprint 1.
- Objetivo: preparar base inicial antes de escribir código de aplicación.
- Dependencias: aprobación explícita del Plan.
- Verificaciones requeridas: no secretos, no `.env`, versiones oficiales, estructura objetivo, `.env.example`, inventario API.
- Archivos objetivo: `package.json`, lockfile npm, `.env.example`, `docs/API_ENDPOINT_INVENTORY.md`, estructura base, `artifacts/FROMZERO_STATE.md`.
- Tests/comandos previstos: `git status --short`, `npm --version`, `node --version`, `npm install`, `npm run typecheck` si existe, secret scan.

## 6. Verificaciones y decisiones

| Item | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Aprobación de Plan | pendiente | antes de Sprint 1 | frase literal del usuario |
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
| `artifacts/FROMZERO_SPEC.md` | requiere re-aprobación | pendiente | pendiente | pendiente |
| `artifacts/adr/003-integrations-jobs-cache.md` | requiere re-aprobación | pendiente | pendiente | pendiente |
| `artifacts/FROMZERO_PLAN.md` | requiere re-aprobación | pendiente | pendiente | pendiente |

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

- Bloqueos actuales: Spec/ADR/Plan corregidos requieren re-aprobación antes de Build.
- Riesgos activos: RLS/RBAC, billing/webhooks, Core AI/OpenRouter, jobs automatizados pg_cron/Inngest, import/export, performance FCP/LCP/API p95, revisión legal.
- Decisiones abiertas: activación MCP, observabilidad concreta por app derivada, Redis activo, legal final, servicios cloud reales.
- Secretos o accesos requeridos: ninguno para revisar Plan; serán requeridos por Sprint con aprobación separada.
- Estado de aprobación humana requerido: re-aprobar Plan corregido antes de Sprint 1.

## 8. Próxima acción

Frase recomendada:

```text
Apruebo el plan.
```

También es válido `Apruebo el plan actualizado` o una variación clara equivalente cuando el plan vigente fue corregido o reemplazado. Registrar siempre la frase literal.

Después de aprobado el plan, esta frase reanuda el siguiente Sprint:

```text
Continua con la ejecucion del proyecto.
```

## 9. Reglas de actualización

- Crear este archivo al crear `artifacts/FROMZERO_PLAN.md`; actualizarlo al aprobar plan, iniciar Sprint, completar Sprint, bloquear Sprint, cambiar verificaciones o hacer handoff.
- No registrar secretos reales, tokens, llaves, dumps ni contenido de `.env`.
- Si este archivo falta o parece desactualizado, reconstruirlo desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`, explicar la inferencia y pedir confirmación antes de ejecutar cambios.
- Si un artefacto aprobado cambia por corrección, actualización o reconciliación, actualizar su estado a `requiere re-aprobación`, registrar cambio, fecha y frase literal cuando el usuario lo apruebe otra vez.
- Las actualizaciones del plugin no deben reescribir artefactos `FROMZERO_*` aprobados; deben reportar drift y esperar aprobación explícita.
