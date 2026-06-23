import { z } from "zod";

function invoiceBillingEventSchema(eventType: "invoice.processed" | "invoice.payment_failed") {
  return z.object({
    provider: z.string().min(1),
    eventId: z.string().min(1),
    eventType: z.literal(eventType),
    externalInvoiceId: z.string().min(1),
    externalSubscriptionId: z.string().min(1).nullable(),
    amount: z.number().nonnegative(),
    currency: z.string().length(3)
  });
}

export const normalizedBillingEventSchema = z.discriminatedUnion("eventType", [
  invoiceBillingEventSchema("invoice.processed"),
  invoiceBillingEventSchema("invoice.payment_failed"),
  z.object({
    provider: z.string().min(1),
    eventId: z.string().min(1),
    eventType: z.literal("subscription.updated"),
    externalSubscriptionId: z.string().min(1),
    status: z.enum(["trialing", "active", "past_due", "expired", "canceled", "suspended"])
  })
]);

export type NormalizedBillingEvent = z.infer<typeof normalizedBillingEventSchema>;

export type BillingCheckoutSession = {
  checkoutUrl: string;
  externalSessionId: string;
};

export type BillingProviderAdapter = {
  provider: string;
  createCheckoutSession(input: {
    tenantId: string;
    planCode: string;
    successUrl: string;
    cancelUrl: string;
  }): Promise<BillingCheckoutSession>;
  normalizeWebhookEvent(event: unknown): NormalizedBillingEvent;
};

export function createMockBillingProviderAdapter(provider = "mock"): BillingProviderAdapter {
  return {
    provider,
    async createCheckoutSession(input) {
      return {
        checkoutUrl: input.successUrl,
        externalSessionId: `${provider}_${input.tenantId}_${input.planCode}`
      };
    },
    normalizeWebhookEvent(event) {
      return normalizedBillingEventSchema.parse(event);
    }
  };
}
