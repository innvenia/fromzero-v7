import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  apiEndpointContractSchema,
  sprintSixApiContracts
} from "../../src/framework/api";
import {
  billingPgCronSchedules,
  buildBillingRecordPdf,
  buildStatementFromSubscriptions,
  resolveExpiredTrialAction,
  validateInvoiceMutation,
  verifyStripeWebhookSignature
} from "../../src/framework/billing";
import {
  invoiceRecordSchema,
  statementRecordSchema,
  subscriptionRecordSchema
} from "../../src/framework/modules";
import { normalizeStripeBillingEvent } from "../../src/framework/integrations/stripe";

const tenantId = "22222222-2222-4222-8222-222222222222";
const userId = "11111111-1111-4111-8111-111111111111";
const subscriptionId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const planId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const freePlanId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const statementId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const invoiceId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";

const now = new Date("2026-06-19T12:00:00.000Z");

const trialPlan = {
  id: planId,
  code: "trial",
  name: "Trial",
  is_freemium: false,
  price_monthly: 0,
  price_yearly: null,
  currency: "USD",
  trial_days: 14,
  features: { modules_allowed: ["*"] }
};

const freePlan = {
  id: freePlanId,
  code: "free",
  name: "Free",
  is_freemium: true,
  price_monthly: 0,
  price_yearly: null,
  currency: "USD",
  trial_days: 0,
  features: { modules_allowed: ["*"] }
};

const proPlan = {
  id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
  code: "pro",
  name: "Pro",
  is_freemium: false,
  price_monthly: 49,
  price_yearly: 490,
  currency: "USD",
  trial_days: 0,
  features: { modules_allowed: ["*"] }
};

const activeSubscription = {
  id: subscriptionId,
  tenant_id: tenantId,
  entity_type: "tenant",
  entity_id: tenantId,
  plan_id: proPlan.id,
  status: "active",
  billing_cycle: "monthly",
  external_subscription_id: "sub_mock_123",
  payment_method_id: "pm_mock",
  starts_at: "2026-06-01T00:00:00.000Z",
  current_period_start: "2026-06-01T00:00:00.000Z",
  current_period_end: "2026-07-01T00:00:00.000Z",
  trial_ends_at: null,
  canceled_at: null,
  metadata: {}
} as const;

const invoice = {
  id: invoiceId,
  tenant_id: tenantId,
  statement_id: statementId,
  invoice_number: "INV-2026-0001",
  external_invoice_id: "in_mock_123",
  amount: 49,
  currency: "USD",
  description: "Pro subscription - June 2026",
  status: "processed",
  paid_at: "2026-06-19T12:00:00.000Z",
  voided_at: null,
  reversed_at: null,
  metadata: {}
} as const;

function buildStripeSignature(payload: string, timestamp: number, secret: string) {
  const signature = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  return `t=${timestamp},v1=${signature}`;
}

