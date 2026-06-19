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
  id: z.string().uuid(),
  auth_id: z.string().uuid(),
  first_name: z.string().min(1).max(100),
  last_name: z.string().min(1).max(100),
  avatar_url: z.string().url().nullable(),
  status: z.enum(userStatusValues),
  locale: z.enum(["es", "en"]).nullable(),
  timezone: z.string().max(50).nullable(),
  time_format: z.enum(["12h", "24h"]).nullable(),
  mfa_method: mfaMethodSchema.nullable(),
  last_login_at: z.string().datetime().nullable(),
  marked_for_deletion_at: z.string().datetime().nullable()
});

export const userMembershipRecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  status: z.enum(userMembershipStatusValues),
  invited_by: z.string().uuid().nullable(),
  joined_at: z.string().datetime().nullable(),
  created_at: z.string().datetime()
});

export const userPreferenceRecordSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  key: z.string().min(1).max(100),
  value: z.record(z.string(), z.unknown())
});

export type UserRecord = z.infer<typeof userRecordSchema>;
export type UserMembershipRecord = z.infer<typeof userMembershipRecordSchema>;
export type UserPreferenceRecord = z.infer<typeof userPreferenceRecordSchema>;
