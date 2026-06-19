# Sprint 8 Test Plan

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
```

## Verificaciones manuales

- No se aplican migraciones cloud.
- No se activa Inngest cloud.
- No se envían emails ni webhooks reales.
- No se agregan secretos reales.
