# FROMZERO_SPEC

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_SPEC |
| Propósito o subtítulo | Especificación verificable del proyecto |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: creada desde `FROMZERO_CONTEXT.md` y cuestionario aprobado; 2026-06-18: aprobada explícitamente por el usuario para planificar |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-18 |
| Frase literal de aprobación | Apruebo la especificación. |
| Artefactos prerequisito | `artifacts/FROMZERO_CONTEXT.md`, `artifacts/FROMZERO_QUESTIONNAIRE.md` aprobado |
| Documentos o fuentes asociadas | `docs/`, `artifacts/FROMZERO_CONTEXT.md`, `artifacts/FROMZERO_QUESTIONNAIRE.md`, recursos locales FromZero, OpenRouter |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md`, `artifacts/adr/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se ejecutó código de aplicación. No se activaron servicios externos. |

## Resumen para el dueño

- Qué se va a construir: un framework web reutilizable para crear aplicaciones SaaS/corporate multi-tenant con módulos empresariales, seguridad, UI, billing, Core AI, bootstrap y operación definidos.
- Para quién: desarrolladores, equipos de producto, agencias y emprendedores técnicos que necesitan una base con código propio, extensible y vendible.
- Resultado esperado: una base From Zero v7.4 white-label, con UI operacional densa, módulos core, datos aislados por tenant, permisos server-side, APIs versionadas, pruebas y gates de release.
- Qué queda fuera: código de aplicación final específico, app Expo incluida, observabilidad activa por defecto, Plan/Build, activación MCP en este turno y cualquier conexión a servicios externos.
- Decisiones importantes ya tomadas: SaaS, `per_tenant`, Supabase cloud con SQL versionado, UI FromZero, npm, Docker/Coolify, Stripe/Resend/OpenRouter por adapters, Inngest por adapter, Redis default off.
- Riesgos o límites que debe conocer el dueño: OpenRouter/Gemma usa ID explícito verificado, MCP se activará en acción separada y `allow_multi_tenant_users` queda con default documental corregido.
- Qué se pide aprobar: esta especificación como base para crear el plan FromZero; aprobarla no ejecuta código.
- Visión validada usada como fuente: `artifacts/FROMZERO_QUESTIONNAIRE.md` -> `## Resumen validado para Spec`.

## Fuentes

- Documentación: `docs/PRD.md`, `docs/REFERENCE_MODULES.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_STRUCTURE.md`, `docs/REFERENCE_STACK.md`, `docs/SECURITY_ASSURANCE.md`, `docs/SCALABILITY_ASSURANCE.md`, `docs/DEPENDENCY_MATRIX.md`, `docs/BOOTSTRAP_REFERENCE.md`, `docs/REFERENCE_DESIGN_SYSTEM.md`, `docs/REFERENCE_THREAT_MODEL.md`, `docs/STRATEGY.md`, `docs/README.md`, `docs/DOCUMENT_INVENTORY.md`.
- Contexto: `artifacts/FROMZERO_CONTEXT.md`.
- Cuestionario: `artifacts/FROMZERO_QUESTIONNAIRE.md`.
- Referencia UI: `.codex/plugins/fromzero/library/ui-template-reference/` y recurso `fromzero-ui-template`.
- Recursos de librería: `supabase`, `redis`, `sonarqube`, `stripe`, `inngest`, `playwright`, `k6`, `frontend-web`, `backend-api`, `databases`, `auth-providers`, `payments`, `deployment-cloud`, `ai-providers`, `testing-quality`, `mcp-supabase`, `mcp-sonarqube`.
- Fuente externa verificada: OpenRouter, modelo `google/gemma-4-26b-a4b-it:free` en `https://openrouter.ai/google/gemma-4-26b-a4b-it%3Afree`; modelos Google en `https://openrouter.ai/google`; pricing y pinning en `https://openrouter.ai/pricing`.

## Decisiones del cuestionario

