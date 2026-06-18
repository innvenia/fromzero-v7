# AI Reference Contract

This directory is a reference template for building the From Zero Framework and future applications. It is not the framework itself and must not be copied into final products as-is.

## Required Reading Order

Any AI model or coding agent using this template as context must read these files before extracting patterns, generating framework code or generating application code:

1. `README.md` for project status, structure, commands, the stack/version matrix and validation expectations.
2. `docs/interface-architecture.md` for the **canonical master-area vocabulary** (Topbar, Sidebar, Brand, Workspace, Page Header, Notice Bar, Ad Rail, Upgrade Slot, Side Panel), wildcard-area reflow, the Side Panel presets and the global customization model. **Read first for the high-level UI map and for migrating components across apps.**
3. `docs/design-system.md` for visual standards, design tokens, the global customization surface, component inventory, TypeScript API, animation rules, premium motion principles, accessibility (WCAG 2.2 AA) and the extension/extraction methodology. **Required before creating any new element, screen or component.**
4. `src/framework/ui/README.md` for framework UI contracts and available primitives.

If the task involves a specific demo app, also read the corresponding manifest under `src/web/apps/<app>/manifest.ts`.

This is a **component and structure library, not a product**. Do not copy it verbatim into a final app: reuse its master areas, tokens, look-and-feel and components to build the target app in its own stack.

## Required Interpretation

- Treat `src/framework` as the reusable framework seed.
- Treat `src/framework/ui/components` as the preferred source for new UI primitives.
- Treat `src/web/apps` as organized demo domains and examples of application composition.
- Treat `src/web/template/migrated` as a visual and behavioral catalog only.
- Treat migrated `.jsx` files as reference material, not final architecture.

## Do Not Inherit

When using this template to create the framework or a final application, do not inherit these migration compatibility patterns:

- `window.*` runtime contracts.
- `location.hash` or hash-based routing.
- `window.Chart` / global Chart.js usage.
- `window.L` / global Leaflet usage.
- Global event buses such as `fz-export-open`, `fz-import-open`, `fz-overlay-open` and `fz-overlay-close`.
- Runtime registration via `window.App`, `window.Icon` or similar globals.
- Untyped copied `.jsx` screens as production source.

This debt is concentrated in `src/web/template/migrated` (hash routing, `window.*`, global Chart.js/Leaflet, custom global events such as `fz-overlay-open`). The reusable framework in `src/framework/ui` and the reference route `/es/examples/ui` are free of it. New code must not reintroduce these patterns.

## Required Replacement Patterns

- Use explicit React props, typed hooks and local module imports.
- Use Next.js routes for application navigation.
- Use domain-local state, context or typed stores instead of global browser state.
- Use `lucide-react` imports directly instead of `window.Icon`.
- Use Recharts or typed React chart components for new charts.
- Wrap map libraries in typed React components instead of assigning globals.
- Extract reusable UI into `src/framework/ui/components` and export from `index.ts`.

## Before Copying Any Migrated Pattern

1. Complete the required reading order above.
2. Locate the equivalent framework component first (`docs/design-system.md` §9 inventory).
3. Apply the extraction methodology in `docs/design-system.md` §16 before using migrated code.
4. Verify the new element conforms to `docs/design-system.md` — tokens, animation states, premium principles and extension rules.
5. Map the pattern to its target master area (`docs/interface-architecture.md`).
6. If a migrated pattern depends on globals (see "Do Not Inherit"), replace that dependency in the target implementation.

The goal is to learn from the visual and product coverage of this template while producing clean framework/application code.

## Stack and Versions

The verified stack/version matrix and the version policy live in `README.md` (Stack section). Policy: prefer the latest stable versions (security patches); the whole stack is already on its latest compatible major (Next.js 16, React 19, Tailwind 4). The only documented residual risk is a moderate transitive `postcss` advisory via Next.js tooling — do not run `npm audit fix --force` (it would downgrade Next.js incorrectly). When bumping, re-run `npm audit`, `npm run lint`, `npm run build` and `npm run test:e2e`.

## Maintaining the Design System

Any change to `src/framework/` or `src/app/globals.css` that affects public API, visual tokens, or shell behavior **requires updating `docs/design-system.md` before the task is considered complete**.

The update rules are defined in `docs/design-system.md` §24. Before closing any task that touches the framework, run the checklist in that section to determine which sections need updating.

Specific triggers:
- New or removed CSS token → update §2 (and §13 if dark mode related; §2.7 customization surface).
- New or removed framework component → update §9, §11, and §10 if it introduces a decision pattern.
- Resolved animation gap → update §15 and §4.
- Change to AppShell props → update §18.
- Change to routing, i18n, or responsive breakpoints → update §19, §20, or §7.
- New icon added to `iconMap` → update the icon list in §19.
- New, renamed or removed master area → update `docs/interface-architecture.md` **and** design-system §1/§8. Both must use the same canonical names.
- New customization token (`--brand-*`, `--drawer-*`, shell dimensions) → update §2.6/§2.7 and `interface-architecture.md`.
