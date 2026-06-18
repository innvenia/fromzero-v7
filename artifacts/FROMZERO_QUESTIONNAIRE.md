# FROMZERO_QUESTIONNAIRE

Este archivo registra las preguntas de clarificación del proyecto, sus opciones y las respuestas seleccionadas.

El usuario puede corregir respuestas editando `Respuesta seleccionada` o agregando notas en `Notas o correcciones`.

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_QUESTIONNAIRE |
| Propósito o subtítulo | Decisiones guiadas del usuario antes de especificar |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: cuestionario ejecutado en modo plan y registrado para revisión; 2026-06-18: correcciones documentales aplicadas por solicitud del usuario; 2026-06-18: aprobado explícitamente por el usuario |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-18 |
| Frase literal de aprobación | Apruebo el cuestionario. |
| Artefactos prerequisito | `artifacts/FROMZERO_CONTEXT.md` |
| Documentos o fuentes asociadas | `docs/`, `artifacts/FROMZERO_CONTEXT.md`, Q&A ejecutado en conversación |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_SPEC.md` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se ejecutó código de aplicación. No se activaron servicios externos. |

## Estado general

- Fuente principal revisada: `docs/` y `artifacts/FROMZERO_CONTEXT.md`
- Contexto base: `artifacts/FROMZERO_CONTEXT.md`
- Modo Q&A ejecutado: si
- Preguntas críticas pendientes: 0
- Preguntas críticas sin respuesta: 0
- Preguntas diferidas: activación MCP posterior al registro del cuestionario
- Estado de aprobación para Spec: no aprobado

Regla:
Si `Aprobación del usuario` no es `aprobada`, este archivo no puede usarse para crear `artifacts/FROMZERO_SPEC.md`.

## Resumen de entendimiento antes de preguntar

- Problema entendido: crear el framework base From Zero para construir aplicaciones SaaS/corporate multi-tenant con módulos empresariales reutilizables.
- Resultado esperado: base vendible, extensible, segura, white-label, con UI operacional, datos, auth, billing, Core AI, pruebas y operación definidos.
- Usuario objetivo: desarrolladores, equipos producto, agencias y emprendedores técnicos con control de código e infraestructura.
- Usuario no objetivo: usuarios no-code, sitios simples, blogs o equipos sin control de infraestructura.
- Casos excluidos: app vertical única, template de marketing aislado, implementación sin RLS/RBAC/gates.
- Supuestos validados: el proyecto es el framework base v7.4; el alcance completo sigue vigente y se entrega por fases.

## Entrevista por ciclos

| Ciclo | Tema | Objetivo del ciclo | Resultado |
|---:|---|---|---|
| 1 | Producto | Cerrar ruta, versión y alcance | Framework base, v7.4, todo por fases |
| 2 | Estructura/UI | Cerrar relaciones, UI y estructura real | Subsistema transversal, UI FromZero, Codex |
| 3 | Tenancy/comercial | Cerrar modo, licencia funcional y usuarios multi-tenant | SaaS, por tenant, multi-tenant users default off |
| 4 | Datos/auth | Cerrar Supabase, tenant activo y auth | Supabase cloud, selector UI, email + MFA opcional |
| 5 | Proveedores | Cerrar pagos, email e IA | Stripe, Resend, OpenRouter Gemma 4 con adapters |
| 6 | Jobs/deploy | Cerrar colas, eventos y despliegue | Redis off, Inngest adapter, Docker VPS |
| 7 | Operación | Cerrar observabilidad, calidad y CI | Opciones no activas, SonarQube, GitHub Actions |
| 8 | Comercial | Cerrar licencia, entrega y tiers | Licencia propia, repo+ZIP, tiers por app |
| 9 | Legal/datos | Cerrar retención, borrado y consentimientos | Configurable, soft delete + purge, legales+marketing |
| 10 | Primer corte | Cerrar corte técnico, idiomas y seeds | Base técnica, es/en, bootstrap + demo separado |
| 11 | UI/mobile | Cerrar marca, mobile y estilo | White-label, API-ready, operacional densa |
| 12 | API/import | Cerrar API, API keys e import/export inicial | API todos módulos, scopes granulares, formatos base |
| 13 | Permisos | Cerrar RBAC, Super Admin y auditoría | Roles+perfiles, Tenant Zero, seguridad+cambios |
| 14 | Planes/extensión | Cerrar planes, feature gating y custom fields | Plantillas, global/plan/tenant, módulos permitidos |
| 15 | Core AI | Cerrar modelo, privacidad y límites | OpenRouter/Gemma 4, opt-in/redacción, budgets granulares |
| 16 | Calidad | Cerrar cobertura, performance y carga | 80% crítico, RC, staging |
| 17 | Stack/repo | Cerrar versiones, package manager y estructura | Versiones fijadas, npm, estructura documentada |
| 18 | Infra/MCP | Cerrar migraciones, VPS y MCP | SQL versionado, Coolify+Docker, MCP post-cuestionario |
| 19 | Eventos | Cerrar notificaciones, webhooks y reglas | In-app default, webhooks bidireccionales, datos/tiempo/webhooks |
| 20 | Módulos | Cerrar Task, módulos shared y público | Task app ejemplo, shared framework, público mínimo |
| 21 | Conflictos | Cerrar resolución de conflictos, MCP y modelo | Decisión caso por caso, MCP después, verificar modelo |
| 22 | Billing | Cerrar códigos de plan, default y vencimiento | Free/Trial/Pro/Enterprise, Trial, read-only |
| 23 | Export/abuso | Cerrar PDF, captcha e imágenes | PDF por registro individual, reCAPTCHA, WebP off |
| 24 | Regional | Cerrar locale, timezone y moneda | `es`, UTC, USD |
| 25 | Seguridad | Cerrar MFA, API keys y secretos | MFA configurable, expiración opcional, env store |
| 26 | Excepciones | Confirmar excepciones de seguridad | Sin MFA obligatorio; API keys pueden no expirar |
| 27 | Cierre | Confirmar estado del cuestionario | Completo para registrar |

## Decisiones efectivas

| ID | Decisión | Resultado efectivo |
|---|---|---|
| D001 | Ruta del proyecto | Framework base From Zero, no app derivada ni adaptador |
| D002 | Versión canónica | v7.4 actual; menciones documentales antiguas alineadas en `docs/` |
| D003 | Alcance | Todo lo documentado sigue vigente; fases solo ordenan entrega |
| D004 | `record-relationship` | Subsistema transversal; no módulo visible independiente |
| D005 | UI | UI FromZero como base operativa |
| D006 | Estructura | La estructura documentada describe solo el framework entregable; tooling IA y artefactos FromZero quedan fuera del árbol de producto |
| D007 | Modo inicial | SaaS |
| D008 | Modelo comercial funcional | `per_tenant` |
| D009 | Usuarios multi-tenant | Parámetro global con default OFF: un usuario pertenece a un tenant; corrige `allow_multi_tenant_users: true` a `false` |
| D010 | Supabase desarrollo | Proyecto cloud directo en `supabase.com` |
| D011 | Tenant activo | Selector UI por nombre en instalaciones multi-tenant; backend valida permisos |
| D012 | Auth default | Email/password; MFA configurable |
| D013 | Pagos | Adapter multi-proveedor; Stripe por defecto |
| D014 | Email | Adapter multi-proveedor; Resend por defecto |
| D015 | Core AI | Multi-proveedor; OpenRouter + `google/gemma-4-26b-a4b-it:free` inicial |
| D016 | Redis/colas | Opcional, default off |
| D017 | Event bus | Inngest como implementación inicial detrás de adapter |
| D018 | Deploy | Docker VPS; Coolify como ruta principal compatible con Docker genérico |
| D019 | Observabilidad | Opciones disponibles para apps derivadas; no activas en framework base |
| D020 | Quality gate | SonarQube self-hosted |
| D021 | CI | GitHub Actions |
| D022 | Licencia | Comercial propia source-available |
| D023 | Entrega comercial | Repo privado + ZIP por release |
| D024 | Tiers | Tiers básicos del framework; tiers finales por app derivada |
| D025 | Retención | Configurable segura |
| D026 | Eliminación | Soft delete + purge |
| D027 | Consentimientos | Términos, privacidad y marketing |
| D028 | Primer corte | Base técnica fundacional |
| D029 | Idiomas | Español e inglés |
| D030 | Seeds | Bootstrap mínimo + demo separado |
| D031 | Branding | White-label; FromZero solo en documentación, demo o metadatos |
| D032 | Mobile | API-ready, sin app Expo incluida |
| D033 | Estilo UI | Operacional densa |
| D034 | API | API versionada para todos los módulos |
| D035 | API keys | Scope por tenant, módulo y acción |
| D036 | Import/export | Import CSV/XLSX; export masivo CSV/XLSX; PDF solo por registro individual desde UI |
| D037 | RBAC | Roles base + perfiles personalizados |
| D038 | Super Admin | Global + Tenant Zero |
| D039 | Auditoría | Seguridad y cambios críticos |
| D040 | Planes base | Plantillas sin precios |
| D041 | Feature control | Global, plan y tenant |
| D042 | Custom fields | Solo módulos que lo declaren permitido |
| D043 | IA privacidad | Opt-in por tenant y redacción/minimización de datos |
| D044 | IA budgets | Por tenant, usuario y feature |
| D045 | Cobertura | 80% sobre lógica crítica |
| D046 | Performance | Presupuestos bloquean desde release candidate |
| D047 | Carga | k6 en staging dedicado |
| D048 | Versiones | Versiones estables fijadas tras verificación oficial |
| D049 | Package manager | npm |
| D050 | Estructura código | La estructura documentada manda: `src/app`, `src/framework`, `src/web`, `core-ai`, `supabase` |
| D051 | Migraciones Supabase | SQL versionado aplicado a cloud |
| D052 | MCP | Preparar y activar después del cuestionario; no se activó en este registro |
| D053 | Notificaciones | In-app por defecto; otros canales activables por tenant |
| D054 | Webhooks | Entrantes y salientes |
| D055 | Reglas | Triggers de datos, tiempo y webhooks |
| D056 | Task | Módulo ejemplo de aplicación final |
| D057 | Shared modules | File, Tag, Bookmark y Filter en framework shared |
| D058 | Superficie pública | Base mínima reemplazable |
| D059 | Conflictos docs/Q&A | Mostrar versión del cuestionario y versión documental para decidir caso por caso |
| D060 | Modelo OpenRouter | `google/gemma-4-26b-a4b-it:free` verificado en OpenRouter |
| D061 | Plan codes | Free, Trial, Pro, Enterprise |
| D062 | Plan default | Trial |
| D063 | Trial vencido | Degradar a Free (`degrade_to_free`) si existe plan `free` o freemium |
| D064 | Anti-abuso | reCAPTCHA adapter |
| D065 | Optimización imágenes | WebP activable, default off |
| D066 | Locale default | `es` |
| D067 | Timezone default | UTC |
| D068 | Currency default | USD |
| D069 | MFA | Configurable para todos; ningún perfil con MFA obligatorio por defecto |
| D070 | API key expiración | Expiración opcional |
| D071 | Secretos | Panel/env store del proveedor; repo solo `.env.example` |

## Registro de preguntas y respuestas

Cada fila registra la opción seleccionada o la respuesta abierta del usuario. Las opciones alternativas presentadas quedan resumidas para revisión.

| ID | Estado | Criticidad | Tema | Pregunta visible | Opciones presentadas | Respuesta seleccionada | Fuente documental | Notas |
|---|---|---|---|---|---|---|---|---|
| Q001 | respondida | crítica | producto | ¿Qué estamos especificando exactamente en este proyecto FromZero? | Framework base; App derivada; Metodología/adaptador | Framework base | `FROMZERO_CONTEXT.md`, `docs/PRD.md` | Confirma ruta de construcción |
| Q002 | respondida | crítica | producto | La documentación menciona una versión y el proyecto está en otra ruta. ¿Qué versión debe mandar? | v7.4 actual; conservar versión antigua; alinear antes de SPEC | v7.4 actual | `FROMZERO_CONTEXT.md` | Documentación antigua alineada en `docs/` |
| Q003 | respondida | crítica | producto | Según la documentación, ¿cómo interpretamos el alcance y las fases? | Todo por fases; Release reducido; Redefinir alcance | Todo, por fases | `docs/PRD.md`, `docs/DEPENDENCY_MATRIX.md` | No reduce producto vendible |
| Q004 | respondida | crítica | módulos | ¿Cómo debe tratarse la capacidad de relacionar registros entre módulos? | Subsistema transversal; Módulo visible; Solo soporte | Subsistema transversal | `docs/REFERENCE_MODULES.md` | Mantiene 27 módulos visibles |
| Q005 | respondida | crítica | UI | ¿Cómo quieres definir la interfaz visual del framework? | UI FromZero; Referencia externa; Diferir UI | UI FromZero | `docs/REFERENCE_DESIGN_SYSTEM.md`, recurso `fromzero-ui-template` | Sanitizar marcas y deuda migrada |
| Q006 | respondida | importante | estructura | La documentación mezcla estructura del framework con directorios meta del entorno. ¿Cómo lo resolvemos? | Solo framework entregable; documentar tooling en nota; conservar docs | Solo framework entregable | `docs/REFERENCE_STRUCTURE.md`, estado del repo | Se eliminan del árbol los directorios de tooling IA y metodología; `src/app`, `src/framework`, `src/web`, `core-ai` y `supabase` no cambian. |
| Q007 | respondida | crítica | producto | ¿Cuál debe ser el modo inicial del framework al hacer bootstrap? | SaaS; Corporativo; Configurable sin default | SaaS | `docs/BOOTSTRAP_REFERENCE.md` | Alineado a venta B2B |
| Q008 | respondida | crítica | comercial | ¿Cuál debe ser el modelo comercial inicial dentro del producto? | Por tenant; Por usuario; Configurable | Por tenant | `docs/BOOTSTRAP_REFERENCE.md`, `docs/REFERENCE_MODULES.md` | `licensing_model = per_tenant` |
| Q009 | respondida | crítica | usuarios | ¿Un mismo usuario podrá pertenecer a varias cuentas o empresas desde el inicio? | Sí configurable; No al inicio; Solo Super Admin | Parámetro global; default OFF: un usuario solo pertenece a un tenant | `docs/BOOTSTRAP_REFERENCE.md`, conversación | Corrige el default documentado `allow_multi_tenant_users: true` a `false`. Fuente: `docs/BOOTSTRAP_REFERENCE.md:61`, `docs/BOOTSTRAP_REFERENCE.md:119`, `docs/PRD.md:221` |
| Q010 | respondida | crítica | datos | ¿Dónde debe trabajarse Supabase durante el desarrollo inicial del framework? | Local y cloud; Cloud con SQL; Solo cloud | Trabajar directamente con proyecto cloud en `supabase.com` | `docs/REFERENCE_STACK.md` | Se complementa con SQL versionado en Q052 |
| Q011 | respondida | crítica | permisos | ¿Cómo debe resolverse el tenant activo cuando la instalación permite usuarios en más de un tenant? | Servidor decide; Perfil seguro; Selección cliente | UI permite cambiar tenant por nombre; la opción activa es el tenant activo | `docs/SECURITY_ASSURANCE.md`, conversación | Backend debe validar membresía/RBAC/RLS |
| Q012 | respondida | importante | auth | ¿Qué comportamiento de autenticación debe traer el framework por defecto? | Email, MFA opcional; OAuth inicial; MFA obligatorio | Email, MFA opcional | `docs/BOOTSTRAP_REFERENCE.md` | Reconfirmado como configurable en Q075 |
| Q013 | respondida | importante | pagos | ¿Qué proveedor de pagos debe traer el framework como opción inicial? | Stripe con adapter; Adapter sin default; Sin pagos | Adapter multi-proveedor; Stripe por defecto | `docs/PRD.md`, recurso `stripe` | Stripe no debe acoplar dominio |
| Q014 | respondida | importante | email | ¿Cómo debe resolverse el envío de correos transaccionales? | SMTP configurable; Resend default; Adapter sin default | Adapter multi-proveedor; Resend por defecto | `docs/PRD.md`, `docs/REFERENCE_MODULES.md` | Proveedor configurable por app/tenant |
| Q015 | respondida | crítica | IA | ¿Qué proveedor debe usarse como base para Core AI? | OpenAI con adapter; Multi-provider; Adapter sin default | Multi-proveedor; OpenRouter con modelo `google/gemma-4-26b-a4b-it:free` inicial | `docs/REFERENCE_ARCHITECTURE.md`, conversación | Identificador exacto verificado en OpenRouter |
| Q016 | respondida | importante | escala | ¿Cómo debe tratar el framework Redis y las colas desde el inicio? | Opcional default off; Obligatorio inicial; Diferir completo | Opcional, default off | `docs/SCALABILITY_ASSURANCE.md`, recurso `redis` | Requiere fallback |
| Q017 | respondida | importante | operación | ¿Qué estrategia debe usarse para reglas, eventos y trabajos programados? | Inngest con adapter; DB primero; Adapter sin default | Inngest con adapter | `docs/REFERENCE_STACK.md`, recurso `inngest` | Implementación reemplazable |
| Q018 | respondida | crítica | deploy | ¿Cuál debe ser el destino de despliegue inicial recomendado para el framework? | Docker VPS; Vercel + servicios; Cloud Run | Docker VPS | `docs/PRD.md` | Afinado a Coolify en Q053 |
| Q019 | respondida | importante | observabilidad | ¿Qué observabilidad debe incluirse como recomendación inicial? | Sentry + PostHog; Solo Sentry; Adapters vacíos | El framework solo provee opciones; no quedan activas en el framework base | `docs/PRD.md`, conversación | Apps derivadas activan observabilidad |
| Q020 | respondida | importante | calidad | ¿Qué herramienta debe usarse para el gate de calidad y seguridad de código? | SonarQube self-hosted; SonarCloud; Solo lint/tests | SonarQube self-hosted | recurso `sonarqube` | Gate externo previsto |
| Q021 | respondida | importante | CI | ¿Dónde deben ejecutarse los checks automáticos del proyecto? | GitHub Actions; CI self-hosted; Scripts locales | GitHub Actions | `docs/REFERENCE_STACK.md` | Cuando exista remoto |
| Q022 | respondida | crítica | comercial | ¿Qué tipo de licencia debe regir el producto source-available? | Comercial propia; BUSL-like; Pendiente legal | Comercial propia | `docs/STRATEGY.md` | Requiere redacción legal posterior |
| Q023 | respondida | importante | comercial | ¿Cómo debe entregarse el framework a compradores o equipos internos? | Repo privado + ZIP; Solo repo privado; Instalador CLI | Repo privado + ZIP | `docs/STRATEGY.md` | ZIP por release |
| Q024 | respondida | importante | comercial | ¿Qué hacemos con el free tier mencionado en la estrategia? | Diferir explícito; Definir ahora; Eliminarlo | Tiers básicos a nivel framework; tiers finales por app derivada | `docs/STRATEGY.md`, conversación | No fijar oferta final universal |
| Q025 | respondida | crítica | datos | ¿Qué política base de retención de datos debe traer el framework? | Configurable segura; Mínima agresiva; Larga auditoría | Configurable segura | `docs/SECURITY_ASSURANCE.md` | Defaults conservadores |
| Q026 | respondida | crítica | datos | ¿Cómo debe manejarse la eliminación de registros y datos de usuario? | Soft delete + purge; Borrado directo; Solo anonimizar | Soft delete + purge | `docs/PRD.md`, `docs/REFERENCE_DATABASE_SCHEMA.md` | Purga configurable |
| Q027 | respondida | crítica | legal | ¿Qué consentimientos mínimos debe registrar el framework base? | Términos, privacidad, marketing; Solo legales; Configurable vacío | Términos, privacidad, marketing | `docs/REFERENCE_DATABASE_SCHEMA.md` | Consent records obligatorios |
| Q028 | respondida | crítica | release | ¿Qué profundidad debe tener el primer corte técnico verificable? | Base técnica; Área completa; Todo completo | Base técnica | `docs/DEPENDENCY_MATRIX.md` | Fundamentos antes de módulos completos |
| Q029 | respondida | importante | i18n | ¿Qué idiomas debe soportar el framework desde el inicio? | Español e inglés; Solo español; Solo inglés | Español e inglés | `docs/PRD.md` | `es` source of truth |
| Q030 | respondida | importante | datos | ¿Qué datos iniciales debe incluir el framework? | Bootstrap + demo separado; Solo bootstrap; Demo completo | Bootstrap + demo separado | `docs/BOOTSTRAP_REFERENCE.md` | No mezclar demo con producción |
| Q031 | respondida | importante | UI | ¿Cómo debe manejar el framework la marca visual base? | White-label + FromZero; FromZero visible; Solo app final | White-label + FromZero | `docs/REFERENCE_DESIGN_SYSTEM.md` | FromZero solo docs/demo/metadatos |
| Q032 | respondida | importante | mobile | ¿Qué alcance mobile debe tener el framework inicial? | API-ready; Expo incluido; Sin mobile | API-ready | `docs/REFERENCE_STRUCTURE.md`, recurso `expo` | Sin app Expo inicial |
| Q033 | respondida | importante | UI | ¿Qué tipo de experiencia debe priorizar la interfaz base? | Operacional densa; Comercial visual; Mínima técnica | Operacional densa | `docs/PRD.md` | SaaS/corporate operativo |
| Q034 | respondida | crítica | API | ¿Qué alcance debe tener la API versionada inicial? | Todos los módulos; Solo base; Interna primero | Todos los módulos | `docs/REFERENCE_ARCHITECTURE.md` | Contrato versionado aunque implementación sea por fases |
| Q035 | respondida | crítica | seguridad | ¿Qué granularidad deben tener las API keys? | Tenant, módulo, acción; Tenant completo; Global admin | Tenant, módulo, acción | `docs/REFERENCE_MODULES.md` | Mínimo privilegio |
| Q036 | corregida | importante | import-export | ¿Qué formatos debe soportar import/export como contrato base? | CSV/XLSX; CSV solamente; Adapter por módulo | CSV, XLSX | `docs/PRD.md`, conversación | Import y Export masivos quedan limitados a CSV/XLSX. |
| Q037 | respondida | crítica | permisos | ¿Cómo debe modelarse el sistema de roles y permisos? | Roles base + perfiles; Solo perfiles custom; Roles fijos | Roles base + perfiles | `docs/REFERENCE_MODULES.md` | Super Admin, Admin, Member, Guest |
| Q038 | respondida | crítica | permisos | ¿Qué alcance debe tener el Super Admin inicial? | Global + Tenant Zero; Solo global; Tenant normal | Global + Tenant Zero | `docs/BOOTSTRAP_REFERENCE.md` | Trazabilidad fundacional |
| Q039 | respondida | importante | auditoría | ¿Qué debe auditar el módulo de logs por defecto? | Seguridad y cambios; Solo seguridad; Todo evento | Seguridad y cambios | `docs/SECURITY_ASSURANCE.md` | Evitar ruido de todos los eventos |
| Q040 | respondida | importante | billing | ¿Qué debe incluir el framework como planes base? | Plantillas sin precios; Planes con precios; Sin planes base | Plantillas sin precios | `docs/REFERENCE_MODULES.md`, conversación | Precios por app derivada |
| Q041 | respondida | importante | billing | ¿Cómo se deben activar módulos y features? | Global, plan, tenant; Solo por plan; Solo global | Global, plan, tenant | `docs/PRD.md` | Feature gating flexible |
| Q042 | respondida | importante | custom-fields | ¿Dónde deben permitirse campos personalizados? | Módulos permitidos; Todos los módulos; Solo módulos negocio | Módulos permitidos | `docs/REFERENCE_MODULES.md` | Cada módulo declara soporte |
| Q043 | respondida | crítica | IA | ¿Cómo fijamos el modelo inicial de Core AI? | OpenRouter Gemma 4 free; Gemma estable; Por instalación | OpenRouter `google/gemma-4-26b-a4b-it:free` | conversación | ID exacto verificado antes de SPEC |
| Q044 | respondida | crítica | IA | ¿Qué política debe aplicar Core AI sobre datos enviados a modelos? | Redacción y opt-in; Solo opt-in; Libre por módulo | Redacción y opt-in | `docs/SECURITY_ASSURANCE.md` | Minimización de datos |
| Q045 | respondida | importante | IA | ¿Cómo deben aplicarse los límites de uso y costo de IA? | Tenant, usuario, feature; Solo tenant; Solo global | Tenant, usuario, feature | `docs/SECURITY_ASSURANCE.md` | Control granular de costo |
| Q046 | respondida | importante | testing | ¿Qué política de cobertura debe exigir el framework? | 80% crítico; 80% global; Sin porcentaje | 80% crítico | `docs/REFERENCE_STACK.md` | Evitar tests triviales |
| Q047 | respondida | importante | performance | ¿Cuándo deben bloquear los presupuestos de performance? | Release candidate; Desde primer corte; Solo venta | Release candidate | `docs/SCALABILITY_ASSURANCE.md` | En primer corte se miden |
| Q048 | respondida | importante | performance | ¿Dónde deben ejecutarse las pruebas de carga k6? | Staging dedicado; Local; Producción aprobada | Staging dedicado | recurso `k6` | No producción sin autorización |
| Q049 | respondida | crítica | stack | Según la documentación del proyecto, ¿cómo deben manejarse las versiones del stack inicial? | Estables fijadas; Rangos compatibles; Últimas siempre | Estables fijadas | `docs/REFERENCE_STACK.md` | Verificar oficiales antes de fijar |
| Q050 | respondida | importante | stack | ¿Qué gestor de paquetes debe usarse para el workspace JavaScript/TypeScript? | pnpm; npm; Yarn | npm | conversación | Elección libre sin conflicto documental; la documentación solo lista `package.json`, no fija gestor. Fuente: `docs/REFERENCE_STRUCTURE.md:98` |
| Q051 | decisión documentada asumida | importante | estructura | ¿Qué estructura debe usar el código del framework cuando se implemente? | Monorepo apps/packages; Next root + servicios; Repos separados | Ya está definido en la documentación | `docs/REFERENCE_STRUCTURE.md` | Usar estructura documentada |
| Q052 | respondida | crítica | datos | Aunque se trabaje en Supabase cloud, ¿cómo deben gobernarse los cambios de base de datos? | SQL versionado; Dashboard + export; Dashboard manual | SQL versionado | `docs/REFERENCE_STRUCTURE.md` | Migraciones versionadas |
| Q053 | respondida | importante | deploy | ¿Debe recomendarse un proveedor VPS específico para el despliegue Docker inicial? | Genérico Docker; Hostinger default; Sin proveedor | En principio Coolify, pero aplicable a Docker genérico | `docs/PRD.md`, conversación | Coolify como ruta principal |
| Q054 | respondida | importante | operación | ¿Cómo tratamos los MCP de Supabase y SonarQube en fases futuras? | Proponer no activar; Excluirlos; Preparar activación | Preparar y activar de una vez | conversación | No activado en este turno |
| Q055 | respondida | importante | notificaciones | ¿Qué canales de notificación debe soportar el framework por defecto? | In-app + email; Solo in-app; Multi-canal amplio | In-app por defecto; cualquier otro canal activado por tenant | `docs/REFERENCE_MODULES.md`, conversación | Email no default global |
| Q056 | respondida | importante | webhooks | ¿Qué alcance deben tener los webhooks del framework? | Entrantes y salientes; Solo salientes; Solo entrantes | Entrantes y salientes | `docs/REFERENCE_MODULES.md` | Firma, retries y auditoría |
| Q057 | respondida | importante | reglas | ¿Qué disparadores deben soportar las reglas automatizadas? | Datos, tiempo, webhooks; Solo datos; Datos y tiempo | Datos, tiempo, webhooks | `docs/REFERENCE_MODULES.md` | Cubre reglas principales |
| Q058 | respondida | importante | módulos | ¿Dónde debe vivir el módulo Task dentro del framework? | Módulo demo web; Módulo core; Paquete opcional | Respetar ubicación definida: módulo ejemplo de app final | `docs/REFERENCE_STRUCTURE.md` | `src/web/modules/task` |
| Q059 | respondida | importante | módulos | ¿Dónde deben vivir File, Tag, Bookmark y Filter? | Framework shared; Web app; Opcionales | Framework shared | `docs/REFERENCE_MODULES.md` | Transversales reutilizables |
| Q060 | respondida | importante | público | ¿Qué alcance deben tener las rutas públicas del framework? | Base mínima; Completas venta; Solo auth | Base mínima | `docs/REFERENCE_STRUCTURE.md` | Reemplazable por app derivada |
| Q061 | respondida | crítica | documentación | Cuando una respuesta contradiga un documento viejo, ¿qué debe mandar para la especificación futura? | Cuestionario manda; Corregir docs primero; Bloquear hasta alinear | Mostrar versión del cuestionario y versión documental para decidir individualmente | conversación | No resolver conflictos en silencio |
| Q062 | respondida | importante | operación | Sobre los MCP de Supabase y SonarQube, ¿cuándo se deben activar realmente? | Después del cuestionario; Durante Spec; No activar todavía | Después del cuestionario | conversación | Requiere acción separada |
| Q063 | respondida | crítica | IA | Para OpenRouter, ¿cómo registramos el modelo Gemma 4? | Verificar ID exacto; Usar nombre literal; Alias configurable | `google/gemma-4-26b-a4b-it:free` verificado | conversación, OpenRouter | Verificado en `https://openrouter.ai/google/gemma-4-26b-a4b-it%3Afree`; variante gratuita con contexto 262K. |
| Q064 | respondida | importante | billing | ¿Qué plantillas de plan debe traer el framework? | Free/Trial/Pro/Enterprise; Trial/Pro/Enterprise; Pro/Enterprise | Free, Trial, Pro, Enterprise | `docs/REFERENCE_MODULES.md` | Sin precios fijos |
| Q065 | respondida | importante | billing | ¿Qué plan debe asignarse a un tenant nuevo por defecto? | Trial; Free; Pro manual | Trial | `docs/PRD.md` | `subscription.default_plan_code = trial` |
| Q066 | corregida | importante | billing | Si vence un trial y no hay pago activo, ¿qué debe ocurrir por defecto? | Read-only; Degradar a Free; Suspender tenant | Degradar a Free (`degrade_to_free`) | `docs/PRD.md`, `docs/REFERENCE_MODULES.md` | `read_only_mode` es inalcanzable si existe plan `free` o freemium, porque `subscription.expiry_action` se ignora y siempre degrada a Free. Fuente: `docs/PRD.md:546`, `docs/REFERENCE_MODULES.md:361`, Q064 |
| Q067 | corregida | importante | import-export | ¿Dónde debe vivir la generación PDF? | PDF por registro individual; PDF en export masivo; Sin PDF inicial | PDF por registro individual desde UI | `docs/PRD.md`, conversación | El módulo Export masivo solo genera CSV/XLSX; PDF se conserva para registros individuales como invoice y statement. |
| Q068 | respondida | importante | seguridad | ¿Qué protección anti-abuso debe recomendar el framework para formularios sensibles? | Turnstile adapter; reCAPTCHA adapter; Sin default | reCAPTCHA adapter | `docs/REFERENCE_ARCHITECTURE.md`, conversación | Decisión alineada con los adapters de seguridad perimetral documentados. Fuente: `docs/REFERENCE_ARCHITECTURE.md:63` |
| Q069 | respondida | importante | storage | ¿Qué default debe tener la optimización de imágenes subidas? | Activable off; On default; Sin optimización | Activable, off default | `docs/PRD.md` | WebP disponible por setting |
| Q070 | respondida | importante | i18n | ¿Cuál debe ser el idioma default del framework al iniciar? | Español; Inglés; Elegir en setup | Español | `docs/PRD.md` | `es` source of truth |
| Q071 | respondida | importante | configuración | ¿Qué zona horaria default debe usar el framework? | UTC; America/Guatemala; Elegir en setup | UTC | `docs/PRD.md` | Cada tenant puede ajustar |
| Q072 | respondida | importante | billing | ¿Qué moneda default debe usar billing en las plantillas base? | USD; Local por tenant; Elegir en setup | USD | `docs/STRATEGY.md` | Precios finales por app |
| Q073 | respondida | crítica | seguridad | ¿Cómo debe aplicarse MFA por defecto? | Super Admin obligatorio; Opcional todos; Obligatorio todos | Configurable para todos | `docs/BOOTSTRAP_REFERENCE.md`, conversación | Decisión alineada con `mfa_policy: optional`; no es excepción de seguridad. Fuente: `docs/BOOTSTRAP_REFERENCE.md:78`, `docs/BOOTSTRAP_REFERENCE.md:138` |
| Q074 | respondida | crítica | seguridad | ¿Qué expiración deben tener las API keys por defecto? | Expiran por defecto; Expiración opcional; Nunca expiran | Expiración opcional | `docs/SECURITY_ASSURANCE.md`, conversación | Compatible con la documentación: se exige soportar expiración, pero `expires_at` puede ser nulo. Fuente: `docs/SECURITY_ASSURANCE.md:45`, `docs/REFERENCE_MODULES.md:1161` |
| Q075 | respondida | crítica | seguridad | ¿Cómo deben gestionarse secretos en despliegue Docker/Coolify? | Panel/env store; Archivos `.env` manuales; Vault externo | Panel/env store | instrucciones globales, conversación | Repo mantiene solo `.env.example` |
| Q076 | respondida | crítica | seguridad | ¿Confirmas que ningún perfil, incluido Super Admin, debe tener MFA obligatorio por defecto? | Super Admin obligatorio; Configurable todos; Política global | Configurable todos | conversación | Decisión alineada con `mfa_policy: optional`; no es excepción de seguridad. Fuente: `docs/BOOTSTRAP_REFERENCE.md:78`, `docs/BOOTSTRAP_REFERENCE.md:138` |
| Q077 | respondida | crítica | seguridad | ¿Confirmas que las API keys pueden crearse sin expiración obligatoria? | Expiran por defecto; Expiración opcional; Solo Super Admin | Expiración opcional | conversación | Compatible documentalmente; queda como buena práctica recomendar expiración aunque no sea obligatoria. Fuente: `docs/SECURITY_ASSURANCE.md:45`, `docs/REFERENCE_MODULES.md:1161` |
| Q078 | respondida | crítica | cierre | ¿Cómo dejamos el cuestionario FromZero en este punto? | Completo para registrar; Corregir respuestas; Más preguntas | Completo para registrar | conversación | Registrar para revisión y esperar aprobación |

