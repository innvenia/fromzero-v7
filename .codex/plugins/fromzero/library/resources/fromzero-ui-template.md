# FromZero UI template

## Activar cuando

- La app tiene UI.
- El PRD menciona dashboard, formularios, tablas, mobile, componentes, layout o Design System.
- Se toca `src/framework/ui`, `src/web`, tokens, navegación o pantallas.

## Fuente canónica

El adaptador incluye una referencia intrinseca en `library/ui-template-reference`.

Leer siempre:

- `library/ui-template-reference/README.md`.
- `library/ui-template-reference/AGENTS.md`.
- `library/ui-template-reference/docs/interface-architecture.md`.
- `library/ui-template-reference/docs/design-system.md`.
- `library/ui-template-reference/src/framework/ui/README.md`.
- `library/ui-template-reference/src/framework/ui/components`.
- `library/ui-template-reference/src/app/globals.css`.

`library/ui-template-reference` es la fuente canónica del Design System de la metodología: autosuficiente y normativa.

Si el workspace contiene el template upstream del que se extrajo la referencia, puede usarse solo para dos cosas, sin convertirse en fuente normativa:

- refrescar la copia empaquetada cuando haya una versión más reciente;
- consultar el catálogo visual de pantallas migradas como inspiración.

## Si falta un componente o patrón

- Crear el componente siguiendo los tokens, primitivas y reglas de la referencia empaquetada.
- No inventar tokens, shell ni componentes del framework que no existan.
- No copiar deuda migrada desde referencias visuales sin adaptación.
- Documentar el componente nuevo siguiendo la metodología de extracción del design system de la referencia.

## Reglas

- Usar tokens, no hex hardcoded.
- Usar primitivas del sistema antes de crear componentes.
- Mantener i18n con `es` y `en` cuando aplique.
- Verificar 375, 768 y 1920.
- Validar loading, empty, error y success.
- Evitar overflow horizontal y overlap.
- Cumplir WCAG 2.2 AA como objetivo.

## Prohibido

- Copiar `window.*`, `location.hash`, runtime globals o JSX sin tipar.
- Introducir librerías UI nuevas sin justificar.
- Cambiar tokens globales sin documentar impacto.
