---
name: fz-build
description: "Usar automáticamente cuando el usuario apruebe construir, implementar o continuar el siguiente Sprint, aunque lo diga como 'construye el primer paso', 'empieza a implementar', 'hazlo', 'continúa con el plan', 'continúa con la ejecución del proyecto', 'ejecuta el siguiente Sprint' o 'desarrolla esta parte'."
---

# fz-build

## Frases simples que activan esta skill

- "Construye el primer paso."
- "Empieza a implementar."
- "Hazlo."
- "Continúa con el plan."
- "Continúa con la ejecución del proyecto."
- "Apruebo el plan."
- "Apruebo el plan actualizado."
- "Ejecuta el siguiente Sprint."
- "Desarrolla esta parte."

## Reglas

- Antes de implementar, lee `artifacts/FROMZERO_STATE.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git status`.
- No inicies codificación si `artifacts/FROMZERO_SPEC.md` no está aprobado o aceptado explícitamente como base, si `artifacts/FROMZERO_PLAN.md` no existe o si `artifacts/FROMZERO_STATE.md` no identifica el siguiente Sprint aprobado.
- Esta verificación previa conserva los gates existentes: Build no reemplaza aprobaciones, no asume artefactos faltantes y no construye desde supuestos fuera de Spec, Plan y State aprobados.
- No inicies codificación si `artifacts/FROMZERO_PLAN.md` o `artifacts/FROMZERO_STATE.md` están en `requiere cambios`, `listo para revisión`, `borrador` o cualquier estado pendiente de aprobación humana.
- Si el usuario aprueba explícitamente el plan vigente con frases como `Apruebo el plan`, `Apruebo el plan actualizado`, frases anteriores de compatibilidad o variaciones claras equivalentes, registra fecha, frase literal y estado aprobado en `artifacts/FROMZERO_PLAN.md` y `artifacts/FROMZERO_STATE.md` antes de iniciar el siguiente Sprint, si es seguro escribir.
- Normaliza internamente esas aprobaciones como aprobación del plan vigente. Si la respuesta es ambigua, condicional o parcial, pide confirmación antes de cambiar estado o iniciar Build.
- Si el plan o state usa un estado legacy reconocible, interpretarlo con el mapa de compatibilidad de `artifacts/FROMZERO_STATE.md`, reportar drift y actualizar al valor canónico solo si es seguro escribir.
- Si `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` o `artifacts/FROMZERO_QUESTIONNAIRE.md` fue editado después de estar aprobado, no iniciar Build hasta que el artefacto quede en `requiere re-aprobación` y el usuario lo apruebe nuevamente con frase literal registrada.
- Si `artifacts/FROMZERO_STATE.md` existe y esta consistente, toma de ahí el siguiente Sprint sin pedirle al usuario el número.
- Si `artifacts/FROMZERO_STATE.md` falta o está desactualizado, reconstruye estado desde `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_SPEC.md` y `git log`; resume la inferencia y pide confirmación antes de escribir código.
- Si el usuario dice "continua" o "ejecuta el siguiente Sprint", solo reanuda el siguiente Sprint registrado en `artifacts/FROMZERO_STATE.md` cuando el plan ya está aprobado. Si el plan está en revisión o borrador, pide aprobación explícita, por ejemplo `Apruebo el plan`.
- Antes de escribir código, revisa en `artifacts/FROMZERO_PLAN.md` las zonas de
  validación humana del Sprint. Si el Sprint toca auth/sesiones, permisos/RLS/RBAC,
  billing/pagos/webhooks, migraciones destructivas, eliminación/exportación de
  datos, secretos/deploy o legal/compliance y el estado es `requiere aprobación`
  o `bloqueada`, bloquea Build y pide la aprobación exacta de esa zona. No bloquees
  por zonas `no aplica` con razón o `aprobada`.
- No pidas un prompt largo ni el número del Sprint si el estado central permite inferirlo.
- Implementa el mínimo cambio seguro.
- Respeta los límites de arquitectura declarados en la spec (por ejemplo base, app derivada y Core AI cuando el proyecto sea el From Zero Framework).
- Si el Sprint cambia comportamiento visible del producto, actualiza las secciones afectadas del `README.md` del proyecto como parte del cierre del Sprint.
- Usa Server Actions/API para mutaciones sensibles.
- No hardcodees strings UI.
- No agregues dependencias sin gate.
- Verifica cada Sprint o incremento interno antes de avanzar.
- Si el Sprint cambia UI web, ejecuta una verificación visual en navegador antes de cerrarlo: abre el resultado en el navegador integrado o la extensión del agente, confirma el render y revisa la consola/red por errores de JavaScript, red o recursos. Adjunta evidencia o registra el fallback si no hay navegador disponible. No cierres un Sprint con UI declarando solo que el código compila o que pasan los tests.
- Al iniciar un Sprint, actualiza `artifacts/FROMZERO_STATE.md` con estado `en ejecución`.
- Al completar un Sprint, actualiza `artifacts/FROMZERO_STATE.md` con evidencia, tests/comandos, commit asociado, último Sprint completado y siguiente Sprint.
- Al completar un Sprint o una fase de Build exitosa, crea commit automático si es seguro. Registra en `artifacts/FROMZERO_STATE.md` el hash corto y el mensaje completo del commit.
- Antes de crear el commit automático del Sprint, clasifica el working tree con `tools/git-checkpoint.mjs --dry-run` o una revisión equivalente. No hagas checkpoint si hay cambios externos, sensibles o no permitidos por allowlist.
- Si un Sprint queda bloqueado, actualiza `artifacts/FROMZERO_STATE.md` con bloqueo, riesgo, decisión requerida y próxima acción humana.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir que revisar, que pruebas validar y si el usuario debe aprobar continuar con el siguiente Sprint o pedir correcciones.
