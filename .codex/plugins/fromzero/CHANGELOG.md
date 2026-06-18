# Changelog

Todos los cambios relevantes del adaptador Codex `fromzero` deben registrarse en este archivo.

Formato:

- Versión siguiendo SemVer.
- Fecha en formato `YYYY-MM-DD`.
- Cambios agrupados por tipo: `Added`, `Changed`, `Fixed`, `Removed`, `Security`.

## 0.4.33 - 2026-06-16

### Changed

- Cobertura de verificación visual en navegador completada en el checklist de Release y en Handoff.
- Versión del adaptador actualizada a `0.4.33`.

## 0.4.32 - 2026-06-16

### Added

- Verificación visual en navegador en el stack de validación: render real y consola/red con el navegador integrado o la extensión del agente, además de Playwright, en UI, Build y Release. Si no hay navegador disponible, se registra el fallback.

### Changed

- Versión del adaptador actualizada a `0.4.32`.

## 0.4.31 - 2026-06-16

### Added

- Resumen para el dueño en Spec, Plan y State.
- Aceptación de producto contra visión validada en Release y Handoff.

### Changed

- Versión del adaptador actualizada a `0.4.31`.

## 0.4.30 - 2026-06-15

### Added

- Controles condicionales para especialistas, zonas humanas y automatización.
- Templates locales para gotchas y feedback metodológico exportable.
- Validación semántica determinística separada con `check-artifacts.mjs --semantic`.

### Changed

- Build bloquea solo por zonas humanas críticas pendientes o bloqueadas.
- Runtime smoke distingue subagente real, revisión secuencial y rol documental.
- Versión del adaptador actualizada a `0.4.30`.

### Fixed

- Aprobación de plan acepta intención explícita y variantes claras.
- README refleja `fz-design` condicional antes de Plan/State.
- `check-artifacts.mjs` evita falsos positivos semánticos en templates.

## 0.4.29 - 2026-06-15

### Changed

- Context registra entendimiento inicial, usuario objetivo, usuario no objetivo y supuestos antes del Q&A crítico.
- Questionnaire opera como entrevista guiada por ciclos y cierra con resumen validado para Spec.
- Decisiones técnicas críticas usan tarjetas de decisión en lenguaje común.
- Spec incluye `Base para planificación` y Plan debe justificar divergencias.
- Build conserva gates actuales y refuerza la verificación de artefactos aprobados.
- Versión del adaptador actualizada a `0.4.29`.

## 0.4.28 - 2026-06-14

### Changed

- La instalación local debe reparar `fromzero-local` si apunta a una ruta anterior.
- La verificación manual no debe depender de marketplaces globales obsoletos.
- Versión del adaptador actualizada a `0.4.28`.

## 0.4.27 - 2026-06-14

### Changed

- Los artefactos generados por la metodología viven bajo `artifacts/`.
- ADRs, module specs, test plans, k6 scenarios, handoffs e issues exportados tienen subdirectorios canónicos bajo `artifacts/`.
- `init-project.mjs` genera `artifacts/START_HERE.md`.
- Resolver, checkpoint y validador usan `artifacts/` como raíz canónica de artefactos.
- Versión del adaptador actualizada a `0.4.27`.

## 0.4.26 - 2026-06-14

### Added

- Revisión adversarial determinística como complemento de cobertura del plan.
- Validación bloqueante de conteos REQ/GATE con pendientes sin resolver.
- Tool `git-checkpoint.mjs` para clasificar working tree antes de commits automáticos.
- Tool `runtime-smoke.mjs` para registrar capacidades reales antes de activar runtime.

### Changed

- La heurística documental no reemplaza prioridades explícitas.
- `init-project.mjs` reporta drift estructural sin reescribir artefactos aprobados.
- `hooks` sigue sin declararse en manifest hasta smoke real y trust review.
- `FIRST_STEPS.md` usa guía común neutral por plataforma.
- Versión del adaptador actualizada a `0.4.26`.

## 0.4.25 - 2026-06-14

### Added

- Encabezado común `## Metadatos` para artefactos y templates auxiliares.
- Validador `check-artifacts.mjs` empaquetado en el adaptador.

### Changed

- Frase canónica de aprobación del plan: `Apruebo el plan`.
- La continuación de ejecución solo reanuda planes ya aprobados.
- Textos visibles cambian a "verificaciones" y el banner de modo plan queda menos agresivo.
- Versión del adaptador actualizada a `0.4.25`.

