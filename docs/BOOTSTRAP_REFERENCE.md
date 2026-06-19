# Referencia de Bootstrap: `bootstrap.json`

> **Producto:** From Zero Framework  
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-06  
> **Fuente de verdad:** [`PRD.md`](./PRD.md) y [`REFERENCE_ARCHITECTURE.md`](./REFERENCE_ARCHITECTURE.md).  
> **Propósito:** Definir el archivo canónico de genesis inicial del framework.  
> **Alcance:** Solo cubre la inicialización del framework. No define la parametrización posterior de aplicaciones derivadas.

---

## 1. Principio rector

`bootstrap.json` reemplaza por completo cualquier concepto anterior de bootstrap de inicialización. Es un archivo declarativo de **un solo uso operativo** para crear la primera instancia funcional del framework.

Flujo canónico:

```text
bootstrap.json -> proceso init -> BD/settings/modules -> runtime gobernado por BD
```

Reglas:

- `bootstrap.json` solo se usa durante la genesis inicial del framework.
- Después del proceso `init`, la fuente de verdad es la base de datos.
- La parametrización viva se gestiona desde `settings`, `modules`, `tenants.settings`, `integrations`, `plans` y el setup wizard posterior al primer login.
- Las aplicaciones derivadas no se crean editando un archivo plano; se adaptan desde la interfaz administrativa del framework y su propio PRD.
- Los 27 módulos core se registran desde una lista canónica interna del framework, no desde una lista editable en `bootstrap.json`.
- El archivo puede conservarse como evidencia histórica, pero no vuelve a gobernar runtime ni despliegues posteriores.

---

## 2. Responsabilidades

| Responsabilidad | `bootstrap.json` | BD / módulos administrativos |
|---|---:|---:|
| Crear Tenant Zero | Sí | Mantiene y permite editar datos posteriores. |
| Crear Super Admin inicial | Sí | Gestiona usuarios y perfiles posteriores. |
| Crear valores globales mínimos | Sí | `settings` es fuente de verdad post-init. |
| Registrar módulos core | No editable | `modules` recibe lista canónica interna. |
| Configurar branding completo | Solo fallback mínimo | `settings` y Design System del framework. |
| Configurar integraciones | Solo flags mínimos si aplica | `integrations` y variables de entorno. |
| Guardar secretos reales | No | `.env`, `.env.local`, vault o proveedor seguro. |
| Adaptar una app derivada | No | UI administrativa + setup wizard + PRD de la app. |

---

## 3. Estructura mínima

```json
{
  "_metadata": {
    "version": "7.4.0",
    "generated_at": "2026-06-06T00:00:00Z",
    "prd_reference": "PRD.md"
  },
  "app": {
    "mode": "saas",
    "name": "From Zero Framework",
    "url": "http://localhost:3000",
    "allow_multi_tenant_users": false,
    "licensing_model": "per_tenant"
  },
  "infrastructure": {
    "ports": {
      "frontend": 3000,
      "core_ai": 8000
    },
    "features": {
      "billing_enabled": true,
      "ai_enabled": true,
      "event_bus_enabled": true,
      "inngest_enabled": true,
      "redis_enabled": false
    }
  },
  "security": {
    "mfa_policy": "optional",
    "session_timeout_minutes": 30,
    "absolute_timeout_minutes": 1440,
    "max_login_attempts": 5,
    "rate_limit_enabled": true
  },
  "initial_data": {
    "tenant_zero": {
      "name": "Main Account",
      "slug": "main"
    },
    "super_admin": {
      "first_name": "System",
      "last_name": "Admin",
      "email": "admin@example.com"
    },
    "profiles": ["super_admin", "admin", "member", "guest"],
    "plans": []
  }
}
```

---

## 4. Campos canónicos

### 4.1 `_metadata`

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `version` | string | Sí | Versión documental del framework. |
| `generated_at` | string ISO-8601 | Sí | Fecha de generación del archivo. |
| `prd_reference` | string | Sí | Referencia al PRD usado para inicializar. |

### 4.2 `app`

| Campo | Tipo | Requerido | Valores |
|---|---|---:|---|
| `mode` | string | Sí | `saas` o `corporate`. |
| `name` | string | Sí | Nombre inicial de la plataforma. |
| `url` | string | Sí | URL base inicial. |
| `allow_multi_tenant_users` | boolean | Sí | Habilita usuarios en múltiples tenants. Default `false`; cuando está en `false`, un email solo puede pertenecer a un Tenant para simplificar login. |
| `licensing_model` | string | Sí | `per_tenant` o `per_user`. |

### 4.3 `infrastructure`

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `ports.frontend` | number | Sí | Puerto local de Next.js. |
| `ports.core_ai` | number | Sí | Puerto interno del Core AI. |
| `features.billing_enabled` | boolean | Sí | Activa módulos de billing. |
| `features.ai_enabled` | boolean | Sí | Activa integración Core AI. |
| `features.event_bus_enabled` | boolean | Sí | Activa reglas/eventos. |
| `features.inngest_enabled` | boolean | Sí | Activa workflows asíncronos. |
| `features.redis_enabled` | boolean | Sí | Opcional, default `false`. |

