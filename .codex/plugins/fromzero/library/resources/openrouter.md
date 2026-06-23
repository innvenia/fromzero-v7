# OpenRouter

Gateway de modelos usado por Core AI como proveedor (`AI_PROVIDER=openrouter`).

## Activar cuando

- El runtime de IA enruta a modelos vía OpenRouter.
- Se requiere acceso unificado a múltiples modelos detrás de una sola API.

## Reglas

- `OPENROUTER_API_KEY` es secreto: solo server-side, fuera del repo.
- El modelo se define en Core AI (`AI_MODEL_ID`); aquí solo vive la credencial del gateway.
- No duplicar la selección de modelo en este recurso.

## Variables

Secreto:

- `OPENROUTER_API_KEY`

## Gates

- Budget cap y rate limit heredados de Core AI.
- Fallback de modelo definido cuando aplique.
