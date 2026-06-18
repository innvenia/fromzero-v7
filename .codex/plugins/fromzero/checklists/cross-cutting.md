# Checklist de transversales

Objetivo: que ninguna capacidad transversal del insumo se pierda entre artefactos.

## Como usarlo

1. En contexto: enumerar en `artifacts/FROMZERO_CONTEXT.md` todas las capacidades del insumo,
   tanto módulos como transversales (navegación, búsqueda global, command palette,
   redirecciones post-login, dashboards, theming, atajos, páginas 404/500,
   mantenimiento, coming soon, notificaciones, papeleria/restauración, file browser,
   ayuda, páginas públicas, onboarding/wizards, contratos mobile/API, consentimiento,
   jobs programados, exportaciones, auditoría, i18n, accesibilidad, observabilidad,
   seguridad y escalabilidad por módulo, tablas, pivotes, historiales y las que el
   insumo defina).
2. En spec: cada capacidad enumerada tiene fila en la matriz de cobertura con estado
   cubierto, diferido con razón o excluido con razón.
3. En plan: cada capacidad cubierta tiene Sprint dueño, archivos objetivo,
   pruebas/comandos, gates y criterio verificable; cada diferida aparece en la lista
   de diferidos con fuente documental y condición de activación.
4. Si una capacidad transversal crítica aparece en `docs/PRD.md` o referencias
   canónicas y no está en la spec, corregir la spec antes de aprobar el plan.
5. Descomponer a requisito atomico cualquier heading funcional, subheading, bullet
   obligatorio o fila de tabla de fuentes prioritarias. No agrupar listas internas
   bajo una sola fila como "auth", "storage", "billing" o "grid".
6. Extraer invariantes y gates desde reglas no funcionales: orden obligatorio,
   datos reales, nomenclatura, perímetro de servicios internos, dependencias,
   inventario API, performance budgets, limpieza de marca de plantillas y
   consentimientos auditables.

## Dominios que requieren revisión atomica

Si el insumo menciona uno de estos dominios, cada subrequisito obligatorio debe
tener ID, fuente, heading, obligación, Sprint dueño, archivos, pruebas, gate y
criterio verificable:

- `auth-session`: login, registro, invitaciones, verificación, reset password,
  logout, sesiones, timeouts, intentos máximos, revocaciones, MFA, backup codes,
  account switcher, claims, políticas de contraseña, OAuth opcional, estados de
  usuario/tenant, último admin, derecho al olvido y cleanup.
- `storage-files`: buckets, paths, CORS, CSP, Content-Disposition, bloqueo de
  ejecución HTML/JS, WebP/SVG, presigned URL flow, TTL, RBAC, MIME, tamaño, cuota,
  registro en `files`, puntos de carga, FileUploader, versionado, historial y cleanup.
- `billing-subscriptions`: `billing_enabled`, sidebar/rutas, features JSONB,
  `checkPlanFeature`, Server Actions, indicadores de limites, modelos de cobro,
  subscription automática, estados, transitions, trials, grace period, expiry
  action, freemium, retención, statements, worker, invoices, PDF, checkout,
  webhooks, refunds y pruebas.
- `ui-primitives-overlays`: modal, confirmación destructiva, drawer, toast, Escape,
  cerrar/cancelar/click overlay, breadcrumbs, páginas 404/500/mantenimiento/coming
  soon, request_id, APM/logs, responsive y pruebas visuales.
- `theme-branding`: `settings.config.branding`, `bootstrap.json`, hardcoded
  fallback, SSR CSS variables, Tailwind `@theme`, FOUC, escala 50-900, contraste,
  logos, fallback chain, `useBranding`, branding global/tenant, storage y tokens.
- `grid-module-factory`: header, action bar RBAC-aware, Create/Import/Export/Delete,
  refresh, papelera, filtros, paginación, total count, smart selection, columnas,
  ordenamiento, page size, preferencias, renderizadores, Card View mobile, tabs
  Grid/Search/Import/Export/Automatizaciones y validación de campos.
- `custom-fields`: tipos permitidos, JSONB, sin ALTER TABLE, limite de tamaño,
  validación, formulario, grid, filtros, soft-delete de definición, RLS y abuso.
