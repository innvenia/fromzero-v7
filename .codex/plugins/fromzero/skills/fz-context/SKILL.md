---
name: fz-context
description: "Usar automáticamente cuando el usuario quiera revisar, iniciar, validar, aterrizar, preparar o crear un proyecto FromZero, aunque lo pida con lenguaje simple como 'revisa el proyecto', 'empecemos', 'crea esta app', 'no tengo documentos', 'la documentación está en docs' o 'ayúdame a arrancar'. La skill debe descubrir documentación o ayudar a crearla desde una idea vaga, validar criticamente producto, mercado, UI, integraciones, riesgos y próximos pasos sin exigir que el usuario nombre archivos técnicos."
---

# fz-context

## Procedimiento

1. Interpreta la intención del usuario en lenguaje natural.
2. Clasifica el escenario de entrada: idea documentada o idea vaga/no escrita.
3. Clasifica la ruta de construcción por contenido real: framework existente, framework nuevo o app sin framework. El nombre del directorio raíz del proyecto destino nunca es un hallazgo por sí mismo.
4. Verifica control de versión antes de cualquier escritura: existe `.git`, branch actual y estado de trabajo si aplica.
5. Si no existe `.git`, explica que Git protege trazabilidad, rollback y revisión de cambios; pregunta si el usuario autoriza inicializarlo antes de modificar archivos.
6. Si el usuario aprueba inicializar Git, crea el repositorio y una `.gitignore` segura antes de otros cambios. Si no aprueba, registra el riesgo y no hagas cambios complejos sin confirmación explícita.
7. Verifica si existe `artifacts/START_HERE.md`. Si falta o fue generado por FromZero, créalo o actualizalo desde `templates/start-here.md`; si existe y no fue generado por FromZero, pide aprobación antes de modificarlo.
8. Descubre documentación disponible en orden: `PRD.md`, directorios de documentación del proyecto (`docs/`, `documentation/` u otro indicado por el usuario), `README.md`, artefactos `artifacts/FROMZERO_*.md`, `.fromzero/` y archivos de configuración comunes.
9. Si existe `docs/`, lee primero estas fuentes cuando existan y registra si alguna falta, fue truncada o no pudo leerse: `docs/PRD.md`, `docs/REFERENCE_MODULES.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_STRUCTURE.md`, `docs/REFERENCE_STACK.md`, `docs/SECURITY_ASSURANCE.md`, `docs/SCALABILITY_ASSURANCE.md`, `docs/DEPENDENCY_MATRIX.md`, `docs/BOOTSTRAP_REFERENCE.md`, y luego el resto de `docs/`.
10. Si el usuario declara una prioridad de fuentes, úsala por encima del orden por defecto y regístrala en `artifacts/FROMZERO_CONTEXT.md`.
11. Usa heurística por tipo de contenido solo como complemento para detectar fuentes no listadas: visión/PRD, módulos, datos/schema, arquitectura, stack, seguridad, escalabilidad, dependencias, bootstrap/operación y estrategia. La heurística no reemplaza prioridades documentales explícitas ni permite excluir fuentes declaradas por el usuario.
12. Si el usuario menciona una ubicación de documentos, por ejemplo `docs`, léela como fuente principal y pásala al resolver con `--docs <ruta>`.
13. Si no hay documentos, guía una validación inicial antes de hablar de plan o código.
14. Lee `library/manifest.json`, `library/categories.json` y `library/registry-index.json` del plugin.
15. Ejecuta `node tools/resource-resolver.mjs --project <ruta>` si el entorno permite scripts; si hay rutas documentales explícitas, usa `--docs <ruta>` por cada una.
16. No ejecutes `--install` hasta explicar qué copiará y recibir aprobación explícita.
17. Detecta producto, tipo de app, stack, UI, datos, roles, tenant, integraciones, seguridad y escala.
18. Extrae un inventario enumerable de capacidades desde las fuentes: módulos principales, capacidades transversales, tablas, pivotes, historiales, jobs programados, contratos API/mobile, páginas de infraestructura, permisos, auditoría, seguridad, escalabilidad, i18n, accesibilidad, observabilidad, configuración y diferidos documentados.
19. Extrae un inventario atomico de requisitos desde headings funcionales, subheadings, bullets obligatorios y filas de tabla de fuentes prioritarias. Asigna ID estable, fuente, heading, dominio, obligación y estado a cada requisito.
20. Usa dominios atomicos cuando aparezcan en la documentación: `auth-session`, `storage-files`, `billing-subscriptions`, `ui-primitives-overlays`, `theme-branding`, `grid-module-factory`, `custom-fields`, `event-bus-rules`, `notifications`, `import-export`, `api-errors-security`, módulos, tablas, jobs, páginas de infraestructura, seguridad y escalabilidad.
21. No resumas listas internas como una sola capacidad. Si el PRD lista timeouts, estados, buckets, flows, workers, rutas, validaciones, limites, permisos, pruebas o gates, cada item obligatorio debe tener fila propia.
22. Extrae un inventario de invariantes y gates desde reglas, restricciones, convenciones, presupuestos exactos, seguridad operativa y criterios de release. Usa dominios `bootstrap-order`, `real-data-only`, `naming-dual-standard`, `internal-service-boundary`, `dependency-security`, `api-inventory`, `performance-budget`, `template-brand-sanitization` y `consent-records` cuando apliquen.
23. No dejes como nota implícita reglas como orden de bootstrap, datos reales estrictos, nomenclatura, Core AI interno, dependencias vulnerables, inventario API, performance exacta, marcas de templates o campos mínimos de consentimiento.
24. Analiza criticamente la idea o proyecto antes de especificar: problema, usuario objetivo, mercado, alternativas, diferenciación, modelo comercial, adquisición, alcance, viabilidad, costos, operación, seguridad, riesgos y oportunidades de mejora. No te limites a listar faltantes.
25. Registra el entendimiento inicial antes del Q&A cuando haya decisiones críticas: problema entendido, resultado esperado, usuario objetivo, usuario no objetivo, casos excluidos y supuestos del agente.
26. Registra decisión de UI internamente como: framework, referencia del usuario, UI generado o sin UI.
27. Si hay UI y se usara framework, revisa primero el framework disponible y sus contratos.
28. Si hay UI y no hay framework o no se usara, pregunta en lenguaje simple si el usuario quiere usar la UI incluida en FromZero, una referencia externa o dejar la UI para después.
29. Si hay UI y el usuario elige la UI incluida en FromZero, activa `fromzero-ui-template` como referencia de calidad sin asumir APIs inexistentes.
30. Cruza tecnologías detectadas contra `triggers`, `categories.json` y `registry-index.json`.
31. Si no hay cobertura suficiente, activa `missing-resource-resolution`.
32. Lee solo los recursos locales seleccionados en `library/resources/`.
33. Clasifica el trabajo: app independiente, proyecto desconocido o, solo cuando el proyecto sea el From Zero Framework, su área interna (framework base, app derivada, Core AI o adaptador; ver el glosario de la metodología).
34. Crea o actualiza `artifacts/FROMZERO_CONTEXT.md` usando `templates/context.md`. Sin este artefacto no se cierra la fase de contexto.
35. `artifacts/FROMZERO_CONTEXT.md` debe registrar la sección `## Metadatos` completa, fuentes, prioridad documental, estado de lectura, entendimiento inicial, usuario objetivo, usuario no objetivo, supuestos del agente, análisis crítico, gaps, contradicciones, supuestos débiles, mejoras propuestas a la documentación inicial, decisión de UI, inventario de capacidades, inventario atomico de requisitos, inventario de invariantes/gates y recomendación.
36. No cierres Context como completo si una fuente prioritaria no fue leída, si el inventario solo cubre módulos macro y omite capacidades transversales documentadas, si el inventario atomico no descompone subrequisitos obligatorios de fuentes prioritarias, o si reglas bloqueantes no aparecen como invariantes/gates.
37. Durante Context no crees ni actualices `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md` ni `artifacts/FROMZERO_STATE.md`. `artifacts/FROMZERO_STATE.md` se crea únicamente al crear `artifacts/FROMZERO_PLAN.md` o durante Build/Handoff si debe reconstruirse.
38. Si el usuario pidio explícitamente no modificar archivos o el entorno está en modo plan/sin escritura, entrega el prompt exacto para crear `artifacts/FROMZERO_CONTEXT.md` al habilitar escritura y no avances como si existiera.
39. Entrega un resumen para usuario no técnico: que encontro, que escenario detecto, que ruta recomienda, decisión de UI, estado Git, que falta y que recomienda hacer primero.
40. Si no hay decisiones críticas y no se generará cuestionario, pide confirmación simple del contexto antes de habilitar Spec: "¿Esto refleja tu idea? Si algo no encaja, dímelo antes de continuar." No agregues esta confirmación cuando ya exista cuestionario aprobado.
41. Si hay dudas, decisiones pendientes o faltantes antes de especificar o planear, no crees `artifacts/FROMZERO_QUESTIONNAIRE.md` definitivo todavía. Primero solicita o activa el modo plan nativo del agente para ejecutar el cuestionario con su UI/herramientas disponibles.
42. Antes de la primera pregunta muestra un bloque visible, sin mayúsculas agresivas. Usa el nombre del agente cuando esté disponible:
   `Activa el modo plan de tu agente antes de continuar.`
   `El siguiente paso de la metodología FromZero usa el modo plan para hacer el cuestionario más guiado y fácil de revisar.`
