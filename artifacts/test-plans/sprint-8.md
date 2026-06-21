# Sprint 8 Test Plan reconciliado

## Alcance

- Eventos, jobs e Inngest adapter local.
- Rules con gramática cerrada y loop guard.
- Notifications y email templates.
- Integrations y webhooks con SSRF guard, HMAC y anti-replay.
- Import/export CSV/XLSX con signed URL intent.
- Migración SQL local versionada.

## Comandos

```powershell
npm test -- tests/unit/sprint8-contracts.test.ts tests/unit/sprint8-sql.test.ts
npm run check
npm audit --audit-level=moderate
git diff --check
supabase migration list --linked
```

## Verificaciones manuales

- Migraciones cloud aplicadas en Supabase dev durante Fase 1.
- No se activa Inngest cloud.
- No se envían emails ni webhooks reales.
- No se agregan secretos reales.

## Estado 2026-06-21

- `event_outbox`, `job_runs`, `notifications`, `rules`, `rule_runs`, `email_templates`, `integrations`, `webhooks`, `webhook_deliveries`, `imports` y `exports` existen en cloud dev.
- Integraciones externas reales siguen diferidas: Inngest cloud, Resend, webhooks reales, k6 y OpenRouter.
- Datos demo quedan permitidos solo con `is_demo = true` y allowlist de limpieza.
