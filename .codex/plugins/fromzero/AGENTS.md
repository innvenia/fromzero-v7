# FromZero Codex Adapter

## Inicialización del proyecto destino

- Si el usuario pide instalar o actualizar el plugin Codex FromZero en un proyecto, instala el adaptador y crea o actualiza `artifacts/START_HERE.md`.
- No uses scaffold, `plugin-creator`, `create_basic_plugin.py` ni ningún generador de plugin nuevo para instalar FromZero. FromZero ya tiene adaptador versionado.
- Antes de instalar, localiza la fuente del adaptador y verifica que contiene `.codex-plugin/plugin.json`, `AGENTS.md`, `FIRST_STEPS.md`, `skills/`, `library/`, `templates/start-here.md` y `tools/init-project.mjs`.
- Si la fuente indicada es `methodology/from_zero`, deriva cualquier marketplace local desde su ancestro que contiene `.agents/plugins/marketplace.json`; no reutilices una entrada global `fromzero-local` si apunta a otra ruta.
- Si `CODEX_HOME/config.toml` tiene `[marketplaces.fromzero-local]` apuntando a una ruta inexistente o distinta de la fuente actual, corrige esa entrada antes de usar `codex plugin list`; si no es seguro corregirla, omite esa verificación y reporta la razón.
- Copia el adaptador completo. No copies solo `.codex-plugin/plugin.json` ni una skill aislada.
- Para Codex, el destino esperado del plugin es `.codex/plugins/fromzero`.
- Después de copiar o actualizar el plugin, ejecuta cuando sea posible: `node .codex/plugins/fromzero/tools/init-project.mjs --project <ruta-del-proyecto> --app Codex`. Esto genera `artifacts/START_HERE.md` y el bloque FromZero en el `AGENTS.md` del proyecto.
- Verifica como Definition of Done: `.codex/plugins/fromzero/.codex-plugin/plugin.json`, `.codex/plugins/fromzero/templates/start-here.md`, `.codex/plugins/fromzero/tools/init-project.mjs`, `artifacts/START_HERE.md` y bloque FromZero en `AGENTS.md` del proyecto.
- No sustituyas `artifacts/START_HERE.md` por `AGENTS.md`; son artefactos distintos.
- `artifacts/START_HERE.md` se sobrescribe siempre desde `templates/start-here.md` durante instalación o actualización.
- Al cerrar la instalación o actualización, copia literalmente el bloque `Mensaje final obligatorio para el usuario` mostrado por `tools/init-project.mjs`. No lo resumas, no lo sustituyas por una lista propia y conserva el enlace Markdown a `artifacts/START_HERE.md`.
- Si el proyecto no tiene Git inicializado, recomienda inicializarlo antes de ejecutar FromZero para guardar el punto de partida, revisar cambios del agente y volver atrás.
- El archivo visible se llama `artifacts/START_HERE.md`, no `FROMZERO_START_HERE.md`.
- El nombre del directorio raíz del proyecto destino no importa para instalar el plugin. No lo trates como incidencia por no ser kebab-case.
- No uses pasos, fases, Sprints, etapas ni items visibles numerados como `0`.
- Si el usuario pide no instalar, no copies archivos ni ejecutes `init-project.mjs`; limita la respuesta a diagnóstico, plan o corrección metodológica.

## Orden obligatorio

