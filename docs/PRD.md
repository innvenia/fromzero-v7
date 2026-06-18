# From Zero Framework v7.4.0 - PRD (Fuente de Verdad)

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-06
> **Fuente de verdad:** Este documento.
> **Propósito:** Definir el contrato funcional y técnico primario del framework.
> **Alcance:** Documentación de producto y contrato objetivo del framework.

> [!IMPORTANT]
> **Estado del Proyecto:** Este documento es la **especificación objetivo** del framework. El From Zero Framework se encuentra en fase activa de construcción. Las secciones a continuación describen las capacidades, módulos y comportamientos que el sistema debe poseer al completarse. Este PRD opera como el contrato determinista que guía cada decisión de diseño e implementación.

> [!NOTE]
> **Referencias canónicas complementarias:** el stack vive en [`REFERENCE_STACK.md`](./REFERENCE_STACK.md), la seguridad verificable en [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md), la escalabilidad verificable en [`SCALABILITY_ASSURANCE.md`](./SCALABILITY_ASSURANCE.md), el bootstrap inicial en [`BOOTSTRAP_REFERENCE.md`](./BOOTSTRAP_REFERENCE.md), las dependencias de construcción en [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md) y el contrato del Design System en [`REFERENCE_DESIGN_SYSTEM.md`](./REFERENCE_DESIGN_SYSTEM.md).

> [!IMPORTANT]
> **Framework vs aplicación final:** este repositorio define el framework base. Las aplicaciones finales deciden dominio, modelo comercial, proveedores, defaults regionales, políticas específicas y lógica de negocio. El framework debe proveer contratos, adapters, defaults seguros, puntos de configuración y módulos reutilizables para soportar esas decisiones sin hardcodearlas.

## 1. Visión y Definiciones Fundamentales

### 1.1 Visión del Sistema

El "From Zero Framework" es un **Sistema Integrado de Creación de Aplicaciones de Software**: determinista, seguro y escalable, construido sobre Next.js (App Router) y Supabase como stack principal. El componente Core AI (§3.A Modelos AI) opera sobre Python (FastAPI + Pydantic v2) como runtime independiente. Su propósito es servir como el cimiento técnico innegociable para la creación de aplicaciones web comerciales (SaaS B2B/B2C o Corporate), abstrayendo toda la complejidad de autenticación, multi-tenancy, cobros (statements), perfiles y permisos, integraciones y gestión de usuarios.

El framework opera como el "Sistema Operativo" de la aplicación final, proveyendo un ecosistema listo para usar. A diferencia de un boilerplate o plantilla de código, el sistema integra código, módulos y lógica de negocio lista para usar, desde la configuración inicial hasta el despliegue en producción, asegurando que cada aplicación resultante cumpla estándares profesionales de seguridad, escalabilidad y calidad.

> **Estrategia de Producto:** La visión, posicionamiento y modelo comercial del framework se documentan en [`STRATEGY.md`](./STRATEGY.md), complementaria a este PRD técnico.

#### 1.1.1 Audiencia Objetivo

El sistema está diseñado para **cualquier persona o equipo** -desarrolladores, emprendedores y equipos de producto- que necesite crear aplicaciones de software sobre una base sólida, sin reconstruir la infraestructura común (autenticación, multi-tenancy, RBAC, billing) desde cero.

#### 1.1.2 Justificación

Las herramientas de inteligencia artificial han democratizado la capacidad de crear software: hoy, cualquier persona puede generar código funcional mediante un agente de IA. Sin embargo, esta democratización **no transfirió** el conocimiento de ingeniería necesario para construir aplicaciones seguras, escalables y bien estructuradas.

**El problema:** Las personas sin background técnico suficiente pueden crear aplicaciones que funcionan en superficie, pero que contienen vulnerabilidades de seguridad, deficiencias arquitectónicas y deuda técnica oculta. Estas falencias solo se descubren cuando ocurre un incidente inesperado - una brecha de datos, una caída bajo carga, o un fallo en producción.

**La solución:** El framework cierra ese gap aportando una base que hereda automáticamente: seguridad (código seguro, OWASP Top 10, RLS, validación), escalabilidad (multi-tenancy, API-first) y estructura modular (definición formal de módulos, separación de concerns). Toda aplicación construida sobre From Zero parte de estos estándares por diseño, no como un añadido posterior.

### 1.2 Restricciones de Contexto

- El framework v7.4.0 es el **MVP inicial del framework web**. Todo lo definido como capacidad del framework en este documento forma parte del MVP, aunque ciertas capacidades se habiliten o configuren según la aplicación final construida sobre la base.
- El framework está diseñado para **una única aplicación web responsiva** en su versión actual. El backend debe quedar preparado para servir frontends móviles futuros, pero una aplicación móvil nativa no forma parte del MVP web.
- **Diseño Responsivo Obligatorio (Mobile-First):** Todo componente, layout, vista, formulario y elemento de UI del framework DEBE ser responsivo sin excepción. El diseño sigue la estrategia **Mobile-First**: se diseña primero para el viewport más reducido y se escala progresivamente hacia pantallas mayores. Ningún agente IA ni desarrollador puede crear componentes que funcionen exclusivamente en desktop o que degraden la experiencia en dispositivos móviles/tablets. La usabilidad y experiencia del usuario en cualquier tamaño de pantalla es un requisito de primer orden, no un ajuste posterior.
- **App móvil nativa:** No se construirá una app nativa en el MVP web, pero la arquitectura API-first y la abstracción de Supabase deben asegurar su integración futura.
- Toda configuración de UI, componentes, vistas y módulos debe adherirse de manera estricta al estándar de diseño establecido en el Design System propietario (shadcn/ui + Tailwind v4).
- **No existen sub-tenants.** La jerarquía organizacional es plana: solo Tenants independientes sin anidación.
- **Agnóstico del dominio de negocio:** El framework sirve como cimiento para CRM, ERP, e-commerce, salud, educación o cualquier vertical. No debe contener lógica específica de industria.
- **Marca de plantillas prohibida:** El UI/UX utiliza un Design System propietario, y **queda estrictamente prohibido** mostrar marcas, logotipos o referencias a plantillas de terceros en cualquier superficie visible al usuario final (UI, emails, documentos generados, meta tags).

### 1.2.1 Alcance del MVP del Framework Web

| Categoría | Alcance MVP |
|-----------|-------------|
| Base del framework | Arquitectura Next.js + Supabase, separación `src/app` (router Next.js) / `src/framework` (base reusable) / `src/web` (aplicación web), arquitectura preparada para una futura app móvil, Core AI independiente, seguridad, multi-tenancy, RBAC, auditoría, i18n, configuración por bootstrap y operación web responsiva. |
| Módulos core | Los 27 módulos listados en §3 forman parte del MVP del framework. Su disponibilidad o visibilidad puede depender de configuración (`app_mode`, `billing_enabled`, permisos, plan), pero su contrato documental pertenece al MVP. |
| Funciones transversales | Grid Universal, Module Factory, soft delete, import/export, custom fields, tags, bookmarks, filtros, notificaciones, reglas, APIs, seguridad perimetral, jobs programados, Inngest para trabajos asíncronos y feature gating. |
| Autenticación | Usuario/contraseña es el método base. OAuth mediante proveedores de Supabase es una capacidad opcional configurable del framework, apagada por defecto hasta que la aplicación final la habilite. |
| Mobile | El MVP no incluye una app móvil nativa. Sí exige que backend, APIs y modelo de seguridad puedan servir un frontend móvil posterior sin duplicar lógica de negocio. |
| Design System | `REFERENCE_DESIGN_SYSTEM.md` define el contrato objetivo del Design System propietario. Cuando exista el scaffold, la fuente operativa será `src/framework/ui` y su documentación interna. |
| Aplicaciones derivadas | Los módulos específicos de negocio de cada aplicación se construirán sobre el framework y no forman parte del MVP base, salvo el módulo demostrativo `task`. |

### 1.3 Definición de Módulo

Un **módulo** es la unidad funcional atómica del framework. Para que una entidad sea considerada un módulo, debe cumplir **3 condiciones obligatorias**:

1. **Tabla(s) en Base de Datos:** Registros persistentes en PostgreSQL/Supabase.
2. **Formulario:** Interfaz gráfica (frontend) para ingresar y editar datos del registro.
3. **Vista (Grid Universal):** Interfaz gráfica (frontend) para consultar, filtrar, ordenar, listar y gestionar los registros existentes.

**Excepciones documentadas:** Algunos módulos del sistema operan con variantes de la triada por su naturaleza funcional. Estos módulos mantienen su clasificación como módulos (están registrados en el Módulo de Módulos, participan en RBAC y son accesibles desde el sidebar), pero adaptan uno o más elementos: (1) **Módulos read-only** (ej. Log, Notificaciones): Grid con formulario de visualización (no edición) - los registros se generan programáticamente. (2) **Módulos singleton** (ej. Parámetros): Formulario sin Grid - un único registro global editado vía tabs. (3) **Módulos de UI inyectable** (ej. Tags, Bookmarks, Filtros): Poseen tabla y Grid propio, poseen un formulario de edición y adicionalmente un formulario que se presenta como componente embebido en otros módulos.

Si una tabla solo almacena datos recuperados programáticamente, sin interfaz de interacción directa (formulario o vista), se clasifica como **tabla de soporte**, no como módulo. Ejemplo: `auth.users` (tabla de soporte gestionada por Supabase para autenticación), `user_preferences`, `profile_permissions`, entre otras.

**Clasificación:**

- **Módulo de Sistema (Core):** Viene pre-construido con el framework. Constituye la infraestructura base innegociable (Parámetros, Tenants, Profiles, Users, Estados de Cuenta, etc.).
- **Módulo de Aplicación:** Creado por el desarrollador o agente IA a partir del PRD de la aplicación final. Ejemplos: Contactos, Oportunidades, Productos, según el dominio de negocio. El framework incluye un módulo "task" o Tareas como ejemplo, y además provee los mecanismos e información suficientes para crear nuevos módulos de aplicación.

**Herencia automática:** Todo módulo (Sistema o Aplicación) hereda del framework: Auth, RLS, i18n, Auditoría, Soft Delete, Import/Export, Custom Fields, Búsqueda Global, si aplican.

**Registro:** Todo módulo se registra obligatoriamente en el Módulo de Módulos (§3.A), que alimenta la matriz de permisos y las configuraciones de Grid/Import/Export.

**Consistencia:** Este concepto de módulo se mantiene idéntico para el framework y para las aplicaciones finales. Los PRDs de aplicaciones derivadas deben respetar esta definición para garantizar coherencia arquitectónica.

### 1.4 Equivalencias Técnicas

El framework establece una única equivalencia terminológica que requiere documentación explícita: el puente entre el término técnico de aislamiento de datos y su representación en la interfaz de usuario.

| Término Técnico (Código/BD) | UI Label (Frontend/i18n) | Equivalente Estándar |
| --------------------------- | ------------------------ | -------------------- |
| **`tenant`** / `tenant_id`  | "Account" (EN) / "Cuenta" (ES) | Tenant (multi-tenancy) |

> **Regla de oro:** El término canónico en todo código fuente, base de datos, documentación técnica y configuración es **`tenant`**. El usuario final **nunca** ve la palabra "tenant" en la interfaz; toda referencia visible usa exclusivamente "Account" (EN) o "Cuenta" (ES) a través del sistema i18n (§4.1). Esta dualidad se gestiona en el namespace `account.json` de traducciones.
>
> Los demás conceptos del framework (`profile`, `module`, `plan`, etc.) se utilizan con su mismo nombre tanto en código como en UI (traducidos al idioma correspondiente vía i18n), sin necesidad de puente terminológico.

### 1.5 Tabla de Conceptos del Framework

Para garantizar una semántica determinista y evitar confusiones durante el desarrollo con agentes IA, se establece la siguiente tabla de conceptos.

| Concepto                 | UI / Lógica de Negocio (Frontend/Docs) | Base de Datos (Supabase/Backend)                       | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------------------ | -------------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Organización**         | Tenant (Cuenta)                       | `tenants` / `tenant_id`                              | La entidad lógica principal de aislamiento de datos. Cada Tenant opera como un contenedor independiente con sus propios usuarios, datos y configuraciones. El Tenant Zero (cuenta maestra) se genera durante la inicialización a partir de `initial_tenant` del `bootstrap.json` (`name`, `slug`).                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| **Persona**              | User (Usuario)                         | `auth.users` (Supabase) / `users` / `user_preferences` | `auth.users` es la tabla de sistema gestionada por Supabase para autenticación (credenciales, tokens, sesiones - no modificable). `users` almacena los datos de identidad del usuario: nombre, avatar, timezone, locale y cualquier otro dato que se requiera en el módulo de Usuarios. Los campos formales de la tabla `users` se listan en el schema base al final de esta sección. `user_preferences` es una tabla de soporte que almacena las customizaciones de UI por módulo (columnas del Grid, ordenamiento, paginación, layout de dashboard, etc.). La persistencia de `user_preferences` opera **por Tenant**: cada usuario tiene preferencias independientes para cada cuenta en la que participa. El primer Super Admin se genera durante la inicialización a partir de `initial_super_admin` del `bootstrap.json` (`email`, `first_name`, `last_name`).                                                                                                                                    |
| **Pertenencia**          | Member (Miembro)                       | `user_memberships`                                     | Tabla de soporte (relación N:N entre Users y Tenants). Campos: `id` (UUID), `user_id` (FK auth.users), `tenant_id` (FK tenants), `profile_id` (FK profiles), `status` (active/suspended/pending), `invited_by` (FK auth.users, nullable), `joined_at`, `created_at`. Permite que una persona (un único email) pertenezca a múltiples Tenants cuando `allow_multi_tenant_users` en bootstrap.json está en `true`. Cada registro asigna un Profile específico al User dentro de ese Tenant. |
| **Permisos**             | Profile (Perfil)                       | `profiles` / `profile_permissions`                     | **`profiles` (Módulo):** Tabla principal del módulo Profiles. Almacena la definición del perfil: nombre, `tenant_id` y la página de inicio (Home) predeterminada. El campo `tenant_id` en `profiles` es `NULL` para perfiles globales del framework (Super Admin, Admin, Member, Guest) y required para perfiles específicos de una aplicación derivada cuando el Super Admin los crea con scope limitado. El **catálogo de Profiles** (qué perfiles existen y su matriz de permisos) lo define exclusivamente el **Super Admin** o el creador de la aplicación en el `bootstrap.json` (`initial_profiles`) y/o desde el módulo Profiles (§3.A). Los Admins de Tenant **no crean ni modifican** definiciones de Profile; solo **asignan** Profiles existentes a usuarios de su Tenant mediante `user_memberships`. Los perfiles base se generan durante la inicialización a partir de `initial_profiles` del `bootstrap.json`. **`profile_permissions` (Soporte):** Tabla de soporte que almacena la matriz de permisos - un registro por combinación perfil × módulo, definiendo qué operaciones puede ejecutar el usuario. Las **7 acciones estándar** son: `view`, `create`, `update`, `delete`, `import`, `export`, `notify`. Cada acción se almacena como un booleano por combinación perfil × módulo. |
| **Plan**                 | Plan                                   | `plans`                                                | Plantilla que define las características, límites y funcionalidades incluidas en un nivel de servicio. Es la definición estática (ej. "Plan Pro: 50 usuarios, 10GB storage"). El catálogo de planes inicial se genera durante la inicialización a partir de `initial_plans` del `bootstrap.json` (`code`, `name`, `price_monthly`, `features`).                                                                                                                                                                                                                                                                                                                                                                                                          |
| **Suscripción**          | Subscription (Suscripción)             | `subscriptions`                                        | Instancia activa de un Plan vinculada a una entidad específica. El destinatario lo define `licensing_model` del `bootstrap.json`: **`per_tenant`** asigna la suscripción al Tenant (todos los usuarios heredan las funciones del plan); **`per_user`** asigna suscripciones individuales a cada User (cobro granular por nivel de licencia). En modo `per_user`, todo usuario nuevo hereda el plan del Tenant por defecto; un Admin puede sobrescribirlo para usuarios específicos desde el módulo Usuarios. El campo `entity_type` (`tenant` o `user`) y `entity_id` (UUID del Tenant o User) identifica el propietario de cada suscripción. Campo `external_subscription_id` (string, nullable): ID de la suscripción en el proveedor de pagos externo (ej. `sub_...` en Stripe), para mapeo bidireccional con webhooks del proveedor. Registra: estado (`trialing`, `active`, `past_due`, `expired`, `canceled`, `suspended`), plan vinculado, fecha inicio/fin, método de pago. **Proceso de cálculo:** un Job por ciclo de facturación recolecta todas las suscripciones del Tenant (directa + por usuario) y consolida el monto total en el módulo Estados de Cuenta. |
| **Estados de Cuenta**    | Statement (Estado de Cuenta)           | `statements`                                           | Estado de cuenta acumulado de uso de un Tenant en un ciclo específico. La activación del módulo de facturación depende del flag `billing_enabled` del `bootstrap.json` (`features`). El proveedor de pagos se configura en `payments.provider` y `payments.mode`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Invoice**              | Invoice (Factura/Cobro)                | `invoices`                                             | Registro contable de una transacción de pago ya procesada por la pasarela. **El contenido del Invoice es inmutable:** una vez generado, el monto, descripción, moneda y datos de facturación no pueden ser editados. Lo que sí se puede modificar es el **status de la transacción** (`processed`, `voided`, `reversed`), que refleja anulaciones o reversas ejecutadas por la pasarela de pago. Cuando se requiere un ajuste financiero, la modificación se realiza en el módulo Statement (§3.B); una vez que el Statement está corregido, se genera una nueva acción de cobro que produce un nuevo registro Invoice. Este modelo preserva la integridad contable: cada Invoice es un hecho financiero atómico e irrevocable en su contenido. |
| **Inicialización**       | Proceso de Inicialización              | N/A                                                    | Flujo asistido donde se lee `bootstrap.json` para generar variables y base de datos, sujeto a la validación del operador.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| **Parámetros**           | Settings (Configuración)               | `settings`                                             | Configuración integral de la aplicación. Incluye variables de todo tipo (booleanas, strings, numéricos, JSON) que controlan el comportamiento del sistema: seguridad, integraciones, branding, notificaciones. Nace del `bootstrap.json` durante la inicialización y se gestiona desde el módulo Settings post-despliegue.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Registro de Módulos**  | Módulo de Módulos                      | `modules`                                              | Módulo de la aplicación que administra la definición y configuración de todos los módulos del sistema. Gestiona cómo se presenta la información de cada módulo en las vistas del Grid Universal, importación y exportación. Extensible para futuras funcionalidades. Los 27 módulos core se registran durante la inicialización desde una lista canónica interna del framework; `initial_modules` se reserva para overrides o módulos adicionales.                                                                                                                                                                                                                                                                                                                                                              |
| **Vista de Registros**   | Grid Universal                         | N/A                                                    | Componente maestro de visualización tabular que renderiza los listados de todos los módulos. El tamaño de página por defecto se configura en `ui_defaults.default_page_size` del `bootstrap.json`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| **Consentimiento Legal** | Consent Records                        | `consent_records`                                      | Tabla de soporte de compliance que registra la aceptación de términos legales (términos de servicio, política de privacidad, marketing). Almacena: quién aceptó (`user_id`), qué aceptó (`consent_type`), cuándo (`accepted_at`), desde qué dirección IP (`ip_address`), versión del documento aceptado (`document_id`), y si fue revocado (`revoked_at`). Referenciable desde el registro del Tenant para verificación visual por administradores. Complementa (no reemplaza) el registro en el módulo Log (§3.A). La versión inicial de los términos legales se define en `legal.terms_version` del `bootstrap.json`. Justificación: cumplimiento jurídico obligatorio en normativas como GDPR (UE), CCPA (California), LFPDPPP (México) y similares. |
| **Invitación**           | Invitation (Invitación)                | `invitations`                                          | Módulo que gestiona el ciclo de vida de invitaciones a usuarios. Campos: `invitation_id`, `tenant_id`, `email`, `profile_id` (perfil asignado), `invited_by` (`user_id` del emisor), `token` (hash único), `invitation_type` (`link` \| `code`), `status` (`pending` \| `accepted` \| `expired` \| `revoked`), `created_at`, `expires_at` (TTL configurable en `security.invitation_ttl_days`, §2.3.9), `accepted_at`, `accepted_by_user_id`. Permite al Admin controlar invitaciones emitidas, visualizar cuáles fueron aceptadas (con fecha/hora de aceptación), y medir la conversión invitaciones → registros. Se referencia desde el flujo de registro por invitación (§2.3.2). |
| **URL de Invitación**    | Invitation URL                         | N/A                                                    | URL única con token embebido que permite al destinatario completar su registro y vincularse automáticamente al Tenant emisor. Sustituye al término ambiguo "Magic Link". **Nota:** No confundir con el "Magic Link" de Supabase Auth (passwordless login), el cual no se utiliza en este framework. |

**Schemas base de tablas sin definición explícita:**

**`users`** (campos de identidad, complementa `auth.users`):
`id` (UUID, PK), `auth_id` (FK auth.users), `first_name`, `last_name`, `avatar_url`, `status` (active | inactive | pending_verification | marked_for_deletion - §2.3.11), `locale`, `timezone`, `time_format` (12h | 24h), `mfa_secret` (cifrado), `mfa_method` (totp | email | sms | null), `last_login_at`, `marked_for_deletion_at`, campos comunes (§4.24).

