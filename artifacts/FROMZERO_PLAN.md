# FROMZERO_PLAN

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_PLAN |
| Propósito o subtítulo | Plan de implementación por Sprints verificables |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-21 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: creado desde Spec aprobada, con diseño técnico ADR previo; 2026-06-18: corregido por Task path, pg_cron y FCP, requiere re-aprobación; 2026-06-18: propagados ajustes Core AI, auditoría, RBAC, rules e integraciones, requiere re-aprobación; 2026-06-18: aprobado explícitamente por el usuario para preparar Sprint 1; 2026-06-21: Fase 1 saneamiento guiado Sprint 1-8 ejecutada contra GitHub, Supabase cloud dev y SonarQube sin tocar docs ni .codex; 2026-06-21: validación final local/cloud registrada antes del commit de cierre |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-18 |
| Frase literal de aprobación | Apruebo el plan. |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado explícitamente como base |
| Documentos o fuentes asociadas | `docs/`, `artifacts/FROMZERO_CONTEXT.md`, `artifacts/FROMZERO_QUESTIONNAIRE.md`, `artifacts/FROMZERO_SPEC.md`, `artifacts/adr/`, recursos locales FromZero |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `artifacts/issues/`, `artifacts/test-plans/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos impresos. Sin lectura de `.env` reales. `bootstrap.json` local-only. No se tocaron `docs/` ni `.codex/`. |

## Resumen para el dueño

- Qué se implementará: una base web SaaS/corporate multi-tenant, reusable y vendible, con datos, auth, módulos, billing, Core AI, UI operacional, pruebas y release.
- Orden de entrega: primero estructura, datos, seguridad y contratos; después UI, módulos, integraciones, IA, calidad y empaquetado comercial.
- Primer resultado verificable: repositorio con estructura objetivo, placeholders seguros, inventario API inicial, migraciones base y gates mínimos listos.
- Qué queda diferido: activación MCP, observabilidad concreta por app derivada, Redis activo, app Expo y redacción legal final.
- Riesgos principales: aislamiento tenant/RLS, billing/webhooks, Core AI/OpenRouter, jobs automatizados, import/export y performance.
- Aprobaciones humanas requeridas: este Plan; luego autorizaciones puntuales para servicios cloud, secretos, MCP, migraciones destructivas, billing real y legal.
- Qué se pide aprobar: este Plan y sus ADRs como base para iniciar ejecución Sprint por Sprint.

## Estado operativo del plan

- Versión objetivo: From Zero Framework v7.4.
- Spec base: `artifacts/FROMZERO_SPEC.md`.
- Estado operativo: `artifacts/FROMZERO_STATE.md`.
- Unidad visible de trabajo: Sprint.
- Diseño técnico base: `artifacts/adr/001-data-auth-rls-rbac.md`, `artifacts/adr/002-api-module-contracts.md`, `artifacts/adr/003-integrations-jobs-cache.md`, `artifacts/adr/004-deployment-quality-gates.md`, `artifacts/adr/005-core-ai-openrouter.md`.

## Fase 1 - Saneamiento guiado Sprint 1-8

Esta Fase 1 convierte los Sprints 1-8 de estado local a base verificable antes de Sprint 9. No reemplaza la ejecución guiada: Codex ejecuta cambios y comandos; el dueño valida accesos, secrets externos, decisiones visuales y riesgos antes del cierre final.

| Bloque | Decisión humana requerida | Acción de Codex | Evidencia esperada | Punto de parada | Criterio de cierre |
|---|---|---|---|---|---|
| Gate inicial | Configurar secrets externos sin compartir valores | Configurar GitHub origin, CI, Sonar properties y Supabase link | `git remote -v`, `gh auth status`, `supabase migration list --linked`, Sonar HTTP 200 | Si GitHub, Supabase o Sonar no responden | Gate respondido o bloqueo externo documentado |
| Secretos | Rotar antes de producción los secretos compartidos por chat | Reforzar `.gitignore`, `.dockerignore`, examples y sacar `bootstrap.json` del índice | `git check-ignore -v`, `git ls-files -- bootstrap.json` sin salida | Si un secreto queda trackeado | `bootstrap.json` local-only |
| Sprint 1 | Aceptar que `.env.local` no se crea por regla de no tocar `.env` reales | Crear CI, Sonar config, examples seguros y ledger | `npm run check`, `npm audit` | Si falta tooling base | cerrado validado |
| Sprint 2 | Validar visualmente UI shell | Ejecutar Playwright y regenerar capturas | PNG 375/768/1920 en `artifacts/test-plans/` | Si hay desacuerdo visual | cerrado validado |
| Sprint 3 | Confirmar Supabase cloud dev como fuente de verdad | Aplicar migraciones en base limpia y ejecutar RLS negativa | `supabase db push --linked`, query `authenticated` sin claims = 0 filas | Si la base no estaba limpia | cerrado validado |
| Sprint 4 | Mantener `Guest` canónico y API keys por RBAC | Validar contratos existentes y crear handler privado de referencia | tests auth/RBAC/API key y `/api/v1/settings` dinámico | Si RBAC no coincide | contrato implementado, integración pendiente |
| Sprint 5 | Aceptar demo solo si limpiable | Crear contrato allowlist demo con `is_demo = true` | `tests/unit/demo-cleanup.test.ts` | Si una tabla demo no es limpiable | cerrado validado |
| Sprint 6 | Mantener billing real diferido | Validar contratos billing existentes tras migración cloud | tests Sprint 6 y tablas cloud | Si requiere Stripe real | contrato implementado, integración pendiente |
| Sprint 7 | No purgar sin preview | Validar storage/documents/consent y excluir consent de demo | tests Sprint 7 y migración cloud | Si Storage real requiere acción manual | contrato implementado, integración pendiente |
| Sprint 8 | Mantener externos diferidos sin aprobación | Validar jobs/webhooks/import/export local y DB | tests Sprint 8 y migración cloud | Si requiere Inngest/Resend/webhook real | contrato implementado, integración pendiente |

### Evidencia ejecutada el 2026-06-21

| Evidencia | Resultado |
|---|---|
| GitHub origin | `origin` apunta a `https://github.com/innvenia/fromzero-v7.git` |
| GitHub auth | `gh auth status` autenticado como `innvenia` |
| GitHub variable | `SONARQUBE_URL` presente con `https://sonarqube.innvenia.ai` |
| GitHub secret | `SONARQUBE_TOKEN` presente sin imprimir valor |
| CI Sonar env | workflow usa `SONARQUBE_URL` y `SONARQUBE_TOKEN`, mapeados a `SONAR_HOST_URL` y `SONAR_TOKEN` |
| Supabase CLI | `2.107.0` |
| Supabase link | project-ref `rqnwvoitfxunheujbklp` |
| Supabase CLI linked | `migration list --linked` bloqueado porque `SUPABASE_DB_PASSWORD` no está exportada; no se leyó `.env.local` |
| Supabase migrations | conector confirma 5 remotas: `20260618000300`, `20260619000400`, `20260619000600`, `20260619050821`, `20260619110800` |
| Supabase RLS negativa | conector: `authenticated` sin claims ve `0` tenants |
| Supabase RLS coverage | conector: 30 tablas públicas esperadas con RLS activo |
| SonarQube host | `https://sonarqube.innvenia.ai` configurado en GitHub variable |
| SonarQube baseline | pendiente hasta primer CI después del push |
| CI | workflow creado localmente; primer run pendiente de push |
| UI | Playwright 4/4 passed; capturas mobile/tablet/desktop regeneradas |
| Gate local | `npm run check` passed |
| Audit | `npm audit --audit-level=moderate` = 0 vulnerabilidades |
| E2E | `npm run test:e2e` = 4 passed |
| FromZero checker | falla solo por `.codex/plugins/fromzero/templates/*`, fuera de alcance |
| Artefactos FromZero | actualizados en `artifacts/`, sin tocar `docs/` |

### Estado para Sprint 9

Sprint 9 no debe iniciar hasta que el dueño cierre explícitamente Fase 1. Quedan pendientes externos: ejecutar primer GitHub Actions run tras push, ejecutar baseline SonarQube y decidir activaciones reales de OpenRouter/Core AI.

## 1. Reglas de ejecución

