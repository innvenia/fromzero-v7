---
name: fz-design
description: "Usar cuando el usuario quiera definir el diseño técnico antes del plan: schemas de datos, contratos de API, permisos RLS/RBAC, jobs, cache, migraciones, entornos y ADRs. Se activa con frases como definir el diseño técnico, diseñar la base de datos o preparar los contratos antes de planear. Requiere artifacts/FROMZERO_SPEC.md aprobado como base."
---

# fz-design

## Frases simples que activan esta skill

- "Define el diseño técnico antes de planear."
- "Diseña la base de datos y las APIs."
- "Cómo se va a construir esto por dentro?"
- "Define los contratos antes del plan."
- "Prepara el diseño técnico."

## Reglas

- Design en esta skill significa diseño técnico de arquitectura: schemas, APIs, permisos, jobs, cache, migraciones, integraciones, contratos y ADRs. No se refiere al Design System de UI.
- No iniciar diseño si `artifacts/FROMZERO_SPEC.md` no existe o no está aprobado o aceptado explícitamente como base; volver a `fz-spec`.
- Ejecutar esta fase cuando la spec implique schema, APIs, permisos, jobs, cache, migraciones, integraciones o arquitectura relevante.
- Si no aplica, registrar en `artifacts/FROMZERO_SPEC.md` o `artifacts/FROMZERO_PLAN.md`: `diseño técnico no requerido`, con razón concreta. No saltes esta decisión en silencio.
- Definir schema de datos: tablas, ownership, `tenant_id` cuando aplique, índices y migraciones SQL versionadas cuando haya cambios de base de datos.
- Definir contrato común de APIs: método, auth, contexto tenant, RBAC, RLS, rate limit, validación, DTO, errores y auditoría.
- Definir Server Actions/API Routes y DTOs sin columnas privadas.
- Definir RLS y RBAC: cross-tenant y dentro del tenant por permisos/ownership, según el modo tenant declarado en la spec.
- Definir jobs, cache, queries críticas e índices, con decisión explícita por cada uno.
- Definir la estrategia de entornos: Dev, Test/Staging y Producción separados.
- Definir los contratos base de capacidades diferidas: variables en `.env.example`, feature flags, tablas o configuración, wrappers, interfaces y gates de activación.
- Crear un ADR bajo `artifacts/adr/` usando `templates/adr.md` por cada decisión de arquitectura mayor.
- Registrar el estado explícito de cada ADR (`borrador`, `aprobado`, `rechazado`, `reemplazado`, `requiere cambios` o `requiere re-aprobación`). No marcar un ADR como `aprobado` sin revisión; un ADR en `borrador` no es base de ejecución aprobada.
- Comunicar el estado de cada ADR a `fz-plan`: el estado del Plan es independiente del estado del ADR, y un plan no debe apoyarse en un ADR en `borrador` sin diferido aprobado con riesgo.
- Verificar el resultado contra el gate Design de la metodología antes de cerrar.
- Cuando la fase pase y haya archivos creados o actualizados, crear commit automático si es seguro. El cierre debe mostrar hash corto y mensaje completo.
- Si el entorno está en modo plan o sin escritura, entregar el diseño en la conversación y el prompt exacto para materializar los documentos al habilitar escritura.

## Salida

Diseño implementable: schema, contratos de API, permisos, jobs, cache, queries, migraciones, entornos y ADRs listos para que `fz-plan` distribuya el trabajo en Sprints.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe indicar que el humano debe revisar el diseño, aprobarlo como base del plan o pedir correcciones específicas.
