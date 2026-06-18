# Librería interna FromZero

Esta librería es parte del adaptador distribuible. Debe viajar con el adaptador para que pueda operar sin depender de rutas externas ni descargas en runtime.

## Uso

1. `fz-context` lee `library/manifest.json`.
2. Lee `library/categories.json` para mapear stacks comunes.
3. Revisa `library/registry-index.json` cuando falta un recurso específico.
4. Detecta tecnologías, riesgos e integraciones desde PRD, stack, archivos de configuración y solicitud del usuario.
5. Selecciona recursos por `triggers` y `phases`.
6. Lee solo los recursos seleccionados.
7. Pide aprobación antes de instalar dependencias, descargar packs o conectar servicios externos.

## Seguridad

- No leer `.env` reales.
- Usar solo `.env.example` para documentar variables.
- No imprimir tokens, URLs privadas, passwords ni claves.
- No conectar servicios externos sin aprobación explícita.
- No descargar recursos remotos sin versión fija y aprobación.

## Regla

La metodología base debe funcionar aunque ningún recurso externo pueda descargarse.

## UI

Para apps con UI, activar `fromzero-ui-template`. La fuente canónica es la referencia empaquetada `library/ui-template-reference`. El template upstream solo sirve para refrescar la referencia cuando esté accesible; no es normativo.