## 0.4.24 - 2026-06-12

### Changed

- Context debe extraer invariantes y gates desde reglas no funcionales de `docs/`.
- Spec debe incluir matriz de invariantes/gates con prueba esperada y criterio bloqueante.
- Plan debe trazar invariantes/gates hacia Sprint, archivos, comando y criterio de cierre.
- Se agregan gates para bootstrap order, data real, naming dual, servicios internos, dependencias, inventario API, performance, marcas de plantillas y consent records.
- Release bloquea vulnerabilidades críticas/altas, endpoints sin owner y KPI de performance sin excepción aprobada.
- Versión del adaptador actualizada a `0.4.24`.

## 0.4.23 - 2026-06-12

### Changed

- Context debe extraer requisitos atomicos desde headings, bullets y tablas.
- Spec debe incluir matriz de requisitos atomicos y registro de cambios.
- Plan debe trazar cada requisito atomico hacia Sprint, archivos, pruebas y gates.
- Se agrega taxonomía obligatoria para auth, storage, billing, UI, theme, grid, custom fields, event bus, notifications, import/export y API/security.
- Planes actualizados tras rechazo deben quedar en revisión y usar frase exacta de aprobación.
- Versión del adaptador actualizada a `0.4.23`.

## 0.4.22 - 2026-06-12

### Changed

- La exploración prioriza documentos clave de `docs/` antes del resto.
- Context debe registrar fuentes leídas, truncadas u omitidas.
- Spec debe contrastarse contra fuentes prioritarias, no solo contra Context.
- Plan debe trazar capacidades documentadas hacia Sprint, archivos, pruebas y gates.
- Los rechazos de plan bloquean ejecución y dejan State en revisión.
- Versión del adaptador actualizada a `0.4.22`.

## 0.4.21 - 2026-06-12

### Changed

- Cada fase exitosa debe crear commit automático seguro sin esperar solicitud del usuario.
- El cierre debe mostrar commit con hash corto y mensaje completo.
- Los artefactos revisables deben mostrarse como enlaces Markdown.
- `Siguiente paso para ti:` debe indicar revisar, aprobar, corregir o continuar.
- Los cierres priorizan claridad humana sobre brevedad excesiva.
- Versión del adaptador actualizada a `0.4.21`.

## 0.4.20 - 2026-06-12

### Changed

- El cierre de Spec debe usar `Siguiente paso para ti:` y pedir revisar, validar y aprobar la especificación.
- Codex no debe usar `Siguiente:` como rótulo abreviado cuando el humano debe actuar.
- Cuando no hay cambios nuevos, el commit no debe reportarse como fallo.
- Los bloqueos por cambios previos deben explicar si son artefactos FromZero, cambios ajenos o una mezcla.
- Si puede aislar artefactos FromZero esperados, Codex debe stagear solo esos archivos y crear el commit automático.
- Versión del adaptador actualizada a `0.4.20`.

## 0.4.19 - 2026-06-12

### Changed

- El cierre de Spec ahora destaca el siguiente paso humano: revisar `FROMZERO_SPEC.md` y aprobar o pedir cambios.
- `Apruebo la especificación`, `Apruebo la spec` y `Apruebo el spec` disparan `fz-plan` automáticamente cuando no hay bloqueos.
- Las fases activadas por aprobación explícita deben crear commit automático si Git y el stage son seguros.
- El cierre ya no debe quedarse solo en `commit sugerido` cuando el commit automático puede crearse.
- Versión del adaptador actualizada a `0.4.19`.

## 0.4.18 - 2026-06-12

### Changed

- Aprobar el cuestionario ahora dispara la creación o actualización de `FROMZERO_SPEC.md` cuando hay escritura.
- Codex no debe cerrar con estados pasivos como "Spec habilitada" si la especificación no fue creada.
- Si la especificación no puede crearse, Codex debe explicar el bloqueo concreto y la siguiente acción.
- El prompt para guardar la especificación se simplifica a `guarda la especificación para revisión`.
- El plan sigue bloqueado hasta que la especificación exista y sea aprobada.
- Versión del adaptador actualizada a `0.4.18`.

## 0.4.17 - 2026-06-12

### Changed

