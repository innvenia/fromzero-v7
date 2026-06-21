# ADR

Ruta de salida: `artifacts/adr/002-api-module-contracts.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | ADR |
| Propósito o subtítulo | Contratos API, módulos y DTOs |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-21 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: creado desde Spec aprobada para alimentar el Plan; 2026-06-21: aprobado por ejecución Fase 1 con handler privado de referencia |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-21 |
| Frase literal de aprobación | PLEASE IMPLEMENT THIS PLAN |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado como base |
| Documentos o fuentes asociadas | `docs/REFERENCE_ARCHITECTURE.md`, `docs/REFERENCE_MODULES.md`, `docs/REFERENCE_STRUCTURE.md`, `artifacts/FROMZERO_SPEC.md` |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `docs/API_ENDPOINT_INVENTORY.md`, `src/app/api/v1/`, `src/framework/` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. Todo endpoint `implemented:true` requiere `route.ts` real. |

## Decisión

Publicar contratos REST versionados bajo `/api/v1/*` para superficies externas y usar Server Actions solo para mutaciones internas controladas por UI. Todo endpoint debe existir primero en `docs/API_ENDPOINT_INVENTORY.md`, tener DTO explícito, validación Zod o Pydantic, auth declarada, tenant context seguro, RBAC, rate limit, error contract y auditoría si muta estado.

Actualización 2026-06-21: `implemented:true` solo es válido si existe `route.ts` real. `GET /api/v1/settings` queda como handler privado de referencia con auth Supabase server-side, tenant context desde `app_metadata`, RBAC, rate-limit contract, Zod, errores seguros y auditoría. Los 28 endpoints restantes siguen como deuda priorizada mientras no tengan route real.

## Contexto

La Spec cubre Module Factory, Grid Universal, API versionada, scopes de API key, import/export, webhooks, módulos core y módulos shared. La planificación debe evitar endpoints improvisados sin contrato.

## Opciones

| Opción | Resultado |
|---|---|
| REST `/api/v1/*` + Server Actions internas | Elegida. Expone contrato estable y preserva ergonomía Next.js. |
| Solo Server Actions | Rechazada. No cubre mobile/API-ready ni M2M. |
| REST no versionado | Rechazada. Incumple GATE-012. |

## Tradeoffs

- Más documentación inicial por endpoint.
- Menor deuda de compatibilidad para apps derivadas y clientes API.
- Obliga a diseñar inventario API antes de construir.

## Impacto seguridad

- DTOs no exponen columnas sensibles ni metadatos internos innecesarios.
- API keys se autorizan por tenant, modulo y accion.
- Webhooks entrantes y salientes requieren firma HMAC, timestamp y anti-replay.
- Errores son seguros, sin stack traces ni secretos.

## Impacto escalabilidad

- Endpoints listables y filtrables deben declarar paginación, límites e índices.
- Grid Universal no debe inducir queries sin límite.
- Import/export y procesos largos pasan por jobs con historial y evidencia.

## Resultado

El Plan debe incluir inventario API temprano, módulo factory/grid antes de módulos masivos, y pruebas contractuales para REST, Server Actions, DTOs, errores, rate limits y scopes.
