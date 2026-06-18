# Estructura de Referencia - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.0.0
> **Última actualización:** 2026-06-06
> **Fuente de verdad:** [`PRD.md`](./PRD.md)
> **Propósito:** Definir la anatomía física del proyecto, garantizando la separación nítida entre el **código del framework (la base reutilizable)** y el **código de la aplicación (lo que se construye sobre la base)**.
> **Alcance:** Documentación de producto y estructura objetivo del framework.

---

## 1. Principio Rector: Router, Framework y Superficies

From Zero distingue físicamente el router de Next.js, el framework reusable y las superficies de producto que se construyen encima.

| Capa | Qué es | Ubicación | Mutabilidad |
|:-----|:-------|:----------|:------------|
| **Framework (La Base)** | El motor reutilizable: auth, multi-tenancy, RBAC, billing, módulos de sistema, UI compartida. | `src/framework/` | Inmutable por la app final. |
| **Aplicación Web** | La lógica de negocio web específica que se monta sobre la base (CRM, ERP, etc.). | `src/web/` | Desarrollo activo. |
| **Aplicación Mobile (Futura)** | Superficie móvil futura. No forma parte del MVP web actual. | `mobile/` (futuro) | Posterior al MVP web. |
| **Core AI** | Componente de inteligencia artificial (RAG, embeddings, inferencia). Runtime independiente. | `core-ai/` | Servicio separado. |

Esta separación se refuerza con **path aliases** (`@fw/*` y `@web/*`), de modo que cualquier dependencia cruzada sea visible y auditable.

---

## 2. Diagrama de Estructura

El proyecto sigue un enfoque **Next.js + Supabase** como stack principal. La lógica de aplicación y la API de negocio se implementan en **Node.js/TypeScript** (Server Actions, API Routes). **Python** se usa exclusivamente para el servicio **Core AI** como runtime independiente. La fuente canónica del stack y versiones es [`REFERENCE_STACK.md`](./REFERENCE_STACK.md).

```text
/ (Workspace Root)
├── .agent/                        # Configuración del entorno de desarrollo
├── docs/                          # Documentación del producto
│
├── _reference/                    # Material visual de referencia (read-only, archivado)
│
├── src/                           # ═══ APLICACIÓN NEXT.JS ═══
│   │
│   ├── app/                       # [ROUTING] Capa fina - solo rutas
│   │   ├── [locale]/              #   Segmento i18n
│   │   │   ├── (public)/          #     Rutas públicas: landing, pricing, docs, portales públicos
│   │   │   ├── (auth)/            #     Auth: login, signup, recovery, 2FA
│   │   │   └── (protected)/       #     Rutas protegidas: dashboard, settings, módulos
│   │   │       ├── layout.tsx
│   │   │       ├── dashboard/
│   │   │       ├── settings/
│   │   │       └── [...slug]/     #     Catch-all dinámico (módulos framework y web)
│   │   ├── api/                   #   REST API Routes
│   │   └── globals.css            #   Theme tokens, Tailwind v4
│   │
│   ├── framework/                 # ═══ LA BASE (no se modifica por la app) ═══
│   │   ├── services/              #   Lógica server-only
│   │   │   ├── auth/              #     Supabase Auth, middleware
│   │   │   ├── rbac/              #     Evaluador de permisos
│   │   │   ├── audit/             #     Interceptor transversal
│   │   │   ├── events/           #     Event Bus
│   │   │   ├── storage/          #     Upload engine
│   │   │   └── .../              #     (search, mailer, payments)
│   │   ├── modules/               #   Módulos de sistema (Triada: Tabla + Form + Grid)
│   │   │   ├── settings/  ├── tenant/  ├── user/  ├── log/  ├── file/  └── ...
│   │   ├── ui/                    #   Design System propietario (compartido)
│   │   │   ├── components/  ├── grid/  ├── forms/  └── layout/
│   │   ├── lib/                   #   Utilidades puras (incl. formatters.ts)
│   │   │   └── supabase/          #     Client factory
│   │   ├── ai/                    #   Bridge → Core AI (Python)
│   │   ├── types/                 #   Tipos globales
│   │   └── i18n/                  #   Traducciones base (common, layout, validation)
│   │
│   └── web/                       # ═══ APLICACIÓN WEB (código específico) ═══
│       ├── public/                #   Código web para superficies públicas
│       ├── protected/             #   Código web para superficies autenticadas
│       ├── modules/               #   Módulos de negocio
│       │   ├── task/              #     Módulo demostrativo (PRD Grupo D)
│       │   └── [custom]/          #     Módulos creados por el usuario
│       ├── registry.ts            #   Registro de formularios manuales por module_code
│       ├── components/            #   Componentes propios de la app
│       ├── hooks/                 #   Hooks específicos
│       └── i18n/                  #   Traducciones de la app
│
├── core-ai/                       # ═══ COMPONENTE IA (Python, runtime independiente) ═══
│   ├── app/                       #   FastAPI, routers, models
│   └── requirements.txt
│
├── public/                        # Assets estáticos
├── supabase/                      # Base de datos
│   ├── migrations/                #   Migraciones SQL versionadas
│   └── bootstrap.sql
│
├── scripts/                       # Scripts operacionales
│   ├── start-local.ps1  ├── stop-local.ps1  └── hard-reset.ps1
│
├── tests/                         # Tests E2E (Playwright)
├── .env                           # Variables de producción local, generado y no versionado
├── .env.local                     # Variables de desarrollo local, generado y no versionado
├── .env.example                   # Plantilla de variables de entorno
├── bootstrap.json                      # Bootstrap de carga inicial (→ hidrata la BD)
├── package.json  ├── next.config.ts  ├── tsconfig.json
└── README.md
```