- La aprobación del cuestionario de Codex se simplifica a `Apruebo el cuestionario`.
- Codex debe interpretar esa aprobación como autorización para continuar con la especificación.
- El usuario ya no debe indicar la siguiente fase ni repetir restricciones internas de la metodología.
- El plan sigue bloqueado hasta que la especificación exista y sea aprobada.
- Versión del adaptador actualizada a `0.4.17`.

## 0.4.16 - 2026-06-12

### Changed

- El cierre del Q&A de Codex reemplaza la instrucción restrictiva anterior por una frase menos intimidante para usuarios no técnicos.
- El prompt visible ahora pide guardar el cuestionario respondido para revisión y esperar aprobación antes de continuar.
- El cierre aclara que esta acción solo registra el cuestionario y no inicia la siguiente fase.
- Versión del adaptador actualizada a `0.4.16`.

## 0.4.15 - 2026-06-12

### Changed

- El cuestionario de Codex debe explicar antes de iniciar que puede tener varios ciclos, opciones recomendadas y respuesta abierta.
- Las decisiones claras de la documentación se registran como asumidas y no se preguntan como si fueran opcionales.
- El cierre del Q&A en modo plan explica que registrar el cuestionario en el proyecto es obligatorio antes de continuar.
- El prompt visible de registro ya no exige que el usuario conozca el nombre técnico del archivo.
- Versión del adaptador actualizada a `0.4.15`.

## 0.4.14 - 2026-06-12

### Changed

- El cuestionario de Codex define que las preguntas no son aleatorias: salen de gaps, riesgos o decisiones reales del proyecto.
- Los patrones predefinidos quedan como guía de redacción para temas recurrentes, no como preguntas genéricas obligatorias.
- `FROMZERO_QUESTIONNAIRE.md` separa pregunta visible, contexto, ayuda por opción y notas internas técnicas.
- Se agregan patrones claros para documentación inconsistente, versiones del stack, Supabase y permisos multi-tenant.
- Versión del adaptador actualizada a `0.4.14`.

## 0.4.13 - 2026-06-11

### Changed

- El cuestionario de Codex debe redactar preguntas visibles para usuarios no técnicos y ocultar jerga interna del plugin.
- La decisión de UI ahora se pregunta como elección entre usar la UI de FromZero, usar una referencia externa o dejar UI para después.
- Términos como "fuente canónica", "referencia empaquetada", "template externo" o rutas internas quedan como notas técnicas, no como texto para el usuario.
- Versión del adaptador actualizada a `0.4.13`.

## 0.4.12 - 2026-06-11

### Changed

- Los prompts visibles para iniciar el cuestionario ya no exigen que el usuario nombre artefactos `FROMZERO_*`.
- `START_HERE.md` usa prompts simples: activar modo `PLAN`, iniciar el cuestionario, no avanzar a especificación, planificación ni ejecución.
- Las frases de continuación de `fz-context` y `fz-spec` ocultan nombres de archivos técnicos y mantienen las reglas internas de Codex.
- Versión del adaptador actualizada a `0.4.12`.

## 0.4.11 - 2026-06-11

### Changed

- El aviso de Q&A ahora pide activar explícitamente el modo `PLAN` de Codex antes de continuar, en vez de afirmar que ya está activo.
- `START_HERE.md` limita la fase inicial a `FROMZERO_CONTEXT.md` y bloquea `FROMZERO_SPEC.md`, `FROMZERO_PLAN.md` y `FROMZERO_STATE.md` hasta sus fases correspondientes.
- Reglas del adaptador aclaran que `FROMZERO_STATE.md` no se crea durante Context ni Questionnaire.
- Versión del adaptador actualizada a `0.4.11`.

## 0.4.10 - 2026-06-11

### Changed

- `fz-context` ya no debe crear `FROMZERO_QUESTIONNAIRE.md` definitivo antes de ejecutar Q&A real en modo plan de Codex.
- `FROMZERO_QUESTIONNAIRE.md` distingue borrador, Q&A ejecutado, respuestas críticas vacías y aprobación antes de habilitar Spec.
- `START_HERE.md`, `FIRST_STEPS.md`, reglas del adaptador, templates y checklists separan Context, Questionnaire, Spec, Plan, State y Build.
- `FROMZERO_CONTEXT.md` agrega preguntas candidatas para preparar el Q&A sin simular el cuestionario final.
- Versión del adaptador actualizada a `0.4.10`.