| Decisión | Fuente en cuestionario | Fuente documental | Resultado en spec | Contradicción o reducción | Excepción aprobada |
|---|---|---|---|---|---|
| Ruta del proyecto | D001/Q001 | `docs/PRD.md` | Framework base From Zero | no | no aplica |
| Versión canónica | D002/Q002 | contexto, ruta repo | v7.4 | resuelta en `docs/` | Q002 |
| Alcance completo por fases | D003/Q003 | `docs/PRD.md`, `docs/DEPENDENCY_MATRIX.md` | Todo el alcance documentado queda vigente | no | no aplica |
| Record relationship | D004/Q004 | `docs/REFERENCE_MODULES.md` | Subsistema transversal | no | no aplica |
| UI | D005/Q005 | UI FromZero, `docs/REFERENCE_DESIGN_SYSTEM.md` | UI FromZero base | no | no aplica |
| Estructura producto/tooling | D006/Q006/C002 | `docs/REFERENCE_STRUCTURE.md` | Árbol solo del framework entregable; tooling IA y `artifacts/` fuera del producto | resuelta en `docs/` | Q006 |
| Modo inicial | D007/Q007 | `docs/BOOTSTRAP_REFERENCE.md` | SaaS | no | no aplica |
| Licenciamiento funcional | D008/Q008 | `docs/REFERENCE_MODULES.md` | `per_tenant` | no | no aplica |
| Multi-tenant users | D009/Q009/C003 | `docs/BOOTSTRAP_REFERENCE.md`, `docs/PRD.md` | Default OFF | sí, invierte bootstrap:61 | sí, Q009 |
| Supabase dev | D010/Q010 | `docs/REFERENCE_STACK.md` | Cloud directo | no | no aplica |
| Tenant activo | D011/Q011/C004 | `docs/PRD.md`, `docs/SECURITY_ASSURANCE.md` | UI elige, backend valida | no | no aplica |
| Auth default | D012/Q012 | `docs/BOOTSTRAP_REFERENCE.md` | Email/password, MFA configurable | no | no aplica |
| Pagos | D013/Q013 | `docs/PRD.md`, recurso `stripe` | Multi-provider, Stripe default | no | no aplica |
| Email | D014/Q014 | `docs/PRD.md` | Multi-provider, Resend default | no | no aplica |
| Core AI | D015/Q015 | arquitectura, OpenRouter | Multi-provider, OpenRouter `google/gemma-4-26b-a4b-it:free` | no | no aplica |
| Redis/colas | D016/Q016 | escalabilidad, recurso `redis` | Opcional default off | no | no aplica |
| Event bus | D017/Q017 | recurso `inngest` | Inngest adapter default | no | no aplica |
| Deploy | D018/Q018/Q053 | `docs/PRD.md` | Coolify sobre Docker VPS, genérico Docker | no | no aplica |
| Observabilidad | D019/Q019 | `docs/PRD.md` | Opciones para apps derivadas, no activas | no | no aplica |
| Quality gate | D020/Q020 | recurso `sonarqube` | SonarQube self-hosted | no | no aplica |
| CI | D021/Q021 | stack | GitHub Actions | no | no aplica |
| Licencia comercial | D022/Q022 | `docs/STRATEGY.md` | Comercial propia source-available | no | no aplica |
| Entrega | D023/Q023 | `docs/STRATEGY.md` | Repo privado + ZIP | no | no aplica |
| Tiers | D024/Q024 | estrategia | Básicos framework, finales por app | no | no aplica |
| Retención | D025/Q025 | seguridad | Configurable segura | no | no aplica |
| Eliminación | D026/Q026 | PRD/schema | Soft delete + purge | no | no aplica |
| Consentimientos | D027/Q027 | schema | Términos, privacidad, marketing | no | no aplica |
| Primer corte | D028/Q028 | dependency matrix | Base técnica fundacional | no | no aplica |
| Idiomas | D029/Q029/Q070 | PRD | Español e inglés, default `es` | no | no aplica |
| Seeds | D030/Q030 | bootstrap | Bootstrap + demo separado | no | no aplica |
| Branding | D031/Q031 | design system | White-label + FromZero docs/demo | no | no aplica |
| Mobile | D032/Q032 | structure, expo resource | API-ready, sin app Expo | no | no aplica |
| Estilo UI | D033/Q033 | PRD/UI | Operacional densa | no | no aplica |
| API | D034/Q034 | architecture | API versionada para todos los módulos | no | no aplica |
| API key scopes | D035/Q035 | modules/security | Tenant, módulo, acción | no | no aplica |
| Import/export | D036/Q036/Q067/C007/C012 | PRD/modules | Import CSV/XLSX; export CSV/XLSX; PDF por registro individual desde UI | resuelta en `docs/` | Q036/Q067 |
| RBAC | D037/Q037 | modules | Roles base + perfiles | no | no aplica |
| Super Admin | D038/Q038 | bootstrap | Global + Tenant Zero | no | no aplica |
| Auditoría | D039/Q039 | security/modules | Seguridad y cambios críticos | no | no aplica |
| Planes base | D040/Q040/Q064 | modules | Free, Trial, Pro, Enterprise sin precios | no | no aplica |
| Feature control | D041/Q041 | PRD | Global, plan, tenant | no | no aplica |
| Custom fields | D042/Q042 | modules | Solo módulos permitidos | no | no aplica |
| IA privacidad | D043/Q044 | security | Opt-in y redacción | no | no aplica |
| IA budgets | D044/Q045 | security | Tenant, usuario, feature | no | no aplica |
| Cobertura | D045/Q046 | stack | 80% crítico | no | no aplica |
| Performance | D046/Q047 | scalability | Bloqueante en release candidate | no | no aplica |
| Carga | D047/Q048 | k6/scalability | Staging dedicado | no | no aplica |
| Versiones | D048/Q049 | stack | Estables fijadas tras verificación | no | no aplica |
| Package manager | D049/Q050 | structure | npm | no | no aplica |
| Estructura código | D050/Q051 | `docs/REFERENCE_STRUCTURE.md` | `src/app`, `src/framework`, `src/web`, `core-ai`, `supabase` | no | no aplica |
| Migraciones | D051/Q052 | structure | SQL versionado aplicado a cloud | no | no aplica |
| MCP | D052/Q054/Q062 | mcp resources | Preparar/activar después, no en esta fase | diferido | sí, Q062 |
| Notificaciones | D053/Q055 | PRD/modules | In-app default, otros por tenant | no | no aplica |
| Webhooks | D054/Q056 | modules/security | Entrantes y salientes | no | no aplica |
| Reglas | D055/Q057 | modules | Datos, tiempo, webhooks | no | no aplica |
| Task | D056/Q058 | structure | Módulo ejemplo app final | no | no aplica |
| Shared modules | D057/Q059 | modules | File, Tag, Bookmark, Filter en framework shared | no | no aplica |
| Público | D058/Q060 | structure | Base mínima reemplazable | no | no aplica |
| Conflictos | D059/Q061 | questionnaire | Resolver caso por caso mostrando ambas versiones | no | no aplica |
| Modelo OpenRouter | D060/Q063/C011 | OpenRouter | `google/gemma-4-26b-a4b-it:free` verificado | no | no aplica |
| Plan default | D061-D063/Q065-Q066 | PRD/modules | Trial, vencido degrada a Free si existe Free | no | no aplica |
| Anti-abuso | D064/Q068/C008 | architecture | reCAPTCHA adapter | no | no aplica |
| Imágenes | D065/Q069 | PRD | WebP activable default off | no | no aplica |
| Timezone | D067/Q071 | PRD | UTC base | no | no aplica |
| Moneda | D068/Q072 | strategy | USD | no | no aplica |
| MFA | D069/Q073/Q076/C009 | bootstrap | Configurable para todos | no | no aplica |
| API key expiración | D070/Q074/Q077/C010 | security/modules | Opcional compatible, recomendar expiración | no | no aplica |
| Secretos | D071/Q075 | seguridad | Panel/env store; repo solo `.env.example` | no | no aplica |

## Registro de cambios

| Fecha | Cambio | Fuente o razón | Artefacto relacionado |
|---|---|---|---|
| 2026-06-18 | Creación de Spec desde contexto y cuestionario aprobado | Aprobación literal: "Apruebo el cuestionario." | `FROMZERO_QUESTIONNAIRE.md` |
| 2026-06-18 | Se fijó `google/gemma-4-26b-a4b-it:free` como ID OpenRouter inicial verificado | OpenRouter oficial | C011, Q063 |
| 2026-06-18 | Se alinearon conflictos documentales C001, C002, C003, C007, C010 y C012 antes de aprobar SPEC | Documentación corregida | `docs/`, `FROMZERO_QUESTIONNAIRE.md` |
| 2026-06-18 | Aprobación explícita de la Spec y habilitación de diseño técnico, Plan y State | Aprobación literal: "Apruebo la especificación." | `FROMZERO_PLAN.md`, `FROMZERO_STATE.md`, `artifacts/adr/` |

## Matriz de cobertura del insumo