1. Si el usuario pide revisar, iniciar, validar, aterrizar, preparar o crear un proyecto, usa `fz-context` automáticamente.
2. Clasifica si trae idea documentada o idea vaga/no escrita.
3. Clasifica la ruta: framework existente, framework nuevo o app sin framework.
4. Registra decisión de UI: framework, referencia del usuario, UI generado o sin UI.
5. Valida críticamente problema, usuario, mercado, tecnología, alcance, seguridad, riesgos, operación y comercialización antes de planear. No te limites a listar faltantes.
6. Crea o actualiza `artifacts/FROMZERO_CONTEXT.md` con análisis crítico, gaps, supuestos débiles, mejoras propuestas e inventario de capacidades. Usa `docs/` como directorio estándar de insumos: idea vaga en `docs/PROJECT_BRIEF.md`, PRD sin ruta en `docs/PRD.md` y documentación en carpeta solo con ruta real indicada.
7. Si después del contexto hay dudas críticas, muestra `Activa el modo plan de Codex antes de continuar.` como cita Markdown y explica que el siguiente paso de FromZero usa el modo plan para hacer el cuestionario más guiado y fácil de revisar.
8. No crees `artifacts/FROMZERO_QUESTIONNAIRE.md` definitivo antes de ejecutar Q&A real con respuestas, correcciones o decisiones diferidas. Si Codex no puede activar modo plan desde la conversación actual, detente después de `artifacts/FROMZERO_CONTEXT.md`, pide activar modo plan o abrir una conversación en modo plan, y no simules el cuestionario como archivo final.
9. Crea o actualiza `artifacts/FROMZERO_QUESTIONNAIRE.md` solo después del Q&A real. Debe incluir preguntas, opciones, fuente documental por opción, explicación, respuesta seleccionada, notas, `Modo Q&A ejecutado: si` y estado de aprobación.
10. Detén el avance hasta que el usuario revise, ajuste o apruebe explícitamente `artifacts/FROMZERO_QUESTIONNAIRE.md`.
11. Crea o actualiza `artifacts/FROMZERO_SPEC.md` con `fz-spec` solo después de aprobar el cuestionario.
12. No pases a plan hasta que `artifacts/FROMZERO_SPEC.md` exista y esté aprobado o aceptado explícitamente como base.
13. No crees ni actualices `artifacts/FROMZERO_STATE.md` durante Context, Questionnaire o Spec. El estado operativo se crea al crear `artifacts/FROMZERO_PLAN.md`.
14. Define el diseño técnico con `fz-design` cuando aplique: schemas, APIs, permisos, jobs, cache, migraciones y ADRs. Si no aplica, registra `diseño técnico no requerido` con razón.
15. Planifica con `fz-plan`.
16. Crea o actualiza `artifacts/FROMZERO_STATE.md` como fuente de verdad operativa para reanudar.
17. Después de crear o actualizar `artifacts/FROMZERO_PLAN.md` y `artifacts/FROMZERO_STATE.md`, reporta diff documental, Sprint 1 de preparación/base inicial, lista de Sprints, estado Git, verificación de secretos y siguiente aprobación simple.
18. Implementa con `fz-build` leyendo `artifacts/FROMZERO_STATE.md` para detectar el siguiente Sprint aprobado.
19. Aplica verificaciones: `fz-tdd`, `fz-security`, `fz-ui`, `fz-scale`.
20. Cierra con `fz-release` y `fz-handoff`, actualizando `artifacts/FROMZERO_STATE.md`.

## Explicación de la metodología

- Al explicar o resumir FromZero, no omitas ni minimices el análisis crítico del insumo; debe aparecer como verificación obligatoria antes de Spec, Plan o Build.
- Presenta `tools/resource-resolver.mjs` solo como apoyo para detectar recursos internos; nunca como reemplazo de `artifacts/FROMZERO_CONTEXT.md`, gaps, contradicciones, riesgos y cuestionario crítico.
- Si una explicación previa omitió ese gate, corrígela explícitamente antes de continuar.

## Frases simples

El usuario no necesita nombrar skills.

| Si el usuario dice algo como | Usa |
|---|---|
| "Revisa este proyecto", "La documentación está en docs", "Ayúdame a empezar", "No tengo documentos", "Quiero crear una app de X" | `fz-context` |
| "Prepara la especificación", "Ordena los requisitos", "Convierte esta idea en un PRD" | `fz-spec` |
| "Define el diseño técnico", "Diseña la base de datos y las APIs" | `fz-design` |
| "Haz un plan", "Dime por dónde empezamos", "Apruebo la especificación", "Apruebo la spec", "Apruebo el spec" | `fz-plan` |
| "Antes de escribir código dime qué vas a probar" | `fz-tdd` |
| "Construye el primer paso", "Empieza a implementar", "Continúa con la ejecución del proyecto", "Ejecuta el siguiente Sprint" | `fz-build` |
| "Revisa si esto es seguro", "Valida permisos" | `fz-security` |
| "Revisa la UI", "Usa el diseño de FromZero" | `fz-ui` |
| "Revisa si esto escala", "Optimiza rendimiento" | `fz-scale` |
| "Valida todo antes de terminar", "Déjalo listo" | `fz-release` |
| "Resúmeme qué hiciste", "Qué falta", "Qué sigue" | `fz-handoff` |

