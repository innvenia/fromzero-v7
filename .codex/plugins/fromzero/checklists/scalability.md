# Checklist de escalabilidad

- Decisión de cache.
- Decisión de jobs.
- Índices y paginación para queries críticas (p95 objetivo).
- k6 para flujos críticos; limitación documentada si no se ejecuta.
- KPIs y SLOs de la spec medidos o con relajación justificada.
- Stateless y multi-instancia.
- Quotas definidas.
- Costos estimados.
- Observabilidad definida.
- Decisión Redis/Inngest (Redis opcional, sugerido para multi-instancia).
- Decisión de presupuesto GPU cuando aplique.
- Decisión de capacidad de deployment cuando aplique.
- Por módulo: cache, jobs, índices, paginación y quotas declarados, con escenario k6 o justificación antes de cerrar; issue bloqueante (`templates/issue.md` bajo `artifacts/issues/`) si falta para un flujo crítico.
- Herramientas obligatorias declaradas para el proyecto; lo no seleccionado no bloquea, con compensación documentada.
- Precondiciones de componentes de alto riesgo cumplidas antes de iniciarlos o diferidas con registro: IA/costo (API limitada, budget, redaction, provider fijado), pagos (sandbox, firma de webhook, idempotencia), exportación de datos (rate-limit, auditoría).
- Revisión de escalabilidad independiente o adversarial ejecutada en Sprints sensibles.