43. Ejecuta el cuestionario en modo plan antes de escribir `artifacts/FROMZERO_QUESTIONNAIRE.md`. El usuario debe responder, diferir o corregir las decisiones críticas durante ese ciclo.
44. Si la plataforma no permite cambiar de modo programáticamente o las herramientas nativas de Q&A no están disponibles, detente después de `artifacts/FROMZERO_CONTEXT.md`, muestra el bloque obligatorio y pide al usuario activar el modo plan o abrir una conversación en modo plan. No escribas `artifacts/FROMZERO_QUESTIONNAIRE.md` como si el Q&A ya hubiera ocurrido.
45. Puedes listar preguntas candidatas en la respuesta o dentro de `artifacts/FROMZERO_CONTEXT.md`, pero no uses `artifacts/FROMZERO_QUESTIONNAIRE.md` para guardar preguntas vacías como cuestionario final. Si por alguna razón se crea un archivo antes de completar el Q&A, debe marcarse explícitamente como `Estado: borrador de preguntas`, `Modo Q&A ejecutado: no` y queda bloqueado para Spec.
46. Crea o actualiza `artifacts/FROMZERO_QUESTIONNAIRE.md` solo después de ejecutar al menos un ciclo real de Q&A con respuestas, decisiones diferidas o correcciones del usuario. El archivo debe incluir `## Metadatos`, preguntas, opciones, fuente documental por opción o `sin respaldo documental`, explicación de cada opción, respuesta seleccionada, estado, notas, `Modo Q&A ejecutado: si` y estado de aprobación.
47. No marques como recomendada una opción que reduzca, difiera o contradiga el insumo documental, salvo que el usuario apruebe explícitamente esa excepción y quede registrada con frase literal.
48. Si el usuario pidió explícitamente no modificar archivos o el entorno está en modo plan/sin escritura, no intentes continuar como si el archivo existiera. Explica que `artifacts/FROMZERO_QUESTIONNAIRE.md` aún no puede crearse en ese modo.
49. Actualiza `artifacts/FROMZERO_QUESTIONNAIRE.md` después de cada ciclo de respuestas para que el usuario pueda revisar y corregir decisiones.
50. Después de cerrar el cuestionario, detén el avance hasta que el usuario revise, ajuste o apruebe explícitamente `artifacts/FROMZERO_QUESTIONNAIRE.md`.
51. Entrega también el detalle técnico mínimo: recursos activados, variables para `.env.example`, secretos externos y verificaciones.
52. Detén el trabajo si faltan objetivo, datos, permisos, tenant ownership, criterios críticos, ruta de construcción, decisión de UI, estado Git, configuración sensible no definida, cobertura documental prioritaria incompleta, inventario atomico incompleto o inventario de invariantes/gates incompleto.
53. No pases a `fz-spec`, `fz-plan` ni `fz-build`; tampoco crees `artifacts/FROMZERO_STATE.md`, hasta que `artifacts/FROMZERO_CONTEXT.md` exista, `artifacts/FROMZERO_QUESTIONNAIRE.md` no sea borrador, el Q&A haya sido ejecutado y el cuestionario crítico esté aprobado explícitamente, respondido o tenga decisiones explícitamente diferidas aprobadas por el usuario.
54. Al cerrar el cuestionario, entrega siempre el bloque "Siguiente paso" con una instrucción clara para el usuario.
55. Si el proyecto no tiene `README.md`, propón crearlo con contenido mínimo (nombre, propósito, estado, cómo continuar) y créalo con aprobación. El README es un archivo vivo: se actualizará al cerrar Sprints y releases.
56. Detecta si el stack se beneficia de servidores MCP empaquetados (ver `library/resources/mcp.md`); proponlos en lenguaje simple y nunca actives ni conectes un MCP sin aprobación explícita.
57. Cuando Context o Questionnaire cree o actualice artefactos y la fase quede lista para revisión, crea un commit automático si es seguro. El commit debe incluir solo archivos de esa fase y el cierre debe mostrar hash y mensaje completo.

