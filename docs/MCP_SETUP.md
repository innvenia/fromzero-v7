# Configuracion local de MCP

## Estado

El proyecto contiene `.mcp.json` local con servidores preparados y deshabilitados:

- `supabase`: MCP remoto oficial de Supabase por HTTP.
- `sonarqube`: MCP oficial de SonarQube mediante Docker.

No contiene secretos inline y no conecta servicios por si solo mientras los servidores sigan con `disabled: true`.

## Supabase MCP

Configuracion preparada:

- Tipo: `http`.
- URL: `https://mcp.supabase.com/mcp`.
- Autenticacion: OAuth del cliente MCP.

El MCP remoto oficial de Supabase ya no requiere generar un PAT para el flujo principal. Al activarlo, el cliente MCP debe abrir el flujo OAuth y pedir autorizacion de la organizacion/proyecto.

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
4. Autenticar Supabase por OAuth si aplica.
5. Verificar herramientas disponibles sin ejecutar cambios destructivos.

## Reglas

- No escribir tokens reales en `.mcp.json`.
- No versionar `.env.local`.
- No leer ni imprimir `.env` reales.
- No activar escritura remota sin aprobacion puntual.
- Mantener deshabilitadas las herramientas administrativas de SonarQube salvo aprobacion contraria.
