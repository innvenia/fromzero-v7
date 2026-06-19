import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";
import { gridSortSchema } from "../../grid/schema";

export const filterOperatorValues = [
  "equals",
  "not_equals",
  "contains",
  "starts_with",
  "ends_with",
  "lt",
  "lte",
  "gt",
  "gte",
  "is_empty",
  "is_not_empty",
  "in"
] as const;

export const filterConditionSchema = z.object({
  field: z.string().regex(/^[a-z][a-z0-9_.]*$/).max(100),
  operator: z.enum(filterOperatorValues),
  value: z.unknown().optional()
});

export const filterRecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  module_code: moduleCodeSchema,
  name: z.string().min(1).max(200),
  conditions: z.array(filterConditionSchema),
  sort_config: gridSortSchema.nullable(),
  visible_columns: z.array(z.string().min(1).max(100)).nullable(),
  is_default: z.boolean(),
  is_shared: z.boolean()
});

export type FilterCondition = z.infer<typeof filterConditionSchema>;
export type FilterRecord = z.infer<typeof filterRecordSchema>;

type FilterAccessContext = {
  tenantId: string;
  userId: string;
};

type FilterGridConfig = {
  code: string;
  grid_columns: readonly {
    field: string;
    filterable: boolean;
    sortable: boolean;
  }[];
};

export function isFilterVisibleToUser(filterInput: FilterRecord, context: FilterAccessContext): boolean {
  const filter = filterRecordSchema.parse(filterInput);

  return filter.tenant_id === context.tenantId && (filter.is_shared || filter.user_id === context.userId);
}

export function validateFilterAgainstGrid(
  filterInput: FilterRecord,
  moduleConfig: FilterGridConfig,
  allowedModuleCodes: readonly string[]
): FilterRecord {
  const filter = filterRecordSchema.parse(filterInput);

  if (!allowedModuleCodes.includes(filter.module_code)) {
    throw new Error("Filter module is not allowlisted.");
  }

  if (filter.module_code !== moduleConfig.code) {
    throw new Error("Filter module does not match the grid module.");
  }

  const columnByField = new Map(moduleConfig.grid_columns.map((column) => [column.field, column]));

  for (const condition of filter.conditions) {
    const column = columnByField.get(condition.field);

    if (!column || !column.filterable) {
      throw new Error("Filter references a non-filterable grid column.");
    }
  }

  if (filter.sort_config) {
    const column = columnByField.get(filter.sort_config.field);

    if (!column || !column.sortable) {
      throw new Error("Filter sort references a non-sortable grid column.");
    }
  }

  for (const visibleColumn of filter.visible_columns ?? []) {
    if (!columnByField.has(visibleColumn)) {
      throw new Error("Filter references a column outside the grid.");
    }
  }

  return filter;
}
