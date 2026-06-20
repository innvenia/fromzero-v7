# Referencia Técnica de Módulos - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-06
> **Fuente de verdad:** [`PRD.md`](./PRD.md) - Secciones §1.3, §3.A–§3.D
> **Propósito:** Especificación técnica canónica de los **28 módulos core** del framework. Cada entrada define schema de BD, server actions, estructura de UI, integraciones y parámetros configurables. Este documento complementa al PRD: el PRD describe **qué** y **por qué**; este documento especifica **cómo** se implementa técnicamente.
> **Referencias de implementación:** Dependencias y aceptación en [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md). Controles verificables de seguridad en [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md).

> [!IMPORTANT]
> **Regla de consistencia:** Si existe conflicto entre este documento y el PRD, el PRD prevalece como fuente de verdad. Cualquier módulo no listado en el PRD §3.A–§3.D no es un módulo válido del framework.

---

## Convenciones

> [!WARNING]
> **INVARIANTE TERMINOLÓGICA ESTRICTA (TENANT vs ACCOUNT)**
> Queda **estrictamente prohibido** el uso de la palabra `account`, `accountId`, `Account` o similares en cualquier nombre de variable, columna de base de datos, Server Action, Endpoint de API o nombre de archivo de la capa lógica/datos. 
> El concepto técnico para el aislamiento de datos (Multi-Tenancy) es única y exclusivamente **Tenant** (`tenant_id`). La palabra "Account" está reservada **solamente para etiquetas visuales de la interfaz (UI) y archivos i18n**. Violar esta regla corrompe el determinismo arquitectónico del framework.

| Elemento | Estándar | Ejemplo |
|:---------|:---------|:--------|
| **Tablas BD** | `snake_case` plural | `custom_fields`, `api_keys` |
| **Slugs/Rutas** | `kebab-case` singular | `/custom-field`, `/api-key` |
| **Código de módulo** | `kebab-case` singular | `custom-field`, `ai-model` |
| **Archivos i18n** | `snake_case` singular | `custom_field.json` |
| **Componentes React** | `PascalCase` | `CustomFieldForm.tsx` |
| **Server Actions** | `camelCase` | `getCustomFields()` |
| **Metadata transversal** | Heredada automáticamente (§4.24 PRD) | Autoría, timestamps, soft-delete, restauración y origen/importación cuando aplique |

> **Base URL Frontend:** `http://localhost:3000/[locale]`
> **Convención de rutas:** `/{locale}/[module-slug]` = Grid, `/{locale}/[module-slug]/new` = Crear, `/{locale}/[module-slug]/[id]` = Editar/Ver

---

## Metadata Transversal Heredada

Todo módulo mutable hereda automáticamente estos campos gestionados por Server Actions (no visibles en formularios):

| Campo | Tipo | Descripción |
|:------|:-----|:------------|
| `created_by` | `UUID FK auth.users` | Usuario que creó el registro |
| `updated_by` | `UUID FK auth.users, nullable` | Último usuario que modificó |
| `created_at` | `timestamptz` | Timestamp de creación |
| `updated_at` | `timestamptz` | Timestamp de última modificación |

Los módulos con soft-delete heredan además:

| Campo | Tipo | Descripción |
|:------|:-----|:------------|
| `deleted_at` | `timestamptz, nullable` | Timestamp de soft-delete (NULL = activo) |
| `deleted_by` | `UUID FK auth.users, nullable` | Usuario que ejecutó soft-delete |
| `restored_at` | `timestamptz, nullable` | Timestamp de última restauración |
| `restored_by` | `UUID FK auth.users, nullable` | Usuario que ejecutó la última restauración |

Los módulos que soportan importación o sincronización externa heredan además:

| Campo | Tipo | Descripción |
|:------|:-----|:------------|
| `source_type` | `varchar(30)` | Origen: `manual`, `import`, `api`, `migration`, `system` o `external_sync` |
| `source_import_id` | `UUID FK imports, nullable` | Import job que creó o actualizó el registro |
| `imported_at` | `timestamptz, nullable` | Timestamp de ingreso por importación |
| `imported_by` | `UUID FK auth.users, nullable` | Usuario que confirmó la importación |
| `source_external_id` | `varchar(200), nullable` | ID externo del sistema origen |
| `source_row_number` | `integer, nullable` | Fila del archivo origen |
| `source_checksum` | `varchar(128), nullable` | Hash para deduplicación e idempotencia |

Los conteos de purga no se guardan en las filas eliminadas; se registran en `logs.metadata` y, para purga completa de Tenant, en `tenants.purge_log`.

---

## A. Módulos de Aplicación (Solo Super Admin)

Módulos de gestión global de la plataforma. Acceso exclusivo para usuarios con Profile **Super Admin**.

---

### A1. `settings` - Parámetros

> **PRD:** §3.A | **Tabla:** `settings` | **Ruta:** Singleton (sin Grid) | **i18n:** `settings`
> **Clasificación:** Módulo singleton - un único registro global editado vía formulario de tabs.

#### Descripción Técnica

Configura el comportamiento global de toda la aplicación. Opera como un registro singleton en BD cuyo campo principal `config` (JSONB) almacena toda la configuración organizada en secciones temáticas. Los valores nacen del `bootstrap.json` durante la inicialización y se gestionan exclusivamente desde esta UI post-despliegue.

#### Schema de Base de Datos

**Tabla `settings`** (singleton):

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único (un solo registro) |
| `config` | `JSONB` | NOT NULL | Objeto JSON con toda la configuración organizada en secciones |
| `updated_by` | `UUID FK auth.users` | | Último administrador que modificó |
| `updated_at` | `timestamptz` | | Timestamp de última modificación |

**Estructura canónica del campo `config` (JSONB) - 12 secciones:**

| Sección | Keys principales (referencia bootstrap.json) | Descripción |
|:--------|:----------------------------------------|:------------|
| **general** | `app_mode` (`saas`\|`corporate`), `app_name`, `app_url`, `maintenance_mode`, `event_bus_enabled` | Configuración base de la aplicación |
| **security** | `session_timeout_minutes`, `absolute_timeout_minutes`, `max_login_attempts`, `mfa_policy`, `mfa_default_method`, `mfa_backup_codes_count`, `otp_ttl_minutes`, `password_min_length`, `password_max_length`, `password_require_uppercase`, `password_require_lowercase`, `password_require_number`, `password_require_symbol`, `password_allowed_symbols`, `password_expiry_days`, `password_history_count`, `reset_token_ttl_hours`, `email_verification_ttl_hours`, `invitation_ttl_days`, `cleanup_inactive_users_after_days`, `enable_ip_whitelist`, `allowed_ips`, `enable_rate_limit`, `rate_limit_global`, `rate_limit_tenant`, `rate_limit_per_endpoint` | Políticas de autenticación, sesiones, contraseñas, TTLs y seguridad perimetral |
| **branding** | `primary_color`, `primary_color_dark`, `secondary_color`, `logo_full_light`, `logo_full_dark`, `logo_icon`, `logo_auth`, `favicon_url`, `font_family` | Identidad visual de la aplicación (Theme Engine §4.8) |
| **notifications** | Canal por defecto, políticas de notificación, `auto_dismiss_seconds` | Configuración global del sistema de notificaciones |
| **storage** | `allowed_mime_types`, `max_file_size_mb`, `max_storage_per_tenant_mb`, `image_optimization_webp` | Políticas de almacenamiento de archivos |
| **ai** | `ai_enabled`, `ai_default_model_id` | Habilitación y modelo por defecto del Core IA |
| **billing** | `billing_enabled`, `licensing_model` (`per_tenant`\|`per_user`), `payments.provider`, `payments.mode` | Facturación y adapter de pasarela de pagos |
| **i18n** | `default_locale`, `supported_locales` | Idiomas soportados y locale por defecto |
| **ui_defaults** | `default_page_size`, `default_search_result_limit`, `max_bookmarks_per_user`, `breadcrumbs_enabled` | Valores por defecto de componentes UI |
| **legal** | `terms_version`, `privacy_url`, `terms_url` | Versión de documentos legales y URLs |
| **cleanup** | `soft_delete.auto_purge_days`, `user_deletion.retention_days`, `user_deletion.purge_authored_records`, `tenant_deletion.retention_days`, `tenant_deletion.trial_expired_retention_days` | Políticas de retención y purga |
| **integrations** | Configuración de servicios externos globales | Integraciones a nivel plataforma |

**RLS:** La tabla `settings` es global (sin `tenant_id`). No aplica RLS de tenant. Acceso restringido a Super Admin por RBAC.

#### Server Actions

| Función | Parámetros | Retorno | Descripción |
|:--------|:-----------|:--------|:------------|
| `getSettings()` | - | `Settings` | Obtiene el registro singleton completo |
| `updateSettings(section, data)` | `section: string`, `data: object` | `Settings` | Actualiza una sección específica del JSONB `config` |

#### Estructura de UI

**Tipo:** Formulario singleton con **12 tabs** (no posee Grid).

| Tab | Sección `config` | Campos principales |
|:----|:-----------------|:-------------------|
| 1. General | `general` | `app_name`, `app_mode`, `app_url`, `maintenance_mode`, `event_bus_enabled` |
| 2. Seguridad | `security` | Políticas de contraseña, sesiones, MFA, TTLs |
| 3. Branding | `branding` | Colores, logos (4 variantes), favicon, tipografía |
| 4. Notificaciones | `notifications` | Canal por defecto, políticas |
| 5. Storage | `storage` | MIME types, límites de tamaño, WebP |
| 6. AI | `ai` | Toggle `ai_enabled`, modelo por defecto |
| 7. Billing | `billing` | Toggle `billing_enabled`, modelo de licenciamiento, proveedor de pagos |
| 8. i18n | `i18n` | Locale por defecto, idiomas soportados |
| 9. UI Defaults | `ui_defaults` | Page size, search result limit, breadcrumbs |
| 10. Legal | `legal` | Versión de términos, URLs de documentos legales |
| 11. Cleanup/Retention | `cleanup` | Días de retención de soft-delete, usuarios, tenants |
| 12. Integraciones | `integrations` | Servicios externos: Analytics (Clarity, PostHog, GA4), Marketing (GTM, Meta), Seguridad (reCAPTCHA, Turnstile, Cloudflare), Monitoreo (Sentry), Email y operaciones (Resend/Inngest u otros adapters) |

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **Todos los módulos** | Fuente de parámetros globales evaluados en runtime |
| **Theme Engine (§4.8)** | Sección `branding` alimenta CSS Variables |
| **Feature Gating (§2.4.5)** | `billing_enabled` controla visibilidad de módulos de facturación |
| **Motor de Renderizado de Menú (§4.9)** | `billing_enabled` determina qué módulos aparecen en sidebar |
| **Cascada de Configuración (§4.15)** | Nivel 1 (Global) de la cascada Settings → Tenant → User |
| **Event Bus (§4.13)** | `event_bus_enabled` habilita/deshabilita el motor de reglas |
| **Proceso de Inicialización (§1.8)** | Los valores nacen del `bootstrap.json`; post-despliegue se gestionan desde aquí |

#### Notas de Implementación

- Tras la ejecución del proceso de inicialización, el `bootstrap.json` pierde efecto y toda la configuración se gestiona exclusivamente desde este módulo.
- El campo `config` es un JSONB monolítico. Las actualizaciones son parciales por sección (merge, no replace).
- La tabla `logs` del módulo Log debe crearse junto con este módulo (paso 1 del orden de construcción §1.7.1) para que el Interceptor de Auditoría registre las operaciones subsiguientes.

---

### A2. `module` - Módulo de Módulos

> **PRD:** §3.A | **Tabla:** `modules` | **Ruta:** `/module` | **i18n:** `module`
> **Clasificación:** Módulo CRUD estándar con formulario de tabs.

#### Descripción Técnica

Registra y configura todos los módulos del sistema. Define cómo cada módulo se presenta en el Grid Universal, cómo participa en la Búsqueda Global, y cómo opera en Import/Export. **No configura formularios** - los formularios se diseñan manualmente en código (§4.24). Es la fuente de configuración dinámica que alimenta al Grid Universal (§4.7), al Motor de Renderizado de Menú (§4.9) y a la Búsqueda Global (§4.3).

#### Schema de Base de Datos

**Tabla `modules`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único del módulo |
| `name` | `varchar(100)` | NOT NULL, UNIQUE | Nombre display del módulo |
| `code` | `varchar(50)` | NOT NULL, UNIQUE | Código técnico kebab-case (`task`, `custom-field`) |
| `icon` | `varchar(50)` | | Nombre del icono (ej. Lucide icon name) |
| `slug` | `varchar(50)` | NOT NULL, UNIQUE | Slug para URL (singular, kebab-case) |
| `description` | `text` | | Descripción del módulo |
| `enabled` | `boolean` | DEFAULT `true` | Si el módulo está activo en la aplicación |
| `table_name` | `varchar(100)` | | Nombre de la tabla principal en BD |
| `display_field` | `varchar(100)` | | Campo primario para representación externa (Search, Bookmarks) |
| `display_subtitle_field` | `varchar(100)` | | Campo secundario opcional para contexto |
| `grid_columns` | `JSONB[]` | | Arreglo de definiciones de columna del Grid (§4.7.2) |
| `grid_default_sort` | `JSONB` | | Ordenamiento por defecto: `{ field, direction }` |
| `grid_default_page_size` | `integer` | | Registros/página. NULL hereda de `ui_defaults.default_page_size` |
| `grid_row_actions` | `string[]` | | Acciones por fila: `["view","edit","delete","duplicate"]` |
| `searchable` | `boolean` | DEFAULT `false` | Participa en Búsqueda Global |
| `search_fields` | `JSONB[]` | | Campos que participan en búsqueda con weight |
| `search_display_title` | `varchar(100)` | | Campo para título en resultados de búsqueda |
| `search_display_subtitle` | `varchar(100)` | | Campo para subtítulo en resultados |
| `search_display_detail_fields` | `string[]` | | Campos adicionales de detalle en resultados (máx 3) |
| `search_result_limit` | `integer` | | Máximo resultados por módulo (1-20). NULL hereda global |
| `sort_order` | `integer` | | Orden de aparición en sidebar |

**Estructura de `grid_columns` (cada elemento del JSONB[]):**

| Propiedad | Tipo | Descripción |
|:----------|:-----|:------------|
| `field` | `string` | Nombre del campo en BD |
| `label_key` | `string` | Clave i18n para el encabezado |
| `type` | `string` | Tipo de renderizado: `text`, `number`, `date`, `boolean`, `badge`, `avatar`, `link` |
| `width` | `string` | Ancho (`px` o `%`) |
| `sortable` | `boolean` | Si la columna permite ordenamiento |
| `filterable` | `boolean` | Si la columna permite filtrado |
| `visible` | `boolean` | Visibilidad por defecto |

**Estructura de `search_fields` (cada elemento del JSONB[]):**

| Propiedad | Tipo | Descripción |
|:----------|:-----|:------------|
| `field` | `string` | Nombre del campo en BD |
| `weight` | `string` | Prioridad: `high`, `medium`, `low` (default: `medium`) |

