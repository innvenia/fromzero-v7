# Glosario - From Zero Framework

> **Producto:** From Zero Framework
> **Versión:** 7.4.0
> **Propósito:** Definir, en lenguaje simple, los términos técnicos que aparecen en la documentación del framework.
> **Alcance:** Pensado tanto para perfiles técnicos como para emprendedores no técnicos que construyen su aplicación.

---

## Conceptos del framework

| Término | Definición simple |
|---|---|
| **Tenant** | Una "cuenta" aislada dentro de la aplicación. Cada Tenant tiene sus propios usuarios y datos, separados de los demás. En la UI suele llamarse "Cuenta". |
| **Tenant Zero** | El primer Tenant que crea el bootstrap al inicializar el framework; aloja al primer administrador (Super Admin). |
| **Multi-tenant** | Una misma aplicación que sirve a muchos Tenants a la vez, manteniendo sus datos separados. |
| **Bootstrap** (`bootstrap.json`) | Archivo de "génesis" que se usa una sola vez para crear la primera instancia funcional (Tenant Zero, administrador, parámetros mínimos). Después, la base de datos es la fuente de verdad. |
| **Módulo core** | Una de las piezas funcionales que el framework trae listas (usuarios, planes, webhooks, etc.). Hay 28. |
| **Grid Universal** | El componente que muestra los listados en forma de tabla para todos los módulos. |
| **Module Factory** | El mecanismo que genera de forma automática lo común de cada módulo (tabla, permisos, grid, traducciones). |
| **Custom fields** (campos personalizados) | Campos extra que un administrador puede añadir a los formularios sin programar; sus límites se parametrizan por aplicación y por plan. |
| **Plan / Feature Gating** | Un plan define qué funciones y límites tiene un Tenant. El "feature gating" valida esos límites antes de ejecutar una acción. |
| **Roles base** | Perfiles predefinidos: **Super Admin**, **Admin**, **Member** y **Guest** (este último, solo lectura). |

## Datos y seguridad

| Término | Definición simple |
|---|---|
| **RLS** (Row Level Security) | Reglas en la base de datos que impiden que un Tenant vea datos de otro, incluso con acceso SQL directo. |
| **RBAC** (control de acceso por roles) | Sistema que decide qué acciones puede hacer cada perfil en cada módulo. |
| **Soft delete** | "Borrado lógico": el registro se marca como eliminado (papelera) pero no se borra físicamente; se puede restaurar. |
| **Purga** | Borrado físico definitivo de registros que ya estaban en soft delete; ocurre tras un tiempo parametrizable por aplicación. |
| **`is_demo`** | Marca que distingue datos de demostración (eliminables en bloque) de los fundacionales y los reales. |
| **Secreto** | Valor sensible (token, contraseña, llave de API). Vive en archivos locales no versionados, nunca en Git, logs ni capturas. |
| **HMAC** | Firma criptográfica que garantiza que un mensaje (p. ej. un webhook) no fue alterado y proviene de quien dice. |
| **Allowlist** | Lista de destinos u orígenes permitidos; limita a dónde se puede enviar o de dónde se acepta una petición. |
| **SSRF** | Ataque en el que se engaña al servidor para que haga peticiones a destinos no deseados; la allowlist lo mitiga. |
| **Signed URL** (URL firmada) | Enlace temporal con permiso incluido para descargar o subir un archivo sin exponer credenciales. |
| **Idempotencia** | Propiedad de que repetir la misma operación no produce efectos duplicados. |

## Integraciones y conceptos de API

| Término | Definición simple |
|---|---|
| **Handler** | La función que atiende una ruta de API. **Privado:** requiere autenticación y permisos (la mayoría). **Público:** sin autenticación de usuario (p. ej. health, recepción de webhooks, lectura de documentos legales). |
| **Webhook saliente** | Notificación que la aplicación envía a un sistema externo cuando ocurre un evento, firmada con HMAC. |
| **Webhook entrante** | Endpoint que la aplicación expone para recibir eventos de un sistema externo, verificando firma, timestamp y anti-replay. |
| **Adapter** | Capa que permite conectar un proveedor externo (pagos, email, IA) sin atar el framework a uno específico. |
| **API key (M2M)** | Credencial para que otro sistema (no una persona) acceda a la API con permisos controlados. |
| **Core AI** | Servicio interno que ejecuta tareas de IA. Solo ejecuta; el comportamiento depende del proveedor/modelo configurado, con topes de presupuesto. |
| **Jurisdicción / locale** | País/normativa y idioma de un documento o contenido (p. ej. términos legales por país). |

## Herramientas y stack

| Término | Definición simple |
|---|---|
| **Supabase** | Plataforma que provee la base de datos PostgreSQL, autenticación y almacenamiento de archivos. |
| **MCP** | Mecanismo de tiempo de desarrollo que permite a herramientas de IA hablar con servicios (Supabase, SonarQube). No forma parte de la aplicación final. |
| **CLI** | Herramienta de línea de comandos de un servicio (p. ej. Supabase CLI); suele preferirse al MCP por eficiencia. |
| **Inngest** | Herramienta para tareas en segundo plano (jobs, workflows). Se programa con un SDK en el código; su motor corre en local o autohospedado, sin necesidad de un servicio externo obligatorio. |
| **`pg_cron`** | Extensión de PostgreSQL para ejecutar tareas programadas (p. ej. purgas, recordatorios). |
| **CI** (Integración Continua) | Servidor que ejecuta automáticamente pruebas, build y revisiones en cada cambio (p. ej. GitHub Actions). |
| **SonarQube** | Herramienta de análisis de calidad y seguridad del código. Es **opcional/configurable** por proyecto. |
| **k6** | Herramienta de pruebas de carga; es un programa de línea de comandos que se ejecuta bajo demanda, no un servicio que haya que mantener encendido. |
| **Coolify** | Plataforma para desplegar y mantener servicios en contenedores (p. ej. publicar la aplicación con un dominio real). |
| **Docker / Compose** | Tecnología de contenedores para ejecutar la aplicación de forma reproducible en local y en despliegue. |
