# Stack router

## Activar cuando

- El PRD menciona un lenguaje, framework, proveedor, runtime o herramienta.
- El stack del cliente no coincide exactamente con los recursos específicos del manifest.

## Procedimiento

1. Extraer tecnologías mencionadas en PRD, package files, config files y solicitud del usuario.
2. Buscar coincidencias exactas en `library/manifest.json`.
3. Buscar categoría en `library/categories.json`.
4. Activar recursos específicos y recursos de categoría.
5. Si no hay coincidencia suficiente, activar `missing-resource-resolution`.

## Salida requerida

- Tecnologías detectadas.
- Recursos activados.
- Recursos faltantes.
- Variables para `.env.example`.
- Secretos esperados.
- Gates adicionales.

## Regla

Una tecnología detectada no autoriza instalar paquetes, conectar servicios ni descargar packs sin aprobación.
