import { z } from "zod";

import { mfaMethodSchema } from "../../auth/schema";

export const userStatusValues = [
  "active",
  "inactive",
  "pending_verification",
  "marked_for_deletion"
] as const;

export const userMembershipStatusValues = ["active", "suspended", "pending"] as const;

export const userRecordSchema = z.object({
  id: z.uuid(),
  auth_id: z.uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  avatar_url: z.url().nullable(),
  status: z.enum(userStatusValues),
  locale: z.enum(["es", "en"]).nullable(),
  timezone: z.string().max(50).nullable(),
  time_format: z.enum(["12h", "24h"]).nullable(),
  mfa_method: mfaMethodSchema.nullable(),
  last_login_at: z.iso.datetime().nullable(),
  marked_for_deletion_at: z.iso.datetime().nullable()
});

export const userMembershipRecordSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  tenant_id: z.uuid(),
  profile_id: z.uuid(),
  status: z.enum(userMembershipStatusValues),
  invited_by: z.uuid().nullable(),
  joined_at: z.iso.datetime().nullable(),
  created_at: z.iso.datetime()
});

export const userPreferenceRecordSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  tenant_id: z.uuid(),
  key: z.string().min(1).max(100),
  value: z.record(z.string(), z.unknown())
});

export type UserRecord = z.infer<typeof userRecordSchema>;
export type UserMembershipRecord = z.infer<typeof userMembershipRecordSchema>;
export type UserPreferenceRecord = z.infer<typeof userPreferenceRecordSchema>;
