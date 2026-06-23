# Servidores MCP

## Qué es

MCP (Model Context Protocol) permite que el agente use herramientas externas (bases de datos, calidad de código, servicios SaaS) de forma controlada. Codex y Claude Code soportan servidores MCP empaquetados en plugins; Antigravity los gestiona desde la configuración de la app.

## Regla base

- Ningún servidor MCP se activa ni se conecta sin aprobación explícita del usuario.
- Las credenciales de un MCP son secretos: viven fuera del repo, nunca en la configuración versionada.
- Todo MCP activado se registra en la spec como integración activa, con su gate.
- La metodología base funciona completa sin ningún MCP.

## Activar cuando

- El stack del proyecto coincide con un servidor recomendado y el usuario aprueba.
- Una fase necesita evidencia que el MCP provee mejor que un comando local (por ejemplo, hotspots de SonarQube en `fz-security`/`fz-release`).

## Servidores recomendados

| Servidor | Cuándo proponerlo | Fases | Variables (placeholders en `.env.example`) |
|---|---|---|---|
| Supabase MCP | El proyecto usa Supabase y se necesita inspección de schema, RLS o datos de desarrollo | `fz-design`, `fz-build`, `fz-security` | `SUPABASE_ACCESS_TOKEN` (secreto, fuera del repo) |
| SonarQube MCP | SonarQube está configurado y se requieren quality gates o hotspots | `fz-security`, `fz-release` | `SONARQUBE_URL`, `SONARQUBE_TOKEN` (secreto) |

## Configuración por plataforma

- Codex: el plugin incluye `.mcp.json` (campo `mcpServers`), vacío por defecto. Se llena solo con aprobación, sin secretos inline (usar referencias a variables de entorno).
- Claude Code: el plugin incluye `.mcp.json` equivalente, vacío por defecto.
- Antigravity: registrar el MCP en la configuración de la app siguiendo su documentación; dejar constancia en la spec.

## Diferido no es ignorado

Si un MCP aplica pero queda apagado, la spec registra: razón, impacto, condición de activación y gate, igual que cualquier integración diferida.
