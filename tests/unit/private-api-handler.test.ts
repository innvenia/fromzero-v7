import { describe, expect, it } from "vitest";

import {
  createPrivateApiRequestContext,
  toSafePrivateApiError
} from "../../src/framework/api";
import { AuthorizationError } from "../../src/framework/auth";
import type { PermissionGrant } from "../../src/framework/auth";

const userId = "11111111-1111-4111-8111-111111111111";
const tenantId = "22222222-2222-4222-8222-222222222222";
const otherTenantId = "33333333-3333-4333-8333-333333333333";
const profileId = "44444444-4444-4444-8444-444444444444";

const settingsGrant: PermissionGrant = {
  tenantId,
  subjectType: "profile",
  subjectId: profileId,
  moduleCode: "settings",
  action: "view",
  allowed: true
};

describe("private API reference handler contract", () => {
  it("builds authenticated tenant context, rate limit and audit evidence", () => {
    const context = createPrivateApiRequestContext({
      userId,
      appMetadata: {
        tenant_id: tenantId,
        profile_id: profileId,
        profile_code: "admin"
      },
      moduleCode: "settings",
      action: "view",
      permissionGrants: [settingsGrant],
      route: "/api/v1/settings",
      requestId: "req-1"
    });

    expect(context.auth.tenantId).toBe(tenantId);
    expect(context.rateLimitRules.map((rule) => rule.scope)).toEqual(["global", "tenant", "user", "endpoint"]);
    expect(context.audit).toEqual(
      expect.objectContaining({
        tenant_id: tenantId,
        actor_id: userId,
        action: "api.private.request",
        entity_type: "/api/v1/settings"
      })
    );
  });

  it("rejects tenant spoofing before returning data", () => {
    expect(() =>
      createPrivateApiRequestContext({
        userId,
        appMetadata: {
          tenant_id: tenantId,
          profile_id: profileId
        },
        requestedTenantId: otherTenantId,
        moduleCode: "settings",
        action: "view",
        permissionGrants: [settingsGrant],
        route: "/api/v1/settings",
        requestId: "req-2"
      })
    ).toThrow(AuthorizationError);
  });

  it("maps unsafe errors to safe client payloads", () => {
    expect(toSafePrivateApiError(new Error("database password leaked"))).toEqual({
      status: 500,
      body: { error: "internal_error" }
    });
  });
});
