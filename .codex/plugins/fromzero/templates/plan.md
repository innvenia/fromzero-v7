# FROMZERO_PLAN

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_PLAN |
| Propósito o subtítulo | Plan de implementación por Sprints verificables |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | borrador \| listo para revisión \| aprobado \| requiere cambios \| requiere re-aprobación |
| Historial de estados |  |
| Aprobación del usuario | pendiente \| aprobada |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado o aceptado explícitamente como base |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Resumen para el dueño

Completar en lenguaje no técnico. Esta sección permite aprobar el plan con
criterio antes de revisar trazabilidad y gates; no reemplaza la planificación por
Sprints ni las verificaciones obligatorias.

- Qué se implementará:
- Orden de entrega:
- Primer resultado verificable:
- Qué queda diferido:
- Riesgos principales:
- Aprobaciones humanas requeridas:
- Qué se pide aprobar:

## Estado operativo del plan

- Versión objetivo:
- Spec base: `artifacts/FROMZERO_SPEC.md`
- Estado operativo: `artifacts/FROMZERO_STATE.md`
- Unidad visible de trabajo: Sprint

## 1. Reglas de ejecución

- Ejecutar Sprint por Sprint.
- La numeración visible empieza en Sprint 1.
- No generar numeración inferior a `1` en pasos, Sprints, fases, etapas ni items.
- No tocar servicios cloud sin aprobación por servicio.
- No leer ni imprimir `.env` reales.
- Crear solo `.env.example` con placeholders.
- Mantener credenciales reales fuera del repo.
- Validar cada Sprint con comandos y criterios verificables.
- Mantener `artifacts/FROMZERO_STATE.md` actualizado como punto central de reanudación.
- Commits pequeños con Conventional Commits.
- Este plan paso la validación de cierre contra `artifacts/FROMZERO_SPEC.md` y la estructura de referencia (ver sección Validación de cierre).

## 2. Estado inicial

- Git:
- Commit base:
- `.gitignore`:
- Spec:
- Cuestionario:
- Plugin FromZero:
- Estado operativo:
- Riesgos iniciales:

## 3. Recursos y herramientas

- Recursos locales seleccionados:
- Resolver FromZero:
- Recursos faltantes:
- Decisión de instalación:

## 4. Verificaciones externas

| Verificación | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
|  | pendiente |  |  |

## 5. Variables y placeholders

- Variables requeridas en `.env.example`:
- Secretos reales fuera del repo:
- Archivos locales no versionados:

## 5.1 Trazabilidad criterios -> Sprints

Todo criterio de aceptación de `artifacts/FROMZERO_SPEC.md` debe tener exactamente un Sprint
dueño, o declararse progresivo con el Sprint que lo cierra.

| Criterio de aceptación (spec) | Sprint dueño | Progresivo (Sprint de cierre) |
|---|---|---|

## 5.2 Trazabilidad fuentes/capacidades -> Sprints

Toda capacidad cubierta en `artifacts/FROMZERO_SPEC.md` debe tener Sprint dueño, archivos
objetivo, pruebas/comandos, verificaciones y criterio verificable. Incluye capacidades
transversales críticas del PRD aunque no estén redactadas como criterios de
aceptación.

| Capacidad | Tipo | Fuente | Obligación | Sprint dueño | Archivos objetivo | Pruebas/comandos | Verificaciones | Criterio verificable |
|---|---|---|---|---|---|---|---|---|

Tipos sugeridos: módulo, transversal, tabla, job, API, página infraestructura,
seguridad, escalabilidad, configuración, observabilidad, i18n, accesibilidad.

## 5.3 Trazabilidad requisitos atomicos -> Sprints

Todo requisito atomico cubierto en `artifacts/FROMZERO_SPEC.md` debe tener Sprint dueño,
archivos objetivo, pruebas/comandos, verificaciones y criterio verificable. Si una fuente
prioritaria contiene listas internas, cada item obligatorio necesita fila propia.
No agrupes subrequisitos bajo filas genéricas como auth, storage, billing, UI,
theme, grid, notifications, import/export o API.

| ID | Requisito atomico | Dominio | Fuente | Heading/Subheading | Obligación | Sprint dueño | Archivos objetivo | Pruebas/comandos | Verificaciones | Criterio verificable |
|---|---|---|---|---|---|---|---|---|---|---|
| REQ- |  |  |  |  | primer corte / release candidate / venta / posterior según docs | Sprint  |  |  |  |  |

## 5.4 Trazabilidad invariantes/gates -> Sprints

Toda regla obligatoria documentada debe tener Sprint dueño, archivos objetivo,
pruebas/comandos, gate y criterio bloqueante. No dejes implícitos los controles de
bootstrap, data real, naming, servicios internos, dependencias, inventario API,
performance, limpieza de marcas o consentimientos.

| ID | Regla o gate | Dominio | Fuente | Obligación | Sprint dueño | Archivos objetivo | Pruebas/comandos | Gate | Criterio bloqueante |
|---|---|---|---|---|---|---|---|---|---|
| GATE- |  | bootstrap-order / real-data-only / naming-dual-standard / internal-service-boundary / dependency-security / api-inventory / performance-budget / template-brand-sanitization / consent-records / seguridad / escalabilidad / release |  | primer corte / release candidate / venta / posterior según docs | Sprint  |  |  |  |  |