## Conflictos y excepciones explícitas

| ID | Tema | Versión de la documentación | Versión del cuestionario | Tratamiento |
|---|---|---|---|---|
| C001 | Versión | Documentos mencionaban versión antigua | Proyecto actual manda como v7.4 | Alineado en `docs/` a 7.4.0 |
| C002 | Estructura producto/tooling | La estructura mezclaba framework con directorios meta del entorno | Solo el framework entregable pertenece al árbol de producto | Alineado en `docs/REFERENCE_STRUCTURE.md`; tooling IA y `artifacts/` quedan fuera del árbol |
| C003 | Multi-tenant users | `allow_multi_tenant_users: true` aparecía como default en bootstrap | Default decidido: `allow_multi_tenant_users: false` | Alineado en `docs/BOOTSTRAP_REFERENCE.md`; corrección de contradicción interna con `docs/PRD.md:221` |
| C004 | Tenant activo | La documentación exige contexto seguro, aislamiento RLS y validación de acceso, pero no fija el mecanismo de selección de tenant | Usuario eligió selección UI por nombre | Decisión de diseño con mitigación: el backend emite el contexto seguro y valida membresía, RBAC y RLS; la UI solo expresa preferencia. Fuente: `docs/PRD.md:246-248`, `docs/PRD.md:330-334`, `docs/SECURITY_ASSURANCE.md:56`, `docs/SECURITY_ASSURANCE.md:101` |
| C005 | Observabilidad | Docs mencionan Sentry/PostHog | Framework solo provee opciones, no activas | Activación por app derivada |
| C006 | MCP | Recursos indican no activar sin aprobación | Usuario autorizó preparar/activar después del cuestionario | Requiere acción separada; no ejecutado aquí |
| C007 | PDF export | PDF aparecía mezclado con export masivo | PDF se conserva como exportación de registro individual | Alineado en `docs/PRD.md` y `docs/REFERENCE_MODULES.md`; Export masivo queda CSV/XLSX |
| C008 | Captcha | `REFERENCE_ARCHITECTURE` lista Turnstile y reCAPTCHA v3 como adapters de seguridad perimetral | Usuario eligió reCAPTCHA adapter | Decisión alineada con adapters documentados. Fuente: `docs/REFERENCE_ARCHITECTURE.md:63` |
| C009 | MFA | `mfa_policy` default `optional` | Usuario eligió configurable para todos | Decisión alineada con bootstrap; no es excepción de seguridad. Fuente: `docs/BOOTSTRAP_REFERENCE.md:78`, `docs/BOOTSTRAP_REFERENCE.md:138` |
| C010 | API keys | Seguridad exige soportar expiración; Modules permite `expires_at` nulo | Usuario eligió expiración opcional | Alineado en docs: soportar expiración es obligatorio; aplicarla es opcional y la UI la recomienda por defecto |
| C011 | OpenRouter Gemma 4 | Identificador no verificado en documentación local | Usar OpenRouter/Gemma 4 como intención | Verificado como `google/gemma-4-26b-a4b-it:free` en `https://openrouter.ai/google/gemma-4-26b-a4b-it%3Afree` |
| C012 | Formatos Import/Export | Import/Export tenían formatos inconsistentes | Import y Export masivos solo CSV/XLSX | Alineado en `docs/PRD.md` y `docs/REFERENCE_MODULES.md`; PDF queda por registro individual desde UI |

