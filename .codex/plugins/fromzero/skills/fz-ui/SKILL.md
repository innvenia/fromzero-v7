---
name: fz-ui
description: "Usar automáticamente cuando el usuario pida pantallas, diseño, interfaz, dashboard, componentes, responsive, accesibilidad o revisión visual, aunque lo diga como 'revisa la UI', 'diseña esta pantalla', 'usa el diseño de FromZero' o 'haz que se vea bien en móvil'."
---

# fz-ui

## Frases simples que activan esta skill

- "Revisa la UI."
- "Diseña esta pantalla."
- "Usa el diseño de FromZero."
- "Haz que se vea bien en móvil."
- "Valida la interfaz."

## Fuentes

1. `library/ui-template-reference`: fuente canónica del Design System de la metodología, siempre disponible en el adaptador.
2. `library/ui-template-reference/docs/ui-reference-images`: capturas del UI renderizado, con índice en su `README.md`. Referencia visual para juzgar la adherencia del UI generado.
3. `library/resources/fromzero-ui-template.md`: reglas de activación.

Si el workspace contiene una versión más reciente del template upstream de la referencia, puede usarse para refrescar la copia empaquetada, pero la fuente normativa es siempre la referencia incluida en el adaptador.

La decisión de UI registrada en `artifacts/FROMZERO_SPEC.md` decide si se usa UI del framework, referencia propia del usuario, UI generado desde la referencia empaquetada o si el gate no aplica.

## Gate

- Usar tokens, no hex hardcoded.
- Usar los componentes del Design System aplicable según la decisión de UI registrada en la spec; `@fw/ui/components` aplica solo cuando la ruta usa el framework.
- No copiar `window.*`, hash routing ni runtime globals.
- Declarar las props de los componentes como `Readonly<Props>`; no mutar props; mantener estables los tipos exportados.
- Todo componente exportado lleva test contractual mínimo: render básico, variant/tone relevante, `className` passthrough (si aplica) y defaults seguros (ver matriz en `docs/testing.md`).
- Verificar 375, 768 y 1920.
- Cumplir WCAG 2.2 AA objetivo.
- Cuando la decisión de UI usa la referencia empaquetada, contrastar el render contra las imágenes de `library/ui-template-reference/docs/ui-reference-images` y reportar adherencia o desviaciones en áreas maestras, tokens, patrones de componentes y estados.
- Ejecutar la verificación visual en navegador (ver sección siguiente) cuando el proyecto tiene UI web.
- Cuando el gate pase y haya cambios visuales, evidencia o artefactos actualizados, crea commit automático si es seguro. El cierre debe mostrar hash corto y mensaje completo.

## Verificación visual en navegador

Cuando el proyecto tiene UI web, la revisión no termina en el código. El agente debe ver el resultado renderizado y leer la consola, además de Playwright.

- Ejecuta la aplicación y ábrela en el navegador integrado o la extensión de navegador del agente (por ejemplo, el navegador embebido de Codex, la extensión de Chrome de Claude Code o la integración nativa de Chrome de Antigravity).
- Confirma el render real en 375, 768 y 1920: layout, overflow, overlap, estados loading/empty/error/success y textos i18n visibles.
- Si la UI deriva de la referencia empaquetada, compara las pantallas equivalentes contra `library/ui-template-reference/docs/ui-reference-images` (ver su `README.md`) y deja la lista de desviaciones accionables, no un veredicto binario.
- Lee la consola y la red del navegador y reporta errores de JavaScript, red, recursos o advertencias relevantes. Un error de consola sin resolver es un hallazgo, no ruido.
- Adjunta capturas como evidencia visual y enlázalas en el cierre.
- Playwright sigue siendo obligatorio para flujos automatizados; la verificación en navegador es la confirmación visual y de consola que Playwright no muestra de forma directa.
- Si la plataforma no tiene navegador disponible, registra el fallback usado (capturas de Playwright o revisión manual guiada) y declara que la verificación en navegador no fue posible. No la omitas en silencio ni declares UI verificada sin evidencia.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe enlazar evidencia visual cuando exista y decir si el humano debe revisar pantallas, aprobar la UI o pedir correcciones.
