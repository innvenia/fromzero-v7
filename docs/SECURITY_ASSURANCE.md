# Security Assurance - From Zero Framework

> **Producto:** From Zero Framework  
> **Versión:** 7.0.0  
> **Última actualización:** 2026-06-06  
> **Fuente de verdad:** [`PRD.md`](./PRD.md), [`REFERENCE_THREAT_MODEL.md`](./REFERENCE_THREAT_MODEL.md), [`REFERENCE_DATABASE_SCHEMA.md`](./REFERENCE_DATABASE_SCHEMA.md).  
> **Propósito:** Convertir la seguridad en controles verificables de desarrollo y operación.  
> **Alcance:** Framework web, APIs, Supabase, Core AI, integraciones, aplicaciones derivadas y operación.

---

## 1. Baseline obligatorio

La seguridad del framework debe alinearse con:

- OWASP Top 10 Web.
- OWASP API Security Top 10.
- OWASP ASVS como catálogo de controles verificables.
- OWASP SAMM como referencia para madurez SSDLC.
- STRIDE para modelado de amenazas.
- Principio de mínimo privilegio en usuarios, servicios, MCP y CI.

Referencias:

- https://owasp.org/Top10/2021/
- https://owasp.org/API-Security/editions/2023/en/0x00-header/
- https://owasp.org/www-project-application-security-verification-standard/
- https://owasp.org/www-project-samm/

---

## 2. Controles transversales

| Control | Requisito |
|---|---|
| RLS | Toda tabla tenant-aware debe tener RLS probado. |
| RBAC | Toda Server Action/API valida permisos server-side. |
| Secrets | Ningún secreto real en frontend, logs, código o docs. |
| Service role | Solo server-side/background jobs; nunca cliente. |
| Anon key | Se trata como pública y se protege con RLS/policies. |
| Rate limiting | Requerido en auth, APIs públicas, IA, import/export, webhooks y operaciones costosas. |
| Input validation | Zod/Pydantic server-side antes de procesar datos. |
| SQL injection | Consultas parametrizadas o clientes seguros; SQL concatenado prohibido. |
| XSS/script injection | Sanitización de HTML y output encoding. |
| API keys | Hash/cifrado, scopes, expiración, rotación y auditoría. |
| Auditoría | Operaciones críticas registradas en `logs`. |
| Errores | Mensajes seguros, sin stack traces ni secretos. |
| CI quality gate | SonarQube/SonarCloud bloquea release si falla seguridad o calidad. |

---

## 3. Matriz OWASP Web Top 10

| Riesgo OWASP | Control From Zero |
|---|---|
| Broken Access Control | RLS, RBAC server-side, matriz quién puede ver qué, pruebas inter-tenant. |
| Cryptographic Failures | TLS, cifrado at rest, hashing de API keys, secretos fuera del cliente. |
| Injection | Zod/Pydantic, queries parametrizadas, sanitización HTML, rechazo de payloads inesperados. |
| Insecure Design | Threat model, gates de seguridad por fase, revisión de arquitectura. |
| Security Misconfiguration | `.env.example`, defaults seguros, checklist de despliegue, headers seguros. |
| Vulnerable and Outdated Components | lockfiles, Dependabot/Renovate, Sonar, revisión de advisories. |
| Identification and Authentication Failures | Supabase Auth, MFA, lockout, session timeout, password policy. |
| Software and Data Integrity Failures | CI firmado, PR reviews, control de migraciones, supply chain checks. |
| Security Logging and Monitoring Failures | `logs`, Sentry, alertas, auditoría de eventos críticos. |
| SSRF | Validación de URLs outbound, bloqueo localhost/IP privadas, timeouts. |

---

## 4. Matriz OWASP API Security Top 10

| Riesgo API | Control From Zero |
|---|---|
| Broken Object Level Authorization | RLS + validación de ownership por tenant/profile. |
| Broken Authentication | JWT validado server-side, API keys hasheadas, expiración y scopes. |
| Broken Object Property Level Authorization | Allowlist de campos por Server Action. Mass assignment prohibido. |
| Unrestricted Resource Consumption | Rate limiting, cuotas por tenant, budget caps IA, límites de upload. |
| Broken Function Level Authorization | RBAC en cada acción, no solo en UI. |
| Unrestricted Access to Sensitive Business Flows | throttling en signup, login, billing, AI, import/export y webhooks. |
| Server Side Request Forgery | Validación estricta de URLs en webhooks outbound e integraciones. |
| Security Misconfiguration | headers, CORS/CSP, entornos separados, secrets en vault/env. |
| Improper Inventory Management | APIs versionadas, inventario de endpoints, owner por módulo. |
| Unsafe Consumption of APIs | timeouts, retries controlados, firma HMAC, validación de payload externo. |

