import { z } from "zod";

export const profileRecordSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  tenant_id: z.string().uuid().nullable(),
  home_url: z.string().max(200).nullable(),
  description: z.string().nullable(),
  is_system: z.boolean()
});

export const profilePermissionRecordSchema = z.object({
  id: z.string().uuid(),
  profile_id: z.string().uuid(),
  module_id: z.string().uuid(),
  can_view: z.boolean(),
  can_create: z.boolean(),
  can_update: z.boolean(),
  can_delete: z.boolean(),
  can_import: z.boolean(),
  can_export: z.boolean(),
  can_notify: z.boolean()
});

export type ProfileRecord = z.infer<typeof profileRecordSchema>;
export type ProfilePermissionRecord = z.infer<typeof profilePermissionRecordSchema>;