### 4.4 `security`

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `mfa_policy` | string | Sí | `disabled`, `optional`, `required`. |
| `session_timeout_minutes` | number | Sí | Timeout por inactividad. |
| `absolute_timeout_minutes` | number | Sí | Timeout absoluto de sesión. |
| `max_login_attempts` | number | Sí | Intentos antes de bloqueo. |
| `rate_limit_enabled` | boolean | Sí | Activa rate limiting base. |

### 4.5 `initial_data`

| Campo | Tipo | Requerido | Descripción |
|---|---|---:|---|
| `tenant_zero.name` | string | Sí | Nombre del tenant principal. |
| `tenant_zero.slug` | string | Sí | Slug único inicial. |
| `super_admin.email` | string | Sí | Email del primer Super Admin. |
| `profiles` | string[] | Sí | Perfiles iniciales mínimos. |
| `plans` | object[] | No | Planes iniciales opcionales; editables después desde UI. |

---

## 5. Secretos y variables de entorno

`bootstrap.json` no almacena secretos reales.

Todo proyecto generado debe crear `.env`, `.env.local` y `.env.example` con exactamente la misma estructura y las mismas variables. Solo `.env.example` se versiona y contiene placeholders seguros. `.env` y `.env.local` quedan ignorados por Git y pueden contener valores reales según entorno.

Los agentes y procesos automatizados nunca deben leer, imprimir ni copiar valores reales desde `.env` o `.env.local`.

Variables documentadas en los tres archivos:

| Variable | Uso | Exposición permitida |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública de Supabase. | Cliente y servidor. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Clave pública recomendada para clientes Supabase modernos. | Cliente y servidor, protegida por RLS. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima pública. | Cliente y servidor, protegida por RLS. |
| `SUPABASE_SECRET_KEY` | Clave server-only recomendada para operaciones administrativas. | Solo servidor/background jobs. |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones administrativas. | Solo servidor/background jobs. |
| `SUPABASE_ACCESS_TOKEN` | CLI/MCP Supabase cuando se apruebe explícitamente. | Solo entorno local/CI seguro. |
| `DATABASE_URL` / `DIRECT_URL` | Migraciones y procesos server-side. | Solo servidor/CI seguro. |
| `CORE_AI_SECRET` | Autenticación Node.js -> Core AI. | Solo servidor. |
| `PAYMENT_PROVIDER_SECRET_KEY` | Credencial server-side del proveedor de pagos configurado. | Solo servidor. |
| `PAYMENT_PROVIDER_WEBHOOK_SECRET` | Verificación de webhooks del proveedor de pagos configurado. | Solo servidor. |
| `EMAIL_PROVIDER_API_KEY` | Credencial del proveedor de email transaccional configurado. | Solo servidor. |
| `AI_PROVIDER_API_KEY` | Credencial del proveedor AI configurado. | Solo servidor/Core AI. |
| `INNGEST_EVENT_KEY` / `INNGEST_SIGNING_KEY` | Workflows Inngest. | Solo servidor. |

---

## 6. Validaciones obligatorias del proceso `init`

- Validar estructura con schema estricto.
- Rechazar campos desconocidos en secciones críticas.
- Rechazar secretos en `bootstrap.json`.
- Verificar formato de email del Super Admin.
- Verificar unicidad de `tenant_zero.slug`.
- Crear primero tablas globales, auditoría y configuración base.
- Crear `settings` con defaults seguros.
- Registrar módulos core desde lista canónica interna.
- Crear Tenant Zero, profiles base, Super Admin y membresía fundacional.
- Ejecutar pruebas mínimas de RLS antes de reportar éxito.
- Registrar resultado del proceso en `logs`.

---

## 7. Setup wizard posterior al primer login

El setup wizard complementa, no reemplaza, el proceso de bootstrap.

Debe permitir al Super Admin configurar:

- branding y UI runtime;
- billing y planes;
- proveedor de pagos;
- email transaccional;
- PostHog, Sentry y analytics;
- Core AI y modelos;
- integraciones externas;
- políticas de seguridad avanzadas;
- preferencias regionales;
- contenido legal inicial.

El setup wizard escribe en BD y módulos administrativos. No reescribe `bootstrap.json`.

---

## 8. Aplicaciones derivadas

Una aplicación final basada en From Zero Framework debe tener su propio PRD. La adaptación se realiza por:

- módulo `settings`;
- módulo `modules`;
- módulo `integrations`;
- módulo `plans`;
- configuración de Tenant;
- setup wizard;
- módulos específicos en `src/web`;
- migraciones controladas para lógica de negocio propia.

No se debe crear una aplicación derivada editando `bootstrap.json`.