- Ejecutar Sprint por Sprint.
- No iniciar Build hasta que `artifacts/FROMZERO_PLAN.md` tenga aprobación explícita.
- No tocar servicios cloud sin aprobación por servicio.
- No leer ni imprimir `.env` reales.
- Crear solo `.env.example` con placeholders.
- Mantener credenciales reales fuera del repo.
- Validar cada Sprint con comandos y criterios verificables.
- Mantener `artifacts/FROMZERO_STATE.md` actualizado como punto central de reanudación.
- Commits pequeños con Conventional Commits.
- No modificar `src/`, `supabase/`, `core-ai/` ni código de aplicación en esta fase de planificación.
- Este plan pasó la validación de cierre contra `artifacts/FROMZERO_SPEC.md`; ver `## 9. Validación de cierre`.

## 2. Estado inicial

- Git: inicializado.
- Branch: `main`.
- Commit base: `88c9a19 docs(fromzero): align pre-spec documentation`.
- `.gitignore`: existente.
- Spec: aprobada el 2026-06-18 con frase literal `Apruebo la especificación.`.
- Cuestionario: aprobado, con 0 preguntas críticas pendientes.
- Plugin FromZero: instalación local del proyecto en `.codex/plugins/fromzero`.
- Estado operativo: creado en esta fase.
- Riesgos iniciales: amplitud de alcance, RLS/RBAC, billing, jobs, Core AI, modelo OpenRouter y aprobaciones externas.

## 3. Recursos y herramientas

- Recursos locales seleccionados: `frontend-web`, `backend-api`, `databases`, `supabase`, `auth-providers`, `payments`, `stripe`, `ai-providers`, `inngest`, `redis`, `playwright`, `k6`, `sonarqube`, `testing-quality`, `deployment-cloud`, `fromzero-ui-template`, `mcp-supabase`, `mcp-sonarqube`.
- Selección de recursos FromZero: no se ejecutó `tools/resource-resolver.mjs --install` en esta fase.
- Recursos faltantes: no detectados como bloqueantes para planificar; versiones oficiales se fijan en Sprint 1 antes de implementar.
- Decisión de instalación: si un Sprint instala recursos empaquetados, debe producir `.fromzero/fromzero.lock.json` como evidencia. No instalar recursos globalmente.
- MCP: preparar configuración, pero no activar Supabase/SonarQube MCP sin turno dedicado y aprobación explícita.

## 4. Verificaciones externas

| Verificación | Estado | Condición de activación | Evidencia requerida |
|---|---|---|---|
| Versiones npm/Next/Tailwind/Supabase | pendiente | Sprint 1 antes de scaffold | Registro en docs técnicos o lockfiles |
| OpenRouter `google/gemma-4-26b-a4b-it:free` | pendiente de revalidación | Sprint 9 antes de Core AI ejecutable | URL/ID exacto y config fijada |
| Stripe/Resend/Inngest | pendiente | Sprint con adapter activo | Docs oficiales y pruebas mock/webhook |
| SonarQube | pendiente | Sprint 11 | CI gate o evidencia self-hosted |
| k6 staging | pendiente | Sprint 11 | Reporte `k6 run` contra staging |
| MCP Supabase/SonarQube | diferido | Turno dedicado posterior | Aprobación explícita y tokens fuera del repo |

## 5. Variables y placeholders

- Variables requeridas en `.env.example`: ApplicationRuntime, ApplicationAuth, SupabaseRuntime, SupabaseDatabase, SupabaseTooling, SupabaseLegacy, Stripe, Resend, CoreAI, OpenRouter, Inngest, Redis, Recaptcha, SonarQube, NextJsTelemetry, Playwright y K6.
- Secretos reales fuera del repo: todas las variables secretas.
- Archivos locales no versionados: `.env`, `.env.*`, dumps, logs, reportes con datos sensibles.
- Regla: `.env.example` documenta nombres, no valores reales.

## 5.1 Trazabilidad criterios -> Sprints

| Criterio de aceptación (spec) | Sprint dueño | Progresivo (Sprint de cierre) |
|---|---|---|
| Spec revisada y aprobada explícitamente antes de crear Plan | Sprint 1 | Sprint 1 |
| No existen Plan/State antes de aprobación de Spec | Sprint 1 | Sprint 1 |
| Matriz de decisiones, requisitos y gates cubierta | Sprint 1 | Sprint 12 |
| Conflictos C001-C012 visibles y resueltos o diferidos | Sprint 1 | Sprint 1 |
| OpenRouter model ID fijado | Sprint 9 | Sprint 9 |
| Q066/D063 corregido a `degrade_to_free` | Sprint 6 | Sprint 6 |
| Import CSV/XLSX y export masivo CSV/XLSX | Sprint 8 | Sprint 8 |
| Aprobación del cuestionario registrada literal | Sprint 1 | Sprint 1 |

## 5.2 Trazabilidad fuentes/capacidades -> Sprints

