# Contrato de Base de Datos - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.0.0
> **Última actualización:** 2026-06-06
> **Fuente de verdad funcional:** [`PRD.md`](./PRD.md)
> **Propósito:** Consolidar las tablas base del framework, su ownership, alcance multi-tenant, RLS y política de eliminación.
> **Alcance:** Contrato documental para migraciones y validación. Los schemas detallados por módulo se mantienen en [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md).
> **Seguridad:** Reglas RLS, RBAC, exposición de claves y pruebas de aislamiento se verifican contra [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md) y [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md).

---

## 1. Principios

1. Toda tabla que contenga datos de Tenant o referencias directas a un Tenant debe tener `tenant_id` y RLS activo.
2. Las tablas globales no llevan `tenant_id` cuando su configuración afecta a toda la aplicación o al framework completo.
3. Las tablas con `tenant_id = NULL` solo son válidas cuando el documento lo indique explícitamente como scope global.
4. Las tablas de negocio usan soft delete con `deleted_at`, salvo tablas append-only, pivotes o registros operativos temporales donde se indique otra política.
5. El `service_role` solo se usa en procesos server-side controlados. Nunca se instancia en cliente.
6. La metadata transversal auditable se modela con columnas explícitas, no con JSONB genérico, cuando deba filtrarse, validarse o indexarse.
7. Las relaciones entre registros se modelan con un grafo polimórfico tenant-scoped reutilizable por módulos del framework y aplicaciones derivadas.
8. El versionado histórico solo aplica a `documents` y `files`; los demás módulos usan `logs.metadata.changes` como auditoría de cambios.

---

## 2. Excepciones RLS Globales

| Tabla | Motivo |
|-------|--------|
| `settings` | Configuración global singleton del framework/aplicación. |
| `modules` | Registro global de módulos y configuración base de UI/operación. |
| `plans` | Catálogo global de planes. |
| `ai_models` | Catálogo global de modelos IA disponibles. |
| `profiles` con `tenant_id IS NULL` | Perfiles globales base (`Super Admin`, `Admin`, `Member`, `Guest`). |

---

## 3. Inventario Consolidado

| # | Tabla | Scope | RLS | Soft delete | Notas |
|---|-------|-------|-----|-------------|-------|
| 1 | `settings` | Global | No | No | Singleton global; acceso solo Super Admin. |
| 2 | `modules` | Global | No | No | Registro canónico de módulos; los 27 core se cargan desde lista interna. |
| 3 | `plans` | Global | No | Opcional | Catálogo comercial; puede desactivarse por `billing_enabled`. |
| 4 | `ai_models` | Global | No | Opcional | Modelos disponibles para Core AI. |
| 5 | `logs` | Global/Tenant | Sí | No | Append-only. `tenant_id` nullable; `actor_id` nullable para M2M; `api_key_id` para API Keys. |
| 6 | `profiles` | Global/Tenant | Parcial | Opcional | Global si `tenant_id IS NULL`; tenant-scoped si tiene `tenant_id`. |
| 7 | `profile_permissions` | Soporte | Sí | No | Matriz profile x module. Hereda alcance del profile. |
| 8 | `tenants` | Tenant entity | Sí | Sí | La entidad principal de aislamiento. Super Admin ve todos. |
| 9 | `user_memberships` | Tenant | Sí | No | Relación User x Tenant x Profile. |
| 10 | `users` | Usuario | Sí | Sí | Identidad extendida; referencia `auth.users`. |
| 11 | `user_preferences` | Tenant/User | Sí | No | Preferencias por usuario y tenant. Locale/timezone viven en `users`. |
| 12 | `invitations` | Tenant | Sí | Sí | Tokens hasheados; TTL configurable. |
| 13 | `notifications` | Tenant/User | Sí | Sí | Notificaciones lógicas multicanal. |
| 14 | `rules` | Tenant | Sí | Sí | Reglas del Event Bus. Límite efectivo por plan. |
| 15 | `rule_runs` | Tenant | Sí | No | Historial de ejecución de reglas. |
| 16 | `custom_fields` | Tenant | Sí | Sí | Define campos runtime con enum canónico del PRD; usa JSONB `labels` traducible. |
| 17 | `email_templates` | Global/Tenant | Sí | Sí | Plantillas globales y overrides por Tenant. |
| 18 | `api_keys` | Tenant | Sí | Sí | Guarda `key_hash`; texto plano se muestra una sola vez. |
| 19 | `integrations` | Tenant | Sí | Sí | Credenciales cifradas por Tenant. |
| 20 | `webhooks` | Tenant | Sí | Sí | Webhooks outbound firmados. |
| 21 | `webhook_deliveries` | Tenant | Sí | No | Historial/retry de entregas; `attempted_at` obligatorio y `delivered_at` nullable. |
| 22 | `documents` | Tenant | Sí | Sí | Estado actual de documentos, plantillas y KB si aplica. |
| 23 | `document_versions` | Tenant | Sí | No | Snapshots append-only de `documents`; versionado solo para Documents. |
| 24 | `record_relationship_types` | Global/Tenant | Sí | Opcional | Catálogo de tipos de relación reutilizables por framework y apps derivadas. |
| 25 | `record_relationships` | Tenant | Sí | Sí | Aristas polimórficas entre registros de cualquier módulo. |
| 26 | `record_relationship_paths` | Tenant | Sí | No | Closure table derivada para ancestros, descendientes y profundidad. |
| 27 | `imports` | Tenant | Sí | Sí | Jobs de importación; Inngest para lotes grandes. |
| 28 | `exports` | Tenant | Sí | Sí | Jobs de exportación; links firmados con TTL. |
| 29 | `subscriptions` | Tenant/User | Sí | Sí | Suscripción por Tenant o User según `licensing_model`. |
| 30 | `statements` | Tenant | Sí | No | Consolidado financiero por ciclo. |
| 31 | `invoices` | Tenant | Sí | No | Registro contable inmutable; status `processed`, `voided`, `reversed`. |
| 32 | `files` | Tenant | Sí | Sí | Metadata de archivos en Supabase Storage; versionado por grupo de archivo. |
| 33 | `tags` | Tenant | Sí | Sí | Etiquetas planas por Tenant, sin jerarquía entre tags. |
| 34 | `taggables` | Tenant | Sí | No | Pivote polimórfico que registra dónde se usa cada tag. |
| 35 | `bookmarks` | Tenant/User | Sí | Sí | Favoritos por usuario y Tenant. |
| 36 | `filters` | Tenant/User | Sí | Sí | Filtros privados o compartidos. |
| 37 | `tasks` | Tenant | Sí | Sí | Módulo demostrativo canónico. |
| 38 | `consent_records` | Tenant/User | Sí | No | Registro legal auditable de consentimientos. |