| Requisito o capacidad | Tipo | Fuente | Prioridad | Estado | Donde se cubre | Obligación |
|---|---|---|---:|---|---|---|
| `docs/PRD.md` | fuente | docs | 1 | cubierto | toda la spec | venta |
| `docs/REFERENCE_MODULES.md` | fuente | docs | 2 | cubierto | módulos, requisitos, conflictos | venta |
| `docs/REFERENCE_DATABASE_SCHEMA.md` | fuente | docs | 3 | cubierto | datos, ownership, gates | primer corte |
| `docs/REFERENCE_ARCHITECTURE.md` | fuente | docs | 4 | cubierto | arquitectura, API, seguridad | primer corte |
| `docs/REFERENCE_STRUCTURE.md` | fuente | docs | 5 | cubierto | estructura, UI, entornos | primer corte |
| `docs/REFERENCE_STACK.md` | fuente | docs | 6 | cubierto | stack, pruebas, variables | primer corte |
| `docs/SECURITY_ASSURANCE.md` | fuente | docs | 7 | cubierto | seguridad, gates, zonas humanas | release candidate |
| `docs/SCALABILITY_ASSURANCE.md` | fuente | docs | 8 | cubierto | escalabilidad, KPIs | release candidate |
| `docs/DEPENDENCY_MATRIX.md` | fuente | docs | 9 | cubierto | base para planificación | primer corte |
| `docs/BOOTSTRAP_REFERENCE.md` | fuente | docs | 10 | cubierto | bootstrap, settings, auth | primer corte |
| `docs/REFERENCE_DESIGN_SYSTEM.md` | fuente | docs | 13 | cubierto | UI y experiencia | release candidate |
| `docs/REFERENCE_THREAT_MODEL.md` | fuente | docs | 14 | cubierto | seguridad, riesgos | release candidate |
| `docs/STRATEGY.md` | fuente | docs | 15 | cubierto | comercialización | venta |
| Settings | módulo | Context | 1 | cubierto | módulos | primer corte |
| Module | módulo | Context | 1 | cubierto | módulos | primer corte |
| Plan | módulo | Context | 1 | cubierto | módulos/billing | primer corte |
| AI Model | módulo | Context | 1 | cubierto | módulos/Core AI | release candidate |
| Log | módulo | Context | 1 | cubierto | auditoría/logs | primer corte |
| Profile | módulo | Context | 1 | cubierto | permisos/RBAC | primer corte |
| Tenant | módulo | Context | 1 | cubierto | datos/ownership | primer corte |
| User | módulo | Context | 1 | cubierto | usuarios/roles | primer corte |
| Invitation | módulo | Context | 1 | cubierto | módulos/auth/email | release candidate |
| Notification | módulo | Context | 2 | cubierto | integraciones/notificaciones | release candidate |
| Rule | módulo | Context | 2 | cubierto | automatización/eventos | release candidate |
| Custom Field | módulo | Context | 2 | cubierto | datos/UI | release candidate |
| Email Template | módulo | Context | 2 | cubierto | integraciones/email | release candidate |
| API Key | módulo | Context | 2 | cubierto | contrato API/seguridad | release candidate |
| Integration | módulo | Context | 2 | cubierto | integraciones | release candidate |
| Webhook | módulo | Context | 2 | cubierto | integraciones | release candidate |
| Document | módulo | Context | 2 | cubierto | storage/files | release candidate |
| Import | módulo | Context | 2 | cubierto | import/export | release candidate |
| Export | módulo | Context | 2 | cubierto | import/export | release candidate |
| Subscription | módulo | Context | 2 | cubierto | billing/subscriptions | release candidate |
| Statement | módulo | Context | 2 | cubierto | billing | release candidate |
| Invoice | módulo | Context | 2 | cubierto | billing/PDF de registro | release candidate |
| File | módulo | Context | 3 | cubierto | storage/files | release candidate |
| Tag | módulo | Context | 3 | cubierto | módulos/shared | release candidate |
| Bookmark | módulo | Context | 3 | cubierto | módulos/shared | release candidate |
| Filter | módulo | Context | 3 | cubierto | Grid Universal | release candidate |
| Task | módulo | Context | 3 | cubierto | módulo ejemplo app final | release candidate |
| Record Relationship | transversal | Context | 2 | cubierto | datos/ownership | release candidate |
| Supabase PostgreSQL/Auth/Storage/RLS | datos/seguridad | resolver | 1 | cubierto | datos/seguridad | primer corte |
| Core AI Python | servicio interno | docs | 2 | cubierto | Core AI | release candidate |
| Module Factory | transversal | docs | 1 | cubierto | módulos/API/UI | primer corte |
| Grid Universal | UI/transversal | docs | 2 | cubierto | UI y experiencia | release candidate |
| Bootstrap Tenant Zero | configuración | bootstrap | 1 | cubierto | bootstrap | primer corte |
| RBAC server-side | seguridad | security | 1 | cubierto | permisos/RBAC | primer corte |
| RLS tenant-aware | seguridad | schema/security | 1 | cubierto | seguridad/gates | primer corte |
| API `/api/v1/*` | API | architecture | 1 | cubierto | contrato base API | primer corte |
| Event bus/Inngest | job | stack/resource | 2 | cubierto | automatización/jobs | release candidate |
| Redis/BullMQ | escalabilidad | stack/resource | 3 | cubierto | escalabilidad | posterior según activación |
| Playwright | testing | resource | 2 | cubierto | pruebas esperadas | release candidate |
| k6 | testing/performance | resource | 2 | cubierto | KPIs/SLOs | release candidate |
| SonarQube | calidad | resource | 2 | cubierto | gates/calidad | release candidate |
| i18n `next-intl` | i18n | stack | 2 | cubierto | timezone/i18n | release candidate |
| WCAG 2.2 AA | accesibilidad | design system | 2 | cubierto | UI/KPIs | release candidate |
| Observabilidad | observabilidad | stack/PRD | 3 | diferido con razón | integraciones | por app derivada |

## Matriz de requisitos atomicos

