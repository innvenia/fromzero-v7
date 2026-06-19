# Test Plan - Sprint 7

Ruta de salida: `artifacts/test-plans/sprint-7.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Test Plan |
| Propósito o subtítulo | Plan de pruebas para storage, documentos y módulos shared |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-19 |
| Última actualización | 2026-06-19 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-19: creado al iniciar Sprint 7 por aprobación explícita del usuario |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-19 |
| Frase literal de aprobación | aprobar inicio sprint 7 |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md`, `artifacts/FROMZERO_PLAN.md`, `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas | `docs/PRD.md`, `docs/REFERENCE_MODULES.md`, `docs/REFERENCE_DATABASE_SCHEMA.md`, `docs/REFERENCE_THREAT_MODEL.md`, `artifacts/FROMZERO_PLAN.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_STATE.md`, `supabase/migrations/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Sin migraciones cloud. Sin purgas reales ejecutadas. |

## Unit

- File: validar MIME, tamaño, cuota tenant, path seguro, bucket y TTL de URL firmada.
- File: bloquear signed URL cross-tenant, registros soft-deleted y versiones no vigentes.
- File browser: construir árbol jerárquico desde registros `files` tenant-aware.
- Document: validar estados, slug, snapshots append-only y versionado incremental.
- Tag: validar color, scope tenant y vínculos polimórficos sin cross-tenant.
- Bookmark: validar scope por usuario/tenant y límite configurable.
- Consent: validar registro auditable y revocación append-only.
- API contracts: reservar `/api/v1/files`, `/api/v1/documents`, `/api/v1/tags`, `/api/v1/bookmarks` y `/api/v1/consent-records`.

## Integration

- Exports públicos desde `src/framework/modules/index.ts` para File, Document, Tag, Bookmark y Consent.
- Inventario API actualizado con contratos Sprint 7.
- Migración SQL versionada creada con Supabase CLI, no aplicada a cloud.

## RLS/RBAC

- SQL versionado debe crear `documents`, `document_versions`, `files`, `tags`, `taggables`, `bookmarks` y `consent_records`.
- Todas las tablas tenant-aware deben habilitar RLS.
- `anon` no tiene acceso a tablas Sprint 7.
- `authenticated` tiene grants explícitos revisables para lectura; escrituras sensibles quedan server-side/service role.
- `consent_records` y `document_versions` quedan append-only.

## Playwright

- No aplica en Sprint 7 porque no se agrega ruta web final.
- Storage browser queda como lógica base verificable por unit tests.

## Visual

- No aplica en Sprint 7. No se agrega pantalla renderizable nueva.

## k6

- No aplica en Sprint 7. Carga de storage y APIs críticas queda para Sprint 11/staging.

## Limitaciones

- No se aplica `supabase db reset`.
- No se ejecutan migraciones contra Supabase cloud.
- `npx supabase migration list --local` no conecta porque Supabase local no está levantado en `127.0.0.1:54322`.
- No se generan signed URLs reales contra Supabase Storage.
- No se ejecuta purga real de soft-deletes.
