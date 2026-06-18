# From Zero Framework: Estrategia de Producto

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-06
> **Estado:** En construcción. Este documento describe la visión del producto que se va a crear.
> **Propósito:** Definir qué es From Zero como producto entregable, su identidad, propuesta de valor, motor técnico y modelo comercial.
> **Fuente de verdad técnica:** [`PRD.md`](./PRD.md).
> **Alcance:** Documentación de producto y estrategia del framework.

---

## 1. Resumen Ejecutivo

### ¿Qué es From Zero?

**From Zero Framework** es un **Sistema de Creación de Software**: una base estructurada, segura y escalable para construir aplicaciones SaaS multi-tenant de calidad profesional. **No es una aplicación final**, sino el cimiento sobre el cual se construyen aplicaciones. Entrega 27 módulos enterprise-grade pre-construidos y dos modos de operación (`saas` y `corporate`) que permiten crear tanto productos SaaS comerciales como software corporativo interno.

### ¿Qué problema resuelve?

Construir una aplicación SaaS profesional exige resolver, una y otra vez, la misma base: autenticación, multi-tenancy con aislamiento de datos, RBAC, facturación, auditoría, internacionalización e import/export. From Zero entrega esa base **ya resuelta, integrada y segura**, para que el esfuerzo se concentre en la lógica de negocio única de cada producto.

### ¿Cómo funciona?

El usuario provee **dos insumos**:

1. **PRD (Product Requirements Document):** define *qué* se va a construir - los módulos de la aplicación, la lógica de negocio y las reglas del dominio.
2. **`bootstrap.json` (Bootstrap):** archivo declarativo que define la identidad del proyecto, la primera cuenta (Tenant Zero), los planes, los profiles y el modo de operación. El bootstrap hidrata la base de datos durante la inicialización.

A partir de ahí, From Zero aporta la base técnica (los 27 módulos, la arquitectura y las garantías de seguridad) sobre la que se construye el producto.

### ¿Para quién es?

Desarrolladores, equipos de producto, agencias y emprendedores que necesiten lanzar aplicaciones SaaS empresariales sin reconstruir la infraestructura común desde cero.

**Mantra:** *"Start from Zero. Ship Everything."*

---

## 2. Análisis de Mercado

### 2.1 El contexto

La capacidad de crear software se ha democratizado, pero esa democratización **no transfirió** el conocimiento de ingeniería necesario para construir aplicaciones seguras y escalables. El resultado frecuente: proyectos que funcionan en superficie pero acumulan deuda técnica, fallas de seguridad y arquitecturas frágiles que colapsan al escalar (p. ej. al añadir multi-tenancy tarde).

### 2.2 La intervención

From Zero entrega una **base inquebrantable**: una arquitectura production-ready que resuelve de antemano los problemas estructurales (aislamiento de datos, permisos, facturación, auditoría), de modo que el producto final herede calidad, seguridad y escalabilidad por diseño.

---

## 3. Identidad de Marca

### 3.1 Naming y Dominio
- **Nombre completo:** From Zero Framework
- **Nombre corto:** From Zero
- **Referencia interna:** Zero
- **Dominio:** `fromzero.app`

### 3.2 Significado del Nombre
1. **Literal:** Empiezas desde cero líneas de boilerplate y llegas a producción.
2. **Conceptual:** Zero es el punto de origen: el big bang de tu producto.
3. **Emocional:** Zero no es ausencia; es **potencial**.

### 3.3 Taglines

| Contexto | Tagline |
|:---------|:--------|
| **Principal** | *"Start from Zero. Ship Everything."* |
| **Developer-facing** | *"Stop building foundations. Start building products."* |
| **Técnico** | *"Zero boilerplate. Zero friction. Zero excuses."* |

### 3.4 Voz y Tono
- Técnico pero accesible. Confiable, directo.
- Terminología real (RLS, RBAC, SSR, bootstrap). Sin simplificar en exceso.
- Prohibido: exageraciones vacías y jerga innecesaria.

