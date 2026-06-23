import type {
  AiBudgetRecord,
  AiInputModality,
  AiModelRecord
} from "../modules/ai-model";
import { aiModelRecordSchema } from "../modules/ai-model";

export interface AiRequestGuardInput {
  model: AiModelRecord;
  inputTokens: number;
  requestedOutputTokens: number;
  modality: AiInputModality;
}

export interface AiBudgetEvaluationInput {
  tenantId: string;
  userId: string | null;
  featureKey: string | null;
  model: AiModelRecord;
  estimatedCost: number;
  budgets: readonly AiBudgetRecord[];
}

export interface AiBudgetEvaluationResult {
  allowed: boolean;
  warnings: string[];
  matchedBudgetIds: string[];
}

export interface AiProviderInvokeInput {
  model: AiModelRecord;
  prompt: string;
  inputTokens: number;
  requestedOutputTokens: number;
}

export interface AiProviderInvokeResult {
  provider: string;
  providerRequestId: string | null;
  content: string;
  inputTokens: number;
  outputTokens: number;
}

export interface AiProviderAdapter {
  invoke(input: AiProviderInvokeInput): Promise<AiProviderInvokeResult>;
}

export interface OpenRouterAdapterOptions {
  apiKey: string;
  fetcher?: typeof fetch;
}

const openRouterDefaultEndpoint = "https://openrouter.ai/api/v1/chat/completions";
const emailAllowedLocalChars = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._%+-");
const emailAllowedDomainChars = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.-");
const secretValueChars = new Set("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789._-");
const secretKeyPrefixes = ["sk-", "pk-", "rk-", "or-"] as const;
const secretKeyLabels = new Set(["token", "secret", "password", "apikey"]);
const trailingPunctuation = new Set([",", ".", ";", ":", "!", "?", ")", "]", "}"]);

function roundCost(value: number): number {
  return Number(value.toFixed(12));
}

function everyCharacterAllowed(value: string, allowedCharacters: ReadonlySet<string>): boolean {
  for (const character of value) {
    if (!allowedCharacters.has(character)) {
      return false;
    }
  }

  return true;
}

function splitTrailingPunctuation(value: string): { body: string; suffix: string } {
  let end = value.length;

  while (end > 0 && trailingPunctuation.has(value.at(end - 1) ?? "")) {
    end -= 1;
  }

  return {
    body: value.slice(0, end),
    suffix: value.slice(end)
  };
}

function normalizeSecretLabel(value: string): string {
  return value.toLowerCase().replaceAll("_", "").replaceAll("-", "");
}

function isEmailToken(value: string): boolean {
  const atIndex = value.indexOf("@");

  if (atIndex <= 0 || atIndex !== value.lastIndexOf("@")) {
    return false;
  }

  const localPart = value.slice(0, atIndex);
  const domain = value.slice(atIndex + 1);
  const dotIndex = domain.lastIndexOf(".");
  const topLevelDomain = domain.slice(dotIndex + 1);

  return dotIndex > 0
    && topLevelDomain.length >= 2
    && everyCharacterAllowed(localPart, emailAllowedLocalChars)
    && everyCharacterAllowed(domain, emailAllowedDomainChars)
    && everyCharacterAllowed(topLevelDomain, emailAllowedLocalChars);
}

function isSecretValue(value: string): boolean {
  return value.length >= 8 && everyCharacterAllowed(value, secretValueChars);
}

function isProviderSecretToken(value: string): boolean {
  return secretKeyPrefixes.some((prefix) => value.startsWith(prefix) && isSecretValue(value.slice(prefix.length)));
}

function isInlineSecretAssignment(value: string): boolean {
  const separatorIndexes = [value.indexOf(":"), value.indexOf("=")].filter((index) => index > 0);

  if (separatorIndexes.length === 0) {
    return false;
  }

  const separatorIndex = Math.min(...separatorIndexes);
  const label = normalizeSecretLabel(value.slice(0, separatorIndex));
  const secretValue = value.slice(separatorIndex + 1);

  return secretKeyLabels.has(label) && isSecretValue(secretValue);
}

