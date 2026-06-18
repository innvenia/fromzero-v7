# From Zero UI Template

Plantilla standalone migrada desde la plantilla de diseño original hacia una base usable para el From Zero Framework y para aplicaciones comerciales construidas sobre ese framework.

El objetivo de este proyecto es conservar la paridad visual y funcional de la plantilla original, pero dentro de una estructura Next.js moderna, auditable y preparada para extracción progresiva de componentes reutilizables.

Esta plantilla es una **librería de estructura y componentes, no un producto**: no se copia tal cual, se usa como fuente de áreas maestras, patrones y look-and-feel para construir la app destino en su propio stack.

## Mapa de Documentación

Orden de lectura para cualquier IA o desarrollador. README y `AGENTS.md` referencian el set completo, sin importar cuál se lea primero.

1. `README.md` — estado, stack/versiones, comandos y estructura.
2. `docs/interface-architecture.md` — **áreas maestras** (Topbar, Sidebar, Brand, Workspace, Page Header, Notice Bar, Ad Rail, Upgrade Slot, Side Panel), áreas comodín, personalización global y migración de componentes entre apps. Mapa de alto nivel de la UI.
3. `docs/design-system.md` — tokens, personalización, inventario, API de componentes, animaciones, principios premium, accesibilidad y metodología de extracción. **Obligatorio antes de crear cualquier elemento.**
4. `AGENTS.md` — contrato para IA: qué NO heredar y patrones de reemplazo.
5. `CLAUDE.md` / `AGENTS.md` — archivos de contrato para agentes de codificación. `AGENTS.md` es el canónico; cualquier agente o modelo que siga esa convención lo lee como contrato principal.

## Estado Actual

- Plantilla funcional en Next.js App Router.
- `src/legacy` fue eliminado.
- No hay imports runtime desde `@/legacy`.
- La plantilla visual principal vive en `src/web/template/migrated`.
- La ruta publica de Salus proveedores vive como app demo en `src/web/apps/salus`.
- `src/web/apps/*` separa CRM, E-Commerce, Soporte, Inteligencia Artificial y Salus como dominios demo sin mover el catalogo migrado riesgoso.
- `AGENTS.md` define el contrato para que agentes de IA usen esta plantilla como referencia sin heredar deuda migrada.
- Existe contrato de áreas maestras en `docs/interface-architecture.md`: nomenclatura canónica, áreas comodín, Side Panel parametrizable, personalización global y migración de componentes entre apps.
- Existe design system completo en `docs/design-system.md` con tokens, personalización global, inventario de componentes, API, reglas de animación, principios premium, accesibilidad y metodología de extracción. Es lectura obligatoria antes de crear cualquier elemento nuevo.
- El menu izquierdo fue reorganizado por dominios: `Parametros`, `Paneles de control`, `Funciones Demo`, `UI Kit` y `Apps Demo`.
- El dashboard principal fue renombrado de `Resumen` a `Pipeline comercial`.
- El titulo global del sitio es `From Zero`.

## Stack

Verificado contra npm a junio 2026. Todo el stack está en su última major compatible; no hay incompatibilidad estructural entre Next.js 16, React 19 y Tailwind 4.

| Paquete | Versión | Notas |
|---|---|---|
| Next.js | `16.2.7` | App Router. Peer React `^19`. |
| React / React DOM | `19.2.7` | — |
| TypeScript | `5` | Modo estricto. |
| Tailwind CSS | `^4` (4.3.0) | `@tailwindcss/postcss`, motor Oxide/lightningcss. CSS-first `@theme` alineado con los tokens. |
| next-intl | `4.13.0` | Peer soporta Next 16 / React 19. |
| Recharts | `3.8.1` | Gráficas nuevas. React 19 OK. |
| lucide-react | `1.17.0` | Iconos. |
| radix-ui | `1.4.3` | Primitivas headless. React 19 OK. |
| zod | `4.4.3` | Validación. |
| sonner | `2.0.7` | Toasts. |
| ESLint | `9` (`eslint-config-next 16.2.7`) | — |
| Playwright | `1.60.0` | e2e. |
| Chart.js `4.4.4`, Leaflet `1.9.4` | — | Solo paridad de pantallas migradas; no usar en código nuevo. |

