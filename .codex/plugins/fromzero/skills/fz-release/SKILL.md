---
name: fz-release
description: "Usar automáticamente cuando el usuario pida cerrar, entregar, validar, preparar release o confirmar que ya quedó, aunque lo diga como 'cierra el trabajo', 'déjalo listo', 'valida todo antes de terminar', 'puedo entregar esto' o 'prepara el cierre'."
---

# fz-release

## Frases simples que activan esta skill

- "Cierra el trabajo."
- "Déjalo listo."
- "Valida todo antes de terminar."
- "Puedo entregar esto?"
- "Prepara el cierre."

## Gate

- Tests relevantes pasan.
- Build reproducible.
- Sonar/audit sin bloqueantes.
- Gate local ejecutado y registrado: lint, typecheck, tests unitarios relevantes, coverage, build, audit (si aplica), `git diff --check`, secret scan básico y SonarQube local si está configurado.
- Estándar de calidad interno FromZero cumplido: coverage global y new ≥ 80%, duplicación ≤ 3%, bugs/vulnerabilities/security hotspots abiertos 0, code smells introducidos 0, open issues 0. Si no se cumple, desviación justificada y aprobada registrada en `artifacts/FROMZERO_DECISIONS.md`. Aplica exista o no SonarQube (ver `docs/gates.md`).
- Si SonarQube está configurado: ejecutar el scan antes del cierre con los archivos relevantes commiteados; el log no muestra `Missing blame information`; consultar status, issues y quality gate tras el scan. Si aparece missing blame, el hito no se considera cerrado.
- Métricas de calidad registradas en el handoff (`## Gate de calidad`): comandos ejecutados, coverage local, resultado SonarQube o `no configurado`, missing blame si/no, issues abiertos, duplicación, riesgos residuales y archivos excluidos del commit o del análisis.
- Playwright cubre flujos críticos.
- k6 cubre release candidates.
- Verificación visual en navegador completada para los flujos críticos con UI web: render confirmado en breakpoints y consola/red sin errores sin resolver, con evidencia enlazada o fallback registrado. El avance no se entrega al humano sin que código, consola y visual hayan pasado.
- Seguridad y escalabilidad aprobadas.
- Ledgers de cierre completos: `artifacts/DEFERRED_ACTIVATIONS.md` refleja toda activación pendiente con su evidencia esperada, y `artifacts/FROMZERO_DECISIONS.md` no tiene respuestas del dueño sin reconciliar.
- Tipo de cierre y entorno validado coherentes: un cierre "validado localmente" declara su deuda en el ledger de activaciones; la semántica de cierre vive en `docs/methodology.md`. Ningún Sprint de schema/RLS/integración se entrega con cierre blando sin aprobación de riesgo registrada en `artifacts/FROMZERO_DECISIONS.md`.
- `.env.example` documenta variables sin secretos.
- Recursos activados desde `library/manifest.json` fueron revisados.
- Recursos faltantes tienen resolución aprobada o issue bloqueante.
- `.fromzero/fromzero.lock.json` existe si se instalaron recursos con resolver.
- Integraciones requeridas tienen gates aprobados o limitación explícita.
- No hay dependencias de descargas externas para ejecutar la metodología base.
- `README.md` del proyecto actualizado con el estado del hito (archivo vivo).
- Handoff creado bajo `artifacts/handoffs/`.
- Aceptación de producto contra visión validada registrada en el handoff: reproducir el `## Resumen validado para Spec`, listar resultados esperados como entregado / diferido con razón / no cumplido, enlazar evidencia y pedir aceptación explícita del usuario.
- Gotchas metodológicos registrados en `artifacts/fromzero-feedback/GOTCHAS.md`
  cuando Release detecte aprendizajes sobre FromZero, sus skills, templates, gates,
  adapters o flujo operativo.
- Feedback exportable creado en
  `artifacts/fromzero-feedback/fromzero-methodology-feedback.md` solo si el usuario
  autoriza preparar una versión sanitizada. No enviar automáticamente.
- Cuando Release pase y haya cambios, evidencia, README o handoff actualizados, crea commit automático si es seguro. El cierre debe mostrar hash corto y mensaje completo.

## Cierre de fase

Preséntalo con el formato canónico Informe de cierre de Sprint de `docs/reporting.md`.

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- estado de la verificación visual en navegador (código, consola y visual) o fallback;
- estado de aceptación de producto contra visión validada;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe enlazar el handoff bajo `artifacts/handoffs/` o evidencia de release y decir si el humano puede entregar, debe revisar pendientes o debe corregir bloqueos.
