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
- Antes de escribir código de cualquier Sprint aprobado, muestra un resumen breve de inicio tomado de `Resumen breve de inicio` y `Herramientas previstas` del Sprint en `artifacts/FROMZERO_PLAN.md` o `artifacts/FROMZERO_STATE.md`.
- Si el plan es legacy y no tiene esos campos, deriva el resumen desde `Objetivo`, `Criterios de aceptación`, `Archivos objetivo`, `Verificaciones`, recursos y gates. Si es seguro escribir, registra los campos derivados en `artifacts/FROMZERO_STATE.md` al marcar el Sprint como `en ejecución`.
- El mensaje previo debe incluir Sprint detectado, qué se construirá, alcance, herramientas previstas, verificación y riesgos. Herramientas previstas debe nombrar skills, MCPs/conectores, subagentes, navegador, scripts CLI, test runners o servicios externos cuando apliquen.
- No prometas MCPs, conectores, subagentes o navegador si el runtime no está verificado. Usa `no aplica` o `fallback` con razón.
- Usa este formato antes de codificar:

```text
Sprint a ejecutar: Sprint N - Título

Resumen breve:
Construiré [resultado esperado]. El alcance incluye [2-3 puntos clave].

Herramientas previstas:
Usaré [skills], [MCPs/conectores o no aplica], [scripts/comandos], [navegador/subagentes si aplican].

Verificación:
Validaré con [comandos/verificaciones].

Riesgos:
[riesgo/bloqueo o "sin bloqueos conocidos"].

Iniciando la ejecución del Sprint N.
```

