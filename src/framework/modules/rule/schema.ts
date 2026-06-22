import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";
import { frameworkEventSchema, type FrameworkEvent } from "../../events";

export const ruleConditionOperatorSchema = z.enum([
  "eq",
  "neq",
  "gt",
  "gte",
  "lt",
  "lte",
  "in",
  "not_in",
  "contains",
  "starts_with",
  "is_null"
]);

export const ruleGroupOperatorSchema = z.enum(["AND", "OR"]);
export const ruleActionTypeSchema = z.enum([
  "send_notification",
  "update_field",
  "call_webhook",
  "send_email"
]);

export const ruleConditionLeafSchema = z.object({
  field: z.string().check(z.regex(/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)?$/)),
  operator: ruleConditionOperatorSchema,
  value: z.unknown().optional()
}).superRefine((condition, context) => {
  if (condition.operator !== "is_null" && !Object.hasOwn(condition, "value")) {
    context.addIssue({
      code: "custom",
      message: "Rule condition value is required for this operator."
    });
  }

  if ((condition.operator === "in" || condition.operator === "not_in") && !Array.isArray(condition.value)) {
    context.addIssue({
      code: "custom",
      message: "Rule condition value must be an array for membership operators."
    });
  }
});

export type RuleConditionLeaf = z.infer<typeof ruleConditionLeafSchema>;
export type RuleConditionGroup = {
  operator: z.infer<typeof ruleGroupOperatorSchema>;
  conditions: RuleCondition[];
};
export type RuleCondition = RuleConditionLeaf | RuleConditionGroup;

export const ruleConditionSchema: z.ZodType<RuleCondition> = z.lazy(() =>
  z.union([
    ruleConditionLeafSchema,
    z.object({
      operator: ruleGroupOperatorSchema,
      conditions: z.array(ruleConditionSchema).min(1).max(20)
    })
  ])
);

const notificationActionConfigSchema = z.object({
  recipient_user_id: z.uuid().nullable(),
  recipient_profile_id: z.uuid().nullable(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
  channels: z.array(z.enum(["in_app", "email", "sms", "whatsapp"])).min(1)
});

const emailActionConfigSchema = z.object({
  template_code: z.string().check(z.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
  to_email: z.email().nullable(),
  to_field: z.string().check(z.regex(/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)?$/)).nullable(),
  variables: z.record(z.string(), z.unknown())
}).refine((config) => Boolean(config.to_email || config.to_field), {
  message: "Email rule actions require to_email or to_field."
});

const updateFieldActionConfigSchema = z.object({
  field: z.string().check(z.regex(/^[a-z][a-z0-9_]*(?:\.[a-z][a-z0-9_]*)?$/)),
  value: z.unknown()
});

const webhookActionConfigSchema = z.object({
  webhook_id: z.uuid().optional(),
  url: z.url().optional(),
  method: z.literal("POST"),
  headers: z.record(z.string(), z.string()).default({})
}).refine((config) => Boolean(config.webhook_id || config.url), {
  message: "Webhook rule actions require webhook_id or url."
});

export const ruleRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  name: z.string().min(1).max(200),
  description: z.string().nullable(),
  is_active: z.boolean(),
  trigger_event: z.string().check(z.regex(/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/)).max(100),
  trigger_module: moduleCodeSchema,
  conditions: ruleConditionSchema,
  action_type: ruleActionTypeSchema,
  action_config: z.record(z.string(), z.unknown()),
  max_retries: z.number().int().min(0).max(10),
  retry_delay_seconds: z.number().int().positive(),
  execution_count: z.number().int().nonnegative(),
  last_executed_at: z.iso.datetime().nullable()
}).superRefine((rule, context) => {
  const schema = {
    send_notification: notificationActionConfigSchema,
    send_email: emailActionConfigSchema,
    update_field: updateFieldActionConfigSchema,
    call_webhook: webhookActionConfigSchema
  }[rule.action_type];

  const parseResult = schema.safeParse(rule.action_config);

  if (!parseResult.success) {
    context.addIssue({
      code: "custom",
      message: "Rule action_config does not match action_type."
    });
  }
});