| Capacidad | Tipo | Fuente | Obligación | Sprint dueño | Archivos objetivo | Pruebas/comandos | Verificaciones | Criterio verificable |
|---|---|---|---|---|---|---|---|---|
| `docs/PRD.md` | fuente | docs | venta | Sprint 1 | `artifacts/`, `docs/` | revisión documental | cobertura plan | PRD trazado a Sprints |
| `docs/REFERENCE_MODULES.md` | fuente | docs | venta | Sprint 1 | `artifacts/`, módulos | revisión documental | cobertura módulos | módulos con dueño |
| `docs/REFERENCE_DATABASE_SCHEMA.md` | fuente | docs | primer corte | Sprint 3 | `supabase/migrations/` | SQL tests | RLS/schema | schema base validado |
| `docs/REFERENCE_ARCHITECTURE.md` | fuente | docs | primer corte | Sprint 3 | `docs/API_ENDPOINT_INVENTORY.md` | contract tests | API inventory | contratos definidos |
| `docs/REFERENCE_STRUCTURE.md` | fuente | docs | primer corte | Sprint 1 | árbol repo | `git ls-files`, tree check | estructura | árbol objetivo creado |
| `docs/REFERENCE_STACK.md` | fuente | docs | primer corte | Sprint 1 | `package.json`, lockfile | `npm run typecheck` | stack | versiones fijadas |
| `docs/SECURITY_ASSURANCE.md` | fuente | docs | release candidate | Sprint 11 | tests seguridad | abuse tests | security gates | gates verdes |
| `docs/SCALABILITY_ASSURANCE.md` | fuente | docs | release candidate | Sprint 11 | k6, reports | `k6 run` | performance | budgets cumplidos |
| `docs/DEPENDENCY_MATRIX.md` | fuente | docs | primer corte | Sprint 1 | Plan/State | revisión | dependencias | orden sin inversión |
| `docs/BOOTSTRAP_REFERENCE.md` | fuente | docs | primer corte | Sprint 3 | bootstrap config | bootstrap test | Tenant Zero | bootstrap idempotente |
| `docs/REFERENCE_DESIGN_SYSTEM.md` | fuente | docs | release candidate | Sprint 2 | UI shell | Playwright | visual/a11y | UI base usable |
| `docs/REFERENCE_THREAT_MODEL.md` | fuente | docs | release candidate | Sprint 11 | security tests | abuse tests | threat model | riesgos mitigados |
| `docs/STRATEGY.md` | fuente | docs | venta | Sprint 12 | `LICENSE`, docs venta | legal review | comercial | entrega vendible |
| Settings | módulo | Context | primer corte | Sprint 3 | `src/framework/modules/settings/` | CRUD/RBAC | RLS/API | settings global/tenant |
| Module | módulo | Context | primer corte | Sprint 3 | `src/framework/modules/module/` | registry tests | module registry | módulos registrables |
| Plan | módulo | Context | primer corte | Sprint 3 | `src/framework/modules/plan/` | feature tests | plan limits | planes base |
| AI Model | módulo | Context | release candidate | Sprint 9 | `src/framework/modules/ai-model/`, `core-ai/` | adapter/guardrail tests | OpenRouter | modelo configurable con pricing, límites y fallback |
| Log | módulo | Context | primer corte | Sprint 3 | `src/framework/modules/log/` | audit tests | append-only + wrapper/trigger | auditoría crítica |
| Profile | módulo | Context | primer corte | Sprint 4 | `src/framework/modules/profile/` | permission tests | RBAC guard | permisos efectivos |
| Tenant | módulo | Context | primer corte | Sprint 3 | `src/framework/modules/tenant/` | RLS tests | isolation | tenant aislado |
| User | módulo | Context | primer corte | Sprint 4 | `src/framework/modules/user/` | auth tests | membership | usuario/membresía |
| Invitation | módulo | Context | release candidate | Sprint 4 | `src/framework/modules/invitation/` | invitation tests | token TTL | invitación segura |
| Notification | módulo | Context | release candidate | Sprint 8 | `src/framework/modules/notification/` | event tests | delivery | notificación in-app |
| Rule | módulo | Context | release candidate | Sprint 8 | `src/framework/modules/rule/` | Inngest/rule grammar tests | automation filter + loop guard | reglas auditables |
| Custom Field | módulo | Context | release candidate | Sprint 5 | `src/framework/modules/custom-field/` | validation tests | schema limits | campos permitidos |
| Email Template | módulo | Context | release candidate | Sprint 8 | `src/framework/modules/email-template/` | email adapter tests | Resend mock | plantilla enviada |
| API Key | módulo | Context | release candidate | Sprint 4 | `src/framework/modules/api-key/` | scope tests | hash/scopes | API key segura |
| Integration | módulo | Context | release candidate | Sprint 8 | `src/framework/integrations/` | SSRF/credentials tests | adapter contracts | integración segura con credentials cifradas |
| Webhook | módulo | Context | release candidate | Sprint 8 | `src/framework/modules/webhook/` | webhook tests | HMAC/replay | webhook firmado |
| Document | módulo | Context | release candidate | Sprint 7 | `src/framework/modules/document/` | storage tests | versioning | documento versionado |
| Import | módulo | Context | release candidate | Sprint 8 | `src/framework/modules/import/` | import tests | async jobs | CSV/XLSX validado |
| Export | módulo | Context | release candidate | Sprint 8 | `src/framework/modules/export/` | export tests | signed URL | CSV/XLSX exportado |
| Subscription | módulo | Context | release candidate | Sprint 6 | `src/framework/modules/subscription/` | billing tests | Stripe mock | suscripción correcta |
| Statement | módulo | Context | release candidate | Sprint 6 | `src/framework/modules/statement/` | job tests | billing jobs | statement generado |
| Invoice | módulo | Context | release candidate | Sprint 6 | `src/framework/modules/invoice/` | PDF tests | UI export | PDF individual |
| File | módulo | Context | release candidate | Sprint 7 | `src/framework/modules/file/` | signed URL tests | storage | archivo seguro |
| Tag | módulo | Context | release candidate | Sprint 7 | `src/framework/modules/tag/` | CRUD tests | tenant scope | tags aislados |
| Bookmark | módulo | Context | release candidate | Sprint 7 | `src/framework/modules/bookmark/` | user tests | user scope | bookmark por usuario |
| Filter | módulo | Context | release candidate | Sprint 5 | `src/framework/modules/filter/` | grid tests | ownership | filtro guardado |
| Task | módulo | Context | release candidate | Sprint 10 | `src/web/modules/task/` | full triad tests | reference module | módulo ejemplo |
| Record Relationship | transversal | Context | release candidate | Sprint 5 | `src/framework/relationships/` | relation tests | referential gates | relaciones transversales |
| Supabase PostgreSQL/Auth/Storage/RLS | datos/seguridad | recursos FromZero | primer corte | Sprint 3 | `supabase/` | migration/RLS tests | Supabase | base segura |
| Core AI Python | servicio interno | docs | release candidate | Sprint 9 | `core-ai/` | Pydantic/guardrail tests | internal-only | IA interna con límites por petición |
| Module Factory | transversal | docs | primer corte | Sprint 5 | `src/framework/factory/` | factory tests | contract | CRUD generado |
| Grid Universal | UI/transversal | docs | release candidate | Sprint 5 | `src/framework/grid/` | grid tests | Playwright | grid reusable |
| Bootstrap Tenant Zero | configuración | bootstrap | primer corte | Sprint 3 | `bootstrap.json`, scripts | bootstrap test | one-shot | Tenant Zero creado |
| RBAC server-side | seguridad | security | primer corte | Sprint 4 | `src/framework/auth/` | API tests | `requirePermission` + RBAC | permisos server-side |
| RLS tenant-aware | seguridad | schema/security | primer corte | Sprint 3 | SQL policies | RLS tests | isolation | acceso cross-tenant falla |
| API `/api/v1/*` | API | architecture | primer corte | Sprint 3 | `docs/API_ENDPOINT_INVENTORY.md` | contract tests | versioning | rutas versionadas |
| Event bus/Inngest | job | stack/resource | release candidate | Sprint 8 | `src/framework/jobs/` | Inngest tests | idempotency | eventos procesados |
| pg_cron scheduled jobs | job programado | D9/Stack/Architecture/Scalability | release candidate | Sprint 8 | `supabase/migrations/`, `src/framework/jobs/` | schedule tests | pg_cron | configuración base en Sprint 8; expiración/trial en Sprint 6; purga en Sprint 7 |
| Redis/BullMQ | escalabilidad | stack/resource | posterior | Sprint 11 | adapter placeholder | fallback tests | default off | no bloquea sin Redis |
| Playwright | testing | resource | release candidate | Sprint 2 | `tests/e2e/` | `npx playwright test` | viewports | UI no rota |
| k6 | testing/performance | resource | release candidate | Sprint 11 | `tests/k6/` | `k6 run` | budgets | carga aceptada |
| SonarQube | calidad | resource | release candidate | Sprint 11 | CI workflow | Sonar gate | quality | gate verde |
| i18n `next-intl` | i18n | stack | release candidate | Sprint 2 | messages/routes | i18n tests | es/en | traducciones base |
| WCAG 2.2 AA | accesibilidad | design system | release candidate | Sprint 2 | UI components | a11y tests | Playwright | controles accesibles |
| Observabilidad | observabilidad | stack/PRD | por app derivada | Sprint 12 | adapter placeholders | config review | opt-in | no activa por defecto |

## 5.3 Trazabilidad requisitos atomicos -> Sprints

