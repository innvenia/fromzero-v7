# FromZero para Codex

Adaptador distribuible para ejecutar la metodología FromZero en Codex.

Nombre instalable del plugin: `fromzero`.

Versión actual: `0.8.0`.

Instalación oficial: marketplace local en la raíz del repositorio completo (`.agents/plugins/marketplace.json` con `source.path` hacia `methodology/from_zero/adapters/codex`).

Si solo tienes una copia de `methodology/from_zero`, usa la instalación manual de fallback.

Si ya existe un marketplace global `fromzero-local`, no lo uses como fuente si apunta a
una ruta anterior o inexistente. Deriva la raíz del marketplace desde la fuente indicada:
sube desde `methodology/from_zero` hasta el directorio que contiene
`.agents/plugins/marketplace.json` y registra esa raíz. Para esta copia local, la raíz
correcta es el repositorio que contiene `methodology/from_zero`, no un proyecto destino ni
una ejecución anterior.

Instalación manual esperada (fallback):

```text
.codex/plugins/fromzero
```

## Regla crítica de instalación

No crees un plugin nuevo cuando el usuario pida instalar FromZero. Este adaptador
ya existe y debe copiarse completo desde su fuente canónica.

Antes de instalar, verifica que la fuente contenga:

- `.codex-plugin/plugin.json`
- `AGENTS.md`
- `FIRST_STEPS.md`
- `skills/`
- `library/`
- `templates/start-here.md`
- `tools/init-project.mjs`

Después de copiar el adaptador completo al proyecto destino, ejecuta
`tools/init-project.mjs` para crear o actualizar `artifacts/START_HERE.md`. La instalación
no está completa si `artifacts/START_HERE.md` no existe en el proyecto destino.
El cierre debe copiar literalmente el bloque `Mensaje final obligatorio para el usuario`
mostrado por `tools/init-project.mjs`; no debe resumirse ni sustituirse por una lista propia,
y debe conservar el enlace Markdown a `artifacts/START_HERE.md`.
Si el proyecto no tiene Git, el cierre debe recomendar inicializarlo antes de ejecutar FromZero.

No sustituyas `artifacts/START_HERE.md` por `AGENTS.md`. `AGENTS.md` instruye al agente;
`artifacts/START_HERE.md` orienta al usuario del proyecto.

## Compatibilidad Codex

El manifiesto `.codex-plugin/plugin.json` declara `skills` y `mcpServers`. No declara
`hooks` hasta que `tools/runtime-smoke.mjs` y una instalación real confirmen que
la versión actual del runtime acepta ese campo para este paquete.

El directorio `hooks/` se mantiene empaquetado como referencia operativa. Si el
runtime Codex soporta hooks por otra vía o en una versión futura, el usuario debe
revisarlos y aprobar su ejecución antes de activarlos. En modo fallback, Codex debe
aplicar manualmente las verificaciones documentadas en `hooks/guardrails.md` y
`hooks/evidence.json`.

## Empieza aquí

Al instalar el plugin en un proyecto, crea o actualiza `artifacts/START_HERE.md`:

```text
node .codex/plugins/fromzero/tools/init-project.mjs --project <ruta-del-proyecto> --app Codex
```

Lee `artifacts/START_HERE.md` si eres usuario del proyecto. Lee `FIRST_STEPS.md` si estas revisando el adaptador.

Frase recomendada para idea vaga:

```text
Quiero crear una aplicacion para [tipo de usuario] que resuelva [problema].
No tengo PRD ni documentacion adicional todavia.
Registra esta idea inicial en docs/PROJECT_BRIEF.md.
Usa FromZero para analizar criticamente la idea, mejorarla, hacer preguntas necesarias y preparar artifacts/FROMZERO_CONTEXT.md.
No implementes codigo de aplicacion todavia.
No avances de fase sin mi aprobación.
```

Para PRD o documentación en carpeta, usa los prompts de `artifacts/START_HERE.md`.

Para aprobar un plan listo, responde:

```text
Apruebo el plan.
```

También puedes responder `Apruebo el plan actualizado` o una variación clara que
apruebe el plan vigente. Codex debe registrar la frase literal y pedir
confirmación si la respuesta es ambigua, condicional o parcial.

`Continua con la ejecucion del proyecto` solo reanuda un plan ya aprobado.

## Que hace

El plugin guía a Codex para trabajar con orden:

1. clasificar si hay idea documentada o idea vaga;
2. validar críticamente problema, usuario, mercado, tecnología, alcance, seguridad, operación y comercialización;
3. decidir si se usara framework, si se construira el framework o si se hara una app sin framework;
4. crear `artifacts/FROMZERO_CONTEXT.md` con análisis crítico, gaps, mejoras e inventario de capacidades;
5. ejecutar Q&A real en modo plan cuando haya decisiones críticas y solo después crear `artifacts/FROMZERO_QUESTIONNAIRE.md` respondido;
6. detenerse hasta que el usuario revise, ajuste o apruebe el cuestionario;
7. preparar especificación con cobertura del insumo;
8. crear plan;
9. crear estado operativo centralizado;
10. definir pruebas;
11. construir por Sprints verificables;
12. revisar seguridad;
13. revisar UI;
14. revisar escalabilidad;
15. cerrar con evidencia.

El usuario no debe mencionar nombres internos de skills, manifests, resolver ni gates.

Regla de numeración: no usar pasos, fases, Sprints, etapas ni items visibles numerados como `0`.

## Qué tipo de metodología es

FromZero es una metodología **Spec-Driven extendida** para construir SaaS con agentes IA.

Clasificación corta:

```text
Spec-Driven, Security-Gated, Sprint-Based AI Delivery Methodology
```

En español:

```text
Metodología de desarrollo guiada por especificación, con gates de seguridad, escalabilidad y entrega por Sprints.
```

No es Vibe Coding puro: no acepta construir solo por intuición o conversación abierta. Tampoco es SDD básico: además de una especificación aprobada, exige validación crítica, Git desde Context, Sprints, pruebas, seguridad, UI, escalabilidad, release y evidencia.