## 0.4.9 - 2026-06-11

### Changed

- El cierre de instalación recomienda inicializar Git cuando el proyecto no tiene repositorio, con justificación simple.
- `START_HERE.md` reemplaza la verificación redundante de FromZero por preparación de control de versiones.
- Versión del adaptador actualizada a `0.4.9`.

## 0.4.8 - 2026-06-11

### Changed

- El bloque final obligatorio de instalación usa enlace Markdown a `START_HERE.md` para mantener apertura clickeable en Codex.
- Las reglas del adaptador exigen conservar el enlace Markdown al copiar el cierre.
- Versión del adaptador actualizada a `0.4.8`.

## 0.4.7 - 2026-06-11

### Changed

- `tools/init-project.mjs` emite un bloque `Mensaje final obligatorio para el usuario` para evitar cierres resumidos por Codex.
- Las reglas del adaptador exigen copiar literalmente el bloque final de instalación.
- Versión del adaptador actualizada a `0.4.7`.

## 0.4.6 - 2026-06-11

### Changed

- `tools/init-project.mjs` reporta la versión instalada del plugin FromZero en el cierre de instalación.
- Las reglas del adaptador exigen confirmar que `START_HERE.md` contiene las instrucciones para inicializar la metodología.
- Versión del adaptador actualizada a `0.4.6`.

## 0.4.5 - 2026-06-11

### Changed

- `fz-context` exige análisis crítico de la idea o proyecto antes de especificar, no solo detección de faltantes.
- El cuestionario crítico se ejecuta en modo plan de Codex. El mensaje visible original de esta versión fue reemplazado en `0.4.25` por una redacción menos agresiva.
- `FROMZERO_QUESTIONNAIRE.md` requiere revisión, ajustes o aprobación explícita antes de crear `FROMZERO_SPEC.md`.
- `tools/resource-resolver.mjs --install` mantiene `library/ui-template-reference` dentro del plugin y no lo copia al proyecto destino.
- Reglas y `START_HERE.md` documentan el flujo completo hasta Spec, Plan, State y Build.
- Versión del adaptador actualizada a `0.4.5`.

## 0.4.4 - 2026-06-11

### Added

- `tools/init-project.mjs` muestra un mensaje final de instalación correcta, ubicación de `START_HERE.md` y recomendación de lectura.

### Changed

- `tools/init-project.mjs` sobrescribe siempre `START_HERE.md` durante la instalación.
- Versión del adaptador actualizada a `0.4.4`.

## 0.4.3 - 2026-06-11

### Changed

- `.codex-plugin/plugin.json` elimina el campo `hooks` para cumplir la validación actual de plugins Codex.
- `defaultPrompt` se reduce a tres prompts visibles para respetar el límite efectivo de Codex.
- `tools/resource-resolver.mjs` usa matching con límites de palabra para reducir falsos positivos por substring.
- `tools/resource-resolver.mjs` bloquea sobrescrituras de recursos instalados modificados salvo uso explícito de `--force`.
- Triggers MCP específicos dejan de activarse por la palabra genérica `mcp`.

### Fixed

- `README.md`, `FIRST_STEPS.md` y `tools/README.md` documentan que los hooks quedan empaquetados como referencia operativa, no declarados en el manifiesto Codex.

## 0.4.2 - 2026-06-11

### Fixed

- `AGENTS.md` ahora exige que toda explicación o resumen de FromZero preserve el análisis crítico del insumo como gate obligatorio antes de Spec, Plan o Build.
- `AGENTS.md` aclara que el resolver es solo apoyo para detectar recursos internos y no reemplaza `FROMZERO_CONTEXT.md`, gaps, contradicciones, riesgos ni cuestionario crítico.

## 0.4.1 - 2026-06-11

### Added

- Validación de versiones, changelog, marketplace local y semántica de `library/manifest.json` en `tools/sync-adapters.mjs --check`.
- `tools/resource-resolver.mjs` escanea documentación del proyecto, artefactos `FROMZERO_*.md` y `.fromzero/` con límites seguros.
- `--docs <ruta>` repetible en `tools/resource-resolver.mjs`.
- `--dry-run`, `--force-agent-dir` y lock `.agent/.fromzero-install.json` en `tools/init-project.mjs` para Antigravity.