**RLS:** Tabla global (sin `tenant_id`). Solo Super Admin puede modificar registros.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getModules()` | Lista todos los módulos registrados |
| `getModuleByCode(code)` | Obtiene módulo por código |
| `createModule(data)` | Registra un nuevo módulo |
| `updateModule(id, data)` | Actualiza configuración del módulo |
| `updateModuleGridConfig(id, gridConfig)` | Actualiza configuración del Grid (tab Grid) |
| `updateModuleSearchConfig(id, searchConfig)` | Actualiza configuración de búsqueda (tab Search) |

#### Estructura de UI

**Formulario:** 6 tabs canónicos:

| Tab | Contenido |
|:----|:----------|
| **1. General** | `name`, `code`, `icon`, `slug`, `enabled`, `description` |
| **2. Grid** | Editor visual de `grid_columns`, `grid_default_sort`, `grid_default_page_size`, `grid_row_actions` |
| **3. Search** | `searchable`, `search_fields`, `search_display_title`, `search_display_subtitle`, `search_display_detail_fields`, `search_result_limit` |
| **4. Import** | Configuración de importación del módulo |
| **5. Export** | Configuración de exportación del módulo |
| **6. Automatizaciones** | Puente visual al Event Bus (§4.13). Si `event_bus_enabled = false` en Parámetros, muestra aviso informativo |

**Grid:** Columnas de `name`, `code`, `slug`, `enabled`, `sort_order`.

**Validaciones del tab Search:**
- Si `searchable = true`, `search_fields` no puede estar vacío (mínimo 1 campo).
- Los campos referenciados deben corresponder a columnas válidas de la tabla del módulo.
- `search_result_limit` debe estar en rango 1-20 si se especifica.

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **Grid Universal (§4.7)** | Fuente de configuración de columnas y comportamiento |
| **Búsqueda Global (§4.3)** | Configuración de participación y presentación de resultados |
| **Motor de Renderizado de Menú (§4.9)** | `enabled` y `sort_order` determinan visibilidad y posición en sidebar |
| **Profile (§3.A)** | Alimenta la matriz de permisos (un registro por combinación perfil × módulo) |
| **Import/Export (§3.B)** | Configuración de mapeo y formatos |
| **Campos Personalizados (§3.B)** | `entity_type` referencia el `code` del módulo |

#### Notas de Implementación

- Los 28 módulos core se pre-registran automáticamente durante la inicialización desde una lista canónica interna del framework. `initial_modules` en `bootstrap.json` se usa para overrides o módulos adicionales, no para definir si existe o no la base core.
- Módulos adicionales de la aplicación derivada se registran aquí al momento de su creación.
- El registro debe existir **antes** de implementar la lógica del módulo.
- **Restricción:** El Módulo de Módulos NO tiene tab de "Formulario" porque los formularios se diseñan manualmente en código.

---

### A3. `plan` - Planes

> **PRD:** §3.A, §2.4 | **Tabla:** `plans` | **Ruta:** `/plan` | **i18n:** `plan`
> **Clasificación:** Módulo CRUD estándar con formulario de 3 tabs.

#### Descripción Técnica

CMS de la oferta comercial de la app final construida sobre el framework. Define planes de servicio con precios, límites y funcionalidades incluidas. Los planes alimentan el Feature Gating (§2.4.5) y el ciclo de vida de suscripciones (§2.4). El catálogo inicial se genera durante la inicialización desde `initial_plans` del `bootstrap.json` y luego se administra desde UI.

#### Schema de Base de Datos

**Tabla `plans`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `code` | `varchar(50)` | NOT NULL, UNIQUE | Código del plan (`free`, `trial`, `pro`, `enterprise`) |
| `name` | `varchar(100)` | NOT NULL | Nombre display del plan |
| `description` | `text` | | Descripción del plan |
| `is_active` | `boolean` | DEFAULT `true` | Si el plan está disponible para asignación |
| `is_freemium` | `boolean` | DEFAULT `false` | Si es plan gratuito (freemium). Afecta lógica de trial vencido (§2.4.6) |
| `sort_order` | `integer` | | Orden de presentación en UI |
| `price_monthly` | `decimal(10,2)` | | Precio mensual |
| `price_yearly` | `decimal(10,2)` | | Precio anual |
| `currency` | `varchar(3)` | DEFAULT `'USD'` | Moneda ISO 4217 |
| `trial_days` | `integer` | DEFAULT `0` | Días de prueba. 0 = sin trial |
| `features` | `JSONB` | DEFAULT `{}` | Objeto de funcionalidades y límites del plan |

**Schema formal de `plans.features` (JSONB):**

| Key | Tipo | Default (Free) | Default (Pro) | Scope | Descripción |
|:----|:-----|:----------------|:--------------|:------|:------------|
| `max_users` | `integer` | `1` | `-1` (∞) | Framework | Límite de usuarios por Tenant. `-1` = ilimitado |
| `storage_gb` | `integer` | `1` | `10` | Framework | Almacenamiento máximo en GB por Tenant |
| `ai_enabled` | `boolean` | `false` | `true` | Framework | Habilita acceso al Core AI |
| `modules_allowed` | `string[]` | `["*"]` | `["*"]` | Framework | Array de `module.code` accesibles. `["*"]` = todos |
| `max_api_keys` | `integer` | `0` | `10` | Framework | Límite de API Keys por Tenant |
| `max_rules` | `integer` | `5` | `-1` (∞) | Framework | Límite de reglas automáticas |
| `max_custom_fields` | `integer` | `5` | `-1` (∞) | Framework | Límite de campos personalizados |
| `webhook_enabled` | `boolean` | `false` | `true` | Framework | Habilita módulo Webhooks |
| `import_export_enabled` | `boolean` | `false` | `true` | Framework | Habilita import/export masivo |
| *`custom_key`* | `any` | - | - | App | Keys extendidas definidas por la aplicación derivada |

> Las keys **Framework** son evaluadas automáticamente por `checkPlanFeature()`. Las keys **App** son libres y se evalúan desde Server Actions propios.

**RLS:** Tabla global (sin `tenant_id`). Solo Super Admin gestiona el catálogo.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getPlans()` | Lista todos los planes |
| `getPlanById(id)` | Obtiene plan con detalle de features |
| `createPlan(data)` | Crea nuevo plan |
| `updatePlan(id, data)` | Actualiza plan existente |
| `deletePlan(id)` | Soft-delete del plan (solo si no tiene suscripciones activas) |

#### Estructura de UI

**Formulario:** 3 tabs:

| Tab | Campos |
|:----|:-------|
| **1. General** | `code`, `name`, `description`, `is_active`, `is_freemium`, `sort_order` |
| **2. Precios** | `price_monthly`, `price_yearly`, `currency`, `trial_days` |
| **3. Features** | Editor visual del JSONB `features` con keys Framework y App. Botón "Agregar feature personalizada" para crear keys custom con tipo (`boolean`, `integer`, `string`, `string[]`) |

**Grid:** Columnas: `name`, `code`, `price_monthly`, `is_active`, `is_freemium`, `sort_order`, `active_subscriptions_count` (calculado, read-only).

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **Suscripciones (`subscription`)** | Un plan se vincula a una suscripción |
| **Feature Gating (§2.4.5)** | `checkPlanFeature(tenantId, featureKey)` evalúa contra `plans.features` |
| **Proceso de Inicialización** | Catálogo inicial desde `initial_plans` del `bootstrap.json` |
| **Trial Reminder (§2.4.3)** | Planes con `trial_days > 0` activan el sistema de recordatorios |

#### Parámetros Configurables (bootstrap.json / settings)

| Parámetro | Default | Relación |
|:----------|:--------|:---------|
| `subscription.default_plan_code` | `"trial"` | Código del plan asignado a nuevos Tenants |
| `initial_plans` (bootstrap.json) | Array de planes | Catálogo inicial generado en inicialización |

#### Notas de Implementación

- Orden de construcción: paso 3 (§1.7.1). Prerequisito para crear Tenants con suscripción.
- Si existe un plan con `code = "free"` o `is_freemium = true`, la lógica de trial vencido siempre degrada a ese plan (§2.4.6), ignorando `subscription.expiry_action`.
- El campo `active_subscriptions_count` es calculado (COUNT de suscripciones activas vinculadas al plan) y se muestra read-only en el Grid.

---

### A4. `ai-model` - Modelos AI

> **PRD:** §3.A, §4.2 | **Tabla:** `ai_models` | **Ruta:** `/ai-model` | **i18n:** `ai_model`
> **Clasificación:** Módulo CRUD estándar.

#### Descripción Técnica

Configura el catálogo multi-proveedor de modelos de LLM disponibles para el Core de Integración IA (§4.2). Cada registro define un modelo específico con sus parámetros de inferencia, endpoint y costos para tracking. El Core IA consulta esta tabla para resolver qué modelo usar y con qué configuración, sin imponer un proveedor final a las aplicaciones derivadas.

#### Schema de Base de Datos

**Tabla `ai_models`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `name` | `varchar(100)` | NOT NULL | Nombre display del modelo (ej. "GPT-4o") |
| `provider` | `varchar(50)` | NOT NULL | Proveedor configurable: `openai`, `anthropic`, `google`, `azure`, `ollama` u otro adapter registrado |
| `model_id` | `varchar(100)` | NOT NULL | Identificador técnico del modelo en el proveedor (ej. `gpt-4o`) |
| `endpoint_url` | `text` | | URL base del endpoint. NULL para proveedores con SDK estándar |
| `temperature` | `decimal(3,2)` | DEFAULT `0.7` | Parámetro de inferencia: creatividad (0.0–2.0) |
| `max_tokens` | `integer` | DEFAULT `4096` | Máximo de tokens de salida |
| `context_window` | `integer` | | Contexto total admitido por el modelo (input + output) |
| `max_input_tokens` | `integer` | nullable | Tope de tokens de entrada por petición |
| `cost_per_1k_tokens_input` | `decimal(10,6)` | | Costo por 1K tokens de entrada (USD) para tracking |
| `cost_per_1k_tokens_output` | `decimal(10,6)` | | Costo por 1K tokens de salida (USD) para tracking |
| `pricing_unit` | `enum` | DEFAULT `per_1k`; valores: `per_1k`, `per_1m` | Unidad de los costos del proveedor |
| `currency` | `varchar(3)` | DEFAULT `USD` | Moneda de los costos |
| `max_cost_per_request` | `decimal(10,6)` | nullable | Tope de costo estimado por invocación; si se excede, el motor rechaza la petición |
| `request_timeout_seconds` | `integer` | nullable | Timeout por petición para ese modelo/proveedor |
| `supports_streaming` | `boolean` | DEFAULT `false` | Si el modelo soporta respuestas por streaming |
| `input_modalities` | `JSONB` | DEFAULT `["text"]` | Modalidades aceptadas (`text`, `image`, `audio`, `video`) para validar el input |
| `deprecated_at` | `timestamptz` | nullable | Marca de deprecación sin reemplazar `is_active` |
| `fallback_model_id` | `UUID FK ai_models` | nullable | Modelo de respaldo si el principal falla o no está disponible |
| `is_active` | `boolean` | DEFAULT `true` | Si el modelo está disponible para uso |

**RLS:** Tabla global (sin `tenant_id`). Solo Super Admin gestiona modelos.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getModels()` | Lista todos los modelos registrados |
| `createModel(data)` | Registra un nuevo modelo |
| `updateModel(id, data)` | Actualiza configuración del modelo |
| `toggleModel(id)` | Activa/desactiva un modelo |

#### Estructura de UI

**Formulario:** Formulario simple (sin tabs). Campos: `name`, `provider` (select), `model_id`, `endpoint_url`, `temperature` (slider), `max_tokens`, `context_window`, `max_input_tokens`, `cost_per_1k_tokens_input`, `cost_per_1k_tokens_output`, `pricing_unit`, `currency`, `max_cost_per_request`, `request_timeout_seconds`, `supports_streaming`, `input_modalities`, `deprecated_at`, `fallback_model_id`, `is_active` (toggle).

**Grid:** Columnas: `name`, `provider`, `model_id`, `is_active`, `pricing_unit`, `currency`, `context_window`, `supports_streaming`, `deprecated_at`, `cost_per_1k_tokens_input`.

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **Core IA (§4.2)** | Los modelos configurados aquí alimentan al Core IA para resolver proveedor y parámetros |
| **Parámetros (`settings`)** | `ai_default_model_id` referencia un `id` de esta tabla |
| **Integraciones (`integration`)** | Las credenciales del proveedor se resuelven desde la tabla `integrations` por Tenant |
| **Log (`log`)** | Cada invocación IA registra `model_id`, tokens, `pricing_unit`, `currency` y costo estimado en metadata |

#### Notas de Implementación

- Los modelos se registran a nivel global (no por Tenant). Las credenciales sí son por Tenant (tabla `integrations`).
- **Multi-proveedor y multi-instancia:** se registran múltiples filas para distintos proveedores y también **varias filas del mismo proveedor con `model_id` distintos** (p. ej. varios modelos vía un mismo adapter tipo OpenRouter, además de un proveedor directo). Cada fila es una instancia independiente con sus parámetros, pricing y guardrails; el motor solo ejecuta, el comportamiento depende del proveedor/modelo de cada fila.
- El costo estimado por invocación respeta `pricing_unit`: para `per_1k`, `(tokens_input / 1000 * cost_per_1k_tokens_input) + (tokens_output / 1000 * cost_per_1k_tokens_output)`; para `per_1m`, usa el mismo cálculo dividiendo entre 1,000,000. `currency` identifica la moneda usada para registrar el costo.
- Guardrails por petición: el motor valida `context_window`, `max_input_tokens`, `max_tokens` como máximo de salida, `max_cost_per_request`, `request_timeout_seconds` e `input_modalities` antes de invocar al proveedor. Si el input, la salida solicitada, la modalidad o el costo estimado exceden los límites, retorna error controlado y no ejecuta la llamada externa.
- `fallback_model_id` se usa cuando el modelo principal falla, no está disponible o tiene `deprecated_at` informado; el fallback debe pasar los mismos guardrails antes de ejecutarse.
- Separación de responsabilidades: el motor provee catálogo con pricing, medición de consumo por petición, guardrails técnicos por modelo/proveedor **y topes de presupuesto acumulado** (tabla `ai_budgets`, ver abajo). El motor **bloquea** la invocación si excedería un tope activo. La aplicación derivada puede añadir cuotas de negocio adicionales por usuario o feature sobre esta base.
- Si `ai_enabled = false` en Parámetros, el módulo sigue visible para configuración pero las invocaciones IA retornan error controlado.

#### Presupuestos y topes de gasto (`ai_budgets`)

El motor del framework aplica **topes de presupuesto acumulado** además de los guardrails por petición. Antes de cada invocación calcula el costo estimado y lo suma al gasto del periodo; si excediera un tope activo, **bloquea** la llamada (o avisa, según `on_exceed`). Esto evita que una aplicación supere su presupuesto por abuso o por error de programación.

**Tabla `ai_budgets`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | nullable | `NULL` = tope global del framework; con valor = tope por Tenant |
| `scope` | `enum` | `global`, `tenant`, `provider`, `model` | Alcance del tope |
| `provider` | `varchar(50)` | nullable | Proveedor al que aplica (scope `provider`/`model`) |
| `ai_model_id` | `UUID FK ai_models` | nullable | Modelo/instancia al que aplica (scope `model`) |
| `period` | `enum` | `day`, `month`, `total` | Ventana de acumulación |
| `max_spend` | `decimal(12,6)` | NOT NULL | Tope de gasto en `currency` |
| `currency` | `varchar(3)` | DEFAULT `USD` | Moneda del tope |
| `spend_to_date` | `decimal(12,6)` | DEFAULT `0` | Gasto acumulado del periodo vigente |
| `on_exceed` | `enum` | DEFAULT `block`; `block`, `warn` | Acción al exceder |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |

**RLS:** topes globales (`tenant_id IS NULL`) gestionados por Super Admin; topes por Tenant aislados por `tenant_id`.

- El tope puede aplicarse a una **instancia/modelo** específico, a un **proveedor** completo, a un **Tenant** o **global**, y son combinables (gana el más restrictivo).
- Cada invocación registra el costo en `logs` y actualiza `spend_to_date` de los topes aplicables de forma transaccional.

---

### A5. `log` - Log

> **PRD:** §3.A, §4.11 | **Tabla:** `logs` | **Ruta:** `/log` | **i18n:** `log`
> **Clasificación:** Módulo read-only - Grid con formulario de visualización (no edición). Registros generados programáticamente.

#### Descripción Técnica

Registro inmutable centralizado de toda actividad del sistema basado en las 5W (Quién, Qué, Cuándo, Dónde, Por qué). Centraliza: acciones de usuario (CRUD), eventos de sistema (jobs, cron, webhooks), envíos de email transaccional (template, destinatario, estado de entrega), invocaciones de IA (modelo, tokens, costo estimado) y cualquier operación que requiera trazabilidad. Visibilidad dual con RLS: Admin ve solo logs de su Tenant; Super Admin accede cross-tenant.

#### Schema de Base de Datos

**Tabla `logs`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | **nullable** | Tenant asociado. NULL para operaciones globales (solo visibles por Super Admin) |
| `actor_id` | `UUID FK auth.users` | nullable | Usuario que ejecutó la acción. Para API Keys queda `NULL` |
| `api_key_id` | `UUID FK api_keys` | nullable | API Key que ejecutó una acción M2M |
| `action` | `varchar(100)` | NOT NULL, INDEX | Tipo de acción: `create`, `update`, `delete`, `login`, `logout`, `ai.invocation`, `system_event`, `subscription.trial_reminder`, etc. |
| `entity_type` | `varchar(100)` | INDEX | Tipo de entidad afectada (código del módulo) |
| `entity_id` | `UUID` | | ID del registro afectado |
| `ip_address` | `inet` | | Dirección IP del actor |
| `user_agent` | `text` | | User-Agent del navegador/cliente |
| `timestamp` | `timestamptz` | NOT NULL, INDEX | Momento exacto del evento |
| `metadata` | `JSONB` | | Datos específicos del evento (no filtrable por UI principal por rendimiento) |

**Estructura de `metadata` (JSONB) por tipo de evento:**

| Tipo de evento | Keys en metadata |
|:---------------|:-----------------|
| CRUD (`create`, `update`, `delete`) | `changes` (diff de campos), `module_code`, `record_id` |
| Login/Logout | `auth_method` (`jwt`\|`api_key`), `session_id` |
| API Key action | `auth_method: "api_key"`, `api_key_id`, `actor_id: null` |
| AI invocation (`ai.invocation`) | `model_id`, `tokens_input`, `tokens_output`, `pricing_unit`, `currency`, `estimated_cost_usd` |
| Email transaccional | `template_code`, `recipient`, `delivery_status` (`delivered`\|`bounced`\|`failed`), `provider`, `cost` |
| System event | `job_name`, `execution_status`, `records_processed`, `error` |
| Rule execution | `rule_id`, `action_type`, `attempt_number`, `error` |

#### Patrón de Captura de Auditoría

El punto único de registro es un wrapper estándar alrededor de Server Actions y API Routes. Ese wrapper arma el contexto 5W antes de la mutación, ejecuta la operación y escribe en `logs` cuando la mutación finaliza exitosamente. Un trigger de PostgreSQL actúa como respaldo de integridad para capturar escrituras directas o fallos de instrumentación, sin reemplazar el wrapper porque no siempre dispone de todo el contexto HTTP.

Se registra toda mutación exitosa (`create`, `update`, `delete`, `restore`), todo intento fallido de autenticación o autorización, y toda ejecución interna relevante (jobs, webhooks, reglas e invocaciones IA). La metadata 5W se arma con `actor_id` o `api_key_id` (quién), `action`, `entity_type` y `entity_id` (qué), `timestamp` (cuándo), `ip_address`, `user_agent` y `request_id` (dónde), y `metadata.reason`, `metadata.changes`, `metadata.auth_method` o datos específicos del evento (por qué).

**RLS:** Aplica RLS. El campo `tenant_id` aísla logs por Tenant. Admin solo ve `WHERE tenant_id = current_tenant`. Super Admin ve todos. Registros con `tenant_id = NULL` solo visibles por Super Admin.

**Nota:** Esta tabla NO usa soft-delete. Los registros de log son inmutables y no se eliminan por operaciones normales.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getLogs(filters)` | Lista logs con filtros: `action`, `actor_id`, `api_key_id`, `entity_type`, `date_range`, `tenant_id` |
| `getLogDetail(id)` | Obtiene detalle completo de un registro de log |