- `event-bus-rules`: eventos post-CRUD, triggers, acciones, `trigger_job`,
  `event_bus_enabled`, builder visual, loop guard, retries, rate/abuse y `rule_runs`.
- `notifications`: `createNotification`, fuentes, header bell, badge, dropdown,
  grids, detalle, read/archive, delivery_status, canales, validaciones, preferencias,
  canal in-app obligatorio, modales criticos, toasts y permisos.
- `import-export`: wizard, formatos, auto-mapping, async, métricas, historial,
  export CSV/XLSX/JSON/PDF, TTL, tenant branding, notificación, RBAC y pruebas.
- `api-errors-security`: `/api/v1/*`, métodos rechazados, contrato de error,
  codigos base, 500 seguro, `request_id`, DTOs, mass assignment, SQL parametrizado,
  rate limits, datos dummy, logs seguros, `service_role` y pruebas BOLA/IDOR.

## Invariantes y gates que requieren revisión

Si el insumo menciona una regla de este tipo, no la dejes como nota implícita:

- `bootstrap-order`: orden settings -> modules -> plans -> tenants -> profiles ->
  users -> resto de módulos, logs creados antes de operaciones auditables y prueba
  de orden como `pnpm test -- bootstrap-order` o equivalente.
- `real-data-only`: ningún menú, registro, grid, dashboard, selector o dato visible
  en producción sale de arrays hardcodeados, placeholders productivos o mocks;
  mocks solo en tests, fixtures o sandbox explícito.
- `naming-dual-standard`: código y datos usan nombres técnicos canónicos; UI usa
  Account/Cuenta solo vía i18n. Tablas en plural inglés, rutas/slugs singular
  inglés e i18n inglés `snake_case`.
- `internal-service-boundary`: Core AI o servicios internos usan puerto no público,
  reverse proxy por ruta interna, header secreto, config review y trazabilidad
  `tenant_id`/`user_id` cuando aplique.
- `dependency-security`: Dependabot/Renovate, advisories, lockfiles y bloqueo de
  vulnerabilidades críticas/altas salvo excepción documentada.
- `api-inventory`: `docs/API_ENDPOINT_INVENTORY.md` o equivalente lista endpoint,
  versión, método, owner, auth, scopes/RBAC, tenant context, rate limit y payload.
- `performance-budget`: FCP, LCP, API p95, Lighthouse u otros KPI numéricos tienen
  valor exacto, comando y política de excepción.
- `template-brand-sanitization`: UI, emails, documentos, meta tags y assets visibles
  no muestran marcas, logos ni referencias de templates/boilerplates externos.
- `consent-records`: consentimiento auditable con `user_id`, `consent_type`,
  `accepted_at`, `ip_address`, `document_id`, `revoked_at` y versión legal desde
  bootstrap/configuración cuando aplique.

## Verificación

- [ ] El inventario de capacidades de `artifacts/FROMZERO_CONTEXT.md` existe y es enumerable.
- [ ] El inventario atomico existe y no resume listas internas como una sola capacidad.
- [ ] El inventario de invariantes/gates existe y no deja reglas bloqueantes implícitas.
- [ ] Las fuentes prioritarias de `docs/` fueron leídas o su limitación quedó documentada.
- [ ] Ninguna capacidad del inventario falta en la matriz de cobertura de la spec.
- [ ] Ningún requisito atomico obligatorio falta en la matriz de cobertura atomica.
- [ ] Ninguna capacidad cubierta queda sin Sprint dueño, archivos, pruebas y gates en el plan.
- [ ] Ningún requisito atomico cubierto queda sin Sprint dueño, archivos, pruebas, gates y criterio verificable.
- [ ] Ningún invariante/gate cubierto queda sin Sprint dueño, archivos, comando/gate y criterio bloqueante.
- [ ] Las capacidades transversales críticas del PRD tienen trazabilidad propia, no solo cobertura macro por módulo.
- [ ] Tablas, jobs, APIs, páginas de infraestructura y requisitos security/scale documentados tienen dueño o diferido justificado.
- [ ] Los diferidos viven en una sola lista canónica (spec), no dispersos.