---

## 4. Definición Estructural: Framework vs. Aplicación Final

| Dimensión | El Framework (la Base) | La Aplicación Final (Tu Negocio) |
|:----------|:-----------------------|:---------------------------------|
| **Definición** | La infraestructura reutilizable. | El producto que se comercializa (CRM, ERP, etc.). |
| **Naturaleza** | Genérico, agnóstico a la industria. | Específico del dominio, mutable. |
| **Responsabilidad** | Seguridad, multi-tenancy, pagos, estándares. | UX, lógica de negocio, propuesta de valor. |
| **Ubicación en código** | `src/framework/` | `src/web/` |

Esta línea es dura: el código de la base y el de la aplicación se mantienen físicamente separados (ver [`REFERENCE_STRUCTURE.md`](./REFERENCE_STRUCTURE.md)).

---

## 5. El Motor Técnico

### 5.1 Module Factory: Arquitectura Bootstrap → Base de Datos

El diferenciador técnico de From Zero es su modelo **bootstrap-a-base-de-datos**:

```
bootstrap.json (bootstrap)  →  Inicialización  →  Tablas de configuración (settings, modules)  →  Runtime (la BD gobierna)
```

Los parámetros de configuración **nacen** en un bootstrap declarativo (`bootstrap.json`) y, durante la inicialización, se **vuelcan** a tablas de la base de datos. En runtime, la configuración de cada módulo (Grid, Import/Export, presentación) se lee de la tabla `modules`: **la base de datos es la fuente de verdad**, no un archivo por módulo.

El **Module Factory** opera en dos niveles:
- **Generación automática (determinista):** Grid de datos, traducciones i18n, registro de auditoría (5W), permisos RBAC (7 acciones), APIs y Server Actions.
- **Co-creación guiada (humano-IA):** el formulario de cada módulo se diseña de forma específica (TSX por módulo, `[Slug]Form.tsx`) porque su estructura visual varía según la complejidad de los datos.

### 5.2 27 Módulos Pre-construidos

Cada aplicación hereda 27 módulos enterprise-grade en 4 bloques:

#### Bloque A - Administración (Super Admin)
Parámetros (`settings`), Módulo de Módulos (`module`), Planes (`plan`), Modelos AI (`ai-model`), Log (`log`), Profile (`profile`).

#### Bloque B - Configuración de Cuentas (Tenant Admin)
Tenants (`tenant`), Usuarios (`user`), Invitaciones (`invitation`), Notificaciones (`notification`), Reglas (`rule`), Campos Personalizados (`custom-field`), Plantillas Email (`email-template`), API Keys (`api-key`), Integraciones (`integration`), Webhooks (`webhook`), Documents (`document`), Import (`import`), Export (`export`), Suscripciones (`subscription`), Estados de Cuenta (`statement`), Invoices (`invoice`).

#### Bloque C - Funcionalidades Comunes (Todos los profiles autorizados)
Files (`file`), Tags (`tag`), Bookmarks (`bookmark`), Filtros (`filter`).

#### Bloque D - Módulo Demostrativo
Tasks (`task`): módulo de referencia que implementa todas las integraciones del framework (Grid, Custom Fields, Tags, Bookmarks, Filtros, Import/Export, Event Bus, Audit Log).

> La especificación técnica completa de los 27 módulos está en [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md).

### 5.3 Stack Tecnológico

| Capa | Tecnología |
|:-----|:-----------|
| **Frontend** | Next.js (App Router, RSC, Server Actions) |
| **UI** | React + Tailwind CSS v4 (sobre Design System propietario) |
| **Lenguaje** | TypeScript (tipado estricto) |
| **Base de Datos** | Supabase (PostgreSQL + RLS + Auth + Storage) |
| **Pagos** | Adapter configurable de billing, suscripciones y webhooks; Stripe puede ser default inicial |
| **i18n** | next-intl |
| **Core AI** | Python (FastAPI + Pydantic v2 - runtime independiente) |

