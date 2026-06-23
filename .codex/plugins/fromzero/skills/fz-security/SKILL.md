---
name: fz-security
description: "Usar automáticamente cuando el usuario pida revisar seguridad, permisos, secretos, accesos, tenants, pagos, webhooks, APIs o datos sensibles, aunque lo diga como 'revisa si esto es seguro', 'valida permisos', 'asegura los datos' o 'revisa seguridad antes de seguir'."
---

# fz-security

## Frases simples que activan esta skill

- "Revisa si esto es seguro."
- "Valida permisos."
- "Asegura los datos."
- "Revisa seguridad antes de seguir."
- "Verifica que un cliente no vea datos de otro."

## Checklist

- Verificar si `artifacts/FROMZERO_SPEC.md` declara proyecto multi-tenant o single-tenant; toda no-aplicación de controles tenant-aware debe tener razón escrita.
- RLS en tablas tenant-aware.
- RBAC server-side.
- Zod/Pydantic en trust boundaries.
- Service role solo server/background.
- Secrets fuera de cliente, logs y docs.
- Archivos con secretos identificados y excluidos de Git y Docker (`.gitignore` y `.dockerignore`); permitidos en local (`.env.local`/vault), prohibido versionarlos o imprimirlos.
- Plantillas obligatorias `.env.example` y `.mcp.example.json` con placeholders; sin valores reales.
- El `.env.example` sigue el estándar único de `library/resources/env-template.md`: una sección titulada por producto y sin variables duplicadas (una variable por dato).
- Cada sección se marca `# requerido` u `# opcional · activar si: <trigger>`; las opcionales no usadas se borran.
- Al preparar el `.env.example`, indica a la persona exactamente qué variables debe llenar según los recursos activados (no todo el archivo). Si lo pide, explica de dónde y cómo obtener cada valor de forma breve, puntual y precisa. No solicites secretos en el chat; la persona los coloca en su `.env`/`.env.local` local.
- SQL parametrizado.
- Webhooks con firma.
- SSRF guard cuando aplique.
- Logs sin PII innecesaria.
- Secret scan básico como parte del gate local, en cualquier checkpoint de código: revisar el diff (`git diff --check` más revisión de credenciales) o ejecutar el scanner configurado, sin imprimir secretos. Un hallazgo bloquea avanzar.
- Si el proyecto declara un runtime de IA separado (por ejemplo Core AI en el From Zero Framework): budget, rate y costo auditado.

## Controlled Secret Runtime Access

- El agente y sus subagentes pueden leer `.env.local` como fuente secreta de configuración operativa, solo para conectar y usar las herramientas del TechStack del proyecto autorizado: CLI, MCP, SDK, API HTTP, scanners, quality gates, coverage y security checks.
- También pueden usar esos valores para configurar correctamente archivos de apoyo de herramientas (`.mcp.json`, `sonar-project.properties`, configs de CLI/SDK), siguiendo las reglas de abajo.
- Reglas de archivos de configuración:
  - Preferir referencias en vez del valor: `${VAR}` en `.mcp.json` (Claude Code), `env_vars` por nombre en Codex, o lectura desde el entorno. `sonar-project.properties` lleva `sonar.projectKey`/`sonar.host.url` (no secretos); el token va por entorno/CLI (`SONAR_TOKEN`), nunca en el archivo.
  - Valor secreto inline solo si es imprescindible, el archivo está ignorado por Git, no se imprime y se declara como archivo con secretos.
  - Los archivos versionados nunca contienen el secreto.
- Prohibido: imprimir o mostrar secretos; mostrar `.env.local` completo; volcar el entorno sin redacción; copiar secretos a documentación, prompts, respuestas, resúmenes, commits, diffs o logs; versionar secretos; usar credenciales fuera del proyecto.
- Reporte permitido: solo presencia/ausencia, por ejemplo `SONARQUBE_TOKEN_set: true`. Nunca el valor.
- Carga transparente: en Claude Code, el hook `SessionStart` carga `.env.local` con `tools/load-env-local.mjs` para que las CLIs hereden las variables sin pasos extra. Verifica presencia con `node tools/load-env-local.mjs` (solo nombres y estado). En Codex/Antigravity, usa el mecanismo nativo documentado en `library/resources/mcp.md`.

## Integraciones

- Supabase: RLS, RBAC, service role server-only y pruebas inter-tenant.
- Stripe: firma de webhook, idempotencia y auditoría de billing.
- Runpod/Core AI: budget caps, rate limits, timeouts, egress y logs por tenant.
- Hostinger/deploy: tokens y llaves SSH solo como secrets.
- SonarQube: security hotspots revisados antes de release cuando esté configurado. Commitear los archivos relevantes antes del scan final para evitar `Missing blame information`; no imprimir el token ni los logs con secretos.

No conectes ni consultes servicios externos sin aprobación explícita.

Cuando el gate pase y haya correcciones, evidencia o artefactos actualizados, crea commit automático si es seguro. El cierre debe mostrar hash corto y mensaje completo.

## Cierre de fase

Al terminar, entrega siempre un informe breve con:

- qué se ejecutó en esta fase, explicado en lenguaje simple;
- artefactos creados o actualizados, con enlaces Markdown;
- verificaciones aprobadas, pendientes o bloqueadas;
- verificaciones ejecutadas o razón concreta si no se ejecutaron;
- riesgos o decisiones nuevas;
- commit automático creado con hash y mensaje completo, o razón concreta si no se creó;
- siguiente paso humano con el rótulo exacto `Siguiente paso para ti:`.

El cierre debe decir si el humano debe revisar riesgos, aprobar la verificación o corregir un bloqueo de seguridad.