describe("Sprint 6 billing contracts", () => {
  it("adds reserved API contracts for billing modules and webhooks", () => {
    const parsedContracts = sprintSixApiContracts.map((contract) =>
      apiEndpointContractSchema.parse(contract)
    );

    expect(parsedContracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ basePath: "/api/v1/billing/subscriptions", ownerSprint: "Sprint 6" }),
        expect.objectContaining({ basePath: "/api/v1/billing/statements", ownerSprint: "Sprint 6" }),
        expect.objectContaining({ basePath: "/api/v1/billing/invoices", ownerSprint: "Sprint 6" }),
        expect.objectContaining({ basePath: "/api/v1/billing/webhooks/stripe", ownerSprint: "Sprint 6" })
      ])
    );
  });

  it("validates subscription, statement and invoice DTOs", () => {
    const subscription = subscriptionRecordSchema.parse(activeSubscription);
    expect(subscription.external_subscription_id).toBe("sub_mock_123");

    const statement = buildStatementFromSubscriptions({
      tenantId,
      periodStart: "2026-06-01T00:00:00.000Z",
      periodEnd: "2026-07-01T00:00:00.000Z",
      subscriptions: [subscription],
      plans: [proPlan],
      generatedAt: now.toISOString()
    });

    expect(statementRecordSchema.parse(statement)).toEqual(
      expect.objectContaining({
        tenant_id: tenantId,
        total_amount: 49,
        currency: "USD",
        status: "draft"
      })
    );

    expect(invoiceRecordSchema.parse(invoice)).toEqual(expect.objectContaining({ amount: 49 }));
  });

  it("preserves invoice content immutability while allowing status changes", () => {
    expect(validateInvoiceMutation(invoice, { ...invoice, status: "voided", voided_at: now.toISOString() }))
      .toEqual(expect.objectContaining({ status: "voided" }));

    expect(() => validateInvoiceMutation(invoice, { ...invoice, amount: 50 }))
      .toThrow("Invoice content is immutable");
  });

  it("degrades expired trials to Free when a freemium plan exists", () => {
    const expiredTrial = subscriptionRecordSchema.parse({
      ...activeSubscription,
      plan_id: trialPlan.id,
      status: "trialing",
      external_subscription_id: null,
      payment_method_id: null,
      trial_ends_at: "2026-06-18T00:00:00.000Z"
    });

    expect(
      resolveExpiredTrialAction({
        subscription: expiredTrial,
        plans: [trialPlan, freePlan],
        settings: {
          expiryAction: "suspend_tenant",
          gracePeriodDays: 15
        },
        now
      })
    ).toEqual({
      action: "degrade_to_free",
      targetPlanId: freePlanId,
      targetPlanCode: "free",
      subscriptionStatus: "active"
    });
  });

  it("verifies signed Stripe webhook payloads and normalizes invoice events", () => {
    const payload = JSON.stringify({
      id: "evt_mock_123",
      type: "invoice.paid",
      data: {
        object: {
          id: "in_mock_123",
          subscription: "sub_mock_123",
          amount_paid: 4900,
          currency: "usd"
        }
      }
    });
    const timestamp = Math.floor(now.getTime() / 1000);
    const secret = "stripe_webhook_test_secret";
    const signatureHeader = buildStripeSignature(payload, timestamp, secret);

    expect(
      verifyStripeWebhookSignature({
        payload,
        signatureHeader,
        secret,
        now,
        toleranceSeconds: 300
      })
    ).toBe(true);

    expect(
      verifyStripeWebhookSignature({
        payload,
        signatureHeader: signatureHeader.replace(/.$/, (lastCharacter) => lastCharacter === "0" ? "1" : "0"),
        secret,
        now,
        toleranceSeconds: 300
      })
    ).toBe(false);

    expect(normalizeStripeBillingEvent(JSON.parse(payload))).toEqual({
      provider: "stripe",
      eventId: "evt_mock_123",
      eventType: "invoice.processed",
      externalInvoiceId: "in_mock_123",
      externalSubscriptionId: "sub_mock_123",
      amount: 49,
      currency: "USD"
    });
  });

  it("declares pg_cron schedules for token expiry and trial lifecycle", () => {
    expect(billingPgCronSchedules).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "fromzero-expire-api-keys" }),
        expect.objectContaining({ name: "fromzero-send-trial-reminders" }),
        expect.objectContaining({ name: "fromzero-expire-trials" })
      ])
    );
  });

  it("builds a PDF artifact for an individual invoice record", () => {
    const pdf = buildBillingRecordPdf({
      type: "invoice",
      tenantName: "Acme",
      record: invoice
    });

    const decoded = new TextDecoder().decode(pdf.bytes);

    expect(pdf.fileName).toBe("invoice-inv-2026-0001.pdf");
    expect(pdf.contentType).toBe("application/pdf");
    expect(decoded).toContain("%PDF-1.4");
    expect(decoded).toContain("INV-2026-0001");
    expect(decoded).toContain("Acme");
  });
});