| ID | Requisito atomico | Dominio | Fuente | Heading/Subheading | Obligación | Estado | Donde se cubre | Diferido/excluido con fuente | Prueba o gate esperado |
|---|---|---|---|---|---|---|---|---|---|
| REQ-001 | Framework base reutilizable, no app vertical | producto | Context | Propósito | primer corte | cubierto | objetivo |  | revisión Spec |
| REQ-002 | Alcance documentado como base vendible | producto | Context/PRD | Alcance | venta | cubierto | alcance |  | cobertura de módulos |
| REQ-003 | No orientar a usuarios no-code | producto | Strategy | Anti-persona | venta | cubierto | validación crítica |  | revisión comercial |
| REQ-004 | Usar Next.js App Router | frontend-web | Stack | Frontend | primer corte | cubierto | estructura |  | build |
| REQ-005 | TypeScript strict | frontend-web | Stack | Frontend | primer corte | cubierto | stack/calidad |  | typecheck |
| REQ-006 | Tailwind CSS v4 según docs | theme-branding | Stack | Styling | primer corte | cubierto | UI |  | build visual |
| REQ-007 | shadcn/UI o primitivas compatibles | ui-primitives-overlays | Stack/UI | UI | primer corte | cubierto | UI |  | Playwright |
| REQ-008 | Tokens visuales centralizados | theme-branding | Design | Diseño | primer corte | cubierto | UI |  | revisión CSS |
| REQ-009 | Componentes base FromZero si se adopta UI local | ui-primitives-overlays | UI template | UI | primer corte | cubierto | UI |  | revisión componentes |
| REQ-010 | Evitar deuda migrada `window.*`, `location.hash`, globals | ui-primitives-overlays | UI template | UI | primer corte | cubierto | gates |  | lint/revisión |
| REQ-011 | Supabase PostgreSQL base principal | databases | Stack | Backend | primer corte | cubierto | datos |  | migraciones SQL |
| REQ-012 | RLS en toda tabla tenant-aware | seguridad | Schema/Security | RLS | primer corte | cubierto | seguridad |  | tests RLS |
| REQ-013 | `tenant_id` desde contexto seguro | auth-session | Security | Tenant | primer corte | cubierto | seguridad/API |  | tests BOLA/IDOR |
| REQ-014 | RBAC server-side | auth-session | Security | Auth | primer corte | cubierto | permisos/RBAC |  | tests API |
| REQ-015 | No versionar secretos ni leer `.env` reales | seguridad | Security | Secrets | primer corte | cubierto | variables |  | revisión git |
| REQ-016 | `bootstrap.json` un solo uso | bootstrap-order | Bootstrap | Bootstrap | primer corte | cubierto | bootstrap |  | test bootstrap |
| REQ-017 | Crear Tenant Zero | configuración | Bootstrap | Bootstrap | primer corte | cubierto | bootstrap |  | seed check |
| REQ-018 | Crear Super Admin inicial | configuración | Bootstrap | Bootstrap | primer corte | cubierto | usuarios |  | seed check |
| REQ-019 | `app.mode` = SaaS | configuración | Questionnaire | Bootstrap | primer corte | cubierto | bootstrap |  | config check |
| REQ-020 | `licensing_model` = `per_tenant` | configuración | Questionnaire | Bootstrap | venta | cubierto | billing |  | subscription tests |
| REQ-021 | Settings global/tenant | módulo | Modules | Settings | primer corte | cubierto | módulos |  | CRUD/RBAC |
| REQ-022 | Registrar módulos y disponibilidad | módulo | Modules | Module | primer corte | cubierto | módulos |  | module registry |
| REQ-023 | Planes, límites y features | billing-subscriptions | Modules | Plan | primer corte | cubierto | billing |  | feature gating |
| REQ-024 | Catálogo de modelos IA | módulo | Modules | AI Model | release candidate | cubierto | Core AI |  | adapter tests |
| REQ-025 | Logs/auditoría | seguridad | Modules | Log | primer corte | cubierto | auditoría |  | audit tests |
| REQ-026 | Perfiles/roles/permisos | auth-session | Modules | Profile | primer corte | cubierto | RBAC |  | permission matrix |
| REQ-027 | Tenants con aislamiento | módulo | Modules | Tenant | primer corte | cubierto | datos |  | RLS tests |
| REQ-028 | Usuarios y membresías | auth-session | Modules | User | primer corte | cubierto | usuarios |  | auth tests |
| REQ-029 | Invitaciones seguras | auth-session | Modules | Invitation | release candidate | cubierto | módulos/email |  | invitation tests |
| REQ-030 | Notificaciones por eventos | notifications | Modules | Notification | release candidate | cubierto | notificaciones |  | event tests |
| REQ-031 | Reglas por datos, tiempo, webhooks | event-bus-rules | Modules/Q057 | Rule | release candidate | cubierto | automatización |  | Inngest tests |
| REQ-032 | Campos personalizados por módulo permitido | custom-fields | Modules/Q042 | Custom Field | release candidate | cubierto | datos/UI |  | validation tests |
| REQ-033 | Plantillas email | notifications | Modules/Q014 | Email Template | release candidate | cubierto | email |  | email adapter tests |
| REQ-034 | API keys con hash, scopes, expiración opcional | api-errors-security | Modules/Q074 | API Key | release candidate | cubierto | API/security |  | scope tests |
| REQ-035 | Integraciones externas | api-errors-security | Modules | Integration | release candidate | cubierto | integraciones |  | SSRF tests |
| REQ-036 | Webhooks firmados y anti-replay | api-errors-security | Modules | Webhook | release candidate | cubierto | webhooks |  | webhook tests |
| REQ-037 | Documentos versionados | storage-files | Modules | Document | release candidate | cubierto | storage |  | storage tests |
| REQ-038 | Import CSV/XLSX con validación | import-export | PRD/Q036 | Import | release candidate | cubierto | import/export | Formatos limitados a CSV/XLSX | import tests |
| REQ-039 | Export CSV/XLSX | import-export | PRD/Q036/Q067 | Export | release candidate | cubierto | import/export | PDF excluido del export masivo | export tests |
| REQ-040 | Suscripciones | billing-subscriptions | Modules | Subscription | release candidate | cubierto | billing |  | billing tests |
| REQ-041 | Statements | billing-subscriptions | Modules | Statement | release candidate | cubierto | billing |  | job tests |
| REQ-042 | PDF de registros individuales billing | billing-subscriptions | PRD/Modules | Invoice/Statement | release candidate | cubierto | billing/UI | PDF no pertenece al módulo Export masivo | PDF tests |
| REQ-043 | Archivos con signed URLs | storage-files | Modules | File | release candidate | cubierto | storage |  | signed URL tests |
| REQ-044 | Tags transversales | módulo | Modules | Tag | release candidate | cubierto | módulos shared |  | CRUD tests |
| REQ-045 | Bookmarks por usuario | módulo | Modules | Bookmark | release candidate | cubierto | módulos shared |  | user-scoped tests |
| REQ-046 | Filtros guardados | grid-module-factory | Modules | Filter | release candidate | cubierto | Grid |  | grid tests |
| REQ-047 | Task como módulo ejemplo app final | módulo | Structure/Q058 | Task | release candidate | cubierto | módulos |  | reference module tests |
| REQ-048 | Record relationships como subsistema transversal | módulo | Questionnaire | Record Relationship | release candidate | cubierto | datos |  | relation tests |
| REQ-049 | Campos comunes y soft delete | tabla | Schema/PRD | Metadata | primer corte | cubierto | datos |  | schema tests |
| REQ-050 | Versionado solo documents/files cuando aplique | tabla | Schema | Versionado | release candidate | cubierto | storage |  | migration tests |
| REQ-051 | Consent records mínimos | consent-records | Schema/Q027 | Consent | release candidate | cubierto | legal/security |  | consent tests |
| REQ-052 | API versionada `/api/v1/*` | api-errors-security | Architecture | API | primer corte | cubierto | API |  | contract tests |
| REQ-053 | Zod/Pydantic en trust boundaries | api-errors-security | Architecture | Validation | primer corte | cubierto | API/security |  | validation tests |
| REQ-054 | Core AI como servicio interno | ai-providers | Architecture | Core AI | release candidate | cubierto | Core AI |  | integration tests |
| REQ-055 | FastAPI/Pydantic v2 para Core AI | ai-providers | Stack | Python | release candidate | cubierto | Core AI |  | API tests |
| REQ-056 | API p95 < 200ms salvo excepción | performance-budget | Scalability | Performance | release candidate | cubierto | KPIs |  | k6/APM |
| REQ-057 | LCP < 2.5s Fast 3G | performance-budget | Scalability | Performance | release candidate | cubierto | KPIs |  | Lighthouse |
| REQ-058 | Lighthouse > 90 | performance-budget | Scalability | Performance | release candidate | cubierto | KPIs |  | Lighthouse |
| REQ-059 | k6 para flujos críticos | escalabilidad | Scalability/k6 | Load | release candidate | cubierto | pruebas |  | k6 |
| REQ-060 | Playwright 375/768/1920 | testing-quality | Playwright | Testing | release candidate | cubierto | pruebas |  | Playwright |
| REQ-061 | Vitest para lógica | testing-quality | Stack | Testing | primer corte | cubierto | pruebas |  | Vitest |
| REQ-062 | SonarQube gate | dependency-security | SonarQube | Calidad | release candidate | cubierto | gates |  | Sonar |
| REQ-063 | SSRF guard | api-errors-security | Security | SSRF | release candidate | cubierto | seguridad |  | abuse tests |
| REQ-064 | Webhook HMAC/replay | api-errors-security | Security | Webhooks | release candidate | cubierto | webhooks |  | webhook tests |
| REQ-065 | Rate limiting | api-errors-security | Security | Rate limit | primer corte | cubierto | API/security |  | rate limit tests |
| REQ-066 | AI budgets | ai-providers | Security/Q045 | AI budgets | release candidate | cubierto | Core AI/KPIs |  | budget tests |
| REQ-067 | Estructura por módulos/capas | módulo | Structure | Estructura | primer corte | cubierto | estructura |  | tree check |
| REQ-068 | Fase 0 decisiones canónicas | release | Dependency | Fase 0 | primer corte | cubierto | decisiones |  | questionnaire approval |
| REQ-069 | Source-available comercial | comercial | Strategy/Q022 | Comercial | venta | cubierto | comercialización |  | legal review |
| REQ-070 | Un año updates + renovación posterior | comercial | Strategy | Updates | venta | cubierto | comercialización |  | docs/legal |

