# Configuracion local de MCP

## Estado

El proyecto contiene `.mcp.json` local con servidores preparados y deshabilitados:

- `supabase-mcp-server`: MCP oficial de Supabase mediante `npx`.
- `sonarqube`: MCP oficial de SonarQube mediante Docker.

El archivo `.mcp.json` es **dependiente del entorno** y vive **ignorado por Git**. En local puede contener tokens inline; la postura objetivo es que cada token se lea desde una **variable externa** (no inline). Mientras los servidores sigan con `disabled: true`, no conecta servicios por si solo. Para documentacion versionable existe `.mcp.example.json` (sin secretos).

## Supabase MCP

Configuracion preparada:

- Runtime: `npx`.
- Paquete: `@supabase/mcp-server-supabase@latest`.
- Transporte: `stdio`.
- Modo inicial: `--read-only`.
- Features habilitadas: `docs,database,debugging,development`.
- Token: variable externa `SUPABASE_ACCESS_TOKEN`.

La configuracion recibida incluia `--access-token` inline. Ese valor no debe versionarse ni pegarse en chats. El token debe existir solo fuera del repo y ser leido por el proceso MCP desde `SUPABASE_ACCESS_TOKEN`.

Antes de activar, se recomienda agregar `--project-ref <project-ref>` a los argumentos para limitar el alcance a un unico proyecto Supabase. Si no se fija `project-ref`, el token puede exponer mas proyectos de los necesarios segun sus permisos.

## SonarQube MCP

Configuracion preparada:

- Runtime: Docker.
- Imagen: `mcp/sonarqube`.
- Transporte: `stdio`.
- URL configurada: `https://sonarqube.innvenia.ai`.
- Organizacion configurada: vacia, porque la instancia es SonarQube Server.
- Herramientas administrativas y de fuente raw deshabilitadas en `.mcp.json`.

Variables requeridas fuera del repo:

| Variable | Uso |
|---|---|
| `SONARQUBE_TOKEN` | Token de usuario SonarQube. Debe existir fuera del repo y fuera del chat. |
| `SONARQUBE_PROJECT_KEY` | Project key por defecto para este repo, si se quiere fijar por entorno. |

El token pegado en cualquier chat debe considerarse comprometido y rotarse antes de activar el servidor.

Variables legacy del proyecto:

| Variable existente | Equivalente MCP oficial |
|---|---|
| `SONAR_HOST_URL` | `SONARQUBE_URL` |
| `SONAR_TOKEN` | `SONARQUBE_TOKEN` |
| `SONAR_PROJECT_KEY` | `SONARQUBE_PROJECT_KEY` |

## Activacion

Para activar, se requiere una aprobacion explicita adicional. La activacion minima consiste en:

1. Configurar las variables reales fuera del repo y fuera del chat.
2. Cambiar `disabled` a `false` solo para el servidor autorizado.
3. Recargar el cliente MCP o la sesion Codex.
4. Verificar que `SUPABASE_ACCESS_TOKEN` exista en el entorno del proceso si se activa Supabase.
5. Verificar herramientas disponibles sin ejecutar cambios destructivos.

## Reglas

- Preferir variables externas; si un token vive inline, debe permanecer solo en el `.mcp.json` local ignorado por Git, nunca versionado ni impreso.
- No versionar `.env.local`.
- No leer ni imprimir `.env` reales.
- No activar escritura remota sin aprobacion puntual.
- Mantener Supabase en `--read-only` salvo aprobacion contraria.
- Mantener deshabilitadas las herramientas administrativas de SonarQube salvo aprobacion contraria.