## 5.5 Conteo de cobertura REQ/GATE

Estos conteos deben cuadrar con Context, Questionnaire, Spec y Plan. No declares "sin faltantes" si existe una fuente, requisito, decisión o invariante sin fila.

| Tipo | Total detectado | Cubiertos | Pendientes | Diferidos con razón | Excluidos con razón |
|---|---:|---:|---:|---:|---:|
| REQ | 0 | 0 | 0 | 0 | 0 |
| GATE | 0 | 0 | 0 | 0 | 0 |

Regla de cierre:
Para presentar el plan como listo para aprobación, `Pendientes` debe ser `0` en
REQ y GATE. Los diferidos y excluidos solo son válidos con razón y fuente
documental.

### Revisión adversarial complementaria

Esta revisión no reemplaza la cobertura completa. Sirve para detectar errores de
interpretación después de completar las matrices REQ/GATE.

| Muestra determinística | Fuente | Item revisado | Resultado | Gap detectado | Acción |
|---|---|---|---|---|---|
| 1 |  |  | cubierto \| gap |  |  |
| 2 |  |  | cubierto \| gap |  |  |
| 3 |  |  | cubierto \| gap |  |  |

Selección de muestra: tomar el primer item obligatorio, el item central y el
último item obligatorio de las fuentes prioritarias con listas o tablas. Si una
fuente prioritaria tiene menos de tres items, revisar todos. No usar muestreo
aleatorio como control principal.

## 5.6 Contraste de decisiones Questionnaire -> Spec -> Plan

| Decisión | Questionnaire | Spec | Plan | Estado | Acción requerida |
|---|---|---|---|---|---|
|  |  |  |  | consistente \| contradicción \| pendiente |  |

## 5.7 Controles condicionales de riesgo

Estas secciones son condicionales. Un proyecto simple puede marcarlas como `no aplica`
con razón. No sustituyen los gates existentes.

### 5.7.1 Revisión de especialistas

Registrar revisión o fallback para cada dominio relevante. No declarar subagente
real si `runtime-smoke` no lo verificó.

| Dominio | Condición en este proyecto | Especialista | Modo usado | Insumos revisados | Hallazgos | Decisión del agente principal | Fallback o razón |
|---|---|---|---|---|---|---|---|
| arquitectura | aplica / no aplica | architect | subagente real / revisión secuencial / rol documental / no aplica |  |  |  |  |
| seguridad | aplica / no aplica | auditor | subagente real / revisión secuencial / rol documental / no aplica |  |  |  |  |
| UI | aplica / no aplica | reviewer | subagente real / revisión secuencial / rol documental / no aplica |  |  |  |  |
| rendimiento | aplica / no aplica | perf | subagente real / revisión secuencial / rol documental / no aplica |  |  |  |  |
| testing | aplica / no aplica | tester | subagente real / revisión secuencial / rol documental / no aplica |  |  |  |  |

Evaluación de agentes futuros:

| Dominio | Señal encontrada | Agente futuro recomendado | Decisión |
|---|---|---|---|
| database | RLS compleja / migraciones / índices / ownership / Supabase/Postgres crítico | si / no | no crear en esta versión / evaluar en backlog |
| integrations | webhooks / billing / proveedores / retries / idempotencia / rate limits | si / no | no crear en esta versión / evaluar en backlog |

### 5.7.2 Zonas de validación humana por Sprint

Build debe bloquear si el Sprint toca una zona crítica en estado `requiere aprobación`
o `bloqueada`.

| Sprint | Zona | Condición de activación | Estado | Aprobación o razón | Acción antes de Build |
|---|---|---|---|---|---|
| Sprint  | auth/sesiones / permisos/RLS/RBAC / billing/pagos/webhooks / migraciones destructivas / datos / secretos/deploy / legal/compliance |  | no aplica / requiere aprobación / aprobada / bloqueada |  | continuar / pedir aprobación / bloquear |

### 5.7.3 Automatización vs augmentación

Completar solo si un Sprint crea o modifica hooks, loops, schedules, monitores,
jobs recurrentes o procesos automatizados.

| Sprint | Automatización | Juicio humano requerido | 80% correcto aceptable | Costo del fallo | Detección | Rollback | Evidencia | Estado |
|---|---|---|---|---|---|---|---|---|
| Sprint  |  | si / no / no aplica | si / no / no aplica |  |  |  |  | no aplica / aprobado / bloqueado |

## 6. Sprints

### Sprint 1 - Preparación y base inicial

Estado: pendiente | completado | requiere cambios

Objetivo:

Archivos objetivo:

Pruebas/comandos:

Verificaciones:

Criterios de aceptación:

Dependencias (solo Sprints anteriores o limitación declarada):

### Sprint 2 - [Título]

Estado:

Objetivo:

Archivos objetivo:

Pruebas/comandos:

Verificaciones:

Criterios de aceptación:

Dependencias (solo Sprints anteriores o limitación declarada):

