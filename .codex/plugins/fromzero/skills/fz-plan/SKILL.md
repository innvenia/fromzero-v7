---
name: fz-plan
description: "Usar automáticamente cuando el usuario pida organizar, planear, dividir o iniciar el trabajo por pasos, aunque lo diga como 'haz un plan', 'divide el trabajo', 'dime por dónde empezamos', 'organiza los pasos' o 'prepara el plan de construcción'."
---

# fz-plan

## Frases simples que activan esta skill

- "Haz un plan."
- "Divide el trabajo."
- "Dime por dónde empezamos."
- "Organiza los pasos."
- "Prepara el plan de construcción."
- "Apruebo la especificación."
- "Apruebo la spec."
- "Apruebo el spec."
- "Apruebo la especificación como base para planificar."

## Reglas

- No crear plan de implementación si `artifacts/FROMZERO_QUESTIONNAIRE.md` tiene preguntas críticas pendientes.
- No crear plan de implementación si `artifacts/FROMZERO_QUESTIONNAIRE.md` está en estado `borrador de preguntas` o tiene `Modo Q&A ejecutado: no`.
- No crear plan de implementación si `artifacts/FROMZERO_QUESTIONNAIRE.md` no fue revisado y aprobado explícitamente por el usuario cuando existe.
- No crear plan de implementación si `artifacts/FROMZERO_CONTEXT.md` no existe.
- Si faltan respuestas críticas, volver a clarificación antes del plan.
- No crear plan de implementación si `artifacts/FROMZERO_SPEC.md` no existe.
- No crear plan de implementación si `artifacts/FROMZERO_SPEC.md` no fue revisado, aprobado o aceptado explícitamente por el usuario como base.
- Si esta skill se activa porque el usuario dijo `Apruebo la especificación`, `Apruebo la spec` o `Apruebo el spec`, tratar esa aprobación como orden metodológica suficiente para avanzar, pero primero evaluar si aplica `fz-design`.
- Si la spec implica schema, APIs, permisos, jobs, cache, migraciones, integraciones o arquitectura relevante y no existe diseño técnico o ADR aplicable, ejecutar `fz-design` o registrar el diseño antes de crear el plan. No saltar silenciosamente de aprobación de spec a plan cuando Design aplica.
- Si Design no aplica, registrar `diseño técnico no requerido` con razón concreta en el plan.
- No pedir al usuario que indique la siguiente fase ni que escriba instrucciones internas como "crea el plan"; la metodología controla esa transición.
- Si falta la especificación, volver a `fz-spec` y crear `artifacts/FROMZERO_SPEC.md`.
- Planifica por Sprints verificables.
- Usa `templates/plan.md` como contrato de estructura; incluye `## Metadatos` completo y verifica conformidad sección por sección antes de cerrar.
- Completa `## Resumen para el dueño` en lenguaje no técnico antes de la trazabilidad: qué se implementará, orden de entrega, primer resultado verificable, diferidos, riesgos, aprobaciones humanas y qué se pide aprobar. Esta sección no sustituye Sprints, matrices, gates ni validación de cierre.
- Lee `## Base para planificación` de `artifacts/FROMZERO_SPEC.md` antes de ordenar Sprints, dependencias, gates y primer corte verificable.
- Lee `## Especialistas condicionales`, `## Zonas de validación humana` y
  `## Automatización vs augmentación` de `artifacts/FROMZERO_SPEC.md` y trasládalos
  al Plan solo como controles condicionales por Sprint.