## Modo conversación simple

Si el usuario escribe algo como:

- "Revisa este proyecto."
- "La documentación está en docs."
- "Ayúdame a empezar."
- "Quiero crear esta app."
- "No tengo documentos, solo una idea."
- "Quiero crear una aplicación de X para Y."
- "Prepara el proyecto."

Haz el contexto completo sin pedirle que nombre `fz-context`, manifests, resolver, gates ni archivos internos.

Pregunta solo lo indispensable y en lenguaje simple.

## Cuestionario de clarificación

Después del contexto inicial, el agente debe ejecutar un Q&A real para cerrar alcance antes de especificar o planear. Listar preguntas candidatas no cuenta como cuestionario ejecutado.

Antes de la primera pregunta debe mostrar este bloque visible. En adaptadores concretos, reemplaza "TU AGENTE" por CODEX, CLAUDE CODE o ANTIGRAVITY:

```text
Activa el modo plan de tu agente antes de continuar.
El siguiente paso de la metodología FromZero usa el modo plan para hacer el cuestionario más guiado y fácil de revisar.
```

Antes de iniciar el primer ciclo de preguntas, explica al usuario:

```text
El cuestionario puede tener varios ciclos porque las preguntas dependen de la documentación revisada y de tus respuestas. Te mostraré opciones predefinidas y, cuando la herramienta lo permita, también podrás responder con tus propias palabras si ninguna opción encaja o si quieres aclarar algo. La opción recomendada se basa en la documentación y en el análisis inicial, pero puedes corregirla. Al terminar, registraré todas las preguntas y respuestas en el proyecto para que puedas revisarlas, cambiar alguna respuesta y aprobarlas antes de pasar a la especificación.
```