> No existen funciones de creación, actualización o eliminación expuestas. Los logs se generan exclusivamente por el Interceptor de Auditoría (§4.11) y funciones internas del sistema.

#### Estructura de UI

**Grid:** Read-only con filtros por tipo de evento (`action`), actor, módulo (`entity_type`) y rango de fechas.

**Formulario de detalle:** Visualización read-only (no edición). Muestra:
- `timestamp`, `action`, `entity_type` (módulo), `entity_id` (registro)
- `actor_id` (nombre del usuario resuelto) o `api_key_id` (nombre de la API Key resuelto)
- `ip_address`, `user_agent`
- `auth_method` (`jwt` o `api_key`)
- `metadata` renderizado como tabla key-value expandible

No permite edición ni eliminación.

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **Interceptor de Auditoría (§4.11)** | Fuente automática de registros para operaciones CRUD |
| **Core IA (§4.2)** | Registra invocaciones con tracking de costos (§6.2.2) |
| **Email Transaccional (§4.25)** | Registra cada intento de envío con estado de entrega |
| **Event Bus (§4.13)** | Registra ejecución de reglas con resultado |
| **Jobs (§6.4)** | Cada ejecución de cron/job genera registro con metadata |
| **Todos los módulos** | Toda operación auditada fluye hacia esta tabla |

#### Notas de Implementación

- Orden de construcción: debe crearse junto con Parámetros (paso 1, §1.7.1) como infraestructura base de BD.
- Los campos `action`, `entity_type` y `timestamp` deben estar indexados para rendimiento en consultas filtradas.
- El campo `metadata` (JSONB) **no es filtrable dinámicamente vía UI principal** por motivos de rendimiento; la UI se basa en los campos indexables estándar.
- Registros inmutables: una vez creados, no pueden ser modificados ni eliminados.

---

### A6. `profile` - Profiles

> **PRD:** §3.A, §2.2 | **Tablas:** `profiles`, `profile_permissions` | **Ruta:** `/profile` | **i18n:** `profile`
> **Clasificación:** Módulo CRUD con Grid interactivo de matriz de permisos.

#### Descripción Técnica

Define perfiles de acceso y la matriz de permisos a nivel aplicación. Los perfiles determinan qué operaciones puede ejecutar un usuario dentro de un Tenant. Los perfiles base (`Super Admin`, `Admin`, `Member`, `Guest`) se generan durante la inicialización desde `initial_profiles` del `bootstrap.json`. Solo el **Super Admin** puede crear, modificar o eliminar definiciones de Profile. Los Admins de Tenant **no crean ni modifican** perfiles; solo **asignan** perfiles existentes a usuarios de su Tenant.

#### Schema de Base de Datos

**Tabla `profiles` (módulo principal):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `name` | `varchar(100)` | NOT NULL | Nombre del perfil (ej. "Admin", "Member") |
| `tenant_id` | `UUID FK tenants` | **nullable** | NULL para perfiles globales del framework. Required para perfiles con scope limitado a un Tenant |
| `home_url` | `varchar(200)` | | Página de inicio del perfil (ej. `/dashboard`, `/task`). Participa en la cascada de Home (§4.4) |
| `description` | `text` | | Descripción del perfil |
| `is_system` | `boolean` | DEFAULT `false` | Indica si es un perfil del sistema (no eliminable) |

**Tabla `profile_permissions` (soporte - matriz de permisos):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `profile_id` | `UUID FK profiles` | NOT NULL | Perfil al que pertenece este permiso |
| `module_id` | `UUID FK modules` | NOT NULL | Módulo al que aplica el permiso |
| `view` | `boolean` | DEFAULT `false` | Permiso de lectura |
| `create` | `boolean` | DEFAULT `false` | Permiso de creación |
| `update` | `boolean` | DEFAULT `false` | Permiso de edición |
| `delete` | `boolean` | DEFAULT `false` | Permiso de eliminación |
| `import` | `boolean` | DEFAULT `false` | Permiso de importación |
| `export` | `boolean` | DEFAULT `false` | Permiso de exportación |
| `notify` | `boolean` | DEFAULT `false` | Permiso de notificación |

**Constraint unique:** `(profile_id, module_id)` - un registro por combinación perfil × módulo.

**7 acciones estándar:** `view`, `create`, `update`, `delete`, `import`, `export`, `notify`.

**RLS:** `profiles` con `tenant_id = NULL` son globales (visibles por todos). Con `tenant_id` específico, solo visibles dentro de ese Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getProfiles()` | Lista todos los perfiles |
| `getProfileById(id)` | Obtiene perfil con su matriz de permisos |
| `createProfile(data)` | Crea nuevo perfil |
| `updateProfile(id, data)` | Actualiza datos del perfil |
| `updatePermissions(profileId, permissions)` | Actualiza la matriz completa de permisos (batch update) |

#### Estructura de UI

**Grid interactivo:** Matriz cruzando módulos (filas) y 7 acciones estándar (columnas). Cada celda es un toggle booleano.

**Funcionalidades del Grid de permisos:**
- **Master Row:** Toggle que activa/desactiva todas las acciones para un módulo de un solo click.
- **Master Column:** Toggle que activa/desactiva una acción para todos los módulos de un solo click.

**Formulario:** Campos: `name`, `description`, `home_url`, `tenant_id` (select de Tenant o "Global").

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **Módulo de Módulos (`module`)** | Los módulos registrados alimentan las filas de la matriz de permisos |
| **User Memberships** | `user_memberships.profile_id` vincula un perfil a un usuario dentro de un Tenant |
| **Motor de Renderizado de Menú (§4.9)** | Evalúa permisos del perfil para renderizar sidebar |
| **Grid Universal (§4.7)** | Evalúa permisos para renderizar Action Bar y acciones por fila |
| **Cascada de Home (§4.4)** | `home_url` es el primer nivel de la cascada Profile → Tenant → Default |

#### Perfiles Base del Framework

| Perfil | `is_system` | Permisos | Restricciones |
|:-------|:------------|:---------|:-------------|
| **Super Admin** | `true` | Acceso total a la plataforma completa | Solo un Super Admin puede crear otro Super Admin |
| **Admin** | `true` | Todos los permisos (`true`) en todos los módulos de su Tenant | No bypasea RBAC; la matriz se genera con todo en `true` |
| **Member** | `true` | Acceso limitado por permisos de su Profile | Perfil plantilla, desactivable |
| **Guest** | `true` | Solo lectura (`view = true`, resto `false`) | Perfil plantilla, desactivable |

#### Notas de Implementación

- Orden de construcción: paso 5 (§1.7.1). DEBEN crearse antes que Users porque `user_memberships` requiere `profile_id` válido.
- Perfiles base generados desde `initial_profiles` del `bootstrap.json`.
- La matriz de permisos para Admin se genera con todas las acciones en `true` durante la inicialización.
- Los perfiles `Member` y `Guest` pueden ser desactivados o eliminados según las necesidades de la aplicación derivada.

---

## B. Módulos de Configuración de Cuentas (Tenant Admin)

Módulos que el Admin del Tenant puede gestionar dentro de su propio Tenant. El Super Admin tiene acceso cross-tenant.

---

### B1. `tenant` - Tenants

> **PRD:** §3.B, §2.1, §2.3.13 | **Tablas:** `tenants`, `user_memberships` | **Ruta:** `/tenant` | **i18n:** `tenant`
> **Clasificación:** Vista dual - Formulario singleton (Tenant Admin) / Grid CRUD (Super Admin).

#### Descripción Técnica

Gestión central de la cuenta. El Admin ve y edita solo su propio Tenant (singleton). El Super Admin accede a un Grid con todos los Tenants del sistema. El Tenant Zero (cuenta maestra) se genera durante la inicialización desde `initial_tenant` del `bootstrap.json` (`name`, `slug`).

#### Schema de Base de Datos

**Tabla `tenants`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `name` | `varchar(200)` | NOT NULL | Nombre de la empresa/organización |
| `legal_name` | `varchar(200)` | | Razón social |
| `slug` | `varchar(100)` | NOT NULL, UNIQUE, **inmutable** | Identificador URL-safe del Tenant |
| `tax_id` | `varchar(50)` | | Identificación fiscal |
| `industry` | `varchar(100)` | | Sector/industria |
| `company_size` | `varchar(50)` | | Tamaño de empresa |
| `description` | `text` | | Descripción |
| `logo_url` | `text` | | URL del logo (upload vía Files §3.C) |
| `status` | `varchar(30)` | NOT NULL, DEFAULT `'active'` | `active`, `suspended`, `marked_for_deletion`, `purged` |
| `primary_email` | `varchar(255)` | | Email principal de contacto |
| `billing_email` | `varchar(255)` | | Email de facturación |
| `phone` | `varchar(30)` | | Teléfono principal |
| `secondary_phone` | `varchar(30)` | | Teléfono secundario |
| `website` | `text` | | URL del sitio web |
| `contact_name` | `varchar(200)` | | Nombre del contacto principal |
| `contact_email` | `varchar(255)` | | Email del contacto |
| `contact_phone` | `varchar(30)` | | Teléfono del contacto |
| `address_line_1` | `varchar(300)` | | Dirección línea 1 |
| `address_line_2` | `varchar(300)` | | Dirección línea 2 |
| `city` | `varchar(100)` | | Ciudad |
| `state` | `varchar(100)` | | Estado/provincia |
| `postal_code` | `varchar(20)` | | Código postal |
| `country` | `char(2)` | | ISO 3166-1 alpha-2 |
| `latitude` | `decimal(10,7)` | | Coordenada geográfica |
| `longitude` | `decimal(10,7)` | | Coordenada geográfica |
| `social_links` | `JSONB` | DEFAULT `{}` | Keys: `linkedin`, `facebook`, `instagram`, `twitter_x`, `youtube`, `tiktok` (extensibles) |
| `settings` | `JSONB` | DEFAULT `{}` | Configuración por Tenant (ver schema §4.15 del PRD) |
| `home_url` | `varchar(200)` | | Página de inicio del Tenant (cascada Home §4.4) |
| `purge_log` | `JSONB` | | Evidencia de purga: tablas, conteos, timestamps (solo status `purged`) |

**Schema de `tenants.settings` (JSONB) - keys reconocidas por el framework:**

| Key | Tipo | Default | Descripción |
|:----|:-----|:--------|:------------|
| `mfa_policy` | `string` | Hereda Settings | Override MFA: `optional`, `required` (solo escalación) |
| `allowed_ips` | `string[]` | `[]` | Lista blanca de IPs/CIDR |
| `session_timeout_override` | `integer` | Hereda Settings | Override timeout de sesión (minutos) |
| `locale` | `string` | Hereda Settings | Locale del Tenant (ISO 639-1) |
| `timezone` | `string` | Hereda Settings | Timezone (ej: `America/Mexico_City`) |
| `currency` | `string` | Hereda Settings | Moneda (ISO 4217) |
| `date_format` | `string` | Hereda Settings | Formato de fecha |
| `time_format` | `string` | `"24h"` | Formato de hora: `12h` o `24h` |
| `tenant_branding` | `object` | `{}` | `logo_url` + `primary_color` para documentos/PDF (NO afecta UI de la aplicación) |
| `soft_delete.auto_purge_days` | `integer` | Hereda Settings | Días antes de purga automática |

**Tabla `user_memberships` (soporte - relación N:N Users × Tenants):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `user_id` | `UUID FK auth.users` | NOT NULL | Usuario |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `profile_id` | `UUID FK profiles` | NOT NULL | Profile asignado al usuario en este Tenant |
| `status` | `varchar(20)` | NOT NULL, DEFAULT `'active'` | `active`, `suspended`, `pending` |
| `invited_by` | `UUID FK auth.users` | nullable | Quién emitió la invitación |
| `joined_at` | `timestamptz` | | Fecha de incorporación |

**RLS:** Aplica. Admin solo ve/edita su Tenant. Super Admin ve todos.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getTenants()` | Lista tenants (Super Admin: todos; Admin: solo el suyo) |
| `getTenantById(id)` | Detalle del Tenant |
| `updateTenant(id, data)` | Actualiza datos del Tenant |
| `updateTenantStatus(id, status)` | Cambia estado del Tenant |
| `updateTenantSettings(id, settings)` | Actualiza JSONB `settings` del Tenant |

#### Estructura de UI

**Formulario Singleton (Tenant Admin) - 7 tabs:**

| Tab | Campos |
|:----|:-------|
| **1. General** | `name`, `legal_name`, `slug` (read-only), `tax_id`, `industry`, `company_size`, `description`, `logo_url`, `status` (read-only) |
| **2. Contacto** | `primary_email`, `billing_email`, `phone`, `secondary_phone`, `website`, `contact_name`, `contact_email`, `contact_phone` |
| **3. Dirección** | `address_line_1`, `address_line_2`, `city`, `state`, `postal_code`, `country`, `latitude`, `longitude` |
| **4. Redes Sociales** | Editor de `social_links` JSONB |
| **5. Seguridad** | `mfa_policy`, `allowed_ips`, `session_timeout_override` |
| **6. Branding** | `tenant_branding.logo_url`, `tenant_branding.primary_color` (identidad corporativa para documentos/PDF) |
| **7. Preferencias Regionales** | `locale`, `timezone`, `currency`, `date_format`, `time_format` |

