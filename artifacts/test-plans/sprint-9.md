# Sprint 9 Test Plan

## Alcance

- Core AI interno con FastAPI/Pydantic v2.
- Catálogo `ai_models` y presupuestos `ai_budgets`.
- Adapter OpenRouter mockeable, con provider real deshabilitado por defecto.
- Redacción de secretos/PII antes de logs.
- Budgets por tenant, usuario, feature, provider y modelo.
- Usage metadata para log `ai.invocation`.

## Comandos

```powershell
python -m pytest core-ai/tests
npm test -- tests/unit/sprint9-contracts.test.ts tests/unit/sprint9-sql.test.ts
npm run typecheck
npm run lint
npm audit --audit-level=moderate
git diff --check
```

## Verificaciones manuales

- Revalidar modelo OpenRouter `google/gemma-4-26b-a4b-it:free` contra fuente oficial.
- Confirmar que no se llama OpenRouter real sin `OPENROUTER_API_KEY`.
- Confirmar que `.env.example` solo contiene placeholders.
- Confirmar que logs de IA no contienen prompts, secretos ni PII sin redacción.

## Estado 2026-06-22

- Sprints 1-8 revalidados localmente: 65 pruebas unitarias específicas pasaron.
- OpenRouter ID revalidado contra fuente oficial: `google/gemma-4-26b-a4b-it:free`.
- Sprint 9 ejecutado localmente: 11 pruebas TS y 4 pruebas Python pasaron.
- Gate local completo: `npm run check` pasó con 113 pruebas y build Next.js exitoso.
- `npm audit --audit-level=moderate`: 0 vulnerabilidades.
- Secret scan básico: sin candidatos detectados.
- OpenRouter real queda diferido.
- Entorno resuelto con `.codex/plugins/fromzero/tools/resolve-db-environment.mjs --require cloud`: cloud, URL remota, conexión directa presente, sin valores impresos.
- Dry-run cloud: `supabase db push --db-url [redacted] --dry-run` detectó solo `20260622222347_core_ai_openrouter.sql` pendiente.
- Migración aplicada en Supabase Cloud dev: `20260622222347_core_ai_openrouter.sql`.
- Consulta remota: `schema_migrations.version = 20260622222347`.
- Consulta remota: `public.ai_models` y `public.ai_budgets` existen, tienen RLS habilitado, `authenticated` tiene `SELECT` y `anon` no tiene `SELECT`.
- Seed remoto OpenRouter: `openrouter_seed_count = 1` para `google/gemma-4-26b-a4b-it:free`.
- Prueba RLS real rollback-only: usuario sintético autenticado en tenant A ve `visible_same_tenant=1`, `visible_cross_tenant=0`, `visible_total=1`.
- Advisory remoto fuera de alcance Sprint 9: `public.modules`, `public.plans` y `public.settings` tienen RLS deshabilitado; no se corrigió por ser deuda preexistente y requerir políticas propias.

## Cierre pre-Sprint 10 2026-06-22

- Commits Sprint 9 registrados: `f5fd78e`, `0696b33`, `e173e0e`.
- Decisión aprobada: documentar advisory RLS global de `settings`, `modules` y `plans` sin migración antes de Sprint 10 y revisarlo al finalizar todos los Sprints.
- `npm run check`: pasó con 22 archivos de prueba, 114 pruebas, coverage statements 87.64% y build Next.js exitoso.
- `python -m pytest core-ai/tests`: 4 pruebas pasaron.
- `npm audit --audit-level=moderate`: 0 vulnerabilidades.
- `git diff --check`: sin errores de whitespace; advertencias CRLF existentes en tooling FromZero.
