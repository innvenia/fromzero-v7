# Checklist de integraciones

- `library/manifest.json` leído.
- `library/categories.json` leído.
- `library/registry-index.json` consultado cuando se necesite.
- Integraciones detectadas desde PRD, stack y archivos de configuración.
- Recursos coincidentes cargados desde `library/resources/`.
- Categoría como fallback cuando no hay recurso exacto.
- `missing-resource-resolution` usado para tecnologías no cubiertas.
- Servidores MCP aplicables propuestos con aprobación (ver `library/resources/mcp.md`).
- Variables documentadas en `.env.example`.
- Secretos listados pero nunca expuestos.
- Conexiones externas solo con aprobación explícita.
- Descargas externas solo con aprobación explícita y versión fija.
- Recurso faltante dispara pregunta de documentación oficial o sync de pack.
- Gates por integración incluidos en plan y release.
