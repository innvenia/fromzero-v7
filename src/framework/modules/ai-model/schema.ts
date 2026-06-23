import { z } from "zod";

export const aiProviderSchema = z.enum([
  "openrouter",
  "openai",
  "anthropic",
  "google",
  "azure",
  "ollama",
  "custom"
]);

export const aiPricingUnitSchema = z.enum(["per_1k", "per_1m"]);
export const aiInputModalitySchema = z.enum(["text", "image", "audio", "video"]);
export const aiBudgetScopeSchema = z.enum(["global", "tenant", "provider", "model", "user", "feature"]);
export const aiBudgetPeriodSchema = z.enum(["day", "month", "total"]);
export const aiBudgetExceedActionSchema = z.enum(["block", "warn"]);

export const aiModelRecordSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(100),
  provider: aiProviderSchema,
  model_id: z.string().min(1).max(160),
  endpoint_url: z.url().nullable(),
  default_parameters: z.record(z.string(), z.unknown()).default({}),
  pricing_unit: aiPricingUnitSchema,
  currency: z.string().length(3),
  cost_input: z.number().nonnegative(),
  cost_output: z.number().nonnegative(),
  context_window: z.number().int().positive(),
  max_input_tokens: z.number().int().positive().nullable(),
  max_tokens: z.number().int().positive().nullable(),
  max_cost_per_request: z.number().nonnegative().nullable(),
  request_timeout_seconds: z.number().int().positive().nullable(),
  supports_streaming: z.boolean(),
  input_modalities: z.array(aiInputModalitySchema).min(1),
  deprecated_at: z.iso.datetime().nullable(),
  fallback_model_id: z.uuid().nullable(),
  is_active: z.boolean()
}).superRefine((model, context) => {
  if (model.max_input_tokens !== null && model.max_input_tokens > model.context_window) {
    context.addIssue({
      code: "custom",
      message: "AI max_input_tokens cannot exceed context_window."
    });
  }

  if (model.max_tokens !== null && model.max_tokens > model.context_window) {
    context.addIssue({
      code: "custom",
      message: "AI max_tokens cannot exceed context_window."
    });
  }
});

export const aiBudgetRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid().nullable(),
  user_id: z.uuid().nullable(),
  feature_key: z.string().min(1).max(120).nullable(),
  scope: aiBudgetScopeSchema,
  provider: aiProviderSchema.nullable(),
  ai_model_id: z.uuid().nullable(),
  period: aiBudgetPeriodSchema,
  max_spend: z.number().nonnegative(),
  spend_to_date: z.number().nonnegative(),
  currency: z.string().length(3),
  on_exceed: aiBudgetExceedActionSchema,
  is_active: z.boolean()
}).superRefine((budget, context) => {
  if (budget.scope === "tenant" && budget.tenant_id === null) {
    context.addIssue({ code: "custom", message: "Tenant AI budgets require tenant_id." });
  }

  if (budget.scope === "user" && budget.user_id === null) {
    context.addIssue({ code: "custom", message: "User AI budgets require user_id." });
  }

  if (budget.scope === "feature" && budget.feature_key === null) {
    context.addIssue({ code: "custom", message: "Feature AI budgets require feature_key." });
  }

  if (budget.scope === "provider" && budget.provider === null) {
    context.addIssue({ code: "custom", message: "Provider AI budgets require provider." });
  }

  if (budget.scope === "model" && budget.ai_model_id === null) {
    context.addIssue({ code: "custom", message: "Model AI budgets require ai_model_id." });
  }
});

export type AiProvider = z.infer<typeof aiProviderSchema>;
export type AiPricingUnit = z.infer<typeof aiPricingUnitSchema>;
export type AiInputModality = z.infer<typeof aiInputModalitySchema>;
export type AiBudgetScope = z.infer<typeof aiBudgetScopeSchema>;
export type AiBudgetPeriod = z.infer<typeof aiBudgetPeriodSchema>;
export type AiBudgetExceedAction = z.infer<typeof aiBudgetExceedActionSchema>;
export type AiModelRecord = z.infer<typeof aiModelRecordSchema>;
export type AiBudgetRecord = z.infer<typeof aiBudgetRecordSchema>;
