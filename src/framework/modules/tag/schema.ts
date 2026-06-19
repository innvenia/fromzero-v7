import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";

export const tagRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/).nullable(),
  description: z.string().max(500).nullable(),
  deleted_at: z.string().datetime().nullable()
});

export const taggableRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  tag_id: z.string().uuid(),
  entity_type: moduleCodeSchema,
  entity_id: z.string().uuid()
});

export type TagRecord = z.infer<typeof tagRecordSchema>;
export type TaggableRecord = z.infer<typeof taggableRecordSchema>;

export function validateTagAttachment(input: {
  tag: TagRecord;
  target: {
    tenantId: string;
    entityType: string;
    entityId: string;
  };
  allowedModuleCodes: readonly string[];
}): true {
  const tag = tagRecordSchema.parse(input.tag);

  if (tag.deleted_at) {
    throw new Error("Deleted tags cannot be attached.");
  }

  if (tag.tenant_id !== input.target.tenantId) {
    throw new Error("Tag and target must belong to the same tenant.");
  }

  if (!input.allowedModuleCodes.includes(input.target.entityType)) {
    throw new Error("Tag target module is not allowlisted.");
  }

  z.string().uuid().parse(input.target.entityId);

  return true;
}