Frente al SDLC tradicional, FromZero conserva la disciplina del ciclo de vida de software, pero la vuelve operativa para agentes IA: convierte ideas o documentos en `artifacts/FROMZERO_CONTEXT.md`, Q&A real en modo plan, `artifacts/FROMZERO_QUESTIONNAIRE.md`, `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, Sprints verificables y gates de cierre.

## Why

FromZero existe porque la IA acelera la creación de software, pero no garantiza por sí sola que el resultado sea seguro, escalable, mantenible o comercialmente claro.

Beneficios:

- menos ambigüedad antes de escribir código;
- menos deuda técnica generada por prompts abiertos;
- seguridad, permisos y datos definidos desde el inicio;
- trazabilidad con Git antes de cambios;
- Sprints verificables en lugar de avances difusos;
- integraciones SaaS preparadas aunque estén apagadas;
- evidencia de pruebas, UI, escala y release antes de cerrar.

## Que necesitas

Ten a mano:

- descripción del producto o idea inicial;
- documentos, notas o PRD si existen;
- usuarios y roles;
- problema que resuelve;
- cliente objetivo y mercado;
- forma esperada de comercialización;
- módulos o pantallas esperadas;
- datos que se guardaran;
- reglas de permisos;
- integraciones;
- requisitos de seguridad;
- criterios de aceptación.

Si no tienes nada escrito, el plugin debe ayudarte a crear `artifacts/FROMZERO_CONTEXT.md`, ejecutar Q&A real en modo plan, registrar `artifacts/FROMZERO_QUESTIONNAIRE.md` respondido y luego preparar `artifacts/FROMZERO_SPEC.md`. No debe saltar directo a plan o código.

## Rutas posibles

| Ruta | Uso |
|---|---|
| Framework existente | Preferida cuando el framework FromZero está disponible y el usuario quiere partir de su código fuente. |
| Framework nuevo | Aplica cuando se esta creando el framework; se trabaja desde referencias UI, documentos y Sprints verificables. |
| App sin framework | Aplica cuando el usuario quiere usar la metodología FromZero, pero construir una app independiente o una interfaz mas simple. |

## Artefactos consistentes

FromZero genera artefactos con estructura reconocible entre proyectos:

- `artifacts/FROMZERO_CONTEXT.md` para análisis crítico, gaps, mejoras e inventario de capacidades.
- `artifacts/FROMZERO_QUESTIONNAIRE.md` para respuestas reales, correcciones y decisiones aprobadas.
- `artifacts/FROMZERO_SPEC.md` para el contrato de especificación.
- `artifacts/FROMZERO_PLAN.md` para Sprints, gates, recursos y siguiente aprobación.
- `artifacts/FROMZERO_STATE.md` para saber dónde quedó el proyecto y cual es el siguiente Sprint.

La estructura es una guía flexible, no una camisa de fuerza. El agente puede agregar secciones específicas del proyecto, pero debe conservar los bloques base para que la metodología sea reutilizable y fácil de reconocer.

Reglas de numeración:

- Todo empieza en `1`.
- No se permite numeración inferior a `1` en pasos, Sprints, fases, etapas ni items.
- Si hay preparación inicial, debe ser `Sprint 1 - Preparacion y base inicial`.

Si existe el framework completo y el usuario decide usarlo, la documentación canónica
del proyecto y sus documentos de seguridad/escalabilidad entran como fuentes del
proyecto. Si no existen, el adaptador usa las referencias empaquetadas dentro del
plugin, incluyendo `library/ui-template-reference`, y no asume APIs o componentes
inexistentes.

## Frases útiles

| Momento | Frase que puedes escribir |
|---|---|
| Empezar | `Revisa este proyecto con FromZero y dime como empezamos.` |
| Hay docs | `La documentacion esta en docs. Revisa el proyecto con FromZero, analizalo criticamente y dime que falta antes de especificar.` |
| No hay docs | `Quiero crear una aplicacion de [tipo] para [usuario]. No tengo documentos. Ayudame a validar y aterrizar la idea con FromZero.` |
| Usar framework | `Quiero crear esta app usando el framework FromZero como base. Valida la idea y dime que falta.` |
| Sin framework | `Quiero usar FromZero como metodologia, pero construir esta app sin partir del framework.` |
| Especificar | `Prepara la especificacion del proyecto.` |
| Planear | `Crea un plan por pasos pequenos para construirlo.` |
| Probar | `Antes de escribir codigo, dime que vas a probar primero.` |
| Construir | `Continua con la ejecucion del proyecto.` |
| Siguiente Sprint | `Ejecuta el siguiente Sprint.` |
| Seguridad | `Revisa seguridad antes de seguir.` |
| UI | `Revisa la UI con el diseno de FromZero.` |
| Escala | `Revisa si esto escala bien antes de cerrar.` |
| Cerrar | `Cierra el trabajo con evidencia, riesgos y proximos pasos.` |

## Flujo esperado

Codex debe revisar el proyecto y responder en lenguaje simple:

- que encontro;
- que escenario de entrada detecto;
- que ruta de construcción recomienda;
- que falta;
- que riesgos ve;
- que recursos necesita;
- que preguntas debes responder;
- cual es el primer paso recomendado.

Si no sabe el modelo de datos, permisos o tenant ownership, debe detenerse y preguntar.

Si no hay documentación, Codex debe iniciar una validación guiada antes de especificar: problema, usuarios, mercado, alternativas, diferenciación, modelo comercial, adquisición, alcance inicial, datos, permisos, UI, seguridad, costos y operación.

## Contexto y mejora del insumo

El primer artefacto verificable es:

```text
artifacts/FROMZERO_CONTEXT.md
```

Debe registrar fuentes, gaps, contradicciones, mejoras propuestas a la documentación
inicial, decisión de UI, inventario de capacidades y recomendación de seguir, ajustar
o descartar.

## Estado operativo centralizado

Después de aprobar la especificación y crear el plan, Codex debe crear o actualizar:

```text
artifacts/FROMZERO_STATE.md
```

Este archivo es la fuente de verdad para continuar el proyecto después de pausas, cambios de conversación o días sin actividad. Debe registrar Sprint actual, último Sprint completado, siguiente Sprint, estado de Git, commits, gates, bloqueos, riesgos, decisiones abiertas, comandos de verificación y próxima acción.

Cada Sprint debe registrar un `Resumen breve de inicio` y `Herramientas previstas`. Antes de codificar, Codex muestra Sprint, alcance, verificaciones, riesgos y herramientas como skills, MCPs/conectores, subagentes, navegador, scripts CLI, test runners o servicios externos. Si no hay bloqueos, continúa automáticamente con `Iniciando la ejecución del Sprint N.`.

El usuario no debe tener que recordar el número del Sprint ni copiar instrucciones largas. Puede escribir:

```text
Continua con la ejecucion del proyecto.
```

O:

```text
Ejecuta el siguiente Sprint.
```

Codex debe leer `artifacts/FROMZERO_STATE.md`, validar `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git status`, detectar automáticamente el siguiente Sprint y avanzar si no hay bloqueos. Si el estado falta o parece desactualizado, debe reconstruirlo desde plan, spec y Git, explicar que datos infirio y pedir confirmación antes de modificar código.

## Cuestionario de clarificación

Si después de revisar el contexto hay dudas antes de especificar o planear, Codex debe iniciar o solicitar el cuestionario automáticamente en modo plan.

Antes de preguntar debe mostrar una cita:

> Activa el modo plan de Codex antes de continuar.
> El siguiente paso de la metodología FromZero usa el modo plan para hacer el cuestionario más guiado y fácil de revisar.

El cuestionario se guarda bajo `artifacts/` solo después de ejecutar Q&A real con respuestas, correcciones o decisiones diferidas:

```text
artifacts/FROMZERO_QUESTIONNAIRE.md
```

Ese archivo debe incluir preguntas, opciones, explicación de cada opción, respuesta seleccionada, estado, notas, `Modo Q&A ejecutado: si` y aprobación. El usuario puede editarlo para corregir respuestas antes de pasar a la spec.

Las preguntas no son aleatorias. Deben salir de gaps, riesgos o decisiones reales del proyecto. Los patrones predefinidos solo guían temas recurrentes y deben adaptarse al contexto, con etiquetas simples, contexto visible, ayuda por opción y notas técnicas separadas.

Antes de iniciar, Codex debe explicar que el cuestionario puede tener varios ciclos, que habrá opciones recomendadas según la documentación y que la respuesta abierta sirve para corregir, ampliar o reemplazar las opciones predefinidas.

Si una decisión ya está clara en la documentación, Codex debe registrarla como asumida y no preguntarla como si fuera opcional. Si hay contradicción o riesgo, debe preguntar por la excepción, el orden de entrega o la profundidad del primer corte.

Codex no debe crear `artifacts/FROMZERO_QUESTIONNAIRE.md` definitivo con respuestas vacías. Si crea un archivo antes de completar Q&A, debe marcarlo como `Estado: borrador de preguntas` y `Modo Q&A ejecutado: no`; ese archivo no habilita Spec.

Si el usuario pidio no modificar archivos, Codex debe pedir aprobación puntual para crear solo este archivo.

Si estás en modo plan o sin permiso de escritura, Codex debe cerrar el cuestionario explicando que falta guardar todas las preguntas y respuestas en el proyecto, que ese registro es obligatorio para revisar o corregir antes de continuar, y debe darte este siguiente prompt:

```text
guarda el cuestionario respondido para revisión y espera mi aprobación antes de continuar.
```

Esta acción solo guarda el cuestionario; no inicia la siguiente fase.

Después de revisar y aprobar ese archivo, el siguiente paso es especificación cerrada y verificable, no plan. `artifacts/FROMZERO_STATE.md` no debe crearse durante Context ni Questionnaire.

El usuario no debe indicar la siguiente fase. Si responde `Apruebo el cuestionario`, Codex debe crear o actualizar `artifacts/FROMZERO_SPEC.md` en el mismo turno cuando tenga escritura y no haya bloqueos. No debe cerrar solo con "Spec habilitada". Si hay bloqueo, debe explicarlo y decir la siguiente acción. El plan se mantiene bloqueado hasta que la especificación sea aprobada.

Después de crear o actualizar la especificación, Codex debe enlazar `[artifacts/FROMZERO_SPEC.md](artifacts/FROMZERO_SPEC.md)`, mostrar el commit automático con hash y mensaje completo, y decir claramente: `Siguiente paso para ti: revisa y valida [artifacts/FROMZERO_SPEC.md](artifacts/FROMZERO_SPEC.md). Si todo está correcto, responde "Apruebo la especificación". Si quieres cambiar algo, dime qué ajuste hago.`

## Especificación

La especificación debe guardarse bajo `artifacts/`:

```text
artifacts/FROMZERO_SPEC.md
```

Codex debe crearla desde documentos disponibles, fuentes prioritarias de `docs/`, `artifacts/FROMZERO_CONTEXT.md`, conversación validada y `artifacts/FROMZERO_QUESTIONNAIRE.md` aprobado. No debe crear la spec si el cuestionario está en borrador, tiene `Modo Q&A ejecutado: no` o respuestas críticas vacías. No debe crear el plan hasta que `artifacts/FROMZERO_SPEC.md` exista y el usuario lo apruebe o acepte explícitamente como base.

La especificación debe indicar la ruta de construcción, decisión de UI, matriz de
cobertura del insumo, modo tenant, KPIs/SLOs y controles condicionales.

Si el usuario responde `Apruebo la especificación`, `Apruebo la spec` o `Apruebo el spec`, Codex debe interpretar esa aprobación como autorización para ejecutar `fz-design` cuando aplique y después crear o actualizar `artifacts/FROMZERO_PLAN.md` y `artifacts/FROMZERO_STATE.md` en el mismo turno cuando tenga escritura y no haya bloqueos. Design aplica si la spec implica schemas, APIs, permisos, jobs, cache, migraciones, integraciones o arquitectura relevante. Si no aplica, Codex debe registrar `diseño técnico no requerido` con razón. Plan y State se crean solo después de Design o de esa exención documentada. No debe pedirle al usuario que indique la siguiente fase. El plan debe trazar capacidades documentadas hacia Sprint dueño, archivos, pruebas/comandos y gates; no basta cubrir módulos macro.

Si el usuario rechaza el plan por cobertura incompleta, Codex debe bloquear ejecución, dejar `artifacts/FROMZERO_STATE.md` en `requiere cambios`, revisar si la spec omitió documentación y actualizar solo artefactos FromZero necesarios.

## Checkpoints Git automáticos

Cuando una fase pasa correctamente o una aprobación explícita genera o actualiza artefactos FromZero, Codex debe crear un commit automático si es seguro: Git disponible, verificaciones aplicables pasadas o no aplicables, stage limitado a los archivos de esa fase, sin secretos y sin mezclar cambios ajenos. El cierre debe mostrar hash corto y mensaje completo. Si no hubo cambios nuevos, debe decir que no había nada nuevo que guardar. Si hay cambios previos sin commit, debe explicar si son artefactos FromZero, cambios ajenos o una mezcla. Si puede aislar artefactos FromZero esperados, debe stagear solo esos archivos y crear el commit. Si no puede hacer commit, debe explicar la razón concreta; no debe cerrar solo con `commit sugerido` ni con `cambios previos mezclados`.

## Librería interna

El plugin incluye `library/` con manifest, categorías, registry local y recursos curados.

Incluye recursos específicos para Supabase, Redis, SonarQube, Expo, Hostinger, Runpod, Stripe, Inngest, Playwright y k6.

También incluye recursos por categoría para frontend, backend, bases de datos, auth, pagos, deployment, AI y testing.

Cuando detecta una tecnología, Codex debe buscarla en este orden:

1. `library/manifest.json` para recurso específico;
2. `library/categories.json` para categoría común;
3. `library/registry-index.json` para pack candidato;
4. `missing-resource-resolution` si no hay cobertura suficiente.

No debe descargar ni consultar fuentes externas sin aprobación.

## Resolver

El resolver es una herramienta interna del adaptador. El usuario no debería tener que ejecutarlo manualmente para iniciar el proceso.

Si Codex necesita preparar recursos internos, debe explicarlo en lenguaje simple y pedir aprobación antes de instalar, descargar o conectar algo externo.

```bash
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto --install
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto --install --force
```

`--install` copia recursos empaquetados a `.fromzero/` y genera `.fromzero/fromzero.lock.json`.
Si un recurso instalado fue modificado, el resolver se detiene para evitar
sobrescrituras accidentales. Usa `--force` solo después de revisar el conflicto.

## Reglas de seguridad

Codex debe:

- tocar solo archivos necesarios;
- no inventar APIs;
- usar `.env.local` solo para operar herramientas del TechStack dentro de la sesión (Controlled Secret Runtime Access), sin imprimir ni versionar secretos;
- no hardcodear secretos;
- no conectar servicios externos sin aprobación;
- no descargar packs externos sin aprobación;
- no ejecutar `--install` sin aprobación;
- verificar antes de avanzar.

## Versionado y trazabilidad

- La versión pública vive en `.codex-plugin/plugin.json`.
- Todo cambio al adaptador debe incrementar la versión.
- Todo cambio debe registrarse en `CHANGELOG.md`.
- Usar SemVer: patch para reglas/docs/templates, minor para capacidades compatibles, major para cambios incompatibles.
