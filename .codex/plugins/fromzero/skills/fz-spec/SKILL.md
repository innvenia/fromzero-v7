---
name: fz-spec
description: "Usar automáticamente cuando el usuario pida definir, aclarar, aterrizar o preparar lo que se va a construir, aunque lo diga como 'prepara la especificación', 'define bien la app', 'ordena los requisitos', 'qué vamos a construir', 'convierte la documentación en una especificación' o 'convierte esta idea en un PRD'."
---

# fz-spec

## Frases simples que activan esta skill

- "Prepara la especificación."
- "Ordena los requisitos."
- "Define bien la app."
- "Convierte la documentación en una especificación."
- "Convierte esta idea en un PRD."
- "Antes de construir, aclaremos qué se va a hacer."

## Salida requerida

- Si esta skill se activa porque el usuario dijo `Apruebo el cuestionario`, tratar esa aprobación como orden metodológica suficiente para crear o actualizar `artifacts/FROMZERO_SPEC.md` en el mismo turno.
- No responder solo con estados como "Spec habilitada: si" o "Spec creada: no"; la salida debe crear la spec o explicar el bloqueo concreto que impidió crearla.
- Confirmar que `artifacts/FROMZERO_QUESTIONNAIRE.md` existe o explicar por qué no se creó.
- Confirmar que `artifacts/FROMZERO_CONTEXT.md` existe o explicar por qué no se creó.
- Confirmar que `artifacts/FROMZERO_QUESTIONNAIRE.md` no está en estado `borrador de preguntas`.
- Confirmar que `Modo Q&A ejecutado` es `si`.
- Confirmar que las preguntas críticas están respondidas o explícitamente diferidas.
- Rechazar la Spec si alguna pregunta crítica mantiene `Respuesta seleccionada` vacía, salvo que el usuario la haya diferido explícitamente y aprobado esa decisión.
- Rechazar la Spec si hubo cuestionario crítico y falta `## Resumen validado para Spec` en `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Usar `## Resumen validado para Spec` como fuente de entrada para consolidar visión, decisiones cerradas, diferidos aprobados, supuestos y correcciones antes de redactar la Spec.
- Antes de redactar cada sección, consultar `artifacts/FROMZERO_DECISIONS.md` y clasificar las fuentes como documentada, contradictoria o no documentada; citar como decisión documentada asumida lo que ya esté `aceptada` y derivar las contradicciones a la reconciliación de respuestas del dueño.
- Confirmar que el usuario revisó y aprobó explícitamente `artifacts/FROMZERO_QUESTIONNAIRE.md`; si pide ajustes, actualizar el cuestionario antes de crear o actualizar la spec.
- Crear o actualizar `artifacts/FROMZERO_SPEC.md` con la especificación cerrada y verificable usando `templates/spec.md` como contrato de estructura; incluye `## Metadatos` completo y verifica conformidad sección por sección antes de cerrar.
- Completar `## Resumen para el dueño` en lenguaje no técnico antes de las matrices: qué se construye, para quién, resultado esperado, fuera de alcance, decisiones grandes, riesgos y qué se pide aprobar. Esta sección no sustituye matrices, gates ni criterios técnicos.
- Si el entorno está en modo plan/sin escritura, explicar que `artifacts/FROMZERO_SPEC.md` aún no puede crearse y entregar una instrucción simple para habilitar escritura y continuar; no pedir al usuario que conozca reglas internas ni restricciones de la metodología.
- No pasar a plan ni crear `artifacts/FROMZERO_STATE.md` hasta que `artifacts/FROMZERO_SPEC.md` exista y el usuario lo apruebe o pida explícitamente usarlo como base.
- Si la spec fue creada o actualizada a partir de `Apruebo el cuestionario`, crear un commit automático cuando sea seguro: repositorio Git disponible, verificaciones aplicables pasadas, sin secretos, y stage limitado a los artefactos FromZero modificados por esta fase.
- El cierre debe mostrar el commit como hash corto y mensaje completo, por ejemplo `Commit: a9930be - docs(fromzero): define project specification`; no mostrar solo el hash.
- Si el commit automático no es seguro, no mostrar solo "commit sugerido"; explicar la razón concreta: sin Git, verificaciones fallidas, cambios ajenos mezclados, archivos sensibles o permiso de escritura insuficiente.
- Si `artifacts/FROMZERO_SPEC.md` ya existe y esta ejecución no cambió archivos, no reportar el commit como fallo; decir que no hubo cambios nuevos que guardar en Git.
- Si hay cambios sin commit previos, no usar una frase corta como "cambios previos mezclados" como explicación completa. Clasificar el caso:
  - si solo hay artefactos FromZero de esta fase o del checkpoint inmediato, crear el commit automático;
  - si hay artefactos FromZero y cambios ajenos, stagear solo los artefactos FromZero esperados cuando las rutas sean claras y dejar los cambios ajenos fuera del commit;
  - si no puede aislar los archivos con seguridad, explicar en lenguaje simple qué impide el commit y qué debe revisar el humano.