- Crea o actualiza `artifacts/FROMZERO_STATE.md` usando `templates/state.md` como contrato de estructura; verifica conformidad sección por sección antes de cerrar.
- Completa `## Resumen para el dueño` de `artifacts/FROMZERO_STATE.md` con estado actual, último avance, Sprint actual, siguiente acción, bloqueos y decisión humana requerida.
- `artifacts/FROMZERO_STATE.md` es la fuente de verdad operativa para reanudar el proyecto.
- El plan define todos los Sprints; el estado indica Sprint actual, último Sprint completado, siguiente Sprint, gates, bloqueos y próxima acción.
- `artifacts/FROMZERO_STATE.md` debe registrar commits previos relevantes con hash corto y mensaje completo cuando existan, especialmente al reconstruir estado desde `git log`.
- No planifiques capas horizontales aisladas.
- Incluye archivos objetivo, tests, comandos y criterios verificables.
- Incluye decisión de cache, jobs, queries y k6.
- Incluye recursos locales seleccionados de `library/manifest.json`.
- Incluye categoría seleccionada o `missing-resource-resolution` si una tecnología no está empaquetada.
- Incluye decisión: recurso genérico, documentación oficial aprobada o sync de pack versionado.
- Incluye si se ejecutará `tools/resource-resolver.mjs --install`.
- Incluye uso de `.fromzero/fromzero.lock.json` como evidencia de recursos instalados.
- Incluye actualización de `.env.example` cuando una integración requiere variables.
- Incluye gates específicos por integración antes de release.
- Incluye alcance activado, alcance diferido, condiciones de activación y placeholders necesarios.
- Incluye issue GitHub cuando el trabajo sea rastreable; si se exporta como archivo local, guardarlo bajo `artifacts/issues/` usando `templates/issue.md`.
- Crea o actualiza `artifacts/FROMZERO_PLAN.md`.
- Después de crear o actualizar `artifacts/FROMZERO_PLAN.md`, crea o actualiza `artifacts/FROMZERO_STATE.md`.
- Si ya hay Sprints ejecutados, no los renumeres ni los marques como pendientes; reflejalos como completados en `artifacts/FROMZERO_STATE.md`.
- Si `artifacts/FROMZERO_STATE.md` falta pero existen plan, spec o commits, reconstruye el estado desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`; explica que datos son inferidos.
- Confirma si existe commit base; si no existe, explica riesgo y pide resolverlo antes de implementar.
- La numeración visible siempre empieza en `1`; no generes numeración inferior a `1` en pasos, Sprints, fases, etapas ni items.
- Sprint 1 debe cubrir preparación/base inicial o marcarse como completado si esa preparación ya ocurrió antes del plan.
- Lista todos los Sprints con título, objetivo, resumen breve de inicio, herramientas previstas, dependencias, criterios de éxito, archivos objetivo, pruebas y gates.
- Cada Sprint debe incluir `Resumen breve de inicio` en lenguaje simple: qué se construirá, alcance principal y resultado verificable esperado. Debe ser breve y apto para mostrarse antes de codificar.
- Cada Sprint debe incluir `Herramientas previstas`: skills FromZero, MCPs/conectores, subagentes, navegador, scripts CLI, test runners o servicios externos que probablemente se usarán. No prometas MCPs, subagentes o navegador si el runtime no está verificado; marca `no aplica` o `fallback` con razón.
- Prefiere CLI sobre MCP por eficiencia de tokens; valida que el CLI o MCP responde y expone las herramientas necesarias antes de declararlo en un Sprint. CLI y MCP son herramientas de desarrollo, no runtime del producto.
- Declara, por Sprint, qué herramientas son obligatorias y cuáles opcionales o diferidas. Lo no seleccionado no bloquea, pero documenta su compensación (por ejemplo, rate-limit y locks sin estado si no hay Redis).
- Para componentes de alto riesgo (costo, privacidad o exfiltración de datos: IA, pagos, exportación masiva), exige que sus precondiciones estén satisfechas antes de iniciar su Sprint (API mínima, secretos saneados, budgets, redaction, provider decidido y revalidado), o difiérelas con registro en `artifacts/DEFERRED_ACTIVATIONS.md`. Ver `checklists/scalability.md`.
- Define DoR y DoD por tipo de Sprint (BD/RLS, integración, UI, calidad). DoR incumplido bloquea el inicio del Sprint; DoD incumplido bloquea su cierre salvo aprobación de riesgo registrada.
- El orden de Sprints debe derivar de `## Base para planificación`; cualquier divergencia debe quedar justificada con impacto, dependencia resuelta y riesgo aceptado.
- Completa `## 5.7 Controles condicionales de riesgo`: especialistas,
  zonas humanas y automatización. Para cada dominio aplicable registra revisión,
  hallazgos, decisión o fallback. Si el Plan declara un dominio crítico y no puede
  registrar revisión ni fallback, no presentes el Plan como listo.