### 5.4 Configuración Declarativa: el Bootstrap

El `bootstrap.json` define: identidad del proyecto, Tenant Zero, planes iniciales, profiles base, modo de operación y configuración global. La inicialización consume el bootstrap y genera la infraestructura base (BD poblada, Tenant Zero, Super Admin). Detalle: [`BOOTSTRAP_REFERENCE.md`](./BOOTSTRAP_REFERENCE.md).

### 5.5 Dos Modos de Operación

| Modo | Descripción | Caso de Uso |
|:-----|:------------|:------------|
| **`saas`** | Multi-tenant con billing, suscripciones, planes y Feature Gating. | Startups, productos B2B, plataformas comerciales. |
| **`corporate`** | Tenant único sin billing. Funcionalidad enterprise (RBAC, Audit, i18n) sin módulo comercial. | Software corporativo interno, intranets. |

### 5.6 Cascada de Configuración

La configuración se resuelve en cascada determinista: **Settings (global) → Tenant → User**.

---

## 6. Seguridad como Pilar Arquitectónico

| Capa | Mecanismo | Impacto |
|:-----|:----------|:--------|
| **Aislamiento de datos** | Row Level Security (RLS) nativo en PostgreSQL | Imposible acceder a datos de otro Tenant, incluso con SQL directo. |
| **Control de acceso** | RBAC dinámico: 7 acciones × N módulos | Permisos granulares por rol. |
| **Auditoría forense** | Log inmutable basado en 5W + metadata JSONB | Trazabilidad completa. |
| **Protección de datos** | Soft Delete universal + Papelera de Reciclaje | Recuperación de datos eliminados. |
| **Compliance GDPR** | Consent tracking, Right to Erasure | Cumplimiento desde el día cero. |
| **Credenciales** | Encryption at rest (AES-256) | Secrets nunca en texto plano. |
| **Webhooks** | Firma HMAC-SHA256 | Verificación de integridad. |
| **Feature Gating** | Middleware que valida plan/límites antes de ejecutar | Control de acceso por plan, sin código disperso. |

---

## 7. Posicionamiento y Propuesta de Valor

### 7.1 Perfil No-Técnico (Emprendedores)
- **Dolor:** "Empiezo un SaaS y, al añadir multi-tenancy o billing, todo colapsa."
- **Solución:** una base production-ready que aporta el rigor técnico que el proyecto necesita desde el inicio.

### 7.2 Perfil Técnico (Desarrolladores, Agencias)
- **Dolor:** "Cada proyecto reinventa la misma base: auth, billing, permisos."
- **Solución:** 27 módulos base ("Zero Boilerplate") integrados en una arquitectura cohesiva, lista para extender.

### 7.3 Anti-Persona (Para quién NO es)
- Quien busca una solución 100% No-Code visual (no es Bubble ni Webflow).
- Proyectos que solo necesitan un blog o landing simple.
- Equipos que no quieren control de su infraestructura ni código fuente.

---

## 8. Modelo Comercial

### 8.1 Licenciamiento (Source-Available)

| Plan | Precio | Alcance | Soporte |
|:-----|:-------|:--------|:--------|
| **Single Project** | $499 USD (one-time) | 1 dominio de producción | Comunidad |
| **Multi-Project** | Custom | Dominios ilimitados | Prioritario + Onboarding |

**Reglas:**
- Ambas licencias incluyen los **27 módulos completos** y todo el código fuente. Sin feature-gating entre tiers.
- **Año 1:** actualizaciones incluidas. **Año 2+:** soporte por el 10% del valor inicial.
- Sin suscripción obligatoria: el código sigue siendo tuyo.
- **No es open source:** uso exclusivo del licenciatario.

### 8.2 Justificación de Valor

