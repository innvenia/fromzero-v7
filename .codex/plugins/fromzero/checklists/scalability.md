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
