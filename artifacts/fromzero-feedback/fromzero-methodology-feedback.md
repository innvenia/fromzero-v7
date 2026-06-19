# FromZero Methodology Feedback

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Methodology Feedback |
| Propósito o subtítulo | Feedback sanitizado para revisión manual del equipo FromZero |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | listo para revisión |
| Historial de estados | 2026-06-18: creado desde `GOTCHA-20260618-001` |
| Aprobación del usuario | pendiente |
| Fecha de aprobación | pendiente |
| Frase literal de aprobación | pendiente |
| Artefactos prerequisito | `artifacts/fromzero-feedback/GOTCHAS.md` |
| Documentos o fuentes asociadas | `.codex/plugins/fromzero/templates/gotchas.md`, `.codex/plugins/fromzero/templates/methodology-feedback.md`, `.gitignore`, `.mcp.json` local, `.env.example` |
| Artefactos derivados o relacionados | issue/backlog interno de FromZero si el equipo lo acepta |
| Commit asociado | commit de registro de feedback metodológico |
| Restricciones de seguridad | Sin secretos ni `.env` reales. El usuario debe aprobar manualmente cualquier envío externo. |

## Resumen para FromZero

- Adapter usado: Codex
- Versión del adaptador: 0.4.33
- Fase donde ocurrió: Build / Handoff operativo, preparación de MCP local
- Tipo de feedback: mejora de adapter / mejora de template / mejora de gate
- Impacto: alto

## Gotchas incluidos

| Gotcha | Fase | Impacto | Propuesta | Sanitizado |
|---|---|---|---|---|
| GOTCHA-20260618-001 | Build / Handoff operativo | alto | Declarar `.mcp.json`, `.env` y `.env.local` como archivos local-only cuando puedan contener secretos; usar ejemplos versionables separados y verificar tracking antes de solicitar tokens. | si |

## Sanitización y autorización

- Secretos removidos: si
- PII removida: no aplica
- Código propietario removido o minimizado: si
- Datos comerciales sensibles removidos: si
- Autorización del usuario para compartir: pendiente
- Frase literal de autorización: pendiente

## Clasificación sugerida

Esta clasificación es sugerida por el proyecto cliente. El equipo FromZero debe
revisarla manualmente antes de modificar la metodología.

- Estado sugerido: cambio recomendado
- Razón: la configuración MCP necesita credenciales reales para funcionar, pero esa necesidad debe resolverse sin versionar secretos. La metodología debe distinguir configuración local secreta de ejemplos versionables y debe verificar el estado Git antes de pedir tokens.
- Archivos FromZero posiblemente afectados: `AGENTS.md`, `FIRST_STEPS.md`, `templates/start-here.md`, `templates/state.md`, `library/resources/mcp.md`, `tools/init-project.mjs`

## Recomendación concreta

- Tratar `.mcp.json`, `.env` y `.env.local` como archivos locales permitidos, pero excluidos de Git.
- No leer ni imprimir `.env` reales.
- No enviar esos archivos como feedback externo.
- Crear `.mcp.example.json` si la metodología necesita documentar servidores MCP sin secretos.
- Antes de solicitar tokens, ejecutar una verificación equivalente a `git ls-files` y `git check-ignore` para confirmar que el archivo destino no está trackeado.
- Si un archivo sensible ya fue trackeado, registrar el incidente y recomendar rotación solo si hubo secretos reales.

## Proceso manual recomendado

1. Revisar este archivo dentro del proyecto cliente.
2. Confirmar que está sanitizado y autorizado.
3. Compartirlo manualmente con el equipo FromZero.
4. El equipo FromZero decide si abre backlog, auditoría, issue o hotfix.
5. La metodología fuente solo cambia después de esa revisión humana.