| ID | Requisito atomico | Dominio | Fuente | Heading/Subheading | Obligación | Sprint dueño | Archivos objetivo | Pruebas/comandos | Verificaciones | Criterio verificable |
|---|---|---|---|---|---|---|---|---|---|---|
| REQ-001 | Framework base reutilizable, no app vertical | producto | Context | Propósito | primer corte | Sprint 1 | `README.md`, `docs/`, `artifacts/` | review | alcance | enfoque framework preservado |
| REQ-002 | Alcance documentado como base vendible | producto | Context/PRD | Alcance | venta | Sprint 1 | Plan/State | review | cobertura | alcance trazado |
| REQ-003 | No orientar a usuarios no-code | producto | Strategy | Anti-persona | venta | Sprint 1 | docs comerciales | review | estrategia | anti-persona explícita |
| REQ-004 | Usar Next.js App Router | frontend-web | Stack | Frontend | primer corte | Sprint 2 | `src/app/` | `npm run build` | stack | App Router activo |
| REQ-005 | TypeScript strict | frontend-web | Stack | Frontend | primer corte | Sprint 2 | `tsconfig.json` | `npm run typecheck` | strict | typecheck pasa |
| REQ-006 | Tailwind CSS v4 según docs | theme-branding | Stack | Styling | primer corte | Sprint 2 | CSS/config | build | visual | Tailwind operativo |
| REQ-007 | shadcn/UI o primitivas compatibles | ui-primitives-overlays | Stack/UI | UI | primer corte | Sprint 2 | `src/framework/ui/` | Playwright | UI | primitivas renderizan |
| REQ-008 | Tokens visuales centralizados | theme-branding | Design | Diseño | primer corte | Sprint 2 | tokens/theme | visual review | theming | tokens centralizados |
| REQ-009 | Componentes base FromZero si se adopta UI local | ui-primitives-overlays | UI template | UI | primer corte | Sprint 2 | `src/framework/ui/` | component tests | UI | componentes base |
| REQ-010 | Evitar deuda migrada `window.*`, `location.hash`, globals | ui-primitives-overlays | UI template | UI | primer corte | Sprint 2 | UI code | lint/review | debt scan | sin patrones vetados |
| REQ-011 | Supabase PostgreSQL base principal | databases | Stack | Backend | primer corte | Sprint 3 | `supabase/` | migration tests | DB | Supabase base |
| REQ-012 | RLS en toda tabla tenant-aware | seguridad | Schema/Security | RLS | primer corte | Sprint 3 | SQL policies | RLS tests | isolation | RLS cubre tablas |
| REQ-013 | `tenant_id` desde contexto seguro | auth-session | Security | Tenant | primer corte | Sprint 4 | auth/tenant context | BOLA tests | tenant | cliente no impone tenant |
| REQ-014 | RBAC server-side con guard estándar | auth-session | Security | Auth | primer corte | Sprint 4 | auth/RBAC | API tests | permissions | RBAC server-side contra `profile_permissions` |
| REQ-015 | No versionar secretos ni leer `.env` reales | seguridad | Security | Secrets | primer corte | Sprint 1 | `.gitignore`, `.env.example` | secret scan | git | sin secretos |
| REQ-016 | `bootstrap.json` un solo uso | bootstrap-order | Bootstrap | Bootstrap | primer corte | Sprint 3 | bootstrap config | bootstrap test | one-shot | segunda ejecución no muta |
| REQ-017 | Crear Tenant Zero | configuración | Bootstrap | Bootstrap | primer corte | Sprint 3 | seeds/bootstrap | seed check | tenant | Tenant Zero existe |
| REQ-018 | Crear Super Admin inicial | configuración | Bootstrap | Bootstrap | primer corte | Sprint 3 | seeds/bootstrap | seed check | admin | Super Admin existe |
| REQ-019 | `app.mode` = SaaS | configuración | Questionnaire | Bootstrap | primer corte | Sprint 3 | settings seed | config check | settings | modo SaaS |
| REQ-020 | `licensing_model` = `per_tenant` | configuración | Questionnaire | Bootstrap | venta | Sprint 6 | billing config | subscription tests | licensing | por tenant |
| REQ-021 | Settings global/tenant | módulo | Modules | Settings | primer corte | Sprint 3 | settings module | CRUD/RBAC | module | settings funcionan |
| REQ-022 | Registrar módulos y disponibilidad | módulo | Modules | Module | primer corte | Sprint 3 | module registry | registry tests | module | disponibilidad por módulo |
| REQ-023 | Planes, límites y features | billing-subscriptions | Modules | Plan | primer corte | Sprint 3 | plan module | feature tests | gating | límites aplican |
| REQ-024 | Catálogo de modelos IA con pricing, límites y fallback | módulo | Modules | AI Model | release candidate | Sprint 9 | AI model module | adapter/guardrail tests | Core AI | modelos catalogados |
| REQ-025 | Logs/auditoría con wrapper y respaldo PostgreSQL | seguridad | Modules | Log | primer corte | Sprint 3 | log module | audit tests | audit | mutaciones registradas |
| REQ-026 | Perfiles/roles/permisos | auth-session | Modules | Profile | primer corte | Sprint 4 | profile/RBAC | permission tests | RBAC | matriz aplicada |
| REQ-027 | Tenants con aislamiento | módulo | Modules | Tenant | primer corte | Sprint 3 | tenant module | RLS tests | isolation | tenant aislado |
| REQ-028 | Usuarios y membresías | auth-session | Modules | User | primer corte | Sprint 4 | user module | auth tests | membership | membresías válidas |
| REQ-029 | Invitaciones seguras | auth-session | Modules | Invitation | release candidate | Sprint 4 | invitation module | invitation tests | token TTL | invitación segura |
| REQ-030 | Notificaciones por eventos | notifications | Modules | Notification | release candidate | Sprint 8 | notification module | event tests | delivery | eventos notifican |
| REQ-031 | Reglas por datos, tiempo, webhooks y condiciones cerradas | event-bus-rules | Modules/Q057 | Rule | release candidate | Sprint 8 | rule/jobs | Inngest/rule grammar tests | automation | reglas ejecutan |
| REQ-032 | Campos personalizados por módulo permitido | custom-fields | Modules/Q042 | Custom Field | release candidate | Sprint 5 | custom field module | validation tests | allowlist | campos restringidos |
| REQ-033 | Plantillas email | notifications | Modules/Q014 | Email Template | release candidate | Sprint 8 | email template module | email tests | adapter | plantilla procesa |
| REQ-034 | API keys con hash, scopes, expiración opcional | api-errors-security | Modules/Q074 | API Key | release candidate | Sprint 4 | API key module | scope tests | security | key no reversible |
| REQ-035 | Integraciones externas con credentials cifradas por adapter | api-errors-security | Modules | Integration | release candidate | Sprint 8 | integration adapters | SSRF/credentials tests | adapters | integración segura |
| REQ-036 | Webhooks firmados y anti-replay | api-errors-security | Modules | Webhook | release candidate | Sprint 8 | webhook module | webhook tests | HMAC | replay rechazado |
| REQ-037 | Documentos versionados | storage-files | Modules | Document | release candidate | Sprint 7 | document module | storage tests | versioning | versiones controladas |
| REQ-038 | Import CSV/XLSX con validación | import-export | PRD/Q036 | Import | release candidate | Sprint 8 | import module | import tests | CSV/XLSX | import validado |
| REQ-039 | Export CSV/XLSX | import-export | PRD/Q036/Q067 | Export | release candidate | Sprint 8 | export module | export tests | CSV/XLSX | export validado |
| REQ-040 | Suscripciones | billing-subscriptions | Modules | Subscription | release candidate | Sprint 6 | subscription module | billing tests | Stripe mock | suscripción correcta |
| REQ-041 | Statements | billing-subscriptions | Modules | Statement | release candidate | Sprint 6 | statement module | job tests | billing job | statement generado |
| REQ-042 | PDF de registros individuales billing | billing-subscriptions | PRD/Modules | Invoice/Statement | release candidate | Sprint 6 | invoice/statement UI | PDF tests | PDF | PDF individual |
| REQ-043 | Archivos con signed URLs | storage-files | Modules | File | release candidate | Sprint 7 | file module | signed URL tests | storage | URL segura |
| REQ-044 | Tags transversales | módulo | Modules | Tag | release candidate | Sprint 7 | tag module | CRUD tests | scope | tags tenant-aware |
| REQ-045 | Bookmarks por usuario | módulo | Modules | Bookmark | release candidate | Sprint 7 | bookmark module | user tests | scope | bookmark usuario |
| REQ-046 | Filtros guardados | grid-module-factory | Modules | Filter | release candidate | Sprint 5 | filter/grid | grid tests | ownership | filtros guardados |
| REQ-047 | Task como módulo ejemplo app final | módulo | Structure/Q058 | Task | release candidate | Sprint 10 | task module | reference tests | reference | módulo ejemplo |
| REQ-048 | Record relationships como subsistema transversal | módulo | Questionnaire | Record Relationship | release candidate | Sprint 5 | relationships | relation tests | data | relaciones válidas |
| REQ-049 | Campos comunes y soft delete | tabla | Schema/PRD | Metadata | primer corte | Sprint 3 | migrations | schema tests | soft delete | metadata común |
| REQ-050 | Versionado solo documents/files cuando aplique | tabla | Schema | Versionado | release candidate | Sprint 7 | migrations | migration tests | versioning | versionado acotado |
| REQ-051 | Consent records mínimos | consent-records | Schema/Q027 | Consent | release candidate | Sprint 7 | consent module | consent tests | legal | consentimiento auditable |
| REQ-052 | API versionada `/api/v1/*` | api-errors-security | Architecture | API | primer corte | Sprint 3 | API inventory/routes | contract tests | versioning | rutas versionadas |
| REQ-053 | Zod/Pydantic en trust boundaries | api-errors-security | Architecture | Validation | primer corte | Sprint 3 | validators | validation tests | boundary | validación obligatoria |
| REQ-054 | Core AI como servicio interno con guardrails técnicos | ai-providers | Architecture | Core AI | release candidate | Sprint 9 | `core-ai/` | integration/guardrail tests | internal | no público directo |
| REQ-055 | FastAPI/Pydantic v2 para Core AI | ai-providers | Stack | Python | release candidate | Sprint 9 | `core-ai/` | API tests | Pydantic | servicio valida DTO |
| REQ-056 | API p95 < 200ms salvo excepción | performance-budget | Scalability | Performance | release candidate | Sprint 11 | k6/APM | `k6 run` | p95 | budget cumplido |
| REQ-071 | FCP < 1.5s Fast 3G | performance-budget | PRD/Architecture | Performance | release candidate | Sprint 11 | reports | Lighthouse/Playwright | FCP | budget cumplido |
| REQ-057 | LCP < 2.5s Fast 3G | performance-budget | Scalability | Performance | release candidate | Sprint 11 | reports | Lighthouse | LCP | budget cumplido |
| REQ-058 | Lighthouse > 90 | performance-budget | Scalability | Performance | release candidate | Sprint 11 | reports | Lighthouse | score | score cumplido |
| REQ-059 | k6 para flujos críticos | escalabilidad | Scalability/k6 | Load | release candidate | Sprint 11 | k6 scripts | `k6 run` | load | carga crítica cubierta |
| REQ-060 | Playwright 375/768/1920 | testing-quality | Playwright | Testing | release candidate | Sprint 2 | E2E tests | Playwright | viewports | UI valida viewports |
| REQ-061 | Vitest para lógica | testing-quality | Stack | Testing | primer corte | Sprint 3 | unit tests | Vitest | unit | lógica crítica probada |
| REQ-062 | SonarQube gate | dependency-security | SonarQube | Calidad | release candidate | Sprint 11 | CI workflow | Sonar gate | quality | gate verde |
| REQ-063 | SSRF guard | api-errors-security | Security | SSRF | release candidate | Sprint 11 | SSRF guard | abuse tests | security | URL interna bloqueada |
| REQ-064 | Webhook HMAC/replay | api-errors-security | Security | Webhooks | release candidate | Sprint 8 | webhook security | webhook tests | HMAC | replay bloqueado |
| REQ-065 | Rate limiting | api-errors-security | Security | Rate limit | primer corte | Sprint 3 | rate limiter | rate tests | security | límite aplica |
| REQ-066 | AI budgets y topes por petición/modelo | ai-providers | Security/Q045 | AI budgets | release candidate | Sprint 9 | AI budgets | budget tests | cost | presupuesto bloquea |
| REQ-067 | Estructura por módulos/capas | módulo | Structure | Estructura | primer corte | Sprint 1 | repo tree | tree check | structure | estructura creada |
| REQ-068 | Fase 0 decisiones canónicas | release | Dependency | Fase 0 | primer corte | Sprint 1 | artifacts | approval review | decisions | fase 0 cerrada |
| REQ-069 | Source-available comercial | comercial | Strategy/Q022 | Comercial | venta | Sprint 12 | license docs | legal review | commercial | licencia lista |
| REQ-070 | Un año updates + renovación posterior | comercial | Strategy | Updates | venta | Sprint 12 | commercial docs | docs review | support | política documentada |

