import { z } from "zod";

import { baseProfileCodes } from "../db";

export const bootstrapPlanSchema = z.object({
  code: z.enum(["free", "trial", "pro", "enterprise"]),
  name: z.string().min(1),
  is_freemium: z.boolean().optional(),
  trial_days: z.number().int().nonnegative().optional()
});

export const bootstrapSchema = z.object({
  _metadata: z.object({
    version: z.literal("7.4.0"),
    generated_at: z.string().datetime(),
    prd_reference: z.string().min(1)
  }),
  app: z.object({
    mode: z.enum(["saas", "corporate"]),
    name: z.string().min(1),
    url: z.string().url(),
    allow_multi_tenant_users: z.boolean().default(false),
    licensing_model: z.enum(["per_tenant", "per_user"])
  }),
  infrastructure: z.object({
    ports: z.object({
      frontend: z.number().int().positive(),
      core_ai: z.number().int().positive()
    }),
    features: z.object({
      billing_enabled: z.boolean(),
      ai_enabled: z.boolean(),
      event_bus_enabled: z.boolean(),
      inngest_enabled: z.boolean(),
      redis_enabled: z.literal(false)
    })
  }),
  security: z.object({
    mfa_policy: z.enum(["disabled", "optional", "required"]),
    session_timeout_minutes: z.number().int().positive(),
    absolute_timeout_minutes: z.number().int().positive(),
    max_login_attempts: z.number().int().positive(),
    rate_limit_enabled: z.boolean()
  }),
  initial_data: z.object({
    tenant_zero: z.object({
      name: z.string().min(1),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    }),
    super_admin: z.object({
      first_name: z.string().min(1),
      last_name: z.string().min(1),
      email: z.string().email()
    }),
    profiles: z.array(z.enum(baseProfileCodes)).superRefine((profiles, context) => {
      for (const requiredProfile of baseProfileCodes) {
        if (!profiles.includes(requiredProfile)) {
          context.addIssue({
            code: "custom",
            message: `Missing required profile: ${requiredProfile}`
          });
        }
      }
    }),
    plans: z.array(bootstrapPlanSchema)
  })
});

export type BootstrapConfig = z.infer<typeof bootstrapSchema>;
