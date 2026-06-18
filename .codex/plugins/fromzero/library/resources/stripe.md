# Stripe

## Activar cuando

- El PRD menciona billing, pagos, Checkout, suscripciones, facturas o webhooks.

## Reglas

- Webhooks deben validar firma.
- Operaciones de billing requieren RBAC server-side.
- Usar idempotency keys donde aplique.
- No confiar en estado enviado por cliente.
- Auditar cambios de plan, pago y suscripción.

## Variables

Públicas:

- `STRIPE_PUBLISHABLE_KEY`

Secretas:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## Gates

- Firma de webhook validada.
- Eventos idempotentes.
- Permisos por acción.
- Estados de billing sincronizados y auditados.