## 5.4 Trazabilidad invariantes/gates -> Sprints

| ID | Regla o gate | Dominio | Fuente | Obligación | Sprint dueño | Archivos objetivo | Pruebas/comandos | Gate | Criterio bloqueante |
|---|---|---|---|---|---|---|---|---|---|
| GATE-001 | No Plan/State sin Spec aprobada | release | FromZero | primer corte | Sprint 1 | Spec/Plan/State | review | aprobación | Plan antes de aprobación |
| GATE-002 | No código de aplicación en Spec | release | usuario | primer corte | Sprint 1 | git diff | `git diff --name-only` | scope | cambios fuera de artifacts |
| GATE-003 | No secretos ni `.env` reales | seguridad | security | primer corte | Sprint 1 | `.gitignore` | secret scan | secrets | secreto versionado |
| GATE-004 | Bootstrap un solo uso | bootstrap-order | bootstrap | primer corte | Sprint 3 | bootstrap | bootstrap test | one-shot | re-ejecución muta estado |
| GATE-005 | `.env.example` sin valores reales | seguridad | bootstrap | primer corte | Sprint 1 | `.env.example` | review | secrets | valor real incluido |
| GATE-006 | RLS en tablas tenant-aware | seguridad | schema/security | primer corte | Sprint 3 | SQL policies | RLS tests | isolation | cross-tenant access |
| GATE-007 | RBAC server-side | seguridad | security | primer corte | Sprint 4 | auth/RBAC | API tests | permissions | UI como única barrera |
| GATE-008 | `tenant_id` no autoridad cliente | seguridad | PRD/security | primer corte | Sprint 4 | tenant context | BOLA tests | tenant | header/param controla tenant |
| GATE-009 | Service role solo server/jobs | seguridad | security | primer corte | Sprint 4 | Supabase clients | code review | secrets | service role cliente |
| GATE-010 | Webhooks firmados | seguridad | security | release candidate | Sprint 8 | webhooks | webhook tests | HMAC | acepta sin firma |
| GATE-011 | SSRF guard | seguridad | security | release candidate | Sprint 8 | integrations | abuse tests | SSRF | URL interna accesible |
| GATE-012 | API versionada | api-inventory | architecture | primer corte | Sprint 3 | API inventory | route tests | versioning | pública sin `/api/v1` |
| GATE-013 | Inventario API antes de endpoints | api-inventory | architecture | primer corte | Sprint 1 | `docs/API_ENDPOINT_INVENTORY.md` | review | inventory | endpoint sin contrato |
| GATE-014 | API p95 < 200ms | performance-budget | scalability | release candidate | Sprint 11 | k6 reports | k6/APM | p95 | p95 incumplido |
| GATE-026 | FCP < 1.5s Fast 3G | performance-budget | PRD/architecture | release candidate | Sprint 11 | Lighthouse report | Lighthouse/Playwright | FCP | FCP incumplido |
| GATE-015 | LCP < 2.5s Fast 3G | performance-budget | scalability | release candidate | Sprint 11 | Lighthouse report | Lighthouse | LCP | LCP incumplido |
| GATE-016 | Lighthouse > 90 | performance-budget | scalability | release candidate | Sprint 11 | Lighthouse report | Lighthouse | score | score incumplido |
| GATE-017 | k6 en staging | escalabilidad | k6 | release candidate | Sprint 11 | k6 scripts | `k6 run` | load | sin carga crítica |
| GATE-018 | Playwright desktop/tablet/mobile | testing-quality | Playwright | release candidate | Sprint 11 | E2E tests | Playwright | visual | UI rota |
| GATE-019 | SonarQube gate | dependency-security | SonarQube | release candidate | Sprint 11 | CI workflow | Sonar gate | quality | vulnerabilidad bloqueante |
| GATE-020 | MCP solo en acción aprobada | internal-service-boundary | questionnaire | posterior | Sprint 12 | MCP docs/config | review | approval | conexión sin acción separada |
| GATE-021 | Sanitizar marcas/deuda UI | template-brand-sanitization | UI template | primer corte | Sprint 2 | UI shell | review/visual | branding | marca visible no deseada |
| GATE-022 | Código/nombres en inglés | naming-dual-standard | instrucciones | primer corte | Sprint 1 | repo code | lint/review | naming | código en español |
| GATE-023 | Docs solicitadas en español | naming-dual-standard | instrucciones | primer corte | Sprint 1 | docs/artifacts | review | language | docs en idioma incorrecto |
| GATE-024 | Consentimientos mínimos | consent-records | schema/Q027 | release candidate | Sprint 7 | consent schema | schema/tests | consent | consent no auditable |
| GATE-025 | Fase 0 cerrada | release | dependency | primer corte | Sprint 1 | artifacts | questionnaire approved | decisions | decisiones críticas abiertas |

## 5.5 Conteo de cobertura REQ/GATE

| Tipo | Total detectado | Cubiertos | Pendientes | Diferidos con razón | Excluidos con razón |
|---|---:|---:|---:|---:|---:|
| REQ | 71 | 71 | 0 | 0 | 0 |
| GATE | 26 | 26 | 0 | 0 | 0 |

Regla de cierre:
Para presentar el plan como listo para aprobación, `Pendientes` debe ser `0` en REQ y GATE. Este plan cumple esa condición.

### Revisión adversarial complementaria