**`statements`** (consolidado financiero por ciclo):
`id` (UUID, PK), `tenant_id` (FK), `period_start`, `period_end`, `total_amount`, `currency` (ISO 4217), `line_items` (JSONB - desglose de suscripciones), `status` (draft | finalized | paid | voided), `payment_method_id`, `generated_at`, campos comunes (§4.24).

**`invoices`** (registro contable inmutable):
`id` (UUID, PK), `tenant_id` (FK), `statement_id` (FK), `external_invoice_id` (string, nullable - ID en proveedor), `amount`, `currency`, `description`, `status` (processed | voided | reversed), `paid_at`, `voided_at`, `reversed_at`, campos comunes (§4.24).

> [!NOTE]
> Estos schemas son orientativos a nivel PRD. La definición técnica completa por módulo se detalla en `REFERENCE_MODULES.md`; el contrato consolidado de tablas, ownership, RLS y soft delete está en `REFERENCE_DATABASE_SCHEMA.md`.

### 1.6 Jerarquía de Seguridad

La arquitectura de seguridad opera en la siguiente cascada determinista:

1. **Tenant:** El contenedor principal y barrera de aislamiento de datos (RLS).
2. **Profile:** El conjunto de permisos definido a un usuario para operar dentro de un Tenant.
3. **User:** La persona física autenticada que, a través de su membership, adopta un Profile dentro de un Tenant.

> [!NOTE]
> **Integraciones M2M (API Keys):** Para requests autenticadas con API Key, la jerarquía se simplifica a: Tenant (determinado por la key) → Scopes (permisos de la key). No hay Profile ni User activo en el contexto M2M. El `tenant_id` se resuelve desde la key y se inyecta en el contexto RLS de forma idéntica al JWT de usuario.

---

## 1.7 Convenciones e Invariantes del Framework

Estas directrices son invariantes del framework y aplican a todo código construido sobre la base:

### 1.7.1 Orden Estricto de Construcción de Módulos

Al inicializar o reconstruir la base de datos o UI, la jerarquía de dependencias exige este orden cronológico:

1. **Parámetros** (Configuración general base para el resto de sistemas).
2. **Módulos (Módulo de Módulos)** (Registro de entidades y vistas).
3. **Planes** (Catálogo de planes. Prerequisito para asignar suscripción inicial a los Tenants).
4. **Tenants** (Estructura multi-tenant. Requiere Plans para vincular suscripción).
5. **Profiles** (Matriz de permisos, requiere que existan los Módulos y Tenants. **Precedencia crítica:** los Profiles DEBEN crearse antes que los Users porque la creación de la membresía fundacional en `user_memberships` requiere un `profile_id` válido para asignar el rol RBAC del primer usuario en el Tenant).
6. **Users** (Gestión de usuarios y asignación a Profiles/Tenants).
7. **Resto de Módulos** (Estados de Cuenta, Documentos, Custom Fields, Tareas, etc.).

> [!NOTE]
> **Infraestructura de auditoría:** La tabla del módulo Log debe crearse junto con Parámetros (paso 1) como parte de la infraestructura base de BD, para que el Interceptor de Auditoría (§4.11) pueda registrar las operaciones de creación de todos los pasos subsiguientes.

### 1.7.2 Restricciones de Arquitectura Inquebrantables

- **Prohibición de Alucinación:** Ante ambigüedades en un PRD final externo, detenerse y consultar. No inferir esquemas de base de datos.
- **Datos Reales Estrictos:** Prohibido generar data "dummy" mockeada en duro en el frontend. Todo registro, menú o dato visual en pantalla debe provenir del backend/endpoints. Prohibido exponer datos sensibles (credenciales, tokens, PII) en `console.log`, comentarios de código o payloads de respuesta en producción.
- **Seguridad RLS (Distinción Global vs Negocio):** Toda tabla de aplicación/negocio con `tenant_id` DEBE implementar RLS. Excepción: tablas globales/sistema (`settings`, `plans`, `ai_models`) que NO contienen datos de tenant pueden excluirse de RLS. **Caso especial - `logs`:** la tabla `logs` incluye `tenant_id` (nullable) y aplica RLS. Para operaciones dentro de un Tenant, `tenant_id` se registra y el Admin solo ve logs de su Tenant. Para operaciones globales (fuera del contexto de un Tenant), `tenant_id` es `NULL` y solo el Super Admin las visualiza.
- **Definición de Módulo:** Ver §1.3 para la definición formal. Todo módulo DEBE cumplir la triada: tabla(s) en BD, Grid Universal, y Formulario.
- **Métricas de Calidad:** El código debe alcanzar una cobertura de pruebas ≥ 80% y mantenerse libre de bugs y vulnerabilidades conocidas.
- **Testing E2E:** Pruebas de integración visual con **Playwright** u otro sistema de integración con navegadores Web para flujos críticos (login, CRUD, permisos, onboarding).
- **KPIs de Performance:** FCP < 1.5s, API Latency p95 < 200ms. Alineado con la especificación de Architecture §1.2.
- **KPIs de Calidad Frontend:** Lighthouse Score mínimo **> 90** en las cuatro categorías auditables (Performance, Accessibility, Best Practices, SEO). LCP (Largest Contentful Paint) **< 2.5s** medido en condiciones de red Fast 3G.
- **Nomenclatura obligatoria:** En todo código fuente, variables, comentarios, nombres de archivos y commits se DEBE usar exclusivamente la terminología definida en §1.5: `tenant` (término canónico), `profile` (término RBAC canónico), `log` (término canónico de auditoría). Cualquier referencia a nomenclatura obsoleta debe corregirse inmediatamente.
- **Soft Delete obligatorio:** Prohibido ejecutar `DELETE` físico en tablas de negocio. Toda eliminación de registros DEBE implementarse mediante el campo `deleted_at` (§4.5). Excepción: tablas de soporte técnico o registros temporales de sistema donde el borrado físico esté explícitamente justificado.
- **Convenciones de nombrado (Dual Standard):** Tablas de BD en PLURAL inglés (`tasks`, `users`), slugs/rutas/URLs en SINGULAR inglés (`/task`, `/user`). Traducciones i18n en inglés y `snake_case`. Ver §6.1 para el estándar completo. Ningún agente puede desviarse de esta convención.
- **Zero Hardcoded Strings (i18n):** Prohibido incluir strings de texto visibles al usuario directamente en componentes de UI. Todo texto (labels, títulos, placeholders, mensajes, botones) DEBE pasar por el sistema de internacionalización `next-intl` (§4.1). Excepción: constantes técnicas no visibles al usuario final.
- **Server/Client Boundary (Next.js App Router):** Todas las mutaciones de datos (CREATE, UPDATE, DELETE) y consultas con contexto de seguridad DEBEN ejecutarse exclusivamente en Server Actions o API Routes, nunca desde Client Components directos. Los Client Components se limitan a interactividad de UI (eventos, estado local, animaciones). Esta separación es prerequisito para que RLS y el Interceptor de Auditoría (§4.11) funcionen correctamente.

### 1.8 Flujo de Onboarding y Construcción Asistida

> **Referencia de configuración inicial:** La estructura completa del `bootstrap.json` está definida en `BOOTSTRAP_REFERENCE.md`. Todo parámetro mencionado en este PRD con referencia a `bootstrap.json` debe tener su contraparte documentada en dicho schema. Tras la ejecución del proceso de inicialización, el `bootstrap.json` pierde efecto y la configuración se gestiona exclusivamente desde el módulo de Parámetros (`settings`).

Secuencia determinista para llevar un proyecto desde la adquisición del framework hasta la construcción de la aplicación final sobre la base. Los pasos a continuación describen el ciclo de vida del producto desde la perspectiva del usuario.

1. **Adquisición:** El usuario obtiene el repositorio del framework (clone o descarga).
2. **Preparación del Entorno:** El sistema asiste en la instalación de dependencias, pero el operador humano verifica y confirma que el entorno esté correctamente configurado según el `README.md`.
3. **Configuración Inicial:** El usuario completa el archivo de configuración `bootstrap.json` con los parámetros de su proyecto. El sistema audita la configuración, presentando los resultados para que la persona apruebe antes de proceder.
4. **Proceso de Inicialización:** Bajo la instrucción explícita del usuario, el sistema ejecuta la inicialización (base de datos, Tenant Zero, Super Admin, módulos core). El sistema reporta el progreso para mantener a la persona en control.
5. **Verificación (Gate Humano):** Tras el levantamiento, es responsabilidad de la persona acceder al Dashboard con las credenciales generadas y validar visual y funcionalmente que la inicialización fue exitosa.
6. **Especificación de la Aplicación Final:** El usuario proporciona el PRD de su aplicación de negocio al sistema, definiendo la visión y reglas que la IA utilizará para el desarrollo.
7. **Construcción de la Aplicación:** Sobre la base del framework se construyen los módulos de negocio definidos en el PRD de la aplicación final, reutilizando los 27 módulos core y los mecanismos transversales (Grid Universal, Custom Fields, Audit Log, i18n, Import/Export).

**Módulos Iniciales (Bootstrap):** Durante la inicialización, el sistema pre-registra automáticamente en la tabla `modules` los **27 módulos core** del framework (listados en §3.A, §3.B, §3.C y §3.D). Estos módulos constituyen la infraestructura base del framework y deben estar disponibles desde el primer levantamiento. Post-inicialización, módulos adicionales de la aplicación derivada se registran en el Módulo de Módulos al momento de su creación, validando que el registro exista antes de implementar la lógica del módulo.

---

## 2. Arquitectura de Tenants y Autenticación

### 2.1 Modelo de Multi-Tenant

El framework soporta dos modos de operación configurables mediante el parámetro `app_mode` (inicializado desde `bootstrap.json`, gestionado post-despliegue en `settings`):

| Parámetro | Valores | Default |
|:----------|:--------|:--------|
| `app_mode` | `"saas"` \| `"corporate"` | `"saas"` |

| Aspecto | SaaS | Corporate |
|:--------|:-----|:----------|
| **Descripción** | Múltiples Tenants. Un usuario administrador (Admin) registra su cuenta y gestiona su propia empresa. | Un único Tenant que abarca toda la aplicación. Software interno de empresas. Las credenciales del primer administrador se configuran en el `bootstrap.json`. |
| **Registro público** | Habilitado | Deshabilitado |
| **Creación de Tenants** | Cualquier usuario al registrarse | Solo Super Admin |
| **Multi-Tenant** | Configurable (`allow_multi_tenant_users`) | No aplica (1 solo Tenant) |
| **Planes / Billing** | Activos | Opcionales (deshabilitables) |

**Mecanismo de habilitación/deshabilitación de módulos:** El parámetro `billing_enabled` (inicializado desde `bootstrap.json`, gestionado post-despliegue en `settings`) controla la visibilidad de los módulos de facturación (Suscripciones, Estados de Cuenta, Invoices, Planes). Cuando `billing_enabled = false` (default en modo Corporate), estos módulos se ocultan automáticamente del sidebar y sus rutas retornan 404. El flag se evalúa en el Motor de Renderizado de Menú (§4.9) y en el middleware de rutas. Los módulos siguen registrados en el Módulo de Módulos pero su campo `enabled` se establece en `false`.

**Limitante de Correo Electrónico:** Un correo electrónico (usuario) no puede pertenecer a más de un Tenant de manera simultánea en la misma aplicación, a menos que el parámetro `allow_multi_tenant_users` esté en `true` (por defecto es `false` para simplificar login).

### 2.2 Perfiles del Sistema

- **Super Admin:** Dueño de la instancia del framework y de la aplicación completa. Solo un Super Admin puede crear otro Super Admin. Tiene acceso a configuración global (Parámetros, Logs de sistema, etc.).
- **Admin:** Primer usuario de un Tenant. Tiene permisos absolutos *dentro de su propio Tenant*. Puede gestionar estados de cuenta y crear otros usuarios y **asignarles** cualquier Profile que el catálogo global del sistema tenga disponible para ese Tenant.
- **Member:** Usuario estándar del Tenant con acceso limitado por los permisos de su Profile.
- **Guest:** Usuario invitado del Tenant con permisos estrictamente de solo-lectura.

> [!NOTE]
> Los perfiles **Super Admin** y **Admin** son obligatorios para el funcionamiento del framework. Los perfiles **Member** y **Guest** se incluyen como plantilla base y pueden ser desactivados o eliminados según las necesidades específicas de la aplicación que se construya. Adicionalmente, el **Super Admin** (creador de la aplicación) puede definir perfiles adicionales desde el módulo de Profiles o en el PRD de la aplicación final. Los Admins de Tenant no tienen capacidad de crear nuevas definiciones de Profile.

> [!NOTE]
> **RBAC del Admin:** El Profile Admin tiene todos los permisos (`true`) en todos los módulos de su Tenant por defecto. La matriz de `profile_permissions` para Admin se genera con todas las acciones en `true` durante la inicialización. No se bypasea la evaluación RBAC; se garantiza que Admin siempre pase la validación. Esto permite que la lógica de permisos sea uniforme para todos los perfiles sin excepciones en el código de evaluación.

### 2.3 Flujos de Autenticación

#### 2.3.1 Login

Formulario de acceso (email + password). Flujo secuencial:

1. Validación de credenciales contra `auth.users` (Supabase).
2. Verificación del campo `status` en tabla `users`: **si `status ≠ active`, el login se rechaza** con mensaje genérico (sin revelar estado exacto). Esta validación es server-side obligatoria.
3. Si el usuario tiene 2FA activo → pantalla de código (§2.3.7).
4. Resolución de Tenant:
   - Si `allow_multi_tenant_users = true` y el User tiene >1 memberships activas → pantalla intermedia de selección de Tenant (§2.3.8).
   - Si solo tiene 1 membership → se selecciona automáticamente.
5. Creación de sesión (Supabase) inyectando el `tenant_id` del Tenant seleccionado como Custom Claim en el JWT (`app_metadata.tenant_id`), según el mecanismo definido en §4.10.
6. Redirect a la página Home definida en el Profile del usuario para ese Tenant. Si el Profile no define Home, se utiliza la Home del Tenant. Si ninguno define Home, se redirige a `/home` (Dashboard).

#### 2.3.2 Registro

Orquestado por la aplicación. Al registrar un usuario, la aplicación crea el registro principal en la tabla `users` (con `status: pending_verification`) y ejecuta la creación de la estructura de autenticación en la tabla `auth.users` de Supabase. El flujo contempla dos escenarios:

- *Nueva Cuenta (B2B/B2C):* El usuario se registra de forma independiente. Se genera siempre un nuevo `tenant` (representando a la empresa en B2B o al individuo en B2C) y se le asigna el Profile "Admin" en `user_memberships`.
- *Por Invitación (Tenant Existente):* El usuario se une a un `tenant` existente mediante una invitación emitida desde el módulo Invitaciones (§3.B). La invitación puede consumirse de dos formas: (1) ingresando un código de invitación en el formulario de registro, o (2) directamente vía URL de Invitación. El usuario queda vinculado automáticamente al `tenant` correspondiente con el Profile designado por la invitación. Al aceptar, el registro en `invitations` se actualiza a `status: accepted` con `accepted_at` y `accepted_by_user_id`.

> [!IMPORTANT]
> **Restricción multi-tenant:** Si `allow_multi_tenant_users = false` y el email invitado ya tiene membership activa en otro Tenant, la aceptación de la invitación se rechaza con error `CONFLICT` indicando que el usuario ya pertenece a otra cuenta. La invitación permanece en status `pending`.

#### 2.3.3 Verificación de Email

Flujo post-registro para confirmar la dirección de correo electrónico:

1. Trigger automático al completar el registro → email con link de verificación (TTL: `security.email_verification_ttl_hours`, §2.3.9).
2. El usuario hace clic en el link → pantalla de confirmación.
3. El sistema actualiza `users.status` de `pending_verification` a `active`.
4. Redirect a pantalla de Login.
5. Si el link expira sin ser consumido, el usuario puede solicitar un reenvío desde la pantalla de Login.

> [!NOTE]
> **Validación de formato de email:** La validación de formato de email (RFC 5322) se aplica en todos los campos de tipo email del framework (registro, invitaciones, formularios de contacto). La validación se ejecuta tanto en cliente (UI) como en server-side (Server Action con Zod schema).

#### 2.3.4 Reseteo de Contraseña

Generación de un token seguro (TTL: `security.reset_token_ttl_hours`, §2.3.9) enviado por correo electrónico que dirige al usuario a un formulario temporal de cambio de contraseña. No se envían contraseñas temporales en texto plano.

#### 2.3.5 Logout

1. Invalidación de sesión server-side (Supabase `auth.signOut()`).
2. Limpieza de estado client-side (contexto de Tenant, preferencias en memoria, tokens).
3. Redirect a pantalla de Login.

#### 2.3.6 Control de Sesiones

Parámetros (inicializados desde `bootstrap.json`, gestionados post-despliegue en `settings`):

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `security.absolute_timeout_minutes` | `1440` | Tiempo máximo de validez de una sesión (24 horas). |
| `security.session_timeout_minutes` | `30` | Timeout por inactividad. |
| `security.max_login_attempts` | `5` | Bloqueo de cuenta tras N intentos fallidos consecutivos. |

**Gestión de Sesiones Remotas y Concurrentes:** El sistema permite que un usuario mantenga múltiples sesiones simultáneas (ej. web y móvil). Desde su perfil de usuario, cada persona puede visualizar sus sesiones activas (dispositivo, IP, último acceso) y revocar sesiones remotas individualmente o cerrar todas las demás. A nivel de seguridad administrativa, cuando un Admin suspende a un usuario o cambia su nivel de acceso (Profile), o si el usuario cambia su propia contraseña, el sistema fuerza la revocación inmediata de todos los tokens activos asociados al usuario, exigiendo re-autenticación en todos los dispositivos.

#### 2.3.7 Autenticación de Doble Factor (2FA/MFA)

**Política de obligatoriedad:** El 2FA **no es obligatorio** por defecto para ningún perfil (incluido Super Admin y Admin). La política se controla en dos niveles:

| Nivel | Parámetro | Valores | Comportamiento |
|:------|:----------|:--------|:---------------|
| **Global** | `security.mfa_policy` (inicializado desde `bootstrap.json`, gestionado post-despliegue en `settings`) | `disabled` (default), `optional`, `required` | Define la política base del sistema. Si `required`, todos los usuarios de todos los Tenants deben activar 2FA. |
| **Por Tenant** | `tenants.settings.mfa_policy` (override por Tenant) | `optional` (default), `required` | Si el Admin de un Tenant lo pone en `required`, todos los usuarios de ESE Tenant deben activar 2FA, independientemente de la política global. Solo aplica si la política global es `optional` o `required`. Si la global es `disabled`, el override por Tenant no tiene efecto. El Tenant solo puede endurecer la política (escalación), nunca debilitarla. |

**Métodos soportados:**

| Método | Descripción | Requisito |
|:-------|:------------|:----------|
| **Email OTP** | Código de un solo uso enviado al email del usuario. **Método por defecto** cuando se activa 2FA. | Ninguno (el email ya existe en el registro). |
| **TOTP** | App de autenticación (Google Authenticator, Authy, etc.). Generación de QR + verificación de código. | El usuario debe configurarlo desde "Mi Perfil". |
| **SMS OTP** | Código de un solo uso enviado por SMS. | Requiere integración SMS configurada en el módulo Integraciones (§3.B). Si no existe integración SMS, esta opción no se muestra. |

**Flujos de 2FA:**

1. **Activación:** Mi Perfil → Selección de método → Si TOTP: generar QR + verificar código → Si Email/SMS: enviar y verificar código → Generar backup codes → Almacenar secret en `users.mfa_secret` (encriptado). Se registra en Log.
2. **Login con 2FA:** Post-validación de password (§2.3.1 paso 3) → Pantalla de ingreso de código según método configurado del usuario → Validación → Continuar flujo de login.
3. **Recuperación:** Si el usuario pierde acceso al método 2FA, puede ingresar uno de los backup codes generados durante la activación. Si se agotan los backup codes, el Admin del Tenant puede desactivar el 2FA del usuario desde el módulo Usuarios.

**Parámetros 2FA en `bootstrap.json` / `settings`:**

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `security.mfa_policy` | `"disabled"` | Política global: `disabled`, `optional`, `required`. |
| `security.mfa_default_method` | `"email"` | Método por defecto al activar 2FA: `totp`, `email`, `sms`. |
| `security.mfa_backup_codes_count` | `10` | Cantidad de backup codes generados por usuario al activar 2FA. |
| `security.otp_ttl_minutes` | `10` | Tiempo de vida del código OTP (Email/SMS). |

#### 2.3.8 Account Switcher (Multi-Tenant)

Aplica cuando `allow_multi_tenant_users = true` y el User tiene >1 memberships activas:

- **Post-login:** Pantalla intermedia de selección de Tenant antes del redirect al Dashboard/Home.
- **Account Switcher en Sidebar:** Selector persistente ubicado como **primera opción dentro del sidebar** (menú lateral), por encima de todos los ítems de navegación de módulos, claramente separado con un divisor visual. **No se ubica en el header ni junto al logo.** Muestra: nombre del Tenant + Profile del usuario en ese Tenant. Tenant activo resaltado.
- **Al cambiar de Tenant:** Se actualiza el Custom Claim `tenant_id` en el JWT de sesión (§4.10), se recarga la vista activa y se aplica el branding del Tenant seleccionado (§4.4).

#### 2.3.9 TTLs de Seguridad

Tokens y entidades con tiempo de vida configurable en `bootstrap.json` / `settings`:

| Token/Entidad | Parámetro | Default |
|:--------------|:----------|:--------|
| Reset Password Token | `security.reset_token_ttl_hours` | `24` horas |
| Invitación pendiente | `security.invitation_ttl_days` | `7` días |
| Link de verificación de email | `security.email_verification_ttl_hours` | `48` horas |
| Código OTP (2FA Email/SMS) | `security.otp_ttl_minutes` | `10` minutos |
| Presigned URL (Upload) | Definido en §4.6.3 | `5` minutos |

#### 2.3.10 Política de Contraseñas

Especificación completa de los requisitos de contraseña del sistema. Parámetros configurables en `bootstrap.json` / `settings`.

**Parámetros de longitud:**

| Parámetro | Default | Rango | Descripción |
|:----------|:--------|:------|:------------|
| `security.password_min_length` | `8` | 6–128 | Longitud mínima de caracteres. |
| `security.password_max_length` | `128` | 64–256 | Longitud máxima de caracteres. Previene ataques DoS por hashing de strings extremadamente largos. |

**Parámetros de complejidad (todos booleanos):**

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `security.password_require_uppercase` | `true` | Exige al menos una letra mayúscula (A-Z). |
| `security.password_require_lowercase` | `true` | Exige al menos una letra minúscula (a-z). |
| `security.password_require_number` | `true` | Exige al menos un dígito numérico (0-9). |
| `security.password_require_symbol` | `true` | Exige al menos un símbolo del set permitido. |

**Set de símbolos permitidos:**

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `security.password_allowed_symbols` | `` !@#$%^&*()_+-=[]{};\|:'",.<>?/~ `` | Set completo de símbolos aceptados. Configurable para restringir a un subconjunto. La validación rechaza símbolos fuera de este set. |

**Parámetros de ciclo de vida:**

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `security.password_expiry_days` | `0` | Días tras los cuales el sistema obliga al usuario a cambiar contraseña. `0` = sin expiración (recomendado por NIST 800-63B para sistemas con MFA). |
| `security.password_history_count` | `0` | Cantidad de contraseñas anteriores que el sistema recuerda para impedir reutilización. `0` = sin restricción. Rango: 0–24. |

> [!NOTE]
> **Implementación:** La validación se ejecuta tanto en client-side (feedback inmediato con indicador de fortaleza) como en server-side (Server Action, innegociable). Los mensajes de error pasan por i18n (§4.1) indicando específicamente qué requisito no se cumple. El set de símbolos se valida como whitelist: cualquier carácter fuera de `[a-zA-Z0-9]` + `password_allowed_symbols` se rechaza.

#### 2.3.11 Estados del User

Todo usuario del sistema tiene un campo `status` que controla su capacidad de operar:

| Estado | Descripción | Login |
|:-------|:------------|:------|
| `active` | Usuario operativo. |  Sí |
| `inactive` | Desactivado por Admin. Datos retenidos. |  No |
| `pending_verification` | Registro completado, email no verificado aún. |  No |
| `marked_for_deletion` | Marcado para eliminación. Visible en grid con indicador visual claro (badge/color). |  No |

> [!IMPORTANT]
> **Regla innegociable:** Ningún usuario con `status ≠ active` puede iniciar sesión. Validación server-side obligatoria en el flujo de Login (§2.3.1 paso 2).

**Protección del Último Admin:** El sistema prohíbe la desactivación, eliminación o cambio de perfil del último usuario con Profile "Admin" dentro de un Tenant. Validación server-side obligatoria.

#### 2.3.12 Eliminación de Usuarios (Derecho al Olvido)

Ciclo de eliminación diseñado para cumplimiento de normativas de protección de datos (GDPR, CCPA, LFPDPPP):

| Aspecto | Especificación |
|:--------|:---------------|
| **Marca para eliminación** | El usuario pasa a `status: marked_for_deletion`. **No desaparece** del grid del módulo Usuarios; aparece con indicador visual claro (badge, color diferenciado, ícono). |
| **Período de retención** | Parámetro `user_deletion.retention_days` (default: `30` días). Tiempo desde la marca hasta la ejecución del hard delete. |
| **Purga de registros del autor** | Parámetro `user_deletion.purge_authored_records` (boolean, default: `false`). Si `true`, al ejecutar hard delete se eliminan permanentemente todos los registros donde el usuario es autor (`created_by`). Si `false`, los registros se retienen y se anonimiza el campo de autoría. |
| **Job programado** | Proceso que evalúa usuarios con `status = marked_for_deletion` y cuyo período de retención ha expirado. Ejecuta: (1) purga de registros si aplica, (2) eliminación de `user_memberships`, (3) eliminación de registro en `users`, (4) eliminación de registro en `auth.users`. |
| **Cancelación** | Un Admin puede revertir la marca antes de que expire el período, restaurando al usuario a `inactive` o `active`. |
| **Auditoría** | Todo el proceso se registra en Log: marca inicial, ejecución del hard delete, conteo de registros purgados por tabla, confirmación de completitud. |

#### 2.3.13 Estados del Tenant

| Estado | Descripción | Transiciones |
|:-------|:------------|:-------------|
| `active` | Operación normal. | → `suspended`, → `marked_for_deletion` |
| `suspended` | Suspendido por falta de pago o por Super Admin. Los Admins del Tenant pueden acceder en modo solo lectura. | → `active` (pago / reactivación), → `marked_for_deletion` |
| `marked_for_deletion` | En período de retención pre-purga. Los Admins pueden acceder para exportar datos o cancelar la eliminación. | → `active` (cancelar), → `purged` |
| `purged` | Purga completada. El registro del Tenant se conserva como evidencia con campo `purge_log` (JSONB: tablas, conteos, timestamps). | Estado terminal. |

**Eliminación de Tenant:**

| Aspecto | Especificación |
|:--------|:---------------|
| **Iniciador** | Un Admin del Tenant puede solicitar la eliminación de su cuenta desde el módulo Tenants (§3.B). |
| **Marca** | El Tenant pasa a `status: marked_for_deletion`. Cambio de estado, no eliminación inmediata. |
| **Período de retención** | Parámetro `tenant_deletion.retention_days` (default: `60` días). |
| **Proceso de purga** | Procedimiento verificable: se eliminan permanentemente todos los registros del Tenant (users, memberships, datos de negocio, archivos en Storage). Se genera un `purge_log` (JSONB) con conteo de registros eliminados por tabla y timestamps. |
| **Registro de verificación** | El registro del Tenant **no se elimina**; cambia a `status: purged` con el `purge_log` como evidencia auditable. |
| **Acceso durante gracia** | Los Admins del Tenant pueden seguir accediendo durante el período de retención para exportar datos o cancelar la eliminación. |

**Parámetros de eliminación en `bootstrap.json` / `settings`:**

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `user_deletion.retention_days` | `30` | Días de retención antes de hard delete de usuario. |
| `user_deletion.purge_authored_records` | `false` | Si `true`, purga todos los registros creados por el usuario al ejecutar hard delete. |
| `tenant_deletion.retention_days` | `60` | Días de retención antes de purga completa del Tenant. |
| `tenant_deletion.trial_expired_retention_days` | `30` | Días adicionales post-grace period para Tenants con trial vencido (solo aplica si no existe plan Freemium). |

#### 2.3.14 Cleanup Automático

Job programado que ejecuta tres procesos:

1. **Usuarios no verificados:** Elimina registros que no hayan verificado su correo electrónico en `X` días (configurable en `security.cleanup_inactive_users_after_days`). **Orden de eliminación obligatorio** para respetar foreign keys: (1) `user_memberships` del usuario, (2) `user_preferences` del usuario, (3) registro en `users`, (4) registro en `auth.users` (Supabase Auth).
2. **Usuarios marcados para eliminación:** Ejecuta hard delete de usuarios cuyo período de retención (`user_deletion.retention_days`) ha expirado (§2.3.12). Se aplica el mismo orden de eliminación del punto 1, adicionalmente ejecutando la purga de registros de autoría si `user_deletion.purge_authored_records = true`.
3. **Tenants marcados para eliminación:** Ejecuta purga completa de Tenants cuyo período de retención (`tenant_deletion.retention_days`) ha expirado (§2.3.13).

El Job registra cada ejecución en el módulo Log con detalle de registros procesados.

#### 2.3.15 Autenticación Social (OAuth)

> [!NOTE]
El login con proveedores externos (Google, GitHub, Apple) es una **capacidad opcional del framework** soportada mediante Supabase Auth providers. El método base obligatorio del MVP es usuario/contraseña; OAuth queda apagado por defecto y se habilita por configuración cuando la aplicación final lo requiera.

### 2.4 Ciclo de Vida de Suscripciones

#### 2.4.1 Creación Automática

Al crear un Tenant, el sistema genera automáticamente un registro en `subscriptions` vinculado al Plan definido por `subscription.default_plan_code` en `settings`. Este parámetro se inicializa desde el `bootstrap.json` y es modificable por el Super Admin post-despliegue. Si el plan asignado tiene `trial_days > 0`, la subscription inicia en status `trialing` con fecha de expiración calculada.

#### 2.4.2 Estados y Transiciones

```
trialing → active (pago confirmado / upgrade)
         → expired (trial venció sin upgrade)

active → past_due (fallo de pago)
       → canceled (cancelación voluntaria)
       → suspended (acción administrativa)

past_due → active (pago recuperado)
         → suspended (tras grace period)

suspended → active (reactivación por Admin/Super Admin)
          → marked_for_deletion (vía §2.3.13)  # transición del Tenant, no de la Subscription
```

> [!NOTE]
> **Independencia de estados:** El estado del Tenant (§2.3.13) y el estado de la Subscription son independientes. Un Tenant puede estar `active` con subscription `expired` durante el grace period. La transición del Tenant a `suspended` se ejecuta solo cuando se cumple la condición post-grace definida en `subscription.expiry_action` (§2.4.6).

#### 2.4.3 Trial Reminder System

Mecanismo de recordatorios parametrizables para Tenants con suscripción en estado `trialing`:

| Aspecto | Especificación |
|:--------|:---------------|
| **Trigger** | Job programado que evalúa subscriptions con `status = trialing` y fecha de expiración próxima. |
| **Parámetro** | `subscription.trial_reminder_days_before`: array de días antes del vencimiento. Ej: `[7, 3, 1]` envía recordatorios a 7, 3 y 1 día(s) del vencimiento. |
| **Destinatarios** | Todos los usuarios con Profile "Admin" dentro del Tenant. |
| **Canal** | Email transaccional usando template del módulo Plantillas Email (§3.B). |
| **Contenido** | Parametrizable: días restantes, nombre del plan actual, enlace directo a upgrade, información del plan superior disponible. |
| **Registro** | Cada envío se registra en el módulo Log como evento `subscription.trial_reminder`. |

#### 2.4.4 Notification Bar (Componente UI Transversal)

Barra horizontal persistente en la parte superior de la aplicación (debajo del header, sobre el contenido) para alertas de suscripción y estado del Tenant:

| Propiedad | Valor |
|:----------|:------|
| **Posición** | Fija, debajo del header, ancho completo. |
| **Visibilidad** | Solo cuando hay información relevante: trial activo con días restantes, trial próximo a vencer, trial vencido, suscripción `past_due`, Tenant `suspended`. |
| **Contenido** | Customizable por tipo de alerta: texto informativo + días restantes + botón de acción (Upgrade / Renovar / Contactar Soporte). |
| **Dismissable** | Sí, pero reaparece en la siguiente sesión si la condición persiste. |
| **Responsive** | Ancho completo en todos los viewports. Texto se adapta a mobile (versión corta). |

#### 2.4.5 Feature Gating

Mecanismo de control de funcionalidades basado en el Plan activo:

- **Backend (obligatorio):** Helper `checkPlanFeature(tenantId, featureKey)` ejecutado en Server Actions. Valida contra el campo `plans.features` (JSONB) del plan vinculado a la subscription activa del Tenant.
- **Frontend (indicadores):** La UI oculta o deshabilita elementos que exceden los límites del plan. La Notification Bar (§2.4.4) muestra información del trial/upgrade como mecanismo de fomento.

> [!NOTE]
> **Features durante Trial:** Durante el periodo de prueba (`status = trialing`), el Tenant accede a todas las features del plan asignado sin restricción. El Feature Gating evalúa el plan vinculado a la subscription activa, independientemente de si su estado es `trialing` o `active`.

**Schema formal de `plans.features` (JSONB):**

| Key | Tipo | Default (Free) | Default (Pro) | Scope | Descripción |
|:----|:-----|:----------------|:--------------|:------|:------------|
| `max_users` | `integer` | `1` | `-1` (∞) | Framework | Límite de usuarios por Tenant. `-1` = ilimitado. |
| `storage_gb` | `integer` | `1` | `10` | Framework | Almacenamiento máximo en GB por Tenant. |
| `ai_enabled` | `boolean` | `false` | `true` | Framework | Habilita acceso al Core AI (§3.A Modelos AI). |
| `modules_allowed` | `string[]` | `["*"]` | `["*"]` | Framework | Array de `module.code` accesibles. `["*"]` = todos los módulos activos. |
| `max_api_keys` | `integer` | `0` | `10` | Framework | Límite de API Keys generables por Tenant. |
| `max_rules` | `integer` | `5` | `-1` (∞) | Framework | Límite de reglas automáticas configurables. |
| `max_custom_fields` | `integer` | `5` | `-1` (∞) | Framework | Límite de campos personalizados creables. |
| `webhook_enabled` | `boolean` | `false` | `true` | Framework | Habilita el módulo Webhooks para el Tenant. |
| `import_export_enabled` | `boolean` | `false` | `true` | Framework | Habilita import/export masivo. |
| *`custom_key`* | `any` | - | - | App | Keys extendidas definidas por la aplicación derivada. El framework no las valida, solo las almacena y las expone a `checkPlanFeature()`. |

> [!NOTE]
> **Scope Framework vs App:** Las keys con scope **Framework** son reconocidas y evaluadas automáticamente por `checkPlanFeature()`. Las keys con scope **App** son libres: el creador de la aplicación derivada las define según su negocio y las evalúa desde sus propios Server Actions usando el mismo helper. El formulario de Plans incluye un botón "Agregar feature personalizada" que permite al Super Admin crear keys custom con tipo (`boolean`, `integer`, `string`, `string[]`).

#### 2.4.6 Trial Vencido sin Upgrade

| Escenario | Comportamiento |
|:----------|:---------------|
| **Con plan Freemium disponible** | La suscripción degrada automáticamente al plan free (`subscription.expiry_action = degrade_to_free`). Funcionalidad limitada según `plans.features` del plan free. Sin riesgo de eliminación del Tenant. Sistema de notificaciones (Notification Bar + emails) fomenta el upgrade al plan de pago. |
| **Sin Freemium (solo Trial)** | Se aplica la acción definida en `subscription.expiry_action` tras el `subscription.grace_period_days`. |
| **Grace period activo** | Los Admins del Tenant siempre pueden ingresar. La Notification Bar muestra alerta urgente con fecha exacta de vencimiento y enlace a upgrade. |
| **Post-grace period sin Freemium** | El Tenant se marca para eliminación con `tenant_deletion.trial_expired_retention_days` (default: `30` días). Notificación visual (Notification Bar) + email periódico advirtiendo la eliminación permanente con fecha exacta. |

> [!IMPORTANT]
> **Regla de precedencia:** Si existe un plan con `code = "free"` o `is_freemium = true` en el catálogo de planes, el campo `subscription.expiry_action` se ignora y el sistema **siempre** degrada al plan free. La acción `expiry_action` solo se evalúa cuando no existe plan Freemium disponible.

#### 2.4.7 Parámetros de Suscripción en `bootstrap.json` / `settings`

| Parámetro | Default | Descripción |
|:----------|:--------|:------------|
| `subscription.default_plan_code` | `"trial"` | Código del plan asignado automáticamente a nuevos Tenants. Modificable por Super Admin en Settings post-inicialización. |
| `subscription.trial_reminder_days_before` | `[7, 3, 1]` | Array de días antes del vencimiento del trial para enviar recordatorios por email. |
| `subscription.expiry_action` | `"read_only_mode"` | Acción al expirar suscripción: `degrade_to_free` \| `suspend_tenant` \| `read_only_mode`. |
| `subscription.grace_period_days` | `15` | Días de gracia post-vencimiento antes de aplicar `expiry_action`. |
| `subscription.enable_notification_bar` | `true` | Habilita/deshabilita la Notification Bar de suscripción (§2.4.4). |

---

## 3. Módulos del Sistema (Core Framework)

