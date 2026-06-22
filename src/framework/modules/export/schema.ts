import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";
import { createFrameworkEvent } from "../../events";

export const exportFileFormatSchema = z.enum(["csv", "xlsx"]);
export const exportStatusSchema = z.enum(["pending", "processing", "completed", "failed"]);

export const exportRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  module_code: moduleCodeSchema,
  file_name: z.string().min(1).max(300).nullable(),
  file_url: z.string().min(1).max(1000).nullable(),
  file_format: exportFileFormatSchema,
  filters_applied: z.record(z.string(), z.unknown()),
  total_rows: z.number().int().nonnegative().nullable(),
  status: exportStatusSchema,
  download_expires_at: z.iso.datetime().nullable(),
  started_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable()
}).superRefine((record, context) => {
  if (record.status === "completed" && (!record.file_url || !record.download_expires_at || !record.completed_at)) {
    context.addIssue({
      code: "custom",
      message: "Completed exports require file_url, download_expires_at and completed_at."
    });
  }
});

export type ExportFileFormat = z.infer<typeof exportFileFormatSchema>;
export type ExportStatus = z.infer<typeof exportStatusSchema>;
export type ExportRecord = z.infer<typeof exportRecordSchema>;

export function buildExportFileName(input: {
  moduleCode: string;
  fileFormat: ExportFileFormat;
  createdAt: Date;
}): string {
  const format = exportFileFormatSchema.parse(input.fileFormat);
  const safeModuleCode = moduleCodeSchema.parse(input.moduleCode);
  const stamp = input.createdAt.toISOString().slice(0, 19).replaceAll(/[-:T]/g, "");

  return `${safeModuleCode}-${stamp}.${format}`;
}

export function createExportDownloadIntent(input: {
  exportRecord: ExportRecord;
  requesterTenantId: string;
  expiresInSeconds: number;
  now: Date;
}) {
  const exportRecord = exportRecordSchema.parse(input.exportRecord);

  if (exportRecord.tenant_id !== input.requesterTenantId) {
    throw new Error("Export does not belong to the requester tenant.");
  }

  if (exportRecord.status !== "completed" || !exportRecord.file_url || !exportRecord.download_expires_at) {
    throw new Error("Export is not ready for download.");
  }

  if (new Date(exportRecord.download_expires_at).getTime() <= input.now.getTime()) {
    throw new Error("Export download has expired.");
  }

  if (input.expiresInSeconds < 60 || input.expiresInSeconds > 86400) {
    throw new Error("Export signed URL TTL must be between 60 and 86400 seconds.");
  }

  return {
    bucket: "exports" as const,
    storageKey: exportRecord.file_url,
    expiresInSeconds: input.expiresInSeconds,
    expiresAt: new Date(input.now.getTime() + input.expiresInSeconds * 1000).toISOString()
  };
}

export function buildExportRequestedEvent(input: {
  exportRecord: ExportRecord;
  actorId: string;
  occurredAt: string;
}) {
  const exportRecord = exportRecordSchema.parse(input.exportRecord);

  return createFrameworkEvent({
    name: "export.requested",
    tenant_id: exportRecord.tenant_id,
    actor_id: input.actorId,
    module_code: "export",
    entity_type: "export",
    entity_id: exportRecord.id,
    source: "export",
    occurred_at: input.occurredAt,
    payload: {
      exportId: exportRecord.id,
      moduleCode: exportRecord.module_code,
      fileFormat: exportRecord.file_format,
      filtersApplied: exportRecord.filters_applied
    }
  });
}