---

## 4. Metadata Transversal

### 4.1 Campos de Mutación Base

Tablas de negocio mutables heredan:

| Campo | Tipo | Notas |
|-------|------|-------|
| `created_at` | `timestamptz` | Asignado server-side. |
| `updated_at` | `timestamptz` | Actualizado server-side. |
| `created_by` | `UUID FK auth.users` | Usuario creador cuando aplica. |
| `updated_by` | `UUID FK auth.users nullable` | Último usuario que modificó. |

### 4.2 Soft Delete y Restauración

Tablas de negocio con soft delete heredan:

| Campo | Tipo | Notas |
|-------|------|-------|
| `deleted_at` | `timestamptz nullable` | Marca soft delete. |
| `deleted_by` | `UUID FK auth.users nullable` | Usuario que ejecutó soft delete. |
| `restored_at` | `timestamptz nullable` | Última restauración del registro. |
| `restored_by` | `UUID FK auth.users nullable` | Usuario que ejecutó la última restauración. |

Al restaurar, `deleted_at` se limpia y `deleted_by` se conserva como evidencia histórica del borrado previo. La restauración se audita en `logs` con acción `restore`.

### 4.3 Origen e Importación

Tablas que pueden recibir registros por importación, API externa, migración o sincronización heredan:

| Campo | Tipo | Notas |
|-------|------|-------|
| `source_type` | `varchar(30)` | `manual`, `import`, `api`, `migration`, `system` o `external_sync`. Default `manual`. |
| `source_import_id` | `UUID FK imports nullable` | Job de importación que creó o actualizó el registro. |
| `imported_at` | `timestamptz nullable` | Timestamp de ingreso por importación. |
| `imported_by` | `UUID FK auth.users nullable` | Usuario que confirmó la importación. |
| `source_external_id` | `varchar(200) nullable` | Identificador externo del sistema origen cuando aplique. |
| `source_row_number` | `integer nullable` | Fila del archivo origen para trazabilidad y reportes de error. |
| `source_checksum` | `varchar(128) nullable` | Hash estable de la fila/payload origen para deduplicación e idempotencia. |

Los Server Actions deben validar que `source_import_id` pertenezca al mismo `tenant_id` del registro destino. En tablas globales, estos campos solo se agregan cuando exista una ruta de importación global explícita.

### 4.4 Conteos de Purga

Los conteos de registros eliminados físicamente no se almacenan en las filas purgadas. Deben quedar en:

| Ubicación | Uso |
|-----------|-----|
| `logs.metadata.records_processed` | Conteos por job, tabla, módulo y resultado. |
| `tenants.purge_log` | Evidencia final de purga completa de Tenant. |

### 4.5 Versionado

El historial de versiones se limita a:

| Recurso | Modelo |
|---------|--------|
| `documents` | `documents` guarda el estado actual y `document_versions` guarda snapshots append-only. |
| `files` | `files` guarda cada versión como fila independiente mediante `file_group_id`, `version`, `previous_version_id` e `is_current`. |

Tablas append-only (`logs`, `consent_records`, historiales de ejecución) no permiten UPDATE/DELETE de contenido histórico salvo procesos administrativos explícitos.

---

## 5. Grafo de Relaciones entre Registros

Las relaciones genealógicas y dependencias entre registros se modelan de forma genérica para que el framework y las aplicaciones derivadas puedan reutilizarlas sin crear tablas ad hoc por módulo.

