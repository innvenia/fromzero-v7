# Core AI

Runtime de IA del From Zero Framework: capa server-side que selecciona proveedor y modelo.

## Activar cuando

- El proyecto declara un runtime de IA separado (Core AI) con presupuesto y costo auditado.
- Se necesita abstraer el proveedor/modelo detrás de una sola configuración.

## Reglas

- `CORE_AI_SECRET` es secreto y solo se usa server-side.
- `AI_PROVIDER`, `AI_MODEL_ID` y `AI_DEFAULT_MODEL` son configuración no-secreta; `AI_MODEL_ID`/`AI_DEFAULT_MODEL` se ajustan por proyecto.
- Las llaves del proveedor concreto (por ejemplo OpenRouter) viven en su propio recurso, no aquí.
- Presupuesto, rate y costo deben ser auditables.

## Variables

Configuración no-secreta:

- `AI_PROVIDER`
- `AI_MODEL_ID`
- `AI_DEFAULT_MODEL`

Secreto:

- `CORE_AI_SECRET`

## Selección y verificación de modelo

- `AI_MODEL_ID` se ajusta por proyecto y se verifica contra la documentación oficial del proveedor antes de declararse válido: registra fuente (URL), qué se comprobó (id exacto, disponibilidad, tier) y fecha.
- Sin esa verificación, trata el modelo como no verificado; no lo reportes como verificado ni lo fijes como default.
- Define un fallback de modelo verificado cuando aplique.

## Gates

- Budget cap por tenant o proyecto.
- Rate limit aplicado.
- Costo auditado.
- Mitigación de prompt injection cuando hay entrada de usuario.
