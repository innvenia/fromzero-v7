# Resend

## Activar cuando

- El proyecto envía correo transaccional (verificación, reset, notificaciones).
- Se requiere proveedor de email con API y dominios verificados.

## Reglas

- `RESEND_API_KEY` es secreto: vive fuera del repo, solo en servidor.
- No enviar correo real desde entornos de desarrollo sin sandbox o dominio de prueba.
- Documentar el remitente y los dominios verificados en la spec.

## Variables

Secreto:

- `RESEND_API_KEY`

## Gates

- Dominio verificado antes de envío en producción.
- Plantillas sin secretos ni PII innecesaria.
- Errores de envío manejados sin exponer el token.