export const ruleRunRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  rule_id: z.uuid(),
  event_id: z.uuid(),
  status: z.enum(["queued", "matched", "skipped", "succeeded", "failed", "retrying"]),
  idempotency_key: z.string().min(16).max(160),
  attempt_number: z.number().int().positive(),
  error_message: z.string().max(1000).nullable(),
  started_at: z.iso.datetime(),
  completed_at: z.iso.datetime().nullable()
});

export type RuleActionType = z.infer<typeof ruleActionTypeSchema>;
export type RuleRecord = z.infer<typeof ruleRecordSchema>;
export type RuleRunRecord = z.infer<typeof ruleRunRecordSchema>;

function readPayloadField(payload: Record<string, unknown>, field: string): unknown {
  return field.split(".").reduce<unknown>((current, segment) => {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }

    return Object.hasOwn(current, segment)
      ? (current as Record<string, unknown>)[segment]
      : undefined;
  }, payload);
}

function compareValues(left: unknown, right: unknown): number {
  if (typeof left === "number" && typeof right === "number") {
    return left - right;
  }

  if (typeof left === "string" && typeof right === "string") {
    return left.localeCompare(right);
  }

  return Number.NaN;
}

export function evaluateRuleCondition(
  conditionInput: RuleCondition,
  payload: Record<string, unknown>
): boolean {
  const condition = ruleConditionSchema.parse(conditionInput);

  if ("conditions" in condition) {
    const evaluations = condition.conditions.map((childCondition) =>
      evaluateRuleCondition(childCondition, payload)
    );

    return condition.operator === "AND"
      ? evaluations.every(Boolean)
      : evaluations.some(Boolean);
  }

  const actualValue = readPayloadField(payload, condition.field);

  switch (condition.operator) {
    case "eq":
      return actualValue === condition.value;
    case "neq":
      return actualValue !== condition.value;
    case "gt":
      return compareValues(actualValue, condition.value) > 0;
    case "gte":
      return compareValues(actualValue, condition.value) >= 0;
    case "lt":
      return compareValues(actualValue, condition.value) < 0;
    case "lte":
      return compareValues(actualValue, condition.value) <= 0;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(actualValue);
    case "not_in":
      return Array.isArray(condition.value) && !condition.value.includes(actualValue);
    case "contains":
      return Array.isArray(actualValue)
        ? actualValue.includes(condition.value)
        : typeof actualValue === "string" && typeof condition.value === "string" && actualValue.includes(condition.value);
    case "starts_with":
      return typeof actualValue === "string" && typeof condition.value === "string" && actualValue.startsWith(condition.value);
    case "is_null":
      return actualValue === null || actualValue === undefined;
  }
}

export function assertRuleLoopGuard(input: {
  rule: RuleRecord;
  event: FrameworkEvent;
  maxDepth?: number;
}): true {
  const rule = ruleRecordSchema.parse(input.rule);
  const event = frameworkEventSchema.parse(input.event);
  const ruleRunIds = event.payload.__rule_run_ids;
  const depth = typeof event.payload.__rule_depth === "number" ? event.payload.__rule_depth : 0;

  if (Array.isArray(ruleRunIds) && ruleRunIds.includes(rule.id)) {
    throw new Error("Rule loop detected.");
  }

  if (depth >= (input.maxDepth ?? 5)) {
    throw new Error("Rule loop depth exceeded.");
  }

  return true;
}

export function doesRuleMatchEvent(input: {
  rule: RuleRecord;
  event: FrameworkEvent;
  allowedModuleCodes: readonly string[];
}): boolean {
  const rule = ruleRecordSchema.parse(input.rule);
  const event = frameworkEventSchema.parse(input.event);

  if (!rule.is_active) {
    return false;
  }

  if (!input.allowedModuleCodes.includes(rule.trigger_module)) {
    throw new Error("Rule trigger module is not allowlisted.");
  }

  if (rule.tenant_id !== event.tenant_id) {
    return false;
  }

  if (rule.trigger_event !== event.name || rule.trigger_module !== event.module_code) {
    return false;
  }

  assertRuleLoopGuard({ rule, event });
  return evaluateRuleCondition(rule.conditions, event.payload);
}

export function assertRuleLimit(currentRuleCount: number, maxRules: number): true {
  if (currentRuleCount >= maxRules) {
    throw new Error("Rule limit exceeded.");
  }

  return true;
}
