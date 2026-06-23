# FROMZERO_QUESTIONNAIRE

Este archivo registra las preguntas de clarificación del proyecto, sus opciones y las respuestas seleccionadas.

El usuario puede corregir respuestas editando `Respuesta seleccionada` o agregando notas en `Notas o correcciones`.

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_QUESTIONNAIRE |
| Propósito o subtítulo | Decisiones guiadas del usuario antes de especificar |
| Proyecto |  |
| Versión del adaptador FromZero |  |
| Fecha de creación |  |
| Última actualización |  |
| Estado actual | borrador de preguntas \| en Q&A \| respondido \| listo para revisión \| aprobado \| requiere cambios \| requiere re-aprobación |
| Historial de estados |  |
| Aprobación del usuario | pendiente \| aprobada |
| Fecha de aprobación |  |
| Frase literal de aprobación |  |
| Artefactos prerequisito | `artifacts/FROMZERO_CONTEXT.md` |
| Documentos o fuentes asociadas |  |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_SPEC.md` |
| Commit asociado |  |
| Restricciones de seguridad | Sin secretos ni `.env` reales. |

## Estado general

- Fuente principal revisada:
- Contexto base: `artifacts/FROMZERO_CONTEXT.md`
- Modo Q&A ejecutado: no
- Preguntas críticas pendientes:
- Preguntas críticas sin respuesta:
- Preguntas diferidas:

Regla:
Si `Modo Q&A ejecutado` es `no`, si el estado es `borrador de preguntas` o si existe una pregunta crítica sin respuesta seleccionada, este archivo no está aprobado y no puede usarse para crear `artifacts/FROMZERO_SPEC.md`.

Regla de redacción:
Las preguntas visibles deben estar escritas para usuarios no técnicos. Evita rutas internas, nombres de archivos del plugin, "fuente canónica", "referencia empaquetada", "template externo" o jerga de implementación. La clasificación técnica debe registrarse en notas internas, no como pregunta al usuario.

Regla de generación:
Las preguntas no son aleatorias. Deben salir de gaps, riesgos o decisiones reales del proyecto. Los patrones predefinidos solo sirven como guía de redacción y deben adaptarse al contexto.

Regla de documentación:
Si la documentación ya define una decisión sin contradicción, se registra como decisión documentada asumida y no se pregunta como si fuera opcional. Si hay riesgo o contradicción, la pregunta debe pedir confirmación de la excepción, no replantear todo el alcance.

Regla de fuentes por opción:
Cada opción debe registrar `Fuente documental` con una ruta/sección verificable o el valor literal `sin respaldo documental`. Una opción que reduzca, difiera o contradiga el insumo no puede marcarse como recomendada salvo que la excepción esté explícitamente aprobada por el usuario.

Regla de re-aprobación:
Si este artefacto ya estaba aprobado y se corrige cualquier decisión, respuesta,
opción o fuente, `Estado actual` debe pasar a `requiere re-aprobación` hasta que
el usuario vuelva a aprobarlo con frase literal registrada.

## Resumen de entendimiento antes de preguntar

Este resumen se deriva de `artifacts/FROMZERO_CONTEXT.md` y se muestra antes del
primer ciclo de entrevista. Si el usuario lo corrige, actualiza este archivo antes
de usarlo como base de Spec.

- Problema entendido:
- Resultado esperado:
- Usuario objetivo:
- Usuario no objetivo:
- Casos excluidos:
- Supuestos por validar:

## Entrevista por ciclos

Registra cada ciclo real de preguntas. No agregues preguntas que no cambien Spec,
Plan o riesgo.

| Ciclo | Tema | Objetivo del ciclo | Resultado |
|---|---|---|---|
| 1 |  |  |  |

## Q001 - Título de la pregunta

Estado: pendiente | respondida | diferida | corregida | decisión documentada asumida
Criticidad: crítica
Tema: producto
Origen: gap del contexto | riesgo | decisión técnica | documentación inconsistente | decisión documentada | solicitud del usuario
Pregunta generada desde: documentación del proyecto | conversación | análisis del agente | patrón recurrente adaptado
Fuente documental:

Pregunta visible:

Contexto visible:

Por qué importa:

Por qué no basta con asumir lo documentado:

Tarjeta de decisión técnica:

- Decisión en lenguaje común:
- Qué cambia si se elige:
- Impacto en costo/tiempo/riesgo:
- Cuándo conviene:
- Riesgo que evita:
- Nota técnica interna:

Opciones:

- A. Opción recomendada
  Fuente documental:
  Impacto:
  Ayuda visible:
  Recomendación: recomendada | no recomendada
  Reduce, difiere o contradice el insumo: no | si (requiere aprobación explícita)
- B. Opción alternativa
  Fuente documental:
  Impacto:
  Ayuda visible:
  Recomendación: recomendada | no recomendada
  Reduce, difiere o contradice el insumo: no | si (requiere aprobación explícita)
- C. Opción alternativa
  Fuente documental:
  Impacto:
  Ayuda visible:
  Recomendación: recomendada | no recomendada
  Reduce, difiere o contradice el insumo: no | si (requiere aprobación explícita)

Respuesta seleccionada:

Respuesta abierta del usuario:

Excepción aprobada si contradice documentación:

Notas o correcciones:

Notas internas:

## Resumen validado para Spec

Este bloque habilita Spec solo cuando el Q&A real fue ejecutado, las preguntas
críticas están respondidas o diferidas explícitamente, y el usuario revisó o aprobó
el cuestionario.

- Resumen validado por el usuario: no
- Correcciones integradas:
- Decisiones críticas cerradas:
- Decisiones diferidas aprobadas:
- Supuestos que pasan a Spec:
- Frase literal de aprobación o revisión:

## Revisión y aprobación

- Revisado por el usuario: no
- Cambios solicitados:
- Aprobado para crear `artifacts/FROMZERO_SPEC.md`: no
- Fecha de aprobación:
- Frase literal de aprobación:

## Registro de cambios

| Fecha | Cambio | Autor |
|---|---|---|
