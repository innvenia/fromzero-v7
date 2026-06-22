import type { ReactNode } from "react";

import { Badge } from "../ui/components";

export type DataGridColumn = {
  field: string;
  label: string;
  type?: "text" | "number" | "date" | "boolean" | "badge" | "avatar" | "link";
  width?: string;
};

export type DataGridLabels = {
  actionsColumn: string;
  ariaLabel: string;
  emptyCell: string;
  loadingLabel: string;
  nextPage: string;
  pageSummary: string;
  previousPage: string;
  selectAllRows: string;
  selectRow: string;
};

export type DataGridProps<TRecord extends Record<string, unknown>> = {
  columns: readonly DataGridColumn[];
  currentPage: number;
  getRowId: (record: TRecord) => string;
  labels: DataGridLabels;
  pageSize: number;
  rowActions?: readonly ReactNode[];
  rows: readonly TRecord[];
  totalCount: number;
  isFetching?: boolean;
};

function getCellValue(record: Record<string, unknown>, field: string): unknown {
  return field.split(".").reduce<unknown>((value, segment) => {
    if (value && typeof value === "object" && segment in value) {
      return (value as Record<string, unknown>)[segment];
    }

    return undefined;
  }, record);
}

function renderPrimitiveValue(value: unknown): string {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "bigint") {
    return value.toString();
  }

  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }

  if (typeof value === "symbol") {
    return value.description ?? "";
  }

  return JSON.stringify(value) ?? "";
}

function renderCellValue(value: unknown, type: DataGridColumn["type"], emptyCell: string) {
  if (value === null || value === undefined || value === "") {
    return <span className="text-[var(--text-faint)]">{emptyCell}</span>;
  }

  if (type === "badge") {
    return <Badge tone="info">{renderPrimitiveValue(value)}</Badge>;
  }

  if (type === "boolean") {
    return <span className="font-semibold text-[var(--text-strong)]">{renderPrimitiveValue(value)}</span>;
  }

  return renderPrimitiveValue(value);
}

export function DataGrid<TRecord extends Record<string, unknown>>({
  columns,
  currentPage,
  getRowId,
  isFetching = false,
  labels,
  pageSize,
  rowActions = [],
  rows,
  totalCount
}: DataGridProps<TRecord>) {
  return (
    <section
      aria-busy={isFetching}
      aria-label={labels.ariaLabel}
      className="overflow-hidden rounded-[var(--r-card)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]"
    >
      <div className="hidden overflow-x-auto md:block">
        <table aria-label={labels.ariaLabel} className="w-full min-w-[720px] border-collapse text-left">
          <thead className="bg-[var(--surface-2)]">
            <tr>
              <th className="w-11 border-b border-[var(--divider)] px-3 py-3">
                <input aria-label={labels.selectAllRows} type="checkbox" />
              </th>
              {columns.map((column) => (
                <th
                  className="border-b border-[var(--divider)] px-3 py-3 text-xs font-bold uppercase text-[var(--text-muted)]"
                  key={column.field}
                  style={column.width ? { width: column.width } : undefined}
                >
                  {column.label}
                </th>
              ))}
              {rowActions.length > 0 ? (
                <th className="border-b border-[var(--divider)] px-3 py-3 text-right text-xs font-bold uppercase text-[var(--text-muted)]">
                  {labels.actionsColumn}
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((record) => {
              const rowId = getRowId(record);

              return (
                <tr className="hover:bg-[var(--surface-hover)]" key={rowId}>
                  <td className="border-b border-[var(--divider)] px-3 py-3">
                    <input aria-label={`${labels.selectRow} ${rowId}`} type="checkbox" />
                  </td>
                  {columns.map((column) => (
                    <td className="border-b border-[var(--divider)] px-3 py-3 text-sm text-[var(--text)]" key={column.field}>
                      {renderCellValue(getCellValue(record, column.field), column.type, labels.emptyCell)}
                    </td>
                  ))}
                  {rowActions.length > 0 ? (
                    <td className="border-b border-[var(--divider)] px-3 py-3 text-right">
                      <div className="inline-flex items-center gap-2">{rowActions}</div>
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 p-3 md:hidden">
        {rows.map((record) => {
          const rowId = getRowId(record);

          return (
            <article className="rounded-[var(--r-input)] border border-[var(--border)] bg-[var(--surface-2)] p-3" key={rowId}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <input aria-label={`${labels.selectRow} ${rowId}`} type="checkbox" />
                {rowActions.length > 0 ? <div className="inline-flex items-center gap-2">{rowActions}</div> : null}
              </div>
              <dl className="m-0 grid gap-2">
                {columns.map((column) => (
                  <div className="grid gap-1" key={column.field}>
                    <dt className="text-xs font-bold uppercase text-[var(--text-muted)]">{column.label}</dt>
                    <dd className="m-0 text-sm text-[var(--text)]">
                      {renderCellValue(getCellValue(record, column.field), column.type, labels.emptyCell)}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          );
        })}
      </div>
      <footer className="flex min-h-12 items-center justify-between gap-3 border-t border-[var(--divider)] px-3 py-2 text-sm text-[var(--text-muted)]">
        <span>{isFetching ? labels.loadingLabel : labels.pageSummary}</span>
        <div className="flex items-center gap-2">
          <button
            className="h-8 rounded-[var(--r-input)] border border-[var(--border-strong)] px-3 font-semibold disabled:opacity-50"
            disabled={currentPage <= 1}
            type="button"
          >
            {labels.previousPage}
          </button>
          <button
            className="h-8 rounded-[var(--r-input)] border border-[var(--border-strong)] px-3 font-semibold disabled:opacity-50"
            disabled={currentPage * pageSize >= totalCount}
            type="button"
          >
            {labels.nextPage}
          </button>
        </div>
      </footer>
    </section>
  );
}