| Componente | Costo desde cero | Con From Zero |
|:-----------|:----------------:|:-------------:|
| Auth + MFA | ~$6,000 |  Incluido |
| Multi-Tenancy + RLS | ~$10,000 |  Incluido |
| RBAC dinámico | ~$5,000 |  Incluido |
| Billing + Feature Gating | ~$7,000 |  Incluido |
| i18n, Audit, Import/Export | ~$6,000 |  Incluido |
| Module Factory + Custom Fields | ~$10,000 |  Incluido |
| **Total** | **~$44,000** | **$499** |

### 8.3 Servicios Externos (No incluidos)
Supabase, proveedor de pagos, hosting (VPS/PaaS) y proveedor LLM tienen sus propios costos.

### 8.4 Estrategia Free Tier (Post-Estabilización)
Una vez estabilizado el framework, se creará una **versión light gratuita** para validación de mercado, adquisición de usuarios y tracción en GitHub. Sus limitaciones exactas (subconjunto de módulos, modo `corporate`, watermark) se definirán con base en la experiencia real de uso.

---

## 9. Posicionamiento Competitivo

| Competidor | Tipo | Diferenciador de From Zero |
|:-----------|:-----|:---------------------------|
| **Lovable / Bolt / v0** | App builders con IA | Generan prototipos sin arquitectura enterprise. From Zero entrega 27 módulos production-ready. |
| **Supabase** | BaaS | From Zero es full-stack (UI, Module Factory, lógica de negocio), no solo backend. |
| **Clerk + proveedor de pagos + PaaS** | Stack à la carte | From Zero integra todo en una arquitectura cohesiva con RBAC, tenancy y auditoría pre-cableados. |
| **Shipfast / Supastarter** | Boilerplates | From Zero tiene Module Factory (bootstrap→BD); no es un template estático. |
| **Bubble / Webflow** | No-code | From Zero produce código fuente real (Next.js/PostgreSQL). Propiedad total. |

**UVP:** *From Zero es la base SaaS que combina una arquitectura bootstrap-a-base-de-datos con seguridad y multi-tenancy production-ready, para construir módulos empresariales completos desde cero.*

---

## 10. Puente Terminológico (PRD ↔ Web)

| Concepto | Término Técnico (PRD) | Término en la Web/UI |
|:---------|:----------------------|:---------------------|
| Aislamiento de datos | `tenant` / `tenant_id` | "Account" (Cuenta) |
| Conjunto de permisos | `profile` / `profile_permissions` | "Profile" (Perfil) |
| Configuración del sistema | `bootstrap.json` (bootstrap) / Settings | "Configuración inicial" |
| Flujo de inicio | Inicialización | "Setup en 30 segundos" |
| Motor de UI | Module Factory | "Generador asistido de módulos" |

---

## 11. Mapa de Documentos de Producto

| Documento | Contenido |
|:----------|:----------|
| [`PRD.md`](./PRD.md) | Fuente de verdad técnica - especificaciones funcionales |
| [`REFERENCE_MODULES.md`](./REFERENCE_MODULES.md) | Especificación de los 27 módulos |
| [`REFERENCE_ARCHITECTURE.md`](./REFERENCE_ARCHITECTURE.md) | Arquitectura lógica |
| [`REFERENCE_STRUCTURE.md`](./REFERENCE_STRUCTURE.md) | Estructura física |
| [`REFERENCE_DESIGN_SYSTEM.md`](./REFERENCE_DESIGN_SYSTEM.md) | Design System |
| [`REFERENCE_THREAT_MODEL.md`](./REFERENCE_THREAT_MODEL.md) | Modelo de amenazas |
| [`BOOTSTRAP_REFERENCE.md`](./BOOTSTRAP_REFERENCE.md) | Bootstrap de configuración |
| [`REFERENCE_DATABASE_SCHEMA.md`](./REFERENCE_DATABASE_SCHEMA.md) | Contrato consolidado de base de datos |
| [`REFERENCE_STACK.md`](./REFERENCE_STACK.md) | Stack tecnológico y conectores |
| [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md) | Seguridad verificable y OWASP |
| [`DEPENDENCY_MATRIX.md`](./DEPENDENCY_MATRIX.md) | Dependencias y aceptación por módulo |