El cuestionario debe:

- iniciar con un resumen breve del entendimiento del proyecto antes de preguntar: problema entendido, resultado esperado, usuario objetivo, usuario no objetivo, casos excluidos y supuestos del agente;
- operar como entrevista guiada por ciclos cuando haya decisiones críticas; cada ciclo debe profundizar gaps, contradicciones o decisiones reales del proyecto antes de pasar a la siguiente tanda;
- cerrar con un resumen validado para Spec que consolide visión del producto, decisiones cerradas, decisiones diferidas aprobadas, supuestos y correcciones del usuario;
- agrupar preguntas por tema: producto, problema, mercado, usuario, comercialización, permisos, datos, UI, integraciones, seguridad, escala, operación y release;
- redactar preguntas para usuarios no técnicos, sin exponer rutas internas, nombres de archivos del plugin, "fuente canónica", "referencia empaquetada", "template externo" ni jerga de implementación;
- generar preguntas desde gaps, riesgos y decisiones reales del proyecto; no hacer preguntas aleatorias ni genéricas si no afectan la spec;
- usar patrones predefinidos solo como guía de redacción para temas recurrentes, adaptando pregunta, opciones y ayudas al contexto concreto del proyecto;
- no volver a preguntar como decisión abierta algo que la documentación ya define claramente; en ese caso regístralo como decisión documentada asumida;
- si una decisión documentada tiene contradicción, riesgo o impacto relevante, pregunta para confirmar la excepción, no para hacer parecer opcional el alcance documentado;
- distinguir entre alcance final del producto, alcance vendible, MVP comercial y primer corte técnico verificable; no uses "MVP" si el documento ya define el alcance obligatorio con otro significado;
- explicar por qué importa cada pregunta;
- ofrecer opciones claras cuando sea posible;
- incluir o aprovechar una respuesta abierta cuando la herramienta lo permita, y explicar que puede usarse si ninguna opción encaja;
- explicar el impacto de cada opción;
- marcar la opción recomendada cuando exista;
- registrar fuente documental por opción o `sin respaldo documental`;
- impedir que una opción que reduzca, difiera o contradiga la documentación sea recomendada por defecto;
- presentar toda decisión técnica crítica como tarjeta de decisión: decisión en lenguaje común, qué cambia si se elige, impacto en costo/tiempo/riesgo, cuándo conviene, riesgo que evita y nota técnica interna separada del texto principal;
- registrar la respuesta elegida por el usuario;
- permitir correcciones posteriores sin perder historial;
- separar preguntas críticas de preguntas diferibles.
- registrar la ruta de construcción elegida o pendiente: framework existente, framework nuevo o app sin framework.
- registrar si el cuestionario queda pendiente, requiere cambios o fue aprobado explícitamente por el usuario.
- registrar `Modo Q&A ejecutado: si` solo cuando el usuario haya respondido, corregido o diferido explícitamente las preguntas durante el ciclo de Q&A.
- mantener `Estado: borrador de preguntas` y `Modo Q&A ejecutado: no` si el archivo fue creado antes de ejecutar el Q&A; en ese caso no habilita Spec.