| Muestra determinística | Fuente | Item revisado | Resultado | Gap detectado | Acción |
|---|---|---|---|---|---|
| 1 | Matriz REQ | REQ-001 | cubierto | ninguno | Sprint 1 asignado |
| 2 | Matriz REQ | REQ-035 | cubierto | ninguno | Sprint 8 asignado |
| 3 | Matriz REQ | REQ-071 | cubierto | ninguno | Sprint 11 asignado |
| 4 | Matriz GATE | GATE-001 | cubierto | ninguno | Sprint 1 asignado |
| 5 | Matriz GATE | GATE-013 | cubierto | ninguno | Sprint 1 asignado |
| 6 | Matriz GATE | GATE-026 | cubierto | ninguno | Sprint 11 asignado |

## 5.6 Contraste de decisiones Questionnaire -> Spec -> Plan

| Decisión | Questionnaire | Spec | Plan | Estado | Acción requerida |
|---|---|---|---|---|---|
| Ruta del proyecto | Framework base | Framework base | Sprints construyen framework, no app vertical | consistente | ninguna |
| Estructura | `.codex/`, `artifacts/` solo tooling | conserva `src/app`, `src/framework`, `src/web`, `core-ai`, `supabase` | Sprint 1 crea/valida estructura objetivo | consistente | ninguna |
| Task path | Q058/D058 define módulo demo web en `src/web/modules/task` | Task es módulo ejemplo de app final | Sprint 10 usa `src/web/modules/task`; `src/app` solo enruta | consistente tras corrección | ninguna |
| Package manager | npm | npm | Sprint 1 fija lockfile npm | consistente | verificar versiones |
| Supabase | Cloud directo + SQL versionado | Supabase principal | Sprint 3 migraciones/RLS | consistente | aprobar accesos antes de cloud |
| Multi-tenant users | default OFF | default OFF | Sprint 3/4 valida membresía | consistente | ninguna |
| Trial vencido | `degrade_to_free` | `degrade_to_free` | Sprint 6 billing | consistente | ninguna |
| Import/export | Import CSV/XLSX; export CSV/XLSX; PDF individual | igual | Sprint 8 y Sprint 6 PDF individual | consistente | ninguna |
| OpenRouter | ID verificado | `google/gemma-4-26b-a4b-it:free` | Sprint 9 revalida antes de Build | consistente | revalidar proveedor |
| Jobs programados | D9: pg_cron por tiempo e Inngest por usuario | modelo dual pg_cron/Inngest | Sprint 6 expiración de tokens y trial; Sprint 7 purga; Sprint 8 base jobs | consistente | ninguna |
| MCP | posterior | acción separada | Sprint 12 documenta, no activa | consistente | aprobación dedicada |
| Redis | default off | default off | Sprint 11 fallback y placeholder | consistente | activar solo si se aprueba |

## 5.7 Controles condicionales de riesgo

### 5.7.1 Revisión de especialistas

| Dominio | Condición en este proyecto | Especialista | Modo usado | Insumos revisados | Hallazgos | Decisión del agente principal | Fallback o razón |
|---|---|---|---|---|---|---|---|
| arquitectura | aplica | architect | revisión secuencial | Spec, ADRs, docs arquitectura | requiere ADRs antes de plan | ADRs creados | sin subagente real verificado |
| seguridad | aplica | auditor | revisión secuencial | Spec, threat model, security assurance | RLS/RBAC/billing/AI son críticos | gates por Sprint | ejecutar revisión seguridad antes de Build crítico |
| UI | aplica | reviewer | revisión secuencial | Spec, UI reference | deuda visual debe sanitizarse | Sprint 2 con Playwright | sin subagente real verificado |
| rendimiento | aplica | perf | revisión secuencial | Spec, SLOs | budgets bloquean RC | Sprint 11 con k6/Lighthouse | sin subagente real verificado |
| testing | aplica | tester | revisión secuencial | Spec, criteria | se requiere triad unit/integration/E2E | pruebas por Sprint | sin subagente real verificado |

Evaluación de agentes futuros:

| Dominio | Señal encontrada | Agente futuro recomendado | Decisión |
|---|---|---|---|
| database | RLS compleja, migraciones, índices, ownership, Supabase/Postgres crítico | si | no crear en esta versión; evaluar en backlog |
| integrations | webhooks, billing, proveedores, retries, idempotencia, rate limits | si | no crear en esta versión; evaluar en backlog |

### 5.7.2 Zonas de validación humana por Sprint

| Sprint | Zona | Condición de activación | Estado | Aprobación o razón | Acción antes de Build |
|---|---|---|---|---|---|
| Sprint 1 | secretos/deploy | crear placeholders y lockfiles | requiere aprobación | Plan requiere re-aprobación | re-aprobar Plan |
| Sprint 3 | permisos/RLS/RBAC | migraciones/RLS/tenant base | requiere aprobación | riesgo cross-tenant | confirmar antes de ejecutar migraciones cloud |
| Sprint 4 | auth/sesiones | login, MFA, tenant context, API keys | requiere aprobación | cambios de seguridad de acceso | confirmar antes de Build del Sprint |
| Sprint 6 | billing/pagos/webhooks | Stripe, suscripciones, statements, PDF | requiere aprobación | impacto monetario | usar mocks o aprobar integración |
| Sprint 7 | datos | storage, consent, soft delete, documentos | requiere aprobación | riesgo legal/datos | confirmar retención/purge |
| Sprint 8 | datos | import/export, rules, webhooks | requiere aprobación | automatización y datos | confirmar antes de jobs |
| Sprint 9 | secretos/deploy | OpenRouter/Core AI | requiere aprobación | costo/privacidad | revalidar ID y aprobar provider |
| Sprint 11 | secretos/deploy | staging, k6, SonarQube | requiere aprobación | servicios externos | aprobar targets y tokens |
| Sprint 12 | legal/compliance | licencia, términos, entrega | requiere aprobación | revisión legal externa | revisión legal antes de venta |

### 5.7.3 Automatización vs augmentación

| Sprint | Automatización | Juicio humano requerido | 80% correcto aceptable | Costo del fallo | Detección | Rollback | Evidencia | Estado |
|---|---|---|---|---|---|---|---|---|
| Sprint 3 | Bootstrap inicial | si | no | Alto: estado corrupto | logs/bootstrap tests | reset entorno no prod | seed report | aprobado para planificar |
| Sprint 6 | pg_cron expiración de tokens y trial | si | no | Alto: acceso o billing incorrecto | logs pg_cron/reconciliation | revocar token/ajustar suscripción | schedule report | requiere aprobación antes de Build |
| Sprint 6 | Billing cycle jobs | si | no | Alto: cobro incorrecto | reconciliation/webhooks | adjustment/refund | statements/invoices | requiere aprobación antes de Build |
| Sprint 7 | pg_cron purga de soft-deletes | si | no | Alto: borrado irreversible | purge preview/log | backup restore | purge log | requiere aprobación antes de Build |
| Sprint 8 | Import/export async | si | no | Medio/alto: datos corruptos | job logs/preview | cancelar job/purge output | history | requiere aprobación antes de Build |
| Sprint 8 | Rules/notifications | si | no | Medio: acción no deseada | event logs/retries | disable rule | execution logs | requiere aprobación antes de Build |
| Sprint 9 | AI invocation | si | no | Medio/alto: costo o fuga | usage log/budgets | disable tenant AI | AI logs | requiere aprobación antes de Build |

## 6. Sprints

### Sprint 1 - Preparación y base inicial

Estado: pendiente

Objetivo:
Cerrar base operativa: estructura objetivo, versiones verificadas, `.env.example`, inventario API inicial, lockfiles, políticas de secretos, documentación de arranque y estado FromZero actualizado.

Archivos objetivo:
`package.json`, `package-lock.json`, `.env.example`, `docs/API_ENDPOINT_INVENTORY.md`, `README.md`, `artifacts/FROMZERO_STATE.md`, `.fromzero/fromzero.lock.json` si se instalan recursos.

Pruebas/comandos:
`git status --short`, `npm --version`, `node --version`, `npm install`, `npm run typecheck` si existe, revisión de secretos.

Verificaciones:
No `.env` reales, no secretos, estructura alineada a `REFERENCE_STRUCTURE`, Plan aprobado antes de Build.

Criterios de aceptación:
Repositorio listo para implementar sin tocar servicios externos, con estructura y placeholders validados.

Dependencias:
Spec y Plan re-aprobados por el usuario.

