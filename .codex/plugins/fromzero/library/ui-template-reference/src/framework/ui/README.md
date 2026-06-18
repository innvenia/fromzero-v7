# Framework UI

Shared UI primitives for From Zero live in `src/framework/ui/components`. New reusable components should use explicit props, TypeScript types and `@fw/lib/utils` for class composition.

`src/web/template/migrated` is the standalone visual catalog from the migration. Treat its compatibility bridge as application/demo code: do not copy its `window.*`, hash routing, Chart.js globals or inline runtime registration patterns into new framework components.

New charts should use `recharts` by default. `chart.js` remains only for migrated parity until those screens are extracted.

## Migration Contract

- Do not simplify or remove any visual surface before its framework replacement exists and passes e2e parity.
- Keep reusable primitives in `src/framework/ui/components`; demo composition belongs in `src/web`.
- Keep migration compatibility isolated under `src/web/template/migrated`.
- Framework components must not depend on migrated demo runtime globals.
- Reduce `window.*` and hash routing only after parity tests protect the equivalent explicit React contracts.

## Current Primitives

- Actions: `Button`
- Status: `Badge`
- Containers: `Card`, `CardHeader`, `CardBody`, `CardTitle`, `CardSubtitle`, `CardFooter`
- Page chrome: `PageHeader`, `Breadcrumb`
- Forms: `Field`, `Input`, `Select`, `Textarea`
- Data: `TableShell`, `TableToolbar`, `TableScroll`, `Table`, `TableHead`, `TableBody`, `TableRow`, `TableHeader`, `TableCell`, `TableFooter`
- Metrics: `StatCard`, `DashboardGrid`, `ChartContainer`
- States: `EmptyState`
- Navigation controls: `SegmentedTabs`
- Overlays: `Modal`, `Drawer`

## Usage Reference

Open `/es/examples/ui` while the dev server is running. That route demonstrates the framework primitives without `window.*`, `location.hash`, Chart.js global state or migrated runtime registration.

## Extraction Backlog

- App shell, sidebar and header should be extracted only after the final navigation contract is defined.
- Auth, settings and CRUD pages should be extracted by workflow, not by copying generated JSX.
- Charts should move to Recharts when each visual has a parity test.
