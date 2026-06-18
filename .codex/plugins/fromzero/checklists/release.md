# Checklist de release

- Tests relevantes pasan.
- Build reproducible.
- Sonar/audit revisado sin bloqueantes.
- Playwright cubre flujos críticos.
- Verificación visual en navegador de flujos críticos con UI web: render confirmado y consola/red sin errores sin resolver, con evidencia o fallback registrado.
- k6 cubre release candidates o limitación documentada.
- Ningún KPI de la spec queda sin verificar o sin relajación justificada.
- `library/manifest.json` revisado.
- Recursos activados revisados.
- Gates de integración aprobados o limitación documentada.
- `.env.example` actualizado sin secretos reales.
- Sin descargas externas requeridas para ejecutar la metodología base.
- `README.md` del proyecto actualizado con el estado del hito.
- Handoff creado con evidencia y riesgos.
- Aceptación de producto contra visión validada registrada: resultados esperados contrastados contra evidencia, brechas declaradas y aceptación explícita solicitada.
