# From Zero Framework v7.4

Base reutilizable para construir aplicaciones SaaS/corporate multi-tenant con Next.js, Supabase, UI operacional, RBAC/RLS, billing, jobs y Core AI por adapters.

## Estado

- Metodologia: FromZero local del proyecto.
- Plan: aprobado.
- Sprint 1: completado, preparacion y base inicial.
- Codigo de aplicacion: no implementado todavia.
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

## Variables de entorno

Usa `.env.example` como plantilla. No versionar `.env`, `.env.local` ni archivos `.env.*` con valores reales.

## Estructura inicial

- `src/app/`: routing Next.js App Router, sin logica pesada.
- `src/framework/`: base reusable del framework.
- `src/web/`: experiencia web construida sobre el framework.
- `core-ai/`: runtime independiente futuro para IA.
- `supabase/migrations/`: SQL versionado futuro.
- `docs/API_ENDPOINT_INVENTORY.md`: inventario inicial de contratos API.

## Siguiente Sprint

Sprint 2 creara la base web y UI shell. Hasta entonces no hay paginas Next.js funcionales ni endpoints implementados.
