import { z } from "zod";

import {
  createMockBillingProviderAdapter,
  normalizedBillingEventSchema,
  type BillingProviderAdapter,
  type NormalizedBillingEvent
} from "../../billing";

const stripeInvoiceEventSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["invoice.paid", "invoice.payment_failed"]),
  data: z.object({
    object: z.object({
      id: z.string().min(1),
      subscription: z.string().min(1).nullable().optional(),
      amount_paid: z.number().int().nonnegative().optional(),
      amount_due: z.number().int().nonnegative().optional(),
      currency: z.string().min(3).max(3)
    }).passthrough()
  })
});

const stripeSubscriptionEventSchema = z.object({
  id: z.string().min(1),
  type: z.literal("customer.subscription.updated"),
  data: z.object({
    object: z.object({
      id: z.string().min(1),
      status: z.enum(["trialing", "active", "past_due", "canceled", "unpaid", "paused"])
    }).passthrough()
  })
});

function normalizeStripeSubscriptionStatus(status: string) {
  if (status === "unpaid") {
    return "past_due";
  }

  if (status === "paused") {
    return "suspended";
  }

  return status;
}

export function normalizeStripeBillingEvent(event: unknown): NormalizedBillingEvent {
  const invoiceParseResult = stripeInvoiceEventSchema.safeParse(event);

  if (invoiceParseResult.success) {
    const stripeEvent = invoiceParseResult.data;
    const invoice = stripeEvent.data.object;
    const amountMinor = stripeEvent.type === "invoice.paid"
      ? invoice.amount_paid ?? 0
      : invoice.amount_due ?? 0;

    return normalizedBillingEventSchema.parse({
      provider: "stripe",
      eventId: stripeEvent.id,
      eventType: stripeEvent.type === "invoice.paid" ? "invoice.processed" : "invoice.payment_failed",
      externalInvoiceId: invoice.id,
      externalSubscriptionId: invoice.subscription ?? null,
      amount: amountMinor / 100,
      currency: invoice.currency.toUpperCase()
    });
  }

  const subscriptionParseResult = stripeSubscriptionEventSchema.safeParse(event);

  if (subscriptionParseResult.success) {
    const stripeEvent = subscriptionParseResult.data;
    const subscription = stripeEvent.data.object;

    return normalizedBillingEventSchema.parse({
      provider: "stripe",
      eventId: stripeEvent.id,
      eventType: "subscription.updated",
      externalSubscriptionId: subscription.id,
      status: normalizeStripeSubscriptionStatus(subscription.status)
    });
  }

  throw new Error("Unsupported Stripe billing event.");
}

export function createMockStripeBillingAdapter(): BillingProviderAdapter {
  const adapter = createMockBillingProviderAdapter("stripe");

  return {
    ...adapter,
    normalizeWebhookEvent: normalizeStripeBillingEvent
  };
}
