import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { baseProfileCodes } from "../../src/framework/db";
import { bootstrapSchema, coreModuleDefinitions } from "../../src/framework/bootstrap";

const bootstrapFixture = JSON.parse(readFileSync(join(process.cwd(), "bootstrap.example.json"), "utf8")) as unknown;
const bootstrapConfig = bootstrapSchema.parse(bootstrapFixture);

function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }

  return [];
}

describe("bootstrap contract", () => {
  it("keeps the approved SaaS defaults", () => {
    expect(bootstrapConfig.app.mode).toBe("saas");
    expect(bootstrapConfig.app.allow_multi_tenant_users).toBe(false);
    expect(bootstrapConfig.app.licensing_model).toBe("per_tenant");
    expect(bootstrapConfig.infrastructure.features.redis_enabled).toBe(false);
    expect(bootstrapConfig.security.mfa_policy).toBe("optional");
  });

  it("includes all required base profiles", () => {
    expect(bootstrapConfig.initial_data.profiles).toEqual(expect.arrayContaining([...baseProfileCodes]));
  });

  it("keeps the canonical core module registry complete", () => {
    expect(coreModuleDefinitions).toHaveLength(27);
    expect(coreModuleDefinitions.map((moduleDefinition) => moduleDefinition.code)).toContain("task");
  });

  it("does not contain real-looking secrets", () => {
    const serializedValues = collectStrings(bootstrapFixture);

    expect(serializedValues.some((value) => /(?:sk_live|sk_test|sbp_|service_role|eyJ)/i.test(value))).toBe(false);
  });

  it("keeps multi-tenant users configurable with a safe default", () => {
    const parsedDefault = bootstrapSchema.parse({
      ...bootstrapConfig,
      app: {
        ...bootstrapConfig.app,
        allow_multi_tenant_users: undefined
      }
    });
    const parsedEnabled = bootstrapSchema.parse({
      ...bootstrapConfig,
      app: {
        ...bootstrapConfig.app,
        allow_multi_tenant_users: true
      }
    });

    expect(parsedDefault.app.allow_multi_tenant_users).toBe(false);
    expect(parsedEnabled.app.allow_multi_tenant_users).toBe(true);
  });
});
