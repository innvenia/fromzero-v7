# Plantilla `.env.example`

Estándar único del `.env.example` para proyectos creados con FromZero. Tomar este archivo como base.

## Cómo se usa

- Copiar a `.env` o `.env.local` (o al store seguro del entorno); nunca versionar valores reales.
- Cada sección lleva un marcador: `# requerido` o `# opcional · activar si: <trigger>`.
- Recortar: borrar las secciones `# opcional` que el proyecto no use; conservar las `# requerido`.
- Ajustar por proyecto la primera línea de título y los valores no-secretos específicos de producto: `SONARQUBE_PROJECT_KEY`, `AI_MODEL_ID`/`AI_DEFAULT_MODEL` cuando aplique.
- Mantener cada secreto con su placeholder; el valor real vive fuera del repo.

## Guía de llenado (interactiva)

- El agente identifica y lista a la persona exactamente qué variables debe llenar según los recursos activados, no todo el archivo.
- Si la persona pide ayuda, el agente explica de dónde y cómo obtener cada valor (el procedimiento), de forma breve, puntual y precisa: lo suficiente para que cualquiera lo entienda, sin extenderse.
- Los comentarios `# <Producto> label:` o `# obtener en:` documentan la fuente cuando no es obvia.
- El agente nunca pide secretos en el chat: la persona los coloca en su `.env`/`.env.local` local.

## Reglas para agregar stack nuevo

1. Crear una categoría con título propio en formato `# TituloCategoria` (markdown, igual que las secciones existentes), agrupando solo las variables de ese producto.
2. No duplicar variables: una sola variable por cada dato a ingresar. Si un dato ya tiene su variable (por ejemplo el Project ID de Supabase), reutilizarla; no crear variantes.
3. Marcar la sección con `# requerido` o `# opcional · activar si: <trigger>` como primer comentario bajo el encabezado.

## Convenciones de formato

- Encabezado de sección: `# PascalCase` sin espacios.
- Marcador de activación: primer comentario bajo el encabezado (`# requerido` u `# opcional · activar si: <trigger>`).
- Placeholders: `__replace_with_x__`, `__replace_if_<feature>_is_enabled__`, `__replace_only_if_..._is_approved__`, `__legacy_replace_only_if_..._is_required__`.
- Comentario `# <Producto> label: ...` o `# obtener en: ...` para indicar de dónde sale el valor cuando no es obvio.
- Defaults no-secretos permitidos (URLs locales, flags como `REDIS_ENABLED=false`).
- Legacy en su propia sección `# <Producto>Legacy`, separada de la moderna.
- Orden sugerido: runtime/app, auth, datos, integraciones, IA, calidad y pruebas, telemetría.

## Base

```dotenv
# From Zero Framework v7
# Copiar a .env o .env.local (o al store seguro del entorno).
# No colocar secretos reales en este archivo versionado.
# Plantilla estructurada: borra las secciones "# opcional" que el proyecto no use.

# ApplicationRuntime
# requerido · base de la app
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api/v1

# ApplicationAuth
# requerido si hay autenticación o sesión
AUTH_URL=http://localhost:3000
AUTH_SECRET=__replace_with_generated_secret__

# SupabaseRuntime
# opcional · activar si: Supabase (datos, auth, storage, realtime)
# Supabase label: Project URL
NEXT_PUBLIC_SUPABASE_URL=__replace_with_supabase_project_url__
# Supabase label: Publishable key
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=__replace_with_supabase_publishable_key__
# Supabase label: Secret key
SUPABASE_SECRET_KEY=__replace_with_server_only_supabase_secret_key__

# SupabaseDatabase
# opcional · activar si: conexión directa a Postgres de Supabase
# Supabase label: Direct connection string
SUPABASE_DIRECT_CONNECTION_STRING=__replace_with_supabase_direct_connection_string__

# SupabaseTooling
# opcional · activar si: CLI o MCP de Supabase aprobado
# Supabase label: Project ID. It is the subdomain in Project URL.
SUPABASE_PROJECT_ID=__replace_with_supabase_project_id__
# Supabase label: Database password. Used to replace [YOUR-PASSWORD] in the direct connection string.
SUPABASE_DB_PASSWORD=__replace_with_supabase_database_password__
# Supabase label: CLI setup commands. Optional token for non-interactive CLI/MCP auth.
SUPABASE_ACCESS_TOKEN=__replace_only_if_supabase_cli_or_mcp_is_approved__

# SupabaseLegacy
# opcional · solo si se requiere el esquema clásico JWT
NEXT_PUBLIC_SUPABASE_ANON_KEY=__legacy_replace_only_if_classic_jwt_is_required__
SUPABASE_SERVICE_ROLE_KEY=__legacy_replace_only_if_service_role_is_required__

# Stripe
# opcional · activar si: pagos o billing
STRIPE_PUBLISHABLE_KEY=__replace_if_billing_is_enabled__
STRIPE_SECRET_KEY=__replace_if_billing_is_enabled__
STRIPE_WEBHOOK_SECRET=__replace_if_billing_is_enabled__

# Resend
# opcional · activar si: email transaccional
RESEND_API_KEY=__replace_if_email_is_enabled__

# CoreAI
# opcional · activar si: runtime de IA (Core AI)
# AI_MODEL_ID/AI_DEFAULT_MODEL: verifica el id exacto contra la doc oficial del proveedor antes de usarlo; no copies ids sin verificar
AI_PROVIDER=openrouter
AI_MODEL_ID=__replace_with_verified_model_id__
AI_DEFAULT_MODEL=__replace_with_verified_model_id__
CORE_AI_SECRET=__replace_with_server_only_core_ai_secret__

# OpenRouter
# opcional · activar si: IA vía OpenRouter
OPENROUTER_API_KEY=__replace_if_ai_is_enabled__

# Inngest
# opcional · activar si: jobs o colas async
INNGEST_EVENT_KEY=__replace_if_inngest_is_enabled__
INNGEST_SIGNING_KEY=__replace_if_inngest_is_enabled__

# Redis
# opcional · activar si: cache, rate limit o colas
REDIS_ENABLED=false
REDIS_URL=__replace_if_redis_is_enabled__

# Recaptcha
# opcional · activar si: formularios públicos con protección antibot
RECAPTCHA_SITE_KEY=__replace_if_recaptcha_is_enabled__
RECAPTCHA_SECRET_KEY=__replace_if_recaptcha_is_enabled__

# SonarQube
# opcional · activar si: quality gate o SAST
SONARQUBE_URL=__replace_with_sonarqube_url__
SONARQUBE_PROJECT_KEY=fromzero-framework
SONARQUBE_TOKEN=__replace_with_sonarqube_token__

# NextJsTelemetry
# opcional · default desactiva la telemetría de Next.js
NEXT_TELEMETRY_DISABLED=1

# Playwright
# opcional · activar si: E2E o QA visual
PLAYWRIGHT_BASE_URL=http://localhost:3000

# K6
# opcional · activar si: pruebas de carga
K6_BASE_URL=__replace_with_staging_base_url__
```
