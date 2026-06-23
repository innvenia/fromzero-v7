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
    const paidModel = aiModelRecordSchema.parse(paidFallbackModel);

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

    expect(estimateAiCost({
      model: { ...paidModel, pricing_unit: "per_1k" },
      inputTokens: 2_000,
      outputTokens: 1_000
    })).toBe(0.45);

    expect(() => assertAiRequestWithinModelLimits({
      model: { ...paidModel, max_cost_per_request: 0.00001 },
      inputTokens: 100_000,
      requestedOutputTokens: 4_000,
      modality: "text"
    })).toThrow("AI request exceeds model cost limit");
  });

  it("rejects invalid AI model and budget scope records", () => {
    expect(() => aiModelRecordSchema.parse({
      ...gemmaModel,
      max_input_tokens: 300_000
    })).toThrow("AI max_input_tokens cannot exceed context_window");

    expect(() => aiModelRecordSchema.parse({
      ...gemmaModel,
      max_tokens: 300_000
    })).toThrow("AI max_tokens cannot exceed context_window");

    const baseBudget = {
      id: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
      tenant_id: null,
      user_id: null,
      feature_key: null,
      scope: "tenant",
      provider: null,
      ai_model_id: null,
      period: "month",
      max_spend: 1,
      spend_to_date: 0,
      currency: "USD",
      on_exceed: "block",
      is_active: true
    } as const;

    expect(() => aiBudgetRecordSchema.parse(baseBudget)).toThrow("Tenant AI budgets require tenant_id");
    expect(() => aiBudgetRecordSchema.parse({ ...baseBudget, scope: "user" })).toThrow("User AI budgets require user_id");
    expect(() => aiBudgetRecordSchema.parse({ ...baseBudget, scope: "feature" })).toThrow("Feature AI budgets require feature_key");
    expect(() => aiBudgetRecordSchema.parse({ ...baseBudget, scope: "provider" })).toThrow("Provider AI budgets require provider");
    expect(() => aiBudgetRecordSchema.parse({ ...baseBudget, scope: "model" })).toThrow("Model AI budgets require ai_model_id");
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

    const ignoredBudgets = [
      { ...budget, id: "dddddddd-dddd-4ddd-8ddd-dddddddddddd", is_active: false },
      { ...budget, id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee", currency: "EUR" },
      { ...budget, id: "ffffffff-ffff-4fff-8fff-ffffffffffff", tenant_id: "99999999-9999-4999-8999-999999999999" },
      { ...budget, id: "99999999-9999-4999-8999-999999999998", user_id: "99999999-9999-4999-8999-999999999997" },
      { ...budget, id: "99999999-9999-4999-8999-999999999996", feature_key: "other.feature" },
      { ...budget, id: "99999999-9999-4999-8999-999999999995", provider: "openai" },
      { ...budget, id: "99999999-9999-4999-8999-999999999994", ai_model_id: "99999999-9999-4999-8999-999999999993" }
    ].map((record) => aiBudgetRecordSchema.parse(record));

    expect(evaluateAiBudgets({
      tenantId,
      userId,
      featureKey: "task.summarize",
      model,
      estimatedCost: 0.002,
      budgets: ignoredBudgets
    })).toEqual({
      allowed: true,
      warnings: [],
      matchedBudgetIds: []
    });

    const scopedBudgets = [
      { ...budget, id: "99999999-9999-4999-8999-999999999992", tenant_id: null, user_id: null, feature_key: null, provider: null, ai_model_id: null, scope: "global" },
      { ...budget, id: "99999999-9999-4999-8999-999999999991", tenant_id: tenantId, user_id: null, feature_key: null, provider: null, ai_model_id: null, scope: "tenant" },
      { ...budget, id: "99999999-9999-4999-8999-999999999990", tenant_id: null, user_id: null, feature_key: null, provider: "openrouter", ai_model_id: null, scope: "provider" },
      { ...budget, id: "99999999-9999-4999-8999-999999999989", tenant_id: null, user_id: null, feature_key: null, provider: null, ai_model_id: model.id, scope: "model" },
      { ...budget, id: "99999999-9999-4999-8999-999999999988", tenant_id: null, user_id: userId, feature_key: null, provider: null, ai_model_id: null, scope: "user" },
      { ...budget, id: "99999999-9999-4999-8999-999999999987", tenant_id: null, user_id: null, feature_key: "task.summarize", provider: null, ai_model_id: null, scope: "feature" }
    ].map((record) => aiBudgetRecordSchema.parse({
      ...record,
      max_spend: 2,
      spend_to_date: 0
    }));

    expect(evaluateAiBudgets({
      tenantId,
      userId,
      featureKey: "task.summarize",
      model,
      estimatedCost: 0.002,
      budgets: scopedBudgets
    }).matchedBudgetIds).toEqual(scopedBudgets.map((budgetRecord) => budgetRecord.id));
  });

  it("redacts sensitive input and builds prompt-free usage log metadata", () => {
    const fakeProviderKey = ["sk", "test-secret-value"].join("-");
    const fakeInlineSecret = ["or", "secret-value"].join("-");
    const redacted = redactAiText(`Email admin@example.com, with token ${fakeProviderKey} and api_key=${fakeInlineSecret}`);

    expect(redacted).not.toContain("admin@example.com");
    expect(redacted).not.toContain(fakeProviderKey);
    expect(redacted).not.toContain(fakeInlineSecret);
    expect(redacted).toContain("[redacted-email]");
    expect(redacted).toContain("[redacted-secret]");
    expect(redactAiText("plain text token is short")).toBe("plain text token is short");
    expect(redactAiText(`api_key = ${fakeInlineSecret}`)).toBe("api_key = [redacted-secret]");

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

    await expect(createOpenRouterAdapter({
      apiKey: "server-only-test-key",
      fetcher: async () => new Response("{}", { status: 503 })
    }).invoke({
      model,
      prompt: "Provider fails",
      inputTokens: 1,
      requestedOutputTokens: 1
    })).rejects.toThrow("OpenRouter request failed");

    await expect(createOpenRouterAdapter({
      apiKey: "server-only-test-key",
      fetcher: async () => new Response(JSON.stringify({
        choices: [{ message: { content: null } }]
      }), {
        status: 200,
        headers: { "content-type": "application/json" }
      })
    }).invoke({
      model,
      prompt: "Invalid payload",
      inputTokens: 1,
      requestedOutputTokens: 1
    })).rejects.toThrow(TypeError);

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
