# From Zero — Design System

Documento de referencia del sistema de diseño de la plantilla `nextjs-template`. Define las zonas de interfaz, los tokens visuales, el inventario de componentes, el comportamiento de animaciones y las reglas de extensión.

**Propósito:** cualquier modelo de IA o desarrollador puede usar este documento para crear nuevos elementos que se integren de forma transparente en la interfaz, sin necesidad de inspeccionar el código existente para adivinar decisiones de diseño.

**Fuente primaria:** `src/app/globals.css` y `src/framework/ui/components/`. Este documento refleja el estado real del código — no es aspiracional.

**Documento complementario:** `docs/interface-architecture.md` define el **vocabulario canónico de áreas maestras** (Topbar, Sidebar, Brand, Workspace, Page Header, Notice Bar, Ad Rail, Upgrade Slot, Side Panel) y el modelo de personalización global. Léelo primero para el mapa de alto nivel; este documento es el detalle de tokens, componentes y API. La nomenclatura de ambos debe coincidir.

---

## Cómo navegar este documento

### Lectura recomendada para un AI que va a construir una app desde cero

Si vas a construir una aplicación nueva a partir de esta plantilla, lee en este orden antes de generar código:

```
0. interface-architecture.md — áreas maestras y vocabulario canónico (mapa de alto nivel)
1. §17   Fundamentos — path aliases, cn(), Server vs Client, next/image
2. §18   AppShell — cómo montar el shell y qué props acepta (brand, upgradeSlot, adRail)
3. §19   Rutas — cómo crear pantallas Next.js, metadata, next/link
4. §20   i18n — cómo agregar traducciones
5. §9    Inventario — qué componentes existen y cuáles NO existen
6. §10   Decisiones — cuándo usar Modal vs Drawer, Badge vs texto, etc.
7. §11   API — interfaces TypeScript exactas de cada componente
8. §21   Flujos — submit de formulario, eliminación con confirmación, fetching
9. §2    Tokens y §2.7 Personalización global — marca, dimensiones, tema
10. §4   Animaciones y principios premium — estados obligatorios y movimiento
11. §22  Gráficas — si la app incluye visualización de datos
12. §23  Accesibilidad — WCAG 2.2 AA, foco, reduced-motion
```

Demo en vivo de las 9 áreas maestras: ruta `/es/examples/shell`. Catálogo de primitivas: `/es/examples/ui`.

### Búsqueda rápida por tarea

| Tarea | Secciones a leer |
|-------|-----------------|
| Adaptar la plantilla a una nueva marca (colores, fuente, logo, dimensiones) | §2.1, §2.2, §2.7, §16 |
| Entender las áreas maestras y su nomenclatura | `interface-architecture.md`, §1, §8 |
| Configurar el Side Panel angosto/ancho | §11 (Drawer), `interface-architecture.md` §3 |
| Crear una pantalla Next.js real desde cero | §17, §18, §19, §8.4, §12 |
| Montar el AppShell en una nueva app | §17, §18 |
| Agregar un módulo al sidebar | §19 |
| Agregar traducciones a un componente | §20 |
| Implementar un formulario con validación y submit | §9, §11 (Field/Input), §10, §21 |
| Implementar confirmación de eliminación | §21 |
| Elegir y configurar una gráfica | §22 |
| Crear un componente nuevo | §17, §2, §3, §4, §11, §16 |
| Elegir entre dos componentes similares | §10 |
| Saber qué componentes existen / no existen | §9 |
| Implementar una tabla | §9, §11 (Table API) |
| Implementar un overlay (modal o drawer) | §10, §11 (Modal/Drawer API) |
| Entender el layout del shell | §1, §8 |
| Activar dark mode o densidad | §13, §14 |
| Cumplir accesibilidad mínima | §23 |
| Depurar una animación o agregar una nueva | §4, §15 |
| Verificar el z-index correcto para un overlay nuevo | §4 |

---

## Índice

