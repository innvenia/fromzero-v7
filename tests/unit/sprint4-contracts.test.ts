import { describe, expect, it } from "vitest";

import {
  apiEndpointContractSchema,
  sprintFourApiContracts,
  sprintThreeApiContracts
} from "../../src/framework/api";
import {
  apiKeyRecordSchema,
  invitationRecordSchema,
  profilePermissionRecordSchema,
  userPreferenceRecordSchema,
  userRecordSchema
} from "../../src/framework/modules";

const tenantId = "22222222-2222-4222-8222-222222222222";
const userId = "11111111-1111-4111-8111-111111111111";
const profileId = "44444444-4444-4444-8444-444444444444";

describe("Sprint 4 contracts", () => {
  it("adds reserved API contracts for auth-related modules", () => {
    const parsedContracts = [...sprintThreeApiContracts, ...sprintFourApiContracts].map((contract) =>
      apiEndpointContractSchema.parse(contract)
    );

    expect(parsedContracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ basePath: "/api/v1/users", ownerSprint: "Sprint 4" }),
        expect.objectContaining({ basePath: "/api/v1/profiles", ownerSprint: "Sprint 4" }),
        expect.objectContaining({ basePath: "/api/v1/invitations", ownerSprint: "Sprint 4" }),
        expect.objectContaining({ basePath: "/api/v1/api-keys", ownerSprint: "Sprint 4" })
      ])
    );
  });

  it("validates user and preference DTOs without exposing MFA secrets", () => {
    const user = userRecordSchema.parse({
      id: "55555555-5555-4555-8555-555555555555",
      auth_id: userId,
      first_name: "Ada",
      last_name: "Lovelace",
      avatar_url: null,
      status: "active",
      locale: "es",
      timezone: "UTC",
      time_format: "24h",
      mfa_method: "totp",
      last_login_at: null,
      marked_for_deletion_at: null
    });

    expect(user).not.toHaveProperty("mfa_secret");
    expect(
      userPreferenceRecordSchema.parse({
        id: "66666666-6666-4666-8666-666666666666",
        user_id: userId,
        tenant_id: tenantId,
        key: "grid_user",
        value: { density: "compact" }
      })
    ).toEqual(expect.objectContaining({ tenant_id: tenantId }));
  });

  it("validates invitation and API key DTOs with hashed secrets only", () => {
    expect(
      invitationRecordSchema.parse({
        id: "77777777-7777-4777-8777-777777777777",
        tenant_id: tenantId,
        email: "new.user@example.com",
        profile_id: profileId,
        invited_by: userId,
        token_hash: "a".repeat(64),
        invitation_type: "link",
        status: "pending",
        expires_at: "2099-01-01T00:00:00.000Z",
        accepted_at: null,
        accepted_by_user_id: null
      })
    ).toEqual(expect.objectContaining({ token_hash: "a".repeat(64) }));

    expect(
      apiKeyRecordSchema.parse({
        id: "88888888-8888-4888-8888-888888888888",
        tenant_id: tenantId,
        name: "CI integration",
        key_hash: "b".repeat(64),
        key_prefix: "sk_test_ab",
        profile_id: profileId,
        scopes: ["user:view"],
        expires_at: null,
        last_used_at: null,
        is_active: true,
        created_by: userId,
        deleted_at: null
      })
    ).toEqual(expect.objectContaining({ key_hash: "b".repeat(64) }));
  });

  it("validates profile permission DTOs", () => {
    expect(
      profilePermissionRecordSchema.parse({
        id: "99999999-9999-4999-8999-999999999999",
        profile_id: profileId,
        module_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        can_view: true,
        can_create: false,
        can_update: false,
        can_delete: false,
        can_import: false,
        can_export: false,
        can_notify: false
      })
    ).toEqual(expect.objectContaining({ can_view: true }));
  });
});
