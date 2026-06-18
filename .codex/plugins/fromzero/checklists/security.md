# Checklist de seguridad

- Modo tenant de la spec verificado: multi-tenant o single-tenant con razón.
- RLS cross-tenant y por permisos/ownership dentro del tenant cuando aplique.
- RBAC server-side.
- Validación de inputs en trust boundaries.
- Secretos protegidos: nunca en repo, cliente, logs ni documentación.
- Logs de auditoría en acciones sensibles, con fecha/hora y usuario ejecutor.
- Rate limits en flujos sensibles o costosos.
- Errores seguros sin stack ni secretos.
- Consentimiento/cookies no dependen exclusivamente de terceros.
- Integraciones seleccionadas desde `library/manifest.json` revisadas.
- Acceso a servicios externos aprobado antes de usarse.
- `.env.example` documenta solo variables requeridas.
- Ningún `.env` real fue leído ni impreso.