## Matriz de invariantes y gates

| ID | Regla o gate | Dominio | Fuente | Obligación | Estado | Donde se cubre | Comando/gate esperado | Criterio bloqueante |
|---|---|---|---|---|---|---|---|---|
| GATE-001 | No Plan/State sin Spec aprobada | release | FromZero | primer corte | cubierto | aprobación | revisión artefactos | Plan/State antes de aprobar Spec |
| GATE-002 | No código de aplicación en Spec | release | usuario | primer corte | cubierto | metadatos | `git diff --name-only` | cambios fuera de docs/artifacts |
| GATE-003 | No secretos ni `.env` reales | seguridad | security | primer corte | cubierto | variables | revisión git/secrets scan | secreto versionado |
| GATE-004 | Bootstrap un solo uso | bootstrap-order | bootstrap | primer corte | cubierto | bootstrap | test bootstrap | re-ejecución muta estado |
| GATE-005 | `.env.example` sin valores reales | seguridad | bootstrap | primer corte | cubierto | variables | review | secreto real |
| GATE-006 | RLS en tablas tenant-aware | seguridad | schema/security | primer corte | cubierto | seguridad | SQL/RLS tests | cross-tenant access |
| GATE-007 | RBAC server-side | seguridad | security | primer corte | cubierto | permisos | API tests | UI como única barrera |
| GATE-008 | `tenant_id` no autoridad cliente | seguridad | PRD/security | primer corte | cubierto | API/tenant | BOLA tests | header/param controla tenant |
| GATE-009 | Service role solo server/jobs | seguridad | security | primer corte | cubierto | variables | code review | service role cliente |
| GATE-010 | Webhooks firmados | seguridad | security | release candidate | cubierto | webhooks | webhook tests | acepta sin firma |
| GATE-011 | SSRF guard | seguridad | security | release candidate | cubierto | integraciones | abuse tests | URL interna accesible |
| GATE-012 | API versionada | api-inventory | architecture | primer corte | cubierto | API | route inventory | pública sin `/api/v1` |
| GATE-013 | Inventario API antes de endpoints | api-inventory | architecture | primer corte | cubierto | API | Spec/Plan review | endpoint sin contrato |
| GATE-014 | API p95 < 200ms | performance-budget | scalability | release candidate | cubierto | KPIs | k6/APM | p95 incumplido sin excepción |
| GATE-015 | LCP < 2.5s Fast 3G | performance-budget | scalability | release candidate | cubierto | KPIs | Lighthouse | incumplido |
| GATE-016 | Lighthouse > 90 | performance-budget | scalability | release candidate | cubierto | KPIs | Lighthouse | score incumplido |
| GATE-017 | k6 en staging | escalabilidad | k6 | release candidate | cubierto | pruebas | `k6 run` | sin carga crítica |
| GATE-018 | Playwright desktop/tablet/mobile | testing-quality | Playwright | release candidate | cubierto | pruebas | Playwright | UI rota |
| GATE-019 | SonarQube gate | dependency-security | SonarQube | release candidate | cubierto | calidad | Sonar gate | vulnerabilidad/bloqueante |
| GATE-020 | MCP solo en acción aprobada | internal-service-boundary | questionnaire | posterior | cubierto | integraciones | revisión configuración | conexión sin acción separada |
| GATE-021 | Sanitizar marcas/deuda UI | template-brand-sanitization | UI template | primer corte | cubierto | UI | review/visual | marca visible no deseada |
| GATE-022 | Código/nombres en inglés | naming-dual-standard | instrucciones | primer corte | cubierto | criterios | lint/review | código en español |
| GATE-023 | Docs solicitadas en español | naming-dual-standard | instrucciones | primer corte | cubierto | criterios | review | documentación en idioma incorrecto |
| GATE-024 | Consentimientos mínimos | consent-records | schema/Q027 | release candidate | cubierto | legal | schema/tests | consent no auditable |
| GATE-025 | Fase 0 cerrada | release | dependency | primer corte | cubierto | decisiones | questionnaire approved | decisiones críticas abiertas |

## Escenario de entrada y ruta de construcción

- Escenario de entrada: idea documentada.
- Ruta de construcción: framework nuevo.
- Razón de la ruta elegida: la documentación define el producto From Zero Framework, no una app final ni un adaptador; el cuestionario aprobó esta ruta como decisión D001.

## Validación crítica

- Problema real: los equipos técnicos pierden tiempo reconstruyendo módulos SaaS/corporate comunes sin garantías consistentes de seguridad, datos, UI, billing y operación.
- Usuario objetivo: desarrolladores, equipos producto, agencias y emprendedores técnicos con control del código y de la infraestructura.
- Usuario no objetivo: usuarios no-code, sitios simples, landing/blogs, equipos que no pueden operar seguridad o despliegue.
- Casos de uso excluidos: app vertical única, template visual sin arquitectura, producto sin multi-tenancy, implementación sin RLS/RBAC/gates.
- Mercado y alternativas: boilerplates SaaS, starters Next.js/Supabase, frameworks internos y plantillas comerciales.
- Diferenciación: 27 módulos core, bootstrap Tenant Zero, RLS/RBAC, Core AI interno, UI operacional, billing, import/export, event bus, calidad verificable.
- Modelo comercial y adquisición: source-available con licencia comercial propia, entrega repo privado + ZIP, tiers base de framework y tiers finales por app derivada.
- Riesgos de producto/tecnología/operación: alcance amplio, divergencias documentales, proveedor OpenRouter/model ID, activación MCP posterior, Supabase cloud directo, seguridad multi-tenant.

## Objetivo

Definir una especificación cerrada para construir From Zero Framework v7.4 como base web SaaS/corporate multi-tenant, con alcance completo documentado, decisiones aprobadas, matrices verificables y gates suficientes para generar un Plan sin inventar decisiones.

## Alcance

- Framework web Next.js App Router con estructura `src/app`, `src/framework`, `src/web`, `core-ai`, `supabase`, `scripts`.
- 27 módulos core documentados más `record-relationship` como subsistema transversal.
- Multi-tenancy con `tenant_id`, RLS, RBAC server-side, perfiles, membresías, Tenant Zero y Super Admin.
- Bootstrap inicial con `app.mode = saas`, `licensing_model = per_tenant`, planes Free/Trial/Pro/Enterprise, Trial default y degradación a Free si existe plan free/freemium.
- UI FromZero white-label, operacional densa, responsive, i18n español/inglés.
- API versionada `/api/v1/*` para todos los módulos, con auth, tenant context, RBAC, RLS, DTO, errores y auditoría.
- Adapters multi-proveedor: Stripe, Resend, OpenRouter, Inngest, reCAPTCHA, observabilidad opcional.
- Core AI multi-proveedor con OpenRouter `google/gemma-4-26b-a4b-it:free` como modelo inicial verificado.
- Supabase cloud directo con SQL versionado; secretos fuera del repo.
- Testing y gates: Vitest, Playwright, k6, SonarQube self-hosted, Lighthouse, RLS/RBAC/security tests.