## Resumen validado para Spec

- Resumen validado por el usuario: si
- Correcciones integradas: ruta v7.4, UI FromZero, Supabase cloud, providers por adapter, Coolify/Docker, conflict resolution caso por caso, trial `degrade_to_free`, Import/Export CSV/XLSX, PDF por registro individual, MFA alineado, API key expiración opcional compatible, OpenRouter free verificado
- Decisiones críticas cerradas: ruta, versión, alcance, UI, tenancy, auth, datos, proveedores, deploy, permisos, seguridad, billing, IA, QA, operación
- Decisiones diferidas aprobadas: activar MCP después del cuestionario en acción separada
- Supuestos que pasan a Spec: decisiones efectivas D001-D071, conflictos C001-C012 y correcciones integradas del cuestionario aprobado
- Frase literal de aprobación o revisión: Apruebo el cuestionario.

## Revisión y aprobación

- Revisado por el usuario: si
- Cambios solicitados: pendiente
- Aprobado para crear `artifacts/FROMZERO_SPEC.md`: si
- Fecha de aprobación: 2026-06-18
- Frase literal de aprobación: Apruebo el cuestionario.

## Registro de cambios

| Fecha | Cambio | Autor |
|---|---|---|
| 2026-06-18 | Registro del cuestionario respondido para revisión | Codex |
| 2026-06-18 | Correcciones de coherencia documental solicitadas por el usuario | Codex |
| 2026-06-18 | Aprobación explícita del cuestionario por el usuario | Usuario |
| 2026-06-18 | Alineación documental pre-SPEC: estructura, formatos, OpenRouter free, KPIs y accesibilidad | Codex |