- Si no hay bloqueos de validación humana, el mensaje debe cerrar exactamente con `Iniciando la ejecución del Sprint N.` y continuar la ejecución automáticamente en el mismo turno, sin pedir ni esperar otra intervención del usuario. Si hay bloqueo, muestra el resumen sin esa línea final y pide la aprobación exacta requerida.
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
- Verifica el DoD del Sprint antes de avanzar y confirma que su DoR se cumplió antes de iniciar; un DoR incumplido bloquea el inicio y un DoD incumplido bloquea el cierre salvo aprobación de riesgo registrada.
- Antes de ejecutar migraciones o verificación de BD, resuelve el entorno objetivo (local vs cloud dev) desde la decisión registrada en `artifacts/FROMZERO_STATE.md`/`artifacts/FROMZERO_PLAN.md` y `.env.local` con `tools/resolve-db-environment.mjs`; nunca asumas `--local` por defecto. Si el entorno detectado no coincide con el declarado, detente y reconcílialo antes de migrar.
- Escribe código listo para validar para minimizar reproceso cuando llegue la validación real: RLS con política presente y prueba de denegación cross-tenant lista; RBAC con roles y permisos enumerados; naming dual estándar (técnico en código, etiqueta humana en UI vía i18n); validación de inputs en trust boundaries; soft-delete donde sea dato de negocio.
- Aplica la regla anti-duplicación (regla de tres): al aparecer el tercer bloque estructuralmente igual, extrae un helper/factory pequeño. Aplica especialmente a contratos API, schemas Zod, job definitions, adapters, fixtures y configuración repetitiva. No crees abstracciones especulativas; extrae solo cuando reduce duplicación real.
- En código React/TypeScript, declara las props de los componentes como `Readonly<Props>`, no mutes props ni inputs de contratos y mantén estables los tipos exportados. Todo componente exportado lleva test contractual mínimo (ver `docs/testing.md`).
- El estándar de calidad interno FromZero aplica a todo el código que escribes, en cualquier etapa, no solo al cerrar. En el checkpoint del incremento ejecuta y registra el gate local: lint, typecheck, tests unitarios relevantes, coverage, build (si aplica), audit de dependencias (si aplica), `git diff --check`, secret scan básico y SonarQube local si está configurado. Registra la evidencia en el handoff (`## Gate de calidad`). El secret scan y Sonar no deben imprimir secretos (Controlled Secret Runtime Access).
- No avances ni entregues el incremento si el código no cumple el estándar de calidad interno FromZero (coverage global y new ≥ 80%, duplicación ≤ 3%, bugs/vulnerabilities/security hotspots abiertos 0, code smells introducidos 0, open issues 0), salvo desviación justificada y aprobada por el humano y registrada en `artifacts/FROMZERO_DECISIONS.md`. El estándar aplica exista o no SonarQube; ver `docs/gates.md`.
- Si el Sprint cambia UI web, ejecuta una verificación visual en navegador antes de cerrarlo: abre el resultado en el navegador integrado o la extensión del agente, confirma el render y revisa la consola/red por errores de JavaScript, red o recursos. Adjunta evidencia o registra el fallback si no hay navegador disponible. No cierres un Sprint con UI declarando solo que el código compila o que pasan los tests.
- Al iniciar un Sprint, clasifica el working tree con `tools/git-checkpoint.mjs --dry-run`. Si hay cambios externos o no relacionados sin commitear, decláralos y pide reconocimiento explícito antes de construir; no construyas en silencio sobre un baseline sucio (DoR universal, ver `docs/dor-dod.md`).
- Al iniciar un Sprint, actualiza `artifacts/FROMZERO_STATE.md` con estado `en ejecución`.
- Al completar un Sprint, actualiza `artifacts/FROMZERO_STATE.md` con evidencia, tests/comandos, commit asociado, último Sprint completado y siguiente Sprint.
- Al cerrar un Sprint, fija en `artifacts/FROMZERO_STATE.md` el `Tipo de cierre` (cerrado validado, cerrado localmente, contrato implementado integración pendiente, o bloqueado por gate externo) y el `Entorno validado`. No uses `completado` sin calificador cuando el Sprint dependa de servicios externos (BD, Sonar, storage, provider, CI o jobs); cada cierre que deje deuda genera su registro (dueño, condición, sprint bloqueado).
- En Sprints de schema/migración, RLS/RBAC o integración, la ejecución real (migración aplicada + prueba RLS negativa cross-tenant, o llamada en vivo al servicio en dev) es parte del DoD, no evidencia opcional. Si no se logra, no auto-cierres con etiqueta blanda: bloquea el Sprint, repórtalo como bloqueado (no ejecutado) y pide la aprobación de riesgo exacta o logra la ejecución real. El cierre blando de estos tipos (`cerrado localmente` o `contrato implementado, integración pendiente`) solo procede con aprobación de riesgo registrada en `artifacts/FROMZERO_DECISIONS.md` y su fila en `artifacts/DEFERRED_ACTIVATIONS.md`.
- Si el Sprint cierra offline o con un gate externo no cumplido, escribe o actualiza `artifacts/DEFERRED_ACTIVATIONS.md` con la fila correspondiente (servicio/capacidad, condición de activación, evidencia esperada, dueño) y registra las decisiones nuevas en `artifacts/FROMZERO_DECISIONS.md`. La semántica de cierre (versionado vs verificado y la jerarquía de entornos) está definida en `docs/methodology.md`.
- Al completar un Sprint o una fase de Build exitosa, crea commit automático si es seguro. Registra en `artifacts/FROMZERO_STATE.md` el hash corto y el mensaje completo del commit.
- Antes de crear el commit automático del Sprint, clasifica el working tree con `tools/git-checkpoint.mjs --dry-run` o una revisión equivalente. No hagas checkpoint si hay cambios externos, sensibles o no permitidos por allowlist.
- Si el commit del Sprint queda bloqueado por cambios externos, sensibles o fuera de allowlist, escala el bloqueo al humano y regístralo en `artifacts/FROMZERO_STATE.md` (sección 7); no lo dejes como limitación silenciosa ni acumules deuda de commit sin avisar.
- Si un Sprint queda bloqueado, actualiza `artifacts/FROMZERO_STATE.md` con bloqueo, riesgo, decisión requerida y próxima acción humana.

## Cierre de fase

Preséntalo con el formato canónico Informe de cierre de Sprint de `docs/reporting.md`.

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- limitaciones y bloqueos con su evidencia (comando + resultado o config leída), sin suposiciones;
- conteos de pruebas con alcance explícito (suite completa vs Sprint) y reconciliados;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir que revisar, que pruebas validar y si el usuario debe aprobar continuar con el siguiente Sprint o pedir correcciones.
