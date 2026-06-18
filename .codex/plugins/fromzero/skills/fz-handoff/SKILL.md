---
name: fz-handoff
description: "Usar automáticamente cuando el usuario pida resumen, entrega, estado, pendientes, handoff, continuidad o qué sigue, aunque lo diga como 'resúmeme qué hiciste', 'qué falta', 'déjame el estado', 'qué sigue', 'prepara la entrega' o 'donde quedamos'."
---

# fz-handoff

## Frases simples que activan esta skill

- "Resúmeme qué hiciste."
- "Qué falta?"
- "Déjame el estado."
- "Qué sigue?"
- "Prepara la entrega."
- "Dónde quedamos?"

## Incluir

- Leer y actualizar `artifacts/FROMZERO_STATE.md` antes de responder.
- Si `artifacts/FROMZERO_STATE.md` falta, reconstruirlo desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y Git antes de proponer siguiente acción.
- Qué cambió.
- Por qué cambió.
- Aceptación de producto contra visión validada: leer el `## Resumen validado para Spec` cuando exista, contrastarlo contra lo entregado, listar resultados esperados como entregado / diferido con razón / no cumplido, enlazar evidencia y registrar la frase literal de aceptación si el usuario la da.
- Diff documental resumido cuando cambien spec, questionnaire o plan.
- Diff documental resumido cuando cambie `artifacts/FROMZERO_STATE.md`.
- Estado Git y si existe commit base.
- Commit automático de la fase o Sprint, con hash corto y mensaje completo.
- Sprint actual, último Sprint completado y siguiente Sprint desde `artifacts/FROMZERO_STATE.md`.
- Sprint 1 de preparación/base inicial incluido o marcado como completado.
- Lista breve de Sprints cuando exista `artifacts/FROMZERO_PLAN.md`.
- Verificación de secretos antes de stage/commit.
- Siguiente aprobación exacta.
- Evidencia de tests y comandos.
- Estado de la verificación visual en navegador (render y consola) cuando hay UI web: ejecutada con evidencia, fallback registrado o no aplica.
- Gates aprobados.
- Riesgos abiertos.
- Issues pendientes.
- Decisiones de cache, jobs, queries, load y scale.
- Siguiente acción debe poder ser una frase simple: `Continua con la ejecucion del proyecto.`
- Si Handoff crea un archivo de handoff, guardarlo bajo `artifacts/handoffs/` usando `templates/handoff.md`.
- Si Handoff detecta un aprendizaje reutilizable sobre la metodología, plugin,
  templates, skills, gates o adapters FromZero, registrarlo en
  `artifacts/fromzero-feedback/GOTCHAS.md` usando `templates/gotchas.md`.
- Preparar `artifacts/fromzero-feedback/fromzero-methodology-feedback.md` solo si el
  usuario pide o autoriza feedback exportable. Debe estar sanitizado y no contener
  secretos, `.env`, PII, tokens, llaves, dumps, logs sensibles ni código
  propietario innecesario.
- No enviar feedback automáticamente ni prometer sincronización con el repositorio
  FromZero. El usuario comparte manualmente el artefacto si quiere.
- Si Handoff actualiza `artifacts/FROMZERO_STATE.md`, README, evidencia o archivo de handoff, crear commit automático si es seguro.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir que revisar, que pendiente queda y que frase simple puede usar el humano para continuar.
