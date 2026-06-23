import { describe, expect, it } from "vitest";

import {
  apiEndpointContractSchema,
  sprintNineApiContracts
} from "../../src/framework/api";
import {
  assertAiRequestWithinModelLimits,
  buildAiInvocationLogMetadata,
  createMockAiProviderAdapter,
  createOpenRouterAdapter,
  estimateAiCost,
  evaluateAiBudgets,
  redactAiText,
  resolveAiModelForInvocation
} from "../../src/framework/ai";
import {
  aiBudgetRecordSchema,
  aiModelRecordSchema
} from "../../src/framework/modules";

const tenantId = "22222222-2222-4222-8222-222222222222";
const userId = "11111111-1111-4111-8111-111111111111";
const modelId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const fallbackModelId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";

const gemmaModel = {
  id: modelId,
  name: "Google Gemma 4 26B A4B Free",
  provider: "openrouter",
  model_id: "google/gemma-4-26b-a4b-it:free",
  endpoint_url: "https://openrouter.ai/api/v1/chat/completions",
  default_parameters: {
    temperature: 0.2
  },
  pricing_unit: "per_1m",
  currency: "USD",
  cost_input: 0,
  cost_output: 0,
  context_window: 262_144,
  max_input_tokens: 200_000,
  max_tokens: 4_096,
  max_cost_per_request: 0.25,
  request_timeout_seconds: 30,
  supports_streaming: false,
  input_modalities: ["text", "image", "video"],
  deprecated_at: null,
  fallback_model_id: fallbackModelId,
  is_active: true
} as const;

const paidFallbackModel = {
  ...gemmaModel,
  id: fallbackModelId,
  name: "Paid fallback",
  model_id: "google/gemma-4-26b-a4b-it",
  cost_input: 0.06,
  cost_output: 0.33,
  fallback_model_id: null
} as const;