**Política de versiones:** preferir la última versión estable (parches de seguridad), validando con `npm audit`, `lint`, `build` y `test:e2e`. Riesgo residual documentado: advisory moderado de `postcss` heredado transitivamente vía Next.js. No ejecutar `npm audit fix --force` (degradaría Next.js a una versión incorrecta); aceptar y monitorear hasta que exista un rango limpio. Ver "Auditoria De Seguridad".

## Comandos

```bash
npm install
npm run dev
npm run lint
npm run build
npm run test:e2e
```

El servidor de desarrollo corre en:

```text
http://localhost:3001
```

Rutas principales:

- `http://localhost:3001/es#dashboard`
- `http://localhost:3001/es/salus/proveedores`
- `http://localhost:3001/es/examples/ui` — catálogo de primitivas del framework.
- `http://localhost:3001/es/examples/shell` — demo en vivo de las 9 áreas maestras (AppShell completo).

## Estructura

- `src/app`: App Router fino con segmento `[locale]`. No debe concentrar logica de producto.
- `src/framework`: base reutilizable del framework. Aqui viven UI compartida, utilidades, i18n base, rutas y componentes extraidos.
- `src/framework/ui/components`: componentes reutilizables del framework.
- `src/framework/lib/routes.ts`: contrato actual de rutas y navegacion de la plantilla.
- `src/web`: superficies de aplicacion y experiencias demo montadas sobre el framework.
- `src/web/apps`: capa de apps demo por dominio; hoy expone manifests y la runtime standalone de Salus proveedores.
- `src/web/template/examples`: ejemplos internos de uso correcto de componentes framework.
- `src/web/template/migrated`: catalogo visual migrado y funcional de la plantilla.
- `docs`: contrato de áreas maestras (`interface-architecture.md`) y design system (`design-system.md`).
- `tests/e2e`: pruebas smoke y de paridad funcional basica.

## Que Se Migro

- Shell principal: sidebar, header, dark mode, drawers, dropdowns, loader y layout.
- Dashboards.
- UI Kit: botones, cards, badges, alerts, inputs, tabs, modales, graficas y encuestas.
- Formularios, tablas, calendario, agenda, directorio, tareas, perfil, chat e inbox.
- Apps demo: E-Commerce, CRM, Soporte, Inteligencia Artificial y Salus.
- Operaciones: export, import, email templates, report builder y webhooks.
- Sistema: notificaciones, busqueda, reportes, wizard, audit log y paginas de error.
- Contenido/producto: changelog, roadmap, feedback, status y help desk.
- Ruta dedicada `/es/salus/proveedores` como experiencia Next real.

## Navegacion Actual

La navegacion izquierda esta organizada asi:

- `PARAMETROS`
  - Parametros
  - Configuracion
  - Gestion de usuarios
- `PANELES DE CONTROL`
  - Pipeline comercial
  - Ventas
  - Marketing
  - CRM
  - Analiticas
  - Finanzas
  - IA · Uso
  - E-Commerce
  - Bolsa
- `FUNCIONES DEMO`
  - Calendario
  - Agenda
  - Directorio de contactos
  - Tareas
- `UI KIT`
  - Componentes UI
  - Formularios
  - Tablas
  - Paginas
  - Autenticacion
  - Feedback
  - Onboarding
  - Sistema
  - Otros
- `APPS DEMO`
  - E-Commerce
  - CRM
  - Soporte
  - Inteligencia Artificial
  - Salus

## Contratos De La Plantilla

- `AGENTS.md` es el contrato operativo para cualquier IA o agente que consulte esta plantilla.
- Componentes nuevos del framework van en `src/framework/ui/components`.
- Las clases se componen con `cn` desde `@fw/lib/utils`.
- Exportar componentes nuevos desde `src/framework/ui/components/index.ts`.
- Los mensajes base del framework viven en `src/framework/i18n/{locale}`.
- Los mensajes especificos de aplicacion se preparan en `src/web/i18n/{locale}`.
- Pantallas demo o comerciales migradas viven en `src/web/template/migrated` o `src/web/**`.
- No se debe reintroducir `src/legacy`.
- No se debe importar desde `@/legacy`.
- Codigo nuevo debe usar rutas Next, props explicitas, hooks tipados y componentes reutilizables.
- Para graficas nuevas usar `recharts`; Chart.js queda solo para pantallas migradas que todavia dependen de compatibilidad visual.