1. [Zonas globales de la interfaz](#1-zonas-globales-de-la-interfaz)
2. [Tokens de diseño](#2-tokens-de-diseño)
3. [Sistema de iconos](#3-sistema-de-iconos)
4. [Animaciones y micro-interacciones](#4-animaciones-y-micro-interacciones)
5. [Estados de carga](#5-estados-de-carga)
6. [Notificaciones y toasts](#6-notificaciones-y-toasts)
7. [Comportamiento responsive](#7-comportamiento-responsive)
8. [Zonas en detalle](#8-zonas-en-detalle)
9. [Inventario de componentes](#9-inventario-de-componentes)
10. [Guía de decisión de componentes](#10-guía-de-decisión-de-componentes)
11. [Referencia de API de componentes](#11-referencia-de-api-de-componentes)
12. [Patrones de composición de pantallas](#12-patrones-de-composición-de-pantallas)
13. [Dark mode](#13-dark-mode)
14. [Variantes de densidad](#14-variantes-de-densidad)
15. [Análisis de brechas de animación](#15-análisis-de-brechas-de-animación)
16. [Reglas de extensión](#16-reglas-de-extensión)
17. [Fundamentos del proyecto](#17-fundamentos-del-proyecto)
18. [AppShell — integración y props](#18-appshell--integración-y-props)
19. [Navegación y rutas](#19-navegación-y-rutas)
20. [Internacionalización — i18n](#20-internacionalización--i18n)
21. [Flujos de interacción comunes](#21-flujos-de-interacción-comunes)
22. [Visualización de datos — gráficas](#22-visualización-de-datos--gráficas)
23. [Accesibilidad mínima](#23-accesibilidad-mínima)
24. [Mantenimiento del documento](#24-mantenimiento-del-documento)

---

## 1. Zonas globales de la interfaz

La interfaz se divide en zonas con nombre propio (**áreas maestras**). El **vocabulario canónico** completo vive en `docs/interface-architecture.md`; esta sección detalla las cinco zonas estructurales del grid y su clase CSS. Cada zona tiene responsabilidad única, dimensiones definidas por tokens y comportamiento documentado.

```
┌─────────────────────────────────────────────────────────────────────────┐
│  ZONA 1 · Barra de anuncios (condicional, ancho completo, sticky top)   │
├──────────────────┬──────────────────────────────────────────┬───────────┤
│                  │  ZONA 3 · Header                         │           │
│  ZONA 2          ├──────────────────────────────────────────┤  ZONA 5   │
│  Sidebar         │                                          │  Panel    │
│  (colapsable)    │  ZONA 4 · Área de contenido principal    │  publi-   │
│                  │                                          │  citario  │
│  [Plan footer]   │                                          │  (cond.)  │
└──────────────────┴──────────────────────────────────────────┴───────────┘
```

| # | Zona | CSS class | Visible por defecto | Condicional por |
|---|------|-----------|--------------------|--------------------|
| 1 | Barra de anuncios | `.fz-announce` | No | `data-announce='true'` en `.fz-app` |
| 2 | Sidebar | `.fz-sidebar` | Sí | Siempre presente |
| 3 | Header | `.fz-header` | Sí | Siempre presente |
| 4 | Contenido principal | `.fz-main-col` | Sí | Siempre presente |
| 5 | Panel publicitario | `.fz-ad-rail` | No | `data-ad-rail='true'` en `.fz-app` |

Áreas maestras adicionales (sub-zonas con nombre canónico, ver `interface-architecture.md`):

| Área | slug | CSS class | Dentro de |
|------|------|-----------|-----------|
| Zona de marca / Logo (Brand) | `brand` | `.fz-side-head` + `.fz-logo-*` | Sidebar (cabecera) |
| Zona de upgrade (Upgrade Slot) | `upgradeSlot` | `.fz-side-footer` | Sidebar (pie, comodín) |
| Encabezado de página (Page Header) | `pageHeader` | `.fz-page-head` | Contenido principal |
| Panel deslizante (Side Panel) | `sidePanel` | `.fz-drawer` | Overlay comodín |

> **Topbar vs Page Header:** la Zona 3 (`.fz-header`) es el **Topbar** global; el **Page Header** (`.fz-page-head`) vive dentro del contenido y cambia por pantalla. Son áreas distintas.

El grid del shell raíz (`.fz-app`) define el layout:

```
grid-template-columns: [sidebar-w] [1fr] [ad-rail-w, opcional]
grid-template-rows:    [header-h] [1fr]
```

La transición del grid al colapsar o expandir dura `0.22s` con easing `cubic-bezier(.4,.0,.2,1)`.

---

## 2. Tokens de diseño

Todos los tokens viven en `src/app/globals.css` como custom properties CSS. Son la fuente única de verdad. Cambiar un token aquí propaga el cambio a toda la interfaz.

### 2.1 Colores y reglas de uso

#### Color de acento — el único color que cambia por proyecto

| Token | Valor por defecto | Uso |
|-------|-------------------|-----|
| `--accent` | `#465FFF` | Botón primario, estado activo nav, focus rings |
| `--accent-hover` | `#3A4FD4` | Hover sobre elementos accent |
| `--accent-press` | `#2F40B0` | Estado pressed/active sobre accent |
| `--accent-soft` | `#EEF1FF` | Fondo suave de item nav activo, badges accent |
| `--accent-soft-2` | `#DEE4FF` | Hover sobre fondos soft |
| `--on-accent` | `#FFFFFF` | Texto sobre fondo accent |

Para adaptar la plantilla a una nueva marca, solo es necesario redefinir estos seis tokens.

#### Colores semánticos — no modificar por proyecto

| Token | Valor | Uso |
|-------|-------|-----|
| `--success` | `#17B26A` | Confirmaciones, deltas positivos, badge success |
| `--success-soft` | `#DCFCE7` | Fondo de badge success |
| `--warning` | `#F59E0B` | Advertencias, badge warning |
| `--warning-soft` | `#FEF3C7` | Fondo de badge warning |
| `--danger` | `#F04438` | Errores, zona de peligro, badge danger, botón destructivo |
| `--danger-soft` | `#FEE4E2` | Fondo de badge danger |
| `--info` | `#2E90FA` | Información contextual, badge info |
| `--info-soft` | `#D1E9FF` | Fondo de badge info |

#### Superficies

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--bg` | `#F4F5F7` | `#0B0D13` | Fondo base de la app |
| `--surface` | `#FFFFFF` | `#14171F` | Cards, modales, sidebar, header |
| `--surface-2` | `#FAFBFC` | `#181C25` | Header de columnas en tablas |
| `--surface-hover` | `#F8F9FB` | `#1B1F29` | Hover sobre filas y nav items |
| `--surface-sunken` | `#F1F2F5` | `#0F121A` | Search bar, empty state icons, inputs recesados |

#### Texto

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--text` | `#15171C` | `#ECEDF2` | Texto base |
| `--text-strong` | `#08090C` | `#FFFFFF` | Títulos, labels importantes |
| `--text-muted` | `#5B6271` | `#9097A8` | Subtítulos, hints, labels de campo, nav inactivos |
| `--text-faint` | `#8B91A1` | `#6B7184` | Placeholder, separadores de nav, chevrons |
| `--text-on-dark` | `#FFFFFF` | `#FFFFFF` | Texto sobre fondos accent |

#### Bordes

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| `--border` | `#E5E7EB` | `#242833` | Borde estándar de cards, inputs, sidebar |
| `--border-strong` | `#D5D8DE` | `#2D3240` | Borde de botones outline, separadores |
| `--divider` | `#EEF0F3` | `#1C2029` | Líneas divisorias dentro de cards, entre filas |

#### Reglas de uso de color

**Hacer:**
- Usar `--accent` exclusivamente para el elemento de mayor jerarquía de acción en una sección.
- Usar colores semánticos solo para estados del sistema: éxito, error, advertencia, información.
- Usar `--text-muted` para información secundaria y `--text-faint` para elementos de menor jerarquía.
- Usar variantes `*-soft` como fondos de badges; nunca como fondo de superficies completas.

**No hacer:**
- No usar `--accent` para más de un botón primario en la misma vista visible.
- No usar `--danger` para énfasis visual sin implicar error o destrucción.
- No hardcodear valores hexadecimales en componentes. Siempre tokens CSS.
- No mezclar colores semánticos con el acento para crear variantes intermedias.
- No usar `--success` o `--info` como color de interacción hover; son informativos, no interactivos.

---

### 2.2 Tipografía

#### Familias

| Token | Valor | Uso |
|-------|-------|-----|
| `--font-display` | `'Plus Jakarta Sans', 'Geist', system-ui, sans-serif` | Títulos de página, valores KPI, logo |
| `--font-body` | `'Inter', system-ui, sans-serif` | Todo el texto de interfaz |
| `--font-mono` | `'JetBrains Mono', ui-monospace, monospace` | Código, slugs, IDs técnicos |

Usar `--font-display` solo para jerarquías H1/H2 y valores numéricos grandes. Todo lo demás usa `--font-body`.

#### Escala de tamaños

| Contexto | Tamaño | Peso | Notas |
|----------|--------|------|-------|
| Título de página (H1) | `24px` | 700 | font-display, tracking `-0.02em` |
| Título de card / sección (H3) | `15px` | 600 | font-body |
| Cuerpo principal | `14px` | 400 | base global |
| Item de navegación | `13.5px` | 500 / 600 activo | |
| Label de campo | `12.5px` | 500 | |
| Hint / helper text | `12px` | 400 | color `--text-muted` |
| Badge | `11.5px` | 600 | |
| Header de columna en tabla | `11.5px` | 600 | uppercase, letter-spacing 0.06em |
| Eyebrow / label de grupo nav | `11px` | 600 | uppercase, letter-spacing 0.08em |
| Código monospace | `12.5px` | 400 | |

#### Letter-spacing

| Token | Valor | Uso |
|-------|-------|-----|
| `--tracking-tight` | `-0.01em` | Cuerpo de texto denso |
| `--tracking-display` | `-0.02em` | Títulos grandes con font-display |

---

### 2.3 Espaciado y aplicación

Escala de 10 pasos. Los valores del modo normal son la base; las variantes de densidad los ajustan.

| Token | Normal | Compact | Comfy |
|-------|--------|---------|-------|
| `--sp-1` | `4px` | `4px` | `4px` |
| `--sp-2` | `8px` | `6px` | `10px` |
| `--sp-3` | `12px` | `10px` | `14px` |
| `--sp-4` | `16px` | `12px` | `18px` |
| `--sp-5` | `20px` | `20px` | `20px` |
| `--sp-6` | `24px` | `24px` | `24px` |
| `--sp-7` | `32px` | `32px` | `32px` |
| `--sp-8` | `40px` | `40px` | `40px` |
| `--sp-9` | `48px` | `48px` | `48px` |
| `--sp-10` | `64px` | `64px` | `64px` |

#### Patrones de aplicación

| Contexto | Token |
|----------|-------|
| Entre label y control de formulario | `--sp-2` |
| Entre campos de formulario consecutivos | `--sp-4` |
| Entre secciones dentro de una card | `--sp-5` o `--sp-6` |
| Padding interno de card | `--sp-5` horizontal + vertical |
| Entre cards o bloques mayores | `--sp-7` |
| Padding horizontal del área de contenido | `--content-px` (28px) |
| Padding vertical del área de contenido | `--content-py` (24px) |
| Gap entre botones en toolbar | `--sp-2` |
| Gap entre items de grid de KPIs | `--sp-5` |
| Margen antes de un título de nueva sección | `--sp-7` desde el bloque anterior |

El espacio entre elementos comunica relación. Elementos más relacionados tienen menos espacio entre sí. Aumentar el espacio antes de un nuevo bloque temático es suficiente para crear separación visual sin recurrir a líneas divisorias adicionales.

Nunca usar valores hardcodeados en componentes. Los tokens responden a la densidad seleccionada.

---

### 2.4 Radio de borde

| Token | Valor | Uso |
|-------|-------|-----|
| `--r-card` | `12px` | Cards, panel publicitario, dialogs |
| `--r-input` | `8px` | Inputs, selects, textareas, botones |
| `--r-badge` | `6px` | Badges |
| `--r-modal` | `16px` | Modales y drawers |
| `--r-pill` | `9999px` | Botones pill, CTAs redondeados, avatares |

Al crear un nuevo elemento contenedor: cards y paneles usan `--r-card`; elementos inline usan `--r-badge`; formularios usan `--r-input`.

---

### 2.5 Sombras

| Token | Valor CSS (light) | Valor CSS (dark) | Uso |
|-------|-------------------|------------------|-----|
| `--shadow-xs` | `0 1px 2px rgba(15,18,28,.04)` | `0 1px 2px rgba(0,0,0,.4)` | Elevación mínima |
| `--shadow-sm` | `0 1px 2px rgba(15,18,28,.06), 0 1px 3px rgba(15,18,28,.04)` | `0 1px 2px rgba(0,0,0,.4), 0 1px 3px rgba(0,0,0,.3)` | Cards en reposo |
| `--shadow-md` | `0 4px 12px rgba(15,18,28,.06), 0 1px 3px rgba(15,18,28,.04)` | `0 4px 12px rgba(0,0,0,.4), 0 1px 3px rgba(0,0,0,.3)` | Dropdowns, tooltips, popovers |
| `--shadow-lg` | `0 12px 32px rgba(15,18,28,.10), 0 4px 8px rgba(15,18,28,.05)` | `0 12px 32px rgba(0,0,0,.5), 0 4px 8px rgba(0,0,0,.3)` | Modales, sidebar peek-on-hover |
| `--shadow-focus` | `0 0 0 4px rgba(70,95,255,.18)` | igual | Focus ring accent |
| `--shadow-focus-danger` | `0 0 0 4px rgba(240,68,56,.18)` | igual | Focus ring campo con error |
| `--shadow-focus-success` | `0 0 0 4px rgba(23,178,106,.18)` | igual | Focus ring campo validado |

Las sombras en dark mode son más pronunciadas (mayor opacidad sobre negro) para mantener la percepción de elevación sobre fondos oscuros. Los focus rings no cambian — el color `--accent` se mantiene igual en ambos temas.

El focus ring siempre usa `box-shadow`, nunca `outline`. Esto garantiza radio de borde consistente con el elemento.

---

### 2.6 Dimensiones del shell

| Token | Valor | Descripción |
|-------|-------|-------------|
| `--header-h` | `64px` | Alto del header |
| `--sidebar-w` | `264px` | Ancho del sidebar expandido |
| `--sidebar-w-collapsed` | `72px` | Ancho del sidebar colapsado |
| `--ad-rail-w` | `200px` | Ancho del panel publicitario lateral (Ad Rail) |
| `--content-px` | `28px` | Padding horizontal del área de contenido |
| `--content-py` | `24px` | Padding vertical del área de contenido |
| `--row-h` | `44px` | Alto de fila en tablas |
| `--input-h` | `42px` | Alto de inputs y selects |
| `--announce-h` | `40px` | Alto de la barra de avisos (Notice Bar) |
| `--drawer-narrow-w` | `400px` | Ancho del Side Panel angosto (parámetros) |
| `--drawer-wide-w` | `75vw` | Ancho del Side Panel ancho (registros/formularios) |
| `--brand-px` | `16px` | Padding horizontal de la Zona de marca / Logo |
| `--brand-gap` | `10px` | Separación entre logo mark y texto |
| `--brand-align` | `flex-start` | Alineación del contenido de la Zona de marca |
| `--brand-logo-h` | `32px` | Alto máximo del logo (imágenes/SVG en el slot `brand`); ancho proporcional |

Los tokens `--ad-rail-w`, `--announce-h`, `--drawer-*` y `--brand-*` están declarados en `:root` y son personalizables por aplicación. Ver §2.7.

---

### 2.7 Personalización global (punto único de marca y tema)

Toda la interfaz se controla desde las variables CSS de `globals.css`. Adaptar la plantilla a una marca o ajustar dimensiones **no requiere tocar componentes**: se redefinen tokens. Esta es la superficie completa de configuración, agrupada por concern.

| Concern | Variables | Sección |
|---|---|---|
| Dimensiones del shell | `--sidebar-w`, `--sidebar-w-collapsed`, `--header-h`, `--ad-rail-w`, `--announce-h`, `--content-px/py` | §2.6 |
| Paneles deslizantes (Side Panel) | `--drawer-narrow-w`, `--drawer-wide-w` | §2.6 / §11 |
| Zona de marca / Logo | `--brand-px`, `--brand-gap`, `--brand-align` (+ prop `brand` del AppShell) | §2.6 / §18 |
| Color de acento (marca) | `--accent`, `--accent-hover`, `--accent-press`, `--accent-soft`, `--accent-soft-2`, `--on-accent` | §2.1 |
| Colores semánticos | `--success*`, `--warning*`, `--danger*`, `--info*` | §2.1 |
| Superficies, texto, bordes | `--bg`, `--surface*`, `--text*`, `--border*`, `--divider` | §2.1 / §13 |
| Tipografía | `--font-display`, `--font-body`, `--font-mono`, `--tracking-*` | §2.2 |
| Radios | `--r-card`, `--r-input`, `--r-badge`, `--r-modal`, `--r-pill` | §2.4 |
| Sombras | `--shadow-*` | §2.5 |
| Densidad / espaciado | `--sp-1`…`--sp-10`, `--row-h`, `--input-h` | §2.3 / §14 |

**Para rebrandear una app** basta, como mínimo, redefinir los seis tokens `--accent*` y, si la marca tiene tipografía propia, `--font-display` / `--font-body` (ver §16). El logotipo se inyecta con la prop `brand` del `AppShell` (soporta logos horizontales, verticales o imágenes); su padding, gap y alineación se controlan con `--brand-*`, y el alto del logo con `--brand-logo-h` (cualquier `img`/`svg` dentro del slot se limita a ese alto, con ancho proporcional).

**Regla:** nunca hardcodear valores en componentes. Todo lo personalizable vive como token. Así el rebrand, el dark mode y la densidad funcionan sin trabajo adicional.

---

## 3. Sistema de iconos

La plantilla usa exclusivamente `lucide-react`. No se deben usar otras librerías de iconos ni SVGs inline sin encapsular.

### Tamaños estándar

| Contexto | Tamaño | Notas |
|----------|--------|-------|
| Iconos en nav items | 20×20px | Siempre con `flex-shrink: 0` |
| Iconos en botones con texto | 16×16px | Alineados al centro vertical del texto |
| Botones solo-icono (icon-only) | 18×18px | Botón de 38×38px |
| Iconos en campos de formulario (prefix/suffix) | 16×16px | Color `--text-faint`, cambia a `--accent` en focus |
| Iconos en headers de card o sección | 18×18px | |
| Iconos en empty states | 24×24px | Dentro de contenedor 56×56px |
| Iconos en KPI / stat cards | 20×20px | Dentro de contenedor 36×36px |
| Iconos en badges | 12×12px | |

### Reglas de uso

- `strokeWidth={1.5}` como valor base. Usar `strokeWidth={2}` solo en tamaños ≤14px donde el trazo fino pierde legibilidad.
- El color del icono hereda del contexto vía CSS. Nunca pasar el prop `color` con un valor hexadecimal.
- Icono + texto: el icono va a la izquierda del texto. Excepción: indicadores de dirección (flecha externa, chevron de expansión) van a la derecha.
- Botones solo-icono deben tener `aria-label` descriptivo.
- No usar iconos como único indicador de estado en contextos críticos. Complementar con texto o tooltip.
- Preferir los iconos más reconocidos del vocabulario de lucide-react antes de recurrir a variantes poco comunes.

---

## 4. Animaciones y micro-interacciones

El principio de animación es **sutil y funcional**. Las animaciones no deben llamar la atención sobre sí mismas; deben confirmar acciones, guiar la atención y reforzar la percepción de calidad.

### Principios premium de movimiento

Estándares de movimiento que distinguen una interfaz de primer nivel. Son obligatorios en elementos nuevos.

- **Movimiento funcional, no decorativo.** Cada animación comunica algo: confirma un clic, guía el llenado de un formulario o expresa el estado del sistema durante una carga. Si una animación no aporta información, se elimina.
- **Presupuesto de movimiento.** Animar preferentemente `transform` y `opacity` (compositables por GPU). Evitar animar propiedades que disparan layout/reflow (`width`, `height`, `top`, `left`, `margin`). El movimiento nunca debe degradar la responsividad (INP).
- **Feedback en todos los estados.** Todo elemento interactivo expone `rest`, `hover`, `active/pressed`, `focus-visible` y, si aplica, `disabled` y `loading`. Un elemento sin estados no se considera terminado (ver tablas por tipo abajo).
- **Coherencia.** Reutilizar las duraciones y easings de esta sección; no inventar valores nuevos.
- **Movimiento accesible (no negociable).** Todo movimiento es opcional: la plantilla respeta `prefers-reduced-motion` con un bloque global en `globals.css` que reduce animaciones y transiciones. Ver §23.

### Duraciones estándar

| Duración | Tipo de interacción |
|----------|---------------------|
| `0.06s` | Transform de posición (translateY en botones al hacer clic) |
| `0.12s` | Micro-interacciones: color de fondo, texto, borde, sombra |
| `0.18s` | Elementos secundarios: chevron del menú, badges, indicadores |
| `0.20s` | Entradas de contenido: modales, aparición de overlays |
| `0.22s` | Cambios estructurales: colapso de sidebar, ajuste del grid |
| `0.28s` | Drawers y paneles laterales deslizantes |

### Easing estándar

| Curva | Código | Uso |
|-------|--------|-----|
| Ease estándar | `cubic-bezier(.4,.0,.2,1)` | Transiciones de layout, sidebar, grid |
| Ease de entrada | `cubic-bezier(.32,.72,.0,1)` | Overlays, modales, drawers |
| Lineal | `linear` | Marquee/ticker de la barra de anuncios |
| Ease in-out | `ease-in-out` | Loaders, pulsaciones, animaciones de bucle |

### Estados interactivos por tipo de elemento

#### Botones

| Estado | Comportamiento visual |
|--------|----------------------|
| Rest | Color base del variant. Sombra `--shadow-xs` en primary. |
| Hover | Fondo → `--accent-hover` (primary) o `--surface-hover` (others). Transición `0.12s`. |
| Active / pressed | Fondo → `--accent-press`. `translateY(0.5px)`. Transición `0.06s`. |
| Focus-visible | `--shadow-focus` (ring azul). Sin outline nativo. |
| Disabled | Opacidad `0.45`, cursor `not-allowed`, sin hover states. |
| Loading | Spinner interno, botón no interactivo. |

Conjunto de transiciones de un botón: `background 0.12s, color 0.12s, border-color 0.12s, box-shadow 0.12s, transform 0.06s`.

#### Campos de formulario

| Estado | Comportamiento visual |
|--------|----------------------|
| Rest | Borde `--border`, fondo `--surface`. |
| Hover | Borde `--border-strong`. Transición `0.12s`. |
| Focus | Borde `--accent`, sombra `--shadow-focus`. Transición `0.12s`. |
| Blur | Retorna a rest o a estado de validación si aplica. |
| Error | Borde `--danger`, sombra `--shadow-focus-danger`. |
| Success | Borde `--success`, sombra `--shadow-focus-success`. |
| Disabled | Opacidad `0.5`, cursor `not-allowed`. |

#### Checkboxes y radio buttons

| Estado | Comportamiento visual |
|--------|----------------------|
| Unchecked rest | Borde `--border`, fondo `--surface`. |
| Unchecked hover | Borde `--border-strong`, fondo `--surface-hover`. |
| Checked | Fondo `--accent`, ícono de check blanco. Transición `0.12s`. |
| Checked hover | Fondo `--accent-hover`. |
| Focus | Ring `--shadow-focus` alrededor del control. |

#### Navegación (nav items)

| Estado | Comportamiento visual |
|--------|----------------------|
| Rest | Fondo transparente, texto `--text-muted`, peso 500. |
| Hover | Fondo `--surface-hover`, texto `--text`. Transición `0.12s`. |
| Active | Fondo `--accent-soft`, texto `--accent`, peso 600. |
| Active en submenu | Texto `--accent`, línea vertical 2px `--accent` en borde izquierdo. Fondo transparente. |
| Con submenu abierto | Chevron rota 90°. Transición `0.18s`. |

**Comportamiento crítico:** al seleccionar un item, el scroll del sidebar no se resetea. El item activo queda visible en su posición actual.

#### Cards interactivas (opt-in)

Las cards clicables (que navegan o abren un detalle) usan una elevación sutil en hover. Es **opt-in**: se activa con `data-interactive='true'` en la `Card`. No aplicar a cards no clicables (KPIs estáticos, contenedores de formulario).

| Estado | Comportamiento visual |
|--------|----------------------|
| Rest | Sombra `--shadow-sm` o sin sombra, borde `--border`. |
| Hover | Sombra `--shadow-md`, `translateY(-1px)`, borde `--border-strong`. Transición `0.18s`. |

```tsx
// Card clicable con elevación premium
<Card data-interactive="true" onClick={openDetail}>…</Card>
```

### Animaciones de overlays

| Elemento | Entrada | Salida |
|----------|---------|--------|
| Modal | `translateY(8px) scale(0.98) → normal`, opacity 0→1, `0.2s` | Inverso, `0.15s` |
| Drawer | `translateX(40px) → normal`, opacity 0→1, `0.28s` | Inverso, `0.2s` |
| Backdrop | opacity 0→1, `0.18s ease-out` | opacity 1→0 |
| Dropdown / popover | opacity 0→1 + `translateY(4px)`, `0.12s` | `0.08s` |

### Z-index hierarchy

| Elemento | z-index |
|----------|---------|
| `.fz-ad-rail` | 10 |
| `.fz-header` | 20 |
| `.fz-mobile-overlay` | 28 |
| `.fz-sidebar` | 30 |
| Dropdowns y tooltips | 100 |
| `.fz-drawer-backdrop` | 200 |
| `.fz-drawer` | 201 |
| `.fz-modal-layer` | 210 |
| Boot loader | 9999 |

Al crear un nuevo overlay, elegir un z-index consistente con esta jerarquía. Un popover va en 100; nunca usar valores arbitrarios como 999.

---

## 5. Estados de carga

Todo elemento que realice una operación asíncrona debe comunicar su estado de carga.

### Skeleton (carga inicial de contenido)

> **Importante:** no existe un componente `Skeleton` en `@fw/ui/components`. El patrón debe implementarse con un `<div>` y la animación correspondiente. Nunca intentar importar `Skeleton` desde el framework.

```typescript
// Implementación del skeleton pattern
function RowSkeleton() {
  return (
    <div style={{
      height: 'var(--row-h)',
      background: 'var(--surface-sunken)',
      borderRadius: 'var(--r-input)',
      animation: 'pulse 1.4s ease-in-out infinite',
    }} />
  )
}
// La animación "pulse" debe definirse en globals.css o con Tailwind: className="animate-pulse"
```

Usar cuando una sección carga datos por primera vez y el layout es conocido de antemano.

- Color base: `--surface-sunken` con animación de pulso (`opacity 0.5 → 1 → 0.5`, `1.4s ease-in-out`).
- Con Tailwind: la clase `animate-pulse` aplica el efecto de pulso estándar sobre el color de fondo.
- Respetar las proporciones del contenido real: una fila de tabla usa la misma altura que una fila real.
- No mostrar skeleton por menos de 200ms — si la respuesta es más rápida, mostrar directamente el contenido.

### Spinner (acción en progreso)

Usar dentro de botones y en operaciones donde el usuario espera confirmación inmediata.

- Spinner en botón: reemplaza el texto o aparece junto a él. El botón mantiene su tamaño y queda deshabilitado.
- Spinner de sección: centrado dentro del área que carga, tamaño 24px, color `--accent`.
- No usar spinner en la carga inicial de página — usar skeleton.

### Progress bar

Usar para procesos con duración estimable (importaciones, exportaciones, onboarding multi-paso).

- Barra horizontal de 4px de alto, color `--accent`, radio `--r-pill`.
- El loader de arranque de la app usa animaciones propias (`boot-loader`) — no replicar en otros contextos.

### Regla general

Nunca dejar un elemento interactivo en estado indeterminado sin feedback visual. Si una acción tarda más de 300ms, debe mostrar un indicador.

---

## 6. Notificaciones y toasts

La plantilla usa `sonner`. Los toasts comunican el resultado de acciones que el usuario inició.

### Setup requerido (una sola vez por app)

El componente `<Toaster />` debe agregarse al layout raíz. Sin él, los toasts no se renderizan aunque se llame a `toast.success()`.

```typescript
// src/app/[locale]/layout.tsx
import { Toaster } from 'sonner'

export default function LocaleLayout({ children }) {
  return (
    <NextIntlClientProvider>
      {children}
      <Toaster position="bottom-right" richColors />
    </NextIntlClientProvider>
  )
}
```

### Uso en componentes

```typescript
// En cualquier client component
import { toast } from 'sonner'

toast.success('Cambios guardados')
toast.error('No se pudo guardar. Intenta de nuevo.')
toast.warning('Hay cambios sin guardar')
toast.info('La operación puede tardar unos minutos')
```

`Toaster` va en el layout (una vez). `toast` se importa en cada componente que lo necesite.

### Tipos

| Tipo | Cuándo | Token |
|------|--------|-------|
| `success` | Acción completada correctamente | `--success` |
| `error` | Falla en una acción del usuario | `--danger` |
| `warning` | Completada con advertencia | `--warning` |
| `info` | Información contextual no urgente | `--info` |
| `default` | Mensajes neutros del sistema | `--text` |

### Reglas

- Los toasts son consecuencia de acciones explícitas. No usar para eventos del sistema no iniciados por el usuario.
- Duración: éxitos simples 3s · mensajes informativos 4s · errores 6s.
- Texto específico: "Registro guardado" es mejor que "Operación exitosa". "No se pudo guardar. Revisa tu conexión" es mejor que "Error".
- No usar toast para errores de validación de formulario — esos van inline junto al campo.
- Posición estándar: `bottom-right`. No cambiar por aplicación.

---

## 7. Comportamiento responsive

### Desktop (> 1180px)

Layout completo: sidebar + header + contenido + panel publicitario opcional.
Grid: `[sidebar-w] 1fr [ad-rail-w?]`.

### Tablet (768px – 1180px)

- Panel publicitario lateral → banner horizontal fijo al fondo (728×90px, `z-index: 80`).
- La columna de contenido agrega `padding-bottom: 110px` cuando el banner está visible.
- Sidebar colapsado por defecto (solo iconos, 72px).
- Grid: `[sidebar-w-collapsed] 1fr`.

### Mobile (< 768px)

- Sidebar → drawer overlay. El toggle en el header lo abre/cierra.
- Cuando el drawer está abierto: backdrop semitransparente, `z-index: 201`.
- Header ocupa el ancho completo.
- Grid: `1fr` (columna única).
- Panel publicitario no se muestra.

### Breakpoints de Tailwind vs. breakpoints del diseño

| Breakpoint diseño | Tailwind class | px | Qué cambia |
|-------------------|---------------|-----|-----------|
| Mobile → Tablet | `md:` | ≥768px | Sidebar pasa a colapsado; panel publicitario → banner inferior |
| Tablet → Desktop | `xl:` | ≥1280px | Layout completo; panel publicitario lateral visible |

`lg:` (1024px) no se usa como breakpoint primario en este diseño — preferir `md:` y `xl:`.

**Clases Tailwind para grids responsive:**
```typescript
// Grid de 4 KPIs → 2 en tablet → 1 en mobile
<DashboardGrid className="grid-cols-1 md:grid-cols-2 xl:grid-cols-4">

// Formulario 2 columnas → 1 en mobile
<div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--sp-4)]">

// Layout asimétrico 2/3 + 1/3
<div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-[var(--sp-5)]">
```

### Reglas para nuevas pantallas

- Grids de contenido colapsan: `md:grid-cols-2 xl:grid-cols-4` (4 KPIs), `md:grid-cols-2` (formularios).
- Tablas largas: `overflow-x: auto` en el `TableScroll` — ya lo hace por defecto, no agregar manualmente.
- Formularios multi-columna: en mobile (`<md:`), cada campo ocupa el ancho completo.
- No forzar layout de desktop en mobile con `min-width` o `overflow: hidden` en el body.

---

## 8. Zonas en detalle

### 8.1 Barra de anuncios

**Propósito:** mensajes del sistema, promociones o alertas de mantenimiento. Solo cuando la aplicación lo requiere (freemium, onboarding).

**Posición:** `sticky top: 0`, `z-index: 50`. Empuja hacia abajo header y sidebar en `--announce-h` (40px).

**Componentes internos:**
- **Marquee / ticker:** texto que se desplaza horizontalmente. Se pausa al hacer hover. Fade de 24px en los extremos.
- **Acciones (derecha):** hasta dos botones ("Ver detalles", "Contactar soporte").

**Activación:** `data-announce='true'` en `.fz-app`.

**Variables configurables:** `--fz-announce-fg` (color del texto), `--fz-announce-bg` (color de fondo), `animation-duration` del marquee.

---

### 8.2 Header

**Propósito:** navegación global, acceso a herramientas transversales y contexto del usuario.

**Posición:** `sticky top: var(--announce-h, 0)`, `z-index: 20`. Alto: `--header-h` (64px).

**Layout interno (izquierda → derecha):**

| Elemento | Descripción | Dimensión |
|----------|-------------|-----------|
| Toggle sidebar | Colapsa/expande el sidebar | 38×38px |
| Búsqueda global | Input expandido, fondo `--surface-sunken` | max-width 480px, 40px alto |
| Espacio flexible | Separa controles izquierda/derecha | `flex: 1` |
| Selector de idioma | Código de idioma activo | 38×38px |
| Toggle dark mode | Icono luna/sol | 38×38px |
| Notificaciones | Icono campana + badge contador | 38×38px |
| Menú de usuario | Avatar (32px circular) + nombre + rol | auto |

**Botones icono:** 38×38px, borde `1px --border`, border-radius 10px. Hover → `--surface-hover`. Focus → `--shadow-focus`. Active → `translateY(0.5px)`.

**Búsqueda global:** focus activa borde `--accent` + `--shadow-focus`. Atajo de teclado visible dentro del campo (⌘K / Ctrl+K).

---

### 8.3 Sidebar

**Propósito:** navegación primaria, acceso a módulos y contexto de la app activa.

**Posición:** `fixed left: 0`, altura total, `z-index: 30`. Borde derecho `1px --border`.

#### Secciones (de arriba a abajo)

**Cabecera (`.fz-side-head`):** altura `--header-h`, border-bottom. Contiene logo mark + logo word.

- **Logo mark:** 32×32px, fondo `--text-strong`, border-radius 9px, letras iniciales en blanco, gradiente diagonal `--accent` interno.
- **Logo word:** nombre bold 15px + versión 10.5px uppercase `--text-muted`. Desaparece al colapsar.

**Área de navegación (`.fz-side-scroll`):** scroll vertical suave, contiene grupos de navegación.

**Grupos de navegación:**
- Label de sección: 11px, uppercase, color `--text-faint`. Desaparece al colapsar.
- Items nivel 1: 40px alto, icono 20px + label + badge opcional + chevron si tiene hijos.
- Submenu (`.fz-nav-sub`): margin-left 28px, border-left `1px --divider`. Items 34px, 13px.
- Profundidad 3 (`.fz-nav-sub-deep`): margin-left 16px adicional. Items 30px, 12.5px. Usar con moderación.

**Footer (`.fz-side-footer`):** plan card (freemium) o avatar del usuario.

#### Comportamiento de colapso

**Expandido (264px):** todo visible.

**Colapsado (72px):** solo iconos. Labels, chevrons, badges de nav, labels de grupo y footer se ocultan. Items centran el icono. El fondo `--accent-soft` del item activo permanece visible — identificación garantizada sin texto.

**Peek-on-hover:** al pasar el cursor sobre el sidebar colapsado, se expande temporalmente a 264px con `--shadow-lg`. No altera el grid principal. Animación `0.2s ease`.

---

### 8.4 Área de contenido principal

**Padding:** `--content-px` horizontal, `--content-py` vertical. Scroll vertical propio.

**Estructura interna recomendada:**

```
PageHeader
  ├── Breadcrumb (si profundidad ≥ 2)
  ├── Título H1
  └── Acciones de página (botón primary a la derecha)

Cuerpo
  ├── Filtros / toolbar (opcional)
  ├── Grid de KPIs (opcional)
  ├── Contenido principal (tabla, cards, formulario)
  └── Zona de peligro (si aplica, siempre al fondo)
```

**Regla de botón de acción primaria:** una sola acción primaria por página. Se ubica en el extremo derecho del page header. Acciones secundarias usan `secondary` o `outline`.

---

### 8.5 Panel publicitario lateral

**Propósito:** publicidad o promociones en esquemas freemium. Solo con `data-ad-rail='true'` en `.fz-app`.

**Posición:** `fixed right: 0`, ancho `--ad-rail-w` (200px), desde `--header-h`.

**Modos del creative:**
- `data-mode='placeholder'`: fondo rayado diagonal, espacio reservado.
- `data-mode='demo'`: gradiente + headline + cuerpo + CTA pill redondeado.

**Label "ANUNCIO PUBLICITARIO":** 10px, monospace, uppercase, bajo el creative. Requerido.

**Responsive (≤1180px):** se transforma en banner horizontal inferior (728×90px). Ver §7.

---

## 9. Inventario de componentes

Todos viven en `src/framework/ui/components/` y se importan desde `@fw/ui/components`. Ver §11 para la API TypeScript completa de cada uno. Ver §10 para la guía de decisión de cuándo usar cada componente.

```typescript
// Import unificado — todos los componentes desde un solo punto
import {
  Button, Badge,
  Card, CardHeader, CardBody, CardTitle, CardSubtitle, CardFooter,
  Field, Input, Select, Textarea,
  Modal, Drawer,
  SegmentedTabs,
  Breadcrumb, PageHeader,
  StatCard, EmptyState,
  TableShell, TableToolbar, TableScroll, Table, TableHead, TableBody,
  TableRow, TableHeader, TableCell, TableFooter,
  DashboardGrid, ChartContainer,
} from '@fw/ui/components'
```

| Componente | Import | Cuándo usarlo |
|------------|--------|--------------|
| `Button` | `@fw/ui/components` | Toda acción clickeable. 5 variantes (primary/secondary/outline/ghost/danger), 5 tamaños. Soporta `loading` y `disabled`. |
| `Badge` | `@fw/ui/components` | Etiqueta de estado que puede cambiar (activo, pendiente, error). Solo visual — no interactivo. 6 variantes semánticas. |
| `Card` + subs | `@fw/ui/components` | Contenedor base de sección. Combinar con CardHeader (título), CardBody (contenido) y CardFooter (acciones/totales). |
| `Field` + controles | `@fw/ui/components` | Campos de formulario. `Field` agrupa label + control + mensaje de error/hint. Usar con `Input`, `Select` o `Textarea`. |
| `Modal` | `@fw/ui/components` | Overlay centrado bloqueante. Confirmaciones, formularios ≤4 campos. Ancho max 520px. |
| `Drawer` | `@fw/ui/components` | Panel lateral desde la derecha. Formularios extensos, detalles de registro. Ancho configurable. |
| `SegmentedTabs` | `@fw/ui/components` | Toggle entre 2-4 vistas del mismo dato (Diario/Semanal, Lista/Grid). Controlled. |
| `Breadcrumb` | `@fw/ui/components` | Ruta jerárquica. Usar en pantallas de nivel 2+. No usar en raíz ni en overlays. |
| `PageHeader` | `@fw/ui/components` | Encabezado de pantalla. Integra Breadcrumb + H1 + slot de acciones (derecha). Usar en toda pantalla. |
| `StatCard` | `@fw/ui/components` | Métrica destacada con label, valor, delta de tendencia e icono. Máx 4-6 por vista. |
| `EmptyState` | `@fw/ui/components` | Estado vacío con icono, título, descripción y acción. Siempre mostrar — nunca `null`. |
| `TableShell` + subs | `@fw/ui/components` | Sistema de tabla completo: wrapper > toolbar > scroll > table > head/body/row/cells > footer. |
| `DashboardGrid` | `@fw/ui/components` | Grid de 4 columnas iguales. Para KPIs homogéneos. |
| `ChartContainer` | `@fw/ui/components` | Card estructurada para gráficas: header con título/subtitle/actions + body para el gráfico. |

> **No existe:** componente `Skeleton`, `Spinner`, `Tabs` (navegación), `Avatar`, `Tooltip`, `Dropdown`, `Checkbox`, `Radio`, `Switch`. Estos deben implementarse con markup directo y clases CSS del design system. Ver §5 para el patrón de skeleton y §10 para tabs de navegación.

### Dónde vive cada cosa (framework vs catálogo vs apps demo)

| Capa | Ruta | Uso |
|------|------|-----|
| **Framework (preferente)** | `src/framework/ui/components` | Primitivas tipadas para código nuevo. Importar desde `@fw/ui/components`. |
| **Ejemplos framework** | `src/web/template/examples` → ruta `/es/examples/ui` | Referencia limpia de uso correcto, sin `window.*` ni hash routing. |
| **Catálogo migrado** | `src/web/template/migrated` | Catálogo visual/funcional. Referencia, no arquitectura final. Conserva deuda de compatibilidad (ver `AGENTS.md`). |
| **Apps demo** | `src/web/apps/{crm,ecommerce,support,ai,salus}` | Dominios demo y composición de aplicación. Manifests + runtime. |

**Regla:** para código nuevo, primero el framework (§9); el catálogo migrado solo como inspiración visual, aplicando la metodología de extracción de §16.

---

## 10. Guía de decisión de componentes

Esta sección responde las preguntas de "¿cuál uso?" más frecuentes. Cada bloque expone el criterio de decisión, no solo la respuesta.

---

### Modal vs. Drawer

**Usar Modal cuando:**
- El usuario DEBE tomar una decisión antes de continuar (acción bloqueante).
- El contenido es compacto: confirmación, alerta, formulario de ≤4 campos.
- La acción interrumpe el flujo intencionalmente.
- Ancho máximo 520px es suficiente.
- Ejemplos: "¿Confirmar eliminación?", "Agregar etiqueta", "Cambiar contraseña".

**Usar Drawer cuando:**
- El usuario puede referirse al contenido detrás del panel sin cerrarlo.
- El contenido es extenso: formularios de ≥5 campos, detalle completo de un registro, configuraciones complejas.
- El flujo no necesita interrumpirse obligatoriamente.
- El ancho es configurable y puede necesitar más de 520px.
- Ejemplos: "Editar perfil completo", "Ver detalle de pedido", "Filtros avanzados".

**Regla de oro:** si el contenido tiene scroll interno o más de 4 campos, usar Drawer. Si cabe en una pantalla sin scroll y el usuario debe responder, usar Modal.

---

### Toast vs. error inline

**Usar Toast cuando:**
- La acción ya se ejecutó (completa o fallida). El resultado es irreversible o fue procesado.
- El mensaje informa sobre algo que ya pasó, no sobre algo que el usuario debe corregir.
- Ejemplos de éxito: "Cambios guardados", "Registro eliminado", "Correo enviado".
- Ejemplos de error de operación: "No se pudo guardar. Intenta de nuevo", "Error de conexión".

**Usar error inline (en `Field`) cuando:**
- La acción aún no se ejecutó. El usuario debe corregir antes de continuar.
- El error está vinculado a un campo específico o al conjunto del formulario.
- Ejemplos: "Este email ya está registrado", "El campo es obligatorio", "La fecha de fin debe ser posterior a la de inicio".

**Regla de oro:** si el usuario todavía puede corregir la situación en el formulario, el error va inline. Si la operación ya se disparó, va en toast.

**Cuándo validar:**
- Validaciones de formato (email, longitud mínima): al salir del campo (`onBlur`).
- Validaciones de unicidad o que requieren servidor: al hacer submit.
- No validar en tiempo real (`onChange`) salvo en campos de contraseña (indicador de fortaleza) o búsqueda en vivo.

---

### SegmentedTabs vs. Tabs de navegación

**Usar `SegmentedTabs` (componente importable) cuando:**
- Se alterna entre 2-4 vistas del MISMO conjunto de datos.
- Las opciones son mutuamente excluyentes.
- Máximo 4 opciones.
- Ejemplos: Diario/Semanal/Mensual, Lista/Cuadrícula, Activos/Inactivos.

```typescript
import { SegmentedTabs } from '@fw/ui/components'
// Componente disponible, controlled, ver API en §11.
```

**Usar tabs de sección (markup directo + clase `.tabs`) cuando:**
- Se navega entre SECCIONES distintas de una misma pantalla.
- Puede haber más de 4 opciones.
- El contenido es cualitativamente diferente, no una vista alternativa.
- Ejemplos: "Información general / Historial / Notas / Archivos".

> **Importante:** no existe componente `Tabs` para navegación de secciones en `@fw/ui/components`. Se implementa con markup `<nav>` + clase CSS `.tabs` directamente. No intentar importarlo.

```typescript
// Implementación manual de navigation tabs (no hay componente)
function SectionTabs({ active, onSelect }) {
  const tabs = ['General', 'Historial', 'Notas']
  return (
    <nav className="tabs">
      {tabs.map(tab => (
        <button
          key={tab}
          className={cn('tab', active === tab && 'active')}
          onClick={() => onSelect(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  )
}
```

**Regla de oro:** `SegmentedTabs` (componente) cambia CÓMO se ve algo. Tabs de sección (markup manual) cambia QUÉ se ve.

---

### StatCard vs. dato en tabla vs. dato en texto plano

**Usar `StatCard` cuando:**
- Un único valor numérico merece énfasis visual por su importancia de negocio.
- El valor tiene tendencia (creció, bajó) que vale la pena mostrar.
- Máximo 4-6 StatCards en la misma vista — más de eso satura.
- Ejemplos: "Total de ventas del mes", "Usuarios activos", "Tasa de conversión".

**Usar fila en tabla cuando:**
- El valor forma parte de un conjunto de registros comparables entre sí.
- El usuario necesita comparar múltiples atributos de múltiples registros.

**Usar texto plano cuando:**
- La información es de referencia estática, no una métrica destacada.
- No tiene tendencia ni jerarquía especial.

---

### Button: cuándo usar cada variante

| Variante | Cuándo | Regla |
|----------|--------|-------|
| `primary` | La acción más importante de la sección visible | Una sola por zona visible |
| `secondary` | Acción importante de segunda jerarquía | Ej. "Cancelar" junto a "Guardar" |
| `outline` | Acción secundaria en toolbar o grupo de acciones | Menos visual weight que secondary |
| `ghost` | Acción de menor énfasis, no debe competir visualmente | Ej. botón de cerrar (X), opciones inline |
| `danger` | Acción destructiva irreversible | Siempre acompañar de confirmación modal |

Si dudas entre `secondary` y `outline`: si el botón está solo, usa `secondary`. Si está agrupado con otros botones, usa `outline`.

---

### Badge vs. texto de estado

**Usar `Badge` cuando:**
- El estado puede cambiar en el tiempo (activo/inactivo, pagado/pendiente/cancelado).
- El usuario necesita identificar el estado de un vistazo en una lista o tabla.
- Hay entre 2 y 6 estados posibles.

**Usar texto plano cuando:**
- Es una categoría estática que no cambia.
- No hay necesidad de diferenciación visual rápida entre múltiples estados.

---

### Card con CardHeader vs. Card sin él

**Con CardHeader:** cuando el bloque de contenido tiene un nombre que ayuda a entender qué contiene. Obligatorio en `ChartContainer`. En formularios con secciones temáticas distinguibles.

**Sin CardHeader:** cuando el contenido es autoevidentemente homogéneo y el título no agrega valor. Ejemplo: grid de KPIs donde cada `StatCard` ya tiene su label.

---

### EmptyState vs. null vs. skeleton

**EmptyState:** cuando el módulo está vacío porque no hay datos (el usuario no ha creado nada, o los filtros no devuelven resultados). Siempre mostrar feedback.

**Skeleton:** cuando se están cargando datos que sí existen. EmptyState aparece después de confirmar que no hay datos, nunca durante la carga.

**null / nada:** nunca. Si no hay datos y no hay carga en curso, siempre mostrar feedback al usuario.

---

### DashboardGrid vs. grid CSS custom

**`DashboardGrid` (`.row-4`, 4 columnas iguales):** cuando todos los elementos tienen igual peso visual y ancho. KPIs, tarjetas de métricas homogéneas.

**Grid CSS custom (Tailwind):** cuando necesitas columnas asimétricas (2/3 + 1/3, contenido principal + sidebar). Definir con clases de Tailwind directamente.

---

### Cuándo agregar Breadcrumb

**Sí usar:** cuando la pantalla está en nivel 2 o más de la jerarquía (módulo → sección → sub-sección).

**No usar:** en páginas raíz (primer nivel del módulo), dentro de modales o drawers, en pantallas de onboarding.

La ruta del breadcrumb refleja la jerarquía del menú, no el historial del browser. El último item es siempre el actual (sin enlace).

---

## 11. Referencia de API de componentes

Props extraídas directamente del código fuente en `src/framework/ui/components/`. Todos los componentes aceptan `className` para composición adicional con `cn()`.

---

### Button

```typescript
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?:    'xs' | 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  // + todos los atributos nativos de <button>: onClick, disabled, type, form, name, value...
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | string | `'primary'` | Variante visual |
| `size` | string | `'md'` | Tamaño. Alturas: xs 28px · sm 34px · md 40px · lg 46px · xl 52px |
| `loading` | boolean | `false` | Muestra "Cargando..." y deshabilita el botón. El texto actual del children se reemplaza. |
| `disabled` | boolean | `false` | Nativo HTML. También deshabilitado cuando `loading=true`. |

**Nota:** cuando se extienda el comportamiento de loading, reemplazar el string "Cargando..." por un componente spinner. Ver §15 (brecha registrada).

---

### Badge

```typescript
type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'pro'
  // + todos los atributos nativos de <span>
}
```

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `variant` | string | `'neutral'` | Aplica color semántico vía `data-tone` en el DOM |

El componente escribe `data-tone` en el DOM, que es lo que los estilos CSS utilizan para aplicar colores. No es interactivo — no tiene estados hover ni focus.

---

### Card y subcomponentes

Todos los subcomponentes son wrappers semánticos sin props propias más allá de los atributos HTML nativos. Su valor es asignar las clases CSS correctas del design system.

```typescript
Card         // <div className="card">           — contenedor base
CardHeader   // <div className="card-head">      — área de título, border-bottom
CardBody     // <div className="card-body">      — cuerpo con padding
CardTitle    // <h3 className="card-title">      — título 15px weight 600
CardSubtitle // <p className="card-subtitle">    — subtítulo --text-muted
CardFooter   // <div className="card-foot">      — pie, border-top, acciones
```

Todos aceptan: `className`, `children`, y cualquier atributo del elemento HTML subyacente.

---

### Field, Input, Select, Textarea

```typescript
// Contenedor de campo de formulario
type FieldProps = React.HTMLAttributes<HTMLDivElement> & {
  label?: React.ReactNode   // Texto de la etiqueta (renderiza <label>)
  hint?:  React.ReactNode   // Texto de ayuda (visible cuando no hay error)
  error?: React.ReactNode   // Texto de error (tiene prioridad sobre hint, color --danger)
}

// Controles (todos usan forwardRef para acceso a la ref del DOM)
type InputProps    = React.InputHTMLAttributes<HTMLInputElement>
type SelectProps   = React.SelectHTMLAttributes<HTMLSelectElement>
type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>
```

| Prop (Field) | Tipo | Required | Descripción |
|--------------|------|----------|-------------|
| `label` | ReactNode | No | Etiqueta visible sobre el control |
| `hint` | ReactNode | No | Texto de ayuda bajo el control. No se muestra si hay `error`. |
| `error` | ReactNode | No | Mensaje de error. Prioridad sobre `hint`. Se muestra en `--danger`. |

**Nota importante:** `Field` no aplica automáticamente `data-state='error'` al control hijo cuando recibe `error`. Si se necesita el borde rojo en el input, agregar `data-state='error'` directamente en el `Input`/`Select`/`Textarea`. Esta es una brecha conocida del componente actual.

`Input`, `Select` y `Textarea` aceptan todos los atributos HTML nativos de sus elementos respectivos: `type`, `placeholder`, `value`, `defaultValue`, `onChange`, `onBlur`, `onFocus`, `disabled`, `required`, `min`, `max`, `step`, `pattern`, `autoComplete`, `rows` (Textarea), etc.

---

### Modal

```typescript
type ModalProps = React.HTMLAttributes<HTMLDivElement> & {
  open:          boolean           // Controla visibilidad. false = no renderiza.
  title:         React.ReactNode   // Texto del header. También usado como aria-label.
  description?:  React.ReactNode   // Subtítulo opcional en el header.
  onClose?:      () => void        // Si se provee, muestra botón X y cierra al clic en backdrop.
  footer?:       React.ReactNode   // Slot para botones de acción (rendered en fz-modal-foot).
}
```

| Prop | Required | Default | Descripción |
|------|----------|---------|-------------|
| `open` | Sí | — | `false` = el componente no renderiza nada al DOM |
| `title` | Sí | — | Texto del header. Usado como `aria-label` en el dialog. |
| `description` | No | — | Subtítulo debajo del título principal |
| `onClose` | No | — | Si no se provee, no hay botón X ni cierre por backdrop |
| `footer` | No | — | Slot para acciones. Usar `<Button variant="ghost">Cancelar</Button>` + `<Button>Confirmar</Button>` |

**Ancho:** `min(100%, 520px)`. No modificar para mantener consistencia. Para contenido más ancho, usar Drawer.

**Accesibilidad:** el componente ya incluye `role="dialog"`, `aria-modal="true"` y `aria-label` automático. No agregar manualmente.

---

### Drawer (Side Panel)

Panel deslizante comodín. Entra de derecha a izquierda. Es el área maestra **Side Panel** (ver `interface-architecture.md` §3): un único componente con presets de ancho semánticos.

```typescript
type DrawerSize = 'narrow' | 'wide'

type DrawerProps = React.HTMLAttributes<HTMLElement> & {
  open:          boolean
  title:         React.ReactNode
  description?:  React.ReactNode
  onClose?:      () => void
  size?:         DrawerSize       // Ancho semántico. Default: 'narrow'.
  width?:        number | string  // Override de ancho. Prioridad sobre size.
}
```

| Prop | Required | Default | Descripción |
|------|----------|---------|-------------|
| `open` | Sí | — | `false` = no renderiza |
| `title` | Sí | — | Header del drawer. Usado como `aria-label`. |
| `description` | No | — | Subtítulo en el header |
| `onClose` | No | — | Si no se provee, no hay botón X ni cierre por backdrop |
| `size` | No | `'narrow'` | `'narrow'` = `--drawer-narrow-w` (400px, parámetros/info); `'wide'` = `--drawer-wide-w` (75vw, registros/formularios). |
| `width` | No | — | Override en píxeles (número) o valor CSS (`"60vw"`, `"600px"`). Si se provee, ignora `size`. |

Los anchos por preset son personalizables globalmente con los tokens `--drawer-narrow-w` / `--drawer-wide-w` (§2.6/§2.7).

**Nota:** el Drawer no tiene slot de footer. Las acciones se colocan dentro del `children` al final del contenido, o se puede agregar `className` para estilar el fondo.

---

### SegmentedTabs

```typescript
type TabItem = {
  value: string            // Identificador único del tab
  label: React.ReactNode   // Texto o nodo a mostrar en el tab
}

type SegmentedTabsProps = React.HTMLAttributes<HTMLDivElement> & {
  items:          TabItem[]                       // Lista de tabs (2-4 recomendado)
  value:          string                          // Tab actualmente activo (controlled)
  onValueChange?: (value: string) => void         // Callback al cambiar de tab
}
```

| Prop | Required | Descripción |
|------|----------|-------------|
| `items` | Sí | Array de `{ value, label }`. El componente es controlled — no maneja estado interno. |
| `value` | Sí | Valor del tab activo. Debe corresponder a uno de los `value` en `items`. |
| `onValueChange` | No | Recibe el `value` del tab seleccionado. Sin este callback, los tabs no cambian. |

---

### Breadcrumb

```typescript
type BreadcrumbItem = {
  label:    React.ReactNode   // Texto del item
  href?:    string            // Si se provee y no es current, renderiza como <a>
  current?: boolean           // Marca como página actual. Default: último item del array.
}

type BreadcrumbProps = React.HTMLAttributes<HTMLElement> & {
  items:      BreadcrumbItem[]   // Lista de items en orden de profundidad
  separator?: React.ReactNode    // Separador entre items. Default: ">"
}
```

| Prop | Required | Default | Descripción |
|------|----------|---------|-------------|
| `items` | Sí | — | El último item se marca automáticamente como `current` si no se especifica. |
| `separator` | No | `">"` | Cualquier ReactNode. Puede ser un icono de Lucide. |

El item `current` recibe `aria-current="page"` automáticamente y no renderiza como enlace aunque tenga `href`.

---

### PageHeader

```typescript
type PageHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  title:    React.ReactNode                        // Texto del H1 de la página
  crumbs?:  React.ReactNode[] | BreadcrumbItem[]  // Items del breadcrumb
  actions?: React.ReactNode                        // Slot derecho para botones
}
```

| Prop | Required | Default | Descripción |
|------|----------|---------|-------------|
| `title` | Sí | — | Renderiza como `<h1 className="fz-page-title">` |
| `crumbs` | No | `[]` | Si el array está vacío, no renderiza Breadcrumb |
| `actions` | No | — | Renderiza en `.fz-page-actions` (flex row, gap 8px, derecha) |

`crumbs` acepta tanto `BreadcrumbItem[]` (con `label`, `href`, `current`) como un array de `ReactNode` simples (strings). En el segundo caso, todos se tratan como texto plano sin enlace.

---

### StatCard

```typescript
type StatCardProps = React.HTMLAttributes<HTMLDivElement> & {
  label:     React.ReactNode            // Nombre de la métrica
  value:     React.ReactNode            // Valor principal (número, texto)
  delta?:    React.ReactNode            // Indicador de cambio (ej. "+12%")
  deltaDir?: 'up' | 'down'             // Dirección del delta. Controla color.
  meta?:     React.ReactNode            // Contexto secundario (ej. "vs. mes anterior")
  icon?:     React.ReactNode            // Icono de Lucide u otro ReactNode
}
```

| Prop | Required | Default | Descripción |
|------|----------|---------|-------------|
| `label` | Sí | — | 12.5px, `--text-muted`. Nombre de la métrica. |
| `value` | Sí | — | `clamp(20px, 2vw, 26px)`, font-display, weight 700, tabular-nums. |
| `delta` | No | — | Texto del cambio. Color: `--success` si `deltaDir='up'`, `--danger` si `'down'`. |
| `deltaDir` | No | `'up'` | Controla el color del delta. No infiere dirección del valor — debe pasarse explícitamente. |
| `meta` | No | — | 12px, `--text-muted`. Se muestra junto al delta en el footer. |
| `icon` | No | — | Nodo renderizado en contenedor 36×36px con fondo `--accent-soft`. |

---

### EmptyState

```typescript
type EmptyStateProps = React.HTMLAttributes<HTMLDivElement> & {
  icon?:        React.ReactNode   // Icono en contenedor 56×56px
  title:        React.ReactNode   // Texto del H3
  description?: React.ReactNode   // Texto de apoyo (max-width 320px)
  actions?:     React.ReactNode   // Botones de acción (flex row, centrado)
}
```

| Prop | Required | Descripción |
|------|----------|-------------|
| `icon` | No | Nodo renderizado en `.empty-icon` (56×56px, fondo `--surface-sunken`, border-radius 14px). |
| `title` | Sí | H3 con estilo base. No usar frases negativas como "No hay datos". Preferir "Aún no hay registros". |
| `description` | No | Indica qué puede hacer el usuario para cambiar el estado vacío. |
| `actions` | No | Colocar un solo botón `primary`. Si hay más de uno, el primero es primary, el resto ghost u outline. |

---

### Componentes de tabla

```typescript
TableShell    // <div className="tbl-wrap"> — contenedor externo, maneja borde y overflow
TableToolbar  // <div className="tbl-toolbar"> — barra de herramientas sobre la tabla
TableScroll   // <div className="tbl-scroll"> — contenedor con overflow-x auto
Table         // <table className="tbl"> — elemento <table>
TableHead     // <thead> — sin clase CSS adicional
TableBody     // <tbody> — sin clase CSS adicional
TableRow      // <tr> — sin clase CSS adicional
TableFooter   // <div className="tbl-foot"> — paginación y conteo de resultados
```

```typescript
// TableHeader tiene una prop adicional
type TableHeaderProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
  sortable?: boolean   // Agrega clase CSS "sortable" para indicador visual de orden
}

// TableCell es un <td> estándar sin props adicionales
type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>
```

**Composición estándar:**

```
TableShell
  ├── TableToolbar (búsqueda + acciones)
  ├── TableScroll
  │     └── Table
  │           ├── TableHead
  │           │     └── tr > TableHeader (×n)
  │           └── TableBody
  │                 └── TableRow (×n) > TableCell (×n)
  └── TableFooter (paginación)
```

---

### DashboardGrid y ChartContainer

```typescript
// DashboardGrid — grid de 4 columnas iguales con gap 20px
// No tiene props propias, solo className y children
DashboardGrid: React.HTMLAttributes<HTMLDivElement>

// ChartContainer — Card con header estructurado para gráficas
type ChartContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  title:     React.ReactNode   // Título de la gráfica
  subtitle?: React.ReactNode   // Período, descripción breve
  actions?:  React.ReactNode   // Slot derecho (botones de descarga, toggle de tipo de gráfica)
}
```

`ChartContainer` renderiza internamente `Card > CardHeader > CardBody`. El `children` va en `CardBody` — ahí va el componente de gráfica (Recharts, Chart.js, etc.).

---

## 12. Patrones de composición de pantallas

> **Nota de lectura:** los bloques de código de esta sección son **planos estructurales** (pseudocódigo de arquitectura), no JSX ejecutable. Muestran la jerarquía de componentes y sus props relevantes como referencia de composición. Para código TypeScript ejecutable completo, ver §21 (flujos de interacción) y §11 (API de cada componente).

Puntos de partida estructurales. Adaptar según el contenido real.

### Pantalla de configuración / formulario

```
PageHeader
  title="Nombre de la sección"
  crumbs={[{label:'Inicio'}, {label:'Parámetros'}, {label:'General', current:true}]}
  actions={<Button>Guardar cambios</Button>}

Card (por cada sección temática)
  CardHeader > CardTitle "Identidad de la organización"
  CardBody
    Grid 2 columnas de Field + Input
    Excepciones a ancho completo: Textarea, upload, selects complejos

Card al final — zona de peligro
  // Aplicar borde danger con style inline o className
  <Card style={{ borderColor: 'var(--danger)' }}>
    <CardBody>
      <p style={{ color: 'var(--danger)', fontWeight: 600 }}>Zona de peligro</p>
      descripción de la acción destructiva
      <Button variant="danger">Eliminar organización</Button>
      // → siempre abre Modal de confirmación antes de ejecutar (ver §21)
    </CardBody>
  </Card>
```

### Pantalla de listado / tabla

```
PageHeader
  title="Registros"
  actions={<Button>Nuevo registro</Button>}

TableShell
  TableToolbar  → Input búsqueda local + filtros + Button outline "Exportar"
  TableScroll
    Table
      TableHead  → TableHeader sortable por columnas clave
      TableBody  → TableRow con hover + acciones inline (ghost buttons al final de fila)
  TableFooter   → "X registros" + controles de paginación (derecha)
```

### Pantalla de dashboard

```
PageHeader
  title="Pipeline comercial"
  actions={SegmentedTabs items=[{value:'7d',label:'7 días'},{value:'30d',label:'30 días'},...]}

DashboardGrid
  StatCard ×4  (métricas principales)

Grid 2 columnas (Tailwind)
  ChartContainer title="Evolución de ventas" (columna principal 2/3)
  ChartContainer title="Por canal" (columna 1/3)

TableShell  (detalle de registros recientes)
```

### Pantalla de detalle de registro

```
PageHeader
  title="Nombre del registro"
  crumbs={[lista → detalle]}
  actions={<Button variant="outline">Editar</Button> + <Button variant="ghost">···</Button>}

Grid 2 columnas asimétrico (Tailwind: col-span-2 + col-span-1)
  Columna principal
    Card  "Información principal"
    Card  "Actividad / historial"
  Columna lateral
    Card  "Resumen / metadatos"
    Card  "Acciones relacionadas"

Drawer width={600} para edición completa
Modal para confirmación de eliminación
```

### Pantalla vacía (empty state)

```
PageHeader  (mismo que el módulo al que pertenece)

EmptyState
  icon={<IconoRelevante size={24} />}
  title="Aún no hay registros"
  description="Crea tu primer registro para empezar."
  actions={<Button>Crear registro</Button>}
```

---

## 13. Dark mode

Activado con `data-theme='dark'` en el elemento `html`. Todos los tokens se redefinen automáticamente — no se requieren clases adicionales.

**Superficies en dark mode:**

| Token | Dark |
|-------|------|
| `--bg` | `#0B0D13` |
| `--surface` | `#14171F` |
| `--surface-2` | `#181C25` |
| `--surface-hover` | `#1B1F29` |
| `--surface-sunken` | `#0F121A` |

**Texto en dark mode:**

| Token | Dark |
|-------|------|
| `--text` | `#ECEDF2` |
| `--text-strong` | `#FFFFFF` |
| `--text-muted` | `#9097A8` |
| `--text-faint` | `#6B7184` |

**Bordes en dark mode:**

| Token | Dark |
|-------|------|
| `--border` | `#242833` |
| `--border-strong` | `#2D3240` |
| `--divider` | `#1C2029` |

**Colores semánticos en dark mode:**

Los colores base (`--success`, `--warning`, `--danger`, `--info`, `--accent`) mantienen su valor hex en dark mode. Solo cambian sus variantes `*-soft`, que pasan de ser colores pastel a usar `rgba` con 16% de opacidad para integrarse con fondos oscuros.

| Token | Light | Dark |
|-------|-------|------|
| `--accent-soft` | `#EEF1FF` | `#1B2150` |
| `--success-soft` | `#DCFCE7` | `rgba(23,178,106,0.16)` |
| `--warning-soft` | `#FEF3C7` | `rgba(245,158,11,0.16)` |
| `--danger-soft` | `#FEE4E2` | `rgba(240,68,56,0.16)` |
| `--info-soft` | `#D1E9FF` | `rgba(46,144,250,0.16)` |

Las sombras en dark mode son más pronunciadas (mayor opacidad) para mantener percepción de elevación. Ver valores exactos en §2.5.

**Regla:** nunca hardcodear colores hexadecimales en componentes. Usar siempre tokens CSS. El dark mode funcionará sin trabajo adicional.

---

## 14. Variantes de densidad

| Variante | Activación | Uso recomendado |
|----------|------------|-----------------|
| **Compact** | `data-density="compact"` en `<html>` | Dashboards de datos intensivos, usuarios expertos |
| **Normal** | por defecto (sin atributo) | Uso general |
| **Comfy** | `data-density="comfy"` en `<html>` | Onboarding, formularios largos, usuarios nuevos |

La densidad se activa con el **atributo `data-density`** en el elemento `html` — no con clases CSS.

```typescript
// Cambiar densidad programáticamente
document.documentElement.dataset.density = 'compact' // o 'comfy'
// Para volver al modo normal:
delete document.documentElement.dataset.density
```

Los tokens afectados: `--sp-2` a `--sp-7`, `--row-h`, `--input-h`, `--content-px`. Ver tabla completa en §2.3.

---

## 15. Análisis de brechas de animación

Estado actual de las animaciones premium por componente, para guiar trabajo de mejora.

### Estado actual

| Componente | Hover | Active/Press | Focus | Estado |
|------------|-------|-------------|-------|--------|
| Button | ✅ | ✅ `translateY(0.5px)` | ✅ `shadow-focus` | Completo |
| Input / Select | ✅ | — | ✅ accent + shadow | Completo |
| Textarea | ✅ | — | ✅ accent + shadow | Completo |
| Checkbox | ⚠️ parcial | — | ⚠️ sin transition interna | **Incompleto** |
| Radio | ⚠️ parcial | — | ⚠️ sin transition interna | **Incompleto** |
| Nav item | ✅ | — | — | Completo |
| Table row | ✅ | — | — | Completo |
| Icon button (header) | ✅ | ⚠️ sin `translateY` | ✅ | Parcial |
| Tabs (SegmentedTabs) | ✅ | — | ⚠️ sin `shadow-focus` | Parcial |
| Modal (entrada) | — | — | ✅ animación | Completo |
| Drawer (entrada) | — | — | ✅ animación | Completo |
| Dropdown items | ⚠️ sin transition uniforme | — | — | Parcial |
| Card interactiva (`data-interactive`) | ✅ elevación + `translateY(-1px)` | — | — | Completo (opt-in, §4) |

**Movimiento reducido:** `prefers-reduced-motion` está implementado globalmente en `globals.css` (reduce animaciones y transiciones largas). Es requisito premium y de accesibilidad. Ver §4 y §23.

### Brechas prioritarias

1. **Checkbox y Radio:** la transición unchecked → checked es instantánea. Agregar `transition: background 0.12s, border-color 0.12s` en el control y en el ícono interno.
2. **Icon buttons del header:** estado `active` sin `translateY(0.5px)`. Agregar `transform: translateY(0.5px)` con `transition: transform 0.06s`.
3. **SegmentedTabs:** el cambio de tab activo no tiene transición. Agregar `transition: background 0.12s, color 0.12s`.
4. **Button loading:** actualmente muestra el string `"Cargando..."`. Reemplazar por un spinner SVG animado que mantenga el tamaño del botón.

### Orden de implementación sugerido

Checkbox/Radio → Icon buttons → SegmentedTabs → Button loading spinner.

---

## 16. Reglas de extensión

### Antes de crear

1. Revisar `src/framework/ui/components` — puede que el componente ya exista (inventario en §9).
2. Consultar §10 para elegir el componente correcto.
3. Revisar `interface-architecture.md` para saber a qué área maestra pertenece.
4. Revisar `AGENTS.md` (deuda migrada que NO heredar) si se va a reutilizar código de `src/web/template/migrated`.

### Metodología de extracción desde el catálogo migrado

El catálogo `src/web/template/migrated` es referencia visual/funcional, no arquitectura final. Para convertir un patrón migrado en componente de framework o de aplicación:

1. **Observar** la pantalla migrada para entender UX, jerarquía, estados y copy.
2. **Mapear** a un componente equivalente en `@fw/ui/components` (§9). Si falta, crearlo primero con API tipada.
3. **Recomponer** con imports React, props tipadas y rutas reales; nada de `window.*`, `location.hash`, Chart.js global ni `.jsx` sin tipos.
4. **Desacoplar** datos demo a fixtures o módulos de dominio.
5. **Validar** con lint, build y tests relevantes.

Señales de deuda a corregir (no heredar): `window.App/Icon/Chart/L`, `location.hash`, `window.dispatchEvent(new CustomEvent(...))`, registro global de helpers, `.jsx` sin tipos. El contrato completo está en `AGENTS.md`.

### Al crear un componente nuevo

- Crear en `src/framework/ui/components` con TypeScript estricto.
- Exportar desde `src/framework/ui/components/index.ts`.
- Usar `cn()` desde `@fw/lib/utils` para componer clases.
- Usar tokens CSS, nunca valores hardcodeados.
- Aplicar el sistema de animaciones de §4: duraciones, easings y estados obligatorios.
- Documentarlo en el inventario §9 de este documento y, si introduce un área maestra, en `interface-architecture.md`.

### Adaptar la plantilla a una nueva marca

Solo es necesario redefinir en `globals.css`:

```css
--accent:       /* color principal de la marca */
--accent-hover: /* versión más oscura ~15% */
--accent-press: /* versión más oscura ~30% */
--accent-soft:  /* versión muy suave, ~8% opacidad sobre blanco */
--accent-soft-2:/* versión suave, ~15% opacidad sobre blanco */
--on-accent:    /* color del texto sobre fondo accent, casi siempre #FFFFFF */
```

Y en `src/app/layout.tsx`: cambiar las fuentes de Google Fonts si la marca tiene tipografía propia. Actualizar `--font-display` y `--font-body` en `globals.css`.

### Animaciones en elementos nuevos

- Usar las duraciones de §4. No inventar nuevas.
- Hover y focus son obligatorios en cualquier elemento interactivo.
- Estado `active` (pressed) debe incluir `translateY(0.5px)` en botones y controles cliqueables.
- Preferir transiciones CSS sobre JavaScript.
- El conjunto mínimo de un botón o control interactivo: `transition: background 0.12s, color 0.12s, border-color 0.12s, box-shadow 0.12s, transform 0.06s`.

### Patrones prohibidos en código nuevo

Los siguientes patrones no deben aparecer en código nuevo, aunque existan en `src/web/template/migrated`:

- `window.*` para coordinar entre componentes.
- `location.hash` o hash-based routing.
- `window.Chart` / `window.L` / `window.Icon` / `window.App`.
- Eventos globales custom como `fz-overlay-open`.
- Archivos `.jsx` sin tipos.
- Colores hexadecimales hardcodeados en estilos de componentes.

---

## 17. Fundamentos del proyecto

Esta sección cubre las convenciones técnicas base que todo código nuevo debe respetar, independientemente de qué componente o pantalla se esté construyendo.

### Path aliases de TypeScript

Definidos en `tsconfig.json`. Usar siempre estos aliases — nunca rutas relativas con `../../../`.

| Alias | Resuelve a | Uso |
|-------|-----------|-----|
| `@/*` | `src/` | Acceso general a cualquier módulo del proyecto |
| `@fw/*` | `src/framework/` | Todo lo del framework: UI, utils, lib, i18n |
| `@web/*` | `src/web/` | Apps demo, template, i18n de aplicación |

**Ejemplos de imports correctos:**

```typescript
// Componentes del framework
import { Button, Card, Field, Input } from '@fw/ui/components'

// Utilidades
import { cn } from '@fw/lib/utils'

// Sistema de rutas y navegación
import { templateNavigation, type TemplateRouteKey } from '@fw/lib/routes'

// Shell
import { AppShell } from '@fw/ui/layout/app-shell'

// Un módulo de app demo
import { CrmContactsPage } from '@web/apps/crm/contacts'

// i18n de aplicación
import esMessages from '@web/i18n/es/my-module.json'
```

**Incorrecto — nunca hacer esto:**
```typescript
// ❌ Ruta relativa que cruza capas
import { Button } from '../../../framework/ui/components'
// ❌ Import desde @/ cuando existe alias más específico
import { cn } from '@/framework/lib/utils'
```

---

### La utilidad `cn()`

**Ubicación:** `src/framework/lib/utils.ts`
**Import:** `import { cn } from '@fw/lib/utils'`

`cn` combina `clsx` (lógica condicional de clases) con `tailwind-merge` (resolución de conflictos entre clases Tailwind). Es la forma estándar de componer clases en cualquier componente del framework.

**Casos de uso:**

```typescript
// 1. Composición básica — extender clases base con prop className
function Card({ className, ...props }) {
  return <div className={cn('card', className)} {...props} />
}

// 2. Clases condicionales — booleano
function NavItem({ active, disabled }) {
  return (
    <button className={cn(
      'fz-nav-item',
      active && 'active',
      disabled && 'opacity-50 cursor-not-allowed'
    )} />
  )
}

// 3. Clases condicionales — objeto
function Badge({ variant }) {
  return (
    <span className={cn('badge', {
      'success': variant === 'success',
      'danger':  variant === 'danger',
    })} />
  )
}

// 4. Múltiples fuentes — merge sin conflictos
cn('px-4 py-2', 'px-6')  // → 'py-2 px-6'  (px-4 descartado por tailwind-merge)
```

**Regla:** en todo componente nuevo, `className` del prop siempre se pasa como último argumento de `cn()` para que las clases externas puedan sobrescribir las internas.

---

### Convenciones TypeScript

- Modo estricto habilitado (`"strict": true`). Todos los componentes deben tener tipos explícitos.
- Componentes que necesitan acceso al DOM usan `React.forwardRef`.
- Props de componentes se tipan como intersección: `React.HTMLAttributes<TElement> & { propPropia: Tipo }`.
- No usar `any`. Si el tipo es desconocido, usar `unknown` y narrowing.
- Archivos nuevos siempre `.tsx` (componentes) o `.ts` (lógica pura). Nunca `.jsx` ni `.js`.

---

### Server Components vs. Client Components

La decisión más frecuente en Next.js App Router. Equivocarse tiene consecuencias de rendimiento o errores en runtime.

| Usar **Server Component** (por defecto) cuando... | Usar **Client Component** (`'use client'`) cuando... |
|---------------------------------------------------|------------------------------------------------------|
| Fetch de datos al cargar la página | Necesitas `useState`, `useReducer`, `useEffect` |
| Acceso a datos del servidor (DB, APIs internas) | Manejas eventos del DOM (`onClick`, `onChange`, etc.) |
| El componente no necesita interactividad | Usas hooks de Next.js (`useRouter`, `usePathname`) |
| Renderizado estático o con revalidación | Necesitas APIs del browser (`localStorage`, `window`) |
| Traducciones con `getTranslations` (server) | Usas `useTranslations` (client hook) |

**Regla práctica:** empezar como Server Component. Agregar `'use client'` solo cuando el compilador lo requiera o cuando necesites interactividad.

```typescript
// Server Component — sin directiva, fetch directo
export default async function ContactosPage() {
  const contacts = await fetchContacts()  // fetch en el servidor
  return <ContactList items={contacts} />
}

// Client Component — necesita estado e interacción
'use client'
export function ContactList({ items }) {
  const [selected, setSelected] = useState<string | null>(null)
  return (/* ... */)
}
```

**Importante:** `AppShell` es un Client Component (`'use client'`). Todo componente que use `AppShell` directamente también será client. Separar el fetch de datos en un Server Component padre y pasar los datos como props al componente con `AppShell`.

---

### Imágenes — `next/image` vs `<img>`

En Next.js App Router, usar siempre `next/image` para imágenes. El elemento `<img>` nativo genera warnings de lint y no está optimizado (sin lazy loading, sin formato WebP, sin size hints).

```typescript
import Image from 'next/image'

// ✅ Correcto — con dimensiones conocidas
<Image
  src="/logo.png"
  alt="Logo de la organización"
  width={120}
  height={40}
/>

// ✅ Correcto — imagen que llena su contenedor (requiere position: relative en padre)
<div style={{ position: 'relative', width: '100%', height: 200 }}>
  <Image src="/banner.jpg" alt="Banner" fill style={{ objectFit: 'cover' }} />
</div>

// ❌ Incorrecto — no usar <img> nativo en Next.js
<img src="/logo.png" alt="Logo" />
```

Para avatares e imágenes de usuario con fallback, usar el componente `Avatar` de la plantilla o un `<div>` con las iniciales del usuario (patrón del logo mark del sidebar).

---

## 18. AppShell — integración y props

`AppShell` es el componente raíz que ensambla el shell completo: sidebar, header, área de contenido y slots condicionales. Toda pantalla del framework vive como `children` de `AppShell`.

**Import:** `import { AppShell } from '@fw/ui/layout/app-shell'`

### Props completas

```typescript
type AppShellProps = {
  // ── Navegación ────────────────────────────────────────────────
  route:           TemplateRouteKey              // Clave de ruta activa. Controla qué item del sidebar se marca como activo.
  onNavigate:      (route: TemplateRouteKey) => void  // Se llama cuando el usuario hace clic en un item del sidebar.
  navigation?:     TemplateRouteGroup[]          // Árbol de navegación. Default: templateNavigation de @fw/lib/routes.

  // ── Estado del shell ──────────────────────────────────────────
  collapsed?:      boolean                       // Sidebar colapsado (solo iconos). Default: false.
  drawerOpen?:     boolean                       // Drawer mobile abierto. Default: false.
  dark?:           boolean                       // Usado internamente para el aria-label del toggle. El dark mode real se aplica con data-theme='dark' en <html>.
  lang?:           string                        // Código de idioma mostrado en el header. Default: 'es'.

  // ── Slots condicionales (áreas comodín) ──────────────────────
  adRail?:         React.ReactNode               // Panel publicitario (Ad Rail). Si se provee, setea data-ad-rail='true' y el grid reflowa a 3 columnas.
  announceBar?:    React.ReactNode               // Barra de avisos (Notice Bar). Si se provee, setea data-announce='true'.
  brand?:          React.ReactNode               // Zona de marca / Logo. Reemplaza el logo por defecto. Soporta logos horizontales, verticales o imágenes. Estilar la alineación/padding con tokens --brand-*.
  upgradeSlot?:    React.ReactNode               // Zona de upgrade (CTA freemium) en el pie del sidebar. Si no se provee, no se renderiza.

  // ── Callbacks del header ──────────────────────────────────────
  onToggleSidebar?: () => void                   // Click en el botón de menú (hamburguesa).
  onToggleDark?:    () => void                   // Click en el toggle de dark mode.

  // ── Contenido ─────────────────────────────────────────────────
  children:        React.ReactNode               // Contenido de la pantalla actual (va en fz-main-col > fz-page).
}
```

### Ejemplo mínimo de integración

```typescript
'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@fw/ui/layout/app-shell'
import type { TemplateRouteKey } from '@fw/lib/routes'

export function MyAppRuntime() {
  const [route, setRoute]       = useState<TemplateRouteKey>('dashboard')
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark]         = useState(false)

  // Sincronizar dark mode con el DOM
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  function handleNavigate(key: TemplateRouteKey) {
    setRoute(key)
    // En apps con Next.js routing real, aquí iría router.push(resolvePath(key))
  }

  return (
    <AppShell
      route={route}
      onNavigate={handleNavigate}
      collapsed={collapsed}
      dark={dark}
      onToggleSidebar={() => setCollapsed(c => !c)}
      onToggleDark={() => setDark(d => !d)}
    >
      {/* Contenido de la pantalla activa */}
      <CurrentScreen route={route} />
    </AppShell>
  )
}
```

### Dark mode — cómo funciona realmente

El prop `dark` en AppShell solo controla el `aria-label` del botón de toggle ("Modo oscuro" / "Modo claro"). El dark mode visual se activa poniendo `data-theme='dark'` en el elemento `html`. Dos formas de manejarlo:

**Opción A — Manual (sin librerías):**
```typescript
useEffect(() => {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light'
}, [dark])
```

**Opción B — Con `next-themes` (recomendado para apps con SSR):**
```typescript
// En el layout raíz
import { ThemeProvider } from 'next-themes'
<ThemeProvider attribute="data-theme" defaultTheme="light">
  {children}
</ThemeProvider>

// En el componente con el toggle
import { useTheme } from 'next-themes'
const { theme, setTheme } = useTheme()
```

La librería `next-themes` ya está en `package.json` y es la opción recomendada para nuevas apps.

### Navigation customizada por app

Para una app que tiene su propio árbol de navegación (no la plantilla completa), pasar `navigation` con solo los grupos y módulos relevantes:

```typescript
import type { TemplateRouteGroup } from '@fw/lib/routes'

const myAppNavigation: TemplateRouteGroup[] = [
  {
    label: 'CRM',
    items: [
      { key: 'contactos',  label: 'Contactos',  icon: 'Users'     },
      { key: 'empresas',   label: 'Empresas',   icon: 'Building'  },
      { key: 'negocios',   label: 'Negocios',   icon: 'Briefcase' },
    ],
  },
]

<AppShell navigation={myAppNavigation} ...>
```

---

## 19. Navegación y rutas

### Arquitectura de rutas — template vs. apps nuevas

La plantilla actual usa dos sistemas en paralelo:

| Sistema | Dónde | Cuándo usar |
|---------|-------|-------------|
| Hash routing (`/es#route-key`) | Pantallas migradas en `src/web/template/migrated` | Solo para pantallas existentes en la plantilla |
| Next.js App Router (`/es/mi-modulo`) | `src/app/[locale]/...` | **Siempre para pantallas nuevas** |

**Regla para apps nuevas:** nunca usar hash routing. Crear rutas reales en `src/app/[locale]/`.

---

### Estructura de rutas Next.js en este proyecto

```
src/app/
└── [locale]/               ← segmento de localización (es, en)
    ├── layout.tsx           ← proveedor de i18n
    ├── page.tsx             ← página raíz (carga TemplateRuntime)
    ├── [...slug]/page.tsx   ← catch-all para pantallas migradas (redirige a hash)
    ├── salus/proveedores/
    │   └── page.tsx         ← ejemplo de ruta Next real standalone
    └── examples/ui/
        └── page.tsx         ← ruta framework de ejemplos
```

**Para una nueva app, crear bajo `src/app/[locale]/`:**
```
src/app/[locale]/crm/
    ├── page.tsx                   ← /es/crm
    ├── contactos/page.tsx         ← /es/crm/contactos
    └── contactos/[id]/page.tsx    ← /es/crm/contactos/123
```

### Cómo crear una pantalla Next.js real — paso a paso

```typescript
// 1. Crear el archivo de ruta
// src/app/[locale]/crm/contactos/page.tsx

import { getTranslations } from 'next-intl/server'
import { ContactosPage } from '@web/apps/crm/contactos/contactos-page'

export default async function ContactosRoute() {
  const t = await getTranslations('crm')
  return <ContactosPage title={t('contacts.title')} />
}

// 2. Crear el componente de pantalla (client component con AppShell)
// src/web/apps/crm/contactos/contactos-page.tsx
'use client'

import { useState, useEffect } from 'react'
import { AppShell } from '@fw/ui/layout/app-shell'
import { PageHeader, Button } from '@fw/ui/components'
import type { TemplateRouteKey } from '@fw/lib/routes'

export function ContactosPage({ title }: { title: string }) {
  const [route, setRoute]       = useState<TemplateRouteKey>('contactos')
  const [collapsed, setCollapsed] = useState(false)
  const [dark, setDark]         = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = dark ? 'dark' : 'light'
  }, [dark])

  return (
    <AppShell
      route={route}
      onNavigate={setRoute}
      collapsed={collapsed}
      dark={dark}
      onToggleSidebar={() => setCollapsed(c => !c)}
      onToggleDark={() => setDark(d => !d)}
    >
      <PageHeader
        title={title}
        crumbs={[{ label: 'CRM' }, { label: 'Contactos', current: true }]}
        actions={<Button>Nuevo contacto</Button>}
      />
      {/* contenido de la pantalla */}
    </AppShell>
  )
}
```

### Metadata y títulos de página

Cada `page.tsx` debe exportar metadata para el título del browser tab y SEO básico.

```typescript
// src/app/[locale]/crm/contactos/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contactos — CRM | From Zero',
  description: 'Gestiona tu base de contactos',
}

export default function ContactosPage() { /* ... */ }
```

Para títulos dinámicos (que dependen de datos), usar `generateMetadata`:

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const contact = await fetchContact(params.id)
  return { title: `${contact.name} — Contactos | From Zero` }
}
```

**Patrón de título recomendado:** `{Sección} — {Módulo} | {App name}`

---

### Navegación entre páginas

**Siempre usar `next/link`, nunca `<a>`:**

```typescript
import Link from 'next/link'
import { useLocale } from 'next-intl'

// ✅ Correcto — navegación sin recarga
<Link href={`/${locale}/crm/contactos`}>Ver contactos</Link>

// ✅ Con locale dinámico
const locale = useLocale()
<Link href={`/${locale}/crm/contactos/${id}`}>Ver detalle</Link>

// ❌ Incorrecto — provoca recarga completa de página
<a href="/es/crm/contactos">Ver contactos</a>
```

**Navegación programática:**
```typescript
import { useRouter } from 'next/navigation'
const router = useRouter()
router.push(`/${locale}/crm/contactos`)
```

### Sistema de rutas del framework (`@fw/lib/routes`)

Exports disponibles:

| Export | Tipo | Descripción |
|--------|------|-------------|
| `templateRoutePaths` | `Record<string, TemplateRouteKey>` | Mapa de path URL → clave de ruta |
| `templateNavigation` | `TemplateRouteGroup[]` | Árbol de navegación completo de la plantilla |
| `resolveTemplateRouteFromPath(path)` | `(string) → TemplateRouteKey` | Convierte un path URL en clave de ruta |
| `resolveTemplatePathFromRoute(key)` | `(TemplateRouteKey) → string` | Convierte una clave en path URL |

### Agregar un módulo nuevo al sidebar

1. Agregar la clave y path en `templateRoutePaths`:
```typescript
'mi-modulo/lista': 'mi-modulo-lista',
'mi-modulo/detalle': 'mi-modulo-detalle',
```

2. Agregar el grupo o ítem en `templateNavigation`:
```typescript
{
  label: 'MI MÓDULO',
  items: [
    {
      key: 'mi-modulo',
      icon: 'Box',           // Debe estar en el iconMap de app-shell.tsx
      label: 'Mi módulo',
      children: [
        { key: 'mi-modulo-lista',   label: 'Lista'   },
        { key: 'mi-modulo-detalle', label: 'Detalle' },
      ],
    },
  ],
}
```

3. Si el icono no existe en `iconMap`, importarlo en `app-shell.tsx` y agregarlo al mapa:
```typescript
// En app-shell.tsx — imports de lucide-react
import { MiIcono } from 'lucide-react'

// En iconMap
const iconMap = {
  // ... existentes
  MiIcono,
}
```

### Íconos disponibles en el sidebar (registrados en iconMap)

`Bell` · `Box` · `Briefcase` · `Building` · `Calendar` · `Cart` · `CheckCircle` · `CheckSquare` · `Clock` · `CreditCard` · `File` · `Form` · `Globe` · `Grid` · `Headphones` · `Image` · `MapPin` · `Pin` · `Plug` · `Search` · `Settings` · `Sparkles` · `Star` · `Table` · `User` · `Users`

Para usar un ícono de Lucide no listado aquí, debe agregarse al `iconMap` en `src/framework/ui/layout/app-shell.tsx`.

---

## 20. Internacionalización — i18n

**Librería:** `next-intl` v4  
**Locales disponibles:** `['es', 'en']`  
**Locale por defecto:** `'es'`  
**Config:** `src/i18n/routing.ts` y `src/i18n/request.ts`

### Arquitectura de archivos de mensajes

```
src/
├── framework/i18n/
│   ├── es/layout.json     ← Strings del framework (app name, etc.)
│   └── en/layout.json
└── web/i18n/              ← Strings de cada app o módulo (crear por módulo)
    ├── es/
    │   ├── crm.json
    │   └── mi-modulo.json
    └── en/
        ├── crm.json
        └── mi-modulo.json
```

**Strings actuales del framework (`layout.json`):**
```json
{ "appName": "From Zero", "template": "Plantilla" }
```
Accesibles vía namespace `'layout'`.

### Agregar traducciones a un módulo nuevo

**1. Crear los archivos JSON:**
```json
// src/web/i18n/es/mi-modulo.json
{
  "title": "Mi Módulo",
  "list": {
    "empty": "Aún no hay registros",
    "new": "Nuevo registro"
  },
  "form": {
    "save": "Guardar cambios",
    "cancel": "Cancelar",
    "name": "Nombre",
    "namePlaceholder": "Escribe un nombre"
  },
  "delete": {
    "confirm": "Eliminar registro",
    "warning": "Esta acción no se puede deshacer.",
    "button": "Confirmar eliminación"
  }
}
```

**2. Registrar en `src/i18n/request.ts`:**
```typescript
import { getRequestConfig } from 'next-intl/server'
import { hasLocale } from 'next-intl'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  const layoutMessages   = (await import(`../framework/i18n/${locale}/layout.json`)).default
  const miModuloMessages = (await import(`../web/i18n/${locale}/mi-modulo.json`)).default

  return {
    locale,
    messages: {
      layout:    layoutMessages,
      miModulo:  miModuloMessages,
    },
  }
})
```

### Usar traducciones en componentes

**En un Server Component (recomendado para texto estático):**
```typescript
import { getTranslations } from 'next-intl/server'

export default async function MiPagina() {
  const t = await getTranslations('miModulo')
  return (
    <PageHeader
      title={t('title')}
      actions={<Button>{t('list.new')}</Button>}
    />
  )
}
```

**En un Client Component (`'use client'`):**
```typescript
'use client'
import { useTranslations } from 'next-intl'

export function MiFormulario() {
  const t = useTranslations('miModulo')
  return (
    <Field label={t('form.name')}>
      <Input placeholder={t('form.namePlaceholder')} />
    </Field>
  )
}
```

### Reglas de i18n

- **Nunca hardcodear strings de UI** en componentes. Todo texto visible debe venir de un archivo de mensajes.
- Crear siempre los dos archivos (`es` y `en`) aunque el inglés sea provisional.
- Namespace por módulo o dominio, no un archivo global de toda la app.
- Claves en camelCase, agrupadas por sección del módulo.
- Los valores del `enum`-like (estados, categorías) también se traducen: `"status.active": "Activo"`.
- Fechas y números: usar los helpers de `next-intl` (`useFormatter`) para formateo locale-aware. No formatear a mano.

---

## 21. Flujos de interacción comunes

Los dos flujos más frecuentes en cualquier aplicación. Seguir estas estructuras exactas garantiza consistencia en comportamiento, manejo de errores y feedback al usuario.

### Flujo de submit de formulario

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button, Field, Input, Select } from '@fw/ui/components'

type FormErrors = Partial<Record<string, string>>

export function MyForm() {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors]   = useState<FormErrors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    // 1. Clear previous errors
    setErrors({})

    // 2. Client-side validation
    const data = new FormData(e.currentTarget)
    const name = (data.get('name') as string)?.trim()

    const newErrors: FormErrors = {}
    if (!name) newErrors.name = 'El nombre es obligatorio'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return  // Exit before setLoading — no async operation to show
    }

    // 3. Enable loading state
    setLoading(true)

    try {
      // 4. Execute the operation
      await saveRecord({ name })

      // 5a. Success
      toast.success('Cambios guardados')
      // Optional: reset form, close modal, redirect

    } catch (err) {
      // 5b. Distinguish server validation errors from network errors.
      // Adapt this check to your API's error shape.
      // Example: if your API returns { status: 422, fields: { name: 'already taken' } }
      if (err && typeof err === 'object' && 'fields' in err) {
        setErrors(err.fields as FormErrors)  // Server-side field errors
      } else {
        toast.error('No se pudo guardar. Intenta de nuevo.')
      }
    } finally {
      // 6. Always clear loading
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Field label="Nombre" error={errors.name}>
        <Input
          name="name"
          data-state={errors.name ? 'error' : undefined}
          // data-state='error' must be set manually on Input — Field does not propagate it (known gap §15)
        />
      </Field>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Button type="button" variant="ghost" disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" loading={loading}>
          Guardar cambios
        </Button>
      </div>
    </form>
  )
}
```

**Reglas del flujo de submit:**

| Regla | Por qué |
|-------|---------|
| `e.preventDefault()` siempre al inicio | Evitar recarga de página |
| Limpiar errores antes de validar | Eliminar mensajes de submit anterior |
| `setLoading(true)` solo si la validación client-side pasa | No mostrar spinner en errores de formulario |
| `finally { setLoading(false) }` siempre | El loading debe desaparecer pase lo que pase |
| `data-state='error'` manual en el control | Field no lo propaga automáticamente (brecha conocida §15) |
| Errores de campo → inline · Errores de operación → toast | Cada canal tiene su propósito |

---

### Flujo de acción destructiva con confirmación

```typescript
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Modal, Button } from '@fw/ui/components'

type Props = {
  id: string
  name: string        // Para mostrar qué se va a eliminar
  onDeleted: () => void  // Callback al padre para refrescar la lista
}

export function DeleteRecordButton({ id, name, onDeleted }: Props) {
  const [modalOpen, setModalOpen] = useState(false)
  const [loading, setLoading]     = useState(false)

  async function handleConfirm() {
    setLoading(true)
    try {
      await deleteRecord(id)
      toast.success(`"${name}" fue eliminado`)
      setModalOpen(false)
      onDeleted()          // Notificar al padre para refrescar datos
    } catch {
      toast.error('No se pudo eliminar. Intenta de nuevo.')
      // El modal permanece abierto para que el usuario pueda reintentar
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Trigger */}
      <Button variant="danger" onClick={() => setModalOpen(true)}>
        Eliminar
      </Button>

      {/* Modal de confirmación */}
      <Modal
        open={modalOpen}
        title="Eliminar registro"
        description={`¿Seguro que deseas eliminar "${name}"? Esta acción no se puede deshacer.`}
        onClose={() => {
          if (!loading) setModalOpen(false)
          // Bloquear cierre mientras la operación está en curso
        }}
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              loading={loading}
              onClick={handleConfirm}
            >
              Confirmar eliminación
            </Button>
          </>
        }
      />
    </>
  )
}
```

**Reglas del flujo destructivo:**

| Regla | Por qué |
|-------|---------|
| Siempre abrir Modal antes de ejecutar | Una acción destructiva nunca es inmediata |
| `onClose` bloqueado mientras `loading` | No se puede cerrar a mitad de la operación |
| Botón Cancelar `disabled` mientras `loading` | Consistencia con el bloqueo del modal |
| Éxito: cerrar modal + callback al padre | El padre debe refrescar su lista de datos |
| Error: el modal permanece abierto | El usuario puede reintentar sin perder el contexto |
| Mencionar qué se elimina en la descripción | El usuario debe saber exactamente qué perderá |

---

### Flujo de carga inicial de datos (data fetching)

```typescript
'use client'

import { useState, useEffect } from 'react'
import { EmptyState, TableShell, /* ... */ } from '@fw/ui/components'

type State<T> =
  | { status: 'loading' }
  | { status: 'empty'   }
  | { status: 'error';   message: string }
  | { status: 'success'; data: T }

export function RecordList() {
  const [state, setState] = useState<State<Record[]>>({ status: 'loading' })

  useEffect(() => {
    fetchRecords()
      .then(data => setState(
        data.length === 0
          ? { status: 'empty' }
          : { status: 'success', data }
      ))
      .catch(err => setState({ status: 'error', message: err.message }))
  }, [])

  if (state.status === 'loading') return <TableSkeleton />

  if (state.status === 'empty') return (
    <EmptyState
      title="Aún no hay registros"
      description="Crea el primero para empezar."
      actions={<Button>Nuevo registro</Button>}
    />
  )

  if (state.status === 'error') return (
    <EmptyState
      title="No se pudieron cargar los datos"
      description={state.message}
      // Use router.refresh() to retry — never window.location.reload() (forbidden pattern per §16)
      actions={<Button variant="outline" onClick={refetch}>Reintentar</Button>}
    />
  )

  return <DataTable data={state.data} />
}
```

`refetch` se puede implementar con `useRouter` de Next.js:
```typescript
import { useRouter } from 'next/navigation'
const router = useRouter()
const refetch = () => router.refresh()
// Or with a counter to re-trigger the useEffect:
// const [tick, setTick] = useState(0)
// const refetch = () => setTick(t => t + 1)
// useEffect(() => { fetchRecords()... }, [tick])
```

Los cuatro estados (loading, empty, error, success) deben tratarse siempre. Nunca renderizar `null` cuando hay un error o el estado está cargando.

---

### Cuándo usar Server Component para fetching vs. `useEffect` client

| Usar **Server Component** + `async/await` | Usar **`useEffect`** en Client Component |
|------------------------------------------|----------------------------------------|
| Datos necesarios al cargar la página | Datos que dependen de interacción del usuario |
| No hay interactividad en el componente | El componente ya es `'use client'` por otro motivo |
| Mejor rendimiento (sin waterfall JS) | Refetch tras una acción del usuario (filtrar, ordenar) |
| SEO importante para el contenido | Estado de UI que vive solo en el cliente |

```typescript
// Preferred — Server Component with direct fetch
export default async function ContactosPage() {
  const contacts = await fetchContacts()   // Runs on the server, no useEffect needed
  return <ContactosTable initialData={contacts} />
}

// Only when interactivity is required — Client Component
'use client'
export function ContactosTable({ initialData }: { initialData: Contact[] }) {
  const [data, setData] = useState(initialData)
  // Interactions that trigger refetch go here
}
```

---

## 22. Visualización de datos — gráficas

### Librería

**Recharts** para pantallas nuevas (tipado, React-nativo, dark-mode friendly).  
**Chart.js** solo en pantallas ya migradas que dependan de él — no usar en código nuevo.

**Import de Recharts:**
```typescript
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
```

### Tokens de gráficas

| Token | Valor light | Uso |
|-------|-------------|-----|
| `--chart-grid` | `rgba(15,18,28,0.06)` | Líneas de cuadrícula (CartesianGrid stroke) |
| `--chart-axis` | `#8B91A1` | Etiquetas de ejes (XAxis/YAxis tick fill) |

En dark mode, estos tokens se ajustan automáticamente — usar siempre `var(--chart-grid)` y `var(--chart-axis)`, no valores fijos.

### Paleta de colores para series

Usar los tokens del design system en este orden. Garantiza coherencia visual y funciona en dark mode.

| Serie | Token CSS | Valor hex | Uso |
|-------|-----------|-----------|-----|
| 1ª | `var(--accent)` | `#465FFF` | Serie principal |
| 2ª | `var(--success)` | `#17B26A` | Comparativa positiva |
| 3ª | `var(--warning)` | `#F59E0B` | Alerta o comparativa neutra |
| 4ª | `var(--danger)` | `#F04438` | Comparativa negativa |
| 5ª | `var(--info)` | `#2E90FA` | Serie informativa |
| 6ª | `#9B59B6` | `#9B59B6` | Sin token; usar hex directamente |

Para más de 6 series, usar tintes al 60% de los colores de la paleta.

### Guía de tipo de gráfica según el dato

| Tipo de dato | Gráfica recomendada | Recharts |
|--------------|--------------------|---------| 
| Evolución temporal (tendencia) | Líneas | `LineChart` + `Line` |
| Evolución con volumen acumulado | Área | `AreaChart` + `Area` |
| Comparación entre categorías discretas | Barras verticales | `BarChart` + `Bar` |
| Distribución / ranking | Barras horizontales | `BarChart layout="vertical"` |
| Composición de un total (≤5 partes) | Dona | `PieChart` + `Pie` con `innerRadius` |
| Composición con más detalle (≤3 partes) | Pastel | `PieChart` + `Pie` sin `innerRadius` |
| Dos variables numéricas correlacionadas | Dispersión | `ScatterChart` |
| Progreso hacia meta única | Barra de progreso lineal | Componente custom (no Recharts) |

Evitar pie/donut con más de 5 segmentos — la legibilidad colapsa.

### Estructura estándar de una gráfica

```typescript
import { ChartContainer } from '@fw/ui/components'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

export function SalesChart({ data }: { data: DataPoint[] }) {
  return (
    <ChartContainer
      title="Evolución de ventas"
      subtitle="Últimos 30 días"
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--chart-grid)"
            vertical={false}          // Solo líneas horizontales — más limpio
          />
          <XAxis
            dataKey="date"
            tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--chart-axis)', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-card)',
              color: 'var(--text)',
              fontSize: 13,
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={2}
            dot={false}               // Sin puntos — línea más limpia
            activeDot={{ r: 4, fill: 'var(--accent)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
```

### Reglas de gráficas

- Siempre usar `ChartContainer` como wrapper (da Card + header estructurado).
- `ResponsiveContainer` siempre con `width="100%"` y `height` como número fijo en píxeles.
- Usar `var(--chart-grid)` y `var(--chart-axis)` — nunca colores hardcodeados en los ejes.
- El `Tooltip` siempre usa tokens de superficie y borde para integrarse con el tema.
- `axisLine={false}` y `tickLine={false}` en todos los ejes — más limpio y premium.
- Para gráficas de área: `fillOpacity` entre 0.08 y 0.15 sobre el color de la serie.

---

## 23. Accesibilidad mínima

Esta sección define el baseline que todo componente y pantalla nueva debe cumplir. No es una guía exhaustiva de accesibilidad — es el mínimo no negociable. **Objetivo de conformidad: WCAG 2.2 nivel AA.**

### Criterios WCAG 2.2 AA a verificar

- **Foco nunca oculto.** El indicador de foco no debe quedar tapado por un header/footer sticky u overlay. Mantener el elemento enfocado visible (scroll-margin si hace falta).
- **Alternativa a arrastre.** Toda acción por drag (reordenar, deslizar) debe tener alternativa por tap/clic.
- **Objetivos táctiles suficientes.** Controles interactivos con área cómoda (los botones del shell ya cumplen: icon-only 38×38px, inputs 42px).
- **Sin pruebas cognitivas en login.** No exigir recordar/resolver acertijos como única vía de autenticación.
- **Protección ante errores destructivos.** Toda acción destructiva pasa por confirmación o es reversible (ver flujo en §21).

### Movimiento accesible

- La plantilla respeta `prefers-reduced-motion` con un bloque global en `globals.css` que reduce animaciones, transiciones largas y scroll suave. Es un requisito de accesibilidad **y** un principio premium (§4).
- No introducir animaciones que ignoren esa preferencia. Animaciones de gran amplitud, autoplay o parallax deben desactivarse bajo `prefers-reduced-motion: reduce`.

### Elementos interactivos

- Todo botón y enlace debe tener texto accesible: visible en pantalla, o `aria-label` si es solo-icono.
- El foco debe ser siempre visible. Nunca `outline: none` sin reemplazarlo con `--shadow-focus`.
- Todos los elementos interactivos deben ser alcanzables con `Tab`. El orden de foco debe seguir el flujo visual de la pantalla.
- Botones solo-icono: obligatorio `aria-label` descriptivo de la acción, no del ícono.

```typescript
// ✅ Correcto
<button aria-label="Cerrar panel" onClick={onClose}>
  <X size={16} />
</button>

// ❌ Incorrecto — sin label para screen readers
<button onClick={onClose}>
  <X size={16} />
</button>
```

### Formularios

- Cada control debe tener una etiqueta asociada. Usar el componente `Field` que renderiza `<label>` automáticamente.
- Si no se usa `Field`, asociar manualmente con `htmlFor` + `id` en el input.
- Campos requeridos: agregar atributo `required` en el control HTML (accesibilidad nativa) y un indicador visual (asterisco junto al label).
- Mensajes de error dinámicos: agregar `role="alert"` o `aria-live="polite"` al contenedor del mensaje para que sean anunciados a lectores de pantalla.

```typescript
// El componente Field ya maneja esto correctamente:
<Field label="Correo electrónico" error="El correo no es válido">
  <Input type="email" required data-state="error" />
</Field>
// Pero si necesitas anuncio automático del error, agregar al Field: aria-live="polite"
```

### Modales y Drawers

Los componentes `Modal` y `Drawer` ya incluyen `role="dialog"` y `aria-modal="true"`. Lo que debe agregarse manualmente:

- **Focus trap:** al abrir el modal, mover el foco al primer elemento interactivo dentro de él.
- **Escape para cerrar:** el handler de `onClose` debe activarse con `keydown` Escape.
- **Retorno de foco:** al cerrar, el foco debe volver al elemento que abrió el overlay.

```typescript
// Ejemplo de escape key handler en el componente que controla el modal
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && modalOpen && !loading) setModalOpen(false)
  }
  document.addEventListener('keydown', handleKeyDown)
  return () => document.removeEventListener('keydown', handleKeyDown)
}, [modalOpen, loading])
```

### Tablas

- Usar siempre `TableHeader` (`<th>`) para celdas de encabezado — nunca `TableCell` (`<td>`) para eso.
- Si hay selección de filas, el checkbox del encabezado necesita `aria-label="Seleccionar todos"`.
- Si hay ordenamiento, agregar `aria-sort="ascending"`, `"descending"` o `"none"` en el `<th>` activo.

### Contraste de color

| Combinación | Ratio | ¿Pasa AA? |
|-------------|-------|-----------|
| `--text` (#15171C) sobre `--surface` (#FFF) | ~19:1 | ✅ AAA |
| `--on-accent` (#FFF) sobre `--accent` (#465FFF) | ~4.8:1 | ✅ AA |
| `--text-muted` (#5B6271) sobre `--surface` (#FFF) | ~5.7:1 | ✅ AA |
| `--text-faint` (#8B91A1) sobre `--surface` (#FFF) | ~3.1:1 | ❌ Falla AA |

**Regla crítica:** `--text-faint` no debe usarse para texto que contenga información importante. Solo para elementos decorativos o de menor jerarquía (separadores de nav, placeholders en inputs vacíos, chevrons).

### Imágenes e iconos decorativos

- Iconos puramente decorativos (que el texto adyacente ya describe): `aria-hidden="true"`.
- Imágenes con contenido semántico: siempre `alt` descriptivo.
- Imágenes decorativas: `alt=""` (vacío, no omitido).

```typescript
// ✅ Ícono decorativo — el botón ya tiene texto
<button>
  <Save aria-hidden="true" size={16} />
  Guardar
</button>

// ✅ Ícono informativo — no hay texto
<button aria-label="Guardar cambios">
  <Save size={16} />
</button>
```

---

## 24. Mantenimiento del documento

Este documento debe actualizarse cada vez que se modifique el framework. La responsabilidad recae en el agente o desarrollador que realiza el cambio — no en una revisión periódica posterior.

### Regla general

> Cualquier cambio en `src/framework/` o `src/app/globals.css` que afecte la API pública, los tokens visuales o el comportamiento del shell **requiere actualizar este documento antes de cerrar el PR o la tarea**.

---

### Tabla de triggers

| Qué cambió | Secciones a actualizar |
|-----------|----------------------|
| Nuevo token CSS en `globals.css` | §2 (agregar a la tabla correspondiente con valores light y dark) · §13 si es token de dark mode |
| Token CSS eliminado o renombrado | §2 + búsqueda global en el documento para eliminar todas las referencias |
| Nuevo componente en `src/framework/ui/components/` | §9 (agregar a la tabla de inventario con descripción y cuándo usarlo) · §11 (API TypeScript completa) · §10 si genera un nuevo dilema de decisión · Eliminar de la lista de "no existe" en §9 si estaba listado ahí |
| Componente eliminado del framework | §9 (eliminar de la tabla) · §11 (eliminar API) · §10 si hay decisión que lo menciona · Agregar a la lista de "no existe" si es relevante |
| Se resuelve una brecha de animación de §15 | §15 (cambiar ⚠️ por ✅ y actualizar descripción) · §4 si cambia el estándar de interacción del tipo de elemento |
| Nueva prop en un componente existente | §11 (agregar a la tabla de props del componente) · §9 si cambia el resumen de uso |
| Cambio en `AppShell` props o comportamiento | §18 (props completas y ejemplo) · §8.2/§8.3 si afecta header o sidebar |
| Cambio en la estructura de rutas o en `routes.ts` | §19 (navegación y rutas) |
| Cambio en la estructura de i18n o `request.ts` | §20 (i18n) |
| Nuevo breakpoint responsive o cambio en los existentes | §7 (tabla de breakpoints y reglas) |
| Cambio en el mecanismo de dark mode | §13 + §18 (dark mode en AppShell) |
| Cambio en el mecanismo de densidad | §14 |
| Nuevo icono agregado al `iconMap` de `app-shell.tsx` | §19 (lista de íconos disponibles en el sidebar) |
| Nueva fuente tipográfica | §2.2 (familias) · §17 si cambia el import en `layout.tsx` |
| Nueva área maestra o renombrada | §1, §8 · **`interface-architecture.md`** (vocabulario canónico) |
| Nuevo token de personalización (`--brand-*`, `--drawer-*`, etc.) | §2.6, §2.7 · `interface-architecture.md` §4 |
| Nueva prop de slot en AppShell (`brand`, `upgradeSlot`) | §18 · `interface-architecture.md` |

---

### Checklist antes de cerrar una tarea que toca el framework

```
[ ] ¿Modifiqué tokens en globals.css?         → actualizar §2 y/o §13
[ ] ¿Agregué o eliminé un componente?          → actualizar §9, §11, §10
[ ] ¿Cambié la API de un componente?           → actualizar §11
[ ] ¿Resolví una brecha de animación?          → actualizar §15 y §4
[ ] ¿Cambié algo en AppShell o el shell?       → actualizar §18, §8
[ ] ¿Cambié rutas, i18n o configuración?       → actualizar §19 o §20
[ ] ¿Agregué un icono al iconMap?              → actualizar §19
```

Si ninguna de las casillas aplica, no es necesario actualizar el documento.

---

### Cómo actualizar

1. Leer la sección afectada en su estado actual.
2. Hacer el cambio mínimo necesario: agregar, modificar o eliminar exactamente lo que cambió.
3. No reformular secciones no afectadas.
4. Verificar que la "Tabla de triggers" de §24 siga siendo correcta.
5. Si el cambio genera un nuevo dilema de decisión recurrente, agregar un bloque a §10.

---

*Documento generado el 2026-06-02. Actualizado el 2026-06-05 (áreas maestras, personalización global §2.7, Side Panel `size`, slots `brand`/`upgradeSlot`, principios premium §4, WCAG 2.2 §23; absorbió la guía premium, el inventario y la metodología de extracción).*
*Fuente primaria: `src/app/globals.css`, `src/framework/ui/`, `src/framework/lib/`, `src/i18n/`. Mapa de alto nivel: `docs/interface-architecture.md`.*

*Este documento es vinculante. Referenciado en `AGENTS.md` como lectura obligatoria antes de crear cualquier elemento nuevo. Actualizar según §24 cuando se agreguen tokens, componentes, áreas maestras, o cambien convenciones de routing.*
