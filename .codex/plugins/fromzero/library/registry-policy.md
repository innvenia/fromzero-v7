# Registry policy

## Objetivo

Permitir que el plugin maneje stacks de cliente no empaquetados sin perder seguridad, trazabilidad ni reproducibilidad.

## Regla base

El plugin debe funcionar con su librería interna. El registry externo es opcional.

## Cuando usar registry

Usar solo si:

- el PRD requiere una tecnología no cubierta por `library/manifest.json`;
- `library/categories.json` no tiene una categoría suficiente;
- el usuario aprueba buscar o sincronizar un pack;
- el pack tiene versión fija;
- se puede verificar fuente oficial, checksum o revisión.

## Prohibido

- Descargar automáticamente.
- Ejecutar scripts remotos sin revisión.
- Instalar dependencias sin explicar impacto.
- Guardar secretos en el plugin.
- Reemplazar gates FromZero por reglas del pack.

## Flujo

1. Detectar tecnología faltante.
2. Buscar categoría en `library/categories.json`.
3. Buscar pack candidato en `library/registry-index.json`.
4. Si existe candidato, pedir aprobación para sincronizar.
5. Si no existe candidato, pedir aprobación para consultar documentación oficial.
6. Crear recurso curado local antes de usarlo como regla persistente.
7. Registrar fuente, versión, fecha y gates afectados.

## Respuesta esperada al usuario

```text
No tengo un recurso empaquetado para [tecnologia].
Puedo usar el recurso generico [categoria] y, si apruebas, consultar documentacion oficial o sincronizar un pack versionado.
```
