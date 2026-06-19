import { z } from "zod";

import { tenantStatusValues } from "../../db";

export const tenantSettingsSchema = z.object({
  mfa_policy: z.enum(["optional", "required"]).optional(),
  allowed_ips: z.array(z.string()).optional(),
  session_timeout_override: z.number().int().positive().optional(),
  locale: z.enum(["es", "en"]).optional(),
  timezone: z.string().min(1).optional(),
  currency: z.string().length(3).optional(),
  date_format: z.string().min(1).optional(),
  time_format: z.enum(["12h", "24h"]).optional(),
  tenant_branding: z.object({
    logo_url: z.string().url().optional(),
    primary_color: z.string().optional()
  }).optional(),
  soft_delete: z.object({
    auto_purge_days: z.number().int().positive()
  }).optional()
}).catchall(z.unknown());

export const tenantRecordSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(200),
  legal_name: z.string().max(200).nullable(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(tenantStatusValues),
  primary_email: z.string().email().nullable(),
  billing_email: z.string().email().nullable(),
  phone: z.string().max(30).nullable(),
  country: z.string().length(2).nullable(),
  social_links: z.record(z.string(), z.unknown()),
  settings: tenantSettingsSchema,
  home_url: z.string().max(200).nullable(),
  purge_log: z.record(z.string(), z.unknown()).nullable()
});

export type TenantSettings = z.infer<typeof tenantSettingsSchema>;
export type TenantRecord = z.infer<typeof tenantRecordSchema>;
