import { z } from "zod";

export const gridColumnSchema = z.object({
  field: z.string().min(1),
  label_key: z.string().min(1),
  type: z.enum(["text", "number", "date", "boolean", "badge", "avatar", "link"]),
  width: z.string().optional(),
  sortable: z.boolean(),
  filterable: z.boolean(),
  visible: z.boolean()
});

export const searchFieldSchema = z.object({
  field: z.string().min(1),
  weight: z.enum(["high", "medium", "low"]).default("medium")
});

export const moduleRecordSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  code: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  icon: z.string().max(50).nullable(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().nullable(),
  enabled: z.boolean(),
  table_name: z.string().max(100).nullable(),
  display_field: z.string().max(100).nullable(),
  display_subtitle_field: z.string().max(100).nullable(),
  grid_columns: z.array(gridColumnSchema),
  grid_default_sort: z.object({
    field: z.string().min(1),
    direction: z.enum(["asc", "desc"])
  }).nullable(),
  grid_default_page_size: z.number().int().positive().nullable(),
  grid_row_actions: z.array(z.enum(["view", "edit", "delete", "duplicate"])),
  searchable: z.boolean(),
  search_fields: z.array(searchFieldSchema),
  search_display_title: z.string().max(100).nullable(),
  search_display_subtitle: z.string().max(100).nullable(),
  search_display_detail_fields: z.array(z.string().max(100)).max(3),
  search_result_limit: z.number().int().min(1).max(20).nullable(),
  sort_order: z.number().int().nullable()
}).superRefine((moduleRecord, context) => {
  if (moduleRecord.searchable && moduleRecord.search_fields.length === 0) {
    context.addIssue({
      code: "custom",
      message: "Searchable modules require at least one search field."
    });
  }
});

export type ModuleRecord = z.infer<typeof moduleRecordSchema>;
