# ADR

Ruta de salida: `artifacts/adr/005-core-ai-openrouter.md`

## Metadatos

| Campo | Valor |
|---|---|
| Artefacto | ADR |
| Propósito o subtítulo | Core AI, OpenRouter y privacidad |
| Proyecto | From Zero Framework |
| Versión del adaptador FromZero | 0.4.33, instalación local del proyecto |
| Fecha de creación | 2026-06-18 |
| Última actualización | 2026-06-18 |
| Estado actual | aprobado |
| Historial de estados | 2026-06-18: creado desde Spec aprobada para alimentar el Plan; 2026-06-18: propagados campos y guardrails de Core AI, requiere re-aprobación; 2026-06-18: re-aprobado por aprobación explícita del plan vigente |
| Aprobación del usuario | aprobada |
| Fecha de aprobación | 2026-06-18 |
| Frase literal de aprobación | Apruebo el plan. |
| Artefactos prerequisito | `artifacts/FROMZERO_SPEC.md` aprobado como base |
| Documentos o fuentes asociadas | `docs/REFERENCE_ARCHITECTURE.md`, `docs/SECURITY_ASSURANCE.md`, `docs/REFERENCE_THREAT_MODEL.md`, `artifacts/FROMZERO_SPEC.md`, OpenRouter |
| Artefactos derivados o relacionados | `artifacts/FROMZERO_PLAN.md`, `core-ai/`, `.env.example` |
| Commit asociado | pendiente |
| Restricciones de seguridad | Sin secretos ni `.env` reales. No se llamó a OpenRouter en esta fase. |

## Decisión

Diseñar Core AI como servicio interno multi-provider con OpenRouter como provider inicial y modelo fijado por configuración a `google/gemma-4-26b-a4b-it:free`. El catálogo de modelos debe guardar pricing unit/currency, ventana de contexto, límites de input/output, modalidades, timeout, costo máximo por petición, fallback y deprecación. El modelo debe verificarse nuevamente antes de cualquier Spec ejecutable o implementación que dependa de disponibilidad, precio, límites o deprecación.

## Contexto

La Spec ya registró verificación externa del ID OpenRouter durante especificación, pero el riesgo sigue alto porque proveedores y modelos pueden cambiar. Core AI requiere opt-in, redacción de datos sensibles, budgets por tenant/usuario/feature y logs de uso.

## Opciones

| Opción | Resultado |
|---|---|
| OpenRouter adapter con modelo fijado | Elegida. Cumple Q063/C011 y reduce ambigüedad. |
| Modelo genérico `Gemma 4` | Rechazada. El identificador puede no existir. |
| IA expuesta directo desde UI | Rechazada. Incumple servicio interno y privacidad. |

## Tradeoffs

- Se requiere revalidación de modelo antes de Build.
- Multi-provider aumenta superficie de contratos, pero evita lock-in.
- Budgets y redacción agregan complejidad inicial, pero reducen fuga y costos.

## Impacto seguridad

- Core AI no se expone como API pública sin gateway autorizado.
- Prompts y respuestas sensibles deben tener redacción y retention configurable.
- API key OpenRouter solo en servidor o secret store.
- Logs de IA deben evitar secretos y PII innecesaria.

## Impacto escalabilidad

- Budgets, rate limits y retries protegen costos.
- Context window, pricing unit, currency, input/output limits, modalities, timeouts y fallback se tratan como datos configurables.
- Redis puede activarse después si throttling distribuido lo requiere.

## Resultado

El Plan debe ubicar Core AI después de datos, auth, API e integraciones base. Sprint Core AI debe bloquearse si no se revalida el ID exacto de OpenRouter y si no existen tests de budgets, redacción, adapter errors, pricing/currency, límites técnicos por petición, modalidades, fallback y deprecación.
