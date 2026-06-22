import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { DataGrid, type DataGridLabels } from "../../src/framework/grid";
import { Card } from "../../src/framework/ui/components";

type ElementProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

function isReactElement(value: ReactNode): value is ReactElement<ElementProps> {
  return Boolean(value && typeof value === "object" && "props" in value);
}

function collectText(value: ReactNode): string[] {
  if (typeof value === "string" || typeof value === "number" || typeof value === "bigint") {
    return [value.toString()];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectText);
  }

  if (isReactElement(value)) {
    return collectText(value.props.children);
  }

  return [];
}

function findElements(
  value: ReactNode,
  predicate: (element: ReactElement<ElementProps>) => boolean
): Array<ReactElement<ElementProps>> {
  if (Array.isArray(value)) {
    return value.flatMap((child) => findElements(child, predicate));
  }

  if (!isReactElement(value)) {
    return [];
  }

  return [
    ...(predicate(value) ? [value] : []),
    ...findElements(value.props.children, predicate)
  ];
}

const labels: DataGridLabels = {
  actionsColumn: "Actions",
  ariaLabel: "Tenant records",
  emptyCell: "No value",
  loadingLabel: "Loading records",
  nextPage: "Next",
  pageSummary: "Page loaded",
  previousPage: "Previous",
  selectAllRows: "Select all rows",
  selectRow: "Select row"
};

describe("UI component contracts", () => {
  it("renders data grid values, actions and loading state", () => {
    const grid = DataGrid({
      columns: [
        { field: "profile.name", label: "Name", width: "12rem" },
        { field: "status", label: "Status", type: "badge" },
        { field: "active", label: "Active", type: "boolean" },
        { field: "missing.path", label: "Missing" }
      ],
      currentPage: 1,
      getRowId: (record) => String(record.id),
      isFetching: true,
      labels,
      pageSize: 10,
      rowActions: ["Edit"],
      rows: [
        {
          id: "tenant-1",
          profile: { name: "Acme" },
          status: "ready",
          active: true
        }
      ],
      totalCount: 1
    });
    const renderedText = collectText(grid);
    const buttons = findElements(grid, (element) => element.type === "button");

    expect(grid.props["aria-busy"]).toBe(true);
    expect(renderedText).toEqual(expect.arrayContaining([
      "Name",
      "Status",
      "Active",
      "Missing",
      "Actions",
      "Acme",
      "ready",
      "true",
      "No value",
      "Edit",
      "Loading records"
    ]));
    expect(buttons.map((button) => button.props.disabled)).toEqual([true, true]);
  });

  it("renders data grid primitive values without row actions", () => {
    const marker = Symbol("priority");
    const grid = DataGrid({
      columns: [
        { field: "count", label: "Count", type: "number" },
        { field: "size", label: "Size" },
        { field: "marker", label: "Marker" },
        { field: "markerEmpty", label: "Marker empty" },
        { field: "empty", label: "Empty" }
      ],
      currentPage: 2,
      getRowId: (record) => String(record.id),
      labels,
      pageSize: 10,
      rows: [
        {
          id: "tenant-2",
          count: 3,
          size: 4n,
          marker,
          markerEmpty: Symbol(),
          empty: ""
        }
      ],
      totalCount: 30
    });
    const renderedText = collectText(grid);
    const buttons = findElements(grid, (element) => element.type === "button");

    expect(grid.props["aria-busy"]).toBe(false);
    expect(renderedText).toEqual(expect.arrayContaining([
      "Count",
      "Size",
      "Marker",
      "Marker empty",
      "3",
      "4",
      "priority",
      "No value",
      "Page loaded"
    ]));
    expect(renderedText).not.toContain("Actions");
    expect(buttons.map((button) => button.props.disabled)).toEqual([false, false]);
  });

  it("merges card class names with base surface styling", () => {
    const card = Card({
      "aria-label": "Billing summary",
      children: "Summary",
      className: "p-4"
    });

    expect(card.props.className).toContain("rounded-[var(--r-card)]");
    expect(card.props.className).toContain("p-4");
    expect(card.props.children).toBe("Summary");
  });
});
