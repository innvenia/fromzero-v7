# Handoff

Ruta de salida: `artifacts/handoffs/<date-or-milestone>.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Handoff |
| Propósito o subtítulo | Traspaso operativo con evidencia y riesgos |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | borrador \| listo para revisión \| aprobado \| requiere cambios |
| Historial de estados |  |
| Aprobación del usuario | pendiente \| aprobada \| no aplica |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/issues/`, release notes |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Aceptación de producto

Contrastar el producto entregado contra la visión validada del humano. Esta
sección no reemplaza tests, gates ni evidencia técnica; cierra el lazo de
expectativa contra entrega.

- Visión validada de origen: `artifacts/FROMZERO_QUESTIONNAIRE.md` -> `## Resumen validado para Spec` | no aplica con razón:
- Producto entregado:
- Brechas conocidas:
- Aceptación del usuario: pendiente | aprobada | bloqueada | no aplica con razón
- Frase literal de aceptación:

| Resultado esperado | Estado | Evidencia | Brecha o razón |
|---|---|---|---|
|  | entregado / diferido con razón / no cumplido |  |  |

## Cambios

- `artifacts/FROMZERO_SPEC.md`:
- `artifacts/FROMZERO_QUESTIONNAIRE.md`:
- `artifacts/FROMZERO_PLAN.md`:

## Plan

- Commit base: confirmado | falta | no aplica
- Sprint 1 preparación/base inicial: incluido | completado | falta
- Sprints:

## Verificación

- Estado Git:
- Secretos verificados:
- Unidad visible: Sprint
- Verificación visual en navegador: ejecutada con evidencia | fallback registrado | no aplica (sin UI web)
- Activaciones diferidas: `artifacts/DEFERRED_ACTIVATIONS.md` revisado con condición y dueño | sin diferidos
- Decisiones: `artifacts/FROMZERO_DECISIONS.md` cerrado y sin respuestas sin reconciliar | no aplica
- Commit automático: hash corto + mensaje completo, o razón concreta si no se creó
- Commit bloqueado por cambios externos: escalado si | no aplica

## Fuentes verificadas

Toda afirmación de hecho externo marcada como verificada lleva su cita. Lo no verificado se
etiqueta explícitamente como no verificado, nunca como verificado.

| Afirmación | Fuente (URL) | Qué se comprobó | Fecha |
|---|---|---|---|
|  |  |  |  |

## Verificaciones

## Gate de calidad

Registrar la evidencia del gate local del Sprint y, si aplica, de SonarQube. El estándar de
calidad interno FromZero (`docs/gates.md`) aplica exista o no SonarQube.

- Comandos ejecutados: lint | typecheck | tests unitarios | coverage | build | audit | `git diff --check` | secret scan
- Pruebas: total suite __ / del Sprint __ (conteos con alcance explícito, reconciliados)
- Coverage local: global __% / new __% (mínimo 80% / 80%)
- Estándar interno FromZero: cumple | no cumple con desviación aprobada (`artifacts/FROMZERO_DECISIONS.md`)
- SonarQube: configurado si | no
  - bugs / vulnerabilities / security hotspots abiertos:
  - code smells introducidos:
  - duplicated_lines_density / new_duplicated_lines_density:
  - coverage / new coverage:
  - Quality Gate oficial: pasa | falla | no aplica
- Missing blame information: si | no | no aplica (Sonar no usado)
- Issues abiertos:
- Duplicación:
- Riesgos residuales:
- Archivos excluidos del commit o del análisis:

## Gotchas detectados

Registrar solo aprendizajes sobre la metodología o el plugin FromZero. No registrar
secretos, datos sensibles, código propietario innecesario ni bugs normales del
proyecto que no impliquen mejora metodológica.

- Archivo local: `artifacts/fromzero-feedback/GOTCHAS.md`
- Gotchas detectados: si | no
- Feedback exportable preparado: si | no
- Sanitización revisada: si | no | no aplica
- Autorización para compartir: si | no | pendiente | no aplica

## Feedback metodológico exportable

El feedback hacia el repo fuente de FromZero es manual. No hay telemetría, envío
automático ni sync desde el proyecto cliente.

- Archivo exportable: `artifacts/fromzero-feedback/fromzero-methodology-feedback.md`
- Proceso recomendado:
  1. Revisar que no incluya secretos ni información sensible.
  2. Confirmar autorización del usuario.
  3. Compartir manualmente el artefacto con el equipo FromZero.
  4. El equipo FromZero clasifica el feedback antes de modificar la metodología.

## Riesgos

## Limitaciones y bloqueos

Cada limitación o bloqueo declarado lleva su evidencia (comando + resultado o config leída).
Sin evidencia verificada se etiqueta como hipótesis no verificada, no como limitación.

| Limitación o bloqueo | Evidencia (comando + resultado) | Impacto | Estado |
|---|---|---|---|
|  |  |  |  |

## Issues

## Siguientes pasos

- Aprobación necesaria:
- Artefactos para revisar:
- Siguiente paso para ti:
