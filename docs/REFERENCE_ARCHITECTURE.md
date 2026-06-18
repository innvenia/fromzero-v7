# Arquitectura de Referencia - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-07
> **Fuente de verdad:** [`PRD.md`](./PRD.md)
> **Propósito:** Blueprint técnico de la arquitectura del framework. Complementa al PRD con decisiones arquitectónicas y patrones de implementación.
> **Alcance:** Documentación de producto y arquitectura objetivo del framework.

---

## 1. Visión Arquitectónica

### 1.1 Filosofía
From Zero Framework es un **Sistema Integrado de Creación de Aplicaciones** - determinista, seguro y escalable. Opera como el "Sistema Operativo" de la aplicación final, abstrayendo autenticación, multi-tenancy, facturación, permisos y gestión de usuarios.

**Principios rectores:**
- **Configuration over Code:** Funcionalidades complejas (RBAC, Multi-Tenant, Billing) se activan por configuración.
- **Separación por superficie:** El router de Next.js (`src/app`), el código del framework (`src/framework`) y la aplicación web (`src/web`) están físicamente separados. La aplicación móvil se tratará como una superficie futura separada.
- **Agnóstico del dominio:** Sirve CRM, ERP, e-commerce o cualquier vertical sin lógica de industria.
- **Mobile-First Responsive:** Diseño responsivo obligatorio. App nativa diferida (arquitectura API-first lo permite).

### 1.2 KPIs de Calidad (objetivos del producto)

| Métrica | Target |
|:--------|:-------|
| FCP (First Contentful Paint) | < 1.5s |
| LCP (Largest Contentful Paint) | < 2.5s (Fast 3G) |
| API Latency p95 | < 200ms |
| Lighthouse Score | > 90 (Performance, Accessibility, Best Practices, SEO) |
| Test Coverage | ≥ 80% |

Los controles verificables de escalabilidad se detallan en [`SCALABILITY_ASSURANCE.md`](./SCALABILITY_ASSURANCE.md). Seguridad y escalabilidad son pilares paralelos del producto.

---

## 2. Stack Tecnológico

La referencia canónica de stack, versiones, compatibilidad, herramientas y conectores está en [`REFERENCE_STACK.md`](./REFERENCE_STACK.md). Esta sección resume las decisiones principales.

### 2.1 Stack Principal

| Capa | Tecnología | Función |
|:-----|:-----------|:--------|
| **Frontend** | Next.js (App Router) + React + Tailwind v4 | SPA/SSR con RSC |
| **Backend (Negocio)** | Node.js / TypeScript (Server Actions, API Routes) | Mutaciones, validación, lógica de negocio |
| **Base de Datos** | PostgreSQL (Supabase) | Datos, RLS, PostgREST |
| **Autenticación** | Supabase Auth | JWT, sesiones, usuario/contraseña, OAuth opcional configurable |
| **Storage** | Supabase Storage (S3-compatible) | Archivos con Presigned URLs |
| **Core AI** | Python (FastAPI + Pydantic v2 - runtime independiente) | RAG, embeddings, inferencia LLM |
| **Pagos** | Adapter configurable de pagos | Suscripciones, facturación y webhooks |
| **i18n** | next-intl | Internacionalización type-safe |
| **Validación** | Zod | Bimodal (cliente + servidor) |
| **UI Base** | shadcn/ui + Design System propietario | Componentes accesibles y personalizables |

### 2.2 Stack Opcional Sugerido

> **Nota:** Estas funcionalidades **no son requeridas** para el funcionamiento core. Se sugieren en producción, pero no es obligatorio configurarlas para iniciar el desarrollo local.

| Categoría | Herramientas Soportadas | Función Sugerida |
|:----------|:------------------------|:------------------|
| **Analytics & Tracking** | PostHog, GA4, Clarity, Meta Pixel | Entender uso del sistema y funnel. |
| **Seguridad Perimetral** | Cloudflare WAF, Turnstile, reCAPTCHA v3 | Mitigar ataques DDoS y bots. |
| **Infra & Despliegue** | VPS genérico, PaaS compatible | Opciones de hosting self-hosted o gestionado. |
| **Email transaccional** | Adapter configurable de email | Correos transaccionales. Resend puede ser default inicial reemplazable. |
| **Observabilidad** | Sentry | Error tracking y performance. |

### 2.3 Restricciones del Stack
- **Python NO es backend de negocio.** Solo se usa para el Core AI (FastAPI + Pydantic v2).
- **Toda lógica CRUD y de negocio** se implementa en Node.js/TypeScript (Server Actions).
- **Design System propietario** basado en shadcn/ui + Tailwind v4. Componentes propios en `src/framework/ui/`.
- **No Edge Functions de Supabase.** El Core AI es un servicio Python invocado desde Server Actions.

### 2.4 Tareas en Segundo Plano (Background Jobs)
- **Jobs programados:** `pg_cron` para procesos basados en tiempo (purga de soft-deletes, expiración de tokens, recordatorios de trial).
- **Jobs disparados por usuario:** Inngest para workflows asíncronos sin Redis, incluyendo Import/Export grande, reintentos y procesos que no deben bloquear requests HTTP.
- **Redis/BullMQ:** opcional, apagado por defecto (`redis_enabled = false`), pero sugerido cuando una app requiera cache compartida multi-instancia, rate limits distribuidos, quotas, locks, invalidación o colas dedicadas.
- **Regla:** El framework debe arrancar y operar sin Redis.

### 2.5 Escalabilidad Operativa

Todo módulo y app derivada debe documentar cinco decisiones:

| Pilar | Decisión requerida |
|---|---|
| Cache | No cache, Next/Data cache, HTTP/CDN, Redis o materialized view. |
| Async | Sync acotado, `pg_cron`, Inngest o BullMQ + Redis. |
| Queries | Índices, paginación, p95 esperado y ausencia de N+1. |
| Load | Escenario k6 si el flujo es crítico o bloquea release. |
| Scale | Stateless backend, multi-instancia, load balancing, quotas y observabilidad. |

---

## 3. Arquitectura de Datos

### 3.1 Modelo de Aislamiento (Multi-Tenant)

| Concepto | Implementación |
|:---------|:---------------|
| **Tenant** | Unidad fundamental de aislamiento de datos. |
| **Profile** | Conjunto de permisos (RBAC). |
| **User** | Persona autenticada. Adopta un Profile dentro de un Tenant vía `user_memberships`. |

**Terminología obligatoria:** `Tenant`, `Profile`, `Log` en código, base de datos y documentación técnica. En la UI, `Tenant` se presenta exclusivamente como "Account" (EN) o "Cuenta" (ES) vía i18n.

**RLS obligatorio:** Toda tabla con `tenant_id` → política RLS por `tenant_id` derivado del JWT Custom Claim (`app_metadata.tenant_id`).

Los controles verificables de seguridad, OWASP, API Security, ASVS y SSDLC se detallan en [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md).

**Excepción documentada:** Tablas globales sin `tenant_id` (`settings`, `plans`, `ai_models`, `modules`, `profiles` globales).

### 3.2 Contexto de Tenant (JWT Custom Claims)
```
Login → Supabase Auth → JWT con Custom Claim (app_metadata.tenant_id) → RLS
```
- El `tenant_id` se inyecta como Custom Claim en el JWT.
- **NO se usa header HTTP** (`x-tenant-id`). El JWT es la única fuente de verdad.
- Para M2M (API Keys): el `tenant_id` se resuelve de la key y se inyecta en el contexto RLS de forma idéntica.

### 3.3 Jerarquía de Seguridad
```
Tenant (RLS) → Profile (RBAC) → User (Identity)
```
Perfiles base: **Super Admin** (plataforma), **Admin** (Tenant), **Member** (limitado), **Guest** (read-only).

### 3.4 Feature Gating
- Control activo de recursos **antes** de la escritura: `checkPlanFeature(tenantId, featureKey)`.
- Evaluado contra `plans.features` (JSONB) de la suscripción activa del Tenant.
- Al alcanzar límite → bloqueo con modal de upgrade.

### 3.5 Naming Conventions

| Elemento | Convención | Ejemplo |
|:---------|:-----------|:--------|
| Tablas BD | `snake_case` PLURAL | `custom_fields`, `api_keys` |
| Slugs/Rutas | `kebab-case` SINGULAR | `/custom-field`, `/api-key` |
| Código de módulo | `kebab-case` SINGULAR | `custom-field`, `ai-model` |
| Archivos i18n | `snake_case` SINGULAR | `custom_field.json` |
| Componentes React | `PascalCase` | `CustomFieldForm.tsx` |
| Server Actions | `camelCase` | `getCustomFields()` |

### 3.6 Campos Comunes Heredados
Todo módulo hereda automáticamente (gestionados por Server Actions):
- `created_by`, `updated_by`, `deleted_by` (UUID FK auth.users)
- `created_at`, `updated_at`, `deleted_at` (timestamptz)

---

## 4. Patrones Arquitectónicos

### 4.1 Aislamiento Base vs. Aplicación

| Zona | Contenido | Modificación |
|:-----|:----------|:-------------|
| `src/framework/` | La base: módulos de sistema (Auth, Settings, Billing), UI compartida, services | Rara vez |
| `src/web/` | La aplicación web: módulos de negocio específicos del dominio | Desarrollo activo |

Ambos exponen módulos al usuario final. La distinción es arquitectónica: el framework es la base reutilizable; la aplicación es lo que se monta encima.

### 4.2 Definición de Módulo
Triada obligatoria: **Tabla(s) BD + Grid Universal + Formulario**.

Excepciones documentadas:
- **Read-only** (Log, Notificaciones): Grid + visualización (no edición).
- **Singleton** (Settings): Formulario de tabs sin Grid.
- **UI inyectable** (Tags, Bookmarks): Tabla + Grid + formulario embebido en otros módulos.

27 módulos de sistema pre-registrados en la inicialización.

### 4.3 Module Factory: Bootstrap → Base de Datos

El framework opera bajo un modelo **bootstrap-a-base-de-datos**:

```
bootstrap.json (bootstrap declarativo)  →  Inicialización  →  Tablas de configuración (settings, modules)  →  Runtime (la BD es la fuente de verdad)
```

- Los parámetros de cada módulo **nacen** en un archivo de parámetros declarativo (`bootstrap.json`, el bootstrap).
- Durante la inicialización, esos parámetros se **vuelcan** a tablas de configuración en la BD (`settings`, `modules`).
- En **runtime**, la configuración de módulos (Grid, Import/Export, presentación) se lee de la tabla `modules`; **no** se consume un archivo JSON por módulo en tiempo de ejecución.
- Los formularios de cada módulo son **TSX específicos** (`[Slug]Form.tsx`), no autogenerados desde configuración.

### 4.4 Validación Bimodal (Zod)
```
Cliente (UX feedback) → Server Action (Seguridad) → Supabase (RLS)
```
Mismo schema Zod compartido; el servidor SIEMPRE revalida.

### 4.5 Server/Client Boundary
- **Server Actions / API Routes:** Mutaciones y consultas con seguridad.
- **Client Components:** Solo interactividad UI.
- **Prohibido:** Mutaciones desde Client Components directos.

### 4.6 Presigned URLs (File Upload)
```
Cliente → Server Action (solicitud) → Presigned URL → Upload directo (Browser → Storage)
```
Bypass del servidor Node.js. Validación de MIME type y tamaño server-side antes de generar la URL.

### 4.7 Cascada de Configuración
```
Settings (Global) → Tenant (Override) → User (Override personal)
```
Parámetros como `locale`, `timezone`, `mfa_policy`, `date_format` se resuelven en cascada.

### 4.8 Modo de Operación

| Modo | Registro | Tenants | Billing |
|:-----|:---------|:---------|:--------|
| **SaaS** | Público | Múltiples | Activo |
| **Corporate** | Deshabilitado | Uno | Opcional |

Configurado por `app_mode` en `settings`.

### 4.9 Soft Delete Obligatorio
- `DELETE` físico prohibido en tablas de negocio.
- Campo `deleted_at` marca eliminación lógica.
- Purga automática (`soft_delete.auto_purge_days`).
- Anonimización transaccional para preservar integridad de logs.

### 4.10 Event Bus (Motor de Reglas)
Motor de automatización "Si-Entonces" basado en reglas configurables:
- Trigger → Condición → Acción (operadores nativos, sin dependencias externas de reglas).
- Protección contra loops infinitos.
- Límite por plan (`max_rules`).
- Toggle global: `event_bus_enabled` en Settings.

### 4.11 Core AI (Integración IA)
- Servicio **Python independiente** (`core-ai/`, runtime separado).
- Invocado desde **Server Actions** a través del bridge en `src/framework/ai/`.
- Catálogo de modelos en tabla `ai_models` (global).
- Credenciales de proveedor por Tenant (tabla `integrations`).
- Tracking de costos en `logs.metadata`.

---

## 5. Integración con Servicios Externos

### 5.1 Supabase

| Servicio | Uso |
|:---------|:----|
| **Auth** | Autenticación, JWT, sesiones, MFA (delegado) |
| **Database** | PostgreSQL con RLS multi-tenant |
| **Storage** | Archivos vía Presigned URLs. Buckets: `public_assets`, `private_documents` |
| **PostgREST** | API REST auto-generada (acceso controlado por RLS) |

**Gestión de sesiones:** capacidades nativas de Supabase Auth (refresh tokens, sesiones activas). No se implementa tabla `active_sessions` separada salvo que las capacidades nativas resulten insuficientes.

### 5.2 Adapter de pagos

| Servicio | Uso |
|:---------|:----|
| **Checkout** | Flujo de pago hosted o equivalente del proveedor configurado |
| **Billing** | Suscripciones recurrentes |
| **Webhooks** | Eventos financieros con verificación de firma obligatoria |

- El framework define un contrato de adapter. Stripe puede ser el default inicial, pero no es obligatorio para apps derivadas.
- La BD almacena solo IDs referenciales (`external_subscription_id`, `external_invoice_id`) y estados normalizados.
- Los detalles específicos de reembolsos, checkout y conciliación dependen del proveedor activo.

---

## 6. UI/UX

### 6.1 Design System Propietario
- **Base:** shadcn/ui (Radix primitives) + Tailwind v4 (`@theme` para CSS variables nativas).
- **Principio:** Componentes a medida en `src/framework/ui/`. RSC-first (`'use client'` solo cuando hay interactividad DOM).
- **Theme Engine:** Variables CSS inyectadas desde el bootstrap (`bootstrap.json`) → BD → `:root`. Hook `useBranding()` para server-side injection.

### 6.2 Grid Universal
Componente maestro de visualización tabular:
- Paginación server-side.
- Persistencia de columnas por usuario (`user_preferences`).
- Rich Columns: badges, avatares, barras de progreso, iconos condicionales.
- Configuración dinámica desde la tabla `modules`.
- Card View en mobile (<768px).
- Toggle de Papelera de Reciclaje (admins) - NO es módulo independiente.

**Interface canónica:**
```typescript
interface UniversalDataGridProps<T = any> {
  moduleSlug: string;                 // Slug del módulo (lee config de BD)
  tenantId: string;                   // Aislamiento RLS mandatorio
  data: T[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  isFetching?: boolean;
  showRecycleBin?: boolean;           // Toggle Papelera (admins only)
  onRowClick?: (id: string | number) => void;
  onPageChange?: (page: number) => void;
  onSearch?: (query: string) => void;
  hideToolbar?: boolean;              // Modo "Embedded"
}
```

### 6.3 i18n
- **Framework namespaces** (always loaded): `common`, `layout`, `validation`.
- **Module namespaces** (lazy loaded): uno por módulo.
- **Type-safe keys:** la compilación falla si falta una key.
- **Zero Hardcoded Strings:** todo texto visible pasa por `next-intl`.

### 6.4 Zonas de Experiencia

| Zona | Layout | Propósito |
|:-----|:-------|:----------|
| **Pública** | Full-width, sin sidebar | Landing, SEO, registro |
| **Auth** | Full-width, sin sidebar | Login, signup, reset |
| **Dashboard** | Sidebar + Header + Main | Operación diaria |

### 6.5 Branding Runtime
Inyección dinámica de marca (colores, logos, fuente) desde la BD hacia CSS variables.

**Fallback chain:**
```
1. BD → settings.config.branding (fuente primaria, runtime)
2. bootstrap.json → branding (valores iniciales, solo en inicialización)
3. Defaults hardcoded (Inter, #465FFF) - último recurso
```

### 6.6 Sidebar Navigation (RBAC-Aware)
Motor de renderizado dinámico basado en RBAC. Fuente de datos:
- Tabla `modules` → `slug`, `display_name`, `icon`, `category`, `display_order`.
- Tabla `profile_permissions` → permisos del perfil autenticado.
- Solo se renderizan módulos `is_active = true` AND con al menos permiso `view`.

---

## 7. Operaciones

### 7.1 Modo Mantenimiento
Toggle en Settings (Super Admin). Bloquea acceso a usuarios finales con pantalla informativa; permite acceso a Super Admin e ingenieros.

### 7.2 Inicialización (Bootstrap → BD)
- `bootstrap.json` (bootstrap) define el ADN del proyecto (modo, nombre, admin inicial, planes, módulos).
- La inicialización vuelca esos parámetros a la BD.
- Post-inicialización: `bootstrap.json` pierde efecto → gestión desde el módulo Settings.

### 7.3 Jobs y Cron
- Purga automática de soft-deletes.
- Limpieza de usuarios inactivos.
- Expiración de invitaciones y tokens.
- Recordatorios de trial.
- Cada ejecución registrada en tabla `logs`.
- (Mecanismo de colas dedicado: diferido - ver §2.4.)

### 7.4 Observabilidad (Opcional)
Sentry sugerido, inyectando el DSN en el bootstrap o variables de entorno. Si se omite, el framework opera normalmente.

---

## 8. Funciones y Extensiones Futuras

> Conceptos fuera del MVP web o dependientes de aplicaciones derivadas. La arquitectura debe permitirlos sin bloquear el framework base.

- **Data Regions (Soberanía de Datos):** Multi-Región geográfica. Default actual: Single-Region.
- **App Móvil Nativa:** posterior. El backend conserva compatibilidad API-first.
- **Sincronización Offline:** Diferida (Service Workers + IndexedDB).
- **Colas durables dedicadas (BullMQ + Redis):** opcionales, pero sugeridas cuando una aplicación requiera infraestructura de colas propia, cache compartida, rate limits distribuidos, quotas, locks o invalidación (ver §2.4).

---

## 9. Referencias Cruzadas

| Documento | Contenido |
|:----------|:----------|
| [`PRD.md`](./PRD.md) | Fuente de Verdad - especificaciones funcionales |
| [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md) | Especificación técnica de los 27 módulos |
| [`REFERENCE_STRUCTURE.md`](./REFERENCE_STRUCTURE.md) | Anatomía física del proyecto |
| [`REFERENCE_THREAT_MODEL.md`](./REFERENCE_THREAT_MODEL.md) | Modelo de amenazas y requisitos de seguridad |
| [`BOOTSTRAP_REFERENCE.md`](./BOOTSTRAP_REFERENCE.md) | Schema del bootstrap de configuración |
| [`REFERENCE_DATABASE_SCHEMA.md`](./REFERENCE_DATABASE_SCHEMA.md) | Contrato consolidado de tablas, RLS y ownership |
| [`REFERENCE_STACK.md`](./REFERENCE_STACK.md) | Stack, versiones, herramientas y conectores |
| [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md) | Controles verificables OWASP, SSDLC y anti-abuso |
| [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md) | Dependencias por fase/módulo y criterios de aceptación |
