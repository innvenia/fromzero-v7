# From Zero — Arquitectura de Áreas Maestras

Contrato visual de alto nivel de la plantilla `nextjs-template`. Define el **vocabulario canónico** de las zonas que componen la interfaz, su comportamiento y cómo reutilizarlas al construir una aplicación nueva.

**Propósito:** que cualquier modelo de IA o desarrollador pueda referirse sin ambigüedad a cada zona de la UI ("el área del menú", "el Topbar", "el Side Panel ancho") y pueda **migrar componentes entre aplicaciones** que comparten esta misma estructura. Es el primer documento que debe leerse para entender la estructura; el detalle de tokens, componentes y API vive en `design-system.md`.

**Esta plantilla es una librería de estructura y componentes, no un producto.** No se copia tal cual: se usa como fuente de áreas, patrones y look-and-feel para construir la app destino en su propio stack. Ver `AGENTS.md`.

---

## 1. Mapa de áreas maestras

La interfaz se compone de **áreas maestras** con nombre propio. Cada una tiene un nombre canónico (ES), un slug estable (usado en props/código y en conversaciones con cualquier IA) y una clase CSS real.

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  BARRA DE AVISOS  (noticeBar · comodín · notificaciones importantes)             │
├──────────────┬─────────────────────────────────────────────────────────────────┤
│  ZONA DE     │  BARRA SUPERIOR / TOPBAR                                          │
│  MARCA       │  (topbar · search, usuario, idioma, notificaciones)              │
│  (brand)     ├─────────────────────────────────────────────────────────────────┤
│              │                                                                   │
│  MENÚ        │  ÁREA DE TRABAJO (workspace)                                      │
│  LATERAL     │  ┌─────────────────────────────────────────────────────────────┐ │
│  (sidebar)   │  │ ENCABEZADO DE PÁGINA (pageHeader: título+breadcrumb+acciones)│ │
│  colapsable  │  └─────────────────────────────────────────────────────────────┘ │
│              │  dashboards · formularios · vistas · tablas · reports             │
│              │                                                                   │
│  ┌────────┐  │                                              ┌─────────────────┐ │
│  │UPGRADE │  │                                              │ PANEL           │ │
│  │(comodín│  │                                              │ PUBLICITARIO    │ │
│  │ slot)  │  │                                              │ (adRail·comodín)│ │
│  └────────┘  │                                              └─────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────────────┘

   PANEL DESLIZANTE (sidePanel · comodín overlay, entra de derecha a izquierda)
   ┌──────────────┐        ┌────────────────────────────────────┐
   │ narrow 400px │   o    │ wide 75vw                          │
   │ parámetros   │        │ registros / formularios / gráficas │
   └──────────────┘        └────────────────────────────────────┘
