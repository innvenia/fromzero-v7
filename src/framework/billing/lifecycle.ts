import type { SubscriptionRecord, SubscriptionStatus } from "../modules/subscription";

type PlanSnapshot = {
  id: string;
  code: string;
  is_freemium: boolean;
};

type ExpiredTrialSettings = {
  expiryAction: "degrade_to_free" | "suspend_tenant" | "read_only_mode";
  gracePeriodDays: number;
};

type ExpiredTrialInput = {
  subscription: SubscriptionRecord;
  plans: readonly PlanSnapshot[];
  settings: ExpiredTrialSettings;
  now: Date;
};

type ExpiredTrialAction = {
  action: "none" | "degrade_to_free" | "suspend_tenant" | "read_only_mode";
  targetPlanId: string | null;
  targetPlanCode: string | null;
  subscriptionStatus: SubscriptionStatus;
};

function isTrialExpired(subscription: SubscriptionRecord, now: Date) {
  return Boolean(
    subscription.status === "trialing"
    && subscription.trial_ends_at
    && new Date(subscription.trial_ends_at).getTime() <= now.getTime()
  );
}

export function resolveExpiredTrialAction(input: ExpiredTrialInput): ExpiredTrialAction {
  if (!isTrialExpired(input.subscription, input.now)) {
    return {
      action: "none",
      targetPlanId: null,
      targetPlanCode: null,
      subscriptionStatus: input.subscription.status
    };
  }

  const freemiumPlan = input.plans.find((plan) => plan.code === "free" || plan.is_freemium);

  if (freemiumPlan) {
    return {
      action: "degrade_to_free",
      targetPlanId: freemiumPlan.id,
      targetPlanCode: freemiumPlan.code,
      subscriptionStatus: "active"
    };
  }

  if (input.settings.expiryAction === "suspend_tenant") {
    return {
      action: "suspend_tenant",
      targetPlanId: null,
      targetPlanCode: null,
      subscriptionStatus: "suspended"
    };
  }

  if (input.settings.expiryAction === "read_only_mode") {
    return {
      action: "read_only_mode",
      targetPlanId: null,
      targetPlanCode: null,
      subscriptionStatus: "expired"
    };
  }

  return {
    action: "degrade_to_free",
    targetPlanId: null,
    targetPlanCode: null,
    subscriptionStatus: "expired"
  };
}
