# Imágenes de referencia de UI

Capturas del UI del template From Zero **renderizado**. Son la referencia visual canónica para juzgar si el UI generado de una app final se apega al look-and-feel y a la estructura de áreas maestras del Design System.

No son objetivos pixel-perfect ni contenido a copiar: la app final usa su propio dominio, datos y textos. Lo que debe apegarse es la **estructura de áreas maestras, los tokens, los patrones de componentes y los estados**.

## Cómo usarlas en la validación

Al generar o revisar UI (skill `fz-ui`, checklist `ui`), compara el render real contra la imagen de la pantalla equivalente y reporta adherencia o desviación en:

1. **Áreas maestras** presentes y en su lugar (ver `docs/interface-architecture.md`): Topbar, Sidebar, Brand, Workspace, Page Header, Notice Bar, Ad Rail, Upgrade Slot, Side Panel.
2. **Tokens visuales** (ver `docs/design-system.md`): color de acento, radios, densidad, tipografía, modo claro/oscuro. Sin hex hardcodeado.
3. **Patrones de componentes**: stat cards, tablas con cabecera, badges de estado, breadcrumbs, formularios seccionados, progress bars, callouts.
4. **Estados y semántica de color**: verde = éxito/activo/pagado, ámbar = pendiente/advertencia, rojo = error/destructivo, azul/violeta = informativo/rol.

La salida esperada no es "igual/distinto", sino una lista de desviaciones accionables contra el patrón de referencia.

## Catálogo

| Archivo | Pantalla del template | Áreas maestras visibles | Patrones clave a validar |
|---|---|---|---|
| `ui_dashboard_example.jpg` | Panel · Pipeline comercial (dashboard principal) | Topbar, Sidebar completa con grupos, Page Header con acciones, Workspace, Ad Rail, Upgrade Slot | Stat cards con delta, gráficas (barras apiladas, línea de objetivo, donut), lista de agenda, tabla de registros recientes con badges de etapa |
| `ui_general_params.jpg` | Parámetros · General | Sidebar (grupo Parámetros expandido), Page Header con "Guardar cambios", Ad Rail | Formulario seccionado, grid de campos 2 columnas, uploader de logo, selects de regionalización, "Zona de peligro" con acciones destructivas |
| `ui_security.jpg` | Parámetros · Seguridad | Sidebar, Page Header, Ad Rail | Formulario de contraseña, bloque 2FA con badge de estado, lista de sesiones activas con acción revocar, historial con badges éxito/fallo |
| `ui_customization.jpg` | Parámetros · Apariencia (personalización global) | Sidebar, Page Header, Ad Rail | Superficie de personalización: color de acento, escala de radios, densidad, estilo de sidebar, tipografía, tema, loaders, barra de anuncios, panel publicitario, upgrade, onboarding. Toggles y sliders |
| `ui_invoicing.jpg` | Parámetros · Facturación & Suscripción | Sidebar, Page Header con "Cambiar plan", Ad Rail | Card de plan con features, progress bars de uso, card de método de pago con badge, tabla de facturas con estado y descarga |
| `ui_profile_view.jpg` | Gestión de usuarios · Perfiles (roles/RBAC) | Sidebar (grupos Gestión de usuarios y UI Kit), Page Header, Ad Rail | Master-detail de perfiles con barras de permisos, matriz de permisos (módulos × acciones) con checkboxes |
| `ui_user_view.jpg` | Gestión de usuarios · Usuarios | Sidebar, Page Header con "Invitar usuario", Ad Rail | Stat cards de resumen, toolbar con búsqueda y filtros, data table con selección, avatares, badges de perfil/estado, acciones por fila |
| `ui_api_keys.jpg` | Páginas · API Keys | Sidebar (grupos UI Kit y Apps Demo), Page Header con "Nueva clave", Ad Rail | Stat cards, tabla de claves con valor enmascarado (revelar/copiar), badges de permisos, fila inactiva atenuada, callout de documentación |

## Referencias cruzadas

- `docs/interface-architecture.md`: vocabulario y mapa de áreas maestras.
- `docs/design-system.md`: tokens, inventario de componentes y reglas de adherencia.
- `src/framework/ui/README.md`: primitivas disponibles.
