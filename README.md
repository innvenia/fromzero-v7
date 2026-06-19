# From Zero Framework v7.4

Base reutilizable para construir aplicaciones SaaS/corporate multi-tenant con Next.js, Supabase, UI operacional, RBAC/RLS, billing, jobs y Core AI por adapters.

## Estado

- Metodologia: FromZero local del proyecto.
- Plan: aprobado.
- Sprint 5: completado localmente, factory/grid/relaciones y contratos shared.
- Codigo de aplicacion: shell UI base, DataGrid y health API implementados; handlers autenticados pendientes.
- Servicios externos: no activados.

## Requisitos

- Node.js compatible con `>=20.9.0`.
- npm compatible con `>=11.14.0`.
- Credenciales reales fuera del repositorio.

Versiones principales fijadas en `package.json`:

- Next.js `16.2.9`.
- React `19.2.7`.
- TypeScript `6.0.3`.
- Supabase JS `2.108.2`.
- Tailwind CSS `4.3.1`.
- Vitest `4.1.9`.
- Playwright `1.61.0`.

## Instalacion local

```powershell
npm install
```

## Verificacion base

```powershell
npm run check
```

## Desarrollo web

```powershell
npm run dev
```

Abrir `http://localhost:3000/es` para revisar la shell en español o `http://localhost:3000/en` para inglés.

## Variables de entorno

Usa `.env.example` como plantilla. No versionar `.env`, `.env.local` ni archivos `.env.*` con valores reales.

## Estructura inicial

- `src/app/`: routing Next.js App Router, sin logica pesada.
- `src/framework/`: base reusable del framework.
- `src/web/`: experiencia web construida sobre el framework.
- `core-ai/`: runtime independiente futuro para IA.
- `supabase/migrations/`: SQL versionado local, sin ejecucion cloud automatica.
- `docs/API_ENDPOINT_INVENTORY.md`: inventario de contratos API.
- `bootstrap.json`: genesis declarativa de un solo uso.

## Siguiente Sprint

Sprint 6 implementara billing, suscripciones, statements y PDF individual. Requiere aprobacion humana antes de cualquier integracion real de pagos.