function isSecretLabel(value: string): boolean {
  return secretKeyLabels.has(normalizeSecretLabel(value));
}

export function estimateAiCost(input: {
  model: AiModelRecord;
  inputTokens: number;
  outputTokens: number;
}): number {
  const divisor = input.model.pricing_unit === "per_1k" ? 1_000 : 1_000_000;

  return roundCost(
    (input.inputTokens / divisor * input.model.cost_input)
    + (input.outputTokens / divisor * input.model.cost_output)
  );
}

export function assertAiRequestWithinModelLimits(input: AiRequestGuardInput): AiModelRecord {
  const model = aiModelRecordSchema.parse(input.model);

  if (input.inputTokens > model.context_window || input.inputTokens + input.requestedOutputTokens > model.context_window) {
    throw new Error("AI input exceeds model limit");
  }

  if (model.max_input_tokens !== null && input.inputTokens > model.max_input_tokens) {
    throw new Error("AI input exceeds model limit");
  }

  if (model.max_tokens !== null && input.requestedOutputTokens > model.max_tokens) {
    throw new Error("AI output exceeds model limit");
  }

  if (!model.input_modalities.includes(input.modality)) {
    throw new Error("AI modality is not supported");
  }

  const estimatedCost = estimateAiCost({
    model,
    inputTokens: input.inputTokens,
    outputTokens: input.requestedOutputTokens
  });

  if (model.max_cost_per_request !== null && estimatedCost > model.max_cost_per_request) {
    throw new Error("AI request exceeds model cost limit");
  }

  return model;
}

function budgetMatches(input: AiBudgetEvaluationInput, budget: AiBudgetRecord): boolean {
  if (!budget.is_active || budget.currency !== input.model.currency) {
    return false;
  }

  if (budget.tenant_id !== null && budget.tenant_id !== input.tenantId) {
    return false;
  }

  if (budget.user_id !== null && budget.user_id !== input.userId) {
    return false;
  }

  if (budget.feature_key !== null && budget.feature_key !== input.featureKey) {
    return false;
  }

  if (budget.provider !== null && budget.provider !== input.model.provider) {
    return false;
  }

  if (budget.ai_model_id !== null && budget.ai_model_id !== input.model.id) {
    return false;
  }

  switch (budget.scope) {
    case "global":
      return true;
    case "tenant":
      return budget.tenant_id === input.tenantId;
    case "provider":
      return budget.provider === input.model.provider;
    case "model":
      return budget.ai_model_id === input.model.id;
    case "user":
      return budget.user_id === input.userId;
    case "feature":
      return budget.feature_key === input.featureKey;
  }
}

export function evaluateAiBudgets(input: AiBudgetEvaluationInput): AiBudgetEvaluationResult {
  const matchedBudgetIds: string[] = [];
  const warnings: string[] = [];

  for (const budget of input.budgets) {
    if (!budgetMatches(input, budget)) {
      continue;
    }

    matchedBudgetIds.push(budget.id);

    if (budget.spend_to_date + input.estimatedCost <= budget.max_spend) {
      continue;
    }

    if (budget.on_exceed === "block") {
      throw new Error("AI budget would be exceeded");
    }

    warnings.push("AI budget threshold would be exceeded");
  }

  return {
    allowed: true,
    warnings,
    matchedBudgetIds
  };
}

export function redactAiText(value: string): string {
  let redactNextSecret = false;

  return value
    .split(" ")
    .map((token) => {
      const { body, suffix } = splitTrailingPunctuation(token);

      if (!body) {
        return token;
      }

      if (redactNextSecret && isSecretValue(body)) {
        redactNextSecret = false;
        return `[redacted-secret]${suffix}`;
      }

      if (redactNextSecret && body === "=") {
        return token;
      }

      redactNextSecret = false;

      if (isEmailToken(body)) {
        return `[redacted-email]${suffix}`;
      }

      if (isProviderSecretToken(body) || isInlineSecretAssignment(body)) {
        return `[redacted-secret]${suffix}`;
      }

      if (isSecretLabel(body)) {
        redactNextSecret = true;
      }

      return token;
    })
    .join(" ");
}

