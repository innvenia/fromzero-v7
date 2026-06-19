import { z } from "zod";

export const settingsConfigSchema = z.object({
  general: z.object({
    app_mode: z.enum(["saas", "corporate"]),
    app_name: z.string().min(1),
    app_url: z.string().url(),
    allow_multi_tenant_users: z.literal(false),
    maintenance_mode: z.boolean(),
    event_bus_enabled: z.boolean()
  }),
  security: z.object({
    session_timeout_minutes: z.number().int().positive(),
    absolute_timeout_minutes: z.number().int().positive(),
    max_login_attempts: z.number().int().positive(),
    mfa_policy: z.enum(["disabled", "optional", "required"]),
    invitation_ttl_days: z.number().int().positive(),
    enable_rate_limit: z.boolean(),
    rate_limit_global: z.number().int().positive(),
    rate_limit_tenant: z.number().int().positive(),
    rate_limit_per_endpoint: z.record(z.string(), z.number().int().positive())
  }),
  branding: z.record(z.string(), z.unknown()),
  notifications: z.object({
    default_channel: z.enum(["in_app", "email", "push"]),
    auto_dismiss_seconds: z.number().int().nonnegative()
  }),
  storage: z.object({
    image_optimization_webp: z.boolean()
  }),
  ai: z.object({
    ai_enabled: z.boolean(),
    ai_default_model_id: z.string().uuid().nullable()
  }),
  billing: z.object({
    billing_enabled: z.boolean(),
    licensing_model: z.enum(["per_tenant", "per_user"]),
    subscription: z.object({
      default_plan_code: z.string().min(1),
      expiry_action: z.enum(["degrade_to_free", "suspend_tenant", "read_only_mode"])
    })
  }),
  i18n: z.object({
    default_locale: z.enum(["es", "en"]),
    supported_locales: z.array(z.enum(["es", "en"])).min(1)
  }),
  ui_defaults: z.object({
    default_page_size: z.number().int().positive(),
    default_search_result_limit: z.number().int().min(1).max(20),
    breadcrumbs_enabled: z.boolean()
  }),
  legal: z.record(z.string(), z.unknown()),
  cleanup: z.object({
    soft_delete: z.object({
      auto_purge_days: z.number().int().positive()
    })
  }),
  integrations: z.object({
    redis_enabled: z.literal(false),
    inngest_enabled: z.boolean()
  })
});

export const settingsRecordSchema = z.object({
  id: z.string().uuid(),
  config: settingsConfigSchema,
  updated_by: z.string().uuid().nullable(),
  updated_at: z.string().datetime()
});

export type SettingsConfig = z.infer<typeof settingsConfigSchema>;
export type SettingsRecord = z.infer<typeof settingsRecordSchema>;
