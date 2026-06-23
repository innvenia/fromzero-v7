# DEFERRED_ACTIVATIONS

Ruta de salida: `artifacts/DEFERRED_ACTIVATIONS.md`

Ledger append-only de activaciones diferidas. Registra todo lo que se construyó o
cerró sin activar contra su servicio o entorno real, para que al conectar, migrar o
activar se ejecute el checklist y se obtenga el mismo resultado.

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Activaciones Diferidas |
| Propósito o subtítulo | Ledger append-only de activaciones diferidas por Sprint |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | activo |
| Historial de estados |  |
| Aprobación del usuario | no aplica |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `artifacts/issues/` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Propósito

Cuando un Sprint se construye o cierra sin validar contra su servicio o entorno real
(por ejemplo, BD local en vez de cloud, o sin Sonar activo), la deuda no se pierde:
queda registrada aquí con su condición de activación y el checklist a ejecutar cuando
se conecte. Permite construir offline y obtener el mismo resultado al activar.

Este ledger es el registro histórico append-only de diferidos. No reemplaza la
sección de siguiente Sprint de `artifacts/FROMZERO_STATE.md`, que es operativa; cada
diferido debe quedar coherente entre ambos: misma razón y misma condición.

## Reglas de registro

- Append-only: nunca se borra ni se reescribe una fila; se agrega una nueva o se
  cambia su `estado` cuando se activa o se cancela con razón.
- Se crea una entrada al cerrar un Sprint cuando exista una condición de activación
  no cumplida: servicio cloud no listo, gate externo no aprobado o línea de trabajo
  offline bloqueada por dependencia.
- No se crean entradas para decisiones pendientes; esas viven en
  `artifacts/FROMZERO_DECISIONS.md` y en `artifacts/FROMZERO_STATE.md`.
- Cada entrada declara la evidencia esperada al activar, para que el cierre real sea
  verificable y no quede como "activado" sin prueba.
- `fz-build` escribe o actualiza este ledger al cerrar un Sprint offline; `fz-handoff`
  y `fz-release` lo verifican antes de cerrar.

## Activaciones diferidas

| ID | Servicio o capacidad | Motivo del diferimiento | Sprint origen | Condición de activación | Checklist al activar | Evidencia esperada | Estado | Dueño |
|---|---|---|---|---|---|---|---|---|
| DA- |  |  | Sprint  |  |  |  | diferido \| en activación \| activado \| cancelado con razón |  |

## Historial

| Fecha | Cambio | ID | Autor |
|---|---|---|---|