### Changed

- Instalación Codex documentada como marketplace de repo completo con fallback manual.
- Documentación de librería alineada a librerías empaquetadas por adapter y paridad validada.
- Gates genéricos de k6 y módulo condicionan `Grid` y `Core AI` al From Zero Framework.

### Fixed

- El resolver ya no ignora `docs/`, `documentation/`, artefactos FromZero ni recursos instalados en `.fromzero/`.
- La materialización Antigravity bloquea sobrescrituras de `.agent/` no administradas.

## 0.4.0 - 2026-06-10

### Added

- Skill `fz-design` para la fase Design, con frases simples y cierre contra el gate Design.
- Bloque estándar "Cierre de fase" en todas las skills.
- Recursos MCP: `library/resources/mcp.md`, entradas `mcp-supabase` y `mcp-sonarqube` en `library/manifest.json`, y `.mcp.json` vacío por defecto.
- Agents con frontmatter (`name`, `description`) e instrucciones operativas como subagentes.
- `tools/check-evidence.mjs` para recordatorios de evidencia por sesión y cierre.
- `tools/init-project.mjs` genera el bloque FromZero en el `AGENTS.md` del proyecto destino.
- Marketplace local del repositorio (`.agents/plugins/marketplace.json`) como vía oficial de instalación.

### Changed

- `templates/spec.md` agrega Escenario de entrada y ruta de construcción, Validación crítica, Alcance y Entornos.
- `templates/issue.md` agrega Sprint asociado, Dependencias, Condiciones de activación y la lista completa de gates.
- `templates/github-issue.md` renombrado a `templates/issue.md` (paridad con los demás adaptadores).
- La referencia UI empaquetada (`library/ui-template-reference`) queda declarada fuente canónica del Design System; el template upstream solo la refresca.
- Checklists comunes reescritos en español y alineados con los gates.
- `README.md` del proyecto destino tratado como archivo vivo (context, build y release).
- `fz-tdd` exige plan de pruebas por Sprint con `templates/test-plan.md`.
- Política de versionado lockstep documentada en `docs/packaging.md`.
- Terminología del From Zero Framework (Core AI, Grid, base/app derivada) condicionada vía `docs/glossary.md`.

### Fixed

- Numeración duplicada "1." en el diagrama Mermaid de `FIRST_STEPS.md`.
- `tools/resource-resolver.mjs` y `tools/README.md` pasan a fuente común con control de drift.
- Hooks Codex migrados a `hooks/hooks.json` oficial y declarados en `plugin.json`.
- Triggers de `fromzero-ui-template` amplían detección de UI, interfaz y pantallas.

## 0.3.1 - 2026-06-10

### Fixed

- Reglas de instalación endurecidas para impedir scaffolds genéricos cuando ya existe el adaptador FromZero.
- `START_HERE.md` queda definido como entregable obligatorio de instalación, no reemplazable por `AGENTS.md`.
- La instalación exige verificar `templates/start-here.md` y `tools/init-project.mjs` antes de cerrar.
- Se aclara que el nombre del directorio raíz del proyecto destino no afecta el identificador del plugin.
- Se agrega regla de no instalar cuando el usuario pida solo diagnóstico o corrección metodológica.

## 0.3.0 - 2026-06-10

### Added

- Template `templates/start-here.md` para generar `START_HERE.md` en proyectos destino.
- Script `tools/init-project.mjs` para crear o actualizar la guía inicial del proyecto.
- Instrucciones de instalación para generar `START_HERE.md` después de copiar el plugin.

### Changed

- Regla global de numeración visible desde `1` ampliada a pasos, fases, Sprints, etapas e items.
- `fz-context` verifica `START_HERE.md` al iniciar un proyecto.

## 0.2.0 - 2026-06-10

### Added

- Artefacto obligatorio `FROMZERO_CONTEXT.md` para análisis crítico del insumo.
- Matriz de cobertura requisito/capacidad -> spec.
- Checklist de capacidades transversales.
- Sección de KPIs y SLOs como gates verificables.
- Trazabilidad criterios -> Sprints y validación de cierre del plan.
- Gobernanza de paridad vía `core/`, `parity-manifest.json` y `sync-adapters.mjs`.

### Changed