## Estado centralizado

- `artifacts/FROMZERO_STATE.md` es la fuente de verdad operativa.
- `artifacts/FROMZERO_PLAN.md` define la ruta completa; `artifacts/FROMZERO_STATE.md` define dónde quedó el proyecto.
- El usuario no debe tener que saber el número del siguiente Sprint.
- Ante "continua" o "ejecuta el siguiente Sprint", lee `artifacts/FROMZERO_STATE.md`, valida `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git status`, y ejecuta el siguiente Sprint si el plan ya fue aprobado y no hay bloqueos.
- Antes de codificar un Sprint aprobado, muestra el resumen breve con Sprint, alcance, herramientas previstas, verificaciones y riesgos; si no hay bloqueos, termina con `Iniciando la ejecución del Sprint N.` y continúa automáticamente.
- Si `artifacts/FROMZERO_STATE.md` falta o está desactualizado, reconstrúyelo desde plan, spec y Git; explica la inferencia y pide confirmación antes de tocar código.
- Actualiza `artifacts/FROMZERO_STATE.md` al crear plan, aprobar plan, iniciar Sprint, completar Sprint, bloquear Sprint, cambiar verificaciones o hacer handoff.

## Cuestionario

- No esperes a que el usuario pida preguntas si el contexto deja dudas antes de especificar o planear.
- Antes de iniciar preguntas muestra como cita Markdown: `Activa el modo plan de Codex antes de continuar.`.
- Después del título, explica: `El siguiente paso de la metodología FromZero usa el modo plan para hacer el cuestionario más guiado y fácil de revisar.`
- Ejecuta el cuestionario en modo plan de Codex cuando esté disponible; si no puedes cambiar el modo programáticamente, anuncia el modo, pide activar modo plan o abrir conversación en modo plan, y no escribas `artifacts/FROMZERO_QUESTIONNAIRE.md` definitivo hasta tener respuestas reales.
- Antes del primer ciclo, explica que el cuestionario puede ser extenso, irá por ciclos o categorías, tendrá opciones recomendadas y permitirá respuesta abierta cuando la UI lo soporte.
- Si no hay documentos, usa el cuestionario para aterrizar la idea antes de crear la especificación.
- Cubre problema, usuario, mercado, alternativas, diferenciación, comercialización, datos, permisos, UI, seguridad, costos y operación.
- Registra la ruta de construcción: framework existente, framework nuevo o app sin framework.
- Redacta preguntas para usuarios no técnicos. No muestres rutas internas, "fuente canónica", "referencia empaquetada", "template externo" ni jerga de implementación como texto de pregunta u opción.
- Las preguntas no son aleatorias: salen de gaps, riesgos o decisiones reales del proyecto. Usa patrones predefinidos solo como guía para temas recurrentes y adapta pregunta, opciones y ayudas al contexto.
- No preguntes como opcional una decisión que la documentación ya define claramente; regístrala como asumida. Si hay contradicción o riesgo, pregunta por excepción, orden o profundidad.
- Cada opción debe tener etiqueta simple, impacto claro y ayuda visible. Registra términos técnicos, rutas, claims, SQL o versiones en notas internas, no en el texto principal.
- Para UI pregunta: `¿Cómo quieres definir la interfaz visual del proyecto?`. Opciones visibles: usar la UI de FromZero, usar una referencia externa o dejar UI para después. Guarda la clasificación técnica solo como nota interna.
- Usa `artifacts/FROMZERO_QUESTIONNAIRE.md` como bitácora editable solo después de ejecutar Q&A real, o márcalo explícitamente como `Estado: borrador de preguntas` y `Modo Q&A ejecutado: no`.
- Registra todas las preguntas generadas, aunque se presenten al usuario en ciclos de 3.
- Incluye opciones, fuente documental por opción, explicación de cada opción, recomendación, respuesta seleccionada, estado y notas.
- Actualiza el archivo después de cada ciclo de respuestas cuando exista con respuestas reales.
- Después de cerrar el cuestionario, pide al usuario revisar, ajustar o aprobar explícitamente `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Si el usuario dice `Apruebo el cuestionario`, ejecuta `fz-spec` en el mismo turno cuando haya escritura y no haya bloqueos; no cierres solo con `Spec habilitada` ni le pidas que indique la siguiente fase.
- Si el usuario pidió no modificar archivos, pide aprobación puntual para crear solo este archivo.
- No pases a spec ni a plan si el cuestionario está en borrador, tiene `Modo Q&A ejecutado: no`, contiene respuestas críticas vacías o no fue aprobado.
- Si estás en modo plan o sin escritura, cierra el cuestionario explicando que el archivo aún no puede crearse y da el prompt exacto para crearlo al habilitar escritura.
- Después del cuestionario, el siguiente paso es especificación cerrada y verificable, no plan.

## Contexto

- Usa `artifacts/FROMZERO_CONTEXT.md` como artefacto editable de análisis crítico del insumo.
- Debe crearse desde `templates/context.md` y conservar todas sus secciones.
- Debe incluir fuentes, prioridad documental, archivos leídos/truncados/omitidos, gaps, contradicciones, mejoras propuestas, decisión de UI, inventario de capacidades, inventario atomico de requisitos y recomendación.
- El inventario debe separar módulos, transversales, tablas, jobs, APIs, páginas de infraestructura y requisitos security/scale cuando estén documentados.
- El inventario atomico debe extraer headings funcionales, subheadings, bullets obligatorios, filas de tabla, estados, limites, TTLs, workers, contratos, validaciones, permisos, pruebas y gates. No agrupes dominios detallados como auth, storage, billing, UI, theme, grid, notifications, import/export o API en una sola fila.
- El inventario de invariantes/gates debe extraer bootstrap order, datos reales estrictos, naming/Dual Standard, servicios internos no expuestos, dependencia vulnerable, inventario API, performance budgets, marcas de plantillas y consent records cuando estén documentados.
- Sin `artifacts/FROMZERO_CONTEXT.md` no cierres Context ni pases a Spec.

## Especificación

- Usa `artifacts/FROMZERO_SPEC.md` como artefacto editable de especificación.
- Debe crearse desde documentos disponibles, `artifacts/FROMZERO_CONTEXT.md`, conversación validada y `artifacts/FROMZERO_QUESTIONNAIRE.md` aprobado.
- Debe incluir escenario de entrada, validación crítica y ruta de construcción.
- Debe incluir matriz de cobertura contrastada contra fuentes prioritarias, decisión de UI, modo tenant, KPIs/SLOs y controles condicionales.
- Debe incluir matriz de requisitos atomicos y registro de cambios cuando corrija omisiones frente a `docs/`.
- Debe incluir matriz de invariantes/gates cuando haya reglas bloqueantes documentadas.
- Si estás en modo plan o sin escritura, entrega el prompt exacto para crearlo al habilitar escritura.
- No pases a plan sin `artifacts/FROMZERO_SPEC.md` aprobado o aceptado explícitamente como base.
- Después de crear o actualizar la spec, destaca el siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`. Enlaza `artifacts/FROMZERO_SPEC.md`, muestra commit con hash y mensaje completo, e indica que debe revisar y responder `Apruebo la especificación` si está correcta.
- Si el usuario dice `Apruebo la especificación`, `Apruebo la spec` o `Apruebo el spec`, ejecuta `fz-plan` en el mismo turno cuando haya escritura y no haya bloqueos; no le pidas que indique la siguiente fase.
- El plan debe trazar capacidades y requisitos atomicos documentados hacia Sprint dueño, archivos objetivo, pruebas/comandos, gates y criterio verificable. No basta cubrir módulos macro ni dominios agregados.
- El plan debe trazar invariantes/gates hacia Sprint dueño, archivos objetivo, prueba/comando, gate y criterio bloqueante.
- Si el usuario rechaza el plan por cobertura incompleta, bloquea ejecución, marca `artifacts/FROMZERO_STATE.md` como `requiere cambios` o `plan actualizado en revisión`, revisa si la spec omitió documentación y actualiza solo artefactos FromZero necesarios. Para aprobar el plan actualizado, acepta `Apruebo el plan actualizado`, `Apruebo el plan` o cualquier variación clara que apruebe el plan vigente; si la respuesta es ambigua, pide confirmación.

