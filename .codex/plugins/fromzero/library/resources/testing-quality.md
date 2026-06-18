# Testing and quality

## Cobertura

Vitest, Jest, Cypress, Playwright, Testing Library, Storybook, ESLint, Biome, SonarQube, k6 y herramientas similares.

## Gates

- Unit tests para lógica.
- Integration tests para APIs, permisos y datos.
- E2E para flujos críticos.
- Responsive/visual QA si hay UI.
- Load tests si hay release crítico.
- Quality gate si el proyecto lo exige.

## Seguridad

- Tests sin datos reales sensibles.
- No imprimir secretos en logs.
- Configurar tokens de herramientas en CI secrets.

## Faltantes

Si una herramienta no esta empaquetada, activar `missing-resource-resolution`.