**Grid (Super Admin):** Columnas: `name`, `slug`, `primary_email`, `status`, `plan` (derivado), `users_count` (calculado), `created_at`, `country`.

#### Estados del Tenant (§2.3.13)

```
active → suspended → active (reactivación)
active → marked_for_deletion → active (cancelar) | purged (terminal)
suspended → marked_for_deletion → purged
```

#### Notas de Implementación

- Orden de construcción: paso 4 (§1.7.1). Requiere Plans para vincular suscripción.
- `slug` es inmutable post-creación.
- Al crear un Tenant, se genera automáticamente un registro en `subscriptions` (§2.4.1).
- Eliminación de Tenant: período de retención `tenant_deletion.retention_days` (default 60 días).

---

### B2. `user` - Usuarios

> **PRD:** §3.B, §2.3.11-§2.3.12 | **Tablas:** `users`, `user_preferences`, `user_memberships` | **Ruta:** `/user` | **i18n:** `user`
> **Clasificación:** Módulo CRUD estándar.

#### Descripción Técnica

Gestión de miembros del equipo dentro del Tenant. Permite invitar usuarios (vía URL de Invitación), reasignar perfiles, desactivar y marcar para eliminación. Visualiza estados de usuario con indicadores visuales diferenciados.

#### Schema de Base de Datos

**Tabla `users` (campos de identidad, complementa `auth.users`):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `auth_id` | `UUID FK auth.users` | UNIQUE, NOT NULL | Referencia a la tabla de autenticación de Supabase |
| `first_name` | `varchar(100)` | NOT NULL | Nombre |
| `last_name` | `varchar(100)` | NOT NULL | Apellido |
| `avatar_url` | `text` | | URL del avatar (bucket `public_assets`) |
| `status` | `varchar(30)` | NOT NULL, DEFAULT `'pending_verification'` | `active`, `inactive`, `pending_verification`, `marked_for_deletion` |
| `locale` | `varchar(10)` | | Override de idioma (ISO 639-1). Nivel User de cascada §4.15 |
| `timezone` | `varchar(50)` | | Override de timezone (IANA). Nivel User de cascada §4.15 |
| `time_format` | `varchar(3)` | | `12h` o `24h` |
| `mfa_secret` | `text` | | Secret de 2FA (cifrado con encryption at rest) |
| `mfa_method` | `varchar(10)` | | `totp`, `email`, `sms`, `null` |
| `last_login_at` | `timestamptz` | | Último login exitoso |
| `marked_for_deletion_at` | `timestamptz` | | Timestamp de marca para eliminación |

**Tabla `user_preferences` (soporte - preferencias de UI por Tenant):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `user_id` | `UUID FK auth.users` | NOT NULL | Usuario |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant (preferencias independientes por Tenant) |
| `key` | `varchar(100)` | NOT NULL | Clave: `grid_{module_code}`, `dashboard_layout`, `theme`, `sidebar_collapsed`, `notification_settings` |
| `value` | `JSONB` | | Valor de la preferencia |

**Constraint unique:** `(user_id, tenant_id, key)`.

**RLS:** Aplica. Admin ve usuarios de su Tenant. Super Admin ve cross-tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getUsers(filters)` | Lista usuarios del Tenant con filtros por status |
| `getUserById(id)` | Detalle del usuario |
| `updateUser(id, data)` | Actualiza datos del usuario |
| `updateUserStatus(id, status)` | Cambia estado (active, inactive, marked_for_deletion) |
| `reassignProfile(userId, profileId)` | Reasigna el Profile del usuario en el Tenant |

#### Estructura de UI

**Grid CRUD:** Columnas: `first_name`, `last_name`, `email` (de auth.users), `status` (badge con indicador visual), `profile` (del membership), `last_login_at`. Usuarios `marked_for_deletion` con badge/color diferenciado.

**Formulario:** Campos: `first_name`, `last_name`, `avatar_url` (FileUploader single), `status` (select), `profile_id` (select de perfiles disponibles), `locale`, `timezone`.

**Protección:** El sistema prohíbe desactivar/eliminar/cambiar perfil del último Admin de un Tenant (validación server-side).

#### Estados del User (§2.3.11)

| Estado | Login | Descripción |
|:-------|:------|:------------|
| `active` |  | Operativo |
| `inactive` |  | Desactivado por Admin |
| `pending_verification` |  | Email no verificado |
| `marked_for_deletion` |  | En período de retención pre-purga |

#### Notas de Implementación

- Orden de construcción: paso 6 (§1.7.1). Requiere Profiles para asignar membership.
- Primer Super Admin generado desde `initial_super_admin` del `bootstrap.json` (`email`, `first_name`, `last_name`).
- La eliminación de usuario (§2.3.12) usa `user_deletion.retention_days` (default 30 días).
- `user_preferences` persiste por Tenant: un usuario tiene preferencias independientes por cada cuenta.

---

### B3. `invitation` - Invitaciones

> **PRD:** §3.B, §2.3.2 | **Tabla:** `invitations` | **Ruta:** `/invitation` | **i18n:** `invitation`
> **Clasificación:** Módulo CRUD estándar.

#### Descripción Técnica

Gestión del ciclo de vida de invitaciones a usuarios del Tenant. El Admin crea invitaciones (por link o código), visualiza su estado y consulta métricas de conversión (invitaciones emitidas vs registros efectivos).

#### Schema de Base de Datos

**Tabla `invitations`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant emisor |
| `email` | `varchar(255)` | NOT NULL | Email del invitado |
| `profile_id` | `UUID FK profiles` | NOT NULL | Profile asignado al aceptar |
| `invited_by` | `UUID FK auth.users` | NOT NULL | Usuario emisor |
| `token` | `text` | NOT NULL, UNIQUE | Hash único de la invitación |
| `invitation_type` | `varchar(10)` | NOT NULL | `link` o `code` |
| `status` | `varchar(20)` | NOT NULL, DEFAULT `'pending'` | `pending`, `accepted`, `expired`, `revoked` |
| `expires_at` | `timestamptz` | NOT NULL | TTL: `security.invitation_ttl_days` (default 7 días) |
| `accepted_at` | `timestamptz` | | Fecha/hora de aceptación |
| `accepted_by_user_id` | `UUID FK auth.users` | | Usuario que aceptó |

**RLS:** Aplica. Admin solo ve invitaciones de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getInvitations(filters)` | Lista invitaciones con filtros por status |
| `createInvitation(data)` | Crea invitación (email, profile, tipo) |
| `revokeInvitation(id)` | Revoca una invitación pendiente |
| `resendInvitation(id)` | Reenvía invitación (genera nuevo token/TTL) |

#### Estructura de UI

**Grid:** Filtros por status. Columnas: `email`, `profile` (nombre), `invitation_type`, `status` (badge), `invited_by`, `created_at`, `expires_at`, `accepted_at`.

**Formulario de creación:** `email` (destino), `profile_id` (select), `invitation_type` (link/código).

#### Notas de Implementación

- Si `allow_multi_tenant_users = false` y el email ya tiene membership en otro Tenant, la aceptación se rechaza con `CONFLICT`.
- Al aceptar: `status → accepted`, se registran `accepted_at` y `accepted_by_user_id`.
- TTL configurable: `security.invitation_ttl_days` (default 7 días) en bootstrap.json / settings.

---

### B4. `notification` - Notificaciones

> **PRD:** §3.B, §4.17 | **Tabla:** `notifications` | **Ruta:** `/notification` | **i18n:** `notification`
> **Clasificación:** Módulo read-only para usuarios finales. Configuración de preferencias por Admin.

#### Descripción Técnica

Grid de notificaciones con formulario de visualización read-only. Los usuarios no crean notificaciones directamente; se generan por: (1) acciones administrativas, (2) eventos del sistema, (3) Event Bus (§4.13). Incluye componentes de UI en header (campana + badge + dropdown).

#### Schema de Base de Datos

**Tabla `notifications`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `user_id` | `UUID FK auth.users` | NOT NULL | Destinatario |
| `title` | `varchar(200)` | NOT NULL | Título (requerido para in_app y email subject) |
| `body` | `text` | NOT NULL | Cuerpo del mensaje |
| `type` | `varchar(20)` | NOT NULL | `system`, `tenant`, `automation` |
| `level` | `varchar(20)` | DEFAULT `'info'` | `info`, `success`, `warning`, `critical` |
| `channels` | `varchar(20)[]` | NOT NULL | `in_app` (siempre), `email`, `sms`, `whatsapp`. `push` requiere app móvil nativa posterior |
| `delivery_status` | `JSONB` | | Estado por canal: `{ "in_app": "delivered", "email": "sent" }` |
| `entity_type` | `varchar(100)` | | Módulo origen |
| `entity_id` | `UUID` | | Registro origen |
| `read_at` | `timestamptz` | | Fecha de lectura |
| `archived_at` | `timestamptz` | | Fecha de archivo |

**Presentación UI por nivel:**
- `critical`: Modal confirmable (bloquea hasta "OK")
- `info`/`success`/`warning`: Toast auto-cierre (configurable, default 5s)

**Requerimientos de contenido por canal:**
- `in_app`: `title` + `body`
- `email`: `title` (subject) + `body` (HTML vía Plantilla Email)
- `sms`: `body` (max 160 chars, sin HTML)
- `whatsapp`: `body` (template aprobado por proveedor)

**RLS:** Aplica. Cada usuario solo ve sus propias notificaciones.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getNotifications(filters)` | Lista notificaciones del usuario con filtros por estado/tipo |
| `markAsRead(id)` | Marca como leída |
| `markAllAsRead()` | Marca todas como leídas |
| `archiveNotification(id)` | Archiva notificación |
| `createNotification(data)` | **Función interna** - invocada por Event Bus, jobs y Server Actions (no expuesta a UI) |

#### Estructura de UI

**Grid:** Filtros por estado (`unread`/`read`/`archived`), tipo y fecha. Formulario de visualización read-only.

**Componentes en Header:**
- Icono campana con badge numérico de `unread`
- Panel dropdown con últimas N notificaciones
- Alerta audible opcional (configurable por usuario)

**Preferencias del usuario:** Matriz módulo × canal almacenada en `user_preferences` con key `notification_settings`.

#### Configuración por tipo (Admin)

| Campo | Descripción |
|:------|:------------|
| `notification_type` | Tipo de notificación |
| `level` | `info`, `success`, `warning`, `critical` |
| `channels` | Canales activos (`in_app` siempre incluido) |
| `auto_dismiss_seconds` | Tiempo de auto-cierre (default 5s) |
| `requires_confirmation` | Si requiere confirmación explícita |
| `sound_enabled` | Alerta audible |

#### Notas de Implementación

- `createNotification()` valida que los campos requeridos estén presentes para cada canal solicitado.
- El canal `in_app` no es desactivable por el usuario.
- Canal `push` requiere app móvil nativa posterior.

---

### B5. `rule` - Reglas

> **PRD:** §3.B, §4.13 | **Tabla:** `rules`, `rule_runs` | **Ruta:** `/rule` | **i18n:** `rule`
> **Clasificación:** Módulo CRUD con builder visual de condiciones.

#### Descripción Técnica

Motor de automatizaciones del Tenant. Permite crear reglas basadas en eventos del Event Bus (§4.13): "Cuando sucede X, si se cumple Y, ejecutar Z". Las reglas procesan eventos emitidos por el Interceptor de Auditoría y generan acciones automáticas (notificaciones, cambios de estado, webhooks).

#### Schema de Base de Datos

**Tabla `rules`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `name` | `varchar(200)` | NOT NULL | Nombre descriptivo de la regla |
| `description` | `text` | | Descripción |
| `is_active` | `boolean` | DEFAULT `true` | Toggle activo/inactivo |
| `trigger_event` | `varchar(100)` | NOT NULL | Evento disparador: `entity.created`, `entity.updated`, `entity.deleted`, etc. |
| `trigger_module` | `varchar(50)` | NOT NULL | Código del módulo fuente (ej: `task`) |
| `conditions` | `JSONB` | | Árbol de condiciones (`AND`/`OR` con operadores) |
| `action_type` | `varchar(50)` | NOT NULL | `send_notification`, `update_field`, `call_webhook`, `send_email` |
| `action_config` | `JSONB` | NOT NULL | Configuración de la acción (template, campos, URL, etc.) |
| `max_retries` | `integer` | DEFAULT `3` | Reintentos en caso de fallo |
| `retry_delay_seconds` | `integer` | DEFAULT `60` | Delay entre reintentos |
| `execution_count` | `integer` | DEFAULT `0` | Contador de ejecuciones totales |
| `last_executed_at` | `timestamptz` | | Último timestamp de ejecución |

**Schema de `conditions` (JSONB):**

```json
{
  "operator": "AND",
  "conditions": [
    { "field": "status", "comparator": "equals", "value": "completed" },
    { "field": "priority", "comparator": "in", "value": ["high", "critical"] }
  ]
}
```

Comparadores soportados: `equals`, `not_equals`, `contains`, `not_contains`, `greater_than`, `less_than`, `in`, `not_in`, `is_null`, `is_not_null`, `changed_to`, `changed_from`.

#### Gramática Cerrada de `conditions`

La representación canónica persistida en `conditions` usa operadores cerrados: `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `in`, `not_in`, `contains`, `starts_with`, `is_null`. El builder visual puede mostrar labels más descriptivos, pero debe normalizarlos a esos valores antes de guardar.

Los grupos combinan condiciones con `AND` u `OR` y permiten anidación explícita mediante `conditions`. Cada condición referencia campos del registro origen por nombre interno (`field`) en `snake_case`; para campos personalizados se usa `custom_data.field_name`. No se permiten expresiones libres, código ejecutable ni rutas fuera del payload del evento.

Schema canónico:

```json
{
  "operator": "AND",
  "conditions": [
    { "field": "status", "operator": "eq", "value": "completed" },
    {
      "operator": "OR",
      "conditions": [
        { "field": "priority", "operator": "in", "value": ["high", "critical"] },
        { "field": "custom_data.sla_risk", "operator": "eq", "value": true }
      ]
    }
  ]
}
```

Schema de `action_config` por `action_type`:

```json
{
  "send_notification": {
    "recipient_user_id": "uuid | null",
    "recipient_profile_id": "uuid | null",
    "title": "string",
    "body": "string",
    "channels": ["in_app"]
  },
  "send_email": {
    "template_code": "string",
    "to_email": "string | null",
    "to_field": "string | null",
    "variables": {}
  },
  "update_field": {
    "field": "string",
    "value": "any"
  },
  "call_webhook": {
    "url": "https://example.com/webhook",
    "method": "POST",
    "headers": {},
    "body_template": {},
    "timeout_seconds": 10
  }
}
```

Loop guard: toda ejecución de regla propaga `origin_rule_id`, `origin_rule_run_id` y `rule_depth` en el payload interno. El motor rechaza reentradas de la misma regla sobre el mismo registro y corta cadenas que excedan el límite de profundidad configurado para el Event Bus.

**Tabla `rule_runs` (historial de ejecuciones):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `rule_id` | `UUID FK rules` | NOT NULL | Regla ejecutada |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `trigger_event` | `varchar(100)` | NOT NULL | Evento que disparó la ejecución |
| `trigger_payload` | `JSONB` | | Payload del evento que disparó la regla |
| `status` | `varchar(20)` | NOT NULL | `success`, `failed`, `retrying` |
| `attempt_number` | `integer` | DEFAULT `1` | Número de intento actual |
| `error_message` | `text` | | Mensaje de error (si falló) |
| `executed_at` | `timestamptz` | NOT NULL | Timestamp de ejecución |

