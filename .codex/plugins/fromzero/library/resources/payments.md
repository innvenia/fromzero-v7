# Payments

## Cobertura

Stripe, Paddle, MercadoPago, PayPal y proveedores de billing/pagos similares.

## Gates

- Webhooks con firma.
- Idempotencia en eventos.
- Estados de billing auditados.
- RBAC para cambios de plan/pago.
- No confiar en estado enviado por cliente.
- Reconciliación o manejo de fallos.

## Seguridad

- Secret keys solo server-side.
- Logs sin datos de pago sensibles.
- Errores seguros.
- Validar moneda, monto y ownership.

## Faltantes

Si el proveedor no esta empaquetado, usar este recurso genericamente y activar `missing-resource-resolution`.
