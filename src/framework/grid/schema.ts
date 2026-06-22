import { z } from "zod";

import { moduleActionSchema, moduleCodeSchema } from "../auth/schema";
import { gridColumnSchema } from "../modules/module/schema";

export const gridRowActionValues = ["view", "edit", "delete", "duplicate"] as const;

export const gridRowActionSchema = z.enum(gridRowActionValues);

export const gridRowActionPermissionMap = {
  delete: "delete",
  duplicate: "create",
  edit: "update",
  view: "view"
} as const;

export const gridSortSchema = z.object({
  field: z.string().min(1).max(100),
  direction: z.enum(["asc", "desc"])
});

export const gridUserPreferenceSchema = z.object({
  columns: z.array(z.string().min(1).max(100)).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  sort: gridSortSchema.optional()
});

export const gridModuleConfigSchema = z.object({
  code: moduleCodeSchema,
  display_field: z.string().max(100).nullable(),
  display_subtitle_field: z.string().max(100).nullable(),
  grid_columns: z.array(gridColumnSchema),
  grid_default_page_size: z.number().int().min(1).max(100).nullable(),
  grid_default_sort: gridSortSchema.nullable(),
  grid_row_actions: z.array(gridRowActionSchema)
});

export const gridCustomFieldColumnSchema = z.object({
  field_name: z.string().check(z.regex(/^[a-z][a-z0-9_]*$/)),
  field_type: z.enum(["text", "textarea", "number", "boolean", "date", "select", "multi-select", "email", "url"]),
  labels: z.record(z.string(), z.string().min(1)),
  is_filterable: z.boolean()
});

export type GridRowAction = z.infer<typeof gridRowActionSchema>;
export type GridSort = z.infer<typeof gridSortSchema>;
export type GridUserPreference = z.infer<typeof gridUserPreferenceSchema>;
export type GridModuleConfig = z.infer<typeof gridModuleConfigSchema>;
export type GridCustomFieldColumn = z.infer<typeof gridCustomFieldColumnSchema>;
export type ResolvedGridColumn = z.infer<typeof gridColumnSchema>;

export type ResolveGridConfigurationInput = {
  allowedActions: readonly z.infer<typeof moduleActionSchema>[];
  customFields?: readonly GridCustomFieldColumn[];
  module: GridModuleConfig;
  userPreference?: GridUserPreference;
};

export type ResolvedGridConfiguration = {
  columns: ResolvedGridColumn[];
  pageSize: number;
  rowActions: GridRowAction[];
  sort: GridSort | null;
};