---

## 5. Matriz “quién puede ver qué”

| Recurso | Super Admin | Tenant Admin | Member | API Key M2M |
|---|---|---|---|---|
| `settings` global | CRUD | No | No | No |
| `modules` | CRUD | Lectura limitada según UI | No | No |
| `plans` | CRUD | Lectura de plan propio | Lectura limitada | Scope requerido |
| `tenants` | Todos | Solo tenant propio | No | Scope requerido |
| `users` | Todos | Usuarios de su tenant | Perfil propio | Scope requerido |
| `profiles` | CRUD | Asignar existentes | No | No |
| `logs` | Global + tenant | Solo tenant propio | No | Scope requerido |
| datos de negocio | Según permiso | Solo tenant propio | Según permiso | Scope + tenant |
| archivos | Según permiso | Tenant propio | Según permiso | Scope + tenant |
| integraciones | CRUD global/tenant | Tenant propio | No | No |

Regla bloqueante: si una tabla contiene `tenant_id`, la política RLS debe impedir lectura cruzada aunque falle la capa de aplicación.

---

## 6. ASVS Coverage Snapshot

Este snapshot no sustituye una auditoría ASVS completa. Define las áreas ASVS que el framework debe cubrir como baseline verificable.

| Área ASVS | Cobertura documental requerida |
|---|---|
| Arquitectura y threat modeling | `REFERENCE_THREAT_MODEL.md`, decisiones de seguridad y revisión antes de código. |
| Autenticación | Supabase Auth, MFA, lockout, password policy, session timeout y revocación. |
| Gestión de sesión | Cookies seguras, expiración, revocación, protección de tokens y sesiones concurrentes controladas. |
| Control de acceso | RLS, RBAC server-side, matriz quién puede ver qué y pruebas BOLA/IDOR. |
| Validación y sanitización | Zod/Pydantic server-side, allowlists, límites de payload y sanitización HTML. |
| Errores, logs y monitoreo | Errores seguros, `logs` inmutables, Sentry y alertas de eventos críticos. |
| Protección de datos | TLS, cifrado en reposo, hashing/cifrado de API keys y clasificación de datos. |
| APIs y servicios externos | API keys con scopes, webhooks HMAC, SSRF guard, timeouts y retries controlados. |
| Archivos y recursos | Signed URLs, validación MIME/tamaño, cuotas por tenant y cleanup. |
| Configuración segura | `.env.example`, secretos fuera de cliente, service role server-only y quality gates. |
| Supply chain | lockfiles, revisión de dependencias, SonarQube/SonarCloud y CI reproducible. |

---

## 7. SSDLC mínimo

| Fase | Control |
|---|---|
| Diseño | Threat model, dependencia/RLS/RBAC definidos antes de código. |
| Implementación | TypeScript strict, Zod/Pydantic, no secrets, no SQL concatenado. |
| Revisión | PR review, Sonar, lint, typecheck, pruebas relevantes. |
| Testing | Unit, integration, RLS, E2E, abuse cases. |
| Release | Quality gate, build reproducible, migraciones revisadas. |
| Operación | Sentry, logs, alertas, rotación de secrets, revisión de permisos. |

---

## 8. Casos de prueba mínimos

- Un Tenant Admin no puede leer datos de otro tenant.
- Un Member sin permiso no puede crear, actualizar, eliminar, importar ni exportar.
- Una API Key expirada o sin scope es rechazada.
- Un webhook del proveedor de pagos configurado sin firma válida es rechazado.
- Un upload con MIME/tamaño inválido no recibe signed URL.
- Un payload con campos extra no modifica propiedades no permitidas.
- Una consulta de búsqueda global respeta RLS y RBAC.
- Una invocación AI respeta budget cap, rate limit y auditoría.
- Un error 500 no expone stack trace ni secretos.
- SonarQube/SonarCloud bloquea release con vulnerabilidades críticas.
