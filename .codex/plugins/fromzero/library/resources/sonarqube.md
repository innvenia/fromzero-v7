# SonarQube

## Activar cuando

- El proyecto exige quality gate.
- Hay CI/CD con análisis estatico.
- Hay requerimientos de seguridad o cobertura antes de release.

## Reglas

- SonarQube es gate de calidad, no dependencia runtime.
- `SONAR_TOKEN` debe vivir en secrets de CI o entorno local seguro.
- No imprimir tokens.
- Si no hay configuración Sonar, `fz-release` debe reportarlo como pendiente o limitación.

## Variables

Documentar en `.env.example` si se ejecuta local:

- `SONAR_HOST_URL`
- `SONAR_PROJECT_KEY`

Secreto:

- `SONAR_TOKEN`

## Gates

- Quality Gate sin bloqueantes.
- Security hotspots revisados.
- Coverage policy documentada.
- Excepciones justificadas.