**RLS:** Aplica. Admin solo ve reglas de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getRules(filters)` | Lista reglas del Tenant |
| `createRule(data)` | Crea nueva regla con builder visual |
| `updateRule(id, data)` | Actualiza regla |
| `toggleRule(id)` | Activa/desactiva regla |
| `getRuleRuns(ruleId)` | Historial de ejecuciones de una regla |

#### Estructura de UI

**Formulario:** Builder visual con 3 secciones:
1. **Trigger:** Select de módulo + evento
2. **Conditions:** Builder de condiciones con operadores AND/OR anidables
3. **Action:** Tipo de acción + configuración específica

**Grid:** Columnas: `name`, `trigger_module`, `trigger_event`, `action_type`, `is_active`, `execution_count`, `last_executed_at`.

#### Notas de Implementación

- Si `event_bus_enabled = false` en Parámetros, las reglas no se evalúan (el Event Bus está apagado).
- Feature Gating: `max_rules` en `plans.features` controla el límite de reglas por Tenant.
- Los `rule_runs` se registran también en la tabla `logs` para trazabilidad cruzada.

---

### B6. `custom-field` - Campos Personalizados

> **PRD:** §3.B, §4.14 | **Tabla:** `custom_fields` | **Ruta:** `/custom-field` | **i18n:** `custom_field`
> **Clasificación:** Módulo CRUD con impacto transversal en formularios.

#### Descripción Técnica

Módulo para crear **definiciones de campos personalizados reutilizables** que extienden el formulario de cualquier módulo CRUD. Cada definición describe un campo (nombre, tipo, labels, validación) que se renderiza dinámicamente en una sección dedicada del formulario del módulo destino; los valores se almacenan como JSONB en `custom_data`. El módulo permite crear **múltiples** definiciones. La **cantidad de definiciones** y la cantidad de campos por módulo destino son **parametrizables por aplicación y por plan** (ver Límites).

#### Schema de Base de Datos

**Tabla `custom_fields`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `entity_type` | `varchar(50)` | NOT NULL | Código del módulo destino (ej: `task`, `tenant`) |
| `field_name` | `varchar(100)` | NOT NULL | Nombre interno (snake_case) |
| `labels` | `JSONB` | NOT NULL | Labels traducibles por locale. Ej: `{ "es": "RFC", "en": "Tax ID" }` |
| `field_type` | `varchar(30)` | NOT NULL | `text`, `textarea`, `number`, `boolean`, `date`, `select`, `multi-select`, `email`, `url` |
| `options` | `JSONB` | | Opciones para `select`/`multi-select`: `[{ "value": "...", "labels": { "es": "...", "en": "..." } }]` |
| `is_required` | `boolean` | DEFAULT `false` | Si es obligatorio |
| `is_filterable` | `boolean` | DEFAULT `false` | Si aparece como filtro en el Grid |
| `default_value` | `text` | | Valor por defecto |
| `sort_order` | `integer` | | Orden de aparición en el formulario |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |

**Constraint unique:** `(tenant_id, entity_type, field_name)`.

**Almacenamiento de valores:** Los valores se almacenan en el campo `custom_data` (JSONB) de la tabla del módulo destino (ej: `tasks.custom_data`).

**RLS:** Aplica. Admin solo ve campos de su Tenant.

**Límites (parametrizables por aplicación y por plan):**
- `max_custom_fields` (en `plans.features`) define el tope **por plan** de definiciones de campo por Tenant.
- La aplicación puede fijar un override **a nivel de aplicación/Tenant** (en `settings`/`tenants.settings`) dentro del tope del plan.
- Opcionalmente se puede limitar la cantidad de campos **por módulo destino** (`entity_type`).
- Gana el límite más restrictivo entre plan, aplicación y módulo.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getCustomFields(entityType)` | Lista campos personalizados para un módulo |
| `createCustomField(data)` | Crea nuevo campo personalizado |
| `updateCustomField(id, data)` | Actualiza definición del campo |
| `deleteCustomField(id)` | Soft-delete del campo (los valores existentes no se borran) |

#### Estructura de UI

**Grid:** Columnas: `field_name`, `entity_type`, `field_type`, `is_required`, `is_filterable`, `is_active`, `sort_order`.

**Formulario:** `entity_type` (select de módulos), `field_name`, `labels`, `field_type` (select), `options` (editor dinámico visible solo para select/multi-select), `is_required`, `is_filterable`, `default_value`, `sort_order`.

**Renderizado en módulos destino:** Sección "Campos Personalizados" en el formulario del módulo, con campos renderizados dinámicamente según `field_type` y `sort_order`.

#### Notas de Implementación

- Feature Gating: `max_custom_fields` en `plans.features` controla el límite por Tenant.
- Al eliminar un campo (soft-delete), los valores previos en `custom_data` persisten pero no se muestran en UI.
- Validaciones por tipo: `textarea` (texto largo), `number` (numérico), `date` (formato ISO), `email` (RFC 5322) y `url` (URI válida).

---

### B7. `email-template` - Plantillas de Email

> **PRD:** §3.B, §4.25 | **Tabla:** `email_templates` | **Ruta:** `/email-template` | **i18n:** `email_template`
> **Clasificación:** Módulo CRUD con editor WYSIWYG.

#### Descripción Técnica

CMS de plantillas de email transaccional. Cada plantilla tiene un `code` único usado como referencia al enviar correos. Soporta variables dinámicas con sintaxis `{{variable}}`. Las plantillas base del sistema (welcome, reset-password, invitation, etc.) se pre-cargan durante la inicialización.

#### Schema de Base de Datos

**Tabla `email_templates`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | **nullable** | NULL = plantilla global (sistema). Con valor = override por Tenant |
| `code` | `varchar(100)` | NOT NULL | Código único de la plantilla (ej: `welcome`, `reset-password`, `invitation`) |
| `name` | `varchar(200)` | NOT NULL | Nombre display |
| `subject` | `varchar(300)` | NOT NULL | Asunto del email (soporta `{{variables}}`) |
| `body_html` | `text` | NOT NULL | Cuerpo HTML del email (soporta `{{variables}}`) |
| `body_text` | `text` | | Versión texto plano (fallback) |
| `variables` | `JSONB` | | Definición de variables disponibles: `[{ "name": "user_name", "type": "string", "required": true }]` |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |
| `is_system` | `boolean` | DEFAULT `false` | Plantilla del sistema (no eliminable) |
| `locale` | `varchar(10)` | DEFAULT `'en'` | Idioma de la plantilla (ISO 639-1) |

**Resolución de plantilla:** Al enviar un email con code X para Tenant Y, el sistema busca: (1) Override del Tenant (`tenant_id = Y`), (2) Plantilla global (`tenant_id = NULL`). Si no encuentra ninguna, error.

**RLS:** Templates con `tenant_id = NULL` visibles por Super Admin. Con `tenant_id` específico, visibles por el Admin del Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getEmailTemplates(filters)` | Lista plantillas (globales + overrides del Tenant) |
| `createEmailTemplate(data)` | Crea nueva plantilla |
| `updateEmailTemplate(id, data)` | Actualiza plantilla |
| `previewEmailTemplate(id, sampleData)` | Renderiza preview con datos de ejemplo |
| `sendTestEmail(id, recipientEmail)` | Envía email de prueba |

#### Estructura de UI

**Grid:** Columnas: `name`, `code`, `subject`, `locale`, `is_system`, `is_active`.

**Formulario:** `code`, `name`, `subject`, `locale` (select). Editor WYSIWYG para `body_html` con panel lateral de variables disponibles. Preview integrado con datos de ejemplo.

#### Notas de Implementación

- Plantillas base del sistema (`is_system = true`) se pre-cargan durante inicialización.
- Un Tenant puede crear un override de cualquier plantilla global usando el mismo `code` + su `tenant_id`.
- Las variables `{{variable}}` se resuelven en runtime desde el contexto del evento que genera el email.

---

### B8. `api-key` - API Keys

> **PRD:** §3.B, §2.3.9 | **Tabla:** `api_keys` | **Ruta:** `/api-key` | **i18n:** `api_key`
> **Clasificación:** Módulo CRUD estándar.

#### Descripción Técnica

Gestión de credenciales programáticas para acceso Machine-to-Machine (M2M). Cada API Key hereda los permisos del Profile asignado y opera con aislamiento RLS idéntico a un usuario humano autenticado. Las acciones ejecutadas vía API Key se registran en logs con `auth_method: "api_key"`.

#### Schema de Base de Datos

**Tabla `api_keys`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `name` | `varchar(200)` | NOT NULL | Nombre descriptivo de la key |
| `key_hash` | `text` | NOT NULL, UNIQUE | Hash SHA-256 de la key (la key en texto plano solo se muestra una vez) |
| `key_prefix` | `varchar(10)` | NOT NULL | Primeros caracteres para identificación visual (ej: `sk_live_abc`) |
| `profile_id` | `UUID FK profiles` | NOT NULL | Profile que define los permisos de esta key |
| `scopes` | `text[]` | | Scopes opcionales para restricción granular adicional |
| `expires_at` | `timestamptz` | | Fecha de expiración. NULL = no expira; soportar expiración es obligatorio, aplicarla es opcional y la UI la recomienda por defecto |
| `last_used_at` | `timestamptz` | | Último uso registrado |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |
| `created_by` | `UUID FK auth.users` | NOT NULL | Usuario que creó la key |

**RLS:** Aplica. Admin solo ve keys de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getApiKeys()` | Lista API Keys del Tenant |
| `createApiKey(data)` | Crea nueva key. **Retorna la key en texto plano una sola vez** |
| `updateApiKey(id, data)` | Actualiza nombre, profile, scopes, expires_at |
| `revokeApiKey(id)` | Desactiva la key (soft-revoke) |
| `deleteApiKey(id)` | Soft-delete de la key |

#### Estructura de UI

**Grid:** Columnas: `name`, `key_prefix`, `profile` (nombre), `is_active`, `last_used_at`, `expires_at`, `created_by`.

**Formulario de creación:** `name`, `profile_id` (select), `scopes` (multi-select), `expires_at` (date picker).

**Post-creación:** Modal con la key en texto plano + botón "Copiar". Mensaje: "Esta es la única vez que verás esta key. Cópiala ahora."

#### Notas de Implementación

- Feature Gating: `max_api_keys` en `plans.features` controla el límite por Tenant.
- La key en texto plano se genera, se muestra al usuario, y se almacena solo como `key_hash`.
- En logs, las acciones M2M registran `actor_id = NULL` y `api_key_id` con la credencial usada. La UI muestra "API Key: [nombre]".
- Autenticación: Header `Authorization: Bearer sk_live_...`.

---

### B9. `integration` - Integraciones

> **PRD:** §3.B | **Tabla:** `integrations` | **Ruta:** `/integration` | **i18n:** `integration`
> **Clasificación:** Módulo CRUD estándar.

#### Descripción Técnica

Registra conexiones con servicios externos a nivel Tenant: proveedores AI (OpenAI, Anthropic u otros adapters), almacenamiento (S3, Cloudflare R2), email (Resend, SendGrid u otros adapters), pagos, SMS/WhatsApp y cualquier servicio custom. Almacena credenciales cifradas y estado de la conexión.

#### Schema de Base de Datos

**Tabla `integrations`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `provider` | `varchar(50)` | NOT NULL | Identificador del proveedor o adapter (ej: `openai`, `resend`, `s3`, `sendgrid`, `stripe`) |
| `name` | `varchar(200)` | NOT NULL | Nombre display |
| `config` | `JSONB` | NOT NULL | Configuración del proveedor (endpoints, regiones, etc.) |
| `credentials` | `JSONB` | NOT NULL | Credenciales cifradas (api_key, secret, tokens) |
| `status` | `varchar(20)` | DEFAULT `'active'` | `active`, `inactive`, `error` |
| `last_tested_at` | `timestamptz` | | Último test de conexión |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |

**RLS:** Aplica. Admin solo ve integraciones de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getIntegrations()` | Lista integraciones del Tenant |
| `createIntegration(data)` | Crea nueva integración |
| `updateIntegration(id, data)` | Actualiza configuración/credenciales |
| `testIntegration(id)` | Ejecuta test de conexión y actualiza `last_tested_at` y `status` |
| `deleteIntegration(id)` | Soft-delete |

#### Estructura de UI

**Grid:** Columnas: `name`, `provider`, `status` (badge), `is_active`, `last_tested_at`.

**Formulario:** `provider` (select con lista de proveedores soportados), `name`, formulario dinámico de `config` y `credentials` según el provider seleccionado. Botón "Test Connection".

#### Patrón de `credentials` por Adapter

`credentials` es un JSONB cifrado por adapter. Los campos genéricos comunes son `auth_type`, `api_key`, `client_id`, `client_secret`, `access_token`, `refresh_token`, `webhook_secret`, `region`, `base_url`, `expires_at` y `scopes`; cada adapter usa solo los que correspondan. Estos valores nunca se muestran completos en UI ni se escriben en `logs`.

Adapters default documentados: `stripe`, `resend`, `openrouter`, `inngest`, `recaptcha`, `s3` y `r2`. Los campos exactos de cada proveedor se verifican contra su documentación oficial al implementar o actualizar el adapter; este documento define el patrón, no contratos específicos de terceros.

El cifrado at rest debe usar AES-256 o un mecanismo equivalente provisto por Supabase Vault/KMS, con la clave fuera del repositorio. La validación de conexión es opcional por adapter; cuando existe, actualiza `last_tested_at` y `status` sin persistir respuestas sensibles del proveedor.

#### Notas de Implementación

- Las credenciales deben cifrarse con encryption at rest (Supabase Vault o equivalente).
- El Core IA (§4.2) resuelve credenciales desde esta tabla al invocar un modelo: busca `integrations WHERE provider = ai_model.provider AND tenant_id = current_tenant`.
- Proveedores pre-configurables: `openai`, `anthropic`, `google`, `azure`, `resend`, `sendgrid`, `twilio`, `s3`, `r2`, `stripe`. Esta lista es extensible por adapters registrados.

---

### B10. `webhook` - Webhooks

> **PRD:** §3.B | **Tabla:** `webhooks`, `webhook_deliveries` | **Ruta:** `/webhook` | **i18n:** `webhook`
> **Clasificación:** Módulo CRUD estándar.

#### Descripción Técnica

Da gestión y **visibilidad** de los webhooks **entrantes y salientes** de cada Tenant. **Salientes:** el framework envía notificaciones push firmadas con HMAC-SHA256 a URLs externas cuando ocurren eventos del sistema. **Entrantes:** el framework expone endpoints receptores que sistemas externos invocan; cada uno verifica firma, timestamp y anti-replay antes de procesar. Un mismo módulo administra ambas direcciones y muestra cuáles están activos/inactivos.

#### Schema de Base de Datos

**Tabla `webhooks`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `name` | `varchar(200)` | NOT NULL | Nombre descriptivo |
| `direction` | `enum` | DEFAULT `outbound`; `outbound`, `inbound` | Dirección del webhook |
| `url` | `text` | | **Saliente:** URL destino (HTTPS en producción). **Entrante:** ruta receptora expuesta por el framework (`/api/v1/webhooks/inbound/{id}`) |
| `secret` | `text` | NOT NULL | Secret HMAC-SHA256. **Saliente:** firma el payload emitido. **Entrante:** verifica la firma del payload recibido |
| `events` | `text[]` | NOT NULL | Eventos suscritos (salientes) o tipos aceptados (entrantes), ej: `["task.created", "task.updated"]` |
| `allowlist` | `text[]` | nullable | **Saliente:** dominios destino permitidos (anti-SSRF). **Entrante:** orígenes/IP permitidos |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |
| `last_triggered_at` | `timestamptz` | | Último disparo |
| `failure_count` | `integer` | DEFAULT `0` | Contador de fallos consecutivos |

**Tabla `webhook_deliveries` (historial de entregas):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `webhook_id` | `UUID FK webhooks` | NOT NULL | Webhook que generó la entrega |
| `event` | `varchar(100)` | NOT NULL | Evento que disparó la entrega |
| `payload` | `JSONB` | | Payload enviado |
| `response_status` | `integer` | | HTTP status code de respuesta |
| `response_body` | `text` | | Cuerpo de respuesta (truncado a 1KB) |
| `attempt_number` | `integer` | DEFAULT `1` | Número de intento |
| `status` | `varchar(20)` | NOT NULL | `delivered`, `failed`, `retrying` |
| `attempted_at` | `timestamptz` | NOT NULL | Timestamp del intento de entrega |
| `delivered_at` | `timestamptz` | NULL | Timestamp de entrega exitosa; `NULL` en fallos o reintentos |

**RLS:** Aplica. Admin solo ve webhooks de su Tenant.

**Direcciones, visibilidad y seguridad:**
- Un mismo módulo `webhook` administra y da **visibilidad** de los webhooks **entrantes** y **salientes** activos/inactivos por Tenant.
- **Salientes:** payload firmado con HMAC-SHA256; reintentos con backoff exponencial; desactivación automática tras fallos consecutivos; `allowlist` de dominios destino (anti-SSRF).
- **Entrantes:** cada endpoint receptor verifica firma HMAC, `timestamp` y **anti-replay** antes de procesar; `allowlist` de orígenes permitidos.
- **Rotación de secretos:** `secret` es rotable; al rotar se admite un periodo de gracia con doble verificación para no perder entregas.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getWebhooks()` | Lista webhooks del Tenant |
| `createWebhook(data)` | Crea webhook con URL, secret y eventos |
| `updateWebhook(id, data)` | Actualiza configuración |
| `deleteWebhook(id)` | Soft-delete |
| `getWebhookDeliveries(webhookId)` | Historial de entregas |
| `retryDelivery(deliveryId)` | Reenvía una entrega fallida |

