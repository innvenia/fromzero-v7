import { randomUUID } from "node:crypto";

import { z, ZodError } from "zod";

import {
  AuthenticationError,
  AuthorizationError,
  requirePermission,
  resolveInteractiveTenantContext,
  type InteractiveAuthContext,
  type PermissionGrant
} from "../auth";
import { moduleActionSchema, moduleCodeSchema } from "../auth/schema";
import { logRecordSchema, type LogRecord } from "../modules/log";
import { defaultRateLimitRules, type RateLimitRule } from "./rate-limit";

const permissionGrantSchema = z.object({
  tenantId: z.string().uuid(),
  subjectType: z.enum(["user", "profile"]),
  subjectId: z.string().uuid(),
  moduleCode: z.string().min(1),
  action: z.string().min(1),
  allowed: z.boolean()
});

export const privateApiRequestSchema = z.object({
  userId: z.string().uuid(),
  appMetadata: z.unknown(),
  requestedTenantId: z.string().uuid().nullable().optional(),
  moduleCode: moduleCodeSchema,
  action: moduleActionSchema,
  permissionGrants: z.array(permissionGrantSchema),
  route: z.string().regex(/^\/api\/v1(?:\/[a-z0-9-]+)+$/),
  requestId: z.string().min(1).max(128)
});

export interface PrivateApiRequestContext {
  auth: InteractiveAuthContext;
  audit: LogRecord;
  rateLimitRules: RateLimitRule[];
}

export type PrivateApiRequestInput = z.input<typeof privateApiRequestSchema>;

export function createPrivateApiRequestContext(input: PrivateApiRequestInput): PrivateApiRequestContext {
  const parsed = privateApiRequestSchema.parse(input);
  const auth = resolveInteractiveTenantContext({
    userId: parsed.userId,
    appMetadata: parsed.appMetadata,
    requestedTenantId: parsed.requestedTenantId
  });

  requirePermission(auth, parsed.moduleCode, parsed.action, parsed.permissionGrants as PermissionGrant[]);

  return {
    auth,
    audit: createPrivateApiAuditLog(auth, parsed.route, parsed.requestId),
    rateLimitRules: [...defaultRateLimitRules]
  };
}

export function createPrivateApiAuditLog(
  auth: InteractiveAuthContext,
  route: string,
  requestId: string
): LogRecord {
  return logRecordSchema.parse({
    id: randomUUID(),
    tenant_id: auth.tenantId,
    actor_id: auth.userId,
    api_key_id: null,
    action: "api.private.request",
    entity_type: route,
    entity_id: null,
    ip_address: null,
    user_agent: null,
    timestamp: new Date().toISOString(),
    metadata: {
      request_id: requestId,
      profile_id: auth.profileId,
      profile_code: auth.profileCode,
      auth_method: auth.authMethod
    }
  });
}

export function toSafePrivateApiError(error: unknown) {
  if (error instanceof AuthenticationError) {
    return { status: 401, body: { error: "authentication_required" } };
  }

  if (error instanceof AuthorizationError) {
    return { status: 403, body: { error: "forbidden" } };
  }

  if (error instanceof ZodError) {
    return { status: 400, body: { error: "invalid_request" } };
  }

  return { status: 500, body: { error: "internal_error" } };
}
