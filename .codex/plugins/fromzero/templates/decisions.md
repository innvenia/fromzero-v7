# FROMZERO_DECISIONS

Ruta de salida: `artifacts/FROMZERO_DECISIONS.md`

Ledger append-only de decisiones cerradas con su fuente. El agente lo consulta antes
de preguntar, para no re-plantear lo ya resuelto o documentado.

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Decisiones FromZero |
| Propósito o subtítulo | Ledger append-only de decisiones cerradas y su fuente |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | activo |
| Historial de estados |  |
| Aprobación del usuario | no aplica |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_CONTEXT.md` |
| Documentos o fuentes asociadas | `artifacts/FROMZERO_QUESTIONNAIRE.md`, `artifacts/FROMZERO_SPEC.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Propósito

Registro único de decisiones cerradas del proyecto: qué se decidió, su fuente, el
Sprint donde aplica y su estado. Es la base de la anti-redundancia: antes de emitir
una pregunta, el agente consulta este ledger y la documentación; si la decisión ya
está aceptada, la cita como decisión documentada asumida en vez de re-preguntarla.

## Reglas de consulta

- Fuente de solo-lectura para "consultar antes de preguntar": `fz-context` y `fz-spec`
  leen este ledger y las fuentes `docs/` antes de emitir cualquier pregunta.
- Si una decisión existe con estado `aceptada`, no se vuelve a preguntar: se cita como
  decisión documentada asumida.
- Si existe pero está `contradictoria` con una fuente o una nueva necesidad, se deriva
  a la reconciliación de respuestas del dueño en `fz-spec` antes de continuar.
- Si la decisión es nueva, se emite la pregunta y, al cerrarse, se registra aquí.
- Append-only: no se borra una fila; se cambia su `estado` cuando se reemplaza o difiere.

## Decisiones

| ID | Decisión | Fuente | Sprint | Estado | Fecha |
|---|---|---|---|---|---|
| DEC- |  |  | Sprint  | abierta \| aceptada \| diferida \| reemplazada |  |

## Relación con retropropagación y reconciliación

Este ledger registra lo ya cerrado (consulta). La actualización ocurre por dos
mecanismos que deben aplicarse en el mismo cambio que modifica una decisión: la
retropropagación de decisiones (cuando spec, plan o ejecución cambia una respuesta del
cuestionario) y la reconciliación de respuestas del dueño en `fz-spec` (cuando una
respuesta requiere normalización o aprobación explícita). Nunca debe haber dos
artefactos vigentes con decisiones opuestas.