#### Estructura de UI

**Grid:** Columnas: `name`, `url`, `events` (badges), `is_active`, `failure_count`, `last_triggered_at`.

**Formulario:** `name`, `url`, `events` (multi-select de eventos disponibles), `secret` (auto-generado con botón "Regenerar").

**Tab de Deliveries:** Grid de entregas con `event`, `status` (badge), `response_status`, `attempt_number`, `attempted_at`, `delivered_at`. Botón "Retry" en entregas fallidas.

#### Notas de Implementación

- Feature Gating: `webhook_enabled` en `plans.features` controla acceso al módulo.
- Payload firmado con `X-Webhook-Signature` usando HMAC-SHA256 del body + secret.
- Reintentos: 3 intentos con exponential backoff (1min, 5min, 30min).
- Si `failure_count >= 10`, el webhook se desactiva automáticamente con notificación al Admin.

---

### B11. `document` - Documents

> **PRD:** §3.B | **Tabla:** `documents` | **Ruta:** `/document` | **i18n:** `document`
> **Clasificación:** Módulo CRUD con editor de contenido.

#### Descripción Técnica

CMS interno para contenido de conocimiento del Tenant: manuales, políticas, procedimientos, wikis internas. Soporta contenido enriquecido (rich text), categorización por tags (§3.C), vinculación a archivos (§3.C), historial de versiones y relaciones genealógicas con otros registros mediante el grafo genérico `record_relationships`.

#### Schema de Base de Datos

**Tabla `documents`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `title` | `varchar(300)` | NOT NULL | Título del documento |
| `slug` | `varchar(300)` | NOT NULL | Slug URL-safe auto-generado desde título |
| `content` | `text` | | Contenido HTML/Markdown del documento |
| `excerpt` | `text` | | Resumen corto para previews |
| `category` | `varchar(100)` | | Categoría del documento |
| `status` | `varchar(20)` | DEFAULT `'draft'` | `draft`, `published`, `archived` |
| `is_pinned` | `boolean` | DEFAULT `false` | Fijado al inicio de la lista |
| `published_at` | `timestamptz` | | Fecha de publicación |
| `custom_data` | `JSONB` | DEFAULT `{}` | Campos personalizados (§3.B custom-field) |

**Constraint unique:** `(tenant_id, slug)`.

**Tabla `document_versions` (historial append-only):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `document_id` | `UUID FK documents` | NOT NULL | Documento versionado |
| `version_number` | `integer` | NOT NULL | Número secuencial por documento |
| `title` | `varchar(300)` | NOT NULL | Título guardado en esta versión |
| `slug` | `varchar(300)` | NOT NULL | Slug guardado en esta versión |
| `content` | `text` | | Contenido guardado en esta versión |
| `excerpt` | `text` | | Resumen guardado en esta versión |
| `category` | `varchar(100)` | | Categoría guardada en esta versión |
| `status` | `varchar(20)` | NOT NULL | Estado guardado en esta versión |
| `published_at` | `timestamptz` | | Fecha de publicación guardada |
| `change_summary` | `text` | | Resumen opcional del cambio |
| `created_by` | `UUID FK auth.users` | NOT NULL | Usuario que generó la versión |
| `created_at` | `timestamptz` | NOT NULL | Timestamp de creación de la versión |

**Constraint unique:** `(tenant_id, document_id, version_number)`.

**Relaciones documentales:** Los documentos NO usan `parent_id`. Las relaciones padre-hijo, dependencia, referencia o duplicado se guardan en `record_relationships` con `source_entity_type = 'document'` o `target_entity_type = 'document'`. La consulta de abuelos, padres, hijos y descendientes usa `record_relationship_paths`.

**RLS:** Aplica. Aislamiento por Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getDocuments(filters)` | Lista documentos con filtros por status, categoría |
| `getDocumentById(id)` | Detalle con contenido completo |
| `createDocument(data)` | Crea documento |
| `updateDocument(id, data)` | Actualiza documento |
| `publishDocument(id)` | Cambia status a `published`, registra `published_at` |
| `archiveDocument(id)` | Cambia status a `archived` |
| `getDocumentVersions(id)` | Lista historial de versiones del documento |
| `restoreDocumentVersion(id, versionNumber)` | Restaura una versión previa creando una nueva versión actual |
| `getDocumentRelationships(id, type?)` | Lista relaciones directas del documento |
| `getDocumentAncestors(id, type?)` | Lista ancestros usando `record_relationship_paths` |
| `getDocumentDescendants(id, type?)` | Lista descendientes usando `record_relationship_paths` |

#### Estructura de UI

**Grid:** Columnas: `title`, `category`, `status` (badge), `is_pinned`, `published_at`, `created_by`.

**Formulario:** `title`, `slug` (auto-generado, editable), `category`, `status`, `is_pinned`. Editor rich text para `content` (Tiptap/similar). Sidebar: `excerpt`, tags, archivos vinculados, relaciones y versiones.

**Historial de versiones:** Vista read-only con `version_number`, `created_at`, `created_by`, `status` y `change_summary`. Restaurar una versión histórica crea una nueva versión, no modifica versiones previas.

**Relaciones:** Panel de relaciones con tipos permitidos (`parent_of`, `depends_on`, `references`, `duplicates`). La UI debe permitir navegar ancestros y descendientes multi-nivel sin exponer registros fuera del Tenant.

#### Notas de Implementación

- `documents` conserva siempre el estado actual del documento.
- Cada creación genera `document_versions.version_number = 1`.
- Cada actualización publicable o cambio de contenido crea una nueva fila en `document_versions` y sincroniza `documents` con la versión más reciente.
- `document_versions` es append-only: no usa update ni soft-delete.
- La restauración de una versión genera una nueva versión con el contenido restaurado y registra acción `restore` en `logs`.

---

### B11.1 `record-relationship` - Relaciones entre Registros

> **Tablas:** `record_relationship_types`, `record_relationships`, `record_relationship_paths`
> **Clasificación:** Infraestructura transversal de soporte. No es un módulo con ruta propia.

#### Descripción Técnica

Grafo genérico para modelar relaciones entre registros de cualquier módulo usando extremos polimórficos (`entity_type` + `entity_id`). Cubre relaciones genealógicas multi-nivel, dependencias, referencias y duplicados sin agregar columnas específicas como `parent_id` a cada tabla de negocio.

#### Schema de Base de Datos

**Tabla `record_relationship_types`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | nullable | `NULL` para tipos globales; tenant para tipos propios |
| `code` | `varchar(50)` | NOT NULL | Código estable: `parent_of`, `depends_on`, `references`, `duplicates` |
| `name` | `varchar(100)` | NOT NULL | Nombre administrativo |
| `description` | `text` | | Descripción del tipo |
| `is_directed` | `boolean` | DEFAULT `true` | Si la relación tiene dirección |
| `is_acyclic` | `boolean` | DEFAULT `true` | Si debe bloquear ciclos |
| `inverse_code` | `varchar(50)` | | Código inverso para UI |
| `applies_to_entity_types` | `text[]` | | Lista de `module.code`; NULL permite cualquier módulo |
| `max_depth` | `integer` | nullable | Límite opcional de profundidad para este tipo; `NULL` = sin límite (lo decide la app derivada) |
| `is_active` | `boolean` | DEFAULT `true` | Toggle de uso |

**Tabla `record_relationships`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `relationship_type_id` | `UUID FK record_relationship_types` | NOT NULL | Tipo de relación |
| `source_entity_type` | `varchar(50)` | NOT NULL | `module.code` origen |
| `source_entity_id` | `UUID` | NOT NULL | Registro origen |
| `target_entity_type` | `varchar(50)` | NOT NULL | `module.code` destino |
| `target_entity_id` | `UUID` | NOT NULL | Registro destino |
| `metadata` | `JSONB` | DEFAULT `{}` | Contexto no indexable |
| `effective_from` | `timestamptz` | | Inicio de vigencia |
| `effective_to` | `timestamptz` | | Fin de vigencia |

**Tabla `record_relationship_paths`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `relationship_type_id` | `UUID FK record_relationship_types` | NOT NULL | Tipo de relación |
| `ancestor_entity_type` | `varchar(50)` | NOT NULL | Módulo ancestro |
| `ancestor_entity_id` | `UUID` | NOT NULL | Registro ancestro |
| `descendant_entity_type` | `varchar(50)` | NOT NULL | Módulo descendiente |
| `descendant_entity_id` | `UUID` | NOT NULL | Registro descendiente |
| `depth` | `integer` | NOT NULL | `0` self-path; `1` relación directa |
| `direct_relationship_id` | `UUID FK record_relationships` | | Arista directa cuando `depth = 1` |
| `created_at` | `timestamptz` | NOT NULL | Timestamp de materialización |

**RLS:** Aplica por `tenant_id`. Tipos globales (`record_relationship_types.tenant_id IS NULL`) son visibles según RBAC; relaciones y paths solo son visibles dentro del Tenant activo.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getRelationshipTypes(filters)` | Lista tipos globales y tenant-scoped disponibles |
| `createRecordRelationship(data)` | Crea una relación validando tenant, tipo y ciclos |
| `deleteRecordRelationship(id)` | Soft-delete de relación y actualización transaccional de paths |
| `getRecordRelationships(entityType, entityId, filters?)` | Lista relaciones directas |
| `getRecordAncestors(entityType, entityId, type?)` | Lista ancestros desde `record_relationship_paths` |
| `getRecordDescendants(entityType, entityId, type?)` | Lista descendientes desde `record_relationship_paths` |

#### Notas de Implementación

- `parent_of` y `depends_on` son acíclicas.
- `references` puede ser cíclica sólo si el tipo se define con `is_acyclic = false`.
- La creación debe validar que ambos extremos pertenezcan al mismo `tenant_id`.
- `record_relationship_paths` se mantiene por Server Action o trigger transaccional; no se edita desde UI.
- Los módulos derivados heredan esta capacidad sin crear tablas relacionales propias.
- **Sin límite de niveles:** el framework no impone un máximo de profundidad de relación; la cantidad de niveles la define la lógica de la aplicación derivada (p. ej. cuenta → contacto → oportunidad → mensaje). Solo se restringen los ciclos (`is_acyclic`) y el alcance por `tenant_id`. Un tipo puede declarar `max_depth` para autolimitarse (default `NULL` = sin límite).

---

### B12. `import` - Import

> **PRD:** §3.B, §4.10 | **Tabla:** `imports` | **Ruta:** `/import` | **i18n:** `import`
> **Clasificación:** Módulo tipo Wizard + Grid de historial.

#### Descripción Técnica

Importación masiva de datos desde archivos CSV y XLSX. El proceso sigue un wizard de 4 pasos: (1) Selección de módulo destino, (2) Upload de archivo, (3) Mapeo de columnas, (4) Preview + confirmación. El procesamiento es asíncrono para archivos grandes. El módulo destino debe tener su configuración de Import definida en el Módulo de Módulos (§3.A).

#### Schema de Base de Datos

**Tabla `imports`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `module_code` | `varchar(50)` | NOT NULL | Código del módulo destino |
| `file_name` | `varchar(300)` | NOT NULL | Nombre del archivo original |
| `file_url` | `text` | NOT NULL | URL del archivo en Storage |
| `file_format` | `varchar(10)` | NOT NULL | `csv`, `xlsx` |
| `column_mapping` | `JSONB` | | Mapeo columnas archivo → campos BD |
| `total_rows` | `integer` | | Total de filas en el archivo |
| `processed_rows` | `integer` | DEFAULT `0` | Filas procesadas |
| `success_count` | `integer` | DEFAULT `0` | Filas importadas exitosamente |
| `error_count` | `integer` | DEFAULT `0` | Filas con error |
| `errors` | `JSONB` | | Detalle de errores por fila: `[{ "row": 5, "field": "email", "error": "invalid" }]` |
| `status` | `varchar(20)` | DEFAULT `'pending'` | `pending`, `processing`, `completed`, `failed`, `cancelled` |
| `started_at` | `timestamptz` | | Inicio del procesamiento |
| `completed_at` | `timestamptz` | | Fin del procesamiento |

**RLS:** Aplica. Admin solo ve imports de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getImports(filters)` | Historial de importaciones |
| `createImport(data)` | Inicia proceso de importación (wizard) |
| `getImportPreview(id)` | Preview de las primeras N filas con mapeo aplicado |
| `confirmImport(id)` | Confirma y ejecuta la importación (async) |
| `cancelImport(id)` | Cancela importación en progreso |
| `downloadErrorReport(id)` | Descarga reporte de errores |

#### Estructura de UI

**Wizard (4 pasos):**
1. **Módulo destino:** Select de módulos con import habilitado
2. **Upload:** Drag & drop o file picker (CSV, XLSX)
3. **Mapeo:** UI de columnas del archivo → campos del módulo. Auto-mapeo por coincidencia de nombres
4. **Preview:** Tabla con primeras 10 filas mapeadas. Validaciones visibles. Botón "Confirmar"

**Grid de historial:** Columnas: `module_code`, `file_name`, `status` (badge con progreso), `total_rows`, `success_count`, `error_count`, `created_at`.

#### Notas de Implementación

- Feature Gating: `import_export_enabled` en `plans.features`.
- Archivos grandes (>1000 filas) se procesan asincrónicamente con job en background.
- Duplicados: estrategia configurable (`skip`, `update`, `error`) definida en el wizard.
- El módulo destino debe tener configuración de Import definida en el tab "Import" del Módulo de Módulos.
- Cada registro creado o actualizado por una importación debe guardar `source_type = 'import'`, `source_import_id`, `imported_at`, `imported_by`, `source_row_number` y `source_checksum` cuando la tabla destino soporte metadata de origen.
- `source_checksum` se usa para idempotencia y detección de reintentos duplicados dentro del mismo Tenant.
- Los reportes de error deben poder correlacionar `imports.errors.row` con `source_row_number` de los registros procesados correctamente.

---

### B13. `export` - Export

> **PRD:** §3.B, §4.10 | **Tabla:** `exports` | **Ruta:** `/export` | **i18n:** `export`
> **Clasificación:** Módulo Grid + descarga.

#### Descripción Técnica

Exportación de datos del Tenant a archivos descargables (CSV, XLSX). El usuario selecciona módulo, aplica filtros opcionales, elige formato y genera el archivo. Archivos grandes se procesan asincrónicamente. Historial de exportaciones con enlace de descarga temporal.

#### Schema de Base de Datos

**Tabla `exports`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `module_code` | `varchar(50)` | NOT NULL | Código del módulo exportado |
| `file_name` | `varchar(300)` | | Nombre del archivo generado |
| `file_url` | `text` | | URL temporal de descarga (Supabase Storage signed URL) |
| `file_format` | `varchar(10)` | NOT NULL | `csv`, `xlsx` |
| `filters_applied` | `JSONB` | | Filtros aplicados durante la exportación |
| `total_rows` | `integer` | | Total de registros exportados |
| `status` | `varchar(20)` | DEFAULT `'pending'` | `pending`, `processing`, `completed`, `failed` |
| `download_expires_at` | `timestamptz` | | Expiración del enlace de descarga |
| `started_at` | `timestamptz` | | Inicio del procesamiento |
| `completed_at` | `timestamptz` | | Fin del procesamiento |

**RLS:** Aplica. Admin solo ve exports de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getExports(filters)` | Historial de exportaciones |
| `createExport(data)` | Inicia exportación (módulo, formato, filtros) |
| `getDownloadUrl(id)` | Obtiene URL temporal de descarga |

#### Estructura de UI

**Formulario de creación:** `module_code` (select), `file_format` (select), filtros dinámicos según módulo.

