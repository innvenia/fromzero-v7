# ADR

Ruta de salida: `artifacts/adr/001-data-auth-rls-rbac.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | ADR |
| Propósito o subtítulo | Datos, tenant context, RLS y RBAC |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | borrador |
| Historial de estados | 2026-06-18: creado desde Spec aprobada para alimentar el Plan |
| Aprobación del usuario | pendiente |
| Fecha de aprobación | pendiente |
| Frase literal de aprobación | pendiente |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado como base |
| Documentos o fuentes asociadas | `docs/REFERENCE_DATABASE_SCHEMA.md`, `docs/REFERENCE_ARCHITECTURE.md`, `docs/SECURITY_ASSURANCE.md`, `docs/BOOTSTRAP_REFERENCE.md`, `artifacts/FROMZERO_SPEC.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `supabase/migrations/`, `src/framework/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se ejecutaron migraciones. |

## Decisión

Usar Supabase PostgreSQL como base principal, con SQL versionado, RLS obligatorio en toda tabla tenant-aware, RBAC server-side y `tenant_id` derivado de contexto seguro emitido por backend.

El cliente puede expresar preferencia de tenant activo, pero no puede imponer autoridad de tenant mediante header, query param, body ni estado local. El backend debe validar membresía, tenant activo, rol, permisos, ownership y políticas RLS antes de leer o mutar datos.

## Contexto

La Spec exige SaaS multi-tenant, default `allow_multi_tenant_users = false`, Tenant Zero, Super Admin inicial, perfiles/roles/permisos, auditoría y aislamiento cross-tenant. La documentación también exige `src/app`, `src/framework`, `src/web`, `core-ai` y `supabase` como árbol de código futuro, sin modificarlo en esta fase.

## Opciones

| Opción | Resultado |
|---|---|
| RLS + RBAC server-side | Elegida. Reduce riesgo BOLA/IDOR y alinea Spec. |
| Solo RBAC en aplicación | Rechazada. Un error de API puede filtrar datos cross-tenant. |
| Multi-tenant users ON por defecto | Rechazada. Contradice Q009/D009 aprobados. |

## Tradeoffs

- Mayor trabajo inicial en migraciones, policies y tests RLS.
- Menor riesgo de fuga cross-tenant y menor acoplamiento a UI.
- Requiere fixtures y tests de pertenencia por tenant desde Sprint temprano.

## Impacto seguridad

- RLS es control obligatorio, no defensa opcional.
- Service role queda limitado a backend seguro, jobs y bootstrap.
- API keys usan hash, scopes por tenant/modulo/accion y expiración opcional recomendada.
- Mutaciones críticas registran auditoría append-only.

## Impacto escalabilidad

- Tablas tenant-aware requieren índices por `tenant_id`, foreign keys y columnas de filtro frecuente.
- Soft delete requiere índices parciales donde aplique.
- Queries críticas deben tener presupuesto de p95 y pruebas de carga antes de release candidate.

## Resultado

El Plan debe crear primero estructura, migraciones base, bootstrap, settings/modules/plans y tests RLS antes de módulos dependientes. Ningún Sprint puede considerar cerrado un flujo tenant-aware sin prueba cross-tenant negativa.
