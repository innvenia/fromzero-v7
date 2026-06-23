# Checklist de UI

- Tokens del Design System usados; sin hex hardcodeados.
- Componentes del Design System aplicable según la decisión de UI de la spec.
- Adherencia a la referencia visual: si la UI deriva de la referencia empaquetada, render contrastado contra `library/ui-template-reference/docs/ui-reference-images`; desviaciones de áreas maestras, tokens o patrones reportadas.
- Textos visibles cubiertos por i18n: labels, callouts, modales, mensajes, toasts, errores y empty states.
- Responsive verificado en 375, 768 y 1920.
- WCAG 2.2 AA objetivo: labels asociados, focus visible, targets mínimos 44x44.
- Estados loading, empty, error y success presentes.
- Sin overflow horizontal ni overlap.
- Resultado verificado en el navegador integrado o la extensión del agente, no solo en el código.
- Consola y red del navegador sin errores de JavaScript, red o recursos sin resolver, o registrados con razón.
- Evidencia visual (capturas) adjunta, o fallback declarado si no hay navegador disponible.
- Formularios complejos agrupados por secciones, tabs o wizard.
- Sin deuda migrada: `window.*`, hash routing, globals runtime ni JSX sin tipar.
- Props de componentes declaradas como `Readonly<Props>`; sin mutar props; tipos exportados estables.
- Componente UI exportado con test contractual mínimo (`docs/testing.md`): render básico, variant/tone relevante, `className` passthrough si aplica y defaults seguros.