**Grid de historial:** Columnas: `module_code`, `file_format`, `total_rows`, `status` (badge), `created_at`, `download_expires_at`. Botón "Descargar" (solo si `status = completed` y no expirado).

#### Notas de Implementación

- Feature Gating: `import_export_enabled` en `plans.features`.
- URLs de descarga con expiración configurable (default 24h).
- La exportación a PDF no pertenece al módulo Export de datasets. El PDF se genera al exportar un registro individual desde su vista de detalle/formulario en la UI, con branding del Tenant. Casos existentes: factura (`invoice`) y estado de cuenta (`statement`).

---

### B14. `subscription` - Suscripciones

> **PRD:** §3.B, §2.4 | **Tabla:** `subscriptions` | **Ruta:** `/subscription` | **i18n:** `subscription`
> **Clasificación:** Módulo CRUD - Vista dual según rol.

#### Descripción Técnica

Gestiona el ciclo de vida comercial de las suscripciones. El modelo soporta dos esquemas de licenciamiento definidos por `licensing_model` en bootstrap.json (PRD §1.5): **`per_tenant`** (una suscripción por Tenant, todos los usuarios heredan el plan) y **`per_user`** (suscripciones individuales por usuario, permitiendo planes diferenciados dentro del mismo Tenant). Admin ve solo su(s) suscripción(es); Super Admin accede al Grid completo.

#### Schema de Base de Datos

**Tabla `subscriptions`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant al que pertenece la suscripción |
| `entity_type` | `varchar(20)` | NOT NULL, DEFAULT `'tenant'` | `tenant` o `user` - define el propietario de la suscripción según `licensing_model` |
| `entity_id` | `UUID` | NOT NULL | UUID del Tenant (si `entity_type = tenant`) o del User (si `entity_type = user`) |
| `plan_id` | `UUID FK plans` | NOT NULL | Plan activo |
| `status` | `varchar(20)` | NOT NULL, DEFAULT `'trialing'` | `trialing`, `active`, `past_due`, `cancelled`, `expired`, `suspended` |
| `billing_cycle` | `varchar(10)` | DEFAULT `'monthly'` | `monthly`, `yearly` |
| `trial_starts_at` | `timestamptz` | | Inicio del período de trial |
| `trial_ends_at` | `timestamptz` | | Fin del período de trial |
| `current_period_start` | `timestamptz` | | Inicio del período de facturación actual |
| `current_period_end` | `timestamptz` | | Fin del período de facturación actual |
| `cancelled_at` | `timestamptz` | | Fecha de cancelación |
| `external_subscription_id` | `varchar(100)` | | ID de suscripción en proveedor de pagos externo (agnóstico) |
| `external_customer_id` | `varchar(100)` | | ID de customer en proveedor de pagos externo |

**Constraint:** `UNIQUE(entity_type, entity_id)` - Cada entidad (Tenant o User) tiene máximo una suscripción activa.

**RLS:** Aplica. Admin solo ve suscripciones de su Tenant. Super Admin ve todas.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getSubscriptions()` | Lista suscripciones (Super Admin: todas; Admin: solo las de su Tenant) |
| `getSubscriptionById(id)` | Detalle de suscripción |
| `changePlan(id, planId, billingCycle)` | Cambia plan de la suscripción (upgrade/downgrade) |
| `cancelSubscription(id)` | Cancela suscripción al fin del período actual |
| `reactivateSubscription(id)` | Reactiva suscripción cancelada |

#### Estructura de UI

**Vista Admin (singleton - per_tenant):** Card con plan actual, estado, próxima facturación, botones de "Cambiar Plan" y "Cancelar".

**Vista Admin (per_user):** Grid de suscripciones de usuarios del Tenant con opción de sobrescribir plan individual.

**Grid (Super Admin):** Columnas: `tenant` (nombre), `entity_type`, `plan` (nombre), `status` (badge), `billing_cycle`, `current_period_end`, `external_subscription_id`.

#### Ciclo de vida (§2.4)

```
trialing → active (pago exitoso o plan free)
trialing → expired (trial vencido sin pago)
active → past_due (fallo de pago)
active → cancelled (cancelación voluntaria)
past_due → active (pago recuperado)
past_due → cancelled (máx reintentos agotados)
expired → active (upgrade a plan de pago)
```

**Trial vencido (§2.4.6):** Si existe plan con `is_freemium = true`, degrada automáticamente a ese plan. Si no, evalúa `subscription.expiry_action` desde `settings`: `degrade_to_free`, `suspend_tenant` o `read_only_mode` (default).

#### Notas de Implementación

- En modo `per_tenant`: un Tenant tiene exactamente una suscripción (`entity_type = 'tenant'`, `entity_id = tenant.id`).
- En modo `per_user`: cada usuario hereda el plan del Tenant por defecto; un Admin puede sobrescribirlo creando una suscripción con `entity_type = 'user'`, `entity_id = user.id`.
- Al crear un Tenant, se genera automáticamente una suscripción con `plan_id = default_plan_code`.
- Trial Reminder (§2.4.3): Job cron que envía notificaciones a días configurados antes del vencimiento.
- La integración con el proveedor de pagos es gestionada por la funcionalidad transversal §4.22.

---

### B15. `statement` - Estados de Cuenta

> **PRD:** §3.B, §1.5 | **Tabla:** `statements` | **Ruta:** `/statement` | **i18n:** `statement`
> **Clasificación:** Módulo read-only - Grid con detalle.

#### Descripción Técnica

Consolidado financiero por ciclo de facturación del Tenant. Cada statement representa el monto total a cobrar al final de un período, calculado a partir de las suscripciones activas del Tenant. En modo `per_tenant`, consolida el total según el plan único. En modo `per_user`, agrupa usuarios por esquema de licenciamiento, calcula subtotales por plan y totaliza el monto a cobrar por Tenant. Los registros se generan automáticamente por un Job al cierre de cada ciclo de facturación.

#### Schema de Base de Datos

**Tabla `statements`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `period_start` | `timestamptz` | NOT NULL | Inicio del período de facturación |
| `period_end` | `timestamptz` | NOT NULL | Fin del período de facturación |
| `total_amount` | `decimal(12,2)` | NOT NULL | Monto total a cobrar en el período |
| `currency` | `varchar(3)` | DEFAULT `'USD'` | ISO 4217 |
| `line_items` | `JSONB` | NOT NULL | Desglose de suscripciones: `[{ "plan_code": "...", "plan_name": "...", "user_count": N, "unit_price": X, "subtotal": Y }]` |
| `status` | `varchar(20)` | NOT NULL, DEFAULT `'draft'` | `draft`, `finalized`, `paid`, `voided` |
| `payment_method_id` | `varchar(100)` | | Referencia al método de pago utilizado |
| `generated_at` | `timestamptz` | NOT NULL | Fecha de generación del statement |

**RLS:** Aplica. Admin solo ve statements de su Tenant. Super Admin cross-tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getStatements(filters)` | Lista estados de cuenta con filtros por período, status |
| `getStatementById(id)` | Detalle con desglose de `line_items` |
| `getTenantBalance(tenantId)` | Balance actual calculado |

#### Estructura de UI

**Grid:** Read-only. Columnas: `period_start`–`period_end`, `total_amount` (formateado), `currency`, `status` (badge), `generated_at`. Filtros: rango de períodos, status.

**Detalle:** Tabla de `line_items` con desglose por plan: `plan_name`, `user_count`, `unit_price`, `subtotal`. Total general al final.

**Card superior:** Balance actual del Tenant con indicador visual.

---

### B16. `invoice` - Invoices

> **PRD:** §3.B, §1.5 | **Tabla:** `invoices` | **Ruta:** `/invoice` | **i18n:** `invoice`
> **Clasificación:** Módulo read-only - Grid con detalle y descarga PDF.

#### Descripción Técnica

Facturas generadas automáticamente por el ciclo de facturación de la suscripción. El Admin visualiza y descarga facturas en PDF. El Super Admin tiene acceso cross-tenant. Las facturas se generan como registros inmutables al procesar un pago exitoso.

#### Schema de Base de Datos

**Tabla `invoices`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `statement_id` | `UUID FK statements` | | Statement que originó esta factura |
| `invoice_number` | `varchar(50)` | NOT NULL, UNIQUE | Número secuencial de factura |
| `external_invoice_id` | `varchar(100)` | | ID de factura en proveedor de pagos (agnóstico) |
| `status` | `varchar(20)` | NOT NULL | `processed`, `voided`, `reversed` |
| `amount` | `decimal(12,2)` | NOT NULL | Monto de la transacción |
| `currency` | `varchar(3)` | DEFAULT `'USD'` | ISO 4217 |
| `description` | `text` | NOT NULL | Descripción del cobro |
| `line_items` | `JSONB` | | Detalle de conceptos: `[{ "description": "...", "quantity": 1, "unit_price": 29.99, "amount": 29.99 }]` |
| `paid_at` | `timestamptz` | | Fecha de pago |
| `voided_at` | `timestamptz` | | Fecha de anulación |
| `reversed_at` | `timestamptz` | | Fecha de reversa |
| `pdf_url` | `text` | | URL del PDF generado |

**RLS:** Aplica. Admin solo ve facturas de su Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getInvoices(filters)` | Lista facturas con filtros por status, fecha |
| `getInvoiceById(id)` | Detalle completo de factura |
| `downloadInvoicePdf(id)` | Genera/obtiene URL de descarga del PDF |

#### Estructura de UI

**Grid:** Read-only. Columnas: `invoice_number`, `billing_period_start`–`billing_period_end`, `total` (formateado), `status` (badge), `paid_at`, `pdf_url` (botón descarga).

**Formulario de detalle:** Read-only. Datos del Tenant (billing info), tabla de `line_items`, subtotal/tax/total, estado de pago.

#### Notas de Implementación

- Facturas inmutables: una vez creadas con status `paid`, no pueden modificarse (solo `void` por Super Admin).
- PDF generado con branding del Tenant (`tenant_branding.logo_url`, `tenant_branding.primary_color`).
- `invoice_number` es secuencial: formato configurable (ej: `INV-2026-0001`).
- Si `billing_enabled = false` en Parámetros, los módulos subscription, statement e invoice no aparecen en el menú.

---

### B17. `legal-template` - Plantillas Legales

> **PRD:** §1.5 | **Tablas:** `legal_templates`, `legal_template_versions` | **Ruta:** `/legal-template` | **i18n:** `legal_template`
> **Clasificación:** Módulo CRUD core con publicación pública versionada.

#### Descripción Técnica

Permite a cada Tenant crear y versionar **documentos legales públicos** (política de privacidad, términos y condiciones, política de cookies, etc.) mediante un **editor WYSIWYG que produce HTML**. Cada documento depende de la **jurisdicción/país y locale** del Tenant (la normativa aplicable varía por país). Las versiones publicadas se obtienen por **código y versión** a través de una API **pública** (sin autenticación), de modo que páginas internas, páginas externas y la aplicación móvil puedan renderizar el documento vigente. Todo SaaS necesita esta capacidad, por eso es un módulo core.

#### Schema de Base de Datos

**Tabla `legal_templates`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `code` | `varchar(50)` | NOT NULL | Código estable: `privacy_policy`, `terms_of_service`, `cookie_policy`, etc. |
| `name` | `varchar(200)` | NOT NULL | Nombre administrativo |
| `locale` | `varchar(10)` | NOT NULL | Idioma/locale (ej. `es`, `en`, `es-GT`) |
| `jurisdiction` | `varchar(10)` | nullable | País/jurisdicción ISO (ej. `GT`, `MX`) según normativa aplicable |
| `current_version_id` | `UUID FK legal_template_versions` | nullable | Versión publicada vigente |
| `is_active` | `boolean` | DEFAULT `true` | Toggle |

**Constraint unique:** `(tenant_id, code, locale, jurisdiction)`.

**Tabla `legal_template_versions`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `legal_template_id` | `UUID FK legal_templates` | NOT NULL | Documento al que pertenece |
| `version_number` | `integer` | NOT NULL | Secuencial por documento |
| `content_html` | `text` | NOT NULL | Contenido HTML producido por el editor WYSIWYG |
| `status` | `enum` | DEFAULT `draft`; `draft`, `published`, `archived` | Estado de la versión |
| `effective_from` | `timestamptz` | | Inicio de vigencia |
| `effective_to` | `timestamptz` | | Fin de vigencia |
| `published_at` | `timestamptz` | | Marca de publicación |
| `created_by` | `UUID FK users` | | Autor de la versión |
| `created_at` | `timestamptz` | NOT NULL | Timestamp de creación |

**Constraint unique:** `(legal_template_id, version_number)`.

**RLS:** la gestión (crear/editar/publicar) está aislada por `tenant_id` y requiere RBAC. La **lectura pública** sirve únicamente versiones `published` y solo el HTML del documento, sin exponer otros datos tenant-aware.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getLegalTemplates(filters)` | Lista documentos del Tenant |
| `createLegalTemplate(data)` | Crea un documento (code, locale, jurisdiction) |
| `createLegalTemplateVersion(id, contentHtml)` | Crea una nueva versión en `draft` |
| `publishLegalTemplateVersion(versionId)` | Publica una versión y actualiza `current_version_id` |
| `getPublishedLegalDocument(code, locale, jurisdiction)` | **Público:** devuelve el HTML de la versión publicada vigente |

#### Estructura de UI

**Formulario:** editor **WYSIWYG** que genera HTML por versión, con metadatos (`code`, `locale`, `jurisdiction`, vigencia) e historial de versiones. Acciones: guardar borrador, publicar, archivar.

**Grid:** Columnas: `code`, `name`, `locale`, `jurisdiction`, versión vigente, `is_active`.

#### Integraciones

| Sistema | Relación |
|:--------|:---------|
| **API pública** | `GET /api/v1/legal/templates?code=&locale=&jurisdiction=` devuelve el HTML publicado para web/móvil, autenticado o anónimo |
| **Consentimiento Legal (`consent_records`)** | `consent_records.document_id` referencia la versión exacta aceptada en `legal_template_versions` |
| **Parámetros (`settings`)** | `legal.terms_version` referencia la versión vigente de términos |

#### Notas de Implementación

- El contenido es **HTML versionado**; cada cambio publicado crea una versión inmutable nueva, conservando el historial para auditoría legal.
- La obtención pública sirve solo versiones `published`; los borradores nunca son accesibles sin autenticación.
- La combinación `code + locale + jurisdiction` permite servir el documento correcto según el país y el idioma del usuario final.

---

## C. Módulos de Funcionalidades Comunes

Componentes reutilizables inyectables en cualquier módulo CRUD. Operan transversalmente y se vinculan a registros de otros módulos mediante relaciones polimórficas (`entity_type` + `entity_id`).

---

### C1. `file` - Files

> **PRD:** §3.C, §4.16 | **Tabla:** `files` | **Ruta:** `/file` | **i18n:** `file`
> **Clasificación:** Módulo CRUD con componente inyectable (FileUploader).

#### Descripción Técnica

Gestión centralizada de archivos del Tenant. Soporta upload, preview, descarga y vinculación polimórfica a registros de cualquier módulo. El almacenamiento backend utiliza Supabase Storage con buckets organizados por Tenant. El componente `FileUploader` se inyecta en formularios de otros módulos.

#### Schema de Base de Datos

**Tabla `files`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `file_name` | `varchar(300)` | NOT NULL | Nombre original del archivo |
| `file_url` | `text` | NOT NULL | URL del archivo en Supabase Storage |
| `file_size` | `bigint` | NOT NULL | Tamaño en bytes |
| `mime_type` | `varchar(100)` | NOT NULL | Tipo MIME (ej: `image/png`, `application/pdf`) |
| `entity_type` | `varchar(50)` | | Módulo vinculado (polimórfico) |
| `entity_id` | `UUID` | | Registro vinculado (polimórfico) |
| `is_public` | `boolean` | DEFAULT `false` | Si el archivo es accesible sin autenticación |
| `thumbnail_url` | `text` | | URL del thumbnail (para imágenes) |
| `file_group_id` | `UUID` | NOT NULL | Grupo lógico que une todas las versiones del mismo archivo |
| `version` | `integer` | NOT NULL, DEFAULT `1` | Número secuencial dentro de `file_group_id` |
| `previous_version_id` | `UUID FK files` | | Versión anterior inmediata |
| `is_current` | `boolean` | DEFAULT `true` | Si esta fila representa la versión vigente |