Archivo requerido bajo `artifacts/`:

```text
artifacts/FROMZERO_QUESTIONNAIRE.md
```

Formato mínimo por pregunta:

```text
## Q001 - Titulo de la pregunta

Estado: pendiente | respondida | diferida | corregida
Criticidad: critica | importante | opcional
Tema: producto | usuarios | permisos | datos | UI | integraciones | seguridad | escala | operacion | release

Pregunta:
...

Por que importa:
...

Opciones:
- A. Opcion recomendada
  Fuente documental: ...
  Impacto: ...
- B. Opcion alternativa
  Fuente documental: ...
  Impacto: ...
- C. Opcion alternativa
  Fuente documental: ...
  Impacto: ...

Respuesta seleccionada:
...

Notas o correcciones:
...
```

Formato adicional para preguntas técnicas críticas:

```text
Tarjeta de decisión técnica:
- Decisión en lenguaje común: ...
- Qué cambia si se elige: ...
- Impacto en costo/tiempo/riesgo: ...
- Cuándo conviene: ...
- Riesgo que evita: ...
- Nota técnica interna: ...
```

Si el agente hace preguntas en ciclos de 3, debe registrar en el archivo todas las preguntas generadas hasta el momento, no solo las ya respondidas.

No crees `artifacts/FROMZERO_QUESTIONNAIRE.md` definitivo con todas las respuestas vacías. Si hay preguntas críticas sin respuesta, el cierre debe pedir ejecutar o continuar el Q&A en modo plan.
No habilites Spec si falta el resumen validado para Spec cuando hubo decisiones críticas.

## Regla de redacción del Q&A

Cada pregunta visible debe tener esta estructura lógica, aunque la herramienta nativa la muestre en tarjetas, botones o ayudas hover:

- Pregunta: una frase en lenguaje común que diga qué decisión debe tomar el usuario y para qué proyecto aplica.
- Contexto: una frase corta con la razón de la pregunta, usando "según la documentación del proyecto" cuando la decisión venga de los documentos.
- Opciones: etiquetas simples, sin abreviaturas técnicas como texto principal.
- Ayuda de opción: explicación corta de qué significa elegirla, qué se hará después y qué riesgo acepta.
- Respuesta abierta: cuando esté disponible, debe presentarse como forma válida de corregir, ampliar o reemplazar las opciones predefinidas.
- Nota interna: términos técnicos, rutas, archivos, claims, RLS, SQL, versiones o nombres de librerías solo cuando hagan falta para que el agente implemente; no deben aparecer como texto principal de la pregunta.

Reglas obligatorias:

- No conviertas requisitos ya documentados en opciones de alcance. Si la documentación dice que todos los módulos son obligatorios, no preguntes si el MVP debe tener "todos" o "solo algunos"; pregunta, si hace falta, por orden de entrega, profundidad del primer corte o condición de venta.
- Si una opción usa una tecnología o sigla, explica el significado en la ayuda visible.
- Si la pregunta depende de documentación existente, dilo explícitamente: "según la documentación del proyecto".
- Si la decisión es avanzada, ofrece una opción recomendada segura para usuarios no técnicos.
- Si el usuario básico normalmente no tendría infraestructura local, no recomiendes local por defecto salvo que el proyecto lo exija.
- No uses "aceptar riesgos" como opción visible sin nombrar el riesgo concreto.
- No uses "ignorar docs rotos"; usa "dejar esta documentación fuera por ahora" y explica el impacto.

## Pregunta UI recomendada