- Completar la matriz de cobertura del insumo: cada fuente listada y cada capacidad del inventario de `artifacts/FROMZERO_CONTEXT.md` tiene estado (cubierto, diferido con razón, excluido con razón) y sección de la spec que la cubre. Una fuente listada sin ninguna fila en la matriz invalida la spec.
- Completar la matriz de requisitos atomicos: cada requisito extraido de headings funcionales, subheadings, bullets obligatorios o filas de tabla tiene ID, dominio, fuente, heading, obligación, estado, sección donde se cubre y prueba/gate esperado.
- Si Context omitió un requisito obligatorio de una fuente prioritaria, agregarlo en la spec, registrar el cambio en `Registro de cambios` y no ocultar la diferencia.
- Completar la matriz de invariantes/gates: cada regla obligatoria de bootstrap, datos reales, naming, servicios internos, dependencias, inventario API, performance, limpieza de marcas de plantillas o consentimientos tiene ID, fuente, obligación, estado, comando/gate esperado y criterio bloqueante.
- Si Context omitió un invariante o gate de una fuente prioritaria, agregarlo en la spec, registrar el cambio en `Registro de cambios` y no ocultar la diferencia.
- Contrastar la spec contra las fuentes documentales prioritarias (`docs/PRD.md`, `docs/REFERENCE_*.md`, seguridad, escalabilidad, dependencia y bootstrap) además de `artifacts/FROMZERO_CONTEXT.md`. Si Context omitió una capacidad documentada, corregir Context o registrar la omisión como gap antes de cerrar la spec.
- Aplicar `checklists/cross-cutting.md`: ninguna capacidad del inventario de contexto queda fuera de la matriz de cobertura.
- No considerar cubierta una capacidad transversal crítica solo porque su módulo macro aparece en alcance. Búsqueda, command palette, redirecciones, dashboard, soft delete, file browser, notificaciones, ayuda, páginas públicas, contratos mobile/API, atajos, consentimiento, páginas de infraestructura, mantenimiento, setup wizard, jobs, configuración de módulos, tablas, seguridad y escalabilidad requieren filas propias cuando estén documentadas.
- No considerar cubierto un dominio transversal solo por una fila agregada. Auth/session, storage/files, billing/subscriptions, UI primitives, theme/branding, grid/module factory, custom fields, event bus/rules, notifications, import/export y API/errors/security requieren filas atomicas para estados, limites, TTLs, flows, workers, permisos, validaciones y pruebas documentadas.
- No considerar cubierto un invariante solo porque el Sprint mencione el área general. Orden de bootstrap, datos reales estrictos, naming dual, Core AI interno, dependencias vulnerables, inventario API, performance budgets exactos, limpieza de marca de templates y consent records requieren filas propias cuando estén documentados.
- Registrar en la sección KPIs y SLOs toda metrica numerica del insumo (cobertura de tests, performance, disponibilidad u otras), con el gate que la verificara; las relajaciones requieren justificación escrita.
- Declarar si el proyecto es multi-tenant o single-tenant y que controles condicionales aplican; registrar razón de toda no-aplicación.
- Verificar contradicciones contra `artifacts/FROMZERO_QUESTIONNAIRE.md`; si una decisión cambio, actualizar la pregunta y el Registro de cambios antes de cerrar.
- Bloquear la spec si una decisión del cuestionario contradice, reduce o difiere documentación prioritaria y no existe excepción explícita aprobada por el usuario con frase literal registrada.
- Completar `Decisiones del cuestionario`: cada decisión aprobada debe mapearse a una sección de la spec, su fuente documental y su estado de contradicción.
- Si actualizas un cuestionario o spec que ya estaba aprobado, cambia su estado a `requiere re-aprobación`, registra el cambio y pide nueva aprobación antes de habilitar la siguiente fase.
- Objetivo y fuera de alcance.
- Escenario de entrada: idea documentada o idea vaga/no escrita.
- Ruta de construcción: framework existente, framework nuevo o app sin framework.
- Validación crítica: problema, usuario objetivo, usuario no objetivo, casos excluidos, mercado, alternativas, diferenciación, comercialización y riesgos.
- Base para planificación: dependencias funcionales y técnicas, capacidades desbloqueantes, orden sugerido, riesgos por dominio, validaciones antes del primer Sprint y criterios para justificar un orden distinto en el Plan.
- Especialistas condicionales: registrar dominios aplicables, condición de activación,
  especialista esperado, insumos, estado y fallback. Usar `subagente real` solo si
  el runtime fue verificado; si no, usar `revisión secuencial`, `rol documental` o
  `no aplica` con razón.
- Zonas de validación humana: registrar auth/sesiones, permisos/RLS/RBAC,
  billing/pagos/webhooks, migraciones destructivas, eliminación/exportación de
  datos, secretos/deploy y legal/compliance con estado `no aplica`, `requiere
  aprobación`, `aprobada` o `bloqueada`. Todo `no aplica` requiere razón.
- Automatización vs augmentación: completar solo si hay hooks, loops, schedules,
  monitores, jobs recurrentes o procesos automatizados. Registrar juicio humano,
  tolerancia a 80% correcto, costo del fallo, detección, rollback y evidencia.