**Constraint unique:** una sola versión vigente por `(tenant_id, file_group_id)` cuando `is_current = true`.

**RLS:** Aplica. Aislamiento por `tenant_id`.

**Validaciones (desde Parámetros):**
- `storage.allowed_mime_types`: Tipos permitidos
- `storage.max_file_size_mb`: Tamaño máximo por archivo
- `storage.max_storage_per_tenant_mb`: Cuota total por Tenant
- `storage.image_optimization_webp`: Auto-conversión a WebP

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getFiles(filters)` | Lista archivos con filtros por tipo, módulo vinculado |
| `uploadFile(file, entityType?, entityId?)` | Sube archivo a Storage y registra en BD |
| `uploadFileVersion(fileGroupId, file)` | Crea nueva versión, marca la anterior como `is_current = false` |
| `getFileVersions(fileGroupId)` | Lista historial de versiones de un archivo |
| `deleteFile(id)` | Soft-delete del archivo (elimina de Storage en purga) |
| `getStorageUsage(tenantId)` | Uso de almacenamiento actual vs cuota |

#### Estructura de UI

**Grid:** Columnas: `file_name`, `mime_type` (icono), `file_size` (formateado), `entity_type`, `version`, `is_current`, `is_public`, `created_at`. Preview en hover para imágenes.

**Componente inyectable `FileUploader`:** Drag & drop + file picker. Configurable: `accept` (MIME types), `maxFiles`, `maxSize`. Muestra preview de archivos subidos con opciones de eliminar.

**Historial de versiones:** Accesible desde el detalle del archivo. Muestra `version`, `file_name`, `file_size`, `created_at`, `created_by` e indicador de versión vigente.

#### Notas de Implementación

- Buckets de Storage organizados: `{tenant_id}/{entity_type}/{entity_id}/` para aislamiento.
- El bucket `public_assets` almacena archivos de acceso público (avatares, logos).
- Imágenes se optimizan automáticamente a WebP si `image_optimization_webp = true`.
- Al reemplazar un archivo se crea una nueva fila en `files`; no se sobrescribe la fila anterior.
- `previous_version_id` apunta a la versión vigente previa y esa versión se marca `is_current = false` en la misma transacción.
- Las versiones anteriores permanecen en Storage hasta purga manual o cleanup automático según Settings.

---

### C2. `tag` - Tags

> **PRD:** §3.C | **Tabla:** `tags`, `taggables` | **Ruta:** N/A (UI inyectable) | **i18n:** `tag`
> **Clasificación:** UI inyectable - Sin ruta propia. Se renderiza dentro de formularios de otros módulos.

#### Descripción Técnica

Sistema de etiquetado plano por Tenant. Los tags no tienen jerarquía entre sí ni `parent_id` en el MVP. La relación de pertenencia entre un tag y el registro donde se usa se modela mediante la tabla pivote polimórfica `taggables`. El componente de tags se inyecta en formularios y permite crear tags on-the-fly.

#### Schema de Base de Datos

**Tabla `tags`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `name` | `varchar(100)` | NOT NULL | Nombre del tag |
| `color` | `varchar(7)` | | Color hex para badge (ej: `#3B82F6`) |
| `description` | `text` | | Descripción del tag |

**Constraint unique:** `(tenant_id, name)`.

**Tabla `taggables` (pivote polimórfica):**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tag_id` | `UUID FK tags` | NOT NULL | Tag vinculado |
| `entity_type` | `varchar(50)` | NOT NULL | Código del módulo |
| `entity_id` | `UUID` | NOT NULL | ID del registro |

**Constraint unique:** `(tag_id, entity_type, entity_id)`.

**RLS:** Aplica vía `tenant_id` en `tags`.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getTags(tenantId)` | Lista todos los tags del Tenant |
| `createTag(data)` | Crea nuevo tag |
| `updateTag(id, data)` | Actualiza tag |
| `deleteTag(id)` | Soft-delete (desvincula de registros) |
| `attachTags(entityType, entityId, tagIds)` | Vincula tags a un registro |
| `detachTag(entityType, entityId, tagId)` | Desvincula un tag de un registro |
| `getEntityTags(entityType, entityId)` | Tags de un registro específico |

#### Estructura de UI

**Componente inyectable `TagSelector`:** Input con autocompletado + badges. Permite crear tags inline ("tag-as-you-type"). Muestra tags como badges con color configurable.

**Gestión de tags:** Accesible desde configuración del Tenant o desde el componente inyectable (botón "Gestionar Tags").

---

### C3. `bookmark` - Bookmarks

> **PRD:** §3.C, §4.5 | **Tabla:** `bookmarks` | **Ruta:** N/A (UI inyectable) | **i18n:** `bookmark`
> **Clasificación:** UI inyectable - Sin ruta propia. Se renderiza en header y registros.

#### Descripción Técnica

Permite a cada usuario marcar registros de cualquier módulo como favoritos. Los bookmarks se muestran como accesos rápidos en el sidebar y como acción en las filas del Grid. Almacenamiento polimórfico con límite configurable por usuario.

#### Schema de Base de Datos

**Tabla `bookmarks`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `user_id` | `UUID FK auth.users` | NOT NULL | Usuario propietario |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `entity_type` | `varchar(50)` | NOT NULL | Código del módulo |
| `entity_id` | `UUID` | NOT NULL | ID del registro |
| `display_label` | `varchar(200)` | NOT NULL | Label derivado del `display_field` del módulo |
| `sort_order` | `integer` | | Orden personalizado |

**Constraint unique:** `(user_id, tenant_id, entity_type, entity_id)`.

**RLS:** Aplica. Cada usuario solo ve sus propios bookmarks.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getBookmarks()` | Lista bookmarks del usuario en el Tenant actual |
| `toggleBookmark(entityType, entityId)` | Agrega o remueve bookmark |
| `reorderBookmarks(bookmarkIds)` | Reordena bookmarks |

#### Estructura de UI

**Icono de bookmark:** ☆ / ★ en cada fila del Grid (toggle). Se renderiza junto a la primera columna.

**Panel de bookmarks en sidebar:** Lista ordenada de bookmarks con icono del módulo y `display_label`. Click navega al registro.

#### Notas de Implementación

- Límite: `max_bookmarks_per_user` en `ui_defaults` de Parámetros (default 25).
- `display_label` se resuelve del `display_field` definido en el Módulo de Módulos al momento de crear el bookmark.
- Bookmarks persisten por Tenant: independientes entre cuentas para usuarios multi-tenant.

---

### C4. `filter` - Filtros

> **PRD:** §3.C, §4.6 | **Tabla:** `filters` | **Ruta:** N/A (UI inyectable) | **i18n:** `filter`
> **Clasificación:** UI inyectable - Sin ruta propia. Se renderiza en el Grid Universal.

#### Descripción Técnica

Permite a usuarios guardar configuraciones de filtros del Grid Universal como presets reutilizables. Los filtros guardados aparecen como tabs o dropdown en la parte superior del Grid. Cada filtro almacena la combinación de condiciones, ordenamiento y columnas visibles.

#### Schema de Base de Datos

**Tabla `filters`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `user_id` | `UUID FK auth.users` | NOT NULL | Creador del filtro |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant |
| `module_code` | `varchar(50)` | NOT NULL | Código del módulo al que aplica |
| `name` | `varchar(200)` | NOT NULL | Nombre del filtro guardado |
| `conditions` | `JSONB` | NOT NULL | Condiciones del filtro (misma estructura que rules.conditions) |
| `sort_config` | `JSONB` | | Configuración de ordenamiento: `{ "field": "...", "direction": "asc" }` |
| `visible_columns` | `text[]` | | Columnas visibles en el Grid (override del default) |
| `is_default` | `boolean` | DEFAULT `false` | Si es el filtro por defecto al entrar al módulo |
| `is_shared` | `boolean` | DEFAULT `false` | Si el filtro es visible para otros usuarios del Tenant |

**RLS:** Aplica. Filtros privados (`is_shared = false`) solo visibles por su creador. Filtros compartidos visibles por todo el Tenant.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getFilters(moduleCode)` | Lista filtros del usuario + compartidos para un módulo |
| `createFilter(data)` | Guarda nuevo filtro |
| `updateFilter(id, data)` | Actualiza filtro existente |
| `deleteFilter(id)` | Elimina filtro (solo propietario) |
| `setDefaultFilter(moduleCode, filterId)` | Establece filtro por defecto para el módulo |

#### Estructura de UI

**Componente en Grid Universal:** Tabs o dropdown con filtros guardados. Botón "Guardar filtro actual". Toggle "Compartir con equipo". Indicador visual del filtro activo.

**Formulario de guardado:** `name`, `is_shared` (toggle). Las condiciones se capturan del estado actual del Grid.

---

## D. Módulo Demostrativo

Módulo de referencia para desarrollo y testing del framework.

---

### D1. `task` - Tasks

> **PRD:** §3.D | **Tabla:** `tasks` | **Ruta:** `/task` | **i18n:** `task`
> **Clasificación:** Módulo CRUD estándar con Triada completa (Tabla + Formulario + Grid).

#### Descripción Técnica

Módulo demostrativo y de referencia que implementa la Triada completa del framework. Sirve como ejemplo canónico de implementación de un módulo CRUD con todas las funcionalidades del framework integradas: Grid Universal, Campos Personalizados, Tags, Bookmarks, Filtros, Import/Export, Event Bus y Búsqueda Global. Es la referencia obligatoria para desarrolladores que implementen módulos nuevos.

#### Schema de Base de Datos

**Tabla `tasks`:**

| Campo | Tipo | Constraints | Descripción |
|:------|:-----|:------------|:------------|
| `id` | `UUID` | PK | Identificador único |
| `tenant_id` | `UUID FK tenants` | NOT NULL | Tenant propietario |
| `title` | `varchar(300)` | NOT NULL | Título de la tarea |
| `description` | `text` | | Descripción detallada |
| `status` | `varchar(30)` | NOT NULL, DEFAULT `'pending'` | `pending`, `in_progress`, `completed`, `cancelled` |
| `priority` | `varchar(20)` | DEFAULT `'medium'` | `low`, `medium`, `high`, `critical` |
| `assigned_to` | `UUID FK auth.users` | nullable | Usuario asignado |
| `due_date` | `date` | | Fecha límite |
| `completed_at` | `timestamptz` | | Fecha de completado |
| `custom_data` | `JSONB` | DEFAULT `{}` | Campos personalizados (§3.B custom-field) |

**RLS:** Aplica. Aislamiento por `tenant_id`.

#### Server Actions

| Función | Descripción |
|:--------|:------------|
| `getTasks(filters)` | Lista tareas con filtros por status, priority, assigned_to, due_date |
| `getTaskById(id)` | Detalle de la tarea |
| `createTask(data)` | Crea tarea |
| `updateTask(id, data)` | Actualiza tarea |
| `deleteTask(id)` | Soft-delete |
| `completeTask(id)` | Cambia status a `completed`, registra `completed_at` |

#### Estructura de UI

**Grid:** Columnas configuradas desde Módulo de Módulos: `title`, `status` (badge con color), `priority` (badge), `assigned_to` (avatar + nombre), `due_date`, `created_at`. Acciones por fila: view, edit, delete, duplicate.

**Formulario:** `title`, `description` (textarea), `status` (select), `priority` (select), `assigned_to` (user picker con búsqueda), `due_date` (date picker). Sección de Campos Personalizados. Sidebar: Tags (§3.C), Files (§3.C).

#### Integraciones (todas las funcionalidades del framework)

| Sistema | Uso demostrativo |
|:--------|:-----------------|
| **Grid Universal (§4.7)** | Columnas, sort, filtros, paginación |
| **Búsqueda Global (§4.3)** | Indexado por `title` (high weight), `description` (medium) |
| **Campos Personalizados (§3.B)** | `custom_data` JSONB con renderizado dinámico |
| **Tags (§3.C)** | Etiquetado polimórfico |
| **Bookmarks (§3.C)** | Marcado de favoritos por usuario |
| **Filtros (§3.C)** | Filtros guardados y compartidos |
| **Import/Export (§3.B)** | Importación CSV/XLSX, exportación CSV/XLSX |
| **Event Bus (§4.13)** | Eventos: `task.created`, `task.updated`, `task.deleted`, `task.completed` |
| **Interceptor de Auditoría (§4.11)** | Registro de todas las operaciones |
| **Notificaciones (§3.B)** | Notificaciones configurables por evento |

#### Notas de Implementación

- Este módulo es la **implementación de referencia canónica** para todos los módulos CRUD del framework.
- Todo módulo nuevo de la aplicación derivada debe seguir este patrón como plantilla.
- Incluye ejemplos funcionales de TODAS las integraciones transversales del framework.
- El registro en `modules` para `task` se pre-carga durante la inicialización con configuración completa de Grid y Search.

---

## Apéndice: Inventario de Tablas

> El contrato consolidado de ownership, RLS, soft delete e índices mínimos está en [`REFERENCE_DATABASE_SCHEMA.md`](./REFERENCE_DATABASE_SCHEMA.md).

| # | Tabla | Módulo | Tipo |
|:--|:------|:-------|:-----|
| 1 | `settings` | A1. Parámetros | Singleton |
| 2 | `modules` | A2. Módulo de Módulos | Principal |
| 3 | `plans` | A3. Planes | Principal |
| 4 | `ai_models` | A4. Modelos AI | Principal |
| 5 | `logs` | A5. Log | Principal (inmutable) |
| 6 | `profiles` | A6. Profiles | Principal |
| 7 | `profile_permissions` | A6. Profiles | Soporte |
| 8 | `tenants` | B1. Tenants | Principal |
| 9 | `user_memberships` | B1. Tenants | Soporte (N:N) |
| 10 | `users` | B2. Usuarios | Principal |
| 11 | `user_preferences` | B2. Usuarios | Soporte |
| 12 | `invitations` | B3. Invitaciones | Principal |
| 13 | `notifications` | B4. Notificaciones | Principal |
| 14 | `rules` | B5. Reglas | Principal |
| 15 | `rule_runs` | B5. Reglas | Soporte |
| 16 | `custom_fields` | B6. Campos Personalizados | Principal |
| 17 | `email_templates` | B7. Plantillas Email | Principal |
| 18 | `api_keys` | B8. API Keys | Principal |
| 19 | `integrations` | B9. Integraciones | Principal |
| 20 | `webhooks` | B10. Webhooks | Principal |
| 21 | `webhook_deliveries` | B10. Webhooks | Soporte |
| 22 | `documents` | B11. Documents | Principal |
| 23 | `document_versions` | B11. Documents | Soporte (versiones) |
| 24 | `record_relationship_types` | B11.1 Relaciones entre Registros | Soporte |
| 25 | `record_relationships` | B11.1 Relaciones entre Registros | Soporte |
| 26 | `record_relationship_paths` | B11.1 Relaciones entre Registros | Soporte derivado |
| 27 | `imports` | B12. Import | Principal |
| 28 | `exports` | B13. Export | Principal |
| 29 | `subscriptions` | B14. Suscripciones | Principal |
| 30 | `statements` | B15. Estados de Cuenta | Principal |
| 31 | `invoices` | B16. Invoices | Principal |
| 32 | `files` | C1. Files | Principal |
| 33 | `tags` | C2. Tags | Principal |
| 34 | `taggables` | C2. Tags | Pivote |
| 35 | `bookmarks` | C3. Bookmarks | Principal |
| 36 | `filters` | C4. Filtros | Principal |
| 37 | `tasks` | D1. Tasks | Principal |
| 38 | `consent_records` | Compliance (PRD §1.5) | Soporte |
| 39 | `legal_templates` | B17. Plantillas Legales | Principal |
| 40 | `legal_template_versions` | B17. Plantillas Legales | Versionado |
| 41 | `ai_budgets` | A4. Modelos AI | Soporte |

> **Nota:** 41 tablas = 28 módulos core + 13 tablas de soporte/pivote/versionado/relaciones. La tabla `consent_records` almacena registros de aceptación de términos legales (GDPR, CCPA); no tiene módulo propio, se genera durante la aceptación de términos y su `document_id` referencia la versión exacta aceptada en `legal_template_versions` (módulo B17). La tabla `ai_budgets` define los topes de gasto del Core AI (módulo A4).
