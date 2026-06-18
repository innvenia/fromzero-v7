# From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-06
> **Fuente de verdad:** [`PRD.md`](./PRD.md)
> **Propósito:** Presentar la visión general, arquitectura base, arranque rápido y mapa de documentación.

> Una base estructurada, segura y escalable para crear aplicaciones SaaS multi-tenant de calidad profesional.

---

## ¿Qué es esto?

**From Zero Framework** es el **cimiento técnico** sobre el cual se construyen aplicaciones SaaS. **No es una aplicación final**, sino una base reutilizable que entrega, ya resueltos e integrados:

1. **Multi-tenancy** con aislamiento de datos por Row Level Security (RLS).
2. **Autenticación** y gestión de sesiones (Supabase Auth).
3. **RBAC dinámico** (7 acciones × N módulos).
4. **Facturación** y Feature Gating mediante adapter de pagos configurable.
5. **27 módulos enterprise-grade** pre-construidos (Zero Boilerplate).
6. **Internacionalización, auditoría, import/export y custom fields** transversales.

El objetivo: que el esfuerzo de desarrollo se concentre en la lógica de negocio única de cada producto, no en reconstruir la infraestructura común.

---

## Arquitectura: Base vs. Aplicación

From Zero separa físicamente dos cuerpos de código:

```
┌──────────────────────────────────────────────┐
│  src/framework/   →  LA BASE                  │
│  El motor reutilizable: auth, multi-tenancy,  │
│  RBAC, billing, módulos de sistema, UI.       │
│  (Inmutable por la app final)                 │
├──────────────────────────────────────────────┤
│  src/web/         →  APLICACIÓN WEB           │
│  La lógica de negocio específica que se monta │
│  sobre la base (CRM, ERP, etc.).              │
├──────────────────────────────────────────────┤
│  core-ai/         →  COMPONENTE IA            │
│  Servicio Python (FastAPI) independiente.     │
└──────────────────────────────────────────────┘
```

La separación se refuerza con path aliases: `@fw/*` (framework) y `@web/*` (aplicación web).

---

## Module Factory: Bootstrap → Base de Datos

From Zero opera bajo un modelo **bootstrap-a-base-de-datos**:

```
bootstrap.json (bootstrap)  →  Inicialización  →  Tablas (settings, modules)  →  Runtime (la BD gobierna)
```

Los parámetros nacen en un bootstrap declarativo (`bootstrap.json`) y se vuelcan a la base de datos durante la inicialización. En runtime, la configuración de los módulos se lee de la tabla `modules`: **la base de datos es la fuente de verdad**.

---

## Los 27 Módulos

| Bloque | Módulos |
|:-------|:--------|
| **A - Administración** | settings, module, plan, ai-model, log, profile |
| **B - Cuentas (Tenant)** | tenant, user, invitation, notification, rule, custom-field, email-template, api-key, integration, webhook, document, import, export, subscription, statement, invoice |
| **C - Comunes** | file, tag, bookmark, filter |
| **D - Demostrativo** | task |

Detalle técnico: [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md).

---

## Stack Tecnológico

La referencia canónica de stack, versiones, herramientas y conectores está en [`REFERENCE_STACK.md`](./REFERENCE_STACK.md).

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js (App Router, RSC, Server Actions) |
| UI | React + Tailwind CSS v4 + shadcn/ui (Design System propietario) |
| Lenguaje | TypeScript (estricto) |
| Auth | Supabase Auth |
| Database | Supabase (PostgreSQL + RLS) |
| Pagos | Adapter configurable; Stripe puede ser default inicial |
| i18n | next-intl |
| Core AI | Python (FastAPI + Pydantic v2) |
| Testing | Vitest + Playwright |

> Las tareas en segundo plano usan `pg_cron` para jobs programados e Inngest para workflows asíncronos sin Redis. Redis/BullMQ es opcional, pero sugerido para cache compartida, rate limits distribuidos, quotas, locks, invalidación y colas dedicadas en producción multi-instancia.

---

## Seguridad por Diseño

Los controles verificables de seguridad están definidos en [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md).

- **RLS** en toda tabla con `tenant_id` (aislamiento imposible de eludir).
- **RBAC** granular (7 acciones × N módulos).
- **Log inmutable** basado en 5W.
- **Soft Delete universal** + Papelera de Reciclaje.
- **Encryption at rest** (AES-256) para credenciales.
- **Webhooks** firmados con HMAC-SHA256.
- **Compliance GDPR** (consent tracking, Right to Erasure).

---

## Inicio Rápido

1. **Clonar** el repositorio.
2. Configurar el bootstrap `bootstrap.json` (identidad, Tenant Zero, planes, modo `saas`/`corporate`).
3. Generar `.env`, `.env.local` y `.env.example` con la misma estructura; solo `.env.example` se versiona.
4. Ejecutar:
   ```bash
   npm install
   npm run init    # Inicialización: el bootstrap hidrata la BD
   npm run dev
   ```

---

## Estructura del Proyecto

```
/
├── src/
│   ├── app/             # Routing (Next.js App Router)
│   ├── framework/       # LA BASE (motor reutilizable)
│   └── web/             # APLICACIÓN WEB (módulos de negocio)
├── core-ai/             # Componente IA (Python/FastAPI)
├── supabase/            # Migraciones de base de datos
├── docs/                # Documentación
├── scripts/             # Scripts operacionales
├── tests/               # Tests E2E (Playwright)
└── bootstrap.json            # Bootstrap de carga inicial
```

> Estructura completa: [`REFERENCE_STRUCTURE.md`](./REFERENCE_STRUCTURE.md).

---

## Documentación

- **Estrategia de producto:** [`STRATEGY.md`](./STRATEGY.md)
- **Fuente de verdad técnica (PRD):** [`PRD.md`](./PRD.md)
- **Contrato de base de datos:** [`REFERENCE_DATABASE_SCHEMA.md`](./REFERENCE_DATABASE_SCHEMA.md)
- **Stack tecnológico:** [`REFERENCE_STACK.md`](./REFERENCE_STACK.md)
- **Security Assurance:** [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md)
- **Dependencias y aceptación:** [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md)
- **Bootstrap:** [`BOOTSTRAP_REFERENCE.md`](./BOOTSTRAP_REFERENCE.md)
- **Índice de documentación:** [`DOCUMENT_INVENTORY.md`](./DOCUMENT_INVENTORY.md)

> *"Start from Zero. Ship Everything."*