## Como Crear Una Pantalla Nueva

1. Crear una ruta Next real en `src/app/[locale]/...` o un modulo de app bajo `src/web/apps/<dominio>`.
2. Componer la pantalla con componentes de `@fw/ui/components`.
3. Mantener datos mock, adapters y helpers dentro del dominio de `src/web/apps/<dominio>` mientras no sean framework.
4. Evitar `window.*`, `location.hash` y registros globales.
5. Agregar smoke e2e si la pantalla queda expuesta a usuarios.

## Como Crear Un Componente Nuevo

1. Crear el componente tipado en `src/framework/ui/components`.
2. Usar `cn` para componer clases y reutilizar tokens/clases existentes antes de agregar CSS.
3. Exportarlo desde `src/framework/ui/components/index.ts`.
4. Agregar ejemplo minimo en `/es/examples/ui` si el componente es base.
5. Documentarlo en el inventario de `docs/design-system.md` (§9) y, si introduce un área maestra, en `docs/interface-architecture.md`.

## Compatibilidad Temporal Aceptada

El catalogo migrado conserva algunos patrones de compatibilidad dentro de `src/web/template/migrated`:

- `window.*` para coordinacion entre pantallas migradas.
- Hash routing para mantener paridad visual con la plantilla original.
- Chart.js en pantallas existentes.
- Algunas pantallas `.jsx` generadas desde la migracion.

Esa compatibilidad esta aislada del framework reutilizable. No debe copiarse como patron para componentes nuevos ni para aplicaciones comerciales nuevas.

Antes de usar una pantalla migrada como insumo para framework o aplicaciones finales, consultar:

- `AGENTS.md` (qué NO heredar y patrones de reemplazo).
- `docs/design-system.md` §16 (metodología de extracción) y §9 (inventario).

## Validacion Actual

La plantilla fue validada con:

```bash
npm run lint
npm run build
npm run test:e2e
```

Cobertura e2e actual:

- Shell completo y header.
- Dropdowns del header.
- Rutas hash migradas.
- Rutas Next que redirigen a vistas migradas.
- Ruta standalone `/es/salus/proveedores`.
- Ruta framework `/es/examples/ui`.
- Ruta framework `/es/examples/shell` (AppShell con las 9 áreas maestras).
- Drawer/menu mobile.
- Dark mode.
- Apps demo principales: CRM, E-Commerce, Soporte, IA y Salus.
- Smoke matrix de rutas migradas.

Tambien se valido en browser:

- Dashboard principal.
- Menu reorganizado.
- Dark mode.
- Ruta Salus proveedores.
- Titulo global `From Zero`.

## Auditoria De Seguridad

`npm audit --omit=dev` reporta una vulnerabilidad moderada de `postcss` heredada transitivamente vía el tooling de Next.js.

No se aplica `npm audit fix --force` porque degradaría Next.js a una versión incorrecta para este stack. Tras el bump a Next.js `16.2.7`, la acción correcta es re-ejecutar `npm audit` y, si no hay un rango limpio, aceptar y monitorear el riesgo (moderado, transitivo, fuera del runtime de cliente).

## Pendientes

- Reducir progresivamente `window.*` dentro de `src/web/template/migrated`.
- Reemplazar hash routing interno por contratos explicitos de navegacion cuando el framework tenga sus rutas definitivas.
- Extraer componentes reutilizables adicionales desde pantallas migradas hacia `src/framework/ui/components`.
- Separar datos mock de pantallas demo en modulos de dominio cuando se definan los contratos reales.
- Extraer sidebar/header del runtime migrado cuando exista contrato final de shell.
- Revisar visualmente pixel a pixel contra la plantilla de diseño original si se necesita certificacion estricta de paridad visual.
- Evaluar upgrade compatible de Next.js cuando exista una solucion limpia para el aviso de `postcss`.

## Criterio De Uso

Esta plantilla ya puede usarse como base de referencia para el framework y para construir aplicaciones demo/comerciales, con una regla:

El framework reutilizable debe vivir en `src/framework`; las pantallas migradas sirven como catalogo visual y funcional, no como patron final de arquitectura.
