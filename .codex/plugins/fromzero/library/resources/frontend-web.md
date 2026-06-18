# Frontend web

## Cobertura

Next.js, React, Vue, Nuxt, Angular, SvelteKit, Astro, Remix y frameworks web similares.

## Gates

- Routing y layouts definidos.
- i18n definido si el producto es multi-idioma.
- Estados loading, empty, error y success.
- Responsive 375, 768 y 1920.
- Accesibilidad base.
- E2E o visual QA para flujos críticos.

## Seguridad

- No exponer secretos en cliente.
- No confiar en permisos de UI.
- Sanitizar o escapar contenido dinámico.
- Revisar XSS, CSRF según framework y auth.

## Faltantes

Si el framework tiene reglas específicas no empaquetadas, usar `missing-resource-resolution`.
