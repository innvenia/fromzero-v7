import {
  statementRecordSchema,
  type StatementRecord
} from "../modules/statement";
import type { SubscriptionRecord } from "../modules/subscription";

type BillingPlanSnapshot = {
  id: string;
  code: string;
  name: string;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
};

type BuildStatementInput = {
  tenantId: string;
  periodStart: string;
  periodEnd: string;
  subscriptions: readonly SubscriptionRecord[];
  plans: readonly BillingPlanSnapshot[];
  generatedAt: string;
  id?: string;
};

const generatedStatementId = "00000000-0000-4000-8000-000000000006";

function resolvePlan(subscription: SubscriptionRecord, plans: readonly BillingPlanSnapshot[]) {
  const plan = plans.find((candidate) => candidate.id === subscription.plan_id);

  if (!plan) {
    throw new Error(`Plan not found for subscription ${subscription.id}.`);
  }

  return plan;
}

function resolvePlanAmount(subscription: SubscriptionRecord, plan: BillingPlanSnapshot) {
  if (subscription.billing_cycle === "yearly") {
    return plan.price_yearly ?? 0;
  }

  return plan.price_monthly ?? 0;
}

export function buildStatementFromSubscriptions(input: BuildStatementInput): StatementRecord {
  const lineItems = input.subscriptions.map((subscription) => {
    const plan = resolvePlan(subscription, input.plans);
    const amount = resolvePlanAmount(subscription, plan);

    return {
      subscription_id: subscription.id,
      plan_id: plan.id,
      plan_code: plan.code,
      description: `${plan.name} subscription`,
      quantity: 1,
      unit_amount: amount,
      amount,
      currency: plan.currency.toUpperCase()
    };
  });

  const currencies = new Set(lineItems.map((lineItem) => lineItem.currency));

  if (currencies.size > 1) {
    throw new Error("Statement cannot mix currencies.");
  }

  return statementRecordSchema.parse({
    id: input.id ?? generatedStatementId,
    tenant_id: input.tenantId,
    period_start: input.periodStart,
    period_end: input.periodEnd,
    total_amount: Number(lineItems.reduce((total, lineItem) => total + lineItem.amount, 0).toFixed(2)),
    currency: lineItems[0]?.currency ?? "USD",
    line_items: lineItems,
    status: "draft",
    payment_method_id: null,
    generated_at: input.generatedAt,
    metadata: {
      source: "billing_cycle"
    }
  });
}
