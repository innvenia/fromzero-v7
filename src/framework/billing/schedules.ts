export const billingPgCronSchedules = [
  {
    name: "fromzero-expire-api-keys",
    cron: "*/15 * * * *",
    functionName: "app_private.expire_api_keys"
  },
  {
    name: "fromzero-send-trial-reminders",
    cron: "0 9 * * *",
    functionName: "app_private.enqueue_trial_reminders"
  },
  {
    name: "fromzero-expire-trials",
    cron: "15 0 * * *",
    functionName: "app_private.expire_trial_subscriptions"
  }
] as const;

export type BillingPgCronSchedule = (typeof billingPgCronSchedules)[number];
