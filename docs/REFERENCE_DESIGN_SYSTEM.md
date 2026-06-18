---
document: REFERENCE_DESIGN_SYSTEM
name: From Zero Design System Reference
product: From Zero Framework
version: 0.1.0
status: Target framework contract
date: 2026-06-07
owner: Operador del proyecto
purpose: Contrato documental del Design System objetivo del framework.
scope: Define tokens, componentes, layouts, responsive, accesibilidad y reglas de extensión que debe implementar `src/framework/ui`.
related:
  - PRD.md
  - REFERENCE_STRUCTURE.md
---

# From Zero Design System Reference

Este documento define el contrato visual y de interacción que debe implementar el Design System propietario del framework.

Mientras el scaffold del framework no exista, este archivo describe el objetivo que debe materializarse en `src/framework/ui`. Cuando el framework exista, la fuente operativa para agentes y aplicaciones derivadas será el código de `src/framework/ui` y su documentación interna.

## Principios

- El Design System pertenece al framework, no a una plantilla externa.
- Las aplicaciones derivadas consumen componentes, tokens y patrones desde `src/framework/ui`.
- La UI debe ser responsive, accesible con objetivo WCAG 2.2 AA, consistente con shadcn/ui + Tailwind v4 y libre de marcas de terceros.
- Los agentes deben extender componentes existentes antes de crear variantes nuevas.
- La identidad visual final de cada app se resuelve por configuración runtime, no por forks del Design System.

## Contrato objetivo

- `src/framework/ui/components`: componentes base reutilizables.
- `src/framework/ui/grid`: Grid Universal y patrones de tabla/card responsive.
- `src/framework/ui/forms`: controles de formulario, validación visual y layout de formularios.
- `src/framework/ui/layout`: sidebar, header, shell, navegación y zonas de experiencia.
- `src/framework/ui/tokens`: tokens de color, spacing, radius, tipografía y estados.

El stack frontend canónico y su compatibilidad se documentan en [`REFERENCE_STACK.md`](./REFERENCE_STACK.md).
