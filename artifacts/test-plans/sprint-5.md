# Test Plan - Sprint 5

Ruta de salida: `artifacts/test-plans/sprint-5.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Test Plan |
| Propósito o subtítulo | Plan de pruebas para Module Factory, Grid Universal y relaciones |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-19 |
| Última actualización | 2026-06-19 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-19: creado al iniciar Sprint 5 por aprobación explícita del usuario |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-19 |
| Frase literal de aprobación | apruebo ejecución de sprint 5. |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas | `docs/REFERENCE_MODULES.md`, `docs/PRD.md`, `docs/REFERENCE_ARCHITECTURE.md`, `artifacts/adr/002-api-module-contracts.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `artifacts/handoffs/` |
| Commit asociado | `f7b3b86 feat(factory): add module factory grid contracts` |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Sin migraciones cloud. |

## Unit

- Factory: validar contrato de módulo CRUD, allowlist de módulos, permisos requeridos y configuración de queries con límite obligatorio.
- Grid: validar cascada de configuración, límites de página, columnas visibles, acciones permitidas por RBAC y rechazo de queries sin límite.
- Custom fields: validar tipos permitidos, `field_name` en snake_case, opciones requeridas para `select`/`multi-select`, defaults por tipo y límite por módulo.
- Filters: validar ownership, visibilidad privada/compartida, módulo permitido, sort permitido y columnas visibles contra columnas del grid.
- Relationships: validar extremos dentro del mismo tenant, módulos permitidos, tipos aplicables y bloqueo de ciclos cuando el tipo es acíclico.

## Integration

- Contratos API reservados para `custom-fields`, `filters` y `relationships` en `/api/v1/*`.
- Exports públicos desde `src/framework/index.ts` y `src/framework/modules/index.ts`.

## RLS/RBAC

- RBAC se representa como acciones estándar (`view`, `create`, `update`, `delete`, `import`, `export`, `notify`).
- Factory y Grid solo exponen acciones autorizadas.
- Relationships rechaza extremos cross-tenant a nivel de contrato.
- Filters privados quedan limitados al usuario propietario; filtros compartidos al tenant.

## Playwright

- Renderizar una tabla representativa en dashboard.
- Verificar encabezados, filas, estado de paginación y controles visibles sin solapamiento básico.

## Visual

- Revisar grid en 375, 768 y 1920 mediante Playwright o navegador disponible.
- Confirmar tabla desktop y cards mobile si el componente se monta en UI.
- Registrar fallback si no hay inspección visual interactiva disponible.

## k6

- No aplica en Sprint 5. La prueba de carga queda diferida a Sprint 11 según el plan aprobado.

## Limitaciones

- No se aplican migraciones reales en Supabase.
- No se conectan servicios cloud ni MCP.
- Las queries quedan como contratos/guards TypeScript; la ejecución DB real se validará cuando existan Server Actions/API Routes concretas.
