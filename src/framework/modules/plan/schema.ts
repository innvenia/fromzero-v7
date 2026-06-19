import { z } from "zod";

export const planFeaturesSchema = z.object({
  max_users: z.number().int(),
  storage_gb: z.number().int(),
  ai_enabled: z.boolean(),
  modules_allowed: z.array(z.string().min(1)),
  max_api_keys: z.number().int(),
  max_rules: z.number().int(),
  max_custom_fields: z.number().int(),
  webhook_enabled: z.boolean(),
  import_export_enabled: z.boolean()
}).catchall(z.unknown());

export const planRecordSchema = z.object({
  id: z.string().uuid(),
  code: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().min(1).max(100),
  description: z.string().nullable(),
  is_active: z.boolean(),
  is_freemium: z.boolean(),
  sort_order: z.number().int().nullable(),
  price_monthly: z.number().nonnegative().nullable(),
  price_yearly: z.number().nonnegative().nullable(),
  currency: z.string().length(3),
  trial_days: z.number().int().nonnegative(),
  features: planFeaturesSchema
});

export type PlanFeatures = z.infer<typeof planFeaturesSchema>;
export type PlanRecord = z.infer<typeof planRecordSchema>;