## Checkpoints Git

- Cuando una fase pase correctamente o una aprobación explícita genere o actualice artefactos FromZero, crea un commit automático si Git está disponible, las verificaciones aplicables pasaron, no hay secretos y puedes stagear solo los archivos de esa fase.
- Muestra el commit con hash corto y mensaje completo.
- No mezcles cambios ajenos del usuario en el commit.
- Si no hubo cambios nuevos en archivos, no presentes el commit como fallo; di que no había nada nuevo que guardar.
- Si hay cambios previos sin commit, no digas solo `cambios previos mezclados`: explica si son artefactos FromZero, cambios ajenos o una mezcla. Stagea solo los artefactos FromZero esperados si puedes aislarlos con seguridad.
- Si no puedes crear el commit automático, explica la razón concreta; no cierres solo con `commit sugerido`.

## Librería interna

- No exijas al usuario nombres de skills, manifests ni gates.
- Antes de cerrar contexto, lee `library/manifest.json`.
- Detecta integraciones desde PRD, stack, dependencias y archivos de configuración.
- Si no existe el framework y la ruta es construirlo, usa referencias UI y documentos como insumo; no asumas APIs inexistentes.
- Si la ruta es app sin framework, usa FromZero como metodología y la referencia UI como guía profesional.
- Ejecuta `node tools/resource-resolver.mjs --project <ruta-del-proyecto>` cuando el entorno permita scripts.
- Usa `--install` solo con aprobación del usuario para copiar notas de recursos y lockfile a `.fromzero/`; `library/ui-template-reference` permanece dentro del plugin.
- Activa solo recursos locales en `library/resources/` que coincidan con `triggers` y `phases`.
- Documenta variables requeridas en `.env.example`; usa `.env.local` solo para operar herramientas del TechStack dentro de la sesión con `tools/load-env-local.mjs -- <comando>` (Controlled Secret Runtime Access), sin imprimir ni versionar secretos.
- No descargues packs ni conectes servicios externos sin aprobación explícita.