- Evaluación de agentes futuros: recomendar `database` solo con RLS compleja,
  migraciones, índices, ownership o Supabase/Postgres crítico; recomendar
  `integrations` solo con webhooks, billing, retries, idempotencia o rate limits.
  No crear agentes nuevos desde esta skill.
- Datos, ownership y `tenant_id`.
- Inventario de tablas, pivotes e historiales documentados, con estado cubierto/diferido/excluido.
- Jobs programados documentados, con condición, frecuencia, ownership, pruebas y gate.
- Acciones RBAC.
- UI, i18n y estados.
- Integraciones detectadas y recursos seleccionados desde `library/manifest.json`.
- Categoría aplicada desde `library/categories.json` cuando no haya recurso específico.
- Recurso faltante y estrategia de resolución cuando aplique.
- Variables requeridas para `.env.example` y secretos que deben vivir fuera del repo.
- Placeholders de integraciones aunque queden apagadas por defecto.
- Impacto arquitectonico y condiciones de activación de decisiones diferidas.
- Estrategia de Dev, Test/Staging y Producción separados cuando aplique.
- Estrategia de timezone por tenant y usuario.
- Reglas de auditoría: fecha/hora y usuario en acciones sobre registros.
- Base común de APIs: método, auth, tenant context, RBAC, RLS, rate limit, DTO, errores y auditoría.
- Guía inicial de formularios por complejidad: simple, seccionado, tabs o wizard.
- Decisiones de cache, jobs, queries, load y scale.
- Pruebas unit, integration, E2E, visual y k6 cuando aplique.
- Seguridad y escalabilidad por módulo o capacidad cuando el insumo las detalle.
- Gates de integración: RLS/RBAC, webhooks, quality gate, mobile build, deployment, budget o load.
- Riesgos y preguntas bloqueantes.

### Reconciliación de respuestas del dueño

Cuando una decisión nueva o más profunda cambie, normalice o contradiga una respuesta
ya registrada, no actualices Plan ni State en silencio. Construye una tabla trazable y
preséntala para aprobación explícita del dueño:

| Pregunta | Respuesta normalizada | Fuente | Decisión | Artefacto a actualizar | Estado | Dueño |
|---|---|---|---|---|---|---|
|  |  |  |  |  | aceptada \| explicación \| aprobación \| diferida \| rechazada |  |

Reglas de bloqueo:

- Si una fila queda `rechazada` o como contradicción no resuelta, detén el cierre de
  Spec; no avances a Plan ni a Build.
- Al aprobar, aplica la retropropagación en el mismo cambio: actualiza la pregunta en
  `artifacts/FROMZERO_QUESTIONNAIRE.md` (con fila en su Registro de cambios) y la fila
  correspondiente en `artifacts/FROMZERO_DECISIONS.md`.
- Esta tabla es de cambios; es distinta de `## 5.6 Contraste de decisiones` del plan,
  que solo verifica consistencia.

## Artefacto obligatorio

Archivo requerido:

```text
artifacts/FROMZERO_SPEC.md
```

El archivo debe incluir:

- fuentes usadas;
- resumen para el dueño;
- matriz de cobertura del insumo;
- registro de cambios;
- matriz de requisitos atomicos;
- matriz de invariantes y gates;
- decisiones tomadas desde `artifacts/FROMZERO_QUESTIONNAIRE.md`;
- resumen validado para Spec cuando hubo cuestionario crítico;
- contradicciones aprobadas explícitamente o bloqueo si existen sin aprobación;
- escenario de entrada;
- ruta de construcción;
- validación crítica de problema, usuario, mercado y comercialización;
- usuario objetivo, usuario no objetivo y casos de uso excluidos;
- alcance;
- fuera de alcance;
- módulos;
- usuarios y roles;
- datos y ownership;
- permisos y RBAC;
- UI y referencia visual;
- integraciones;
- seguridad;
- escalabilidad;
- variables de entorno y placeholders;
- estrategia de activación para capacidades diferidas;
- timezone e i18n;
- auditoría y logs;
- contrato base de APIs;
- estrategia inicial de formularios;
- criterios de aceptación;
- base para planificación;
- especialistas condicionales;
- zonas de validación humana;
- automatización vs augmentación cuando aplique;
- KPIs y SLOs;
- riesgos;
- decisiones pendientes o diferidas;
- estado de aprobación.

Si no puede escribir archivos, usa esta frase:

```text
La especificación está lista, pero estoy en modo plan/sin escritura y no puedo guardarla todavía. El siguiente paso es cambiar a un modo con escritura y decir: "guarda la especificación para revisión". Esta acción solo registra la especificación; después podrás revisarla, pedir cambios o aprobarla antes de pasar al plan.
```

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
- No cierres solo con `Pendiente: aprobar artifacts/FROMZERO_SPEC.md`; usa una frase humana con enlace, por ejemplo: `Siguiente paso para ti: revisa y valida [artifacts/FROMZERO_SPEC.md](artifacts/FROMZERO_SPEC.md). Si todo está correcto, responde "Apruebo la especificación". Si quieres cambiar algo, dime qué ajuste hago.`
