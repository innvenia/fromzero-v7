# Playwright

## Activar cuando

- Hay UI nueva o modificada.
- Hay flujos críticos de auth, billing, CRUD, permisos o responsive.

## Reglas

- Probar viewports 375, 768 y 1920 cuando haya UI.
- Validar estados loading, empty, error y success.
- Verificar que no haya overflow horizontal ni overlap.
- No usar datos reales sensibles en tests.

## Variables

- `PLAYWRIGHT_BASE_URL`

## Gates

- E2E de flujos críticos.
- Responsive mínimo.
- Smoke de accesibilidad si hay soporte.
- Evidencia o limitación documentada.