```

| # | Nombre canónico | slug | Clase CSS | Tipo | Default | Propósito |
|---|---|---|---|---|---|---|
| 1 | **Barra de avisos** (Notice Bar) | `noticeBar` | `.fz-announce` | comodín | oculta | Notificaciones importantes, ancho completo, top. |
| 2 | **Zona de marca / Logo** (Brand) | `brand` | `.fz-side-head` + `.fz-logo-*` | fija, configurable | visible | Logotipo. Padding/alineación/gap configurables. |
| 3 | **Menú lateral** (Sidebar) | `sidebar` | `.fz-sidebar` / `.fz-nav` | fija, colapsable | visible | Navegación primaria. |
| 4 | **Zona de upgrade** (Upgrade Slot) | `upgradeSlot` | `.fz-side-footer` | comodín | oculta | CTA freemium en el pie del sidebar. |
| 5 | **Barra superior** (Topbar) | `topbar` | `.fz-header` | fija | visible | Búsqueda, menú de usuario, idioma, notificaciones. |
| 6 | **Área de trabajo** (Workspace) | `workspace` | `.fz-main-col` / `.fz-page` | fija | visible | Contenido principal: dashboards, formularios, vistas, reports. |
| 7 | **Encabezado de página** (Page Header) | `pageHeader` | `.fz-page-head` | dentro del workspace | según pantalla | Título + breadcrumb + acciones. **No confundir con el Topbar.** |
| 8 | **Panel publicitario** (Ad Rail) | `adRail` | `.fz-ad-rail` | comodín | oculta | Publicidad freemium, columna derecha. |
| 9 | **Panel deslizante** (Side Panel) | `sidePanel` | `.fz-drawer` | comodín overlay | ancho parametrizable | Contenido libre: formularios, registros, gráficas, parámetros. |

> **Topbar vs Page Header.** El **Topbar** (#5) es la barra superior global del shell (igual en toda la app). El **Page Header** (#7) vive *dentro* del área de trabajo y cambia por pantalla (título de la página, breadcrumb y botones de acción de esa pantalla). Son áreas distintas con nombres distintos.

---

## 2. Áreas comodín y reflow

Un **área comodín** puede estar presente o no según el contexto y las características de la aplicación. Cuando una comodín no se muestra, **el resto de la interfaz ocupa ese espacio** sin distorsionar el viewport.

Áreas comodín:

- **Barra de avisos** (`noticeBar`) — top, ancho completo.
- **Zona de upgrade** (`upgradeSlot`) — pie del menú lateral.
- **Panel publicitario** (`adRail`) — columna derecha.
- **Panel deslizante** (`sidePanel`) — overlay bajo demanda (siempre comodín por naturaleza).

Cómo se activa y reflowa cada una en el `AppShell`:

| Área | Cómo se activa | Reflow al ausentarse |
|---|---|---|
| `noticeBar` | prop `announceBar` → setea `data-announce='true'` en `.fz-app` | El grid recupera la altura `--announce-h`; header y sidebar suben. |
| `adRail` | prop `adRail` → setea `data-ad-rail='true'` en `.fz-app` | El grid pasa de 3 a 2 columnas; el workspace ocupa el ancho liberado (`--ad-rail-w`). |
| `upgradeSlot` | prop `upgradeSlot` → render de `.fz-side-footer` | No afecta el grid; el área de navegación usa el alto completo del sidebar. |
| `sidePanel` | componente `Drawer` montado bajo demanda | Es overlay `fixed`; no ocupa grid (no requiere reflow). |

El grid raíz (`.fz-app`) es responsable del reflow de `noticeBar` y `adRail`. La transición del grid dura `0.22s` con easing `cubic-bezier(.4,.0,.2,1)`.

---

## 3. Panel deslizante (Side Panel) — comodín parametrizable

El Panel deslizante es **un único componente comodín** (`Drawer`) que se adapta por contenido y por dimensiones. Entra deslizándose de derecha a izquierda. Reemplaza la idea de "tener muchos drawers distintos": en su lugar hay un solo concepto con **presets de ancho semánticos**.

| Preset | Prop | Ancho (token) | Uso típico |
|---|---|---|---|
| Angosto | `size="narrow"` (default) | `--drawer-narrow-w` = `400px` | Parámetros, filtros, información puntual. |
| Ancho | `size="wide"` | `--drawer-wide-w` = `75vw` | Registros completos, formularios de alta/edición, gráficas. |
| Custom | `width={…}` | px numérico o valor CSS | Override explícito; tiene prioridad sobre `size`. |

```tsx
import { Drawer } from '@fw/ui/components'

// Angosto (parámetros) — default
<Drawer open={open} size="narrow" title="Parámetros" onClose={close}>…</Drawer>

// Ancho (registro / formulario)
<Drawer open={open} size="wide" title="Detalle de registro" onClose={close}>…</Drawer>

