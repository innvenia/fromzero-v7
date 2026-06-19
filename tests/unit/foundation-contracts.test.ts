import { describe, expect, it } from "vitest";

import { GET } from "../../src/app/api/v1/health/route";
import {
  apiEndpointContractSchema,
  defaultRateLimitRules,
  rateLimitRuleSchema,
  sprintThreeApiContracts
} from "../../src/framework/api";

describe("foundation API contracts", () => {
  it("validates the Sprint 3 endpoint inventory", () => {
    const parsedContracts = sprintThreeApiContracts.map((contract) => apiEndpointContractSchema.parse(contract));

    expect(parsedContracts).toContainEqual(
      expect.objectContaining({
        basePath: "/api/v1/health",
        implemented: true,
        requiresAuth: false
      })
    );
    expect(parsedContracts.every((contract) => contract.basePath.startsWith("/api/v1/"))).toBe(true);
  });

  it("validates base rate-limit rules", () => {
    const parsedRules = defaultRateLimitRules.map((rule) => rateLimitRuleSchema.parse(rule));

    expect(parsedRules.map((rule) => rule.scope)).toEqual(["global", "tenant", "user", "endpoint"]);
  });

  it("returns a safe health payload", async () => {
    const response = GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      status: "ok",
      service: "from-zero-framework",
      version: "7.4.0"
    });
  });
});
