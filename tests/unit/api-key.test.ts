import { describe, expect, it } from "vitest";

import {
  apiKeyScopeAllows,
  apiKeyStatusSchema,
  generateApiKey,
  hashApiKey,
  isApiKeyUsable,
  verifyApiKeyHash
} from "../../src/framework/modules/api-key";

describe("API key contract", () => {
  it("generates one-time plaintext keys and stores only hashes", () => {
    const plaintext = generateApiKey({ environment: "test" });
    const hash = hashApiKey(plaintext);

    expect(plaintext).toMatch(/^sk_test_[A-Za-z0-9_-]{32,}$/);
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain(plaintext);
    expect(verifyApiKeyHash(plaintext, hash)).toBe(true);
    expect(verifyApiKeyHash(`${plaintext}x`, hash)).toBe(false);
  });

  it("validates granular scopes and wildcard scopes", () => {
    expect(apiKeyScopeAllows(["user:view"], "user", "view")).toBe(true);
    expect(apiKeyScopeAllows(["user:*"], "user", "delete")).toBe(true);
    expect(apiKeyScopeAllows(["*:view"], "tenant", "view")).toBe(true);
    expect(apiKeyScopeAllows(["*:*"], "api-key", "delete")).toBe(true);
    expect(apiKeyScopeAllows(["user:view"], "user", "delete")).toBe(false);
  });

  it("rejects inactive or expired keys", () => {
    expect(apiKeyStatusSchema.parse("active")).toBe("active");
    expect(
      isApiKeyUsable({
        is_active: true,
        deleted_at: null,
        expires_at: "2099-01-01T00:00:00.000Z"
      })
    ).toBe(true);
    expect(
      isApiKeyUsable({
        is_active: false,
        deleted_at: null,
        expires_at: "2099-01-01T00:00:00.000Z"
      })
    ).toBe(false);
    expect(
      isApiKeyUsable({
        is_active: true,
        deleted_at: null,
        expires_at: "2000-01-01T00:00:00.000Z"
      })
    ).toBe(false);
  });
});
