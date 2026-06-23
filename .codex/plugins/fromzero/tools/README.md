# Resource resolver

El resolver da manos operativas al adaptador sin romper seguridad.

## Uso

```bash
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto --docs docs --docs documentation
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto --install
node tools/resource-resolver.mjs --project C:\ruta\del\proyecto --install --force
node tools/resource-resolver.mjs --query "expo stripe postgres" --install
node tools/check-artifacts.mjs --root C:\ruta\del\proyecto
node tools/check-artifacts.mjs --root C:\ruta\del\proyecto --strict
node tools/check-artifacts.mjs --root C:\ruta\del\proyecto --semantic
node tools/git-checkpoint.mjs --project C:\ruta\del\proyecto --dry-run
node tools/git-checkpoint.mjs --project C:\ruta\del\proyecto --allow artifacts/FROMZERO_PLAN.md --allow artifacts/FROMZERO_STATE.md --message "docs(fromzero): update plan checkpoint" --commit
node tools/runtime-smoke.mjs --root C:\ruta\del\repo
```

## Qué hace

- Lee `library/manifest.json`.
- Lee `library/categories.json`.
- Lee `library/registry-index.json`.
- Detecta tecnologías desde PRD, README, `artifacts/FROMZERO_*.md`, documentación del proyecto, `.fromzero/` y archivos de configuración comunes.
- Lee `docs/` y `documentation/` por defecto, o las rutas indicadas con `--docs <ruta>`.
- Dentro de cada ruta documental, lee primero `PRD.md`, `REFERENCE_MODULES.md`,
  `REFERENCE_DATABASE_SCHEMA.md`, `REFERENCE_ARCHITECTURE.md`,
  `REFERENCE_STRUCTURE.md`, `REFERENCE_STACK.md`, `SECURITY_ASSURANCE.md`,
  `SCALABILITY_ASSURANCE.md`, `DEPENDENCY_MATRIX.md` y
  `BOOTSTRAP_REFERENCE.md` cuando existan.
- Detecta triggers con límites de palabra para evitar falsos positivos por substring.
- Reporta `scannedFiles` y `skippedFiles` sin imprimir el contenido escaneado.
- Copia notas de recursos internos seleccionados a `.fromzero/resources`.
- Mantiene `ui-template-reference` dentro de `library/` del plugin; no lo copia al proyecto destino.
- Genera `.fromzero/fromzero.lock.json`.

## Qué no hace

- No lee `.env` reales.
- No lee `.env*`.
- No descarga recursos remotos.
- No instala dependencias.
- No conecta servicios externos.
- No ejecuta scripts de terceros.
- No escanea `.git`, `node_modules`, builds ni artefactos binarios.
- No sobrescribe recursos instalados modificados salvo que uses `--force`.

Los packs externos siguen requiriendo aprobación, versión fija y validación.

## Cargar variables locales (load-env-local.mjs)

`load-env-local.mjs` da acceso operativo a los secretos que la persona puso en
`.env.local`, sin exponerlos (política Controlled Secret Runtime Access). Es distinto del
resolver: el resolver nunca lee `.env` (solo escanea para detectar el stack); este cargador
sí lee `.env.local` a propósito, solo para runtime.

- `node tools/load-env-local.mjs [--project <ruta>]`: reporta solo nombres y `NOMBRE_set:
  true|false`. Nunca imprime valores.
- `node tools/load-env-local.mjs -- <comando> [args...]`: mecanismo dentro-de-sesión. Carga
  `.env.local` (con aliases) en el entorno del comando que lanza y lo ejecuta; nunca imprime
  valores. Es como el agente usa los secretos en Codex y Antigravity (con el icono normal, sin
  lanzadores, sin editar config de la app). Cubre CLI y API directa; los servidores MCP los
  arranca la app, no el agente.
- `node tools/load-env-local.mjs --claude-env-file`: lo usa el hook `SessionStart` de Claude
  Code; vuelca `.env.local` al archivo de entorno de la sesión (`$CLAUDE_ENV_FILE`). No imprime
  valores.
- `node tools/load-env-local.mjs --setup <codex|claude-code|antigravity>`: asegura `.env.local`
  (copia de `.env.example` si falta) y deja un README en `.fromzero/secret-access/`. No crea
  lanzadores ni edita config de la app.
- `node tools/load-env-local.mjs --verify <codex|claude-code|antigravity>`: revisa el estado
  (`.env.local` existe e ignorado, variables con valor) y reporta OK/PENDIENTE y el paso
  restante. Solo nombres, nunca valores.
- Importable desde Node: `import { loadEnvLocal } from "./load-env-local.mjs"` puebla
  `process.env` para scripts de API/SDK.
- Aliases SonarQube: deriva `SONAR_TOKEN`/`SONAR_HOST_URL`/`SONAR_PROJECT_KEY` desde
  `SONARQUBE_*` (y viceversa), para el SonarScanner CLI.
- Guardrails: solo carga si `.env.local` existe y está ignorado por Git; confinado al
  proyecto; nunca imprime valores.

## Validación de artefactos

`check-artifacts.mjs` revisa artefactos `artifacts/FROMZERO_*.md`, `artifacts/START_HERE.md` y artefactos auxiliares estructurados bajo `artifacts/`:

- encabezado H1 y `## Metadatos`;
- campos comunes obligatorios;
- secciones críticas por artefacto;
- ubicación canónica bajo `artifacts/`;
- fuentes por opción en cuestionario;
- conteos REQ/GATE en plan;
- frase recomendada `Apruebo el plan` y variantes claras de aprobación;
- validación semántica determinística opcional con `--semantic`;
- drift de artefactos antiguos sin bloquearlos por defecto.

Usa `--strict` para bloquear drift antiguo cuando estés re-aprobando o migrando
artefactos. Usa `--semantic` como revisión separada y explícita para fuentes
omitidas, zonas humanas, especialistas, razones de `no aplica` y automatizaciones
sin filtro. En modo proyecto real, `--semantic` ignora templates empaquetados y
valida solo artefactos del proyecto. Usa `--templates --strict` para revisar
templates empaquetados. Usa `--self-test` para validar los casos internos del
script.

Las validaciones runtime completas deben ejecutarse desde cada adaptador
empaquetado (`adapters/codex`, `adapters/claude-code`, `adapters/antigravity`).
`core/tools` es fuente común; no incluye la librería empaquetada completa de cada
conector.

## Checkpoints Git seguros

`git-checkpoint.mjs` clasifica el working tree antes de crear un checkpoint:

- `fromzero-artifact`: cualquier ruta bajo `artifacts/` o lockfile FromZero;
- `external`: cambios fuera del allowlist;
- `sensitive`: `.env`, secretos, tokens o llaves.

Por defecto solo reporta. Con `--commit`, stagea únicamente rutas declaradas con
`--allow`; si existe cualquier cambio fuera del allowlist o sensible, bloquea el
commit y muestra la clasificación. No ejecuta `git reset`, no fuerza commits y no
incluye archivos por patrón implícito.

## Smoke test de runtime

`runtime-smoke.mjs` inspecciona manifests, hooks empaquetados y CLI local
disponible para registrar capacidades reales por adapter. No instala plugins, no
modifica manifests y no activa hooks. Sirve para decidir si una capacidad puede
pasar de referencia empaquetada a runtime activo.