### Sprint 2 - Stack web y UI shell

Estado: pendiente

Objetivo:
Crear base Next.js App Router, TypeScript strict, Tailwind v4, UI FromZero, i18n es/en, shell operacional, navegación, layout y pruebas visuales iniciales.

Archivos objetivo:
`src/app/`, `src/web/`, `src/framework/ui/`, `src/framework/theme/`, `messages/`, `tests/e2e/`.

Pruebas/comandos:
`npm run lint`, `npm run typecheck`, `npm run build`, `npx playwright test`.

Verificaciones:
Viewports 375/768/1920, sin marcas/deuda UI heredada, tokens centralizados, controles accesibles.

Criterios de aceptación:
Shell UI usable y responsive, sin solapamientos ni patrones vetados.

Dependencias:
Sprint 1 completado.

### Sprint 3 - Datos, bootstrap y módulos fundacionales

Estado: pendiente

Objetivo:
Crear schema base, migraciones SQL versionadas, RLS, Tenant Zero, Super Admin, settings, modules, plans, log, tenant, rate limit base, API inventory y validación Zod.

Archivos objetivo:
`supabase/migrations/`, `bootstrap.json`, `src/framework/db/`, `src/framework/modules/settings/`, `src/framework/modules/module/`, `src/framework/modules/plan/`, `src/framework/modules/log/`, `src/framework/modules/tenant/`.

Pruebas/comandos:
Supabase migration test, RLS tests, Vitest, contract tests.

Verificaciones:
RLS tenant-aware, bootstrap un solo uso, `app.mode = SaaS`, plans base, logs append-only.

Criterios de aceptación:
Datos fundacionales y bootstrap funcionan con aislamiento tenant verificable.

Dependencias:
Sprint 1 completado. Aprobación humana antes de migraciones cloud.

### Sprint 4 - Auth, tenant context, RBAC y API keys

Estado: pendiente

Objetivo:
Implementar auth email/password, MFA configurable, tenant context seguro, usuarios, membresías, perfiles, roles, permisos, invitaciones y API keys.

Archivos objetivo:
`src/framework/auth/`, `src/framework/modules/user/`, `src/framework/modules/profile/`, `src/framework/modules/invitation/`, `src/framework/modules/api-key/`.

Pruebas/comandos:
Auth tests, permission matrix tests, BOLA/IDOR tests, API key scope tests.

Verificaciones:
Cliente no impone tenant, service role no llega a cliente, API keys con hash/scopes.

Criterios de aceptación:
Autorización efectiva server-side y aislamiento por tenant/usuario.

Dependencias:
Sprint 3 completado. Aprobación humana antes de Build del Sprint.

### Sprint 5 - Module Factory, Grid Universal y relaciones

Estado: pendiente

Objetivo:
Construir contratos del Module Factory, Grid Universal, filtros guardados, custom fields, record relationships y patrones CRUD reutilizables.

Archivos objetivo:
`src/framework/factory/`, `src/framework/grid/`, `src/framework/relationships/`, `src/framework/modules/filter/`, `src/framework/modules/custom-field/`.

Pruebas/comandos:
Factory tests, grid tests, validation tests, relation tests, Playwright para tablas.

Verificaciones:
No queries sin límite, ownership validado, módulos respetan allowlist.

Criterios de aceptación:
Módulos futuros pueden usar factory/grid sin duplicar lógica crítica.

Dependencias:
Sprints 3 y 4 completados.

### Sprint 6 - Billing, suscripciones, statements y PDF individual

Estado: pendiente

Objetivo:
Implementar billing core: plans, subscriptions, statements, invoices, Stripe adapter mockeable, webhooks de billing, `degrade_to_free`, pg_cron para expiración de tokens, recordatorios/expiración de trial y PDF individual.

Archivos objetivo:
`src/framework/modules/subscription/`, `src/framework/modules/statement/`, `src/framework/modules/invoice/`, `src/framework/billing/`, `src/framework/integrations/stripe/`, `supabase/migrations/`.

Pruebas/comandos:
Billing unit tests, webhook tests, reconciliation tests, PDF tests.

Verificaciones:
No cobros reales sin aprobación, webhooks firmados, Trial vencido degrada a Free, schedules de expiración de tokens y trial definidos en pg_cron.

Criterios de aceptación:
Estados de billing correctos y auditables con provider aislado por adapter.

Dependencias:
Sprints 3 y 4 completados. Aprobación humana para cualquier integración real.

### Sprint 7 - Storage, documentos y módulos shared

Estado: pendiente

Objetivo:
Implementar File, Document, Tag, Bookmark, consent records, versionado acotado, signed URLs, soft delete, pg_cron para purga de soft-deletes y storage browser base.

Archivos objetivo:
`src/framework/modules/file/`, `src/framework/modules/document/`, `src/framework/modules/tag/`, `src/framework/modules/bookmark/`, `src/framework/modules/consent/`, `supabase/migrations/`.

Pruebas/comandos:
Storage tests, signed URL tests, CRUD tests, consent tests, migration tests.

Verificaciones:
MIME/size, ownership, consent auditable, versionado solo documents/files, purga pg_cron controlada.

Criterios de aceptación:
Gestión de archivos y shared modules segura, reusable y tenant-aware.

Dependencias:
Sprints 3, 4 y 5 completados.

### Sprint 8 - Eventos, notificaciones, webhooks, import/export

Estado: completado localmente

Objetivo:
Implementar configuración base de jobs, pg_cron para schedules por tiempo, Inngest adapter para workflows disparados por usuario, rules, notifications, email templates, integration/webhook modules, SSRF guard, import CSV/XLSX y export CSV/XLSX.

Archivos objetivo:
`src/framework/jobs/`, `src/framework/events/`, `src/framework/modules/notification/`, `src/framework/modules/rule/`, `src/framework/modules/email-template/`, `src/framework/modules/webhook/`, `src/framework/modules/import/`, `src/framework/modules/export/`, `src/framework/integrations/`, `supabase/migrations/`.

Pruebas/comandos:
Inngest tests, webhook HMAC/replay tests, SSRF abuse tests, import/export tests.

Verificaciones:
Jobs idempotentes, retries, audit logs, signed URLs, no JSON import, pg_cron separado de Inngest.

Criterios de aceptación:
Automatizaciones e intercambio de datos funcionan con evidencia y rollback.

Dependencias:
Sprints 3, 4, 5 y 7 completados. Aprobación humana para automatizaciones.

### Sprint 9 - Core AI y OpenRouter

Estado: pendiente

Objetivo:
Implementar Core AI interno con FastAPI/Pydantic v2, provider adapter, OpenRouter, model catalog, opt-in, redaction, budgets y logs de uso.

Archivos objetivo:
`core-ai/`, `src/framework/ai/`, `src/framework/modules/ai-model/`, `.env.example`.

Pruebas/comandos:
Python tests, Pydantic validation, adapter tests, budget tests, redaction tests.

Verificaciones:
Revalidar `google/gemma-4-26b-a4b-it:free` antes de implementar, sin API key real en repo.

Criterios de aceptación:
IA interna, configurable, con privacidad y control de costo.

Dependencias:
Sprints 3, 4 y 8 completados. Aprobación humana para provider real.

### Sprint 10 - Módulo Task, superficies públicas y documentación demo

Estado: pendiente

Objetivo:
Crear Task como módulo ejemplo de app final, páginas públicas mínimas reemplazables, help center base, command palette y documentación demo.

Archivos objetivo:
`src/web/modules/task/`, `src/app/(public)/`, `docs/demo/`, `src/framework/help/`, `src/framework/commands/`.

Pruebas/comandos:
Reference module tests, Playwright E2E, docs review.

Verificaciones:
Task no contamina framework shared, público mínimo es reemplazable.

Criterios de aceptación:
Existe módulo de referencia completo para apps derivadas.

Dependencias:
Sprints 2, 3, 4 y 5 completados.

### Sprint 11 - Calidad, seguridad, performance y release hardening

Estado: pendiente

Objetivo:
Cerrar gates de release candidate: SonarQube, secrets scan, dependency advisories, Playwright completo, k6 staging, Lighthouse, abuse tests, performance budgets FCP/LCP/API p95 y revisión de seguridad.

Archivos objetivo:
`.github/workflows/`, `tests/e2e/`, `tests/k6/`, reports, CI config.