- En especialistas, distingue `subagente real`, `revisión secuencial`,
  `rol documental` y `no aplica`. No declares `subagente real` sin evidencia de
  runtime. `rol documental` necesita fallback porque no cuenta como revisión
  independiente.
- Registra evaluación de `database` e `integrations` solo como señal para backlog:
  no crear agentes nuevos ni prometer ejecución real en esta versión.
- En zonas de validación humana por Sprint, usa solo `no aplica`, `requiere
  aprobación`, `aprobada` o `bloqueada`. Todo `no aplica` requiere razón y toda
  zona en `requiere aprobación` o `bloqueada` debe indicar acción antes de Build.
- Aplica el filtro de automatización vs augmentación solo si un Sprint crea o
  modifica hooks, loops, schedules, monitores, jobs recurrentes o procesos
  automatizados. Si intenta crear automatización sin filtro, no presentes el Plan
  como listo.
- La única unidad visible del plan es el Sprint, numerado desde 1.
- Usa la estructura estándar del plan: encabezado, reglas de ejecución, estado inicial, recursos, gates externos, variables/placeholders, Sprints, decisiones técnicas transversales, cierre por Sprint y siguiente aprobación.
- Completa la tabla de trazabilidad criterios -> Sprints; un criterio de la spec sin Sprint dueño bloquea la aprobación del plan.
- Completa la tabla de trazabilidad fuentes/capacidades -> Sprints; cada capacidad cubierta en la spec debe tener Sprint dueño, archivos objetivo, pruebas/comandos, gates y criterio verificable.
- Completa la tabla de trazabilidad requisitos atomicos -> Sprints; cada requisito atomico cubierto en la spec debe tener Sprint dueño, archivos objetivo, pruebas/comandos, gates y criterio de aceptación verificable.
- Completa la tabla de trazabilidad invariantes/gates -> Sprints; cada regla obligatoria cubierta en la spec debe tener Sprint dueño, archivos objetivo, prueba/comando, gate y criterio bloqueante.
- Completa `Conteo de cobertura REQ/GATE`: totales, cubiertos, pendientes, diferidos con razón y excluidos con razón. Estos conteos deben cuadrar con Context, Spec y Plan.
- No presentes el plan como listo para aprobación si `Pendientes` es mayor que `0` en REQ o GATE. Diferidos y excluidos deben tener razón y fuente documental.
- Ejecuta una revisión adversarial determinística complementaria después de completar la cobertura: revisa el primer item obligatorio, el item central y el último item obligatorio de las fuentes prioritarias con listas o tablas. Esta revisión no reemplaza la trazabilidad completa y no puede justificar omitir filas REQ/GATE.
- Completa `Contraste de decisiones Questionnaire -> Spec -> Plan` para comandos, lockfiles, providers, herramientas, stack y decisiones que puedan cambiar alcance o arquitectura.
- La trazabilidad del plan debe cubrir funcionalidades transversales críticas del PRD aunque no estén redactadas como criterios de aceptación: búsqueda global, command palette, redirecciones post-login, dashboards, soft delete/papelera, file browser, notificaciones, help center, páginas públicas, contratos mobile/API, keyboard shortcuts, consentimiento, páginas de infraestructura, modo mantenimiento, setup wizard, jobs programados, configuración de módulos, tablas, seguridad y escalabilidad por módulo, cuando estén documentadas.
- La trazabilidad atomica debe cubrir, cuando esté documentado: auth/onboarding/sesiones, storage/File Management/FileUploader, billing/subscriptions/feature gating, UI primitives/overlays, Theme Engine/branding runtime, Grid Universal/Module Factory, Custom Fields, Event Bus/Rules, Notifications, Import/Export y API/errores/seguridad perimetral.
- La trazabilidad de invariantes debe cubrir, cuando esté documentado: orden de bootstrap/schema/Tenant Zero, logs antes de operaciones auditables, prohibición de data dummy visible, naming y Dual Standard, Core AI o servicios internos no expuestos, Dependabot/Renovate, advisories y lockfiles, `docs/API_ENDPOINT_INVENTORY.md`, performance budgets exactos, ausencia de marcas de templates y consent records.
- No declares "sin faltantes", "cobertura completa" ni "sin contradicciones" si una fuente prioritaria, requisito, decisión, invariante, heading funcional, capacidad transversal, tabla, job, API, UI surface o requisito security/scale documentado no tiene fila de cobertura y Sprint dueño.
- Antes de cerrar el plan, ejecuta la validación de cierre: (1) cada criterio de aceptación de `artifacts/FROMZERO_SPEC.md` tiene Sprint dueño; (2) cada capacidad cubierta de la matriz de cobertura tiene Sprint dueño, archivos objetivo, pruebas/comandos, gates y criterio verificable; (3) cada requisito atomico cubierto tiene Sprint dueño, archivos objetivo, pruebas/comandos, gates y criterio verificable; (4) cada invariante/gate cubierto tiene Sprint dueño, archivos objetivo, pruebas/comandos, gate y criterio bloqueante; (5) los headings funcionales obligatorios del PRD tienen Sprint dueño; (6) todos los módulos, tablas, funciones transversales, jobs, APIs, páginas de infraestructura, seguridad y escalabilidad documentados tienen dueño o diferido con fuente documental; (7) bootstrap order, data real estricta, naming, servicios internos, dependencias, inventario API, performance, marcas de templates y consent records están cubiertos o marcados no aplica con razón; (8) los archivos objetivo de cada Sprint se validan contra la estructura física de referencia del proyecto cuando exista; (9) ninguna sección del plan contradice la spec, questionnaire ni fuentes priorizadas; (10) el orden de Sprints coincide con `## Base para planificación` o justifica cada divergencia. Reporta el resultado de estas validaciones en la salida del plan.
- En la misma validación de cierre, confirma que los controles condicionales quedan
  completos: dominios relevantes tienen revisión/fallback, zonas humanas tienen
  estado y automatizaciones reales tienen filtro. No conviertas controles
  `no aplica` con razón en bloqueos.
