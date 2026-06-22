# Fase 1 - Plan de pruebas de reconciliación Sprint 1-8

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Test Plan |
| Propósito o subtítulo | Reconciliación Sprint 1-8 antes de Sprint 9 |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-21 |
| Última actualización | 2026-06-21 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-21: creado durante Fase 1 con evidencia local y cloud |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-21 |
| Frase literal de aprobación | PLEASE IMPLEMENT THIS PLAN |
| Artefactos prerequisito | `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas | GitHub, Supabase CLI, Supabase connector, SonarQube, Playwright, Vitest |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_DECISIONS.md`, `artifacts/DEFERRED_ACTIVATIONS.md` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos. Sin `.env` reales. No se imprime token ni password. |

## Alcance

- GitHub origin, auth y workflow CI.
- Supabase cloud dev link, migraciones y RLS negativa.
- SonarQube config sin token versionado.
- UI shell con capturas 375/768/1920.
- `bootstrap.json` local-only y examples seguros.
- Handler privado de referencia antes de Sprint 9.
- Contrato demo/fundacional con `is_demo = true`.

## Unit

- Vitest completo: 16 archivos, 79 pruebas.
- Bootstrap usa `bootstrap.example.json`, no `bootstrap.json`.
- Handler privado valida tenant context, RBAC, rate-limit contract, auditoría y errores seguros.
- Demo cleanup exige `is_demo = true` y bloquea tablas fundacionales.

## Integration

- `npm run check` ejecuta lint, typecheck, tests, build y verificación de stack.
- `GET /api/v1/settings` compila como ruta dinámica real.
- CI GitHub Actions pasó en run `27921644951`.
- Run previo `27921449589` falló en `npm ci` por npm 10 en runner; corregido con `3ff5c76`.

## RLS/RBAC

- Supabase cloud dev vinculado al project-ref aprobado.
- Migraciones Sprint 3, 4, 6, 7 y 8 confirmadas en cloud por conector Supabase.
- RLS negativa: rol `authenticated` sin claims ve `0` tenants.
- RLS coverage: 30 tablas públicas esperadas tienen RLS activo.
- `anon` no tiene lectura pública sobre tenants.

## Playwright

- `npm run test:e2e` pasó 4 pruebas.
- Viewports ejecutados: 375x812, 768x1024, 1920x1080.

## Visual

- Capturas regeneradas en `artifacts/test-plans/sprint-2-mobile.png`.
- Capturas regeneradas en `artifacts/test-plans/sprint-2-tablet.png`.
- Capturas regeneradas en `artifacts/test-plans/sprint-2-desktop.png`.

## k6

- No ejecutado en Fase 1.
- Requiere URL staging estable y aprobación explícita.

## Limitaciones

- SonarQube API de métricas responde 401 sin token; se validó publicación desde logs de CI.
- SonarQube scan advierte shallow clone y sin blame SCM; no bloqueó el análisis.
- No se activaron Stripe, Resend, Inngest cloud, OpenRouter ni webhooks reales.
- Docker Desktop apagado impidió cache local pg-delta de Supabase, sin bloquear el push remoto.

## Comandos ejecutados

```powershell
git remote -v
gh auth status
gh repo view innvenia/fromzero-v7 --json nameWithOwner,url,visibility,isPrivate
gh variable list --repo innvenia/fromzero-v7
gh secret list --repo innvenia/fromzero-v7
git ls-files -- bootstrap.json
git check-ignore -v bootstrap.json .env.local .mcp.json
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run check
npm audit --audit-level=moderate
npx supabase --version
npx supabase migration list --linked
gh run list --repo innvenia/fromzero-v7 --branch main --limit 5
gh run watch 27921449589 --repo innvenia/fromzero-v7 --exit-status
gh run view 27921449589 --repo innvenia/fromzero-v7 --log-failed
gh run watch 27921644951 --repo innvenia/fromzero-v7 --exit-status
gh run view 27921644951 --repo innvenia/fromzero-v7 --log
```

Conector Supabase:

```sql
-- Lista remota de migraciones del proyecto rqnwvoitfxunheujbklp.
-- Query RLS negativa.
begin;
set local role authenticated;
select count(*)::int as visible_tenants_without_claims from public.tenants;
rollback;

-- Cobertura RLS esperada.
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'tenants', 'profiles', 'profile_permissions', 'user_memberships', 'logs',
    'users', 'user_preferences', 'invitations', 'api_keys',
    'subscriptions', 'statements', 'invoices',
    'documents', 'document_versions', 'files', 'tags', 'taggables', 'bookmarks', 'consent_records',
    'event_outbox', 'job_runs', 'notifications', 'rules', 'rule_runs', 'email_templates', 'integrations', 'webhooks', 'webhook_deliveries', 'imports', 'exports'
  )
order by tablename;
```

## Resultados

| Validación | Resultado |
|---|---|
| GitHub repo | Visible como `innvenia/fromzero-v7` |
| GitHub variable | `SONARQUBE_URL` presente |
| GitHub secret | `SONARQUBE_TOKEN` presente sin imprimir valor |
| CI Sonar config | workflow usa `SONARQUBE_URL` y `SONARQUBE_TOKEN` |
| Supabase CLI | `2.107.0` |
| Supabase CLI linked | bloqueado por `SUPABASE_DB_PASSWORD` no exportada |
| Supabase migrations | conector confirma 5/5 aplicadas en cloud dev |
| RLS negativa | conector: `authenticated` sin claims ve 0 tenants |
| RLS coverage | conector: 30 tablas públicas esperadas con RLS activo |
| Sonar host | configurado como GitHub variable |
| Sonar baseline | `ANALYSIS SUCCESSFUL`; dashboard `https://sonarqube.innvenia.ai/dashboard?id=fromzero-framework` |
| Sonar metrics API | 401 sin token; no se imprimieron secretos |
| GitHub Actions primer run | `27921449589` falló por npm 10 en `npm ci` |
| GitHub Actions final | `27921644951` passed |
| Playwright | 4 passed |
| Vitest | 16 archivos, 79 tests passed |
| Build | Next build passed |
| Audit | 0 vulnerabilidades |
| Bootstrap local-only | `git ls-files -- bootstrap.json` sin salida |
| FromZero checker | falla solo por `.codex/plugins/fromzero/templates/*`, fuera de alcance |

## Evidencia visual

- `artifacts/test-plans/sprint-2-mobile.png`
- `artifacts/test-plans/sprint-2-tablet.png`
- `artifacts/test-plans/sprint-2-desktop.png`

## Pendientes de cierre Fase 1

- Registrar cierre explícito del dueño antes de iniciar Sprint 9.
