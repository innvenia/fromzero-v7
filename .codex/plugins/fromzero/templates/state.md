# FROMZERO_STATE

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_STATE |
| Propósito o subtítulo | Estado operativo central para reanudar ejecución |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | activo \| requiere cambios \| bloqueado \| requiere re-aprobación |
| Historial de estados |  |
| Aprobación del usuario | no aplica |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md` creado |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, Git |
| Artefactos derivados o relacionados | `artifacts/handoffs/`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Resumen para el dueño

Completar en lenguaje no técnico. Esta sección resume dónde está el proyecto sin
exigir leer todas las tablas operativas; no reemplaza el estado detallado, los
commits ni los gates.

- Estado actual:
- Último avance:
- Sprint actual:
- Siguiente acción:
- Bloqueos o riesgos:
- Qué necesita decidir o aprobar el dueño:

## 1. Estado general

- Estado del proyecto: contexto | cuestionario | spec | plan | ejecución | release | bloqueado
- Plugin FromZero runtime: cargado | fallback desde workspace | ausente
- Cuestionario: inexistente | en progreso | listo para revisión | aprobado | requiere cambios
- Spec: inexistente | borrador | aprobada | requiere cambios
- Plan: inexistente | borrador | actualizado en revisión | aprobado | requiere cambios
- Git:
- Branch:
- Working tree:
- Commit base:
- Entorno objetivo de trabajo (BD): local desechable | Supabase Local | cloud dev operativo
- Último commit FromZero: hash corto + mensaje completo

## 2. Artefactos vigentes

- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`
- Contexto: `artifacts/FROMZERO_CONTEXT.md`
- Spec: `artifacts/FROMZERO_SPEC.md`
- Plan: `artifacts/FROMZERO_PLAN.md`
- Recursos instalados:
- Lockfile FromZero:

## 3. Sprint actual

- Sprint actual:
- Estado: pendiente | en ejecución | completado | bloqueado | requiere cambios
- Tipo de cierre: no cerrado | cerrado validado | cerrado localmente | contrato implementado, integración pendiente | bloqueado por gate externo
- Entorno validado: local desechable | Supabase Local | cloud dev operativo | producción intocable
- Objetivo:
- Resumen breve de inicio:
- Herramientas previstas:
- Fuente en plan:
- Commit asociado: hash corto + mensaje completo

## 4. Último Sprint completado

- Sprint:
- Fecha:
- Tipo de cierre: cerrado validado | cerrado localmente | contrato implementado, integración pendiente | bloqueado por gate externo
- Entorno validado: local desechable | Supabase Local | cloud dev operativo | producción intocable
- Evidencia:
- Tests/comandos:
- Commit: hash corto + mensaje completo

## 4.1 Commits previos relevantes

| Hash corto | Mensaje completo | Fase o Sprint | Estado de fase | Razón de referencia |
|---|---|---|---|---|
|  |  | Context / Questionnaire / Spec / Design / Plan / Sprint N | cerrado / inferido / pendiente |  |

Regla:
Registrar commits de fases ya cerradas al reconstruir o actualizar estado. No
intentar registrar el hash del propio `artifacts/FROMZERO_STATE.md` antes de crear el commit;
registrar el hash en la siguiente actualización segura.

## 4.2 Estados de cierre y registro de deuda

Tipo de cierre por Sprint y deuda que genera. La semántica (versionado vs verificado y
la jerarquía de entornos) está definida en `docs/methodology.md`. Esta taxonomía es
complementaria al mapa de estados canónicos de `## 6.2`: describe la calidad del cierre
del Sprint, no el estado del artefacto.

| Sprint | Tipo de cierre | Entorno validado | Dueño | Condición de activación | Sprint bloqueado | Evidencia | Ledger de activaciones |
|---|---|---|---|---|---|---|---|
|  | cerrado validado / cerrado localmente / contrato implementado, integración pendiente / bloqueado por gate externo |  |  |  |  |  | `artifacts/DEFERRED_ACTIVATIONS.md` |

Un cierre `cerrado localmente` o `bloqueado por gate externo` exige una entrada en
`artifacts/DEFERRED_ACTIVATIONS.md`. No se usa `completado` sin calificador cuando el
Sprint depende de servicios externos.

## 5. Siguiente Sprint

- Sprint:
- Objetivo:
- Resumen breve de inicio:
- Herramientas previstas:
- Dependencias:
- Verificaciones requeridas:
- Archivos objetivo:
- Tests/comandos previstos:

## 6. Verificaciones y decisiones

| Item | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Gate local del Sprint | pendiente | cierre de Sprint | lint, typecheck, tests, coverage, build, audit, `git diff --check`, secret scan |
| Estándar interno FromZero | pendiente | cierre de Sprint | coverage ≥ 80%, duplicación ≤ 3%, issues 0 o desviación aprobada |
| SonarQube y SCM blame | pendiente | si Sonar configurado | scan con archivos commiteados, sin `Missing blame information` |
|  | pendiente |  |  |

Fuentes externas verificadas (id de modelo, capacidad de API, precio, versión): cada una con
fuente (URL), qué se comprobó y fecha; lo no verificado se marca como no verificado.

| Afirmación | Fuente (URL) | Qué se comprobó | Fecha |
|---|---|---|---|
|  |  |  |  |

## 6.1 Historial de aprobaciones

| Artefacto | Estado | Fecha | Frase literal | Commit |
|---|---|---|---|---|
| `artifacts/FROMZERO_QUESTIONNAIRE.md` | pendiente |  |  |  |
| `artifacts/FROMZERO_SPEC.md` | pendiente |  |  |  |
| `artifacts/FROMZERO_PLAN.md` | pendiente |  |  |  |

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

Regla:
Los valores legacy no invalidan proyectos activos si son reconocibles. Artefactos
nuevos o re-aprobados deben usar valores canónicos.

## 7. Bloqueos y riesgos

- Bloqueos actuales (cada uno con su evidencia: comando + resultado o config leída):
- Commit bloqueado por cambios externos: escalado si | no aplica
- Riesgos activos:
- Decisiones abiertas:
- Issues abiertos o `Missing blame information` (Sonar):
- Secretos o accesos requeridos:
- Estado de aprobación humana requerido:

## 8. Próxima acción

Frase recomendada:

```text
Apruebo el plan.
```

También es válido `Apruebo el plan actualizado` o una variación clara equivalente
cuando el plan vigente fue corregido o reemplazado. Registrar siempre la frase
literal.

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