## Fuera de alcance

- Implementar código de aplicación final o módulos verticales específicos.
- Crear `artifacts/FROMZERO_PLAN.md` o `artifacts/FROMZERO_STATE.md` en esta fase.
- Activar MCP de Supabase/SonarQube en este turno; queda como acción separada posterior.
- Incluir una app Expo base; el framework queda API-ready.
- Activar Sentry/PostHog u observabilidad dentro del framework base; se proveen opciones para apps derivadas.
- Definir precios finales de tiers para todas las apps derivadas.
- Resolver legalmente la licencia comercial propia; esta Spec exige revisión legal antes de venta.

## Usuarios y roles

- Super Admin: rol global asociado a Tenant Zero; administra plataforma, módulos globales, tenants, planes, perfiles y configuración.
- Tenant Admin: administra su tenant, usuarios, settings permitidos, suscripción y módulos habilitados.
- Member: opera módulos según perfil asignado.
- Guest: solo lectura cuando el perfil lo permita.
- API Key M2M: actor programático con tenant, módulo y acción como scopes; `expires_at` opcional pero recomendado.
- Usuario multi-tenant: capacidad soportada por parámetro global; default OFF. Si se activa, la UI permite elegir tenant por nombre y el backend emite contexto seguro.

## Módulos

- Grupo A: `settings`, `module`, `plan`, `ai-model`, `log`, `profile`.
- Grupo B: `tenant`, `user`, `invitation`, `notification`, `rule`, `custom-field`, `email-template`, `api-key`, `integration`, `webhook`, `document`, `import`, `export`, `subscription`, `statement`, `invoice`.
- Grupo C: `file`, `tag`, `bookmark`, `filter`.
- Grupo D: `task` como módulo ejemplo de aplicación final en `src/web/modules/task`.
- Subsistema transversal: `record-relationship`, sin navegación propia por defecto.
- Shared framework: `file`, `tag`, `bookmark`, `filter` viven como capacidades reutilizables del framework.

## Datos y ownership

- Supabase PostgreSQL es la base principal.
- Todo dato de negocio tenant-aware incluye `tenant_id` y RLS.
- Tablas globales permitidas: `settings`, `modules`, `plans`, `ai_models`, perfiles globales y configuraciones que no contienen datos de tenant.
- `user_memberships` define relación usuario-tenant-profile.
- Con `allow_multi_tenant_users = false`, un email con membership activa en otro tenant no puede aceptar otra invitación.
- Record relationships deben validar que ambos extremos pertenezcan al mismo `tenant_id`.
- Soft delete aplica por convención; purge se ejecuta por job y registra evidencia.
- Versionado se limita a documentos y archivos cuando aplique.
- Consent records mínimos: términos, privacidad y marketing.

## Permisos y RBAC

- RBAC se valida siempre server-side.
- Perfiles base: Super Admin, Admin, Member, Guest.
- Acciones estándar: `view`, `create`, `update`, `delete`, `import`, `export`, `notify`.
- API keys operan con scopes por tenant, módulo y acción; las acciones se auditan con `auth_method: "api_key"`.
- La UI solo oculta o deshabilita acciones; no autoriza.
- RLS debe bloquear acceso cruzado aunque falle la capa de aplicación.

## UI y experiencia

- Decisión de UI: framework.
- Referencia aplicada: UI FromZero local, sanitizada y sin deuda migrada.
- Estrategia responsive/mobile-first: desktop/tablet/mobile con validación 375/768/1920.
- Estrategia inicial de formularios: simples para configuración mínima; tabs para settings/tenant/billing; wizard para import; modales/drawers solo para tareas acotadas.
- Textos i18n: español como source of truth, inglés incluido; namespaces `common`, `layout`, `validation` y módulos en singular `snake_case`.
- Verificación visual: Playwright, Lighthouse y revisión de consola/render cuando haya UI.
- Branding: white-label; FromZero solo en documentación, demo o metadatos.
- No usar `tenant` como texto visible; usar Account/Cuenta mediante i18n.

## Integraciones

- Activas por contrato: Supabase cloud, SQL versionado, adapters para Stripe, Resend, OpenRouter, Inngest, reCAPTCHA.
- Diferidas con placeholders: Redis, observabilidad Sentry/PostHog, MCP Supabase/SonarQube, app mobile Expo, Hostinger como proveedor alterno.
- Condición de activación: configuración explícita por instalación, tenant o acción posterior aprobada.
- Variables documentadas en `.env.example`: todas las públicas y placeholders; secretos en panel/env store.
- OpenRouter: modelo inicial `google/gemma-4-26b-a4b-it:free`; pinning explícito requerido por entorno.
- Resend: proveedor default de email detrás de adapter.
- Stripe: proveedor default de pagos detrás de adapter.
- Inngest: implementación inicial del event bus detrás de adapter.
- reCAPTCHA: adapter anti-abuso inicial.

## Seguridad

- Modo tenant: multi-tenant con default `allow_multi_tenant_users = false`.
- RLS cross-tenant: obligatorio en tablas con `tenant_id`.
- RLS dentro del tenant por permisos/ownership: obligatorio cuando el módulo tenga autoría o scopes.
- RBAC server-side: obligatorio en Server Actions y API Routes.
- Consentimiento/cookies: términos, privacidad y marketing registrados; analytics/marketing por app derivada.
- Auditoría mínima por acción: fecha/hora, actor, tenant, entidad, acción, auth method, IP/user agent cuando aplique.
- MFA: configurable para todos; `mfa_policy = optional` por default.
- API keys: expiración opcional compatible, pero la UI debe recomendar expiración.
- Webhooks: HMAC, timestamp/replay protection, idempotency, retries y auditoría.
- Integraciones externas: SSRF guard, allowlists, validación URL, timeouts y rate limits.
- Core AI: opt-in por tenant, redacción/minimización, budget caps por tenant/usuario/feature.

## Escalabilidad

- Cache: Redis opcional default off; todo cache debe tener namespace por tenant, TTL e invalidación documentada.
- Jobs: Inngest adapter default; jobs recurrentes para import/export, billing cycles, cleanup/purge, email retries, statements/invoices y AI usage aggregation.
- Redis/Inngest: Redis no bloquea primer corte; Inngest sí queda como contrato release candidate para reglas/jobs.
- Observabilidad: hooks y opciones para apps derivadas; no activa por default en framework base.
- Validación visual/E2E: Playwright y Lighthouse en release candidate.
- Load: k6 contra staging dedicado, nunca producción sin aprobación explícita.

## Entornos

