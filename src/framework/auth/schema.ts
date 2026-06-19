import { z } from "zod";

import { moduleActions } from "../db";

export const authMethodSchema = z.enum(["jwt", "api_key"]);
export const mfaPolicySchema = z.enum(["disabled", "optional", "required"]);
export const mfaMethodSchema = z.enum(["totp", "email", "sms"]);
export const moduleActionSchema = z.enum(moduleActions);
export const moduleCodeSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const flexibleBooleanSchema = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((value) => value === "true")
]);

export const appMetadataSchema = z.object({
  tenant_id: z.string().uuid().optional(),
  profile_id: z.string().uuid().optional(),
  profile_code: z.string().min(1).optional(),
  is_super_admin: flexibleBooleanSchema.optional(),
  mfa_policy: mfaPolicySchema.optional(),
  mfa_verified: flexibleBooleanSchema.optional()
}).passthrough();

export const interactiveAuthContextSchema = z.object({
  authMethod: z.literal("jwt"),
  userId: z.string().uuid(),
  tenantId: z.string().uuid(),
  profileId: z.string().uuid().nullable(),
  profileCode: z.string().min(1).nullable(),
  isSuperAdmin: z.boolean(),
  mfaPolicy: mfaPolicySchema,
  mfaVerified: z.boolean()
});

export const apiKeyAuthContextSchema = z.object({
  authMethod: z.literal("api_key"),
  apiKeyId: z.string().uuid(),
  tenantId: z.string().uuid(),
  profileId: z.string().uuid(),
  scopes: z.array(z.string().regex(/^(?:\*|[a-z0-9]+(?:-[a-z0-9]+)*):(?:\*|view|create|update|delete|import|export|notify)$/)),
  isSuperAdmin: z.literal(false)
});

export const authContextSchema = z.discriminatedUnion("authMethod", [
  interactiveAuthContextSchema,
  apiKeyAuthContextSchema
]);

export const emailPasswordCredentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128)
});

export type AppMetadata = z.infer<typeof appMetadataSchema>;
export type AuthContext = z.infer<typeof authContextSchema>;
export type InteractiveAuthContext = z.infer<typeof interactiveAuthContextSchema>;
export type ApiKeyAuthContext = z.infer<typeof apiKeyAuthContextSchema>;
export type AuthMethod = z.infer<typeof authMethodSchema>;
export type MfaPolicy = z.infer<typeof mfaPolicySchema>;
export type MfaMethod = z.infer<typeof mfaMethodSchema>;
export type EmailPasswordCredentials = z.infer<typeof emailPasswordCredentialsSchema>;
