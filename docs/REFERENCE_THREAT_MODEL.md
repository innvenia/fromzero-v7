# Threat Model - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Última actualización:** 2026-06-06
> **Fuente de verdad:** [`PRD.md`](./PRD.md)
> **Alcance:** Documentación de producto y requisitos de seguridad del framework.
> **Control verificable:** Este threat model se complementa con [`SECURITY_ASSURANCE.md`](./SECURITY_ASSURANCE.md), que mapea OWASP Top 10, OWASP API Top 10, ASVS, SSDLC y controles anti-abuso.

---

## 1. Superficies de Ataque (Attack Surfaces)

| Superficie | Tecnología | Descripción |
|:-----------|:-----------|:------------|
| **Frontend Client** | Next.js (App Router) | SPA/SSR consumida por el navegador. Susceptible a XSS, token theft, CSRF. |
| **Server Actions / API Routes** | Node.js/TypeScript | Endpoints de mutación y lectura server-side. Riesgo de BOLA, Mass Assignment, IDOR. |
| **Supabase DB & Auth** | PostgreSQL + PostgREST | API REST directa y autenticación JWT. Riesgos por RLS mal configurado, JWT manipulation. |
| **Payment Provider Webhooks** | HTTPS Inbound | Recepción de eventos financieros. Riesgo de Spoofing si no se valida firma HMAC. |
| **Email Transaccional** | Proveedor configurable | Riesgo de SSRF, Spam injection o template injection si variables no sanitizadas. |
| **Core AI (Python)** | Runtime Python independiente | Servicio de IA (RAG, embeddings). Riesgo de Prompt Injection, Cost Abuse, data exfiltration. |
| **Supabase Storage** | S3-compatible | Carga directa vía Presigned URLs. Riesgo de malware upload, path traversal, MIME spoofing. |
| **Event Bus / Rules** | Server-side | Motor de automatización "Si-Entonces". Riesgo de Rule abuse, infinite loops, privilege escalation. |
| **Webhooks Outbound** | HTTPS Outbound | Notificaciones firmadas HMAC-SHA256. Riesgo de SSRF, credential leakage. |
| **API Keys (M2M)** | Bearer Token | Acceso programático sin sesión. Riesgo de key leakage, scope bypass. |

---

## 2. Clasificación de Datos

| Nivel | Tipo | Ejemplos | En Tránsito | En Reposo |
|:-----:|:-----|:---------|:------------|:----------|
| **Crítico** | PII / Financiero / Credenciales | Emails, perfiles, billing refs, suscripciones, API Key hashes, credenciales de integración, MFA secrets, Webhook secrets | TLS 1.2+ | Supabase AES-256, campos sensibles cifrados at rest |
| **Sensible** | Operacional / Configuración | Config de Tenant (settings JSONB), logs de auditoría, preferencias, Custom Fields con PII, consent_records, invitations tokens | TLS 1.2+ | Hash/Cifrado según campo |
| **Público** | Información general | Landing pages, catálogos de planes, features públicas, KB articles | HTTPS | Plaintext |

---

## 3. Flujos de Datos (Data Flows)

### 3.1 Autenticación
```
Usuario (Credenciales) → Cliente → Supabase Auth (JWT) → Custom Claim Injection (tenant_id en app_metadata) → Cliente (Cookie HttpOnly/Secure)
```
- Cifrado en tránsito (HTTPS). JWT en cookies `HttpOnly`/`Secure` vía SSR.
- El `tenant_id` se inyecta como Custom Claim en el JWT (`app_metadata.tenant_id`).
- **NO se usa header HTTP separado.** El JWT es la única fuente de verdad del contexto de Tenant.

### 3.2 Acceso a Datos (Lectura/Escritura)
```
Usuario → Cliente → Server Action (Auth JWT) → Supabase PostgREST → RLS Policy (tenant_id) → DB
```
- Validación Zod bimodal: cliente + servidor en cada Server Action.
- RLS filtra estrictamente por `tenant_id` derivado del JWT Custom Claim.

### 3.3 Pagos (adapter configurable)
```
Usuario → Checkout del proveedor configurado → Webhook → Server Action → Verificación Firma HMAC → DB (refs solamente)
```
- NUNCA datos financieros pasan por DB propia; solo IDs referenciales.
- Tablas de billing son read-only para RLS de Tenant.

### 3.4 Core AI (Python)
```
Usuario (Prompt) → Server Action (Sanitización + Auth) → Core AI (Python, runtime independiente) → LLM Provider
```
- Rate Limiting y Budget caps duros por Tenant.
- Sanitización de prompts server-side antes de envío al Core AI.
- **NO se usan Edge Functions.** El Core AI es un servicio Python independiente invocado desde Server Actions.

### 3.5 File Upload
```
Usuario → Server Action (Solicitud) → Presigned URL (Supabase Storage) → Upload Directo (Browser → Storage)
```
- Bypass del servidor Node.js para evitar DDoS por ancho de banda.
- Validación de MIME type y tamaño server-side antes de generar Presigned URL.
- Metadata del archivo en tabla `files` con `tenant_id` para aislamiento RLS.

---

## 4. Análisis STRIDE