- Dev: Supabase cloud de desarrollo, variables por panel/env store local, SQL versionado, npm.
- Test/Staging: entorno dedicado para Playwright, k6, SonarQube y migraciones verificables.
- Producción: Coolify sobre Docker VPS como ruta principal, documentada para Docker genérico.
- Separación de datos y credenciales por entorno: obligatoria; OpenRouter permite API keys separadas por entorno y caps.

## Variables de entorno

Documentar placeholders en `.env.example`. No incluir secretos reales.

| Variable | Tipo | Estado |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | pública | requerida |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pública | requerida |
| `SUPABASE_SERVICE_ROLE_KEY` | secreta | server/jobs only |
| `DATABASE_URL` | secreta | server/migrations |
| `APP_BASE_URL` | pública/config | requerida |
| `API_BASE_URL` | pública/config | requerida |
| `AUTH_URL` | config | requerida |
| `AUTH_SECRET` | secreta | server |
| `STRIPE_PUBLISHABLE_KEY` | pública | si pagos activos |
| `STRIPE_SECRET_KEY` | secreta | si pagos activos |
| `STRIPE_WEBHOOK_SECRET` | secreta | si pagos activos |
| `RESEND_API_KEY` | secreta | si email activo |
| `OPENROUTER_API_KEY` | secreta | si IA activa |
| `AI_PROVIDER` | config | default `openrouter` |
| `AI_DEFAULT_MODEL` | config | default `google/gemma-4-26b-a4b-it:free` |
| `INNGEST_EVENT_KEY` | secreta/config | si event bus activo |
| `INNGEST_SIGNING_KEY` | secreta | si event bus activo |
| `REDIS_URL` | secreta | opcional |
| `RECAPTCHA_SITE_KEY` | pública | si anti-abuso activo |
| `RECAPTCHA_SECRET_KEY` | secreta | si anti-abuso activo |
| `SONAR_HOST_URL` | config | CI/gate |
| `SONAR_PROJECT_KEY` | config | CI/gate |
| `SONAR_TOKEN` | secreta | CI/gate |
| `PLAYWRIGHT_BASE_URL` | config | tests |
| `K6_BASE_URL` | config | load tests |
| `TEST_BASE_URL` | config | tests |
| `SUPABASE_ACCESS_TOKEN` | secreta | solo si se activa MCP/CLI |

## Timezone e i18n

- Timezone base: UTC.
- Override por tenant: permitido desde settings/tenant.
- Override por usuario: permitido desde perfil/preferencias.
- Persistencia en UTC: obligatoria para timestamps.
- Traducciones requeridas: `es` source of truth, `en` incluido; formularios, labels, callouts, modales, mensajes, toasts, errores, empty states y emails.

## Contrato base de APIs

- Método permitido: REST versionado `/api/v1/*` y Server Actions para mutaciones internas.
- Auth: Supabase JWT para usuarios, bearer API key para M2M.
- Tenant context: emitido por backend; UI solo expresa preferencia de tenant activo.
- RBAC/RLS: ambos obligatorios; scopes de API keys equivalen a permisos programáticos.
- Validación: Zod en TypeScript, Pydantic v2 en Core AI.
- DTO: no exponer columnas sensibles ni metadatos internos innecesarios.
- Rate limit: global, por tenant y por endpoint sensible.
- Error contract: errores seguros, no verbosos, sin secretos ni stack traces sensibles.
- Auditoría: toda mutación, webhook, import/export, billing, API key y acción admin registra log.

## Criterios de aceptación

- `FROMZERO_SPEC.md` revisado y aprobado explícitamente antes de crear Plan.
- No existen `FROMZERO_PLAN.md` ni `FROMZERO_STATE.md` antes de aprobación de Spec.
- Matriz de decisiones, requisitos y gates cubre contexto y cuestionario.
- Conflictos C001-C012 quedan visibles y resueltos para Spec o diferidos con razón.
- OpenRouter model ID queda fijado como `google/gemma-4-26b-a4b-it:free`.
- Q066/D063 queda corregido a `degrade_to_free` cuando existe Free/freemium.
- Import queda CSV/XLSX; export masivo CSV/XLSX; PDF queda como exportación de registro individual desde UI.
- Aprobación del cuestionario queda registrada literal.

## Base para planificación

- Dependencias funcionales: bootstrap -> settings/modules/plans -> profiles -> tenant/user -> RBAC/RLS -> APIs -> UI shell -> módulos.
- Dependencias técnicas: npm, Next.js, Supabase cloud, SQL versionado, TypeScript strict, Tailwind, Core AI FastAPI, CI.
- Capacidades que desbloquean otras: auth/session, tenant context, RLS/RBAC, settings/modules, plan feature gating, audit log, UI primitives, API contracts.
- Orden sugerido de construcción: base técnica, datos/RLS, auth/RBAC, bootstrap, UI shell, módulos A, módulos B críticos, shared modules, Task reference, QA/performance.
- Riesgos por dominio: seguridad multi-tenant, billing/webhooks, Core AI cost/privacy, import/export async, PDF, jobs, docs drift.
- Validaciones necesarias antes del primer Sprint: versiones oficiales, árbol objetivo, env placeholders, migración inicial, API inventory, RBAC matrix.
- Criterios para justificar un orden distinto en el Plan: reducir riesgo de RLS, desbloquear pruebas, evitar dependencias externas tempranas o validar UI shell antes de módulos masivos.

## Especialistas condicionales

| Dominio | Condición de activación | Especialista esperado | Modo permitido | Insumos obligatorios | Estado | Fallback o razón de no aplicación |
|---|---|---|---|---|---|---|
| arquitectura | APIs, jobs, cache, migraciones, Core AI | architect | revisión secuencial | Spec, docs, questionnaire | pendiente | Sin subagente real verificado |
| seguridad | auth, RLS, RBAC, secretos, webhooks, AI data | auditor | revisión secuencial | Spec, threat model, security assurance | pendiente | Obligatorio antes de Build |
| UI | UI framework, grid, accessibility, i18n | reviewer | revisión secuencial | Spec, UI reference | pendiente | Obligatorio antes de UI Build |
| rendimiento | k6, budgets, Redis, jobs, scale | perf | revisión secuencial | Spec, SLOs | pendiente | Obligatorio antes de release candidate |
| testing | unit, integration, E2E, RLS, abuse | tester | revisión secuencial | Spec, criteria | pendiente | Obligatorio en Plan |

Evaluación de agentes futuros:

- `database`: evaluar en backlog por RLS compleja, ownership, migraciones, Supabase/Postgres crítico.
- `integrations`: evaluar en backlog por Stripe, Resend, OpenRouter, webhooks, Inngest, retries, idempotencia y rate limits.
- Resultado de la evaluación: evaluar en backlog; no crear agentes desde esta fase.

## Zonas de validación humana

| Zona | Condición de activación | Estado | Aprobación o razón | Sprint afectado |
|---|---|---|---|---|
| auth/sesiones | login, sesión, MFA, OAuth, tenant active | requiere aprobación | Cambios de seguridad de acceso | futuro Plan |
| permisos/RLS/RBAC | aislamiento, ownership, autorización | requiere aprobación | Riesgo cross-tenant | futuro Plan |
| billing/pagos/webhooks | cobros, planes, Stripe, webhooks | requiere aprobación | Impacto monetario | futuro Plan |
| migraciones destructivas | drop/delete/backfill irreversible | requiere aprobación | Riesgo datos | futuro Plan |
| eliminación/exportación de datos | purge, exportaciones, backups, retención | requiere aprobación | Riesgo legal/datos | futuro Plan |
| secretos/deploy | credenciales, CI/CD, Coolify, cloud | requiere aprobación | Riesgo operativo | futuro Plan |
| legal/compliance | licencia, privacidad, términos, consentimiento | requiere aprobación | Bloqueante para venta | futuro Plan |

