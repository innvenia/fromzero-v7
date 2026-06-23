# Checklist de seguridad

- Modo tenant de la spec verificado: multi-tenant o single-tenant con razón.
- RLS cross-tenant y por permisos/ownership dentro del tenant cuando aplique.
- RBAC server-side.
- Validación de inputs en trust boundaries.
- Secretos protegidos: nunca en repo, cliente, logs ni documentación.
- Logs de auditoría en acciones sensibles, con fecha/hora y usuario ejecutor.
- Rate limits en flujos sensibles o costosos.
- Errores seguros sin stack ni secretos.
- Secret scan básico ejecutado en el gate local (diff/credenciales o scanner configurado), sin imprimir secretos; un hallazgo bloquea avanzar.
- Control de SCM blame cuando se usa SonarQube: archivos relevantes commiteados antes del scan final; sin `Missing blame information`; tokens y logs de Sonar sin secretos.
- Consentimiento/cookies no dependen exclusivamente de terceros.
- Integraciones seleccionadas desde `library/manifest.json` revisadas.
- Acceso a servicios externos aprobado antes de usarse.
- `.env.example` documenta solo variables requeridas.
- Ningún secreto fue impreso, mostrado ni versionado; `.env.local` se usó solo para conectar o configurar herramientas (Controlled Secret Runtime Access).
- Archivos con secretos declarados (`.env`, `.env.*` salvo `.env.example`, `.mcp.json` en cualquier nivel) y excluidos de Git y Docker (`.gitignore` y `.dockerignore`).
- Plantillas `.env.example` y `.mcp.example.json` presentes; auditoría periódica de exclusión ejecutada.
- Revisión de seguridad independiente o adversarial por dominio (RLS/RBAC, secretos, webhooks) ejecutada en Sprints sensibles.
