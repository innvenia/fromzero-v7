# FROMZERO_CONTEXT

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_CONTEXT |
| Propósito o subtítulo | Contexto crítico del proyecto y cobertura inicial del insumo |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | borrador \| listo para revisión \| aprobado \| requiere cambios \| requiere re-aprobación |
| Historial de estados |  |
| Aprobación del usuario | pendiente \| aprobada \| no aplica |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | Documentación del usuario o conversación inicial |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_QUESTIONNAIRE.md`, `artifacts/FROMZERO_SPEC.md` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Estado del contexto

- Escenario de entrada: idea documentada | idea vaga
- Ruta de construcción: framework existente | framework nuevo | app sin framework
- Decisión de UI: framework | referencia del usuario | UI generado | sin UI
- Entorno objetivo de trabajo (BD): local desechable | Supabase Local | cloud dev operativo | pendiente de decidir
- Estado Git:

## Fuentes del insumo

| Fuente | Prioridad | Tipo | Estado de lectura | Que cubre | Limitación |
|---|---:|---|---|---|---|

Si existe documentación en `docs/`, registra primero `docs/PRD.md`, luego
`docs/REFERENCE_MODULES.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`,
`docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_STRUCTURE.md`,
`docs/REFERENCE_STACK.md`, `docs/SECURITY_ASSURANCE.md`,
`docs/SCALABILITY_ASSURANCE.md`, `docs/DEPENDENCY_MATRIX.md`,
`docs/BOOTSTRAP_REFERENCE.md` y después el resto de `docs/`.

La prioridad documental explícita manda. La heurística por tipo de contenido
solo sirve para detectar fuentes adicionales posibles; no reemplaza ni excluye
fuentes declaradas por el usuario.

## Entendimiento inicial del proyecto

Antes de generar preguntas, devuelve lo entendido desde el insumo o la conversación.
Este resumen no aprueba Spec por sí solo; sirve para detectar malentendidos antes
del Q&A real.

- Problema que el proyecto intenta resolver:
- Resultado esperado por el usuario:
- Usuario objetivo:
- Usuario no objetivo:
- Casos de uso excluidos:
- Restricciones o prioridades explícitas:
- Supuestos del agente que deben validarse:

## Usuarios objetivo y no objetivo

| Tipo | Descripción | Fuente | Impacto en alcance |
|---|---|---|---|
| Usuario objetivo |  |  |  |
| Usuario no objetivo |  |  |  |

## Supuestos del agente

| Supuesto | Fuente o inferencia | Riesgo si es falso | Tratamiento |
|---|---|---|---|

## Confirmación de contexto

| Aplica confirmación humana de Context | Razón | Frase o acción requerida |
|---|---|---|
| no | Hay cuestionario crítico aprobado o habrá Q&A antes de Spec. | No agregar aprobación redundante de Context. |
| si | No hay decisiones críticas para cuestionario, pero Spec se creará desde este Context. | Confirmar: "Esto refleja mi idea; puedes continuar con la especificación." |

## Análisis crítico del insumo

### Gaps y omisiones detectados

| # | Gap | Impacto | Tratamiento (pregunta, mejora aplicada o riesgo aceptado) |
|---|---|---|---|

### Contradicciones y supuestos sin validar

| # | Item | Impacto | Tratamiento |
|---|---|---|---|

### Oportunidades de mejora antes de especificar

| # | Oportunidad | Beneficio esperado | Decisión requerida |
|---|---|---|---|

## Mejoras a la documentación inicial

| # | Mejora propuesta | Estado (propuesta, aceptada, aplicada) |
|---|---|---|

## Validación crítica

- Problema real:
- Usuario objetivo:
- Mercado y alternativas:
- Diferenciación:
- Riesgos de producto/tecnología/seguridad/operación:
- Comercialización:

## Inventario de capacidades del insumo

Lista enumerable de capacidades y funcionalidades detectadas. Debe incluir módulos,
transversales, tablas, pivotes, historiales, jobs, APIs, páginas de infraestructura,
seguridad, escalabilidad, configuración, observabilidad, i18n y accesibilidad cuando
el insumo los mencione.
Esta lista alimenta la matriz de cobertura de `artifacts/FROMZERO_SPEC.md`.

| Capacidad | Tipo | Fuente | Prioridad | Obligación | Observación |
|---|---|---|---:|---|---|

Tipos sugeridos: módulo, transversal, tabla, job, API, página infraestructura,
seguridad, escalabilidad, configuración, observabilidad, i18n, accesibilidad,
diferido documentado.

## Inventario atomico de requisitos

Descompón cada heading funcional, subheading, bullet obligatorio y fila de tabla de
las fuentes prioritarias. No agrupes sublistas internas bajo una sola capacidad.
Cada requisito debe ser trazable despues en `artifacts/FROMZERO_SPEC.md` y `artifacts/FROMZERO_PLAN.md`.

| ID | Fuente | Heading/Subheading | Requisito atomico | Dominio | Obligación | Estado | Observación |
|---|---|---|---|---|---|---|---|
| REQ- |  |  |  | auth-session / storage-files / billing-subscriptions / ui-primitives-overlays / theme-branding / grid-module-factory / custom-fields / event-bus-rules / notifications / import-export / api-errors-security / módulo / tabla / job / seguridad / escalabilidad | primer corte / release candidate / venta / posterior según docs | detectado / ambiguo / contradicción / no aplica |  |

Dominios obligatorios de revisión cuando aparezcan en el insumo: auth/session,
storage/files, billing/subscriptions, UI primitives/overlays, theme/branding,
Grid Universal/Module Factory, custom fields, event bus/rules, notifications,
import/export, API/errors/security, módulos, tablas, jobs, páginas de
infraestructura, seguridad, escalabilidad, configuración y diferidos documentados.

## Inventario de invariantes y gates

Registra reglas obligatorias que bloquean plan, ejecución o release aunque no sean
funcionalidades visibles. Incluye reglas de orden, datos reales, nomenclatura,
perímetro interno, dependencias, inventarios, performance, marcas externas y
consentimiento cuando estén documentadas.

| ID | Fuente | Regla o gate | Dominio | Obligación | Comando/gate esperado | Criterio bloqueante | Estado |
|---|---|---|---|---|---|---|---|
| GATE- |  |  | bootstrap-order / real-data-only / naming-dual-standard / internal-service-boundary / dependency-security / api-inventory / performance-budget / template-brand-sanitization / consent-records / seguridad / escalabilidad / release | primer corte / release candidate / venta / posterior según docs |  |  | detectado / ambiguo / contradicción / no aplica |

## Recomendación

- Seguir | Ajustar | Descartar:
- Razón:

## Preguntas candidatas para Q&A

Estas preguntas no reemplazan `artifacts/FROMZERO_QUESTIONNAIRE.md`. Solo preparan el Q&A real en modo plan.

| # | Pregunta | Criticidad | Por que bloquea o mejora la Spec |
|---|---|---|---|
