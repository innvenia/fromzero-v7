# FROMZERO_SPEC

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_SPEC |
| Propósito o subtítulo | Especificación verificable del proyecto |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | borrador \| listo para revisión \| aprobado \| requiere cambios \| requiere re-aprobación |
| Historial de estados |  |
| Aprobación del usuario | pendiente \| aprobada |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_CONTEXT.md`, `artifacts/FROMZERO_QUESTIONNAIRE.md` aprobado |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, ADRs de diseño técnico si aplican |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Resumen para el dueño

Completar en lenguaje no técnico. Esta sección ayuda a revisar la Spec antes de
las matrices; no reemplaza la trazabilidad, los gates ni los criterios técnicos.

- Qué se va a construir:
- Para quién:
- Resultado esperado:
- Qué queda fuera:
- Decisiones importantes ya tomadas:
- Riesgos o límites que debe conocer el dueño:
- Qué se pide aprobar:
- Visión validada usada como fuente: `artifacts/FROMZERO_QUESTIONNAIRE.md` -> `## Resumen validado para Spec` | no aplica con razón:

## Fuentes

- Documentación:
- Contexto: `artifacts/FROMZERO_CONTEXT.md`
- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`
- Referencia UI:
- Recursos de librería:

Usar backticks para rutas, archivos, comandos y nombres técnicos. Las comillas no cambian el alcance; solo identifican referencias técnicas.

## Decisiones del cuestionario

Toda decisión aprobada en `artifacts/FROMZERO_QUESTIONNAIRE.md` debe tener fila. Si una decisión contradice documentación, solo puede aplicarse con excepción explícita aprobada.

| Decisión | Fuente en cuestionario | Fuente documental | Resultado en spec | Contradicción o reducción | Excepción aprobada |
|---|---|---|---|---|---|
|  | Q000 |  |  | no | no aplica |

## Registro de cambios

Registra cualquier ajuste hecho para alinear la spec con `docs/`, contexto,
cuestionario o plan. Si la spec corrige una omisión documental, dilo aquí.
Si la spec ya estaba aprobada, cualquier cambio de alcance, matriz, decisión o
criterio cambia `Estado actual` a `requiere re-aprobación` hasta nueva aprobación
literal del usuario.

| Fecha | Cambio | Fuente o razón | Artefacto relacionado |
|---|---|---|---|
|  |  |  |  |

## Matriz de cobertura del insumo

Toda fuente y toda capacidad del inventario de `artifacts/FROMZERO_CONTEXT.md` debe tener fila.
Lo que no aparece en esta matriz no puede considerarse cerrado.

| Requisito o capacidad | Tipo | Fuente | Prioridad | Estado | Donde se cubre | Obligación |
|---|---|---|---:|---|---|---|
|  | módulo/transversal/tabla/job/API/seguridad/escala |  |  | cubierto / diferido con razón / excluido con razón | sección de esta spec | primer corte / release candidate / venta / posterior según docs |

No declares cobertura completa si una capacidad aparece en fuentes prioritarias y
no tiene fila propia. Las capacidades transversales críticas no se consideran
cubiertas solo porque el módulo macro aparezca en alcance.

## Matriz de requisitos atomicos

Todo requisito atomico de `artifacts/FROMZERO_CONTEXT.md` debe tener fila. Si la spec detecta
un requisito omitido por Context, agrega la fila, registra el cambio y no ocultes
la diferencia. No declares cobertura completa con filas agregadas como "auth",
"storage", "billing", "UI" o "grid" si la fuente detalla subrequisitos.

| ID | Requisito atomico | Dominio | Fuente | Heading/Subheading | Obligación | Estado | Donde se cubre | Diferido/excluido con fuente | Prueba o gate esperado |
|---|---|---|---|---|---|---|---|---|---|
| REQ- |  | auth-session / storage-files / billing-subscriptions / ui-primitives-overlays / theme-branding / grid-module-factory / custom-fields / event-bus-rules / notifications / import-export / api-errors-security / módulo / tabla / job / seguridad / escalabilidad |  |  | primer corte / release candidate / venta / posterior según docs | cubierto / diferido con razón / excluido con razón | sección de esta spec |  |  |

## Matriz de invariantes y gates

Toda regla obligatoria del insumo debe tener fila aunque no sea una funcionalidad.
No dejes implícitos orden de bootstrap, datos reales, naming, perímetro interno,
dependencias, inventario API, performance, limpieza de marcas o consentimientos.

| ID | Regla o gate | Dominio | Fuente | Obligación | Estado | Donde se cubre | Comando/gate esperado | Criterio bloqueante |
|---|---|---|---|---|---|---|---|---|
| GATE- |  | bootstrap-order / real-data-only / naming-dual-standard / internal-service-boundary / dependency-security / api-inventory / performance-budget / template-brand-sanitization / consent-records / seguridad / escalabilidad / release |  | primer corte / release candidate / venta / posterior según docs | cubierto / diferido con razón / excluido con razón | sección de esta spec |  |  |

## Escenario de entrada y ruta de construcción

- Escenario de entrada: idea documentada | idea vaga
- Ruta de construcción: framework existente | framework nuevo | app sin framework
- Razón de la ruta elegida:

## Validación crítica

- Problema real:
- Usuario objetivo:
- Usuario no objetivo:
- Casos de uso excluidos:
- Mercado y alternativas:
- Diferenciación:
- Modelo comercial y adquisición:
- Riesgos de producto/tecnología/operación:

## Objetivo

## Alcance

Lista verificable de lo que sí se construye en esta especificación.

## Fuera de alcance

Separar lo que no se construira de lo que queda diferido. Lo diferido debe conservar impacto arquitectonico, placeholders, condición de activación y gates.

## Usuarios y roles

## Módulos

## Datos y ownership

## Permisos y RBAC

## UI y experiencia

- Decisión de UI: framework | referencia del usuario | UI generado | sin UI
- Referencia aplicada:
- Estrategia responsive/mobile-first:
- Estrategia inicial de formularios:
- Textos i18n: labels, callouts, modales, mensajes, toasts, errores y empty states.
- Verificación visual: navegador integrado o extensión del agente para render y consola, además de Playwright (cuando hay UI web).

## Integraciones

- Activas:
- Diferidas con placeholders:
- Condición de activación:
- Variables documentadas en `.env.example`:

## Seguridad

- Modo tenant: multi-tenant | single-tenant con razón
- RLS cross-tenant:
- RLS dentro del tenant por permisos/ownership:
- RBAC server-side:
- Consentimiento/cookies:
- Auditoría mínima por acción: fecha/hora y usuario ejecutor.

## Escalabilidad

- Cache:
- Jobs:
- Redis/Inngest:
- Observabilidad:
- Validación visual/E2E:

## Entornos

- Dev:
- Test/Staging:
- Producción:
- Separación de datos y credenciales por entorno:

## Variables de entorno

Documentar placeholders en `.env.example`. No incluir secretos reales.

## Timezone e i18n

- Timezone base:
- Override por tenant:
- Override por usuario:
- Persistencia en UTC:
- Traducciones requeridas:

## Contrato base de APIs

- Método permitido:
- Auth:
- Tenant context:
- RBAC/RLS:
- Validación:
- DTO:
- Rate limit:
- Error contract:
- Auditoría:

## Criterios de aceptación

## Base para planificación

Esta sección no reemplaza `artifacts/FROMZERO_PLAN.md`. Su función es dejar la Spec
lista para que el Plan ordene Sprints sin inventar dependencias ni secuencia.

- Dependencias funcionales:
- Dependencias técnicas:
- Capacidades que desbloquean otras:
- Orden sugerido de construcción:
- Riesgos por dominio:
- Validaciones necesarias antes del primer Sprint:
- Criterios para justificar un orden distinto en el Plan:

## Especialistas condicionales

Esta sección no promete subagentes reales. Registra cuándo la metodología requiere
una revisión especializada, qué modo permite el adapter y cómo se documenta el
fallback. Para proyectos simples puede quedar `no aplica` con razón.

Modos permitidos:

- `subagente real`: runtime verificado con aislamiento o ejecución propia.
- `revisión secuencial`: el agente principal ejecuta una pasada separada por rol.
- `rol documental`: solo existe como referencia empaquetada; no cuenta como revisión independiente.
- `no aplica`: el dominio no está presente o no cambia riesgo.

| Dominio | Condición de activación | Especialista esperado | Modo permitido | Insumos obligatorios | Estado | Fallback o razón de no aplicación |
|---|---|---|---|---|---|---|
| arquitectura | schema / APIs / jobs / cache / migraciones / arquitectura relevante | architect | subagente real / revisión secuencial / rol documental / no aplica | Spec, fuentes, diseño | pendiente / revisado / no aplica |  |
| seguridad | auth / permisos / RLS / RBAC / secretos / datos sensibles | auditor | subagente real / revisión secuencial / rol documental / no aplica | Spec, amenazas, gates | pendiente / revisado / no aplica |  |
| UI | interfaz, flujos visuales, accesibilidad, i18n visible | reviewer | subagente real / revisión secuencial / rol documental / no aplica | Spec, referencia UI | pendiente / revisado / no aplica |  |
| rendimiento | carga, multi-instancia, cache, quotas, costos | perf | subagente real / revisión secuencial / rol documental / no aplica | Spec, KPIs/SLOs | pendiente / revisado / no aplica |  |
| testing | lógica crítica, integraciones, permisos, regresiones | tester | subagente real / revisión secuencial / rol documental / no aplica | Spec, criterios | pendiente / revisado / no aplica |  |

Evaluación de agentes futuros:

- `database`: recomendado para evaluar en versión posterior si hay RLS compleja, migraciones, índices, ownership, Supabase/Postgres crítico o riesgo de datos.
- `integrations`: recomendado para evaluar en versión posterior si hay webhooks, billing, proveedores externos, retries, idempotencia o rate limits.
- Resultado de la evaluación: no requerido / evaluar en backlog / evidencia insuficiente.

## Zonas de validación humana

Estas zonas solo bloquean Build cuando un Sprint toca una zona crítica marcada como
`requiere aprobación` o `bloqueada`. No aplican por defecto a documentación o UI
no crítica.

Estados permitidos: `no aplica`, `requiere aprobación`, `aprobada`, `bloqueada`.
Todo `no aplica` necesita razón.

| Zona | Condición de activación | Estado | Aprobación o razón | Sprint afectado |
|---|---|---|---|---|
| auth/sesiones | cambios en login, sesión, MFA, OAuth o expiración | no aplica / requiere aprobación / aprobada / bloqueada |  |  |
| permisos/RLS/RBAC | cambios en aislamiento, ownership o autorización | no aplica / requiere aprobación / aprobada / bloqueada |  |  |
| billing/pagos/webhooks | cobros, planes, proveedores de pago o webhooks monetarios | no aplica / requiere aprobación / aprobada / bloqueada |  |  |
| migraciones destructivas | drop, delete, backfill irreversible o cambios de datos sensibles | no aplica / requiere aprobación / aprobada / bloqueada |  |  |
| eliminación/exportación de datos | borrado, exportaciones, backups o retención | no aplica / requiere aprobación / aprobada / bloqueada |  |  |
| secretos/deploy | credenciales, entornos, CI/CD, producción o servicios cloud | no aplica / requiere aprobación / aprobada / bloqueada |  |  |
| legal/compliance | consentimiento, privacidad, términos, auditoría legal | no aplica / requiere aprobación / aprobada / bloqueada |  |  |

## Automatización vs augmentación

Completar solo si el proyecto crea o modifica hooks, loops, schedules, monitores,
jobs recurrentes o procesos automatizados. Si no hay automatización real, registrar
`No aplica` con razón.

| Automatización | Requiere juicio humano | 80% correcto es aceptable | Costo del fallo | Detección del fallo | Rollback | Evidencia producida | Estado |
|---|---|---|---|---|---|---|---|
|  | si / no / no aplica | si / no / no aplica |  |  |  |  | no aplica / aprobado / bloqueado |

## KPIs y SLOs

Toda metrica numerica del insumo debe copiarse aquí textualmente, o registrarse como
relajada con justificación. Cada KPI declara el gate que lo verifica.

| Metrica | Valor objetivo | Fuente | Gate/Sprint que la verifica | Estado |
|---|---|---|---|---|

## Pruebas esperadas

## Requisitos por módulo

| Módulo o capacidad | Seguridad mínima | Escalabilidad mínima | Pruebas mínimas | Fuente |
|---|---|---|---|---|

## Riesgos

## Decisiones pendientes o diferidas

Para cada item:

- Decisión:
- Por que se difiere:
- Impacto arquitectonico:
- Placeholder/contrato requerido:
- Condición de activación:
- Gate requerido:
- Riesgo si no se prepara:

## Aprobación

- Revisado por:
- Fecha:
- Estado: pendiente | aprobado | requiere cambios