### 5.1 `record_relationship_types`

Catálogo de tipos de relación.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `UUID` | PK. |
| `tenant_id` | `UUID FK tenants nullable` | `NULL` para tipos globales del framework; valor requerido para tipos propios de un Tenant. |
| `code` | `varchar(50)` | Código estable: `parent_of`, `depends_on`, `references`, `duplicates`, etc. |
| `name` | `varchar(100)` | Nombre administrativo. |
| `description` | `text` | Descripción del uso permitido. |
| `is_directed` | `boolean` | Default `true`. |
| `is_acyclic` | `boolean` | Default `true` para jerarquías y dependencias. |
| `inverse_code` | `varchar(50) nullable` | Código inverso para presentación si aplica. |
| `applies_to_entity_types` | `text[] nullable` | Lista de `module.code`; `NULL` permite cualquier módulo. |
| `is_active` | `boolean` | Default `true`. |

Unicidad requerida: tipos globales únicos por `code`; tipos tenant-scoped únicos por `(tenant_id, code)`.

### 5.2 `record_relationships`

Aristas explícitas entre registros.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `UUID` | PK. |
| `tenant_id` | `UUID FK tenants` | Tenant propietario de ambos extremos. |
| `relationship_type_id` | `UUID FK record_relationship_types` | Tipo de relación. |
| `source_entity_type` | `varchar(50)` | `module.code` del registro origen. |
| `source_entity_id` | `UUID` | ID del registro origen. |
| `target_entity_type` | `varchar(50)` | `module.code` del registro destino. |
| `target_entity_id` | `UUID` | ID del registro destino. |
| `metadata` | `JSONB` | Datos no indexables de presentación o contexto. |
| `effective_from` | `timestamptz nullable` | Inicio de vigencia si aplica. |
| `effective_to` | `timestamptz nullable` | Fin de vigencia si aplica. |

Hereda metadata de mutación base y soft delete. Se prohíben relaciones cross-tenant, autorreferencias exactas y ciclos cuando `record_relationship_types.is_acyclic = true`.

### 5.3 `record_relationship_paths`

Closure table derivada para consultas rápidas de ancestros, descendientes y profundidad.

| Campo | Tipo | Notas |
|-------|------|-------|
| `tenant_id` | `UUID FK tenants` | Tenant de la ruta. |
| `relationship_type_id` | `UUID FK record_relationship_types` | Tipo de relación. |
| `ancestor_entity_type` | `varchar(50)` | Módulo ancestro. |
| `ancestor_entity_id` | `UUID` | Registro ancestro. |
| `descendant_entity_type` | `varchar(50)` | Módulo descendiente. |
| `descendant_entity_id` | `UUID` | Registro descendiente. |
| `depth` | `integer` | `0` para self-path; `1` para relación directa. |
| `direct_relationship_id` | `UUID FK record_relationships nullable` | Arista directa cuando `depth = 1`. |
| `created_at` | `timestamptz` | Momento de materialización. |

Esta tabla es derivada y no usa soft delete. Las Server Actions o triggers transaccionales deben mantenerla sincronizada al crear, restaurar o eliminar relaciones.

---

## 6. Reglas RLS Base

| Tipo de tabla | Regla |
|---------------|-------|
| Tenant-scoped | `tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid` para sesiones interactivas. |
| M2M API Key | El middleware resuelve el `tenant_id` de `api_keys` y crea contexto equivalente para RLS. |
| Global | Solo Super Admin o procesos server-side autorizados. |
| Mixta global/tenant | Registros globales (`tenant_id IS NULL`) visibles según RBAC; registros con `tenant_id` filtrados por RLS. |
| Super Admin | Acceso cross-tenant controlado por RBAC y auditado en `logs`. |
| Relaciones de registros | `record_relationships` y `record_relationship_paths` solo exponen filas del `tenant_id` activo; los extremos deben pertenecer al mismo Tenant. |

---

## 7. Índices Mínimos Esperados

1. Toda tabla con `tenant_id`: índice por `tenant_id`.
2. Toda tabla con soft delete: índice compuesto `(tenant_id, deleted_at)` cuando aplique.
3. Toda FK crítica: índice dedicado.
4. Tablas de búsqueda: índices sobre campos usados por `search_fields`.
5. Tablas de auditoría/historial: índices por `tenant_id`, `created_at`, `entity_type`, `entity_id` y `auth_method`.
6. Tablas con unicidad por Tenant: constraints compuestos, por ejemplo `(tenant_id, code)`, `(tenant_id, slug)` o equivalente.
7. Metadata de origen: índices por `(tenant_id, source_import_id)` y `(tenant_id, source_external_id)` cuando el módulo soporte importación o sincronización externa.
8. Relaciones: índices por `(tenant_id, source_entity_type, source_entity_id)`, `(tenant_id, target_entity_type, target_entity_id)` y `(tenant_id, relationship_type_id, depth)`.
9. `files`: índice único parcial para una sola versión actual por `(tenant_id, file_group_id)` cuando `is_current = true`.
10. `document_versions`: índice único por `(tenant_id, document_id, version_number)`.
