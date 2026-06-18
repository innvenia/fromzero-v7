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
- Commit automático: hash corto + mensaje completo, o razón concreta si no se creó

## Verificaciones

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

## Issues

## Siguientes pasos

- Aprobación necesaria:
- Artefactos para revisar:
- Siguiente paso para ti:
