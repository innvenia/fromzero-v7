# FromZero Gotchas

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | Gotchas |
| Propósito o subtítulo | Aprendizajes locales sobre la metodología o plugin FromZero |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | listo para revisión |
| Historial de estados | 2026-06-18: creado para registrar mejora metodológica sobre MCP y archivos locales de secretos |
| Aprobación del usuario | no aplica |
| Fecha de aprobación | no aplica |
| Frase literal de aprobación | no aplica |
| Artefactos prerequisito | `artifacts/FROMZERO_STATE.md` |
| Documentos o fuentes asociadas | `.codex/plugins/fromzero/templates/gotchas.md`, `.codex/plugins/fromzero/templates/methodology-feedback.md`, `.gitignore`, `.mcp.json` local, `.env.example`, conversación local del proyecto |
| Artefactos derivados o relacionados | `artifacts/fromzero-feedback/fromzero-methodology-feedback.md` |
| Commit asociado | commit de registro de feedback metodológico |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No incluir PII, tokens, llaves, dumps, logs sensibles ni código propietario innecesario. |

## Reglas de captura

- Registrar solo aprendizajes sobre FromZero, sus skills, templates, gates, adapters o flujo operativo.
- No registrar bugs normales del proyecto salvo que revelen una mejora metodológica.
- No registrar secretos, credenciales, `.env`, datos personales o información comercial sensible.
- No enviar automáticamente este archivo fuera del proyecto.

## Gotchas detectados

### GOTCHA-20260618-001 - MCP y archivos locales de secretos no deben entrar a Git

| Campo | Valor |
|---|---|
| Fase FromZero | Build / Handoff operativo |
| Adapter usado | Codex |
| Skill involucrada | Flujo operativo MCP local; no asociado a una skill única |
| Sprint o momento | Después de Sprint 3, durante preparación de MCP Supabase y SonarQube |
| Qué ocurrió | Se creó un `.mcp.json` versionado con configuración MCP sin secretos. Luego se detectó que el archivo debía ser local-only, igual que `.env` y `.env.local`, porque puede necesitar tokens reales durante desarrollo. |
| Por qué fue un problema | La metodología no distinguía con suficiente claridad entre configuración MCP versionable sin secretos y configuración MCP local con secretos reales. Eso puede inducir a trackear archivos que luego necesitan credenciales. |
| Qué esperaba el usuario | Que `.mcp.json`, `.env` y `.env.local` puedan existir localmente en el proyecto para desarrollo, pero estén excluidos de Git y de cualquier tracking/export automático. |
| Qué hizo el agente | Preparó `.mcp.json` sin secretos, lo committeó, verificó historia, y después lo retiró del índice con `.gitignore` y `git rm --cached`. |
| Corrección aplicada | `.mcp.json` quedó ignorado y eliminado del tracking. `.env` y `.env.local` ya estaban ignorados y no tenían historia Git. |
| Impacto | alto |
| ¿Se repite o parece aislado? | repetible |
| Propuesta de mejora metodológica | Agregar una regla explícita: los archivos locales que pueden contener secretos, incluyendo `.mcp.json`, `.env` y `.env.local`, deben crearse o mantenerse solo como archivos ignorados. Si se requiere ejemplo versionable, usar `.mcp.example.json` o `.env.example` con placeholders. Antes de pedir o aceptar tokens, el agente debe verificar `git ls-files` y `git check-ignore` sobre esos archivos. |
| Archivos FromZero posiblemente afectados | `AGENTS.md`, `FIRST_STEPS.md`, `templates/start-here.md`, `templates/state.md`, `library/resources/mcp.md`, `tools/init-project.mjs` |
| Riesgo de compartir | bajo |
| Autorizado para compartir | pendiente |
| Sanitización aplicada | No se incluyeron tokens, valores reales de `.env`, URLs privadas adicionales ni contenido de secretos. |

## Pendientes de sanitización

| Item | Riesgo | Acción requerida | Estado |
|---|---|---|---|
| Validar que el feedback exportable no incluya tokens reales | bajo | Revisar antes de compartir fuera del proyecto | pendiente |

## Export manual

- Feedback exportable preparado: si
- Archivo exportable: `artifacts/fromzero-feedback/fromzero-methodology-feedback.md`
- Autorización del usuario: pendiente
- Nota: el envío al equipo FromZero es manual y requiere revisión humana.