## 7. Decisiones técnicas transversales

### Cobertura transversal crítica

- Búsqueda/command palette:
- Redirecciones post-login y dashboard:
- Soft delete/papelera:
- File browser:
- Notificaciones y preferencias:
- Help center/soporte:
- Páginas públicas:
- Contratos mobile/API:
- Keyboard shortcuts:
- Consentimiento:
- Páginas de infraestructura:
- Modo mantenimiento:
- Setup wizard:
- Jobs programados:
- Configuración de módulos:
- Tablas, pivotes e historiales:
- Seguridad y escalabilidad por módulo:
- Auth, onboarding y sesiones:
- Storage, File Management y FileUploader:
- Billing, subscriptions y feature gating:
- UI primitives, overlays e infraestructura visual:
- Theme Engine y branding runtime:
- Grid Universal y Module Factory:
- Custom Fields:
- Event Bus y Rules:
- Notifications:
- Import/Export:
- API, errores y seguridad perimetral:
- Bootstrap/schema/Tenant Zero:
- Datos reales estrictos:
- Nomenclatura obligatoria y Dual Standard:
- Core AI o servicios internos:
- Dependencias vulnerables:
- Inventario API:
- Performance budgets exactos:
- Prohibición de marca de plantillas:
- Consent Records:

### Cache

### Jobs

### Queries

### Seguridad

### UI

### i18n/timezone

### Observabilidad

### k6/performance

## 8. Cierre por Sprint

Cada Sprint debe cerrar con:

- diff revisado;
- pruebas ejecutadas;
- limitaciones documentadas;
- verificaciones pendientes listadas;
- commit automático creado cuando sea seguro, reportado con hash corto y mensaje completo, o razón concreta si no pudo crearse;
- enlaces a los artefactos o evidencia que el humano debe revisar;
- siguiente Sprint recomendado y acción humana exacta.

## 9. Validación de cierre

- Criterios de la spec con Sprint dueño: completo | pendiente (detalle)
- Capacidades documentadas con Sprint dueño, archivos, pruebas y verificaciones: completo | pendiente (detalle)
- Requisitos atomicos con Sprint dueño, archivos, pruebas, verificaciones y criterio: completo | pendiente (detalle)
- Headings funcionales obligatorios del PRD con Sprint dueño: completo | pendiente (detalle)
- Módulos documentados con Sprint dueño: completo | pendiente (detalle)
- Tablas documentadas con Sprint dueño: completo | pendiente (detalle)
- Funciones transversales documentadas con Sprint dueño: completo | pendiente (detalle)
- Invariantes/gates documentados con Sprint dueño, archivos, pruebas y criterio bloqueante: completo | pendiente (detalle)
- Bootstrap order validado: completo | pendiente | no aplica (razón)
- Datos reales estrictos validados: completo | pendiente | no aplica (razón)
- Naming/Dual Standard validado: completo | pendiente | no aplica (razón)
- Servicios internos no expuestos validados: completo | pendiente | no aplica (razón)
- Dependencias/advisories/lockfiles validados: completo | pendiente | no aplica (razón)
- Inventario API validado: completo | pendiente | no aplica (razón)
- Performance budgets exactos validados: completo | pendiente | no aplica (razón)
- Marcas de templates ausentes en superficies visibles: completo | pendiente | no aplica (razón)
- Consent records auditables validados: completo | pendiente | no aplica (razón)
- Fuentes prioritarias contrastadas contra plan: completo | pendiente (detalle)
- Diferidos justificados por fuente documental: completo | pendiente (detalle)
- Archivos objetivo validados contra estructura de referencia: si | no aplica (razón)
- Contradicciones plan vs spec: ninguna | listadas
- Contradicciones plan vs questionnaire: ninguna | listadas
- Revisión de especialistas o fallback para dominios relevantes: completo | pendiente | no aplica (razón)
- Zonas de validación humana por Sprint: completo | pendiente | no aplica (razón)
- Automatización vs augmentación evaluada: completo | pendiente | no aplica (razón)
- `.env` reales leídos: no | bloqueo (detalle)
- Secretos incluidos: no | bloqueo (detalle)
- Código de aplicación modificado durante planificación: no | bloqueo (detalle)

## 10. Siguiente aprobación

Frase recomendada:

```text
Apruebo el plan.
```

Variantes válidas si expresan aprobación explícita del plan vigente:

```text
Apruebo el plan actualizado.
Apruebo el plan actualizado para iniciar la ejecucion del proyecto
Apruebo iniciar la ejecución del proyecto
```

Regla: registrar la frase literal del usuario y normalizar internamente el
estado como aprobación del plan vigente. Si la respuesta es ambigua, condicional
o parcial, pedir confirmación antes de cambiar estado o iniciar Build.

`Continua con la ejecucion del proyecto` solo reanuda un plan ya aprobado. Si el
plan está en revisión, Build debe pedir aprobación explícita, por ejemplo
`Apruebo el plan`.

Si un plan aprobado se edita, su estado cambia a `requiere re-aprobación`. No se
puede iniciar o reanudar Build hasta registrar nueva fecha, frase literal y estado
aprobado.
