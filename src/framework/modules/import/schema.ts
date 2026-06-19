import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";
import { createFrameworkEvent } from "../../events";

export const importFileFormatSchema = z.enum(["csv", "xlsx"]);
export const importStatusSchema = z.enum([
  "pending",
  "processing",
  "completed",
  "failed",
  "cancelled"
]);

export const importColumnMappingSchema = z.record(
  z.string().min(1).max(200),
  z.string().regex(/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)?$/)
);

export const importErrorSchema = z.object({
  row: z.number().int().positive(),
  field: z.string().min(1).max(200),
  error: z.string().min(1).max(500)
});

export const importRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  module_code: moduleCodeSchema,
  file_name: z.string().min(1).max(300),
  file_url: z.string().min(1).max(1000),
  file_format: importFileFormatSchema,
  column_mapping: importColumnMappingSchema,
  total_rows: z.number().int().nonnegative().nullable(),
  processed_rows: z.number().int().nonnegative(),
  success_count: z.number().int().nonnegative(),
  error_count: z.number().int().nonnegative(),
  errors: z.array(importErrorSchema),
  status: importStatusSchema,
  started_at: z.string().datetime().nullable(),
  completed_at: z.string().datetime().nullable()
}).superRefine((record, context) => {
  if (record.total_rows !== null && record.processed_rows > record.total_rows) {
    context.addIssue({
      code: "custom",
      message: "Processed rows cannot exceed total rows."
    });
  }

  if (record.status === "completed" && record.completed_at === null) {
    context.addIssue({
      code: "custom",
      message: "Completed imports require completed_at."
    });
  }
});

export type ImportFileFormat = z.infer<typeof importFileFormatSchema>;
export type ImportStatus = z.infer<typeof importStatusSchema>;
export type ImportRecord = z.infer<typeof importRecordSchema>;

export function resolveImportFileFormat(input: {
  fileName: string;
  mimeType: string;
}): ImportFileFormat {
  const fileName = input.fileName.toLowerCase();
  const mimeType = input.mimeType.toLowerCase();

  if (fileName.endsWith(".json") || mimeType === "application/json") {
    throw new Error("JSON import is not allowed.");
  }

  if (fileName.endsWith(".csv") || mimeType === "text/csv") {
    return "csv";
  }

  if (
    fileName.endsWith(".xlsx")
    || mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    || mimeType === "application/vnd.ms-excel"
  ) {
    return "xlsx";
  }

  throw new Error("Only CSV and XLSX imports are allowed.");
}

export function resolveImportProcessingMode(totalRows: number, asyncThresholdRows = 1000): "sync" | "inngest" {
  return totalRows > asyncThresholdRows ? "inngest" : "sync";
}

export function buildImportPreview(input: {
  rows: readonly Record<string, unknown>[];
  columnMapping: Record<string, string>;
  requiredFields: readonly string[];
  previewLimit?: number;
}) {
  const columnMapping = importColumnMappingSchema.parse(input.columnMapping);
  const previewRows = input.rows.slice(0, input.previewLimit ?? 10).map((row, index) => {
    const mapped = Object.fromEntries(Object.entries(columnMapping).map(([sourceColumn, targetField]) => [
      targetField,
      row[sourceColumn]
    ]));
    const errors = input.requiredFields
      .filter((field) => mapped[field] === null || mapped[field] === undefined || mapped[field] === "")
      .map((field) => ({ row: index + 1, field, error: "required" }));

    return {
      rowNumber: index + 1,
      values: mapped,
      errors
    };
  });

  return {
    rows: previewRows,
    validRowCount: previewRows.filter((row) => row.errors.length === 0).length,
    errorCount: previewRows.reduce((total, row) => total + row.errors.length, 0)
  };
}

export function buildImportConfirmedEvent(input: {
  importRecord: ImportRecord;
  actorId: string;
  occurredAt: string;
}) {
  const importRecord = importRecordSchema.parse(input.importRecord);

  return createFrameworkEvent({
    name: "import.confirmed",
    tenant_id: importRecord.tenant_id,
    actor_id: input.actorId,
    module_code: "import",
    entity_type: "import",
    entity_id: importRecord.id,
    source: "import",
    occurred_at: input.occurredAt,
    payload: {
      importId: importRecord.id,
      moduleCode: importRecord.module_code,
      fileFormat: importRecord.file_format,
      totalRows: importRecord.total_rows
    }
  });
}