describe("Sprint 9 Core AI contracts", () => {
  it("adds reserved API contracts for AI model catalog and invocation", () => {
    const parsedContracts = sprintNineApiContracts.map((contract) =>
      apiEndpointContractSchema.parse(contract)
    );

    expect(parsedContracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ basePath: "/api/v1/ai/models", ownerSprint: "Sprint 9" }),
        expect.objectContaining({ basePath: "/api/v1/ai/invoke", ownerSprint: "Sprint 9" })
      ])
    );
  });

  it("validates AI model catalog metadata and request guardrails", () => {
    const model = aiModelRecordSchema.parse(gemmaModel);

    expect(model.provider).toBe("openrouter");
    expect(model.input_modalities).toContain("video");
    expect(estimateAiCost({
      model,
      inputTokens: 1_000_000,
      outputTokens: 500_000
    })).toBe(0);

    expect(assertAiRequestWithinModelLimits({
      model,
      inputTokens: 25_000,
      requestedOutputTokens: 2_000,
      modality: "image"
    })).toEqual(model);

    expect(() => assertAiRequestWithinModelLimits({
      model,
      inputTokens: 300_000,
      requestedOutputTokens: 2_000,
      modality: "text"
    })).toThrow("AI input exceeds model limit");

    expect(() => assertAiRequestWithinModelLimits({
      model,
      inputTokens: 25_000,
      requestedOutputTokens: 8_000,
      modality: "text"
    })).toThrow("AI output exceeds model limit");

    expect(() => assertAiRequestWithinModelLimits({
      model,
      inputTokens: 25_000,
      requestedOutputTokens: 2_000,
      modality: "audio"
    })).toThrow("AI modality is not supported");
  });

  it("resolves active fallback models before invoking deprecated models", () => {
    const deprecatedModel = aiModelRecordSchema.parse({
      ...gemmaModel,
      deprecated_at: "2026-06-22T00:00:00.000Z"
    });
    const fallbackModel = aiModelRecordSchema.parse(paidFallbackModel);

    expect(resolveAiModelForInvocation({
      requestedModel: deprecatedModel,
      availableModels: [deprecatedModel, fallbackModel]
    })).toEqual(fallbackModel);

    expect(() => resolveAiModelForInvocation({
      requestedModel: { ...deprecatedModel, fallback_model_id: null },
      availableModels: [deprecatedModel]
    })).toThrow("AI model is inactive or deprecated");
  });

  it("applies active AI budgets before provider calls", () => {
    const model = aiModelRecordSchema.parse(paidFallbackModel);
    const budget = aiBudgetRecordSchema.parse({
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tenant_id: tenantId,
      user_id: userId,
      feature_key: "task.summarize",
      scope: "user",
      provider: "openrouter",
      ai_model_id: model.id,
      period: "month",
      max_spend: 0.01,
      spend_to_date: 0.009,
      currency: "USD",
      on_exceed: "block",
      is_active: true
    });

    expect(() => evaluateAiBudgets({
      tenantId,
      userId,
      featureKey: "task.summarize",
      model,
      estimatedCost: 0.002,
      budgets: [budget]
    })).toThrow("AI budget would be exceeded");

    expect(evaluateAiBudgets({
      tenantId,
      userId,
      featureKey: "task.summarize",
      model,
      estimatedCost: 0.002,
      budgets: [{ ...budget, on_exceed: "warn" }]
    })).toEqual({
      allowed: true,
      warnings: ["AI budget threshold would be exceeded"],
      matchedBudgetIds: [budget.id]
    });
  });

  it("redacts sensitive input and builds prompt-free usage log metadata", () => {
    const redacted = redactAiText("Email admin@example.com with token sk-test-secret-value");

    expect(redacted).not.toContain("admin@example.com");
    expect(redacted).not.toContain("sk-test-secret-value");
    expect(redacted).toContain("[redacted-email]");
    expect(redacted).toContain("[redacted-secret]");

    const metadata = buildAiInvocationLogMetadata({
      tenantId,
      userId,
      featureKey: "task.summarize",
      model: aiModelRecordSchema.parse(paidFallbackModel),
      inputTokens: 1_000,
      outputTokens: 500,
      estimatedCost: 0.000225,
      redactionApplied: true,
      budgetWarnings: [],
      providerRequestId: "or_mock_123"
    });

    expect(metadata).toEqual(expect.objectContaining({
      tenant_id: tenantId,
      user_id: userId,
      feature_key: "task.summarize",
      model_id: paidFallbackModel.model_id,
      tokens_input: 1_000,
      tokens_output: 500,
      pricing_unit: "per_1m",
      currency: "USD",
      estimated_cost_usd: 0.000225
    }));
    expect(JSON.stringify(metadata)).not.toContain("prompt");
    expect(JSON.stringify(metadata)).not.toContain("secret");
  });

  it("keeps OpenRouter adapter mockable and disabled without a server key", async () => {
    const model = aiModelRecordSchema.parse(gemmaModel);
    const seenRequests: unknown[] = [];
    const adapter = createOpenRouterAdapter({
      apiKey: "server-only-test-key",
      fetcher: async (url, init) => {
        seenRequests.push({ url, init });
        return new Response(JSON.stringify({
          id: "or_mock_123",
          choices: [{ message: { content: "Mocked response" } }],
          usage: { prompt_tokens: 10, completion_tokens: 4 }
        }), {
          status: 200,
          headers: { "content-type": "application/json" }
        });
      }
    });

    await expect(adapter.invoke({
      model,
      prompt: "Summarize this record",
      inputTokens: 10,
      requestedOutputTokens: 4
    })).resolves.toEqual({
      provider: "openrouter",
      providerRequestId: "or_mock_123",
      content: "Mocked response",
      inputTokens: 10,
      outputTokens: 4
    });
    expect(JSON.stringify(seenRequests[0])).toContain("Bearer server-only-test-key");
    expect(JSON.stringify(seenRequests[0])).toContain("google/gemma-4-26b-a4b-it:free");

    await expect(createOpenRouterAdapter({ apiKey: "" }).invoke({
      model,
      prompt: "No real call",
      inputTokens: 1,
      requestedOutputTokens: 1
    })).rejects.toThrow("OpenRouter API key is required");

    await expect(createMockAiProviderAdapter("Mocked local answer").invoke({
      model,
      prompt: "No network",
      inputTokens: 1,
      requestedOutputTokens: 1
    })).resolves.toEqual(expect.objectContaining({
      provider: "mock",
      content: "Mocked local answer"
    }));
  });
});
