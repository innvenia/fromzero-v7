# Missing resource resolution

## Activar cuando

- El PRD menciona tecnología no cubierta por `library/manifest.json`.
- La categoría existe, pero falta una skill específica.
- El usuario pide una herramienta no empaquetada.
- El agente no puede verificar reglas actuales con recursos locales.

## Flujo

1. Nombrar la tecnología faltante.
2. Indicar categoría mas cercana.
3. Revisar `library/registry-index.json`.
4. Si existe pack candidato, pedir aprobación para sincronizarlo.
5. Si no existe pack, pedir aprobación para consultar documentación oficial.
6. No implementar integración específica hasta tener reglas verificables.
7. Crear o proponer recurso local curado antes de convertirlo en patron reutilizable.

## Seguridad

- No descargar automáticamente.
- No ejecutar scripts remotos.
- No instalar dependencias sin aprobación.
- No usar blogs o snippets no oficiales como fuente primaria para seguridad.
- No exponer secretos.

## Respuesta esperada

```text
Detecte [tecnologia], pero no hay recurso especifico empaquetado.
Puedo aplicar el recurso generico [categoria].
Para reglas especificas necesito aprobacion para consultar documentacion oficial o sincronizar un pack versionado.
```
