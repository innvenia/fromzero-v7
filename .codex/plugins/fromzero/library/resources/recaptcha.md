# reCAPTCHA

## Activar cuando

- Hay formularios públicos expuestos a bots o spam (registro, contacto, login).
- Se requiere protección antiabuso antes de operaciones sensibles.

## Reglas

- `RECAPTCHA_SECRET_KEY` es secreto y solo se usa server-side para verificar el token.
- `RECAPTCHA_SITE_KEY` es pública (cliente); no es secreto.
- La verificación del token siempre ocurre en el servidor; nunca confiar solo en el cliente.

## Variables

Pública en cliente:

- `RECAPTCHA_SITE_KEY`

Secreto:

- `RECAPTCHA_SECRET_KEY`

## Gates

- Verificación server-side del token activa.
- Umbral de score definido cuando aplique (v3).
- Fallback accesible para usuarios legítimos.
