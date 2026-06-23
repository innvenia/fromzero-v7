# AI providers

## Cobertura

OpenAI, Anthropic, Gemini, Ollama, Hugging Face, Replicate, Runpod y proveedores/model runtimes similares.

## Gates

- Budget caps.
- Rate limits.
- Timeouts.
- Tenant audit.
- Prompt injection review.
- Data retention decisión.
- PII handling.
- Fallback behavior.
- Modelo verificado contra fuente oficial con cita (URL + qué se comprobó + fecha) antes de declararlo verificado.

## Seguridad

- API keys solo en backend/CI.
- No enviar datos sensibles sin base legal y decisión explícita.
- Logs sin prompts sensibles completos si contienen PII.
- Revisar egress y residency cuando aplique.

## Faltantes

Si el proveedor no esta empaquetado, activar `missing-resource-resolution` y usar documentación oficial aprobada.