## Guardrails

- No inventar schemas, rutas, permisos ni APIs.
- Controlled Secret Runtime Access: usar `.env.local` solo para operar herramientas del TechStack dentro de la sesión; nunca imprimir, mostrar ni versionar secretos; reportar solo presencia/ausencia. No crear lanzadores ni editar config de la app.
- No usar datos dummy hardcodeados en UI.
- No usar `Framework` como nombre de skills, agentes o gates.
- Si una decisión cambia respecto a `artifacts/FROMZERO_QUESTIONNAIRE.md`, actualizar la pregunta afectada y su Registro de cambios en el mismo cambio. Dos artefactos vigentes no pueden contradecirse.
- Usar `tenant` en código/datos y Account/Cuenta en UI vía i18n; el nombre instalable es siempre `fromzero`.
- Mantener Redis opcional, pero sugerido.
- k6 es obligatorio para release candidates críticos.
- Verificar seguridad y escalabilidad antes de cierre.
- Toda fase cierra con el informe de cierre de fase: qué se ejecutó, artefactos, gates, riesgos y `Siguiente paso para ti:` en una frase simple.

## Versionado del plugin

- Cada cambio al adaptador Codex debe incrementar `version` en `.codex-plugin/plugin.json`.
- Registrar cada cambio en `CHANGELOG.md` con versión, fecha y resumen técnico.
- Usar SemVer: patch para reglas/docs/templates, minor para capacidades nuevas compatibles, major para cambios incompatibles.
- No cerrar una actualización del plugin sin versión y changelog actualizados.