---

## 3. Detalle de Directorios

### A. `/src/` (Aplicación Next.js)
> **Tecnología:** Next.js + React + Tailwind v4

Estructura "feature-first" que separa la infraestructura del producto:

- `/src/app/`: Exclusivo para routing (App Router). Capa fina, sin lógica pesada.
- `/src/framework/`: **La base.** Provee UI compartida, auth, billing y módulos de sistema. Nunca se modifica por requerimientos de la app final.
- `/src/web/`: **La aplicación web.** Aquí vive el código único de la experiencia web construida sobre el framework (ej. CRM, ERP, portal público, dashboard protegido).

**Anatomía estándar de un módulo (`modules/[name]/`):** carpeta autocontenida.
```
modules/task/
├── TaskForm.tsx          # Formulario manual (TSX específico por módulo)
├── actions.ts            # Server Actions (validadas con Zod)
├── queries.ts            # Data fetching
├── schema.ts             # Schemas Zod (cliente/servidor)
├── types.ts              # Interfaces TypeScript
├── hooks.ts              # Hooks específicos (opcional)
└── i18n/                 # Traducciones del módulo
```

**Registro de formularios manuales (`src/web/registry.ts`):** los formularios no se autogeneran desde la BD. Se co-diseñan por módulo y se conectan al routing dinámico mediante un registro explícito:

```ts
export const webForms = {
  task: () => import("./modules/task/TaskForm"),
  // nuevos módulos se agregan aquí
};
```

El catch-all dinámico del framework resuelve el `module_code`, consulta este registro y carga el formulario correspondiente sin modificar `src/framework/`.

**Path aliases (`tsconfig.json`):** hacen visibles las dependencias cruzadas.
- `@fw/*` → `src/framework/*`
- `@web/*` → `src/web/*`
- `@/*` → `src/*`

### B. `/core-ai/` (Componente IA - Python)
> **Tecnología:** Python (FastAPI + Pydantic v2)

- **Propósito:** Runtime independiente para procesamiento de IA (RAG, embeddings, inferencia LLM).
- **Alcance:** Solo IA. Toda la lógica de negocio y la API CRUD es Node.js/TypeScript.
- **Comunicación:** Invocado desde Server Actions a través del bridge en `src/framework/ai/`.

### C. `/supabase/` (Base de Datos)
> **Tecnología:** PostgreSQL (Supabase)

- `migrations/`: Migraciones SQL versionadas.
- La configuración vive en la BD (tablas `settings` y `modules`), no en archivos JSON estáticos en runtime. El `bootstrap.json` solo actúa como bootstrap de carga inicial.

