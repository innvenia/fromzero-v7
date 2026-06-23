# ADR

Ruta de salida: `artifacts/adr/<slug>.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | ADR |
| Propósito o subtítulo | Decisión de arquitectura |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | borrador \| aprobado \| rechazado \| reemplazado \| requiere cambios \| requiere re-aprobación |
| Historial de estados |  |
| Aprobación del usuario | pendiente \| aprobada \| no aplica |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado o aceptado como base |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `artifacts/module-specs/` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Decisión

## Contexto

## Opciones

## Tradeoffs

## Impacto seguridad

## Impacto escalabilidad

## Resultado

Transiciones válidas: `borrador` → `aprobado` / `rechazado` / `requiere cambios`;
`requiere cambios` → nueva revisión → `aprobado`; un ADR ya `aprobado` que se invalida
pasa a `requiere re-aprobación`; si otro ADR lo sustituye, pasa a `reemplazado`. El
estado del Plan es independiente del estado de cada ADR.