export function buildAiInvocationLogMetadata(input: {
  tenantId: string;
  userId: string | null;
  featureKey: string | null;
  model: AiModelRecord;
  inputTokens: number;
  outputTokens: number;
  estimatedCost: number;
  redactionApplied: boolean;
  budgetWarnings: readonly string[];
  providerRequestId: string | null;
}): Record<string, unknown> {
  return {
    tenant_id: input.tenantId,
    user_id: input.userId,
    feature_key: input.featureKey,
    provider: input.model.provider,
    model_record_id: input.model.id,
    model_id: input.model.model_id,
    tokens_input: input.inputTokens,
    tokens_output: input.outputTokens,
    pricing_unit: input.model.pricing_unit,
    currency: input.model.currency,
    estimated_cost_usd: roundCost(input.estimatedCost),
    redaction_applied: input.redactionApplied,
    budget_warnings: [...input.budgetWarnings],
    provider_request_id: input.providerRequestId
  };
}

export function resolveAiModelForInvocation(input: {
  requestedModel: AiModelRecord;
  availableModels: readonly AiModelRecord[];
}): AiModelRecord {
  const requestedModel = aiModelRecordSchema.parse(input.requestedModel);

  if (requestedModel.is_active && requestedModel.deprecated_at === null) {
    return requestedModel;
  }

  if (requestedModel.fallback_model_id === null) {
    throw new Error("AI model is inactive or deprecated");
  }

  const fallbackModel = input.availableModels.find((model) => model.id === requestedModel.fallback_model_id);

  if (!fallbackModel || !fallbackModel.is_active || fallbackModel.deprecated_at !== null) {
    throw new Error("AI model is inactive or deprecated");
  }

  return aiModelRecordSchema.parse(fallbackModel);
}

export function createOpenRouterAdapter(options: OpenRouterAdapterOptions): AiProviderAdapter {
  return {
    async invoke(input) {
      if (!options.apiKey) {
        throw new Error("OpenRouter API key is required");
      }

      const endpoint = input.model.endpoint_url ?? openRouterDefaultEndpoint;
      const fetcher = options.fetcher ?? fetch;
      const response = await fetcher(endpoint, {
        method: "POST",
        headers: {
          "authorization": `Bearer ${options.apiKey}`,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          model: input.model.model_id,
          messages: [
            {
              role: "user",
              content: input.prompt
            }
          ],
          max_tokens: input.requestedOutputTokens,
          ...input.model.default_parameters
        })
      });

      if (!response.ok) {
        throw new Error("OpenRouter request failed");
      }

      const payload = await response.json() as {
        id?: string;
        choices?: Array<{ message?: { content?: unknown } }>;
        usage?: { prompt_tokens?: number; completion_tokens?: number };
      };
      const content = payload.choices?.[0]?.message?.content;

      if (typeof content !== "string") {
        throw new TypeError("OpenRouter response is invalid");
      }

      return {
        provider: "openrouter",
        providerRequestId: payload.id ?? null,
        content,
        inputTokens: payload.usage?.prompt_tokens ?? input.inputTokens,
        outputTokens: payload.usage?.completion_tokens ?? input.requestedOutputTokens
      };
    }
  };
}

export function createMockAiProviderAdapter(content: string): AiProviderAdapter {
  return {
    async invoke(input) {
      return {
        provider: "mock",
        providerRequestId: "mock-ai-provider",
        content,
        inputTokens: input.inputTokens,
        outputTokens: input.requestedOutputTokens
      };
    }
  };
}
