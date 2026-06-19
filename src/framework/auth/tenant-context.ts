import { AuthenticationError, AuthorizationError } from "./errors";
import {
  apiKeyAuthContextSchema,
  appMetadataSchema,
  type ApiKeyAuthContext,
  type AppMetadata,
  type InteractiveAuthContext
} from "./schema";

export interface InteractiveTenantContextInput {
  userId: string;
  appMetadata: unknown;
  requestedTenantId?: string | null;
}

export interface ApiKeyTenantContextInput {
  apiKeyId: string;
  tenantId: string;
  profileId: string;
  scopes: string[];
}

export function resolveInteractiveTenantContext(input: InteractiveTenantContextInput): InteractiveAuthContext {
  const metadata = appMetadataSchema.parse(input.appMetadata);

  if (!metadata.tenant_id) {
    throw new AuthenticationError("Missing tenant claim");
  }

  assertRequestedTenantMatchesClaim(metadata, input.requestedTenantId);

  return {
    authMethod: "jwt",
    userId: input.userId,
    tenantId: metadata.tenant_id,
    profileId: metadata.profile_id ?? null,
    profileCode: metadata.profile_code ?? null,
    isSuperAdmin: metadata.is_super_admin ?? metadata.profile_code === "super_admin",
    mfaPolicy: metadata.mfa_policy ?? "optional",
    mfaVerified: metadata.mfa_verified ?? false
  };
}

export function resolveApiKeyTenantContext(input: ApiKeyTenantContextInput): ApiKeyAuthContext {
  return apiKeyAuthContextSchema.parse({
    authMethod: "api_key",
    apiKeyId: input.apiKeyId,
    tenantId: input.tenantId,
    profileId: input.profileId,
    scopes: input.scopes,
    isSuperAdmin: false
  });
}

function assertRequestedTenantMatchesClaim(metadata: AppMetadata, requestedTenantId?: string | null) {
  if (!requestedTenantId || requestedTenantId === metadata.tenant_id) {
    return;
  }

  throw new AuthorizationError("Tenant context must come from trusted claims");
}
