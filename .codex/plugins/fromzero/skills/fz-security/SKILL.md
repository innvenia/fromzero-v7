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
- SQL parametrizado.
- Webhooks con firma.
- SSRF guard cuando aplique.
- Logs sin PII innecesaria.
- Si el proyecto declara un runtime de IA separado (por ejemplo Core AI en el From Zero Framework): budget, rate y costo auditado.

## Integraciones

- Supabase: RLS, RBAC, service role server-only y pruebas inter-tenant.
- Stripe: firma de webhook, idempotencia y auditoría de billing.
- Runpod/Core AI: budget caps, rate limits, timeouts, egress y logs por tenant.
- Hostinger/deploy: tokens y llaves SSH solo como secrets.
- SonarQube: security hotspots revisados antes de release cuando esté configurado.

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
