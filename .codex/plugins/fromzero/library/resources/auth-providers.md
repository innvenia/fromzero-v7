# Auth providers

## Cobertura

Supabase Auth, Clerk, Auth.js, Firebase Auth, Cognito, OAuth, OIDC, SAML y proveedores similares.

## Gates

- Flujo de login/logout/session definido.
- RBAC server-side.
- Tenant/account binding definido.
- Tokens no expuestos indebidamente.
- Session expiration y refresh definidos.
- Estados de error seguros.

## Seguridad

- No confiar solo en claims enviados por cliente.
- Validar permisos en servidor.
- Secretos OAuth solo en backend/CI.
- Proteger callbacks y redirects.

## Faltantes

Si el proveedor no esta empaquetado, activar `missing-resource-resolution` y consultar documentación oficial con aprobación.