- Valida dependencias entre Sprints: toda capacidad que un Sprint promete debe estar provista por ese Sprint o por uno anterior. Si un Sprint N depende de algo que llega en un Sprint M mayor que N, reordena, adelanta un mínimo verificable de M o declara en el Sprint N la limitación explícita y su condición de cierre.
- Verifica contradicciones contra `artifacts/FROMZERO_QUESTIONNAIRE.md`; si una decisión cambio, actualiza la pregunta y el Registro de cambios antes de cerrar.
- Antes de presentar el plan como listo, audita el plan contra la documentación de la metodología (`docs/`) y `artifacts/FROMZERO_QUESTIONNAIRE.md`, cierra los gaps detectados y reporta el resultado (aprueba o requiere cambios con la lista de gaps). Esta auditoría refuerza la validación de cierre, no la reemplaza.
- Verifica que ninguna pregunta crítica quede abierta (gate de salida "preguntas críticas = 0") antes de presentar el plan como listo.
- No habilites Build si la reconciliación de respuestas del dueño tiene filas `rechazada` o contradicciones sin resolver; deben quedar `aceptada` o diferidas con aprobación.
- No apruebes el plan apoyado en ADRs en estado `borrador`; el estado del Plan es independiente del estado de cada ADR. Si un Sprint depende de un ADR pendiente, difiérelo con riesgo aprobado y registrado, o bloquea su inicio.
- Puedes agregar secciones propias del proyecto si son necesarias, sin romper la estructura base.
- Después de crear o actualizar el plan, resume cambios exactos en `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_QUESTIONNAIRE.md` y `artifacts/FROMZERO_PLAN.md`.
- También resume cambios exactos en `artifacts/FROMZERO_STATE.md`.
- Antes de crear commit, muestra estado Git resumido y verifica que no se incluiran `.env` reales, tokens, llaves, dumps ni logs.
- Si el plan se creó o actualizó a partir de una aprobación explícita de la spec, crea un commit automático cuando sea seguro: repositorio Git disponible, verificaciones aplicables pasadas, sin secretos, y stage limitado a los artefactos FromZero modificados por esta fase.
- Antes de cualquier checkpoint automático, clasifica el working tree con `tools/git-checkpoint.mjs --dry-run` o una revisión equivalente. No crees checkpoint si hay cambios externos, sensibles o no permitidos por allowlist.
- El cierre debe mostrar el commit como hash corto y mensaje completo, por ejemplo `Commit: a9930be - docs(fromzero): create implementation plan and state`; no mostrar solo el hash.
- Si el commit automático no es seguro, explica la razón concreta en vez de dejar solo un mensaje de commit sugerido.
- Si `artifacts/FROMZERO_PLAN.md` y `artifacts/FROMZERO_STATE.md` ya existen y esta ejecución no cambió archivos, no reportar el commit como fallo; decir que no hubo cambios nuevos que guardar en Git.
- Si hay cambios sin commit previos, no usar una frase corta como "cambios previos mezclados" como explicación completa. Stagear solo los artefactos FromZero esperados cuando las rutas sean claras; si no puede aislarlos, explicar qué archivos o condición bloquean el commit automático.
- No crees checkpoints automáticos si el working tree mezcla cambios del usuario, archivos desconocidos o rutas fuera de los artefactos FromZero de la fase. En ese caso, reporta la clasificación de cambios y pide decisión explícita.
- Si el usuario rechaza `artifacts/FROMZERO_PLAN.md` por cobertura incompleta, no inicies Sprint 1. Actualiza `artifacts/FROMZERO_STATE.md` a `requiere cambios` o `plan actualizado en revisión`, revisa primero si `artifacts/FROMZERO_SPEC.md` omitió o contradijo la documentación, corrige la spec con el ajuste mínimo necesario y luego actualiza `artifacts/FROMZERO_PLAN.md`.
- En un rechazo de plan, no toques código de aplicación ni archivos fuera de los artefactos FromZero necesarios. El cierre debe listar archivos actualizados, capacidades agregadas, Sprints afectados, diferidos con fuente documental, riesgos abiertos y pedir aprobación explícita del plan vigente; puede sugerir `Apruebo el plan actualizado`, pero no tratar esa frase como única opción válida.
- Para un plan nuevo o actualizado listo para revisión, el cierre debe pedir la frase recomendada `Apruebo el plan` y aceptar `Apruebo el plan actualizado`, frases anteriores de compatibilidad o variaciones claras que aprueben el plan vigente. La aprobación debe registrarse con frase literal y normalizarse internamente como aprobación del plan.
- Si la respuesta del usuario es ambigua, condicional o parcial, no cambies el estado del plan ni habilites Build; pide confirmación explícita.
- Si actualizas un artefacto que estaba aprobado, cambia su estado a `requiere re-aprobación`, registra el cambio y no lo trates como aprobado hasta que el usuario apruebe de nuevo.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit creado con hash y mensaje completo, o razón concreta por la que no se creó;
- siguiente paso humano destacado usando el rótulo exacto `Siguiente paso para ti:`.
- No uses rótulos abreviados como `Siguiente:` cuando el humano debe actuar.
- Siguiente paso humano esperado: revisar y validar `[artifacts/FROMZERO_PLAN.md](artifacts/FROMZERO_PLAN.md)` y `[artifacts/FROMZERO_STATE.md](artifacts/FROMZERO_STATE.md)`; si está correcto, responder `Apruebo el plan`; si necesita cambios, pedir el ajuste.
