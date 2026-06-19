import { describe, expect, it } from "vitest";

import {
  AuthorizationError,
  resolveEffectiveMfaPolicy,
  resolveInteractiveTenantContext,
  requirePermission
} from "../../src/framework/auth";
import type { PermissionGrant } from "../../src/framework/auth";

const userId = "11111111-1111-4111-8111-111111111111";
const tenantId = "22222222-2222-4222-8222-222222222222";
const otherTenantId = "33333333-3333-4333-8333-333333333333";
const profileId = "44444444-4444-4444-8444-444444444444";

const baseGrants: PermissionGrant[] = [
  {
    tenantId,
    subjectType: "profile",
    subjectId: profileId,
    moduleCode: "user",
    action: "view",
    allowed: true
  },
  {
    tenantId,
    subjectType: "profile",
    subjectId: profileId,
    moduleCode: "user",
    action: "create",
    allowed: false
  }
];

describe("auth tenant context and RBAC", () => {
  it("resolves tenant context only from trusted app metadata", () => {
    const context = resolveInteractiveTenantContext({
      userId,
      appMetadata: {
        tenant_id: tenantId,
        profile_id: profileId,
        profile_code: "member",
        is_super_admin: false,
        mfa_policy: "optional",
        mfa_verified: true
      },
      requestedTenantId: tenantId
    });

    expect(context).toEqual(
      expect.objectContaining({
        authMethod: "jwt",
        userId,
        tenantId,
        profileId,
        profileCode: "member"
      })
    );
  });

  it("rejects client-provided tenant spoofing", () => {
    expect(() =>
      resolveInteractiveTenantContext({
        userId,
        appMetadata: {
          tenant_id: tenantId,
          profile_id: profileId
        },
        requestedTenantId: otherTenantId
      })
    ).toThrow(AuthorizationError);
  });

  it("allows super admins but denies missing server-side grants", () => {
    const memberContext = resolveInteractiveTenantContext({
      userId,
      appMetadata: {
        tenant_id: tenantId,
        profile_id: profileId,
        profile_code: "member"
      }
    });

    expect(requirePermission(memberContext, "user", "view", baseGrants)).toBe(true);
    expect(() => requirePermission(memberContext, "user", "create", baseGrants)).toThrow(AuthorizationError);

    const superAdminContext = resolveInteractiveTenantContext({
      userId,
      appMetadata: {
        tenant_id: tenantId,
        profile_id: profileId,
        profile_code: "super_admin",
        is_super_admin: true
      }
    });

    expect(requirePermission(superAdminContext, "settings", "delete", [])).toBe(true);
  });

  it("does not allow grants with a mismatched subject type", () => {
    const memberContext = resolveInteractiveTenantContext({
      userId,
      appMetadata: {
        tenant_id: tenantId,
        profile_id: profileId,
        profile_code: "member"
      }
    });

    const mismatchedGrant: PermissionGrant = {
      tenantId,
      subjectType: "user",
      subjectId: profileId,
      moduleCode: "user",
      action: "view",
      allowed: true
    };

    expect(() => requirePermission(memberContext, "user", "view", [mismatchedGrant])).toThrow(AuthorizationError);
  });

  it("keeps MFA tenant overrides from relaxing global policy", () => {
    expect(resolveEffectiveMfaPolicy("required", "optional")).toBe("required");
    expect(resolveEffectiveMfaPolicy("optional", "disabled")).toBe("optional");
    expect(resolveEffectiveMfaPolicy("disabled", "required")).toBe("required");
  });
});