// Ancho a medida
<Drawer open={open} width="60vw" title="…" onClose={close}>…</Drawer>
```

Los anchos son **parametrizables a nivel global** redefiniendo `--drawer-narrow-w` / `--drawer-wide-w` en `globals.css`, o por instancia con `width`. Animación, backdrop, z-index y accesibilidad: ver `design-system.md` §4 y §11.

**Stacking (excepción).** El patrón por defecto es **un solo Side Panel a la vez**. Si una app necesita dos simultáneos (p. ej. lista en `narrow` + detalle en `wide`), montar dos instancias de `Drawer` con z-index incremental y backdrops independientes; trátalo como excepción, no como patrón base.

**Densidad.** Los anchos del Side Panel **no cambian** con la densidad (`compact`/`comfy`); la densidad solo ajusta el espaciado interno vía tokens `--sp-*`. Lo mismo aplica a las dimensiones del shell (sidebar, header, ad-rail): son tokens de layout, independientes de la densidad.

---

## 4. Personalización por variables globales

Toda la interfaz se controla desde un **único conjunto de variables CSS** en `src/app/globals.css`. Adaptar la plantilla a una marca o ajustar dimensiones no requiere tocar componentes. Resumen de la superficie configurable:

| Concern | Variables clave |
|---|---|
| Dimensiones del shell | `--sidebar-w`, `--sidebar-w-collapsed`, `--header-h`, `--ad-rail-w`, `--announce-h`, `--content-px/py` |
| Paneles deslizantes | `--drawer-narrow-w`, `--drawer-wide-w` |
| Zona de marca / Logo | `--brand-px`, `--brand-gap`, `--brand-align`, `--brand-logo-h` (+ slot `brand` del AppShell) |
| Color / paleta | `--accent*`, semánticos, superficies, texto, bordes |
| Tipografía | `--font-display`, `--font-body`, `--font-mono`, tracking |
| Radios | `--r-card`, `--r-input`, `--r-badge`, `--r-modal`, `--r-pill` |
| Sombras / densidad | `--shadow-*`, escala `--sp-*`, `--row-h`, `--input-h` |

El detalle completo de cada token (valores light/dark, reglas de uso) está en `design-system.md` §2 ("Personalización global"). El logotipo, además, se inyecta como contenido con la prop `brand` del `AppShell` (soporta logos horizontales, verticales o imágenes); alineación, padding y gap se controlan con los tokens `--brand-*`.

---

## 5. Migrar un componente entre aplicaciones

Como todas las apps construidas sobre esta plantilla comparten las mismas áreas maestras y el mismo look-and-feel, mover una funcionalidad de una app a otra es directo.

Procedimiento:

1. **Identificar el área maestra destino.** ¿La funcionalidad es una pantalla completa (Workspace), un panel de detalle/formulario (Side Panel `wide`), un set de parámetros (Side Panel `narrow`), un ítem de menú (Sidebar) o un aviso (Notice Bar)?
2. **Reutilizar tokens y animaciones**, no estilos hardcodeados. El componente hereda automáticamente la marca y el tema de la app receptora porque consume las mismas variables CSS.
3. **Reemplazar la deuda de runtime migrado** si el componente proviene de `src/web/template/migrated` (ver `AGENTS.md` y `design-system.md` §16): nada de `window.*`, `location.hash`, Chart.js global ni `.jsx` sin tipos.
4. **Recomponer con props tipadas e imports locales**, usando los componentes de `@fw/ui/components`.

Ejemplo: llevar un agendador (feature de reserva de citas) a un *CRM*. La vista del calendario se monta en el **Workspace** del CRM; el formulario "nueva cita" se abre en el **Side Panel `wide`**; los ajustes de disponibilidad, en el **Side Panel `narrow`**. Al usar las áreas maestras y los tokens del CRM, la funcionalidad adopta su look-and-feel sin retoques visuales.

```tsx
// App receptora (CRM): se reutiliza una feature migrada montándola en su área destino.
import { useState } from 'react'
import { Button, Drawer } from '@fw/ui/components'
import { SchedulerForm } from '@web/apps/scheduler/scheduler-form' // feature reutilizada

export function NewAppointmentButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>Nueva cita</Button>
      {/* El Side Panel ancho es el área destino para formularios/registros */}
      <Drawer open={open} size="wide" title="Nueva cita" onClose={() => setOpen(false)}>
        {/* SchedulerForm consume los mismos tokens: hereda la marca y el tema del CRM */}
        <SchedulerForm />
      </Drawer>
    </>
  )
}
```

La clave: el componente reutilizado **no trae estilos propios hardcodeados**; consume tokens (`--accent`, `--surface`, `--font-*`, radios), por lo que al montarse en el área destino adopta automáticamente el look-and-feel de la app receptora.

---

## 6. Relación con los demás documentos

| Para… | Leer |
|---|---|
| Contrato de uso por IA, qué NO heredar, orden de lectura | `AGENTS.md` |
| Tokens, componentes, API, animaciones, premium, accesibilidad | `docs/design-system.md` |
| Estado del proyecto, stack, comandos, mapa de documentación | `README.md` |

La nomenclatura de áreas de este documento es **vinculante**: `design-system.md` (§1, §8) y el código del `AppShell` (`src/framework/ui/layout/app-shell.tsx`) usan los mismos nombres. Si cambia un área maestra, actualizar ambos.
