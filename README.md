# From Zero Framework v7.4

Base reutilizable para construir aplicaciones SaaS/corporate multi-tenant con Next.js, Supabase, UI operacional, RBAC/RLS, billing, jobs y Core AI por adapters.

## Estado

- Metodologia: FromZero local del proyecto.
- Plan: aprobado.
- Sprint 9: cerrado validado en Supabase Cloud dev; OpenRouter real sigue diferido.
- Codigo de aplicacion: shell UI base, DataGrid, health API, contratos core y Core AI interno implementados; handlers autenticados pendientes.
- Servicios externos: no activados; OpenRouter real requiere aprobacion separada.

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

Para preparar Codex con variables locales:

```powershell
node .codex/plugins/fromzero/tools/load-env-local.mjs --setup codex
.\scripts\sync-codex-env.ps1 -EnvFile .env.local -Target User
```

El flujo no imprime valores. Reinicia Codex para que herede las variables actualizadas.

## Estructura inicial

- `src/app/`: routing Next.js App Router, sin logica pesada.
- `src/framework/`: base reusable del framework.
- `src/web/`: experiencia web construida sobre el framework.
- `core-ai/`: runtime independiente futuro para IA.
- `core-ai/core_ai/`: servicio FastAPI/Pydantic v2 para ejecucion IA interna.
- `supabase/migrations/`: SQL versionado; Sprint 9 aplicado en cloud dev con RLS validada.
- `docs/API_ENDPOINT_INVENTORY.md`: inventario de contratos API.
- `bootstrap.json`: genesis declarativa de un solo uso.

## Core AI

```powershell
python -m pytest core-ai/tests
```

El modo por defecto es mock. Completar `OPENROUTER_API_KEY`, `CORE_AI_SECRET` y cambiar `CORE_AI_PROVIDER_MODE` solo con aprobacion de activacion real.

## Siguiente Sprint

Sprint 10 implementa el modulo Task, superficies publicas y documentacion demo. Proveedores reales, secretos reales y nuevas migraciones cloud requieren aprobacion separada.