Pruebas/comandos:
`npm run lint`, `npm run typecheck`, `npm test`, `npx playwright test`, `k6 run`, SonarQube gate.

Verificaciones:
API p95 < 200 ms, FCP < 1.5 s Fast 3G, LCP < 2.5 s Fast 3G, Lighthouse > 90, no SSRF, no BOLA, no secretos.

Criterios de aceptación:
Release candidate técnico con gates verdes o excepciones documentadas.

Dependencias:
Sprints 1 a 10 completados. Aprobación para staging/servicios externos.

### Sprint 12 - Empaquetado, operación y comercialización

Estado: pendiente

Objetivo:
Preparar Docker/Coolify, docs operativas, observabilidad opt-in, MCP diferido documentado, licencia source-available placeholder, entrega repo/ZIP y política de updates.

Archivos objetivo:
`Dockerfile`, `docker-compose.yml`, `docs/deployment/`, `docs/operations/`, `LICENSE`, `CHANGELOG.md`, release artifacts.

Pruebas/comandos:
Docker build, deployment dry-run, docs review, license review checklist.

Verificaciones:
MCP no activado sin aprobación, observabilidad default off, legal pendiente marcado si no hay revisión externa.

Criterios de aceptación:
Base empaquetada para entrega privada y preparación comercial.

Dependencias:
Sprints 1 a 11 completados. Revisión legal antes de venta.

## 7. Decisiones técnicas transversales

### Cobertura transversal crítica

- Búsqueda/command palette: Sprint 10.
- Redirecciones post-login y dashboard: Sprints 2 y 4.
- Soft delete/papelera: Sprints 3 y 7.
- File browser: Sprint 7.
- Notificaciones y preferencias: Sprint 8.
- Help center/soporte: Sprint 10.
- Páginas públicas: Sprint 10.
- Contratos mobile/API: Sprint 3.
- Keyboard shortcuts: Sprint 10.
- Consentimiento: Sprint 7.
- Páginas de infraestructura: Sprint 12.
- Modo mantenimiento: Sprint 12.
- Setup wizard: Sprint 3.
- Jobs programados: Sprint 8 configuración base pg_cron; Sprint 6 expiración de tokens y recordatorios/expiración de trial; Sprint 7 purga de soft-deletes.
- Configuración de módulos: Sprint 3.
- Tablas, pivotes e historiales: Sprints 3, 5, 6, 7.
- Seguridad y escalabilidad por módulo: Sprints 3 a 11.
- Auth, onboarding y sesiones: Sprint 4.
- Storage, File Management y FileUploader: Sprint 7.
- Billing, subscriptions y feature gating: Sprints 3 y 6.
- UI primitives, overlays e infraestructura visual: Sprint 2.
- Theme Engine y branding runtime: Sprint 2.
- Grid Universal y Module Factory: Sprint 5.
- Custom Fields: Sprint 5.
- Event Bus y Rules: Sprint 8.
- Notifications: Sprint 8.
- Import/Export: Sprint 8.
- API, errores y seguridad perimetral: Sprints 3, 4, 8, 11.
- Bootstrap/schema/Tenant Zero: Sprint 3.
- Datos reales estrictos: todos los Sprints; no dummy visible.
- Nomenclatura obligatoria y Dual Standard: todos los Sprints.
- Core AI o servicios internos: Sprint 9.
- Dependencias vulnerables: Sprint 11.
- Inventario API: Sprint 1 y Sprint 3.
- Performance budgets exactos: Sprint 11.
- Prohibición de marca de plantillas: Sprint 2.
- Consent Records: Sprint 7.

### Cache

Redis queda default off. Sprint 11 valida fallback para rate limiting/cache simple. Activación Redis requiere env vars, adapter, pruebas y aprobación por entorno.

### Jobs

Modelo dual: pg_cron para jobs programados por tiempo, incluyendo purga de soft-deletes, expiración de tokens, recordatorios y expiración de trial; Inngest para workflows disparados por usuario, import/export grande, retries y procesos que no deben bloquear requests HTTP. Todo job debe ser idempotente, auditable, con retry controlado y rollback o compensación.

### Queries

Toda lista debe paginar, limitar y filtrar por tenant/ownership. Queries críticas requieren índices y presupuesto de performance.

### Seguridad

RLS, RBAC, BOLA/IDOR, SSRF, HMAC, rate limit, API key scopes, service role server-only y secrets scan son bloqueantes.

### UI

UI operacional densa, responsive, sin cards anidadas innecesarias, sin deuda de template visible, con Playwright en 375/768/1920.

### i18n/timezone

`es` source of truth, `en` incluido, timestamps UTC, overrides por tenant/usuario.

### Observabilidad

Framework provee adapters/placeholders; activación concreta queda por app derivada.

### k6/performance

k6 solo contra staging dedicado. Producción requiere aprobación explícita. Budgets de release: API p95 < 200 ms, FCP < 1.5 s Fast 3G, LCP < 2.5 s Fast 3G y Lighthouse > 90.

## 8. Cierre por Sprint

Cada Sprint debe cerrar con:

- diff revisado;
- pruebas ejecutadas;
- limitaciones documentadas;
- verificaciones pendientes listadas;
- commit automático creado cuando sea seguro, reportado con hash corto y mensaje completo, o razón concreta si no pudo crearse;
- enlaces a artefactos o evidencia;
- actualización de `artifacts/FROMZERO_STATE.md`;
- siguiente Sprint recomendado y acción humana exacta.

## 9. Validación de cierre

- Criterios de la spec con Sprint dueño: completo.
- Capacidades documentadas con Sprint dueño, archivos, pruebas y verificaciones: completo.
- Requisitos atomicos con Sprint dueño, archivos, pruebas, verificaciones y criterio: completo.
- Headings funcionales obligatorios del PRD con Sprint dueño: completo.
- Módulos documentados con Sprint dueño: completo.
- Tablas documentadas con Sprint dueño: completo.
- Funciones transversales documentadas con Sprint dueño: completo.
- Invariantes/gates documentados con Sprint dueño, archivos, pruebas y criterio bloqueante: completo.
- Bootstrap order validado: completo, Sprint 3.
- Datos reales estrictos validados: completo, todos los Sprints lo heredan.
- Naming/Dual Standard validado: completo, GATE-022/GATE-023.
- Servicios internos no expuestos validados: completo, Core AI Sprint 9.
- Dependencias/advisories/lockfiles validados: completo en plan, ejecución Sprint 1 y Sprint 11.
- Inventario API validado: completo en plan, ejecución Sprint 1 y Sprint 3.
- Performance budgets exactos validados: completo en plan, ejecución Sprint 11.
- Marcas de templates ausentes en superficies visibles: completo en plan, ejecución Sprint 2.
- Consent records auditables validados: completo en plan, ejecución Sprint 7.
- Fuentes prioritarias contrastadas contra plan: completo.
- Diferidos justificados por fuente documental: completo.
- Archivos objetivo validados contra estructura de referencia: si, en nivel plan.
- Contradicciones plan vs spec: ninguna detectada.
- Contradicciones plan vs questionnaire: se detectó Task path inconsistente con Q058/D058 y `docs/REFERENCE_STRUCTURE.md`; corregido a `src/web/modules/task/`, resultado consistente tras la corrección.
- Revisión de especialistas o fallback para dominios relevantes: completo.
- Zonas de validación humana por Sprint: completo.
- Automatización vs augmentación evaluada: completo.
- `.env` reales leídos: no.
- Secretos incluidos: no.
- Código de aplicación modificado durante planificación: no.

## 10. Siguiente aprobación

Frase recomendada:

```text
Apruebo el plan.
```

Variantes válidas si expresan aprobación explícita del plan vigente:

```text
Apruebo el plan actualizado.
Apruebo el plan actualizado para iniciar la ejecucion del proyecto
Apruebo iniciar la ejecución del proyecto
```

Regla: registrar la frase literal del usuario y normalizar internamente el estado como aprobación del plan vigente. Si la respuesta es ambigua, condicional o parcial, pedir confirmación antes de cambiar estado o iniciar Build.

`Continua con la ejecucion del proyecto` solo reanuda un plan ya aprobado. Si el plan está en revisión, Build debe pedir aprobación explícita, por ejemplo `Apruebo el plan`.