---

## 4. Archivos Globales Críticos

| Archivo | Propósito |
|:--------|:----------|
| `README.md` | Manual: prerrequisitos, instalación, arranque |
| `bootstrap.json` | Bootstrap inicial del framework: modo, Tenant Zero, Super Admin y defaults mínimos que hidratan la BD |
| `.env` | Variables de producción local. Generado por proyecto, no versionado |
| `.env.local` | Variables de desarrollo local. Generado por proyecto, no versionado |
| `.env.example` | Misma estructura que `.env` y `.env.local`, con placeholders seguros versionados |
| `.gitignore` | Excluir: `node_modules`, `.env`, `.env.local`, `.env.*`, `__pycache__`, `.next`, archivos de SO; permitir `!.env.example` |
| `CHANGELOG.md` | Bitácora de cambios (Keep a Changelog) |
| `start-local.ps1` / `stop-local.ps1` / `hard-reset.ps1` | Scripts operacionales |

### Convención de Variables de Entorno

Todo proyecto generado debe crear tres archivos de variables con exactamente la misma estructura y las mismas claves.

| Archivo | Propósito | En `.gitignore` | Versionado |
|:--------|:----------|:----------------|:-----------|
| `.env` | Valores reales para ejecución de producción/local según despliegue | Sí | No |
| `.env.local` | Valores reales para desarrollo local | Sí | No |
| `.env.example` | Placeholders seguros y documentación de variables | No | Sí |

Los agentes y procesos automatizados no deben leer, imprimir, copiar ni inferir valores reales desde `.env` o `.env.local`. Cualquier variable requerida se documenta en `.env.example` con placeholder seguro.

---

## 5. Estructura i18n

Namespaces JSON divididos por locale, co-localizados en el framework o en la aplicación:

```text
src/
├── framework/i18n/
│   ├── es/ { common.json, layout.json, validation.json }
│   └── en/ { ... }
└── web/i18n/
    ├── es/ { [app-module].json }
    └── en/ { ... }
```

- **Framework namespaces** (siempre cargados): `common`, `layout`, `validation`.
- **Módulos:** carpeta `i18n/` co-localizada en `modules/[name]/i18n/`.
- **Type-Safe keys:** la compilación falla si falta una key.

---

## 6. Convenciones de Enrutamiento (Next.js App Router)

Se usan Route Groups (carpetas entre paréntesis) para aplicar diferentes layouts sin afectar la URL. `src/app` solo enruta; el código de experiencia vive en `src/web`.

| Route Group | Uso |
|---|---|
| `(public)` | Rutas no protegidas: landing, pricing, documentación pública, portal público, páginas compartibles. |
| `(auth)` | Autenticación: login, registro, recuperación, MFA. |
| `(protected)` | Aplicación autenticada: dashboard, settings, módulos, grids, formularios. |

- **Catch-all dinámico:** Debe vivir dentro de `(protected)` para evitar interceptar rutas públicas o de autenticación.
- **Prohibición de prefijos numéricos:** nombres como `(0-full-width-pages)` causan error TS1434. NUNCA nombrar un Route Group comenzando con un dígito.

---

## 7. Referencias Cruzadas

| Documento | Contenido |
|:----------|:----------|
| [`PRD.md`](./PRD.md) | Especificaciones funcionales (Fuente de Verdad) |
| [`REFERENCE_ARCHITECTURE.md`](./REFERENCE_ARCHITECTURE.md) | Arquitectura lógica, capas y patrones |
| [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md) | Especificación técnica de los 27 módulos |
| [`REFERENCE_DESIGN_SYSTEM.md`](./REFERENCE_DESIGN_SYSTEM.md) | Design System activo |
| [`BOOTSTRAP_REFERENCE.md`](./BOOTSTRAP_REFERENCE.md) | Bootstrap inicial del framework |
| [`REFERENCE_STACK.md`](./REFERENCE_STACK.md) | Stack, versiones, herramientas y conectores |
| [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md) | Seguridad verificable y controles anti-abuso |
| [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md) | Dependencias por fase/módulo y criterios de aceptación |