Cuando la decisión pendiente sea UI, la pregunta visible debe estar formulada así o con una redacción equivalente:

```text
¿Cómo quieres definir la interfaz visual del proyecto?
```

Explica por qué importa en lenguaje simple:

```text
Esta decisión define si usamos la experiencia visual incluida en FromZero, una referencia externa que ya tengas o si dejamos la interfaz para después. Afecta pantallas, componentes, consistencia visual y velocidad de avance.
```

Opciones recomendadas:

- A. Usar la UI de FromZero (recomendado)
  Impacto: avanzamos con las pantallas, componentes y reglas visuales incluidas en la metodología para mantener consistencia y reducir decisiones iniciales.
- B. Usar una referencia externa
  Impacto: tomamos como base un diseño, template, app o sistema visual que el usuario indique, y FromZero lo usa como referencia principal.
- C. Dejar UI para después
  Impacto: se puede seguir aclarando producto y lógica, pero cualquier especificación visual queda limitada o bloqueada hasta cerrar esta decisión.

Si el proyecto está construyendo el framework FromZero, aclara que esta decisión define si la interfaz base del framework saldrá de la UI incluida en la metodología, de una referencia externa o si quedará pendiente. La clasificación técnica puede guardarse internamente, pero no debe ser el texto visible de la pregunta.

## Patrones de preguntas recurrentes

Usa estos patrones cuando aplique el mismo tipo de decisión. Adapta etiquetas y ayudas al proyecto.

### Documentación inconsistente

Pregunta:

```text
La documentación del proyecto menciona rutas o versiones que no coinciden. ¿Cómo quieres resolverlo antes de especificar?
```

Contexto:

```text
Esta decisión evita que la especificación se base en archivos, versiones o supuestos contradictorios.
```

Opciones recomendadas:

- A. Corregir y alinear primero (recomendado)
  Impacto: revisamos la documentación, dejamos una versión consistente como base y después seguimos con la spec.
  Ayuda: opción más segura cuando hay contradicciones que pueden cambiar alcance, stack o arquitectura.
- B. Seguir con advertencias explícitas
  Impacto: continuamos, pero cada contradicción queda registrada como riesgo y puede bloquear decisiones posteriores.
  Ayuda: útil si necesitas avanzar rápido y aceptas revisar esas inconsistencias después.
- C. Dejar fuera la documentación dudosa por ahora
  Impacto: usamos solo las fuentes confiables y marcamos las fuentes descartadas como pendientes.
  Ayuda: evita contaminar la spec, pero puede perder requisitos importantes si esa documentación era necesaria.

### Versiones del stack

Pregunta:

```text
Según la documentación del proyecto, ¿cómo quieres manejar las versiones del stack inicial?
```

Contexto:

```text
Esta decisión define si el proyecto prioriza estabilidad reproducible o actualizaciones frecuentes desde el inicio.
```

Opciones recomendadas:

- A. Usar versiones estables fijadas (recomendado)
  Impacto: dejamos versiones concretas para que instalación, pruebas y despliegues sean repetibles.
  Ayuda: opción recomendada para equipos que quieren evitar cambios inesperados entre entornos.
- B. Permitir rangos de versiones compatibles
  Impacto: aceptamos actualizaciones menores compatibles, con más flexibilidad y algo más de variación.
  Ayuda: útil si el proyecto ya tiene políticas de actualización y pruebas automatizadas.
- C. Usar siempre las últimas versiones
  Impacto: se prioriza estar al día, pero aumenta el riesgo de cambios incompatibles o fallos nuevos.
  Ayuda: no recomendado para una base inicial salvo que el usuario quiera validar tecnología nueva.

### Entorno Supabase

Pregunta:

```text
¿Dónde quieres trabajar la base de datos Supabase durante el desarrollo inicial?
```

Contexto:

```text
Esta decisión define si el equipo usará solo Supabase en la nube o si también preparará una instancia local para pruebas.
```

Opciones recomendadas:

- A. Solo Supabase en la nube (recomendado para usuarios no técnicos)
  Impacto: se trabaja contra el proyecto cloud de desarrollo y los cambios de base de datos se documentan para ejecutarlos allí.
  Ayuda: no requiere levantar Supabase local; exige cuidar accesos, backups y no usar datos sensibles reales en desarrollo.