- Templates FromZero pasan a ser contratos de estructura.
- Design System queda formalizado con fuente canónica y copia empaquetada.
- Jerarquía de insumos se desacopla de documentos de un proyecto específico.
- Adaptador alineado a versión común de metodología `0.2.0`.

### Fixed

- Validación bidireccional entre insumo, spec, plan y estructura física.
- Retropropagación obligatoria cuando cambian decisiones del cuestionario.
- Controles multi-tenant, billing y UI pasan a aplicabilidad condicional documentada.

## 0.1.5 - 2026-06-10

### Added

- Artefacto operativo central `FROMZERO_STATE.md` mediante `templates/state.md`.
- Flujo de reanudación con frases simples: "Continúa con la ejecución del proyecto" y "Ejecuta el siguiente Sprint".
- Regla para que `fz-plan`, `fz-build` y `fz-handoff` lean y actualicen `FROMZERO_STATE.md`.
- Reglas de reconstrucción segura del estado desde plan, spec y Git cuando el estado falte o esté desactualizado.

### Changed

- `FROMZERO_PLAN.md` deja de ser el único punto de reanudación y queda complementado por `FROMZERO_STATE.md`.
- Documentación central y adaptadores alineados para que el usuario no tenga que conocer el número del siguiente Sprint.
- `FIRST_STEPS.md` elimina referencias a numeración inferior a `1` en el mapa del proceso.

## 0.1.4 - 2026-06-10

### Added

- Plantilla base `templates/plan.md` para planes consistentes y flexibles.
- Regla explícita: la numeración visible empieza en Sprint 1.
- Regla explícita: no se permite numeración inferior a `1` en Sprints, fases ni etapas.
- Sprint 1 debe cubrir preparación/base inicial o marcarse como completado si ya ocurrió antes del plan.
- Secciones de README para explicar consistencia de artefactos sin rigidez.

### Changed

- Reglas de `fz-plan`, gates, phases y handoff reemplazan referencias a numeración cero por Sprint 1 de preparación/base inicial.
- Adaptadores Claude Code y antigravity alineados con numeración desde Sprint 1.

## 0.1.3 - 2026-06-10

### Added

- Explicación del posicionamiento metodológico de FromZero como Spec-Driven extendido.
- Comparación simple contra Vibe Coding, Spec Driven Development y SDLC.
- Sección `Why` para explicar ventajas, beneficios y razón de enfoque.

### Changed

- README del adaptador Codex actualizado para comunicar mejor el valor de FromZero.

## 0.1.2 - 2026-06-10

### Added

- Gate de Plan para confirmar commit base o explicar bloqueo antes de implementar.
- Requisito de Sprint 1 de preparación/base inicial o base inicial marcada como cubierta.
- Reporte obligatorio de lista de Sprints con título, objetivo, dependencias y criterio de éxito.
- Resumen obligatorio del diff documental de `FROMZERO_SPEC.md`, `FROMZERO_QUESTIONNAIRE.md` y `FROMZERO_PLAN.md`.
- Verificación de secretos antes de pedir stage/commit.
- Siguiente aprobación explícita con mensaje Conventional Commit propuesto.

### Changed

- `fz-plan` ahora crea o actualiza `FROMZERO_PLAN.md` con salida de revisión mas clara.
- `fz-handoff` ahora incluye estado Git, preparación/base inicial, Sprints y aprobación siguiente.
- Adaptadores Claude Code y antigravity quedan alineados con las reglas de plan.

## 0.1.1 - 2026-06-10

### Added

- Regla de Context para verificar `.git` antes de cualquier escritura.
- Solicitud obligatoria de aprobación antes de inicializar Git cuando falta `.git`.
- Checklist de Context con estado Git y riesgo documentado.
- Guardrail para bloquear cambios complejos sin control de versión confirmado.
- Regla de trazabilidad: cada actualización del plugin debe incrementar versión y actualizar changelog.

### Changed

- `fz-context` reporta estado Git como parte del diagnóstico inicial.
- La metodología central documenta Git como control temprano de trazabilidad, rollback y revisión.
- Adaptadores Claude Code y antigravity quedan alineados con la validación Git en Context.

## 0.1.0 - 2026-06-07

### Added

- Versión inicial del adaptador Codex `fromzero`.
- Skills, agentes, checklists, templates, hooks, librería interna y resolver local.