> [!IMPORTANT]
> **Referencia Técnica Canónica:** Esta sección opera como **índice ejecutivo**. La especificación técnica completa (schemas de BD, server actions, estructura de UI, integraciones y parámetros configurables) de los 27 módulos se encuentra en **[`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md)**. Ambos documentos son complementarios: este PRD describe **qué** y **por qué**; el archivo de módulos especifica **cómo** se implementa técnicamente.

A continuación se lista la estructura de los 27 módulos del framework organizados por su bloque lógico.

### A. Módulos de aplicación (Solo Super Admin)

| Nombre (Código)                  | Qué hace                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | Por qué lo hace                                                                                                                         | Cómo se ejecuta                                                                       |
|:-------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |:--------------------------------------------------------------------------------------------------------------------------------------- |:------------------------------------------------------------------------------------- |
| **Parámetros** (`settings`)      | Configura el comportamiento global de la aplicación: branding, seguridad, notificaciones, storage, AI, billing, i18n, UI defaults, legal, cleanup e integraciones. Singleton con 12 tabs de configuración. Los valores nacen del `bootstrap.json` y se gestionan post-despliegue desde aquí. | Para controlar variables globales sin tocar código ni necesidad de redespliegue.                                                        | Singleton en BD editado vía formulario de 12 tabs.                                    |
| **Módulo de Módulos** (`module`) | Registra y configura todos los módulos del sistema. Define cómo cada módulo se presenta en el Grid Universal, participa en la Búsqueda Global y opera en Import/Export. **No configura formularios** (§4.24). 6 tabs: General, Grid, Search, Import, Export, Automatizaciones. | Para evitar mantener archivos JSON estáticos; configuración 100% en BD.                                                                 | CRUD en Módulo de Módulos (tabs de config).                                           |
| **Planes** (`plan`)              | CMS de la oferta comercial del sistema: planes de servicio con precios, límites y funcionalidades incluidas. Alimenta el Feature Gating (§2.4.5) y el ciclo de vida de suscripciones (§2.4). Catálogo inicial desde `initial_plans` del `bootstrap.json`. | Para orquestar el licenciamiento y feature gating dinámico.                                                                             | Formulario de 3 tabs (General, Precios, Features) + Grid. |
| **Modelos AI** (`ai-model`)      | Catálogo configurable de proveedores y modelos de LLM disponibles para el Core de Integración IA (§4.2). Cada registro define un modelo con sus parámetros de inferencia, endpoint y costos para tracking. | Para abstraer proveedores, modelos y parámetros del Core AI sin imponer un proveedor final a las aplicaciones derivadas.                                                                    | Formulario CRUD para registrar proveedores y modelos.                                           |
| **Log** (`log`)                  | Registro inmutable centralizado de toda actividad del sistema basado en las 5W (Quién, Qué, Cuándo, Dónde, Por qué). Centraliza acciones de usuario, eventos de sistema, envíos de email transaccional e invocaciones de IA. Visibilidad dual con RLS: Admin ve solo logs de su Tenant; Super Admin accede cross-tenant. | Para cumplir con trazabilidad estricta de seguridad, debugging, compliance y control de costos operativos en un solo punto de consulta. | Grid de solo lectura con filtros + formulario de visualización de detalle read-only. |
| **Profile** (`profile`)          | Definición de perfiles de acceso y la matriz de permisos a nivel aplicación. Los perfiles base (`Super Admin`, `Admin`, `Member`, `Guest`) se generan desde `initial_profiles` del `bootstrap.json`. Solo Super Admin gestiona definiciones de Profile. | Para establecer control de acceso granular por módulo.                                                                                  | Grid interactivo cruzando módulos y 7 acciones estándar. Master Row y Master Column. |

### B. Módulos de Configuración de Cuentas (Tenant Admin)

| Nombre (Código)                            | Qué hace                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Por qué lo hace                                                                                                                   | Cómo se ejecuta                                                        |
|:------------------------------------------ |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |:--------------------------------------------------------------------------------------------------------------------------------- |:---------------------------------------------------------------------- |
| **Tenants** (`tenant`)                   | Gestión central de la cuenta. Vista dual: formulario singleton con 7 tabs (Tenant Admin) y Grid con todos los Tenants (Super Admin). El Tenant Zero se genera desde `initial_tenant` del `bootstrap.json`. Datos: identidad, contacto, dirección, redes sociales, seguridad, branding corporativo (para documentos/PDF, NO afecta UI de la aplicación §4.8.1) y preferencias regionales. | Para que cada empresa configure sus datos, políticas de seguridad y accesos. El Super Admin retiene una vista maestra de soporte. | Formulario Singleton de 7 tabs (Tenant Admin) / Grid (Super Admin).   |
| **Usuarios** (`user`)                      | Gestión de miembros del equipo. Permite invitar usuarios (vía URL de Invitación), reasignar perfiles, desactivar y marcar para eliminación (§2.3.12). Visualiza estados de usuario (§2.3.11) con indicadores visuales diferenciados. | Para gestionar el ciclo de vida completo del usuario incluyendo eliminación con derecho al olvido. | Grid CRUD con envío de URLs de Invitación. Indicadores de estado por usuario. |
| **Invitaciones** (`invitation`)            | Gestión del ciclo de vida de invitaciones a usuarios del Tenant. Permite crear invitaciones (por link o código), visualizar estado (`pending`, `accepted`, `expired`, `revoked`) y métricas de conversión. TTL configurable via `security.invitation_ttl_days`. | Para controlar el flujo de incorporación de usuarios al Tenant con trazabilidad completa y métricas de adopción. | Grid con filtros por status + Formulario de creación de invitación. |
| **Notificaciones** (`notification`)        | Grid de notificaciones con formulario de visualización read-only. Se generan por: acciones administrativas, eventos del sistema y Event Bus (§4.13). Presentación por nivel: modal confirmable (`critical`), toast auto-cierre (`info`/`success`/`warning`). Componentes en header: campana con badge + dropdown. Preferencias por usuario: matriz módulo × canal. | Para gestionar alertas del sistema de forma centralizada, evitar fatiga de notificaciones y personalizar el flujo de información por usuario. | Grid con filtros por estado + panel dropdown en header + detalle read-only. |
| **Reglas** (`rule`)                        | Motor no-code de reglas "Causa-Efecto" vinculadas a eventos CRUD vía Event Bus (§4.13). Ejecución asíncrona con retry diferenciado por tipo de acción: acciones externas (`call_webhook`, `send_email`) reintentan con backoff exponencial; acciones locales (`update_field`, `send_notification`) sin retry automático. | Para automatizar tareas sin programación garantizando resiliencia sin bloquear flujos de usuario. | Builder visual de trigger + condiciones + acción. |
| **Campos Personalizados** (`custom-field`) | Motor dinámico para agregar campos extra a registros. 9 tipos de datos: `text`, `textarea`, `number`, `boolean`, `date`, `select`, `multi-select`, `email`, `url`. Almacena valores en columna JSONB `custom_data` de la entidad destino (sin EAV). Validación en cliente y Server Action. | Para adaptar la app a cualquier negocio permitiendo tipado fuerte a nivel UI sin migrar esquemas SQL. | UI para configurar campos y auto-renderizado en formularios. |
| **Plantillas Email** (`email-template`)    | CMS de plantillas de correo transaccional con variables dinámicas `{{variable}}`. Resolución jerárquica: override por Tenant > plantilla global. Plantillas base del sistema pre-cargadas en inicialización. | Para estandarizar comunicaciones sin quemarlas en código. | Editor HTML/WYSIWYG con preview y envío de prueba. |
| **API Keys** (`api-key`)                   | Credenciales programáticas M2M. Cada key hereda permisos del Profile asignado y opera con aislamiento RLS idéntico a un usuario humano. Key en texto plano mostrada una sola vez. Acciones registradas en logs con `auth_method: "api_key"`. | Para permitir integración segura vía APIs (Server-to-Server) con control de acceso preciso. | Formulario generador (hash único, mostrado una vez). |
| **Integraciones** (`integration`)          | Conexiones con servicios externos por Tenant: proveedores AI, almacenamiento, email, SMS/WhatsApp y pagos. Almacena credenciales cifradas con encryption at rest y estado de conexión verificable. | Para vincular servicios externos de forma segura sin hardcodear proveedores en el framework. | Formulario con test de conexión integrado. |
| **Webhooks** (`webhook`)                   | Endpoints de salida para emitir eventos HTTP firmados con HMAC-SHA256. Catálogo de eventos suscribibles por módulo. Retry con backoff exponencial (3 intentos). Desactivación automática tras 10 fallos consecutivos. | Para notificar a sistemas de terceros en tiempo real con contratos de seguridad estrictos. | UI de configuración de endpoint con selector de eventos + historial de entregas. |
| **Documents** (`document`)                 | CMS interno para contenido de conocimiento del Tenant: manuales, políticas, procedimientos. Soporta contenido enriquecido, categorización por tags (§3.C), vinculación a archivos (§3.C), relaciones multi-nivel y versionado mediante `document_versions`. Estados: `draft`, `published`, `archived`. | Para gestionar textos inyectables en la app sin tocar código, con control de versiones y trazabilidad. | Editor rich text con historial de versiones. |
| **Import** (`import`)                      | Importación masiva desde CSV y XLSX. Wizard de 4 pasos: módulo destino → upload → mapeo de columnas → preview + confirmación. Procesamiento asíncrono para archivos grandes. Historial con métricas de éxito/error. | Para ingestar datos masivos de forma segura con monitoreo de progreso. | Wizard de mapeo visual + Grid de historial con estado en tiempo real. |
| **Export** (`export`)                      | Exportación de datos a CSV y XLSX. Procesamiento asíncrono. Enlaces de descarga temporales. | Para evitar bloqueos HTTP en reportes masivos con monitoreo de progreso. | Grid de historial con descarga diferida y notificación de completado. |
| **Suscripciones** (`subscription`)         | Gestión del ciclo de vida comercial de los Tenants. Cada Tenant tiene exactamente una suscripción vinculada a un Plan (§3.A). Controla trial, facturación y degradación automática. Modelo de licenciamiento configurable (`per_tenant` o `per_user`) desde `bootstrap.json`. Admin ve su suscripción (singleton); Super Admin accede al Grid completo. | Para orquestar el licenciamiento flexible y alimentar el proceso de facturación con datos precisos. | Grid CRUD / Vista singleton según rol. Acciones: upgrade, downgrade, cancelación. |
| **Estados de Cuenta** (`statement`)        | Consolidado financiero del Tenant por ciclo de facturación. Recibe el resultado del cálculo de suscripciones, genera desglose de líneas de costo y desencadena la acción de cobro que produce un Invoice. | Para que el Admin visualice el desglose completo de costos y gestione métodos de pago. | Vista integrada al adapter de pagos configurado. Desglose por suscripción. |
| **Invoices** (`invoice`)                   | Registro contable inmutable de transacciones de pago procesadas. El contenido (monto, descripción, moneda) es inmutable; solo el status (`processed`, `voided`, `reversed`) puede cambiar. PDF con branding limitado del Tenant. | Para el registro contable definitivo con trazabilidad inmutable y soporte de anulaciones. | Grid read-only con filtros por status/período + descarga PDF. |

> **PDF de registros:** La exportación a PDF no pertenece al módulo Export de datasets. El PDF se genera al exportar un registro individual desde su vista de detalle/formulario en la UI, con branding del Tenant. Casos existentes: factura (`invoice`) y estado de cuenta (`statement`).

### C. Módulos de funcionalidades comunes para aplicaciones SaaS

| Nombre (Código)            | Qué hace                                                 | Por qué lo hace                                                                                                        | Cómo se ejecuta                       |
|:-------------------------- |:-------------------------------------------------------- |:---------------------------------------------------------------------------------------------------------------------- |:------------------------------------- |
| **Files** (`file`)         | Gestión centralizada de archivos del Tenant. Vinculación polimórfica a registros de cualquier módulo (`entity_type` + `entity_id`). Backend en Supabase Storage con cuotas por Tenant. Componente `FileUploader` inyectable en formularios. | Para mantener trazabilidad de todo archivo que ingrese al sistema con gestión centralizada. | Grid CRUD + componente inyectable FileUploader (drag & drop). |
| **Tags** (`tag`)           | Etiquetas transversales por Tenant con tabla pivote polimórfica. Componente `TagSelector` inyectable en formularios con autocompletado y creación inline. Scope siempre por Tenant (nunca cross-tenant). | Para clasificar rápidamente cualquier registro en cualquier módulo. | Componente `TagSelector` inyectable en formularios de cualquier módulo. |
| **Bookmarks** (`bookmark`) | Marcadores de accesos directos por usuario y Tenant. Límite configurable (`max_bookmarks_per_user` en `ui_defaults`). Label auto-resuelto desde `display_field` del módulo. | Para navegación ágil hacia registros de alto uso. | Icono toggle en Grid + panel dropdown en sidebar. |
| **Filtros** (`filter`)     | Filtros guardados por usuario y módulo con visibilidad configurable (`private`, `shared`). Persisten condiciones, ordenamiento y columnas visibles del Grid Universal. | Para que los usuarios reutilicen configuraciones de búsqueda frecuentes. | Dropdown seleccionable en los Grids + botón "Guardar filtro actual". |

### D. Módulo Demostrativo

| Nombre (Código)    | Qué hace              | Por qué lo hace                                                              | Cómo se ejecuta                |
|:------------------ |:--------------------- |:---------------------------------------------------------------------------- |:------------------------------ |
| **Tasks** (`task`) | Módulo de referencia canónico que implementa la Triada completa con TODAS las integraciones del framework: Grid Universal, Búsqueda Global, Campos Personalizados, Tags, Bookmarks, Filtros, Import/Export, Event Bus e Interceptor de Auditoría. Todo módulo nuevo debe seguir este patrón. | Para validar que todas las integraciones (RLS, Grid, Auth, Custom Fields) funcionan juntas. | CRUD completo de tareas para benchmark y referencia. |

---

## 4. Funcionalidades Transversales

Estas funciones actúan horizontalmente en todos los módulos de la aplicación, inyectando comportamientos estándar y complementarios sin ser módulos por sí mismos (no cumplen la triada definida en §1.3).

### 4.1 Internacionalización (i18n)

- **Localización por Defecto:** Los idiomas soportados por el framework y el idioma por defecto se configuran inicialmente (inicializado desde `bootstrap.json`, gestionado post-despliegue en `settings`). Esta configuración opera como parámetro global y luego se hereda directamente a nivel Tenant como idioma por defecto, pero cada Tenant puede modificarla de acuerdo a sus necesidades específicas.
- **Preferencia Individual:** Cada usuario puede modificarla estableciendo su propio `locale` (ej. Inglés, Español, etc.).
- **Traducciones requeridas:** Labels de campos, títulos/subtítulos, placeholders, mensajes de ayuda, botones, mensajes de notificaciones/dialogs, mensajes de validación (Zod), en general todo mensaje visible a usuarios debe provenir del sistema i18n.
- **Librería:** `next-intl` con ICU Message Format.
- **Formato de archivos:** JSON exclusivamente (no TypeScript).
- **Idioma fuente:** `es` (español) es el source of truth. `en` (english) como segundo idioma incluido en el bootstrap.
- **Estructura de directorios:** Las traducciones se co-localizan separando framework y aplicación. Los namespaces base viven en `src/framework/i18n/`; cada módulo de aplicación puede co-localizar sus propios archivos `i18n/` junto al módulo.

```
src/
├── framework/i18n/
│   ├── es/ { common.json, layout.json, validation.json, auth.json, account.json, ... }
│   └── en/ { common.json, layout.json, validation.json, auth.json, account.json, ... }
└── web/modules/[module]/
    └── i18n/
        ├── es.json
        └── en.json
```

- **Convención de nombrado:** Cada namespace JSON se nombra con el `code` del módulo en singular y `snake_case`, alineado con §6.1. Excepción documentada: el módulo técnico `tenant` expone sus textos de UI bajo `account.json`, porque el usuario final ve "Account/Cuenta" y nunca "Tenant".
- **Namespaces base siempre cargados:** `common`, `layout`, `validation`. `auth` se carga solo en rutas de autenticación.
- **Code Splitting por ruta:** Cada página/ruta carga únicamente los namespaces base requeridos + el namespace del módulo activo. Esto evita enviar al cliente el diccionario completo de todos los módulos:

```ts
// Carga selectiva (base + namespace de la ruta activa)
const messages = {
  ...(await import(`@fw/i18n/${locale}/common.json`)).default,
  ...(await import(`@fw/i18n/${locale}/layout.json`)).default,
  ...(await import(`@fw/i18n/${locale}/validation.json`)).default,
  ...(await loadModuleMessages(locale, namespace))
};
```

- **Extensibilidad:** Al crear un nuevo módulo de aplicación, el desarrollador agrega archivos `i18n/es.json` e `i18n/en.json` dentro del módulo. El registro del módulo declara el namespace a cargar.

### 4.2 Core de Integración IA

Capa de **Server Actions** en el backend que actúa como proxy unificado para consumir LLMs externos (OpenAI, Anthropic, Google, etc.). Cualquier módulo o funcionalidad del framework puede invocar esta capa para ejecutar tareas de IA sin implementar lógica directa de conexión a proveedores.

- **Qué es técnicamente:** Un conjunto de Server Actions en `src/framework/ai/` que exponen funciones reutilizables (ej. `generateText()`, `analyzeDocument()`, `suggestContent()`). Estas funciones encapsulan la autenticación, el enrutamiento al proveedor correcto y el registro de uso.

- **Fuentes de configuración (3 dependencias):**

| Fuente                   | Tabla          | Qué aporta                                                                                                                                                                     |
|:------------------------ |:-------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Parámetros** (§3.A)    | `settings`     | Flag global `ai_enabled` (boolean) que habilita/deshabilita toda funcionalidad IA en la aplicación. Modelo por defecto (`ai_default_model_id`).                                |
| **Modelos AI** (§3.A)    | `ai_models`    | Catálogo de proveedores registrados: nombre del modelo, proveedor (`provider`), endpoint base, parámetros de inferencia (`temperature`, `max_tokens`), costos para cálculo de consumo (`cost_per_1k_tokens_input`, `cost_per_1k_tokens_output`), estado activo/inactivo. |
| **Integraciones** (§3.B) | `integrations` | Credenciales (API keys) del proveedor por Tenant. Las llaves se almacenan cifradas y se resuelven en runtime.                                                                 |

- **Flujo de ejecución:**
  
  1. El módulo consumidor invoca un Server Action del Core IA (ej. `suggestTitle(entityType, context)`).
  2. El Core verifica que `ai_enabled === true` en `settings`. Si no, retorna error controlado.
  3. Resuelve el modelo a utilizar: el parámetro explícito de la invocación, o `ai_default_model_id` de `settings`.
  4. Consulta `ai_models` para obtener configuración del proveedor (endpoint, parámetros).
  5. Consulta `integrations` para obtener la API key del proveedor correspondiente al Tenant activo.
  6. Invoca al **Core AI** (runtime Python independiente, §6.3) mediante `fetch()` nativo a su API REST interna. El Core AI ejecuta la llamada al LLM externo utilizando la configuración del proveedor resuelta en los pasos 3-5. La comunicación se autentica con `CORE_AI_SECRET` (§6.3).
  7. Registra la invocación en el módulo Log (§3.A) como `ai.invocation` con metadata: `model_id`, `tokens_input`, `tokens_output`, `estimated_cost_usd` (ver §6.2 Tracking de Costos IA).
  8. Retorna la respuesta procesada al módulo consumidor.

- **Restricciones de arquitectura:**
  
  - No es un módulo (no cumple la triada §1.3). No posee tablas propias ni UI independiente.
  - No almacena información fuera del registro en el módulo "log" por auditoría. Si el modulo o función que invoca las llamadas al Core IA requiere almacenar información, es ése módulo o función quien deberá tener la lógica de registro de información en la DB. Ej. si es un chatbot, el Core IA solo se encarga de la ejecución y devolución de la respuesta, el procesamiento de la respuesta debe ser efectuado por la lógica que invocó al Core IA, en otras palabras, toda mutación de datos derivada de una respuesta IA es responsabilidad del módulo consumidor, no del Core IA.

- **Casos de uso del framework:**
  
  - Sugerencia de títulos y descripciones al crear registros.
  - Análisis de documentos (PDFs, texto) adjuntos a registros.
  - Asistente contextual en formularios.
  - Chatbot, asistentes de IA, etc.

### 4.3 Búsqueda Global (Search)

Punto de búsqueda central ubicado en el Header de la aplicación que rastrea información en múltiples módulos simultáneamente.

- **Activación:** Campo de búsqueda persistente en el Header. También accesible vía atajo de teclado (`Ctrl+K` / `⌘+K`) que abre un overlay tipo Command Palette centrado en pantalla.

- **Parametrización:** El buscador consulta dinámicamente cualquier módulo que tenga el flag `searchable: true` activo en su registro dentro de la tabla `modules`. La configuración completa de búsqueda (campos participantes, formato de retorno, límite de resultados) se administra desde el **tab "Search"** del Módulo de Módulos (§4.7.6).

- **Presentación de resultados:**
  
  - Los resultados se muestran en un **panel desplegable (dropdown overlay)** debajo del campo de búsqueda, o dentro del Command Palette si se activó vía atajo.
  - Los resultados se **agrupan visualmente por módulo**. Cada grupo muestra el nombre del módulo como encabezado de sección (ej. "Contactos", "Tareas", "Usuarios").
  - Cada resultado individual muestra:

| Elemento             | Descripción                                                                                                                                  |
|:-------------------- |:-------------------------------------------------------------------------------------------------------------------------------------------- |
| **Icono del módulo** | Icono registrado en la tabla `modules` para identificación visual inmediata.                                                                 |
| **Título principal** | Campo primario del registro (ej. nombre del contacto, título de la tarea). Definido por `display_field` en la configuración del módulo.      |
| **Subtítulo**        | Campo secundario opcional para contexto adicional (ej. email, estado). Definido por `display_subtitle_field` en la configuración del módulo. |
| **Badge de módulo**  | Etiqueta con el nombre del módulo al que pertenece el resultado (ej. `Contactos`, `Oportunidades`).                                          |

- **Navegación directa:** Al hacer click en un resultado, el sistema navega a la ruta del módulo correspondiente y abre el formulario del registro seleccionado en modo lectura/edición (según los permisos del usuario). La URL resultante sigue la convención de §6.1: `/{locale}/[module-slug]/{record-id}`.

- **Comportamiento técnico:**
  
  - **Debounce:** La búsqueda se ejecuta tras 300ms de inactividad en el teclado (no en cada keystroke).
  - **Mínimo de caracteres:** Se requiere un mínimo de 3 caracteres para disparar la consulta.
  - **Límite de resultados:** Máximo configurable de resultados por módulo (default: `ui_defaults.default_search_result_limit` = 5, personalizable por módulo en `search_result_limit`). Si existen más coincidencias, se muestra un enlace "Ver todos los resultados en [Módulo]" que redirige al Grid del módulo con el filtro de búsqueda pre-aplicado.
  - **Seguridad:** Los resultados respetan RLS. El usuario solo ve registros de su Tenant y de módulos a los que su Profile tiene acceso de lectura.
  - **Estado vacío:** Si no hay coincidencias, muestra mensaje "Sin resultados para `[query]`".

- *Nota: La búsqueda a nivel de Grid (filtros de columna, búsqueda local) es independiente del Search Global y opera exclusivamente dentro del módulo activo.*

### 4.4 Redirección de Home

- **Cascada de resolución de Home:** La URL de inicio se resuelve mediante cascada: **Profile** → **Tenant** → **Default (`/home`)**. El campo `home_url` en `profiles` define la página de aterrizaje por perfil (ej. Admin → `/dashboard`, Member → `/task`). Si `profiles.home_url` es `NULL`, se evalúa `tenants.home_url`. Si ambos son `NULL`, se usa `/home` por defecto.
- **Vista Home Per-Tenant:** La vista `/home` es estrictamente **per-tenant** (basada en el Tenant activo). Si un usuario pertenece a múltiples cuentas, la vista `/home` reflejará únicamente los datos de la cuenta seleccionada en el switcher.

### 4.5 Papelera de Reciclaje (Soft Delete)

Funcionalidad nativa del framework (no un módulo independiente). No existe una tabla separada para registros eliminados; se utiliza la misma tabla de negocio identificando el estado del registro (ej. `deleted_at`).

- **Visualización:** En el grid de cada módulo existe una opción para alternar y visualizar los registros eliminados.
- **Seguridad:** Los registros en papelera solo son visibles si el usuario mantiene permisos de lectura sobre ellos (respetando RLS).
- **Acciones Restringidas:** Solo el usuario autor de los registros o un usuario con Profile de Administrador puede ejecutar la reversión (restaurar).
- **Restauración:** Se habilita la opción de "Restaurar" en la interfaz. Al restaurar, se limpia `deleted_at`, se retiene el histórico de quién lo había borrado (`deleted_by`) para trazabilidad, se registra `restored_at` y `restored_by`, y se añade un nuevo registro de auditoría indicando la restauración.
- **Política de Restauración Huérfana:** Si el usuario original (`deleted_by`) ya no existe en el sistema al momento de restaurar, el sistema reasignará el log de restauración al Admin actual que ejecuta la acción, registrando el cambio en el log de auditoría.
- **Purga definitiva (hard delete):** Solo puede ser ejecutada por un usuario Administrador o por el sistema programado de purga si este está activo a nivel de la Cuenta.
- **Purga Automática:** Controlada por `soft_delete.auto_purge_days` (inicializado desde `bootstrap.json`, gestionado post-despliegue en `settings`, default: `90`). Cuando está activo, un job programado (§6.4) ejecuta hard delete de registros con `deleted_at` anterior a X días. El parámetro es por Tenant (override en `tenants.settings`) o global.

### 4.6 File Management (Storage Infrastructure)

Infraestructura transversal y abstracción de almacenamiento de archivos en buckets (Supabase Storage). Sirve de base física para el módulo **Files** (`file`, §3.C) y cualquier otra entidad del sistema que requiera gestión de archivos.

#### 4.6.1 Categorías de Buckets

| Bucket              | Tipo    | Estructura de Paths                                              | Uso                                                                                              |
| ------------------- | ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `public_assets`     | Público | Plana UUID (`/{uuid}.webp`)                                      | Avatares, logos, branding. Sin `tenant_id` para evitar enumeración. Mapeo por tabla relacional. |
| `private_documents` | Privado | Jerárquica (`/{tenant_id}/{entity_type}/{entity_id}/{file_id}`) | Archivos de negocio vinculados a registros de cualquier módulo                                   |
| `imports`           | Privado | `/{tenant_id}/imports/{job_id}/{filename}`                      | Archivos CSV/Excel de importación temporal                                                       |
| `exports`           | Privado | `/{tenant_id}/exports/{job_id}/{filename}`                      | Archivos generados para descarga (exportaciones)                                                 |

*Nota sobre nomenclatura jerárquica:*

- **`{entity_type}`**: Corresponde al nombre físico o lógico del módulo/tabla al que se asocia el archivo (por ejemplo: `tasks`, `invoices`, `users`).
- **`{entity_id}`**: Es el UUID del registro específico dentro de ese módulo.
  Esta estructura permite aplicar políticas de seguridad (RLS) estrictas a nivel de bucket basadas en el módulo, aísla los archivos y facilita la limpieza (si se borra un registro, se puede purgar fácilmente su carpeta asociada).

#### 4.6.2 Políticas de Seguridad (CSP y CORS)

Para mitigar riesgos de XSS y exposición de datos en el bucket de Storage:
- **CORS:** El bucket se configura para aceptar solicitudes únicamente desde los dominios autorizados de la aplicación (definidos en las variables de entorno de producción).
- **CSP (Content Security Policy):** Todos los archivos servidos directamente desde el storage (a través de links de descarga o preview) se configuran con cabeceras `Content-Disposition: attachment` (excepto imágenes y PDFs que pueden requerir visualización inline segura). Se prohíbe explícitamente la ejecución de scripts (HTML/JS) servidos desde el bucket.

#### 4.6.3 Optimización WebP

Si el flag `features.image_optimization_webp` del `bootstrap.json` / `settings` está en `true`, todo asset de imagen subido al sistema debe convertirse automáticamente a formato `.webp` antes de almacenarse en Supabase Storage. Aplica a avatares, logos y cualquier archivo con MIME type `image/*` (excepto SVG, que se almacena sin conversión).

#### 4.6.4 Upload API (Presigned URL Flow)

Patrón obligatorio para la carga de archivos. El cliente **nunca** envía el archivo al servidor Node.js/Vercel; en su lugar, solicita un ticket (Presigned URL) y realiza el upload directamente desde el navegador hacia Supabase Storage.

**Flujo de upload en 4 pasos:**

1. **Solicitud** - El cliente invoca el Server Action `requestUpload(entityType, entityId, fileName, mimeType, sizeBytes)`.
   - Valida permisos RBAC del usuario sobre el módulo destino.
   - Valida MIME type contra la whitelist de tipos permitidos (§4.6.5).
   - Valida tamaño del archivo contra los límites del Plan activo (Feature Gating).
   - Determina el bucket destino según el tipo de entidad.
   - Genera un Presigned URL de Supabase Storage con TTL de 5 minutos.
   - Retorna: `{ presignedUrl, storageKey, fileId }`.

2. **Upload directo** - El cliente ejecuta `PUT` directamente a la Presigned URL de Supabase Storage, bypaseando completamente el servidor Node.js. Incluye indicador de progreso en el componente UI.

3. **Confirmación** - El cliente invoca el Server Action `confirmUpload(fileId, storageKey)`.
   - Verifica que el archivo existe físicamente en el bucket.
   - Si es imagen y el flag WebP está activo (§4.6.3), ejecuta conversión a `.webp`.
   - Crea el registro en la tabla `files` del módulo Files (§3.C) con toda la metadata.
   - Registra la acción en el módulo Log (auditoría).
   - Retorna: `{ file record completo }`.

4. **Cancelación** - Si el upload falla o el usuario cancela, se invoca `cancelUpload(fileId)` para limpiar la Presigned URL y cualquier archivo parcial.

> [!IMPORTANT]
> **Regla universal:** Todo archivo que ingrese al sistema, independientemente del punto de entrada en la UI, DEBE generar un registro en la tabla `files`. No existen uploads "anónimos" ni archivos sin registro en BD.

**Tabla de puntos de carga y su comportamiento:**

| Módulo origen | Tipo de archivo | Bucket destino | `entity_type` en `files` | Notas |
|:--|:--|:--|:--|:--|
| **User** (avatar) | Imagen perfil | `public_assets` | `users` | El campo `avatar_url` en `users` referencia al `file_id` |
| **Tenant** (logo) | Imagen branding | `public_assets` | `tenants` | Similar a avatar |
| **Settings** (branding) | Imágenes logo | `public_assets` | `settings` | 4 variantes de logo definidas en §4.8 |
| **Import** | CSV/Excel | `imports` | `imports` | Archivo temporal con TTL. Se purga tras procesamiento |
| **Export** | CSV/Excel generado | `exports` | `exports` | Generado por el sistema, no por el usuario |
| **Tasks** (demo) | Cualquier adjunto | `private_documents` | `tasks` | Caso demo de adjuntos a registro de negocio |
| **Cualquier módulo futuro** | Archivos de negocio | `private_documents` | `{nombre_tabla}` | Patrón polimórfico estándar |

#### 4.6.5 Componente FileUploader (UI Reutilizable)

Componente React transversal inyectable en cualquier formulario del framework. Se implementa como parte del Design System y se renderiza automáticamente cuando un módulo define campos de tipo archivo en su configuración.

**Variantes:**

| Variante | Uso | Comportamiento |
|:--|:--|:--|
| `single` | Avatar, logo, imagen de portada | Zona de drop + preview del archivo. Reemplaza archivo anterior al subir uno nuevo (mantiene versionado). |
| `multi` | Adjuntos en registros de negocio | Zona de drop + lista de archivos con indicador de progreso individual. Permite múltiples archivos simultáneos. |
| `restricted` | Import (CSV), formatos específicos | Acepta solo MIME types configurados. Muestra mensaje de restricción si el tipo no es válido. |

**Comportamiento común:** Drag & Drop + click para seleccionar + indicador de progreso + validación client-side (MIME type y tamaño) antes de iniciar el flujo de Presigned URL.

#### 4.6.6 Whitelist de MIME Types y Límites

Configuración centralizada en `settings` (Parámetros), con valores default provistos por `bootstrap.json`:

| Parámetro | Ubicación bootstrap.json | Default | Descripción |
|:--|:--|:--|:--|
| `storage.allowed_mime_types` | `features.storage` | `["image/*", "application/pdf", "text/csv", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"]` | Whitelist de MIME types aceptados. Extensible por el Super Admin. |
| `storage.max_file_size_mb` | `features.storage` | `25` | Tamaño máximo por archivo individual en MB. |
| `storage.max_storage_per_tenant_mb` | `features.storage` | `1024` | Cuota de almacenamiento por Tenant, vinculable a Feature Gating del Plan. |

La validación de MIME se ejecuta tanto en client-side (UX inmediata) como en server-side (seguridad). El tamaño total de almacenamiento por Tenant se calcula como `SUM(size_bytes)` de los registros activos en la tabla `files` filtrados por `tenant_id`.

#### 4.6.7 Versionado de Archivos

Cuando un archivo se reemplaza (variante `single` del FileUploader o acción explícita de "nueva versión"):

- Se crea un **nuevo registro** en la tabla `files` con `version` incrementado y `previous_version_id` apuntando al registro anterior.
- Todas las versiones comparten `file_group_id`, y sólo una fila por `(tenant_id, file_group_id)` puede tener `is_current = true`.
- El archivo físico anterior **permanece** en Storage hasta que se ejecute una purga manual o el sistema de cleanup automático lo procese.
- El registro anterior se marca con `is_current = false`.
- Solo la versión marcada como `is_current = true` se muestra por defecto en la UI. El historial de versiones es accesible desde el detalle del archivo en el módulo Files.

#### 4.6.8 Cleanup y Ciclo de Vida

Política de limpieza de archivos físicos en Supabase Storage, vinculada al ciclo de vida de los registros:

| Evento | Acción sobre archivo físico | Acción sobre registro `files` |
|:--|:--|:--|
| **Soft-delete** del registro padre | El archivo permanece en Storage | El registro `files` hereda `deleted_at` del padre |
| **Hard-delete / Purge** del registro padre | Se elimina el archivo de Storage | Se ejecuta hard-delete del registro `files` |
| **Eliminación de Tenant** | Se purga el directorio `/{tenant_id}/` completo | Se eliminan todos los registros `files` del Tenant |
| **Archivos temporales** (Import/Export) | Se purgan automáticamente tras un TTL configurable (default: 72h) | El registro `files` se marca como expirado y se purga |
| **Versiones anteriores** de archivos | Se purgan según política de retención configurable en Settings (default: mantener últimas 5 versiones) | Registros con `is_current = false` se purgan según política |

### 4.7 Motor de Vistas (Universal View / Grid Universal)

Componente maestro de renderizado tabular que gestiona dinámicamente los Grid Universales de **todos** los módulos del framework. No es un módulo (no cumple la triada §1.3), sino la infraestructura visual reutilizable que todo módulo hereda automáticamente. Se implementa como un componente React parametrizable (`DataGrid`) que recibe su configuración desde la base de datos.

> [!NOTE]
> En el contexto de este documento, **Grid**, **Grid Universal** y **Vista de módulo** se refieren a la misma interfaz: la tabla interactiva que presenta los registros de un módulo específico, definida como la tercera condición de la triada en §1.3.

#### 4.7.1 Anatomía Visual del Grid

Cada vista de Grid se compone de las siguientes zonas, renderizadas de arriba hacia abajo:

| Zona  | Nombre                   | Contenido                                                                                                                                                                                                                                                                                              |
|:----- |:------------------------ |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1** | **Header del módulo**    | Breadcrumb (si habilitado en Parámetros) + título del módulo (i18n).                                                                                                                                                                                                                                   |
| **2** | **Action Bar (Toolbar)** | Barra de acciones contextual. Renderiza dinámicamente solo los botones que el Profile del usuario tiene permitidos: Crear (+New), Importar, Exportar, Eliminar seleccionados, y **Papelera** (toggle de Soft Delete §4.5). Incluye el botón Refresh (re-query sin recargar página). El botón de Papelera alterna entre registros activos (`deleted_at IS NULL`) y registros eliminados (`deleted_at IS NOT NULL`): cuando está **inactivo** se muestra en estado neutro (ícono outline); cuando está **activo** se resalta visualmente (ícono filled + badge o cambio de color) indicando que el Grid muestra exclusivamente registros en papelera. Al activarse, la Action Bar adapta sus acciones contextuales (Restaurar, Purgar reemplazan a Editar, Eliminar). Visible solo si el usuario tiene al menos un permiso de acción. |
| **3** | **Barra de filtros**     | Fila con: campo de búsqueda local (filtro de texto sobre las columnas visibles) y selector de Filtros guardados (módulo Filtros §3.C). |
| **4** | **Tabla de datos**       | Grid Universal tabular cuyas columnas, tipos de contenido y formato de renderizado se definen desde el Módulo de Módulos (§4.7.2). El usuario puede personalizar su vista individual: reordenar columnas (drag & drop de headers), ocultar/mostrar columnas, cambiar ordenamiento y tamaño de página; estas preferencias se persisten automáticamente en `user_preferences` según la cascada de personalización (§4.7.3). Soporta ordenamiento por columna (click en header), selección de filas (checkbox individual + "Seleccionar todo"), e inyección de Campos Personalizados (§4.12) como columnas adicionales. |
| **5** | **Footer de paginación** | Controles de paginación server-side: página actual, total de páginas, total de registros, selector de registros por página. Indicador de Smart Selection ("N registros seleccionados" o "Todos los X,XXX seleccionados").                                                                              |

#### 4.7.2 Fuente de Configuración: Módulo de Módulos (§3.A)

Cada columna visible en el Grid se configura exclusivamente desde el **Módulo de Módulos** (tabla `modules`), en su tab "Grid/View" (decisión D12 del inventario documental). Cada entrada en `grid_columns` especifica el campo de origen en BD, su etiqueta i18n, el tipo de renderizado del contenido en la celda, y propiedades de comportamiento (ordenable, filtrable, visible). Los tipos de renderizado disponibles (`type`) determinan cómo el Grid presenta el valor de cada celda al usuario. Esta configuración define:

| Campo en `modules`       | Tipo       | Descripción                                                                                                                                                                                                                                                                                                                                 |
|:------------------------ |:---------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `grid_columns`           | `JSONB[]`  | Arreglo ordenado de definiciones de columna. Cada entrada define: `field` (nombre del campo en BD), `label_key` (clave i18n para el encabezado), `type` (text, number, date, boolean, badge, avatar, link), `width` (ancho en px o porcentaje), `sortable` (boolean), `filterable` (boolean), `visible` (boolean, visibilidad por defecto). |
| `grid_default_sort`      | `JSONB`    | Ordenamiento por defecto: `{ field: string, direction: "asc" \| "desc" }`.                                                                                                                                                                                                                                                                  |
| `grid_default_page_size` | `integer`  | Registros por página por defecto para este módulo. Si es `null`, hereda `ui_defaults.default_page_size` del `bootstrap.json` / `settings`.                                                                                                                                                                                                       |
| `grid_row_actions`       | `string[]` | Acciones disponibles por fila: `["view", "edit", "delete", "duplicate"]`. El Grid renderiza solo las que el Profile del usuario tiene permitidas.                                                                                                                                                                                           |
| `display_field`          | `string`   | Campo primario para representar el registro fuera del Grid (ej. en Search Global §4.3, Bookmarks, relaciones).                                                                                                                                                                                                                              |
| `display_subtitle_field` | `string`   | Campo secundario opcional (ej. email, código) para contexto adicional en representaciones externas.                                                                                                                                                                                                                                         |

> [!NOTE]
> **Equivalencia RBAC ↔ Grid Actions:** Las acciones de Grid son alias UI de las acciones RBAC estándar (§1.5). `edit` evalúa el permiso `update` (respetando autoría y acceso al registro). `duplicate` evalúa el permiso `create`. El Grid renderiza solo las acciones cuyo permiso RBAC correspondiente esté habilitado en el Profile del usuario.

> [!NOTE]
> Los campos de configuración de Búsqueda Global (`searchable`, `search_fields`, formato de retorno) se administran desde el **tab "Search"** dedicado. Ver §4.7.6.

#### 4.7.3 Cascada de Personalización (Admin → User)

La vista final que un usuario ve en un Grid se resuelve mediante una cascada de dos niveles:

1. **Configuración base (Admin):** Definida en la tabla `modules` por el administrador a través del Módulo de Módulos. Establece qué columnas existen, su orden, tipo y visibilidad por defecto. Aplica a todos los usuarios del Tenant.

2. **Personalización individual (User):** Cada usuario puede modificar la vista para sí mismo: reordenar columnas (drag & drop de headers), ocultar/mostrar columnas, cambiar el tamaño de página y el ordenamiento. Estas preferencias se persisten automáticamente en la tabla `user_preferences` con la clave `grid_[module_code]` (ej. `grid_task`, `grid_user`). Si el usuario no ha personalizado, hereda la configuración base.

**Regla de precedencia:** `user_preferences` > `modules.grid_columns` > defaults globales de `settings`.

#### 4.7.4 Comportamientos Técnicos

- **Paginación server-side:** El Grid nunca carga todos los registros. Ejecuta queries paginados con `LIMIT` / `OFFSET` (o cursor-based) en Supabase. El total de registros se calcula en la misma query para el footer.
- **Ordenamiento server-side:** El click en un header de columna envía el parámetro `sort` al backend. No se ordena en el cliente.
- **Filtrado server-side:** Los filtros de la barra de búsqueda local y los Filtros guardados se traducen a cláusulas `WHERE` en la query del backend.
- **Búsqueda local (ilike):** La búsqueda de texto en la barra de filtros del Grid ejecuta por defecto una comparación `ilike` (insensible a mayúsculas/minúsculas) sobre las columnas de texto principales configuradas en el módulo (`search_fields` en el Módulo de Módulos). No se utiliza Full-Text Search (FTS) complejo a menos que se configure explícitamente con `use_fts: true` en la configuración del módulo.
- **Smart Selection:** Permite seleccionar registros individuales (checkbox), seleccionar la página actual, o seleccionar todos los registros que coincidan con el filtro activo (cross-page). El indicador en el footer muestra el conteo exacto. Las acciones masivas (Eliminar, Exportar) operan sobre la selección activa.
- **Renderizado de tipos:** El Grid interpreta el `type` de cada columna para renderizar el valor de forma apropiada: `date` formatea según el locale del usuario, `boolean` muestra un toggle visual, `badge` renderiza con color configurable, `avatar` muestra imagen circular, `link` genera un enlace clickeable.
- **Responsive (Adaptación Multi-Viewport):** El Grid implementa una estrategia de degradación progresiva para garantizar usabilidad en cualquier tamaño de pantalla:
  - **Desktop (≥1280px):** Vista tabular completa con todas las columnas visibles según configuración.
  - **Tablet (768px - 1279px):** Oculta progresivamente las columnas de menor prioridad (según el orden inverso en `grid_columns`). El Action Bar agrupa acciones secundarias en un menú overflow (`...`).
  - **Mobile (<768px):** Transforma la vista tabular en una **lista de tarjetas (Card View)** donde cada registro se presenta como una tarjeta con los campos `display_field` y `display_subtitle_field` como contenido principal, y las acciones por fila accesibles mediante menú contextual (long-press o botón `...`). El scroll horizontal se deshabilita en favor de esta transformación.
  - **Controles de paginación:** Se simplifican en mobile a navegación prev/next con indicador de página actual, eliminando el selector de "registros por página" para maximizar espacio útil.

#### 4.7.5 Integración con Otros Subsistemas

| Subsistema                        | Integración con el Grid                                                                                                                                                                                            |
|:--------------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Campos Personalizados** (§4.12) | Los Custom Fields definidos para un módulo se inyectan como columnas adicionales al final del Grid, con su tipo y label correspondientes.                                                                      |
| **Soft Delete / Papelera** (§4.5) | Toggle en el Action Bar (§4.7.1, Zona 2) alterna entre `WHERE deleted_at IS NULL` (activos) y `WHERE deleted_at IS NOT NULL` (eliminados). Al activarse, las acciones por fila se adaptan contextualmente (Restaurar, Purgar).                                                                                    |
| **Filtros guardados** (§3.C)      | Dropdown en la barra de filtros permite seleccionar un filtro previamente guardado, que pre-aplica las condiciones de búsqueda al Grid.                                                                            |
| **Import / Export** (§3.B)        | Los botones de Import y Export en el Action Bar inician los flujos de los módulos Import y Export respectivamente, pre-seleccionando el módulo activo.                                                             |
| **RBAC** (§3.A)                   | El Grid evalúa los permisos del Profile para determinar qué botones del Action Bar, qué acciones por fila y qué datos mostrar. Si el usuario no tiene permiso de lectura sobre el módulo, no se renderiza el Grid. |
| **Auditoría** (§4.11)             | Toda acción ejecutada desde el Grid (crear, editar, eliminar) pasa por Server Actions que disparan el Interceptor de Auditoría.                                                                                    |

#### 4.7.6 Tab "Search" del Módulo de Módulos: Configuración de Búsqueda Global

El tab **"Search"** en el formulario del Módulo de Módulos permite al Super Admin definir cómo cada módulo participa en la funcionalidad de Búsqueda Global (§4.3). Consolida dos aspectos: **qué campos se consultan** durante la búsqueda y **cómo se presentan** los resultados al usuario.

**Campos de configuración (almacenados en tabla `modules`):**

| Campo en `modules`             | Tipo       | Descripción                                                                                                                                                                                                                                                                                                                                                                             |
|:------------------------------- |:---------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `searchable`                    | `boolean`  | Flag maestro. Habilita (`true`) o deshabilita (`false`) la participación del módulo en la Búsqueda Global. Si es `false`, el módulo es invisible para el Search Global independientemente de los demás campos. Default: `false`.                                                                                                                                                        |
| `search_fields`                 | `JSONB[]`  | Arreglo ordenado de campos que participan en la búsqueda. Cada entrada define: `field` (nombre del campo en BD, requerido), `weight` (prioridad relativa del campo en el ranking de resultados: `high`, `medium`, `low`; default: `medium`). Los campos con mayor weight se priorizan al ordenar los resultados. Ejemplo: `[{ "field": "name", "weight": "high" }, { "field": "email", "weight": "medium" }]`. |
| `search_display_title`          | `string`   | Campo del registro utilizado como **título principal** en cada resultado de búsqueda. Si es `null`, hereda el valor de `display_field` (§4.7.2). Permite independizar la representación del registro en Search de la representación en otros contextos (Bookmarks, relaciones).                                                                                                          |
| `search_display_subtitle`       | `string`   | Campo del registro utilizado como **subtítulo** (línea secundaria de contexto) en cada resultado. Si es `null`, hereda el valor de `display_subtitle_field` (§4.7.2). Ejemplo: email del contacto, código de la tarea.                                                                                                                                                                  |
| `search_display_detail_fields`  | `string[]` | Arreglo opcional de campos adicionales que se muestran como **líneas de detalle** debajo del título y subtítulo en el preview del resultado. Permite enriquecer la vista previa sin navegar al registro. Ejemplo: `["status", "priority", "assigned_to"]`. Cada campo se renderiza como un par `label: value` usando las claves i18n del módulo. Máximo recomendado: 3 campos.             |
| `search_result_limit`           | `integer`  | Máximo de resultados mostrados para este módulo en el dropdown/overlay de búsqueda global. Si es `null`, hereda el default global definido en `ui_defaults.default_search_result_limit` del `bootstrap.json` / `settings` (default: 5). Rango permitido: 1-20.                                                                                                                                                                                    |

**Formato de retorno (estructura del resultado renderizado):**

```
┌──────────────────────────────────────────────────────┐
│ [Icono]  Título (search_display_title)    [Badge]    │
│          Subtítulo (search_display_subtitle)         │
│          detail_field_1: valor | detail_field_2: val │
└──────────────────────────────────────────────────────┘
```

| Elemento                 | Fuente de datos                                       | Fallback                                 |
|:------------------------ |:----------------------------------------------------- |:---------------------------------------- |
| **Icono**                | `icon` del registro en tabla `modules`                 | Icono genérico del framework             |
| **Título**               | Campo indicado en `search_display_title`               | `display_field` (§4.7.2)                 |
| **Subtítulo**            | Campo indicado en `search_display_subtitle`            | `display_subtitle_field` (§4.7.2)        |
| **Detalle (opcional)**   | Campos listados en `search_display_detail_fields`      | No se renderiza si el arreglo está vacío |
| **Badge**                | Nombre i18n del módulo                                 | `code` del módulo                        |

**Validaciones del tab:**

- Si `searchable` es `true`, `search_fields` no puede estar vacío (mínimo 1 campo).
- Los campos referenciados en `search_fields`, `search_display_title`, `search_display_subtitle` y `search_display_detail_fields` deben corresponder a columnas válidas de la tabla del módulo.
- `search_result_limit` debe estar en el rango 1-20 si se especifica.

### 4.8 Branding Dinámico (Theme Engine)

Motor de tematización responsable de inyectar la identidad visual de la aplicación en runtime mediante CSS Variables nativas integradas con Tailwind v4 (`@theme`). No posee interfaz propia; su configuración se administra desde el módulo de Parámetros (tab "Branding"). Afecta de manera horizontal y transversal el *look & feel* de toda la aplicación, permitiendo re-branding dinámico sin recompilar.

El framework distingue dos niveles:
- **Branding de la aplicación:** lo define quien construye la aplicación sobre el framework. Controla el shell visual principal: sidebar, header, favicon, tema base y tokens de UI.
- **Branding del Tenant:** identidad corporativa configurable por cada Tenant con alcance limitado. Puede incluir logo, color corporativo y datos visuales para documentos, reportes, PDFs y superficies explícitamente tenant-aware. No reemplaza automáticamente el branding de la aplicación.

#### 4.8.1 Fuente de Datos (Schema del Objeto `branding`)

La configuración de branding reside en la sección `branding` del campo JSONB `config` de la tabla Singleton `settings`. Su estructura canónica es:

| Propiedad            | Tipo           | Ejemplo / Default              | Descripción                                                                               |
|:-------------------- |:-------------- |:------------------------------ |:----------------------------------------------------------------------------------------- |
| `primary_color`      | `string` (hex) | `"#465FFF"`                    | Color primario de la marca. Se mapea a `--color-brand-500`.                               |
| `primary_color_dark` | `string` (hex) | `null`                         | Variante dark del color primario. Si es `null`, se calcula automáticamente (lighten 10%). |
| `secondary_color`    | `string` (hex) | `null`                         | Color secundario opcional. Si es `null`, hereda una variante del primario.                |
| `logo_full_light`    | `string` (URL) | `"/images/logo/logo.svg"`      | Logo completo para sidebar expandido y header en modo light.                              |
| `logo_full_dark`     | `string` (URL) | `"/images/logo/logo-dark.svg"` | Logo completo para modo dark.                                                             |
| `logo_icon`          | `string` (URL) | `"/images/logo/logo-icon.svg"` | Icono cuadrado (32x32) para sidebar colapsado.                                            |
| `logo_auth`          | `string` (URL) | `"/images/logo/auth-logo.svg"` | Logo para las pantallas de autenticación (login, registro, reset).                        |
| `favicon_url`        | `string` (URL) | `"/favicon.ico"`               | Favicon de la aplicación.                                                                 |
| `font_family`        | `string`       | `"Inter"`                      | Familia tipográfica principal (Google Fonts o sistema).                                   |

> [!NOTE]
> Este schema se inicializa desde la sección `branding` del `bootstrap.json` (bootstrap) durante el proceso de inicialización y, post-despliegue, se gestiona exclusivamente desde la UI de Parámetros. El `bootstrap.json` pierde efecto tras la primera ejecución.

#### 4.8.2 Flujo de Inyección (Server-side → CSS Variables)

El Theme Engine opera en tres fases secuenciales durante la carga de la aplicación:

```
[1] Server Component       [2] Root Layout              [3] Browser Render
    (Data Fetch)               (CSS Injection)              (Paint)
─────────────────────────────────────────────────────────────────────
settings.config.branding  →  <style> :root {            →  Tailwind v4
                           --color-brand-500: #465FFF;    @theme {
  .branding (override)       --color-brand-600: #4338CA;      --color-brand-*
                             --font-family: 'Inter';        }
                           } </style>                    →  Clases: bg-brand-500
                                                            text-brand-600, etc.
```

1. **Data Fetch (Server Component):** El Root Layout de Next.js (`app/[locale]/layout.tsx`) invoca una Server Action que consulta el Singleton `settings` y resuelve el branding global de la aplicación.
2. **CSS Injection (Root Layout):** El layout inyecta un bloque `<style>` en el `<head>` con las variables CSS resueltas asignadas al selector `:root`. Este bloque se genera en el servidor (SSR) y viaja en el HTML inicial, evitando flash of unstyled content (FOUC).
3. **Browser Render:** Tailwind v4 consume las variables CSS mediante la directiva `@theme` en `globals.css`, mapeando `--color-brand-*` a clases utilitarias (`bg-brand-500`, `text-brand-600`, `border-brand-300`, etc.) disponibles en toda la aplicación.

**Regla crítica:** El Theme Engine NO requiere recompilación ni rebuild. El cambio de un color en Parámetros se refleja en la siguiente carga de página (server render). No existe hot-reload de branding; el usuario debe refrescar la página.

#### 4.8.3 Jerarquía de Resolución Multi-Tenant (Cascada de Branding)

El branding participa en la Cascada de Configuración (§4.15) con un nivel adicional específico:

| Nivel                      | Fuente                       | Descripción                                                                                                                                                                                                                    |
|:-------------------------- |:---------------------------- |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1. Global (Parámetros)** | `settings.config.branding`   | Define la identidad visual por defecto de toda la plataforma.                                                                                                                                                                  |
| **2. Tenant (Identidad Corporativa)** | `tenants.settings.tenant_branding` | Cada Tenant puede registrar su identidad corporativa (logo, color y datos visuales limitados) para uso en documentos, PDFs de registros individuales y superficies tenant-aware que la aplicación habilite explícitamente. Esta identidad no sustituye el branding base de la aplicación ni controla automáticamente sidebar, header, favicon o tokens globales. |

**Resolución en runtime (pseudocódigo):**

```
// Branding de la aplicación (UI) - solo del nivel Global
appBranding = settings.config.branding

// Identidad corporativa del Tenant - uso limitado por superficie
tenantIdentity = currentTenant.settings.tenant_branding
```

> [!IMPORTANT]
> A diferencia de los parámetros de locale/timezone (§4.15), el branding NO tiene nivel User. Las preferencias individuales de tema (Light/Dark) se gestionan a través de `user_preferences`, no del Theme Engine.

**Caso de uso Documentación Corporativa:** Un Tenant sube su logo corporativo y define su `primary_color`. Al generar PDFs de registros individuales, como facturas o estados de cuenta, el documento incluye el logo y colores del Tenant como identidad corporativa. La UI principal mantiene la identidad visual de la aplicación definida en Parámetros, salvo superficies puntuales diseñadas explícitamente para mostrar identidad del Tenant.

#### 4.8.4 Gestión de Logos (Variantes y Fallbacks)

El sistema exige 4 variantes de logo para cubrir todos los contextos de la UI:

| Variante       | Propiedad         | Uso en UI                                    | Dimensión Recomendada         |
|:-------------- |:----------------- |:-------------------------------------------- |:----------------------------- |
| **Full Light** | `logo_full_light` | Sidebar expandido + Header (modo light)      | SVG vectorial o 200x40px WebP |
| **Full Dark**  | `logo_full_dark`  | Sidebar expandido + Header (modo dark)       | SVG vectorial o 200x40px WebP |
| **Icon**       | `logo_icon`       | Sidebar colapsado (icono cuadrado)           | 32x32px SVG o WebP            |
| **Auth**       | `logo_auth`       | Pantallas de login, registro, reset password | SVG vectorial o 280x60px WebP |

**Mecanismo de fallback:** Si una variante no está definida (valor `null` o vacío), el componente `useBranding()` retorna rutas estáticas por defecto ubicadas en `/images/logo/`. El fallback chain es:

```
Tenant.branding.logo_* → Settings.branding.logo_* → /images/logo/[default].svg
```

**Almacenamiento de logos:** Los logos subidos por los administradores se procesan a formato `.webp` (si son rasterizados) y se almacenan en el bucket `public_assets` de Supabase Storage. La URL pública resultante se persiste en la propiedad correspondiente del JSONB de branding.

#### 4.8.5 Hook de Consumo (`useBranding`)

El hook `useBranding.ts` (ubicado en `src/hooks/`) es el punto de acceso único para que cualquier componente de la UI obtenga la configuración de branding resuelta:

```ts
// Interfaz de retorno del hook
interface BrandingConfig {
    primaryColor: string;       // Color primario resuelto (hex)
    secondaryColor: string;     // Color secundario resuelto (hex)
    fontFamily: string;         // Familia tipográfica
    logos: {
        full: string;           // URL logo completo (resuelve light/dark según tema)
        icon: string;           // URL icono cuadrado
        auth: string;           // URL logo de autenticación
    };
}
```

**Consumidores principales:**

- `AppHeader.tsx`: renderiza `logos.full` en el header.
- `AppSidebar.tsx`: alterna entre `logos.full` (expandido) y `logos.icon` (colapsado).
- Pantallas de Auth (`(full-width-pages)/`): renderizan `logos.auth`.
- Páginas de Infraestructura (§5.5): heredan colores y logo del branding resuelto.
- `globals.css`: consume las variables `--color-brand-*` y `--font-family` inyectadas en `:root`.

#### 4.8.6 Integración con Tailwind v4

La conexión entre las variables CSS inyectadas y el sistema de clases de Tailwind se establece en `globals.css` mediante la directiva `@theme`:

```css
@theme {
    --color-brand-50:  /* calculado desde primary_color */;
    --color-brand-100: /* calculado */;
    --color-brand-200: /* calculado */;
    --color-brand-300: /* calculado */;
    --color-brand-400: /* calculado */;
    --color-brand-500: var(--color-brand-500); /* inyectado por Theme Engine */
    --color-brand-600: var(--color-brand-600); /* inyectado */
    --color-brand-700: /* calculado */;
    --color-brand-800: /* calculado */;
    --color-brand-900: /* calculado */;
    --font-family:     var(--font-family);     /* inyectado */
}
```

Esto genera automáticamente clases como `bg-brand-500`, `text-brand-600`, `border-brand-300`, `hover:bg-brand-700`, etc., que se utilizan en toda la UI sin necesidad de referencias directas a valores hex.

**Escala de colores:** A partir del `primary_color` base (mapeado a `--color-brand-500`), el Theme Engine genera automáticamente una escala de 10 tonos (50-900) utilizando un algoritmo de variación HSL, asegurando contraste accesible y consistencia visual en toda la paleta.

### 4.9 Renderizado de Menú Dinámico (RBAC Aware)

Motor que construye la estructura de navegación visual de la aplicación (Sidebar y Command Palette).

- Evalúa los permisos del usuario (RBAC) en tiempo de ejecución.
- Intercepta y oculta automáticamente las rutas y módulos a los que el perfil actual no tiene acceso, garantizando una UI limpia y segura de manera transversal.

### 4.10 Contexto Multi-Tenant y Seguridad Perimetral

Infraestructura a nivel de Middleware y API que envuelve todas las operaciones del framework para asegurar el aislamiento de datos y prevenir abusos. Opera mediante la inyección del contexto multi-tenant (JWT Custom Claim o API Key) y la lectura de **Switches de Seguridad**.

- **Aislamiento Multi-Tenant:** El `tenant_id` del Tenant activo se inyecta como **Custom Claim en el JWT de Supabase** (`app_metadata.tenant_id`), establecido al momento del login o switch de Tenant. Supabase RLS lee este claim directamente desde `(auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid` para filtrar datos. No se utiliza un header HTTP `x-tenant-id` separado; el JWT es la única fuente de verdad del contexto multi-tenant para sesiones interactivas.
- **Autenticación M2M (API Keys):** Existen dos mecanismos de autenticación: (1) **JWT de usuario** (sesiones interactivas) y (2) **API Key** (integraciones M2M). En ambos casos, el `tenant_id` se resuelve e inyecta en el contexto de Supabase para que RLS opere de forma idéntica. Para API Keys, el middleware extrae el `tenant_id` asociado a la key y crea un contexto Supabase con ese claim. **Flujo M2M:** (1) Request con header `Authorization: Bearer sk_live_...`; (2) Middleware valida hash contra `api_keys.key_hash`; (3) Verifica key no expirada y Tenant activo; (4) Extrae `tenant_id`; (5) Actualiza `last_used_at`; (6) Procesa request con scopes de la key como permisos; (7) registra auditoría con `actor_id = NULL` y `api_key_id` apuntando a la credencial usada.
- **Switches de Seguridad:** Lee dinámicamente del Singleton de Parámetros las variables booleanas que activan/desactivan validaciones de red (ej. validación de IP, Referer, límites de Rate Limiting por Tenant o por API pública) forzando el cumplimiento de estas reglas en cualquier endpoint.

### 4.11 Interceptor de Auditoría Transversal

Mecanismo de captura (Event Listener/Trigger) que opera en el ciclo de vida de las peticiones a la base de datos.

- **Captura:** Intercepta operaciones `CREATE`, `UPDATE`, y `DELETE` en cualquier módulo del sistema y registra automáticamente el autor, timestamp, entidad, acción y el diferencial de datos (JSONB).
- **Relación con su Módulo:** El desarrollador no debe programar lógica de guardado en cada módulo; el motor lo hace. Posteriormente, estos logs se visualizan y consultan a través del módulo administrativo \"Log\" (Sección 3.A).

### 4.12 Motor de Inyección de Campos Personalizados

Infraestructura de extensibilidad de datos basada en campos dinámicos sobre JSONB (patrón EAV-like, sin tablas EAV separadas).

- **Almacenamiento Estándar:** Todas las entidades extensibles incluyen una columna `custom_data` de tipo `JSONB`. Los campos personalizados no alteran el schema relacional (no se hacen `ALTER TABLE`).
- **Límite de payload:** El campo `custom_data` tiene un límite lógico de **64 KB por registro**. Si el payload supera este umbral, el Server Action rechaza la operación con error `VALIDATION_ERROR` indicando el exceso. Este límite previene el abuso estructural y el degradado de rendimiento en consultas JSONB de PostgreSQL.
- **Definición de Campos (Meta):** La tabla `custom_fields` (`id`, `tenant_id`, `entity_type`, `field_name`, `field_type`, `labels`, `validation_rules`, `is_required`, `default_value`) define la estructura esperada por cada Tenant. `labels` es JSONB traducible por locale (ej. `{ "es": "RFC", "en": "Tax ID" }`) para soportar campos creados en runtime sin depender de archivos i18n estáticos. `field_type` soporta los 9 tipos definidos en §3.B: `text`, `textarea`, `number`, `boolean`, `date`, `select`, `multi-select`, `email`, `url`.
- **Inyección Transversal:** El motor instruye al backend a consolidar los campos nativos de una tabla con los atributos dinámicos definidos para ese módulo, y provee al frontend la metadata para renderizarlos de forma transparente en el Formulario y Grid Universal.
- **Relación con su Módulo:** Funciona consultando las definiciones creadas por los administradores a través del módulo "Campos Personalizados" (Sección 3.B).

#### 4.12.1 Relaciones Genéricas entre Registros

Infraestructura transversal para representar relaciones entre registros de cualquier módulo sin agregar columnas específicas por tabla.

- **Modelo:** `record_relationship_types` define tipos de relación; `record_relationships` guarda relaciones directas con `source_entity_type/source_entity_id` y `target_entity_type/target_entity_id`; `record_relationship_paths` materializa ancestros, descendientes y profundidad.
- **Alcance:** Aplica a Documents y a cualquier módulo del framework o aplicación derivada que necesite dependencia, jerarquía o referencia multi-nivel.
- **Seguridad:** Toda relación es tenant-scoped. Se prohíben relaciones cross-Tenant aunque falle la capa de aplicación.
- **Ciclos:** Tipos como `parent_of` y `depends_on` son acíclicos y deben bloquear ciclos antes de persistir.
- **No módulo visual:** No aparece como módulo independiente en el sidebar; se consume desde paneles inyectables o vistas de detalle de módulos.

### 4.13 Event Bus y Motor de Ejecución de Reglas

Sistema que ejecuta flujos asíncronos en *background* al presentarse un evento en la aplicación.

- **Estructura de Regla:** Trigger (evento) → Condition (evaluación) → Action (ejecución).
- **Triggers:** `ON_CREATE`, `ON_UPDATE`, `ON_DELETE` + campo específico cambiado (ej. "cuando `status` cambia a `completed`).
- **Operadores de Condición:** `equals`, `not_equals`, `greater_than`, `less_than`, `contains`, `is_empty`, `is_not_empty`, `changed_to`, `changed_from`.
- **Operadores Lógicos:** `AND`, `OR` para combinar condiciones (máximo 5 condiciones por regla).
- **Acciones Disponibles:** `send_notification` (§4.17), `send_email` (template §3.B), `call_webhook` (§3.B), `update_field` (actualizar campo del mismo registro), `system_log` (registrar entrada de auditoría silenciosa en el módulo Log sin disparar notificaciones adicionales).

> [!NOTE]
> La acción `trigger_job` (disparo de jobs custom desde reglas) requiere un registry de jobs personalizados. En el MVP del framework, los procesos externos se invocan mediante `call_webhook` y los trabajos internos definidos por el framework se ejecutan mediante la infraestructura de jobs documentada en §6.4.
- **Límites:** Máximo de reglas por Tenant configurable en `settings` (default: 50).
- **Ejecución:** Asíncrona vía Event Bus. Los triggers se disparan desde Server Actions post-CRUD, NO desde triggers de BD.
- **Relación con su Módulo (UI del Builder):** Las reglas causales son creadas y administradas desde el módulo de configuración "Reglas" (§3.B). El Formulario permite selección visual de: módulo origen, evento, condiciones (campo + operador + valor), acción y parámetros.

### 4.14 Gestión de Perfil de Usuario y Preferencias

Aunque los "Usuarios" se administran mediante un módulo CRUD por parte de los administradores, la experiencia individual de cada usuario logueado (Mi Perfil) opera como una funcionalidad transversal accesible desde cualquier punto de la aplicación (usualmente vía el Avatar en el Header).

- **Identidad:** Actualización de datos básicos como nombre y Avatar (almacenado de forma transversal en el bucket `public_assets`).
- **Preferencias de UI:** Configuración persistente a nivel de base de datos (`user_preferences`) sobre comportamiento visual individual.
  - **Schema:** `id`, `user_id`, `tenant_id`, `key` (string, ej: `grid_task`, `dashboard_layout`, `theme`, `notification_settings`), `value` (JSONB). Constraint unique: `(user_id, tenant_id, key)`.
  - **Claves conocidas:** `grid_{module_code}` (columnas, orden, page_size por módulo), `dashboard_layout` (posición y tamaño de widgets del Dashboard §4.18), `theme` (light|dark|system - tema visual global del usuario), `sidebar_collapsed` (boolean - estado de expansión del Sidebar; `true` = colapsado, `false` = expandido; persiste entre sesiones y se evalúa al cargar el Layout), `notification_settings` (JSONB - matriz módulo × canal de preferencias de notificación, §3.B Notificaciones / §4.17). Los overrides de `locale` y `timezone` viven como columnas en `users` para mantener una fuente única.
- **Seguridad Personal:** Gestión de sesiones activas, cambio de contraseña y configuración de 2FA individual.

### 4.15 Cascada de Configuración (Settings → Tenant → User)

Mecanismo de herencia en cascada para parámetros configurables del sistema. Los valores se resuelven en orden de especificidad (el más específico gana):

1. **Nivel Aplicación (Parámetros):** Define los valores por defecto globales para toda la plataforma. Estos valores nacen del bootstrap/setup de la app final y no son constantes del framework. Ejemplo no normativo: `default_locale = "es"`, `default_timezone = "America/Mexico_City"`, `default_currency = "MXN"`.
2. **Nivel Tenant:** Cada Tenant hereda automáticamente los defaults globales. El administrador del Tenant puede sobrescribir selectivamente estos parámetros dentro del registro del Tenant (campo `settings` JSONB en la tabla `tenants`). Ejemplo no normativo: un Tenant europeo configura `locale = "de"`, `timezone = "Europe/Berlin"`, `currency = "EUR"`.
3. **Nivel User:** Cada User hereda los valores de su Tenant. A nivel individual, puede personalizar estos parámetros en su propio registro (campos `locale`, `timezone` en la tabla `users`). Ejemplo: un usuario hispanohablante dentro del Tenant europeo configura `locale = "es"`.

**Parámetros identificados para herencia en cascada:**

| Parámetro     | Niveles                 | Descripción                                                                                                                                                                         |
|:------------- |:----------------------- |:----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `locale`      | Global → Tenant → User | Idioma de la interfaz (código ISO 639-1)                                                                                                                                            |
| `timezone`    | Global → Tenant → User | Zona horaria para visualización de fechas (ej. `America/Mexico_City`)                                                                                                               |
| `currency`    | Global → Tenant → User | Moneda por defecto para visualización de importes (código ISO 4217)                                                                                                                 |
| `date_format` | Global → Tenant → User | Formato de fecha preferido (ej: `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`). Override a nivel User permite a cada individuo leer fechas en su formato cultural sin afectar al resto. |
| `time_format` | Global → Tenant → User | Formato de hora preferido: `12h` (AM/PM, ej: `3:45 PM`) o `24h` (ej: `15:45`). Override a nivel User. Se almacena en `tenants.settings.time_format` y en `users.time_format`.   |
| `branding`    | Global → Tenant        | Identidad visual (colores, logos, fuente). Solo 2 niveles: no tiene override a nivel User. Ver §4.8.3.                                                                              |

> [!NOTE]
> Esta lista es extensible. Futuros parámetros que requieran personalización por Tenant o User pueden incorporarse a este mecanismo sin crear tablas adicionales.

**Sin tablas nuevas:** La información reside en los registros existentes de `settings` (global), `tenants` (por cuenta) y `users` (por usuario). La resolución en cascada es responsabilidad de la capa de aplicación (backend), no de la base de datos.

**Schema consolidado de `tenants.settings` (JSONB):**

Las siguientes keys son las reconocidas por el framework en el campo `settings` de la tabla `tenants`. Cada key se documenta con la sección del PRD que la referencia para facilitar la trazabilidad.

| Key | Tipo | Default | Referencia PRD | Descripción |
|:----|:-----|:--------|:---------------|:------------|
| `mfa_policy` | `string` | Hereda de Settings | §2.3.7 | Override de política MFA del Tenant (solo escalación): `optional`, `required`. |
| `allowed_ips` | `string[]` | `[]` | §2.3.7 | Lista blanca de IPs/CIDR. Vacío = sin restricción. |
| `session_timeout_override` | `integer` | Hereda de Settings | §2.3.7 | Override de timeout de sesión por inactividad (minutos). |
| `locale` | `string` | Hereda de Settings | §4.15 | Locale del Tenant (ISO 639-1). |
| `timezone` | `string` | Hereda de Settings | §4.15 | Timezone del Tenant (ej: `America/Mexico_City`). |
| `currency` | `string` | Hereda de Settings | §4.15 | Moneda del Tenant (ISO 4217). |
| `date_format` | `string` | Hereda de Settings | §4.15 | Formato de fecha preferido (ej: `DD/MM/YYYY`, `MM/DD/YYYY`, `YYYY-MM-DD`). Heredable en 3 niveles: `Settings` → `Tenant` → `User`. |
| `time_format` | `string` | `"24h"` | §4.15 | Formato de hora preferido: `"12h"` (AM/PM) o `"24h"` (reloj 24 horas). Heredable en 3 niveles: `Settings` → `Tenant` → `User`. Se almacena también en `users.time_format` para override individual. |
| `tenant_branding` | `object` | `{}` | §3.B Tab 6 | Identidad corporativa del Tenant: `logo_url` (logo para documentación/PDF), `primary_color` (color corporativo para documentos y PDFs de registros individuales). No afecta la UI de la aplicación. |
| `soft_delete.auto_purge_days` | `integer` | Hereda de Settings | §4.5 | Días antes de purga automática de registros soft-deleted del Tenant. |

> [!NOTE]
> `social_links` es un campo JSONB directo de la tabla `tenants` (no forma parte de `tenants.settings`). Ver §3.B Tenants Tab 4.

> [!NOTE]
> Este schema es extensible por la aplicación derivada. Keys no reconocidas por el framework se almacenan pero no se evalúan automáticamente.

### 4.16 Gestor de Almacenamiento (File Browser)

Vista de navegación visual integrada dentro del módulo **Files** (`file`, §3.C). No es un módulo independiente; es una **funcionalidad de UI** del módulo Files que permite explorar los buckets de Supabase Storage de forma jerárquica.

- **Función:** Ofrecer una interfaz de exploración tipo "file browser" para navegar los archivos almacenados en los buckets, agrupados por módulo de origen (`entity_type`) y registro (`entity_id`).
- **Aislamiento:** Hereda el RLS del módulo Files, garantizando que cada Tenant solo visualice sus propios archivos.
- **Relación con módulo Files:** El Gestor de Almacenamiento consume la tabla `files` para renderizar la vista jerárquica. Toda operación de upload, delete o versionado se ejecuta a través de las Server Actions del módulo Files y la Upload API (§4.6.3).
- **Acceso:** Disponible como un tab o vista alternativa dentro de la ruta del módulo Files (`/view/file`).

### 4.17 Centro de Notificaciones (Notification Hub)

Vista unificada y centralizada de todas las alertas del sistema, accesible desde el header de la aplicación. Consume los registros de la tabla core de notificaciones.

- **Canales Soportados:** In-app (obligatorio, siempre activo), Email (vía módulo Plantillas Email), SMS (requiere integración §3.B), WhatsApp (requiere integración §3.B). Push requiere una app móvil nativa posterior.
- **Tabla `notifications`:** `id`, `tenant_id`, `user_id` (destinatario), `title`, `body`, `type` (system | tenant | automation), `channels` (string[] - subset de: `in_app`, `email`, `sms`, `whatsapp`, `push`; `in_app` siempre incluido), `delivery_status` (JSONB - estado de entrega por canal, ej. `{ "in_app": "delivered", "email": "sent", "sms": "failed" }`), `entity_type`, `entity_id` (registro origen), `read_at`, `archived_at`, `created_at`. **Modelo multicanal:** Cada registro representa una notificación lógica única enviada por múltiples canales simultáneamente. **Requerimientos de contenido por canal:** `in_app` requiere `title` + `body`; `email` requiere `title` (subject) + `body` (HTML vía Plantilla Email §4.25); `sms` requiere `body` (max 160 chars, sin HTML); `whatsapp` requiere `body` (template aprobado por proveedor). La función `createNotification()` valida que los campos requeridos estén presentes para cada canal solicitado.
- **Generación:** Las notificaciones se crean mediante una función centralizada `createNotification()` invocada por: (1) Motor de Reglas §4.13, (2) Eventos de sistema (subscription events, tenant events), (3) Server Actions explícitas.
- **Agregación e Interacción:** El Hub es la capa de consumo in-app. Consolida notificaciones, permitiendo filtrar por estado (leída/no leída), tipo y fecha. Permite marcar como leída, archivar o actuar sobre la notificación.
- **Relación con su Módulo:** Las preferencias de usuario sobre qué canales recibe por tipo de notificación se administran desde el módulo Notificaciones (§3.B). El canal in-app no es desactivable.

### 4.18 Página de Inicio (Dashboard)

Página principal post-login que opera como punto de aterrizaje y centro de comando del usuario. No posee tabla propia ni gestiona entidades independientes.

- **Función:** Renderiza widgets configurables que agregan KPIs e indicadores clave de negocio provenientes de otros módulos del sistema.
- **Widgets base del framework:** (1) Resumen de actividad reciente (últimos 10 registros de Log), (2) KPIs configurables (conteos de registros por módulo), (3) Tareas pendientes (filtro del módulo demo Tasks), (4) Estado de suscripción (días restantes, plan activo), (5) Quick Actions (accesos rápidos a crear registro en módulos frecuentes).
- **Esquema de Widget:** Cada widget define: `widget_id`, `title`, `component`, `default_size` (sm|md|lg), `data_source` (module_code + query), `min_profile_permissions`.
- **Personalización:** Layout de widgets con capacidad Drag & Drop. Las preferencias de disposición se almacenan en `user_preferences`.
- **Configurabilidad:** Los widgets disponibles y su contenido dependen del Profile del usuario y los módulos activos en la aplicación.

### 4.19 Soporte y Base de Conocimiento (Help Center)

Infraestructura transversal de auto-servicio y gestión de incidentes accesible desde cualquier punto de la aplicación.

- **Knowledge Base:** Artículos filtrados desde Documents donde `category = "help"`. Sirve para documentación de usuario final, FAQs y guías de uso. Se clasifica como funcionalidad transversal que consume el módulo Documents (§3.B).
- **Tickets de Soporte:** El MVP del framework provee un enlace a email o URL externa (ej. portal externo de soporte) configurable en `settings` tab General. Un módulo completo de tickets puede agregarse en una aplicación derivada si el producto lo requiere.
- **Accesibilidad:** Punto de entrada persistente en el layout principal (header o sidebar) que no requiere navegación a un módulo específico.

### 4.20 Portal Público (Public Pages)

Capacidad del framework para exponer páginas de acceso público (sin autenticación) con contenido limitado y controlado.

- **Casos de Uso MVP:** Status Page (estado del sistema manual) y landing informativa (contenido estático). Un CMS dinámico para páginas públicas puede agregarse en una aplicación derivada. En el MVP, las páginas públicas son rutas Next.js bajo `/public/` sin autenticación.
- **Activación:** Deshabilitado por defecto. Configurable por Tenant desde el módulo de Parámetros.
- **Seguridad:** Las páginas públicas operan fuera del perímetro de autenticación pero dentro del perímetro de Rate Limiting y validaciones de seguridad perimetral (§4.10).

### 4.21 Mobile Bridge (Compatibilidad Móvil)

Capa de compatibilidad para que el backend del framework pueda servir, posteriormente, a un frontend móvil sin duplicar lógica de negocio.

- **Arquitectura:** Online-First. La app móvil nativa no forma parte del MVP web, pero los servicios backend deben mantenerse API-first y reutilizables.
- **Alcance MVP:** Mantener contratos REST/versionados, autenticación por token, payloads paginados y servicios compartidos para que un frontend móvil futuro pueda consumirlos.
- **Relación:** Consume los mismos servicios backend que la aplicación web, sin duplicar lógica de negocio.

> [!NOTE]
> La construcción de una aplicación móvil nativa queda fuera del MVP web del framework. Lo que sí forma parte del MVP es preservar la compatibilidad backend/API para habilitarla posteriormente.

### 4.22 Adaptador de Pasarela de Pagos (Payment Gateway)

Abstracción genérica que desacopla la lógica de cobro del proveedor específico de pagos.

- **Función:** Provee una interfaz unificada para procesar pagos, suscripciones y reembolsos independientemente del proveedor (Stripe, PayPal u otro adapter compatible).
- **Configuración:** Las credenciales del proveedor se gestionan desde el módulo de Integraciones (§3.B). El proveedor activo se define en `payments.provider` durante bootstrap/setup y luego en `settings`.
- **Relación con Módulos:** Alimenta los módulos de Estados de Cuenta (§3.B) e Invoices (§3.B) con los eventos de transacción recibidos vía webhooks del proveedor.

> [!NOTE]
> Stripe puede ser el default inicial del framework, pero el contrato no depende de Stripe. El flujo detallado de reembolsos depende del proveedor de pagos concreto y se especifica por adapter. En el MVP, el framework soporta el status `reversed` en Invoices como registro contable de una devolución procesada por la pasarela.

### 4.23 Sistema de Atajos de Teclado (Keyboard Shortcuts)

Infraestructura transversal que provee navegación y ejecución rápida de comandos mediante el teclado, dirigida a "Power Users" y operadores recurrentes.

- **Naturaleza Transversal:** El sistema opera a nivel global del framework, interceptando eventos de teclado y despachándolos hacia el Command Palette, los overlays o la vista activa.
- **Mapa Estático Base (Built-in):** El framework define atajos no colisionables para acciones universales.
  - `Ctrl+K` / `⌘+K`: Abrir Command Palette / Global Search.
  - `Escape`: Cerrar el overlay activo (Modal, Drawer, Palette).
  - `Ctrl+S` / `⌘+S`: Guardar formulario activo (previene el comportamiento por defecto del navegador).
  - `Ctrl+N` / `⌘+N`: Nuevo registro en el módulo activo (si el Perfil posee el permiso `create`).
  - `?`: Mostrar overlay de ayuda con el mapa de atajos disponibles.
  - `Ctrl+/` / `⌘+/`: Alternar visibilidad del Sidebar.
  - `Alt+←` / `Alt+→`: Navegación de Breadcrumb (nivel anterior/siguiente).
- **Extensibilidad (Módulos Derivados):** Las aplicaciones construidas sobre el framework pueden registrar atajos adicionales específicos de su contexto operativo, inyectándolos en un registro central (ej. `ShortcutProvider`).
- **Detección de Conflictos:** El framework alerta en modo DEV si se intenta registrar un atajo que entra en conflicto con el mapa base o atajos críticos del navegador.
- **Personalización de Usuario:** La habilitación/deshabilitación del sistema de atajos y preferencias específicas puede persistir en `user_preferences`.

### 4.24 Diseño de Formularios (Principios Arquitectónicos)

- **Creación Manual:** Los formularios **NO** se generan automáticamente desde la configuración de BD. Cada módulo define su formulario manualmente en código (componentes React).
- **Módulo de Módulos:** En consecuencia, el Módulo de Módulos NO tiene un tab de "Formulario" porque la UI de entrada no es configurable desde BD.
- **Anatomía Visual Estándar:** 
  - **Header:** Título dinámico (Crear/Editar) + Breadcrumb de navegación.
  - **Body:** Campos organizados según patrones de diseño (§5.6) como tabs, secciones colapsables o layouts en columnas.
  - **Footer:** Botones estandarizados (Guardar, Cancelar), preferentemente sticky.
- **Validaciones:** Se apoyan estrictamente en Zod schemas, ejecutando la misma validación tanto en client-side (antes de enviar) como en server-side (en la Server Action).
- **Metadata Transversal Heredada:** Los campos de auditoría `created_by`, `updated_by`, `deleted_by`, `restored_by`, `created_at`, `updated_at`, `deleted_at`, `restored_at` son gestionados automáticamente por el backend y las Server Actions; no son visibles ni editables en el formulario. Los módulos importables agregan metadata de origen (`source_type`, `source_import_id`, `imported_at`, `imported_by`, `source_external_id`, `source_row_number`, `source_checksum`) para trazabilidad, idempotencia y auditoría de ingestión.

### 4.25 Email Transaccional (Notification Hub)

Infraestructura unificada para envíos transaccionales usando plantillas dinámicas y proveedores externos.

- **Plantillas Mapeadas:** En lugar de codificar IDs de plantillas de un proveedor específico (ej. Resend/SendGrid), el framework usa códigos lógicos (ej. `welcome_email`, `password_reset`). El mapeo real al ID del proveedor se configura en el módulo `email-template` (§3.B) o se diseña allí usando un editor WYSIWYG.
- **Proveedor Configurable:** El envío se realiza mediante un adapter de email configurado por app/Tenant. Resend puede ser default inicial, pero no es una dependencia obligatoria del contrato.
- **Merge Tags:** Estándar de inyección de variables (ej. `{{user_name}}`, `{{action_url}}`) procesado antes de entregar el payload al proveedor final.
- **Cola de Envío:** Todos los emails se encolan a través del **Event Bus** (§4.13) que enruta internamente hacia la **Infraestructura de Jobs Programados** (§6.4) para gestión de retry-policy, backoff exponencial y trazabilidad de fallos. El envío no bloquea la ejecución síncrona.
- **Trazabilidad:** Cada intento de envío se registra en el módulo `Log` (§3.A) con estado (`delivered`, `bounced`, `failed`), `recipient`, `template_code` y proveedor usado.

### 4.26 Consent Management (GDPR/CCPA)

Componente transversal encargado de gestionar el consentimiento del usuario para el uso de cookies y scripts de rastreo (Analytics, Marketing, Seguridad).

- **Naturaleza Transversal:** Funciona como un "Gate" a nivel de `layout.tsx` que intercepta la carga de scripts de terceros.
- **Tipología de Consentimiento:** Soporta categorías granulares (Estrictamente necesarias, Rendimiento/Analytics, Funcionalidad, Publicidad/Marketing).
- **Consent Banner:** UI no bloqueante (excepto en regiones estrictas si se configura) que solicita al usuario sus preferencias.
- **Persistencia (Cookie Esencial):** Almacena la selección del usuario en una cookie HTTP (ej. `fromzero_consent_status`). Esta cookie se clasifica legalmente como "Estrictamente Necesaria" para recordar la preferencia del usuario (no requiere consentimiento previo). Al ser una cookie HTTP, permite a los Server Components de Next.js leer el estado e inyectar scripts de forma condicional desde el servidor (evitando flashes del cliente).
- **Sincronización de Auditoría:** Para usuarios autenticados, el estado de la cookie se sincroniza hacia la tabla `user_preferences` para mantener un log auditable del consentimiento otorgado.
- **Integración con Scripts:** Las integraciones opcionales (ej. GA4, Meta Pixel) están envueltas en condicionales que verifican el estado del consentimiento antes de inyectar sus respectivos scripts en el DOM, o en su defecto, inicializarlos vía APIs como "Google Consent Mode v2" para tracking anónimo previo a la aceptación.

### 4.27 Integraciones Opcionales del Framework

Las siguientes integraciones son **opcionales** y se habilitan por configuración en `bootstrap.json`. No son requisitos del framework; son herramientas de terceros que las aplicaciones derivadas pueden activar según sus necesidades. Su configuración detallada se delega al módulo **Integraciones** (§3.B) y **Settings** (§3.A).

> [!NOTE]
> **PostHog vs Feature Gating:** Los Feature Flags propios de PostHog operan en un ámbito separado al Feature Gating estructural del framework (§2.4.5). Mientras el Feature Gating del framework controla el acceso basado en planes y facturación, los Feature Flags de PostHog se dedican exclusivamente a experimentos de producto (A/B testing, rollouts progresivos) definidos por el desarrollador.

#### 4.27.1 Analytics & Comportamiento
- **Microsoft Clarity:** Mapas de calor y grabación de sesiones (requiere consentimiento de Analytics).
- **PostHog:** Product analytics y feature flags de experimentación (requiere consentimiento de Analytics).
- **Google Analytics 4:** Web analytics general (requiere consentimiento de Analytics).

#### 4.27.2 Marketing & Ads
- **Google Tag Manager:** Orquestador de tags (requiere consentimiento según los tags contenidos).
- **Meta Pixel:** Rastreo de conversiones (requiere consentimiento de Publicidad).

#### 4.27.3 Seguridad Perimetral & Formularios
- **Cloudflare WAF:** Web Application Firewall a nivel de DNS/Edge (no requiere consentimiento en cliente).
- **Google reCAPTCHA v3 / Cloudflare Turnstile:** Protección de formularios (Estrictamente necesario, Turnstile preferido por privacidad).

#### 4.27.4 Monitoreo de Errores
- **Sentry:** Trazabilidad de excepciones y rendimiento (Estrictamente necesario/Rendimiento).

#### 4.27.5 Operaciones (Email y Background Tasks)
- **Email transaccional:** adapter configurable. Resend puede usarse como default inicial reemplazable.
- **Inngest:** Infraestructura serverless para cron jobs y workflows durables.

#### 4.27.6 Hosting & Despliegue
- **VPS genérico:** despliegue self-hosted con Docker, reverse proxy, TLS, backups y healthchecks. Un panel de control puede usarse como herramienta operativa, pero no es dependencia del framework.

---

## 5. UI / UX Design System

### 5.1 Base Gráfica

- **Design System:** Se empleará un **Design System propietario** basado en shadcn/ui + Tailwind v4 para mantener un frontend limpio, accesible y optimizado.
- **Referencia Visual Histórica:** El material visual histórico usado durante la definición del framework es solo consulta archivada. No forma parte de la estructura del proyecto ni es una dependencia activa.

### 5.2 Estructura Visual de Módulos (Vistas/Grids)

- **Header Action Bar (Toolbars):** Área dinámica. Solo renderiza los botones de Importar, Exportar, Crear y Eliminar si el Perfil del usuario posee permisos activos para esas acciones.
- **Refresh de Datos:** El botón de Refresh realiza una re-ejecución del query en background para el grid activo, sin recargar la página completa.
- **Smart Selection:** Indicador visual persistente que muestra en tiempo real la cantidad total de registros seleccionados ("5 registros seleccionados" o "Todos los 5,420 seleccionados").
- **Preferencias de Usuario en UI:** Las modificaciones en el Grid Universal (ordenamiento de columnas, visibilidad, paginado) se guardan automáticamente por tenant y por módulo a nivel base de datos, garantizando que su personalización persiste entre sesiones y dispositivos.

### 5.3 Elementos Generales

- **Breadcrumbs:** Configurable en los ajustes de UI (`bootstrap.json` o Parámetros), pudiendo encenderse o apagarse globalmente.
- **Prohibición de emojis y marcas de generación:** Se prohíbe el uso de emojis, guion largo y caracteres decorativos asociados a generación automática en UI, código y documentación. Solo se emplearán íconos vectoriales SVG estandarizados (ej. Lucide o Heroicons) cuando aplique.
- **Iconos No-Exclusivos:** La librería de iconos del framework (Lucide) es la estándar. Las aplicaciones derivadas pueden incorporar librerías adicionales si el caso de uso lo requiere.

### 5.4 Overlays y Capas de UI

Componentes superpuestos que el framework provee como primitivos reutilizables.

| Componente                 | Comportamiento                                                                                                                                                    | Uso                                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Modal (Centrado)**       | Fondo bloqueado (overlay semitransparente). Cierre por: botón X, botón Cancelar, tecla Escape. Variantes: `sm` (400px), `md` (600px), `lg` (800px).               | Confirmaciones, formularios cortos, detalle rápido                         |
| **Modal de Confirmación**  | Variante destructiva del modal con botón primario en rojo y texto explícito de consecuencia.                                                                      | Eliminación, desactivación, acciones irreversibles                         |
| **Drawer (Panel Lateral)** | Slide-in desde la derecha. Ancho **parametrizable** por invocación (defaults: `400px` o `50%` del viewport). Cierre por: botón X, click en overlay, tecla Escape. | Formularios de edición rápida, detalle expandido, paneles de configuración |
| **Toast (Efímero)**        | Esquina superior derecha. Auto-dismiss (5s default). Variantes: `success`, `error`, `warning`, `info`.                                                            | Feedback de acciones (guardado, error, etc.)                               |

### 5.5 Páginas de Infraestructura

Páginas estáticas del framework que **heredan el branding dinámico** del Tenant (colores, logo) para mantener consistencia visual. Se construyen con componentes del Design System propietario.

| Página            | Ruta                 | Comportamiento                                                                                   |
| ----------------- | -------------------- | ------------------------------------------------------------------------------------------------ |
| **404 Not Found** | Catch-all            | Mensaje amigable + botón "Volver al Dashboard". Accesible sin autenticación.                     |
| **500 Error**     | Error boundary       | Mensaje genérico + enlace a soporte. No expone stack traces.                                     |
| **Mantenimiento** | Middleware intercept | Pantalla de espera amigable. Solo Super Admin/Admin pueden bypasear. Activable desde Parámetros. |
| **Coming Soon**   | Por módulo           | Para módulos planificados pero no implementados. Switch per-module en Módulo de Módulos.         |

### 5.6 Clasificación de Formularios

Patrones estándar para la composición de formularios según la densidad y tipo de información.

| Patrón                    | Uso                                                | Ejemplo                                                         |
| ------------------------- | -------------------------------------------------- | --------------------------------------------------------------- |
| **Tabs horizontales**     | Formularios con secciones temáticas independientes | Módulo de Módulos (General / Grid / Search / Import / Export / Automatizaciones) |
| **Tabs verticales**       | Configuración densa con navegación lateral         | Parámetros (General / Seguridad / Branding / Legal)             |
| **Secciones colapsables** | Información opcional o avanzada                    | Formulario de usuario (Datos básicos ▸ Preferencias ▸ Avanzado) |
| **Formulario simple**     | Registros con pocos campos                         | Tasks (título, descripción, estado, prioridad)                  |

### 5.7 Diseño Responsivo (Responsive Design)

El diseño responsivo es un **principio arquitectónico innegociable** del framework. Todo componente de UI, sin excepción, debe adaptarse fluidamente a cualquier tamaño de viewport, priorizando siempre la usabilidad y la experiencia del usuario.

#### 5.7.1 Estrategia: Mobile-First

El framework adopta la estrategia **Mobile-First**: los estilos base se diseñan para el viewport más reducido y se extienden progresivamente hacia pantallas mayores mediante media queries ascendentes (`min-width`). Esto garantiza que la experiencia mínima viable sea siempre funcional y usable.

#### 5.7.2 Breakpoints Canónicos

El framework define los siguientes breakpoints estándar alineados con Tailwind CSS:

| Token  | Min-Width  | Dispositivo Referencia          | Comportamiento General                                       |
|:------ |:---------- |:------------------------------- |:------------------------------------------------------------ |
| `sm`   | `640px`    | Teléfonos en landscape          | Layout de una columna. Navegación colapsada.                 |
| `md`   | `768px`    | Tablets en portrait             | Layout de 1-2 columnas. Sidebar overlay.                     |
| `lg`   | `1024px`   | Tablets landscape / Laptops     | Layout multi-columna. Sidebar persistente colapsado.         |
| `xl`   | `1280px`   | Monitores estándar              | Layout completo. Sidebar expandido.                          |
| `2xl`  | `1536px`   | Monitores grandes / Ultra-wide  | Máximo aprovechamiento de espacio. Paneles laterales dobles. |

#### 5.7.3 Reglas de Adaptación por Componente

| Componente / Zona           | Desktop (≥1280px)                          | Tablet (768px-1279px)                        | Mobile (<768px)                                   |
|:--------------------------- |:------------------------------------------ |:-------------------------------------------- |:------------------------------------------------- |
| **Sidebar**                 | Persistente, expandido                     | Persistente colapsado (solo iconos)          | Oculto. Acceso vía hamburger menu (overlay). Cierre automático al hacer *tap* fuera o seleccionar ruta. |
| **Header**                  | Completo con Search, Notificaciones, Avatar| Search colapsa a icono. Elementos agrupados  | Mínimo: hamburger + logo + avatar. **Account Switcher** es el primer elemento interactivo dentro del hamburger menu. |
| **Grid Universal**          | Tabla completa con columnas visibles       | Columnas reducidas + scroll horizontal       | Card View (tarjetas por registro)                 |
| **Formularios (multi-col)** | 2-3 columnas según densidad                | 1-2 columnas                                 | 1 columna, campos full-width                      |
| **Tabs horizontales**       | Tabs visibles en línea                     | Tabs visibles, scroll si exceden             | Tabs colapsan a selector dropdown                 |
| **Modales**                 | Centrados con ancho parametrizado          | Ancho máximo 90% viewport                    | Full-screen (bottom sheet o pantalla completa)    |
| **Drawers**                 | Slide-in lateral (ancho parametrizado)     | Ancho máximo 80% viewport                    | Full-screen                                       |
| **Dashboard (Widgets)**     | Grid multi-columna (3-4 cols)              | Grid 2 columnas                              | Stack vertical (1 columna)                        |
| **Action Bar (Toolbar)**    | Todos los botones visibles                 | Botones principales + overflow menu          | Solo icono primario (+) y overflow menu           |
| **Paginación**              | Completa con selector de page size         | Completa simplificada                        | Prev/Next con indicador de página                 |
| **Command Palette**         | Overlay centrado (640px ancho)             | Overlay centrado (90% ancho)                 | Full-screen overlay                               |
| **Toasts**                  | Esquina superior derecha                   | Esquina superior derecha                     | Ancho completo, parte superior                    |

#### 5.7.4 Principios de Implementación

- **Unidades relativas:** Preferir `rem`, `%`, `vh/vw` y clases de Tailwind (`w-full`, `max-w-*`, `flex`, `grid`) sobre valores absolutos en `px` para dimensiones de layout. Los `px` se reservan exclusivamente para bordes, sombras y detalles micro.
- **Tipografía fluida:** Los tamaños de texto base deben escalar proporcionalmente al viewport mediante `clamp()` o las utilidades responsivas de Tailwind (`text-sm md:text-base lg:text-lg`).
- **Touch targets:** Todo elemento interactivo (botones, links, checkboxes, toggles) debe respetar un tamaño mínimo de **44x44px** en viewports táctiles, siguiendo las WCAG 2.2 Success Criterion 2.5.8.
- **No horizontal scroll:** Prohibido el scroll horizontal a nivel de página. Solo se permite dentro de componentes contenidos (tablas en tablet, code blocks).
- **Imágenes responsivas:** Uso de `srcset`, `sizes` y formatos WebP para optimizar carga según dispositivo y resolución. Los logos del Theme Engine (§4.8) deben ser preferentemente SVG para escalado sin pérdida.
- **Espaciado consistente:** El espaciado (padding, margin, gap) debe usar la escala de Tailwind y adaptarse por breakpoint para evitar interfaces apretadas en mobile o vacías en desktop.
- **Testeo obligatorio:** Todo componente nuevo debe verificarse visualmente en al menos 3 breakpoints (mobile, tablet, desktop) antes de considerarse completo. Las pruebas E2E con Playwright deben incluir al menos un viewport mobile (`375x812`) y uno desktop (`1920x1080`).

---

## 6. Arquitectura Técnica y APIs

### 6.1 Convenciones Estrictas de Nombrado (Dual Standard)

- **Base de Datos:** PLURAL en inglés (`tasks`, `users`, `tenants`).
- **Slugs, URLs y Rutas (Frontend/APIs):** SINGULAR en inglés (`/task`, `/invoice`, `/user`).
- **Traducciones i18n:** Inglés y `snake_case`.
- **Namespace de Tablas:** El framework posee el namespace limpio (sin prefijos). Si una aplicación final necesita una tabla cuyo nombre colisiona con una tabla del framework, la aplicación debe agregar el prefijo `app_` (ej. `app_settings`, `app_profiles`). Las tablas del framework nunca se renombran.

**Formato de case (regla complementaria):**

| Elemento | Case | Ejemplo |
|:---------|:-----|:--------|
| Slugs de rutas y URLs | `kebab-case` singular | `/custom-field`, `/ai-model`, `/api-key` |
| Códigos de módulo (`module.code`) | `kebab-case` singular | `custom-field`, `ai-model`, `api-key` |
| Tablas de BD | `snake_case` plural | `custom_fields`, `ai_models`, `api_keys` |
| Archivos i18n JSON | `snake_case` singular | `custom_field.json`, `ai_model.json` |
| Variables de código (JS/TS) | `camelCase` | `customField`, `aiModel` |
| Componentes React | `PascalCase` | `CustomFieldForm`, `AiModelGrid` |

### 6.2 Diseño de APIs y Seguridad

- **Versionamiento:** Obligatorio en el path (`/api/v1/module`).
- **Perímetro y Validaciones Intrínsecas:** Cada API debe poseer validaciones nativas de Rate Limiting y auditoría intrínseca (no delegadas exclusivamente al WAF/Edge). En implementaciones On-Premise (sin WAF), la API debe auto-defenderse (validación de Method, IPs confiables si aplica, RBAC inyectado y Prevención SQLi con Zod / Supabase ORM).
- **Protección de Datos (DTO):** Uso de Data Transfer Objects para sanitizar la entrega de payloads al frontend, evitando la fuga inadvertida de columnas privadas (ej. passwords o metadatos de sistema).
- **Seguridad Perimetral mediante Switches:** Habilidad para activar/desactivar validaciones de API de forma dinámica (sustituyendo a un WAF externo). Los Switches son un subconjunto de los Parámetros del sistema (§1.5), específicos para controles booleanos de activación/desactivación en las validaciones de APIs.

**Variables Complementarias de los Switches de Seguridad de API:**

| Switch                  | Variable Complementaria   | Tipo                                    | Descripción                                            |
| ----------------------- | ------------------------- | --------------------------------------- | ------------------------------------------------------ |
| IP Validation           | `allowed_ips`             | `string[]`                              | Arreglo de IPs/CIDRs autorizadas                       |
| Referer Control         | `allowed_referers`        | `string[]`                              | Dominios de origen permitidos                          |
| Method Restriction      | `allowed_methods`         | `string[]`                              | Métodos HTTP aceptados por endpoint                    |
| Rate Limiting (Público) | `rate_limit_global`       | `{window_ms, max_requests}`             | Límite global para endpoints no autenticados           |
| Rate Limiting (Auth)    | `rate_limit_tenant`      | `{window_ms, max_requests}`             | Límite por tenant para endpoints autenticados         |
| Rate Limiting (Per-API) | `rate_limit_per_endpoint` | `{endpoint, window_ms, max_requests}[]` | Override granular por endpoint específico              |
| Debug Audit             | `audit_debug_mode`        | `boolean`                               | Registra payload request/response pre y post ejecución |

- **Auditoría de Ejecución:** Cada invocación de API registra un trace con timestamp de inicio y fin, permitiendo detectar latencia y errores en tiempo real.

### 6.2.1 Contratos de Errores Estándar

Toda respuesta de error en APIs y Server Actions debe seguir una taxonomía determinista para facilitar el manejo en el frontend y la integración con terceros.

- **Estructura Base:** `{ error: { code: string, message: string, details?: any } }`
- **Códigos Estándar:**
  - `VALIDATION_ERROR`: Fallo en Zod schema. `details` contiene el array de errores de Zod. (HTTP 400)
  - `UNAUTHORIZED`: Falta token o token inválido. (HTTP 401)
  - `FORBIDDEN`: Usuario autenticado pero sin permisos (perfil no autorizado). (HTTP 403)
  - `NOT_FOUND`: Entidad no encontrada. (HTTP 404)
  - `CONFLICT`: Violación de unicidad (ej. email ya registrado). (HTTP 409)
  - `RATE_LIMITED`: Límite de peticiones excedido. (HTTP 429)
  - `INTERNAL_ERROR`: Error de servidor no manejado. No exponer stack traces en prod. (HTTP 500)
- **Trazabilidad:** Errores 500 (`INTERNAL_ERROR`) deben registrarse automáticamente en el módulo `Log` o sistema de APM, incluyendo el ID de la petición (`request_id`) que se retorna al cliente.

### 6.2.2 Tracking de Costos IA

Cada invocación al Core de Integración IA se registra en el módulo Log centralizado (§3.A) como una acción de tipo `ai.invocation`. Los datos específicos se almacenan en el campo `metadata` (JSONB) del registro de log: `tenant_id`, `model_id`, `tokens_input`, `tokens_output`, `estimated_cost_usd`. Esto permite consultar costos de IA, conteo de peticiones y consumo por Tenant desde el mismo punto centralizado de auditoría, sin necesidad de tablas independientes.

### 6.3 Deployment y Entornos

Estrategia de despliegue multi-entorno con contenedores como unidad de distribución.

| Entorno                | Stack              | Descripción                                                                                           |
| ---------------------- | ------------------ | ----------------------------------------------------------------------------------------------------- |
| **Local (Dev)**        | Docker Compose     | `docker compose up` levanta Postgres, Frontend (Next.js), Core AI (Python) y, opcionalmente, Redis. Entorno idéntico para todos los devs. |
| **Staging**            | VPS + Docker       | Réplica de producción para QA y validación pre-release.                                               |
| **Producción (MVP)**   | VPS + Docker       | Single-server con reverse proxy, TLS, backups y healthchecks.                                         |
| **Producción (Scale)** | Vercel + Cloud Run | Frontend en Edge Network, Core AI auto-scaling en contenedores.                                       |

- **Stack de aplicación:** Next.js (TypeScript) + Supabase. Todo el backend de la aplicación se implementa en Node.js/TypeScript (Server Actions, API Routes) para mantener consistencia de stack.
- **Core AI (Python estable compatible):** Componente integral del framework. Runtime independiente que encapsula toda la lógica de Inteligencia Artificial (LLM orchestration, embeddings, RAG, procesamiento de lenguaje natural). Dockerfile propio. Python se utiliza exclusivamente para el Core AI; toda lógica de aplicación y API de negocio se implementa en Node.js/TypeScript. El Core AI es parte constitutiva del framework: las aplicaciones modernas SaaS requieren capacidades de IA como funcionalidad base, no como extensión opcional.
- **Comunicación Node.js ↔ Core AI:** Los dos runtimes se comunican vía **API REST interna**. El Core AI expone endpoints HTTP en un puerto interno (no expuesto a internet). Las Server Actions de `src/framework/ai/` invocan al Core AI mediante `fetch()` nativo. En producción, un **reverse proxy** (Nginx/Traefik) enruta las peticiones desde un único dominio público (puerto 443 con SSL): las rutas `/api/ai/*` se dirigen al Core AI y el resto a Next.js. **Autenticación interna:** Las peticiones del backend Node.js al Core AI se autentican con un token compartido (`CORE_AI_SECRET` en variables de entorno, incluido en el header `Authorization`). Este token es independiente del JWT de usuario; las Server Actions pasan `tenant_id` y `user_id` como parámetros en el body para trazabilidad y registro de costos (§6.2.2).
- **Redis 7.x (Opcional, pero sugerido):** Redis puede habilitarse para caché compartida multi-instancia, rate limits distribuidos, quotas por Tenant, locks, invalidación y BullMQ, pero está apagado por defecto (`infrastructure.redis_enabled = false`). El MVP debe operar correctamente sin Redis. Para jobs disparados por usuario y procesamiento asíncrono sin Redis, la opción base es Inngest.
- **Dockerfiles:** Incluidos en el repositorio para Frontend y Core AI. Las versiones exactas se fijan en la matriz validada al implementar el scaffold.
- **Requisitos Mínimos Obligatorios:** Node.js LTS estable compatible, PostgreSQL soportado por Supabase y Python estable compatible para Core AI. **Opcional:** Redis estable compatible.
- **Referencia expandida:** arquitectura lógica en `REFERENCE_ARCHITECTURE.md` y estructura de directorios en `REFERENCE_STRUCTURE.md`.

### 6.4 Infraestructura de Jobs Programados

Para la gestión de tareas recurrentes y procesos en background que requieren ejecución temporal planificada.

| Aspecto | Especificación |
|:--------|:---------------|
| **Stack programado** | `pg_cron` (extensión PostgreSQL nativa en Supabase) para jobs simples y basados en tiempo. |
| **Stack asíncrono sin Redis** | Inngest para trabajos disparados por usuario, workflows durables, Import/Export grande y retry sin bloquear requests HTTP. |
| **Stack opcional con Redis** | BullMQ + Redis cuando `infrastructure.redis_enabled = true` y la aplicación requiera colas dedicadas, cache compartida, rate limits distribuidos, quotas, locks o invalidación. |
| **Fallback** | Procesamiento síncrono solo para tareas pequeñas y acotadas. |

- **Catálogo de Jobs Conocidos:**
  - **`System_Purge_Worker` (Job Crítico Unificado):** Job consolidado responsable de toda la purga de datos en el sistema. Gestiona: (1) limpieza de registros soft-deleted cuyo `auto_purge_days` ha expirado (§4.5), (2) hard-delete de usuarios marcados para eliminación cuyo período de retención expiró (§2.3.12, §2.3.14), (3) hard-delete de Tenants marcados para eliminación cuyo período de retención expiró (§2.3.13), y (4) purga de archivos temporales huérfanos (§4.6.8). Registra cada operación en el módulo Log con conteo de registros procesados por tabla.
  - **`Trial_Reminder_Worker`:** Recordatorios de expiración de trial (§2.4.3).
  - **`Import_Export_Worker`:** Procesamiento asíncrono de Import/Export (§3.B).
  - **`Billing_Cycle_Worker`:** Cálculo del ciclo de facturación y generación de Statements.
- **Política de Retry:** 3 intentos con backoff exponencial (1min, 5min, 15min) ante fallos transitorios.
- **Monitoreo:** Cada ejecución de cron/job genera un registro en el módulo Log (§3.A) con la metadata del resultado de la ejecución.

---

## 7. Criterios de Aceptación Globales

### 7.1 Estrategia de Testing (Testing Pyramid)

El framework exige una cobertura integral estructurada en 3 capas, usando Vitest (Unit/Integration) y Playwright (E2E).

- **Unit Testing (Vitest):** Pruebas de lógica pura (utils, helpers, reducers, cálculos de billing). Mocking estricto de la base de datos y servicios externos. Rápida ejecución en cada commit.
- **Integration Testing (Vitest):** Pruebas de Server Actions y APIs. Requieren base de datos de test local aislada por transacción (para evitar colisiones) o mediante Supabase Local. Validación de políticas RLS y consultas complejas.
- **E2E Testing (Playwright):** Pruebas de flujos críticos de usuario simulando un navegador real. Cobertura obligatoria de: login, sign up, billing checkout, y creación de registros en el Grid Universal. Obligatorio testear en viewports de Mobile (375x812) y Desktop (1920x1080).

### 7.2 Criterios de Aceptación Empíricos

Para certificar la funcionalidad del **From Zero Framework**, la entrega final debe superar los siguientes criterios empíricos y no negociables:

1. **El Proceso de Inicialización Ejecuta sin Errores:** Al ejecutar la inicialización de la base, el sistema debe leer el `bootstrap.json` y provisionar de manera automática: El Tenant Zero, Super Admin, Parámetros de Sistema base, Módulos Core, y un Perfil Inicial Funcional.
2. **Modularidad Inquebrantable:** Un desarrollador IA o humano, basándose en la documentación y patrones del framework, debe poder construir un nuevo Módulo (ej. un CRM) de principio a fin de manera expedita, heredando gratuitamente: Auth, RLS, Vistas, Grids Universales, Búsquedas y Logs.
3. **Pase Integral de Pruebas de Seguridad:** Ejecución en limpio de pruebas OWASP Top 10, blindaje SQLi, Rate Limiting efectivo y controles de concurrencia de sesiones. Ninguna política RLS puede exponer datos inter-tenant (Tenant isolation hermético).
4. **App Completamente Funcional:** El framework debe levantar una aplicación funcional completa. Debe ser posible empaquetar, hacer build, desplegar (Vercel/Docker) y someter el endpoint productivo a herramientas de Stress Testing (Benchmark) y auditoría sin arrojar excepciones ni cuellos de botella obvios.
5. **Diseño Responsivo Verificado:** Toda vista, componente y flujo de la aplicación debe ser completamente funcional y usable en los 3 breakpoints de referencia: mobile (375px), tablet (768px) y desktop (1920px). Las pruebas E2E deben incluir al menos un escenario en viewport mobile y uno en viewport desktop. Ningún componente puede presentar overflow horizontal, elementos superpuestos, textos truncados sin control, o targets táctiles menores a 44x44px.

---

## 8. Extensiones Posteriores al MVP Web

Funcionalidades que no bloquean el MVP web del framework, pero que la arquitectura debe permitir o que pueden activarse en aplicaciones derivadas:

| Feature | Versión Target | Dependencia |
|:--------|:---------------|:------------|
| App móvil nativa | Posterior | Backend API-first del framework |
| Push notifications | Posterior | App móvil nativa |
| Tickets de Soporte completos | Aplicación derivada / posterior | Módulo dedicado si la aplicación lo requiere |
| Portal Público CMS dinámico | Aplicación derivada / posterior | Documents module |
| Dashboard widgets de terceros | Aplicación derivada / posterior | Widget registry |
| `trigger_job` en Event Bus | Posterior | Registry de jobs custom |

---

*(Fin del Documento Maestro PRD - Source of Truth)*
