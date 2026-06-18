<!-- FROMZERO_RULES:BEGIN -->
## FromZero

- Este proyecto usa la metodología FromZero (paquete `fromzero`, versión 0.4.33, app Codex).
- Ubicación del paquete: C:\Develop\Apps\framework\fw_v7.4\.codex\plugins\fromzero.
- Ante frases como "revisa este proyecto", "continúa con la ejecución del proyecto" o "ejecuta el siguiente Sprint", aplica las skills FromZero empezando por `fz-context`; el estado central vive en `artifacts/FROMZERO_STATE.md`.
- `Continua con la ejecucion del proyecto` solo reanuda un plan aprobado. Para aprobar un plan en revisión, usa `Apruebo el plan`.
- Guía del usuario: `artifacts/START_HERE.md`. Guía del adaptador: `FIRST_STEPS.md` dentro del paquete.
- Cierre obligatorio de instalación o actualización: copia el bloque final obligatorio mostrado por `tools/init-project.mjs`; no lo resumas, no lo sustituyas por una lista propia y conserva el enlace Markdown a `artifacts/START_HERE.md`.
- Si el proyecto no tiene Git inicializado, recomienda inicializarlo antes de ejecutar FromZero para conservar un punto de partida, revisar cambios y revertir con seguridad.
- No uses pasos, fases, Sprints, etapas ni items visibles numerados como `0`; todo empieza en `1`.
- No leas `.env` reales; documenta variables en `.env.example`.
<!-- FROMZERO_RULES:END -->
