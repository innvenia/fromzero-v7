---
name: fz-tdd
description: "Usar automáticamente cuando el usuario pida empezar a construir, corregir un bug o validar comportamiento crítico. También cuando diga 'antes de escribir código dime qué vas a probar', 'crea las pruebas', 'asegura que esto funcione' o 'cómo validamos esto'."
---

# fz-tdd

## Frases simples que activan esta skill

- "Antes de escribir código dime qué vas a probar."
- "Crea las pruebas."
- "Asegura que esto funcione."
- "Cómo validamos esto."
- "Corrige este bug con una prueba."

## Reglas

- Antes de implementar lógica productiva de un Sprint, define el plan de pruebas del Sprint bajo `artifacts/test-plans/` usando `templates/test-plan.md`: unit, integration, RLS/RBAC, Playwright, visual y k6 según aplique.
- Aplica los tipos de prueba según la guía de testing de la metodología: TDD obligatorio para lógica de negocio, seguridad y permisos, RLS/RBAC, módulos, integraciones, bugs y queries críticas.
- Toda limitación (prueba que no se puede ejecutar en el entorno) se documenta con el comando exacto recomendado.
- Cuando la fase pase y haya pruebas, planes o artefactos actualizados, crear commit automático si es seguro. El cierre debe mostrar hash corto y mensaje completo.

## Ciclo

1. Escribe una prueba que falle.
2. Verifica que falla por la razón esperada.
3. Implementa el mínimo código.
4. Verifica que pasa.
5. Refactoriza solo si mantiene verde la prueba.

UI puramente visual puede usar Playwright, visual QA y accesibilidad como complemento.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir si el humano debe revisar pruebas, aceptar una limitación o continuar con la implementación del Sprint.
