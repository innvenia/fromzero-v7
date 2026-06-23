# SonarQube local para Codex

## Objetivo

Este proyecto usa SonarQube localmente con tres mecanismos:

- API REST para consultar estado, métricas, issues y Quality Gate.
- MCP SonarQube para revisión interactiva durante la implementación.
- SonarScanner CLI vía Docker para publicar análisis local.

No se instala SonarQube CLI beta como herramienta base.

## Requisitos

- `.env.local` con `SONARQUBE_URL`, `SONARQUBE_TOKEN` y `SONARQUBE_PROJECT_KEY`.
- Docker Desktop iniciado para `sonar:scan` y MCP.
- `.env.local` y `.mcp.json` ignorados por Git.

El script lee `.env.local` solo como fuente operativa local. Nunca imprime tokens.

## Comandos

| Comando | Uso |
|---|---|
| `npm run sonar:doctor` | Valida variables, acceso REST, proyecto y Docker. |
| `npm run sonar:status` | Muestra Quality Gate, métricas, rama y último análisis. |
| `npm run sonar:issues` | Lista issues abiertos por severidad/tipo. |
| `npm run sonar:gate` | Falla si el Quality Gate no está en `OK`. |
| `npm run sonar:scan` | Ejecuta coverage y SonarScanner CLI vía Docker. |

## Flujo por sprint

Inicio:

1. Ejecutar `npm run sonar:doctor`.
2. Ejecutar `npm run sonar:status`.
3. Registrar baseline: Quality Gate, coverage, bugs, vulnerabilidades, hotspots, duplicación y último análisis.

Desarrollo:

1. Usar MCP SonarQube para consultar issues y reglas durante correcciones.
2. Usar `npm run sonar:issues` si MCP no está disponible.

Pre-cierre:

1. Ejecutar `npm run check`.
2. Ejecutar `npm run sonar:scan`.

Cierre:

1. Ejecutar `npm run sonar:gate`.
2. Ejecutar `npm run sonar:status`.
3. Registrar Quality Gate y métricas finales en el artefacto de cierre del sprint.

Release:

1. Mantener GitHub Actions como gate oficial.
2. Usar API REST local solo para verificar evidencia final.

## MCP

Para habilitar solo SonarQube MCP en el archivo local ignorado:

```powershell
node scripts/sonarqube.mjs setup-mcp
```

Después reinicia Codex o recarga el cliente MCP. El servidor queda sin `autoApprove` y con herramientas administrativas deshabilitadas.

Si MCP falla, valida:

1. `npm run sonar:doctor`.
2. Docker Desktop está iniciado.
3. Codex heredó las variables locales cargadas.
4. `.mcp.json` está ignorado por Git.

## Evidencia mínima de cierre

- Quality Gate.
- Fecha de último análisis.
- Rama analizada.
- Coverage global y nuevo coverage.
- Bugs.
- Vulnerabilidades.
- Security hotspots.
- Code smells.
- Duplicación.