| Categoría | Vector de Riesgo | Contramedida |
|:----------|:-----------------|:-------------|
| **Spoofing** | Suplantación JWT | Validar tokens JWT server-side. Custom Claim `tenant_id` inyectado server-side, no manipulable por cliente. |
| **Spoofing** | Webhook falso del proveedor de pagos | Verificación obligatoria de firma HMAC o mecanismo equivalente del proveedor en cada webhook. |
| **Spoofing** | API Key robada | Keys hasheadas (`key_hash`). Solo prefijo visible. Scopes estrictos. Revocación inmediata. |
| **Tampering** | Alterar inputs (`tenant_id`, precios) | Validación Zod strict server-side. `tenant_id` derivado solo del JWT. Precios fijos server-side desde tabla `plans`. |
| **Tampering** | Custom Field injection | Valores en `custom_data` (JSONB). Validación de tipo server-side. Sanitización de HTML/scripts. |
| **Tampering** | Mass Assignment | Filtrado explícito de campos permitidos en cada Server Action. Prohibido pasar objetos raw del cliente. |
| **Repudiation** | Negar cambios destructivos | Tabla `logs` append-only e inmutable. Registra las 5W. Sin UPDATE/DELETE en logs. |
| **Info. Disclosure** | BOLA (Leak cross-Tenant) | **Bloqueante:** RLS en TODA tabla con `tenant_id`, verificando `tenant_id = (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid`. |
| **Info. Disclosure** | API Key scope bypass | Scopes validados server-side en cada request M2M. |
| **Info. Disclosure** | File access cross-Tenant | RLS en tabla `files` por `tenant_id`. Presigned URLs con TTL corto. |
| **Denial of Service** | Ataques capa 7 | Rate Limiting (IP + Tenant) en Server Actions. Config en `settings.security`. |
| **Denial of Service** | Cost Exhaustion (AI) | Budget caps duros por Tenant. Tracking de costos en `logs`. `ai_enabled` toggle global y por plan. |
| **Denial of Service** | File Upload abuse | Validación de `max_file_size_mb` y `allowed_mime_types`. Presigned URL bypass del servidor. |
| **Denial of Service** | Event Bus abuse | Límite de reglas por plan (`max_rules`). Protección contra loops infinitos. |
| **Elev. of Privilege** | Cambiar profile a Admin | Modificaciones de Profile solo por Super Admin. `profile_id` validado server-side. |
| **Elev. of Privilege** | Webhook outbound SSRF | URLs validadas (no localhost, no IPs privadas). Timeout estricto. |
| **Elev. of Privilege** | Escalación via Tenant settings | Override de `mfa_policy` solo permite escalación, nunca relajación. |

---

## 5. Requisitos de Seguridad (Invariantes del Producto)

### 5.1 Aislamiento Multi-Tenant
- [x] TODAS las tablas con datos de negocio con `tenant_id` tendrán política RLS estricta.
- [x] Excepción documentada: tablas globales (`settings`, `plans`, `ai_models`) sin `tenant_id`.
- [x] Tabla `logs`: RLS con `tenant_id` nullable. Admin ve su Tenant; Super Admin ve cross-tenant.

### 5.2 Autenticación y Sesiones
- [x] JWT Custom Claims: `tenant_id` en `app_metadata` - única fuente de contexto de Tenant.
- [x] Session timeout configurable (default 30 min). Absolute timeout (default 1440 min).
- [x] Max login attempts con lockout temporal (default 5).

### 5.3 MFA
- [x] Política configurable: `disabled` | `optional` | `required`.
- [x] Métodos: `totp`, `email`, `sms`. Backup codes configurables.
- [x] Escalación por Tenant: solo más estricta que la global.

### 5.4 Contraseñas
- [x] Política configurable: longitud, complejidad, expiración, historial.

### 5.5 Datos Financieros
- [x] Pricing y suscripción controlados server-side y por el adapter de pagos configurado.
- [x] Nada financiero definitivo reside en UI local.
- [x] Invoices inmutables: contenido no editable post-generación, solo status.

### 5.6 Tokens y Profiles
- [x] `service_role` de Supabase jamás instanciado en componentes cliente.
- [x] Solo en Server Actions y procesos de background confinados.

### 5.7 Validación
- [x] Implementación bimodal Zod (Cliente + Servidor) en cada input y Server Action.
- [x] Validación de email RFC 5322 en campos de tipo email.

### 5.8 Storage
- [x] Presigned URLs obligatorias. MIME type validation server-side.
- [x] Límites configurables: `max_file_size_mb`, `max_storage_per_tenant_mb`.

### 5.9 Rate Limiting
- [x] Rate limiting por IP y por Tenant en Server Actions.
- [x] Budget caps para invocaciones IA.

### 5.10 GDPR / Compliance
- [x] Soft delete obligatorio con `deleted_at` (retención configurable).
- [x] Tabla `consent_records` para registros de aceptación legal.
- [x] Purga programada (`soft_delete.auto_purge_days`).
- [x] Anonimización transaccional para preservar integridad de logs.

---

## 6. Gestión de Sesiones (Nota Supabase)

> La gestión de sesiones activas (dispositivos conectados, revocación remota, concurrencia) se implementa mediante las capacidades nativas de **Supabase Auth**. El PRD define la funcionalidad requerida; la implementación aprovecha la infraestructura de sesiones de Supabase sin necesidad de una tabla `active_sessions` separada, excepto si las capacidades nativas resultan insuficientes durante la construcción.
