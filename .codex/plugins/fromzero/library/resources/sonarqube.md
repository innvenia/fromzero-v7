# SonarQube

SonarQube es opcional. El estándar de calidad interno FromZero (`docs/gates.md`) aplica exista
o no esta herramienta; cuando está configurada, es el verificador preferente de esas métricas y
aporta el control de SCM blame.

## Activar cuando

- El proyecto exige quality gate.
- Hay CI/CD con análisis estatico.
- Hay requerimientos de seguridad o cobertura antes de release.

## Quality Gate oficial vs estándar interno FromZero

- Quality Gate oficial de SonarQube: el configurado en el servidor; puede pasar solo por métricas
  de *new code*. Es opcional y no sustituye al estándar interno.
- Estándar de calidad interno FromZero (bloqueante, definido en `docs/gates.md`):
  - bugs: 0; vulnerabilities: 0; security hotspots abiertos: 0.
  - code smells introducidos por el Sprint: 0.
  - `duplicated_lines_density` ≤ 3% (ideal 0%); `new_duplicated_lines_density` ≤ 3%.
  - coverage global ≥ 80%; new coverage ≥ 80%.
  - open issues: 0 antes de iniciar el siguiente Sprint.
- El incumplimiento bloquea el cierre salvo justificación y aprobación humana registradas en
  `artifacts/FROMZERO_DECISIONS.md`.

## Reglas

- SonarQube es gate de calidad, no dependencia runtime.
- `SONARQUBE_TOKEN` debe vivir en secrets de CI o entorno local seguro.
- No imprimir tokens ni logs con secretos.
- Si no hay configuración Sonar, `fz-release` reporta el estándar interno verificado con el
  toolchain local (coverage del runner, lint, typecheck, audit y revisión manual de duplicación), o
  lo registra como pendiente o limitación.
- Si se usa SonarScanner CLI, mapear `-Dsonar.host.url=$SONARQUBE_URL` y `-Dsonar.token=$SONARQUBE_TOKEN`; el CLI no lee `SONARQUBE_*` directamente.

## Flujo local

1. Antes del Sprint: validar acceso con `node tools/load-env-local.mjs --verify <plataforma>` (solo
   presencia de `SONARQUBE_*`) y alcanzabilidad del servidor (`GET api/system/status`). No validar
   el tooling tarde.
2. Antes del cierre: commitear los archivos relevantes y ejecutar el scan (SonarScanner CLI o el
   mecanismo de CI configurado).
3. Después del scan: consultar `api/qualitygates/project_status`, `api/issues/search` y
   `api/measures/component` (coverage, new_coverage, duplicated_lines_density, bugs, vulnerabilities,
   code_smells, security_hotspots).
4. Registrar las métricas y el resultado en el handoff (`## Gate de calidad`).

## Control de SCM blame

- No ejecutar el reporte final con archivos relevantes sin versionar.
- Los archivos nuevos o modificados analizados deben estar commiteados, o el scan se documenta
  explícitamente como preliminar.
- El log no debe mostrar `Missing blame information`; si aparece, el Sprint no se considera cerrado.

## Variables

Documentar en `.env.example` si se ejecuta local:

- `SONARQUBE_URL`
- `SONARQUBE_PROJECT_KEY`

Secreto:

- `SONARQUBE_TOKEN`

## Gates

- Quality Gate oficial sin bloqueantes (cuando se usa).
- Estándar de calidad interno FromZero cumplido o desviación justificada y aprobada.
- Security hotspots abiertos: 0.
- Coverage global y new ≥ 80%; duplicación ≤ 3%.
- Sin `Missing blame information` en el log del scan final.
- Excepciones justificadas y registradas.
