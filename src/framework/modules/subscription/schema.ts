import { z } from "zod";

export const subscriptionEntityTypeSchema = z.enum(["tenant", "user"]);
export const subscriptionStatusSchema = z.enum([
  "trialing",
  "active",
  "past_due",
  "expired",
  "canceled",
  "suspended"
]);
export const subscriptionBillingCycleSchema = z.enum(["monthly", "yearly"]);

export const subscriptionRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  entity_type: subscriptionEntityTypeSchema,
  entity_id: z.string().uuid(),
  plan_id: z.string().uuid(),
  status: subscriptionStatusSchema,
  billing_cycle: subscriptionBillingCycleSchema,
  external_subscription_id: z.string().min(1).max(200).nullable(),
  payment_method_id: z.string().min(1).max(200).nullable(),
  starts_at: z.string().datetime(),
  current_period_start: z.string().datetime(),
  current_period_end: z.string().datetime(),
  trial_ends_at: z.string().datetime().nullable(),
  canceled_at: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown())
}).superRefine((subscription, context) => {
  if (subscription.entity_type === "tenant" && subscription.entity_id !== subscription.tenant_id) {
    context.addIssue({
      code: "custom",
      message: "Tenant subscriptions must use the tenant id as entity_id."
    });
  }

  if (subscription.status === "trialing" && !subscription.trial_ends_at) {
    context.addIssue({
      code: "custom",
      message: "Trialing subscriptions require trial_ends_at."
    });
  }
});

export type SubscriptionEntityType = z.infer<typeof subscriptionEntityTypeSchema>;
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;
export type SubscriptionBillingCycle = z.infer<typeof subscriptionBillingCycleSchema>;
export type SubscriptionRecord = z.infer<typeof subscriptionRecordSchema>;
