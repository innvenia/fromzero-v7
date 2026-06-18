# FROMZERO_CONTEXT

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | FROMZERO_CONTEXT |
| Propósito o subtítulo | Contexto crítico del proyecto y cobertura inicial del insumo |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | listo para revisión |
| Historial de estados | 2026-06-18: creado desde documentación local en `docs/` |
| Aprobación del usuario | pendiente |
| Fecha de aprobación | pendiente |
| Frase literal de aprobación | pendiente |
| Artefactos prerequisito | Documentación del usuario en `docs/`, `artifacts/START_HERE.md`, plugin FromZero local |
| Documentos o fuentes asociadas | `docs/PRD.md`, `docs/REFERENCE_MODULES.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_STRUCTURE.md`, `docs/REFERENCE_STACK.md`, `docs/SECURITY_ASSURANCE.md`, `docs/SCALABILITY_ASSURANCE.md`, `docs/DEPENDENCY_MATRIX.md`, `docs/BOOTSTRAP_REFERENCE.md`, resto de `docs/`, recursos locales FromZero seleccionados |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_QUESTIONNAIRE.md`, `artifacts/FROMZERO_SPEC.md` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se ejecutó código de aplicación. No se conectaron servicios externos. |

## Estado del contexto

- Escenario de entrada: idea documentada.
- Ruta de construcción: framework nuevo.
- Decisión de UI: framework, pendiente de confirmar si la UI base se toma de la referencia FromZero local o solo como guía.
- Estado Git: repositorio inicializado en `main`, estado limpio antes de crear este artefacto, commit base `2d10842`.
- Estado de fase: Context creado; Spec, Plan, Build y State no habilitados.
- Bloqueo metodológico: requiere Q&A real y aprobación antes de especificar.

## Fuentes del insumo

| Fuente | Prioridad | Tipo | Estado de lectura | Que cubre | Limitación |
|---|---:|---|---|---|---|
| `docs/PRD.md` | 1 | PRD | leída por secciones, headings y extracción dirigida | Visión, alcance obligatorio, módulos, criterios no negociables, arquitectura funcional | Archivo extenso; requiere Q&A antes de convertir en Spec |
| `docs/REFERENCE_MODULES.md` | 2 | módulos | leída por secciones, tablas y extracción dirigida | 27 módulos visibles, flujos, permisos, tablas asociadas, dependencias | Contiene `record-relationship` como B11.1 y debe clasificarse |
| `docs/REFERENCE_DATABASE_SCHEMA.md` | 3 | datos | leída | 38 tablas, convenciones, RLS, metadata transversal, consentimientos | Falta DDL definitivo ejecutable |
| `docs/REFERENCE_ARCHITECTURE.md` | 4 | arquitectura | leída | Next.js, Supabase, Core AI, límites internos, API, eventos, performance | Algunas decisiones de proveedores quedan abiertas |
| `docs/REFERENCE_STRUCTURE.md` | 5 | estructura | leída | Estructura objetivo, carpetas, módulos, artefactos, naming | Menciona `.agent/` y `_reference/`; el repo real usa `.codex/` y `artifacts/` |
| `docs/REFERENCE_STACK.md` | 6 | stack | leída | Stack web, datos, IA, jobs, testing, calidad, despliegue | Versiones exactas deben verificarse antes de implementar |
| `docs/SECURITY_ASSURANCE.md` | 7 | seguridad | leída | OWASP, ASVS, STRIDE, RLS, RBAC, secretos, webhooks, SSRF, rate limiting | Requiere mapa final de amenazas por módulo |
| `docs/SCALABILITY_ASSURANCE.md` | 8 | escalabilidad | leída | Cache, async, queries, load tests, límites, budgets | Redis y colas quedan como decisión de primer corte |
| `docs/DEPENDENCY_MATRIX.md` | 9 | dependencias | leída | Fases, gates, módulos bloqueantes, orden de construcción | Usa "recomendable" para partes que el PRD trata como obligatorias |
| `docs/BOOTSTRAP_REFERENCE.md` | 10 | bootstrap | leída | `bootstrap.json`, Tenant Zero, Super Admin, defaults, `.env.example` | Falta cerrar valores iniciales reales |
| `docs/README.md` | 11 | índice | leída | Índice documental, propósito de los documentos | Sin limitación crítica |
| `docs/DOCUMENT_INVENTORY.md` | 12 | inventario | leída | Estado y función de cada documento | Debe actualizarse si se corrigen contradicciones |
| `docs/REFERENCE_DESIGN_SYSTEM.md` | 13 | diseño | leída | Contrato visual mínimo, tokens, accesibilidad | Menos detallado que la referencia UI local FromZero |
| `docs/REFERENCE_THREAT_MODEL.md` | 14 | amenazas | leída | Amenazas, controles, riesgos residuales | Debe cruzarse con módulos al especificar |
| `docs/STRATEGY.md` | 15 | estrategia | leída | Mercado, producto, modelo comercial, anti-persona, posicionamiento | Falta licencia legal concreta y free tier definitivo |
| `.codex/plugins/fromzero/library/manifest.json` | 16 | metodología | leída | Recursos disponibles y versión local | No instala recursos externos |
| `.codex/plugins/fromzero/library/categories.json` | 17 | metodología | leída | Categorías de recursos | Sin limitación crítica |
| `.codex/plugins/fromzero/library/registry-index.json` | 18 | metodología | leída | Índice de recursos | Sin limitación crítica |
| `resource-resolver.mjs --project . --docs docs` | 19 | resolver | ejecutado | Recursos aplicables, env vars, secretos externos, archivos escaneados | No se ejecutó `--install` |
| Recursos locales FromZero seleccionados | 20 | referencia | leídos | Supabase, Redis, SonarQube, Expo, Hostinger, Stripe, Inngest, Playwright, k6, UI template, stack router, backend, datos, auth, pagos, cloud, IA, calidad, MCP | Solo referencia; no se activaron servicios |

## Entendimiento inicial del proyecto

- Problema que el proyecto intenta resolver: crear un framework base reutilizable para construir aplicaciones SaaS o corporativas multi-tenant sin rehacer módulos empresariales comunes desde cero.
- Resultado esperado por el usuario: una base vendible, extensible y segura, con módulos core, arquitectura, datos, UI, seguridad, escalabilidad, bootstrap, calidad y documentación coherentes.
- Usuario objetivo: desarrolladores, equipos de producto, agencias y emprendedores técnicos que necesitan una base controlable y extensible.
- Usuario no objetivo: usuarios que buscan no-code visual, landing simple, blog simple o una app sin control de infraestructura/código.
- Casos de uso excluidos: producto final vertical único, template de marketing aislado, SaaS sin multi-tenancy, implementación sin RLS, implementación sin pruebas ni gates.
- Restricciones o prioridades explícitas: todo código en inglés, documentación en español, no secretos reales, RLS obligatorio, RBAC server-side, APIs versionadas, pruebas y gates antes de release.
- Supuestos del agente que deben validarse: el alcance final sigue siendo todo lo documentado; el primer corte técnico puede secuenciar módulos sin reducir el producto vendible; la UI local FromZero se puede usar como referencia operativa; `record-relationship` es subsistema transversal y no módulo visible independiente.

## Usuarios objetivo y no objetivo

| Tipo | Descripción | Fuente | Impacto en alcance |
|---|---|---|---|
| Usuario objetivo | Desarrolladores y equipos que necesitan acelerar SaaS/corporate con código propio | `docs/STRATEGY.md`, `docs/PRD.md` | Requiere arquitectura clara, DX, módulos reutilizables y contratos extensibles |
| Usuario objetivo | Agencias y equipos producto que reutilizan una base en varios proyectos | `docs/STRATEGY.md` | Requiere licenciamiento, bootstrap, branding y documentación de adaptación |
| Usuario objetivo | Emprendedores técnicos que quieren una base robusta | `docs/STRATEGY.md` | Requiere setup guiado, valores por defecto seguros y stack no excesivamente frágil |
| Usuario no objetivo | Usuarios no-code o sin intención de operar código | `docs/STRATEGY.md` | No justificar builders visuales o abstracciones no-code |
| Usuario no objetivo | Proyectos simples de contenido o landing | `docs/STRATEGY.md` | Evitar sobredimensionar marketing sites |
| Usuario no objetivo | Equipos sin control de infraestructura ni seguridad | `docs/STRATEGY.md`, seguridad | Mantener requisitos de RLS, secretos, despliegue y observabilidad |

## Supuestos del agente

| Supuesto | Fuente o inferencia | Riesgo si es falso | Tratamiento |
|---|---|---|---|
| El proyecto es el framework From Zero, no una app derivada | Documentación y nombre de producto | Spec equivocada hacia app final | Confirmar en Q&A |
| El alcance documentado es obligatorio para producto vendible | PRD y criterios no negociables | Reducir indebidamente módulos o garantías | Preguntar por primer corte técnico, no por eliminar alcance |
| Se puede secuenciar entrega sin reducir alcance final | Dependency Matrix | Confundir "recomendable" con "fuera de alcance" | Cerrar semántica de fases |
| La UI FromZero local puede servir como referencia de calidad | Recursos locales y docs UI | Copiar deuda o marcas no deseadas | Decidir uso: base, referencia o diferida |
| Supabase es dependencia base, no opcional | Stack, arquitectura, seguridad, datos | Diseñar persistencia incompatible | Confirmar modo cloud/local |
| Stripe es candidato default, no necesariamente proveedor cerrado | Stack y recursos | Acoplar billing antes de decisión comercial | Decidir proveedor inicial |
| Redis/BullMQ son opcionales hasta cierto volumen | Stack y escalabilidad | Subestimar multi-instancia o jobs | Decidir primer corte y fallback |
| Core AI es parte constitutiva del framework | PRD y arquitectura | Dejar IA como integración secundaria | Cerrar proveedor/modelos y límites |
| El repo puede divergir de estructuras `.agent/` documentadas | Estado real del proyecto | Crear estructura obsoleta | Decidir adaptación a `.codex/` |

## Confirmación de contexto

| Aplica confirmación humana de Context | Razón | Frase o acción requerida |
|---|---|---|
| no | Hay decisiones críticas para Q&A antes de Spec. | Activar modo plan y responder cuestionario FromZero. |

## Análisis crítico del insumo

### Gaps y omisiones detectados

| # | Gap | Impacto | Tratamiento |
|---|---|---|---|
| 1 | Versión documental 7.0.0 frente a carpeta `fw_v7.4` | Puede cambiar alcance, compatibilidad o roadmap | Confirmar versión objetivo antes de Spec |
| 2 | No hay licencia source-available legal concreta | Riesgo comercial y de distribución | Decidir licencia y límites de uso |
| 3 | Free tier mencionado como futuro, sin límites | Riesgo de promesa comercial ambigua | Definir o marcar posterior explícito |
| 4 | Proveedor de email transaccional no cerrado | Afecta invitaciones, notificaciones, auth y costos | Decidir proveedor o adapter |
| 5 | Proveedor LLM y política de modelos no cerrados | Afecta Core AI, costos, privacidad y rate limits | Decidir provider inicial y fallback |
| 6 | Proveedor de pagos no cerrado aunque Stripe aparece | Afecta billing, webhooks, impuestos y pruebas | Decidir default o adapter abstracto |
| 7 | Hosting objetivo no cerrado | Afecta Docker, edge/runtime, jobs, storage y CI | Decidir target inicial |
| 8 | Supabase local vs cloud no cerrado | Afecta migraciones, pruebas y onboarding | Decidir entorno inicial |
| 9 | Redis/BullMQ opcional sin criterio de activación | Afecta colas, cache y operación multi-instancia | Definir para primer corte |
| 10 | Observabilidad concreta no cerrada | Afecta errores, auditoría técnica y producto vendible | Decidir Sentry/PostHog u otros |
| 11 | API inventory obligatorio pero no inventariado por endpoint | Bloquea especificación verificable | Crear inventario en Spec después del Q&A |
| 12 | DDL ejecutable no existe aún | Bloquea implementación de base | Generar en fase Spec/Plan, no ahora |
| 13 | Políticas reales de retención y privacidad pendientes | Riesgo legal y operativo | Decidir mínimos para Tenant Zero |
| 14 | Criterios de insuficiencia de Supabase Auth no definidos | Riesgo de sobreconstruir auth/session | Definir cuándo extender auth nativo |
| 15 | No hay mapa de permisos por acción para todos los módulos | Riesgo de RBAC incompleto | Exigir matriz en Spec |
| 16 | No hay valores concretos de bootstrap inicial | Bloquea seed reproducible | Decidir app mode, tenant, admin, planes |
| 17 | No hay estrategia concreta de migración/upgrade para clientes | Riesgo comercial post-venta | Decidir política de updates |
| 18 | No hay criterio de datos demo vs datos reales | Riesgo de violar regla "datos reales" | Definir fixtures permitidos |
| 19 | No hay entorno CI concreto | Afecta gates y automatización | Decidir GitHub Actions u otro |
| 20 | No hay definición de paquete vendible | Afecta estructura, licenciamiento y entrega | Decidir formato de distribución |

### Contradicciones y supuestos sin validar

| # | Item | Impacto | Tratamiento |
|---|---|---|---|
| 1 | `fw_v7.4` vs documentos versión 7.0.0 | Puede invalidar priorización | Confirmar versión documental canónica |
| 2 | PRD dice alcance obligatorio; Dependency Matrix marca partes como "recomendable" | Puede reducir indebidamente MVP | Definir si "recomendable" significa orden, no alcance |
| 3 | 27 módulos visibles vs `record-relationship` como B11.1 en matrices | Conteo y navegación pueden quedar inconsistentes | Decidir módulo visible, subsistema o tabla soporte |
| 4 | Estructura objetivo usa `.agent/`; repo real usa `.codex/` | Riesgo de scaffolding incompatible | Adaptar estructura o corregir docs |
| 5 | Stack pide validar versiones; referencia UI local menciona versiones actuales | Riesgo de fijar versiones no verificadas | Verificar fuentes oficiales al implementar |
| 6 | UI shadcn/Tailwind v4 en docs; UI template FromZero aporta primitivas propias | Riesgo de duplicar sistemas UI | Decidir relación entre ambos |
| 7 | Supabase Auth como base; custom claims y server-side RBAC obligatorios | Riesgo de mezclar control de sesión | Definir límite entre auth nativo y autorización propia |
| 8 | Redis opcional; escalabilidad multi-instancia sugiere cache/colas | Riesgo de arquitectura no escalable | Decidir criterio por fase |
| 9 | Core AI es constitutivo; proveedor/modelos abiertos | Riesgo de especificación incompleta | Cerrar decisión de IA |
| 10 | Source-available comercial; no hay términos legales | Riesgo de uso no autorizado o ambiguo | Decidir licencia antes de venta |

### Oportunidades de mejora antes de especificar

| # | Oportunidad | Beneficio esperado | Decisión requerida |
|---|---|---|---|
| 1 | Crear matriz de decisiones canónicas fase 0 | Evita contradicciones entre documentos | Aprobar Q&A y registrar decisiones |
| 2 | Separar alcance final, alcance vendible y primer corte técnico | Evita falsas reducciones de MVP | Definir nombres y gates |
| 3 | Normalizar clasificación de módulos y subsistemas | Mejora navegación, permisos y schema | Resolver `record-relationship` |
| 4 | Fijar proveedores iniciales o adapters explícitos | Reduce ambigüedad de implementación | Pagos, email, IA, hosting, observabilidad |
| 5 | Alinear estructura documental con Codex/local plugin | Evita carpetas obsoletas | Actualizar docs después de aprobación |
| 6 | Definir política de versiones del stack | Mejora reproducibilidad | Estables fijadas, rangos o latest |
| 7 | Definir estrategia de migraciones Supabase | Mejora trazabilidad y seguridad | Cloud, local+cloud, SQL versionado |
| 8 | Definir matriz RBAC por módulo antes de código | Reduce riesgos de autorización | Aprobar formato y granularidad |
| 9 | Definir mapa de endpoints versionados | Habilita tests y contratos | Aprobar inventario API |
| 10 | Definir paquete comercial entregable | Alinea producto, docs y licencia | ZIP, repo privado, plantilla, instalador |

## Mejoras a la documentación inicial

| # | Mejora propuesta | Estado |
|---|---|---|
| 1 | Alinear número de versión en todos los documentos | propuesta |
| 2 | Aclarar que "recomendable" en matriz no reduce alcance obligatorio | propuesta |
| 3 | Clasificar `record-relationship` como módulo visible o subsistema soporte | propuesta |
| 4 | Reemplazar referencias `.agent/` por estructura local actual o documentar equivalencia | propuesta |
| 5 | Añadir matriz de proveedores iniciales y adapters | propuesta |
| 6 | Añadir política de versiones del stack y verificación oficial | propuesta |
| 7 | Añadir inventario API `/api/v1/*` por módulo | propuesta |
| 8 | Añadir matriz RBAC acción-permiso por módulo | propuesta |
| 9 | Añadir licencia source-available concreta | propuesta |
| 10 | Añadir política de retención, eliminación y consentimiento | propuesta |
| 11 | Añadir decisión de Supabase local/cloud y migraciones | propuesta |
| 12 | Añadir definición de primer corte técnico vs producto vendible | propuesta |

## Validación crítica

- Problema real: hay una necesidad razonable de una base empresarial repetible, pero el valor depende de que la base sea operable, vendible y no solo una lista amplia de módulos.
- Usuario objetivo: está bien definido para usuarios técnicos o equipos con control de código; no sirve para no-code o proyectos simples.
- Mercado y alternativas: compite contra boilerplates SaaS, templates Next.js/Supabase, starters comerciales y frameworks internos; debe diferenciarse por multi-tenancy, módulos empresariales, seguridad, documentación y bootstrap.
- Diferenciación: la combinación de módulos core, seguridad por diseño, Core AI interno, reglas, import/export, billing y Tenant Zero es fuerte si se entrega con calidad verificable.
- Riesgos de producto: alcance amplio, posible sobrepromesa comercial, falta de licencia concreta y free tier ambiguo.
- Riesgos de tecnología: acoplamiento a Supabase, decisiones abiertas de proveedores, potencial duplicidad UI, jobs/cache opcionales sin frontera clara.
- Riesgos de seguridad: multi-tenant mal aplicado, service role fuera de backend, RLS incompleta, webhooks sin firma, SSRF en integraciones, secretos mal gestionados.
- Riesgos de operación: falta de target de hosting, observabilidad, CI, migraciones y carga real.
- Comercialización: el modelo source-available con updates anuales es viable, pero necesita licencia, packaging, soporte y promesas medibles.

## Inventario de capacidades del insumo

| Capacidad | Tipo | Fuente | Prioridad | Obligación | Observación |
|---|---|---|---:|---|---|
| Settings | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Configuración global/tenant |
| Module | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Registro y control de módulos |
| Plan | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Planes comerciales y límites |
| AI Model | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Catálogo de modelos IA |
| Log | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Auditoría técnica y negocio |
| Profile | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Perfiles/roles |
| Tenant | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Cuentas/empresas/workspaces |
| User | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Usuarios y membresías |
| Invitation | módulo | `REFERENCE_MODULES.md` | 1 | primer corte | Invitaciones y onboarding |
| Notification | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Notificaciones internas/externas |
| Rule | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Reglas/eventos automatizados |
| Custom Field | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Extensión dinámica de módulos |
| Email Template | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Plantillas transaccionales |
| API Key | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Integración externa segura |
| Integration | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Conectores externos |
| Webhook | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Eventos salientes/entrantes |
| Document | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Documentos versionados |
| Import | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Ingesta controlada |
| Export | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Extracción controlada |
| Subscription | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Suscripciones |
| Statement | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Estados de cuenta |
| Invoice | módulo | `REFERENCE_MODULES.md` | 2 | release candidate | Facturación |
| File | módulo | `REFERENCE_MODULES.md` | 3 | release candidate | Storage y archivos |
| Tag | módulo | `REFERENCE_MODULES.md` | 3 | release candidate | Etiquetado transversal |
| Bookmark | módulo | `REFERENCE_MODULES.md` | 3 | release candidate | Favoritos |
| Filter | módulo | `REFERENCE_MODULES.md` | 3 | release candidate | Vistas guardadas |
| Task | módulo | `REFERENCE_MODULES.md` | 3 | release candidate | Tareas transversales |
| Record Relationship | transversal | `REFERENCE_MODULES.md`, `DEPENDENCY_MATRIX.md` | 2 | ambiguo | Clasificación pendiente |
| Supabase PostgreSQL/Auth/Storage/RLS | datos/seguridad | stack, arquitectura, recursos | 1 | primer corte | Dependencia base |
| Core AI Python | servicio interno | PRD, arquitectura, stack | 2 | release candidate | Proveedor/modelos pendientes |
| Module Factory | transversal | PRD, arquitectura | 1 | primer corte | Convenciones por módulo |
| Grid Universal | UI/transversal | PRD, UI docs | 2 | release candidate | Requiere decisión UI |
| Bootstrap Tenant Zero | configuración | `BOOTSTRAP_REFERENCE.md` | 1 | primer corte | Un solo uso |
| RBAC server-side | seguridad | seguridad, arquitectura | 1 | primer corte | No confiar solo en UI |
| RLS por tabla tenant-aware | seguridad/datos | schema, seguridad | 1 | primer corte | Bloqueante |
| API `/api/v1/*` | API | arquitectura | 1 | primer corte | Inventario pendiente |
| Event bus/Inngest | job | stack, recursos | 2 | release candidate | Decisión de activación |
| Redis/BullMQ | escalabilidad | stack, recursos | 3 | ambiguo | Opcional con fallback |
| Playwright | testing | recursos, stack | 2 | release candidate | E2E visual/responsivo |
| k6 | testing/performance | recursos, escalabilidad | 2 | release candidate | Carga de flujos críticos |
| SonarQube/SonarCloud | calidad | recursos, stack | 2 | release candidate | Gate de calidad |
| i18n con `next-intl` | i18n | stack, PRD | 2 | release candidate | Idiomas a definir |
| Accesibilidad WCAG 2.2 AA | accesibilidad | UI docs, recursos | 2 | release candidate | Gate visual |
| Observabilidad | observabilidad | stack, estrategia | 3 | ambiguo | Herramientas pendientes |

## Inventario atomico de requisitos

| ID | Fuente | Heading/Subheading | Requisito atomico | Dominio | Obligación | Estado | Observación |
|---|---|---|---|---|---|---|---|
| REQ-001 | `PRD.md` | Propósito | El producto debe ser un framework base reutilizable, no una app vertical única. | producto | primer corte | detectado | Confirmar ruta |
| REQ-002 | `PRD.md` | Alcance | El alcance documentado debe considerarse base del producto vendible. | producto | venta | detectado | Aclarar primer corte |
| REQ-003 | `STRATEGY.md` | Anti-persona | El producto no debe orientarse a usuarios no-code. | producto | venta | detectado | Evita builder visual |
| REQ-004 | `REFERENCE_STACK.md` | Frontend | Usar Next.js App Router como base web. | frontend-web | primer corte | detectado | Versiones pendientes |
| REQ-005 | `REFERENCE_STACK.md` | Frontend | Usar TypeScript strict. | frontend-web | primer corte | detectado | Gate de calidad |
| REQ-006 | `REFERENCE_STACK.md` | Styling | Usar Tailwind CSS v4 según documentación. | theme-branding | primer corte | detectado | Versiones por verificar |
| REQ-007 | `REFERENCE_STACK.md` | UI | Usar shadcn/ui o primitivas compatibles según decisión UI. | ui-primitives-overlays | primer corte | ambiguo | Relación con UI FromZero pendiente |
| REQ-008 | `REFERENCE_DESIGN_SYSTEM.md` | Diseño | Definir tokens visuales centralizados. | theme-branding | primer corte | detectado | No hardcodear colores |
| REQ-009 | recurso `fromzero-ui-template` | UI | Usar componentes base Button, Badge, Card, PageHeader, Field, Table, Modal y Drawer si se adopta la UI local. | ui-primitives-overlays | primer corte | ambiguo | Requiere aprobación |
| REQ-010 | recurso `fromzero-ui-template` | UI | Evitar copiar deuda migrada basada en `window.*`, `location.hash` y globals. | ui-primitives-overlays | primer corte | detectado | Gate de implementación |
| REQ-011 | `REFERENCE_STACK.md` | Backend | Usar Supabase PostgreSQL como base principal. | databases | primer corte | detectado | Dependencia base |
| REQ-012 | `REFERENCE_DATABASE_SCHEMA.md` | RLS | Toda tabla tenant-aware debe tener RLS. | seguridad | primer corte | detectado | Bloqueante |
| REQ-013 | `SECURITY_ASSURANCE.md` | Tenant | `tenant_id` debe venir de contexto seguro, no de headers editables. | auth-session | primer corte | detectado | JWT/custom claim |
| REQ-014 | `SECURITY_ASSURANCE.md` | Auth | RBAC debe validarse del lado servidor. | auth-session | primer corte | detectado | UI no autoriza |
| REQ-015 | `SECURITY_ASSURANCE.md` | Secrets | No versionar secretos ni leer `.env` reales. | seguridad | primer corte | detectado | Usar `.env.example` |
| REQ-016 | `BOOTSTRAP_REFERENCE.md` | Bootstrap | `bootstrap.json` debe ejecutarse una sola vez. | bootstrap-order | primer corte | detectado | Tenant Zero |
| REQ-017 | `BOOTSTRAP_REFERENCE.md` | Bootstrap | Crear Tenant Zero inicial desde configuración controlada. | configuración | primer corte | detectado | Valores pendientes |
| REQ-018 | `BOOTSTRAP_REFERENCE.md` | Bootstrap | Crear Super Admin inicial. | configuración | primer corte | detectado | Email pendiente |
| REQ-019 | `BOOTSTRAP_REFERENCE.md` | Bootstrap | Definir `app.mode` como `saas` o `corporate`. | configuración | primer corte | ambiguo | Decisión crítica |
| REQ-020 | `BOOTSTRAP_REFERENCE.md` | Bootstrap | Definir `licensing_model` como `per_tenant` o `per_user`. | configuración | venta | ambiguo | Decisión crítica |
| REQ-021 | `REFERENCE_MODULES.md` | Settings | Implementar configuración global y por tenant. | módulo | primer corte | detectado | Módulo A |
| REQ-022 | `REFERENCE_MODULES.md` | Module | Registrar módulos y su disponibilidad. | módulo | primer corte | detectado | Módulo A |
| REQ-023 | `REFERENCE_MODULES.md` | Plan | Modelar planes, límites y features. | billing-subscriptions | primer corte | detectado | Módulo A |
| REQ-024 | `REFERENCE_MODULES.md` | AI Model | Modelar modelos IA disponibles. | módulo | release candidate | detectado | Provider pendiente |
| REQ-025 | `REFERENCE_MODULES.md` | Log | Registrar eventos/auditoría. | seguridad | primer corte | detectado | No exponer secretos |
| REQ-026 | `REFERENCE_MODULES.md` | Profile | Definir perfiles/roles y permisos. | auth-session | primer corte | detectado | Matriz pendiente |
| REQ-027 | `REFERENCE_MODULES.md` | Tenant | Gestionar tenants con aislamiento. | módulo | primer corte | detectado | RLS obligatorio |
| REQ-028 | `REFERENCE_MODULES.md` | User | Gestionar usuarios y membresías. | auth-session | primer corte | detectado | Multi-tenant users pendiente |
| REQ-029 | `REFERENCE_MODULES.md` | Invitation | Soportar invitaciones seguras. | auth-session | release candidate | detectado | Email provider pendiente |
| REQ-030 | `REFERENCE_MODULES.md` | Notification | Soportar notificaciones por eventos. | notifications | release candidate | detectado | Canales pendientes |
| REQ-031 | `REFERENCE_MODULES.md` | Rule | Permitir reglas automatizadas por eventos. | event-bus-rules | release candidate | detectado | Inngest/event bus |
| REQ-032 | `REFERENCE_MODULES.md` | Custom Field | Permitir campos personalizados por módulo. | custom-fields | release candidate | detectado | Validación dinámica |
| REQ-033 | `REFERENCE_MODULES.md` | Email Template | Gestionar plantillas de email. | notifications | release candidate | detectado | Provider pendiente |
| REQ-034 | `REFERENCE_MODULES.md` | API Key | Crear y revocar API keys. | api-errors-security | release candidate | detectado | Hash y scopes |
| REQ-035 | `REFERENCE_MODULES.md` | Integration | Registrar integraciones externas. | api-errors-security | release candidate | detectado | SSRF guard |
| REQ-036 | `REFERENCE_MODULES.md` | Webhook | Firmar y validar webhooks. | api-errors-security | release candidate | detectado | HMAC |
| REQ-037 | `REFERENCE_MODULES.md` | Document | Versionar documentos. | storage-files | release candidate | detectado | Storage/RLS |
| REQ-038 | `REFERENCE_MODULES.md` | Import | Validar importaciones antes de persistir. | import-export | release candidate | detectado | No mass assignment |
| REQ-039 | `REFERENCE_MODULES.md` | Export | Controlar exportaciones por permisos. | import-export | release candidate | detectado | Auditoría |
| REQ-040 | `REFERENCE_MODULES.md` | Subscription | Gestionar suscripciones. | billing-subscriptions | release candidate | detectado | Provider pendiente |
| REQ-041 | `REFERENCE_MODULES.md` | Statement | Generar estados de cuenta. | billing-subscriptions | release candidate | detectado | Billing |
| REQ-042 | `REFERENCE_MODULES.md` | Invoice | Gestionar facturas. | billing-subscriptions | release candidate | detectado | Stripe/adaptador |
| REQ-043 | `REFERENCE_MODULES.md` | File | Gestionar archivos con storage seguro. | storage-files | release candidate | detectado | Signed URLs |
| REQ-044 | `REFERENCE_MODULES.md` | Tag | Permitir etiquetas transversales. | módulo | release candidate | detectado | Puede usar pivotes |
| REQ-045 | `REFERENCE_MODULES.md` | Bookmark | Permitir favoritos por usuario. | módulo | release candidate | detectado | Tenant-aware |
| REQ-046 | `REFERENCE_MODULES.md` | Filter | Permitir filtros guardados. | grid-module-factory | release candidate | detectado | Grid Universal |
| REQ-047 | `REFERENCE_MODULES.md` | Task | Permitir tareas transversales. | módulo | release candidate | detectado | Dependencias pendientes |
| REQ-048 | `REFERENCE_MODULES.md` | Record Relationship | Definir relaciones entre registros. | módulo | ambiguo | contradicción | Clasificación pendiente |
| REQ-049 | `REFERENCE_DATABASE_SCHEMA.md` | Metadata | Incluir campos de creación/actualización/borrado suave. | tabla | primer corte | detectado | Convención global |
| REQ-050 | `REFERENCE_DATABASE_SCHEMA.md` | Versionado | Versionar solo documentos y archivos cuando aplique. | tabla | release candidate | detectado | No versionado universal |
| REQ-051 | `REFERENCE_DATABASE_SCHEMA.md` | Consent | Registrar consentimientos mínimos. | consent-records | release candidate | detectado | Políticas pendientes |
| REQ-052 | `REFERENCE_ARCHITECTURE.md` | API | Exponer API versionada `/api/v1/*`. | api-errors-security | primer corte | detectado | Inventario pendiente |
| REQ-053 | `REFERENCE_ARCHITECTURE.md` | Validation | Validar entrada con Zod/Pydantic según runtime. | api-errors-security | primer corte | detectado | Trust boundary |
| REQ-054 | `REFERENCE_ARCHITECTURE.md` | Core AI | Mantener Core AI como servicio interno. | ai-providers | release candidate | detectado | Provider pendiente |
| REQ-055 | `REFERENCE_STACK.md` | Python | Usar FastAPI/Pydantic v2 para Core AI. | ai-providers | release candidate | detectado | Versiones pendientes |
| REQ-056 | `SCALABILITY_ASSURANCE.md` | Performance | API p95 debe ser menor a 200 ms salvo excepción documentada. | performance-budget | release candidate | detectado | Gate |
| REQ-057 | `SCALABILITY_ASSURANCE.md` | Performance | LCP debe ser menor a 2.5s en Fast 3G según docs. | performance-budget | release candidate | detectado | Gate UI |
| REQ-058 | `SCALABILITY_ASSURANCE.md` | Performance | Lighthouse debe superar 90. | performance-budget | release candidate | detectado | Gate UI |
| REQ-059 | `SCALABILITY_ASSURANCE.md` | Load | Ejecutar k6 para flujos críticos antes de release candidate. | escalabilidad | release candidate | detectado | No contra producción sin aprobación |
| REQ-060 | recurso `playwright` | Testing | Verificar desktop/tablet/mobile con Playwright. | testing-quality | release candidate | detectado | 375, 768, 1920 |
| REQ-061 | `REFERENCE_STACK.md` | Testing | Usar Vitest para lógica de negocio cuando aplique. | testing-quality | primer corte | detectado | Setup pendiente |
| REQ-062 | recurso `sonarqube` | Calidad | Usar quality gate para seguridad y mantenibilidad. | dependency-security | release candidate | detectado | Herramienta pendiente |
| REQ-063 | `SECURITY_ASSURANCE.md` | SSRF | Proteger integraciones externas contra SSRF. | api-errors-security | release candidate | detectado | Validar URLs |
| REQ-064 | `SECURITY_ASSURANCE.md` | Webhooks | Validar firma HMAC y replay en webhooks. | api-errors-security | release candidate | detectado | Provider-specific |
| REQ-065 | `SECURITY_ASSURANCE.md` | Rate limit | Aplicar rate limiting en rutas sensibles. | api-errors-security | primer corte | detectado | Redis opcional |
| REQ-066 | `SECURITY_ASSURANCE.md` | AI budgets | Aplicar límites de presupuesto/uso IA. | ai-providers | release candidate | detectado | Provider pendiente |
| REQ-067 | `REFERENCE_STRUCTURE.md` | Estructura | Mantener estructura por módulos y capas. | módulo | primer corte | detectado | Adaptar a repo real |
| REQ-068 | `DEPENDENCY_MATRIX.md` | Fase 0 | Cerrar decisiones canónicas antes de construir. | release | primer corte | detectado | Bloqueante |
| REQ-069 | `STRATEGY.md` | Comercial | Vender como source-available, no open source. | comercial | venta | detectado | Licencia pendiente |
| REQ-070 | `STRATEGY.md` | Updates | Incluir un año de updates y renovación posterior. | comercial | venta | detectado | Condiciones pendientes |

## Inventario de invariantes y gates

| ID | Fuente | Regla o gate | Dominio | Obligación | Comando/gate esperado | Criterio bloqueante | Estado |
|---|---|---|---|---|---|---|---|
| GATE-001 | FromZero | No crear Spec sin Context y Q&A aprobado. | release | primer corte | Revisión de artefactos | Falta `FROMZERO_QUESTIONNAIRE.md` aprobado | detectado |
| GATE-002 | FromZero | No crear Plan ni State antes de Spec aprobada. | release | primer corte | Revisión de artefactos | Existen fases posteriores sin aprobación | detectado |
| GATE-003 | usuario | No implementar código de aplicación todavía. | release | primer corte | Git diff | Cambios en código app | detectado |
| GATE-004 | seguridad | No leer ni exponer `.env` reales. | seguridad | primer corte | Revisión de comandos/diff | Secretos leídos o versionados | detectado |
| GATE-005 | `BOOTSTRAP_REFERENCE.md` | Bootstrap se ejecuta una sola vez. | bootstrap-order | primer corte | Test/bootstrap guard | Re-ejecución destructiva | detectado |
| GATE-006 | `BOOTSTRAP_REFERENCE.md` | `.env.example` documenta variables sin secretos. | seguridad | primer corte | Revisión `.env.example` | Se incluyen valores reales | detectado |
| GATE-007 | `REFERENCE_DATABASE_SCHEMA.md` | RLS obligatorio en tablas tenant-aware. | seguridad | primer corte | Tests SQL/RLS | Acceso cross-tenant posible | detectado |
| GATE-008 | `SECURITY_ASSURANCE.md` | RBAC se valida server-side. | seguridad | primer corte | Tests API | UI es única barrera | detectado |
| GATE-009 | `SECURITY_ASSURANCE.md` | `tenant_id` no se acepta desde cliente como autoridad. | seguridad | primer corte | Tests API/RLS | Header editable controla tenant | detectado |
| GATE-010 | `SECURITY_ASSURANCE.md` | Service role solo en servidor/jobs. | seguridad | primer corte | Revisión código/env | Service role expuesto al cliente | detectado |
| GATE-011 | `SECURITY_ASSURANCE.md` | Webhooks deben tener firma y anti-replay. | seguridad | release candidate | Tests webhook | Webhook aceptado sin firma | detectado |
| GATE-012 | `SECURITY_ASSURANCE.md` | Integraciones externas requieren SSRF guard. | seguridad | release candidate | Tests validación URL | URLs internas accesibles | detectado |
| GATE-013 | `REFERENCE_ARCHITECTURE.md` | APIs deben estar versionadas. | api-inventory | primer corte | Revisión rutas | Rutas públicas sin `/api/v1` | detectado |
| GATE-014 | `REFERENCE_ARCHITECTURE.md` | Inventario API debe existir antes de implementar endpoints. | api-inventory | primer corte | Spec | Endpoints sin contrato | detectado |
| GATE-015 | `SCALABILITY_ASSURANCE.md` | API p95 < 200ms salvo excepción. | performance-budget | release candidate | k6/APM | Presupuesto incumplido | detectado |
| GATE-016 | `SCALABILITY_ASSURANCE.md` | LCP < 2.5s Fast 3G. | performance-budget | release candidate | Lighthouse/Playwright | Presupuesto incumplido | detectado |
| GATE-017 | `SCALABILITY_ASSURANCE.md` | k6 para flujos críticos. | escalabilidad | release candidate | `k6 run` | Sin prueba de carga | detectado |
| GATE-018 | recurso `playwright` | Verificar responsive 375/768/1920. | testing-quality | release candidate | Playwright | Pantallas rotas | detectado |
| GATE-019 | recurso `sonarqube` | Quality gate antes de release. | dependency-security | release candidate | Sonar gate | Vulnerabilidades/bloqueantes | detectado |
| GATE-020 | recursos MCP | No activar MCP sin aprobación explícita. | internal-service-boundary | primer corte | Revisión configuración | Servicio conectado sin permiso | detectado |
| GATE-021 | recurso `fromzero-ui-template` | No copiar marcas visibles ni deuda de template. | template-brand-sanitization | primer corte | Revisión UI | Marca/template visible | detectado |
| GATE-022 | `REFERENCE_STRUCTURE.md` | Código, nombres y rutas en inglés. | naming-dual-standard | primer corte | Revisión/lint | Código en español | detectado |
| GATE-023 | instrucciones globales | Documentación solicitada en español. | naming-dual-standard | primer corte | Revisión docs | Docs solicitados en otro idioma | detectado |
| GATE-024 | `REFERENCE_DATABASE_SCHEMA.md` | Consentimientos mínimos deben registrarse. | consent-records | release candidate | Tests/schema | Consentimientos no auditables | detectado |
| GATE-025 | `DEPENDENCY_MATRIX.md` | Fase 0 debe cerrar decisiones canónicas. | release | primer corte | Q&A aprobado | Decisiones críticas abiertas | detectado |

## Recursos FromZero activados como referencia

| Recurso | Uso en este contexto | Acción realizada |
|---|---|---|
| `supabase` | Datos, auth, storage, RLS, secretos | leído, no conectado |
| `redis` | Cache/colas/rate limit opcional | leído, no conectado |
| `sonarqube` | Quality gate | leído, no conectado |
| `expo` | Contratos mobile potenciales | leído, no instalado |
| `hostinger` | Referencia de despliegue posible | leído, no conectado |
| `stripe` | Pagos candidato | leído, no conectado |
| `inngest` | Event bus/jobs | leído, no conectado |
| `playwright` | E2E/visual gates | leído, no ejecutado |
| `k6` | Load tests | leído, no ejecutado |
| `stack-router` | Routing | leído |
| `frontend-web` | Next.js/frontend | leído |
| `fromzero-ui-template` | UI base/referencia | leído |
| `backend-api` | Contratos backend/API | leído |
| `databases` | Datos/schema | leído |
| `auth-providers` | Auth/session | leído |
| `payments` | Billing/adapters | leído |
| `deployment-cloud` | Despliegue | leído |
| `ai-providers` | Core AI/proveedores | leído |
| `testing-quality` | Testing/calidad | leído |
| `mcp-supabase` | MCP opcional | leído, no activado |
| `mcp-sonarqube` | MCP opcional | leído, no activado |

## Variables detectadas por el resolver

Variables públicas o no secretas sugeridas para `.env.example` cuando se especifique el proyecto:

| Variable | Estado |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | pendiente de documentar |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | pendiente de documentar |
| `REDIS_URL` | pendiente de decidir; puede ser secreto según uso |
| `SONAR_HOST_URL` | pendiente de decidir |
| `SONAR_PROJECT_KEY` | pendiente de decidir |
| `EXPO_PUBLIC_API_URL` | pendiente de decidir si aplica |
| `APP_BASE_URL` | pendiente de definir |
| `STRIPE_PUBLISHABLE_KEY` | pendiente de decidir proveedor |
| `INNGEST_EVENT_KEY` | pendiente de decidir |
| `PLAYWRIGHT_BASE_URL` | pendiente de test setup |
| `K6_BASE_URL` | pendiente de test setup |
| `API_BASE_URL` | pendiente de definir |
| `DATABASE_URL` | secreto o restringido; no exponer valor real |
| `AUTH_URL` | pendiente de definir |
| `PAYMENTS_PUBLIC_KEY` | pendiente de adapter |
| `AI_PROVIDER` | pendiente de decisión |
| `TEST_BASE_URL` | pendiente de test setup |

Secretos externos detectados. No deben leerse ni versionarse:

| Secreto | Estado |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | pendiente de proveedor/entorno |
| `REDIS_URL` | pendiente de clasificación final |
| `SONAR_TOKEN` | pendiente |
| `EXPO_TOKEN` | pendiente si aplica |
| `HOSTINGER_API_TOKEN` | pendiente si aplica |
| `SSH_PRIVATE_KEY` | pendiente si aplica |
| `STRIPE_SECRET_KEY` | pendiente |
| `STRIPE_WEBHOOK_SECRET` | pendiente |
| `INNGEST_SIGNING_KEY` | pendiente |
| `DATABASE_URL` | pendiente |
| `AUTH_SECRET` | pendiente |
| `OAUTH_CLIENT_SECRET` | pendiente |
| `PAYMENTS_SECRET_KEY` | pendiente |
| `PAYMENTS_WEBHOOK_SECRET` | pendiente |
| `DEPLOY_TOKEN` | pendiente |
| `CLOUD_ACCESS_KEY` | pendiente |
| `OPENAI_API_KEY` | pendiente |
| `ANTHROPIC_API_KEY` | pendiente |
| `GEMINI_API_KEY` | pendiente |
| `SUPABASE_ACCESS_TOKEN` | pendiente |

## Recomendación

- Seguir: sí, con Q&A crítico antes de especificar.
- Razón: la documentación es suficientemente rica para continuar, pero contiene decisiones abiertas y contradicciones que pueden cambiar arquitectura, alcance vendible, estructura y proveedores.
- No hacer todavía: código de aplicación, scaffolding de módulos, conexiones MCP, instalación de servicios, Spec, Plan o Build.
- Hacer primero: cerrar decisiones canónicas de fase 0 en modo plan y registrar el cuestionario aprobado.

## Preguntas candidatas para Q&A

Estas preguntas no reemplazan `artifacts/FROMZERO_QUESTIONNAIRE.md`. Solo preparan el Q&A real en modo plan.

| # | Pregunta | Criticidad | Por que bloquea o mejora la Spec |
|---|---|---|---|
| 1 | ¿Confirmas que este proyecto especifica el framework From Zero, no una app derivada? | crítica | Define ruta de construcción, nombres, módulos y entregable |
| 2 | ¿Qué versión debe ser canónica: documentos 7.0.0, carpeta `fw_v7.4` u otra? | crítica | Evita especificar contra una versión incorrecta |
| 3 | ¿El alcance documentado completo sigue siendo obligatorio para producto vendible? | crítica | Evita reducir módulos por error |
| 4 | ¿Cómo distinguimos producto vendible, primer corte técnico y release candidate? | crítica | Ordena fases sin contradecir el PRD |
| 5 | ¿`record-relationship` será módulo visible, subsistema transversal o tabla soporte? | crítica | Afecta conteo de módulos, navegación, permisos y schema |
| 6 | ¿Cómo quieres definir la interfaz visual del proyecto? | crítica | Decide UI FromZero, referencia externa o UI diferida |
| 7 | ¿La estructura objetivo debe adaptarse a `.codex/` o conservar referencias `.agent/`? | importante | Evita scaffolding incompatible |
| 8 | ¿El modo inicial será `saas` o `corporate`? | crítica | Afecta bootstrap, tenants, billing y permisos |
| 9 | ¿El modelo comercial inicial será `per_tenant` o `per_user`? | crítica | Afecta planes, billing, límites y UI |
| 10 | ¿Usuarios multi-tenant permitidos desde el inicio? | crítica | Afecta membresías, claim activo y RLS |
| 11 | ¿Supabase se trabajará en cloud, local+cloud o cloud con SQL versionado? | crítica | Afecta migraciones y pruebas |
| 12 | ¿Stripe será proveedor default inicial o solo un adapter posible? | importante | Afecta billing, webhooks y `.env.example` |
| 13 | ¿Qué proveedor de email transaccional se usará inicialmente? | importante | Afecta invitaciones, templates y notificaciones |
| 14 | ¿Qué proveedor IA inicial se usará para Core AI? | crítica | Afecta costos, privacidad, modelos y límites |
| 15 | ¿Redis/BullMQ se incluye en el primer corte o queda con fallback? | importante | Afecta cache, rate limit y jobs |
| 16 | ¿Inngest será event bus inicial o se define adapter abstracto primero? | importante | Afecta reglas, jobs y retries |
| 17 | ¿Cuál será el target de despliegue inicial? | crítica | Afecta runtime, Docker, jobs, storage y CI |
| 18 | ¿Qué observabilidad se exige desde release candidate? | importante | Afecta Sentry/PostHog/logs y soporte |
| 19 | ¿SonarQube local, SonarCloud o ningún gate externo inicial? | importante | Afecta CI y quality gates |
| 20 | ¿Qué licencia source-available concreta regirá el producto? | crítica | Bloquea venta/distribución |
| 21 | ¿Qué límites y promesa tendrá el free tier futuro? | importante | Evita promesas comerciales ambiguas |
| 22 | ¿Qué políticas mínimas de retención, consentimiento y eliminación aplican? | crítica | Afecta legal, schema y auditoría |
| 23 | ¿Qué idiomas deben soportarse al inicio? | importante | Afecta `next-intl`, contenidos y QA |
| 24 | ¿Qué criterios de performance son bloqueantes para primer corte y cuáles para release? | importante | Afecta pruebas y priorización |
| 25 | ¿Autorizas proponer MCP Supabase/Sonar en una fase posterior sin activarlos todavía? | opcional | Permite planificar automatización sin conectar servicios |

## Estado final de esta fase

- Contexto creado para revisión.
- Decisiones críticas pendientes.
- Q&A real no ejecutado.
- `artifacts/FROMZERO_QUESTIONNAIRE.md` no creado.
- `artifacts/FROMZERO_SPEC.md` no creado.
- `artifacts/FROMZERO_PLAN.md` no creado.
- `artifacts/FROMZERO_STATE.md` no creado.

Activa el modo plan de Codex antes de continuar.
El siguiente paso de la metodología FromZero usa el modo plan para hacer el cuestionario más guiado y fácil de revisar.