## Automatización vs augmentación

| Automatización | Requiere juicio humano | 80% correcto es aceptable | Costo del fallo | Detección del fallo | Rollback | Evidencia producida | Estado |
|---|---|---|---|---|---|---|---|
| Bootstrap inicial | si | no | Alto: estado inicial corrupto | logs/bootstrap tests | reset entorno no prod | logs y seed report | aprobado para especificar |
| Import/export async | si | no | Medio/alto: datos corruptos o fuga | job logs, preview, audit | cancelar job, purge output | import/export history | aprobado para especificar |
| Billing cycle jobs | si | no | Alto: cobro incorrecto | reconciliation, webhooks | adjustment/refund | statements/invoices | aprobado para especificar |
| Cleanup/purge | si | no | Alto: borrado irreversible | purge preview/log | backup restore | purge_log | requiere aprobación |
| AI invocation | si | no | Medio/alto: costo o fuga datos | usage log, budgets | disable tenant AI | ai.invocation logs | aprobado para especificar |
| Notification/event rules | si | no | Medio: acciones no deseadas | event logs/retries | disable rule | rule execution logs | aprobado para especificar |

## KPIs y SLOs

| Metrica | Valor objetivo | Fuente | Gate/Sprint que la verifica | Estado |
|---|---|---|---|---|
| API p95 | < 200 ms salvo excepción documentada | `SCALABILITY_ASSURANCE.md` | k6/APM en RC | cubierto |
| LCP | < 2.5 s en Fast 3G | `SCALABILITY_ASSURANCE.md` | Lighthouse/Playwright en RC | cubierto |
| Lighthouse | > 90 | `SCALABILITY_ASSURANCE.md` | Lighthouse en RC | cubierto |
| Cobertura crítica | 80% lógica crítica | cuestionario Q046 | CI test coverage | cubierto |
| Playwright viewports | 375, 768, 1920 | recurso Playwright | E2E visual | cubierto |
| OpenRouter context | 262K para `google/gemma-4-26b-a4b-it:free` | OpenRouter | AI adapter tests | cubierto |
| OpenRouter pricing | sujeto a proveedor/modelo | OpenRouter pricing | budget tests | cubierto |

## Pruebas esperadas

- Unit: validaciones Zod/Pydantic, helpers RBAC, feature gating, DTO, pricing logic, AI budgets.
- Integration: Supabase RLS, Server Actions, API Routes, migrations, webhooks, event bus, email/payment adapters.
- E2E: auth, tenant selection, settings, modules, grid, import/export, billing, API keys, notifications.
- Visual: shell UI, responsive 375/768/1920, modals/drawers, tables, forms, empty/loading/error/success.
- Security: BOLA/IDOR, SSRF, webhook replay, API key scopes, service role isolation, rate limits, secrets scan.
- Performance: k6 staging para auth, dashboard, grid, import/export, billing webhooks y APIs críticas.
- Quality: SonarQube self-hosted en CI.

## Requisitos por módulo

| Módulo o capacidad | Seguridad mínima | Escalabilidad mínima | Pruebas mínimas | Fuente |
|---|---|---|---|---|
| Settings | Super Admin/RBAC | JSONB partial updates | CRUD/RBAC | Modules |
| Module | Super Admin/RBAC | index module code | registry tests | Modules |
| Plan/Subscription | RBAC, webhook HMAC | jobs billing | billing tests | PRD/Modules |
| Profile/User/Tenant | RLS/RBAC | indexes memberships | RLS/auth tests | PRD/Modules |
| Log | append-only/read scope | indexed filters | audit tests | Modules |
| Invitation | TTL, token hash | email queue | invitation tests | Modules |
| Notification | recipient scope | async channels | event tests | PRD |
| Rule/Webhook | signatures, SSRF | retries/idempotency | webhook/rule tests | Modules |
| Custom Field | validation, module allowlist | JSONB size limit | validation tests | PRD |
| Import/Export | RBAC, signed URLs | async jobs | file/job tests | PRD/Q036/Q067 |
| Document/File | signed URLs, MIME/size | storage layout | storage tests | PRD |
| Tags/Bookmarks/Filters | tenant/user scope | indexes | CRUD/user tests | Modules |
| Task | app module boundaries | reference pattern | full triad tests | Structure |
| Core AI | opt-in, redaction, budgets | provider adapters | AI integration tests | PRD/Q063 |

## Riesgos

- Alto: multi-tenancy y RLS incompletos pueden causar fuga cross-tenant.
- Alto: billing/webhooks mal diseñados pueden causar cobros o estados incorrectos.
- Alto: purge destructivo requiere aprobación humana y evidencia.
- Alto: OpenRouter/Gemma free model ID debe mantenerse explícito y monitoreado por cambios/deprecación.
- Medio: Supabase cloud directo puede generar deriva si SQL versionado no se disciplina.
- Medio: UI FromZero puede copiar deuda visual si no se sanitiza.
- Medio: Redis default off exige fallback robusto para rate limit/jobs pequeños.
- Medio: observabilidad no activa en framework base puede limitar diagnósticos en apps derivadas si no se documentan placeholders.
- Medio: licencia comercial propia requiere revisión legal antes de venta.

## Decisiones pendientes o diferidas

- Decisión: activar MCP Supabase/SonarQube.
  Por que se difiere: requiere acción separada posterior a la aprobación del cuestionario y no forma parte de esta Spec.
  Impacto arquitectonico: mejora automatización de DB/calidad, pero agrega conexión externa.
  Placeholder/contrato requerido: configuración MCP separada, tokens fuera del repo.
  Condición de activación: aprobación explícita en turno dedicado.
  Gate requerido: no leer secretos, no conectar sin confirmación.
  Riesgo si no se prepara: más trabajo manual en DB/calidad.

- Decisión: observabilidad concreta para apps derivadas.
  Por que se difiere: framework solo provee opciones; cada app activa herramientas.
  Impacto arquitectonico: hooks/adapters deben existir sin estar activos.
  Placeholder/contrato requerido: env vars y adapter interfaces.
  Condición de activación: app derivada lo requiere.
  Gate requerido: consentimiento y secrets.
  Riesgo si no se prepara: instrumentación tardía.

- Decisión: licencia comercial propia legal.
  Por que se difiere: requiere redacción legal externa.
  Impacto arquitectonico: no bloquea código, sí venta/distribución.
  Placeholder/contrato requerido: `LICENSE`, términos, límites de redistribución.
  Condición de activación: antes de venta.
  Gate requerido: revisión legal.
  Riesgo si no se prepara: uso no autorizado o ambigüedad comercial.

## Aprobación

- Revisado por: usuario.
- Fecha: 2026-06-18.
- Estado: aprobado.
- Frase literal: Apruebo la especificación.