- B. Cloud más archivos SQL versionados
  Impacto: se usa Supabase cloud, pero cada cambio de schema, políticas o datos iniciales queda guardado como SQL versionado.
  Ayuda: buena opción intermedia para mantener trazabilidad sin montar una instancia local.
- C. Supabase local y cloud
  Impacto: se prepara una instancia local para pruebas y luego se replica en cloud con migraciones.
  Ayuda: opción más técnica; requiere Docker o Supabase CLI y disciplina de migraciones.

### Permisos y tenant activo

Pregunta:

```text
¿Cómo quieres definir la cuenta o tenant activo de cada usuario?
```

Contexto:

```text
Esta decisión afecta qué datos puede ver o modificar cada usuario cuando existe más de una cuenta, empresa o espacio de trabajo.
```

Opciones recomendadas:

- A. Guardarlo en el perfil seguro del usuario (recomendado)
  Impacto: la app lee la cuenta activa desde información controlada por el servidor y no editable directamente por el usuario.
  Ayuda: equivalente técnico: claims no editables o metadata segura; reduce riesgo de cambiar de cuenta sin permiso.
- B. Consultarlo en la base de datos
  Impacto: la app verifica la cuenta activa en tablas de membresía y permisos antes de cada operación relevante.
  Ayuda: más flexible para reglas complejas, pero requiere queries e índices bien diseñados.
- C. Resolverlo solo en el servidor
  Impacto: cada acción del backend decide la cuenta activa sin confiar en datos enviados por el cliente.
  Ayuda: útil para máxima seguridad, aunque puede agregar complejidad y más validaciones por request.

## Cierre del cuestionario

Cuando el cuestionario termine, el agente debe indicar explícitamente una de estas rutas:

### Si tiene permiso de escritura

1. Crear o actualizar `artifacts/FROMZERO_QUESTIONNAIRE.md`.
2. Pedir al usuario que revise, corrija o apruebe explícitamente el archivo.
3. No pasar a especificación hasta que el usuario apruebe el cuestionario o indique correcciones.
4. Si el usuario aprueba con una frase simple como `Apruebo el cuestionario`, ejecutar `fz-spec` en el mismo turno cuando haya escritura y no existan bloqueos.
5. No cerrar con estados pasivos como "Spec habilitada: si" si `artifacts/FROMZERO_SPEC.md` no fue creado o actualizado; crear la spec o explicar el bloqueo concreto y el siguiente paso.

Frase sugerida:

```text
El cuestionario ya está completo y quedó registrado en el proyecto. Revísalo antes de continuar: puedes cambiar cualquier respuesta o aprobarlo como está. Para aprobarlo, basta con decir: "Apruebo el cuestionario." Con esa aprobación, FromZero debe crear o actualizar la especificación como siguiente fase si tiene escritura y no hay bloqueos. No se debe preparar el plan todavía.
```

### Si está en modo plan o sin permiso de escritura

1. Decir que el cuestionario está completo, pero aún falta registrarlo en el proyecto.
2. Explicar que registrarlo es obligatorio antes de continuar porque permite revisar, corregir o aprobar las respuestas.
3. No avanzar a spec ni a plan.
4. Dar un prompt simple, sin exigir que el usuario conozca el nombre del archivo técnico.

Frase obligatoria:

```text
El cuestionario ya está completo. Antes de continuar, es obligatorio guardar todas las preguntas y respuestas en el proyecto para que puedas revisarlas, corregir cualquier respuesta y aprobarlas. Estoy en modo plan/sin escritura y no puedo hacerlo todavía. Cambia a un modo con escritura y dime: "guarda el cuestionario respondido para revisión y espera mi aprobación antes de continuar." Esta acción solo registra el cuestionario; después de revisarlo y aprobarlo, seguimos con la especificación cerrada y verificable.
```

## Integraciones

- No descargues packs externos sin aprobación explícita.
- No conectes servicios externos sin aprobación explícita.
- No leas `.env` reales.
- Usa `.env.example` para documentar variables requeridas.
- Si una integración no existe en `library/manifest.json`, usa `categories.json` y luego `missing-resource-resolution`.
- Para documentación oficial o sync de packs, pide aprobación y exige versión fija.
- El resolver solo copia recursos empaquetados y genera lockfile; no descarga ni conecta servicios.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir claramente si el humano debe revisar, aprobar, corregir, responder o activar modo plan. No muestres solo códigos, estados internos ni un hash de commit sin mensaje.
