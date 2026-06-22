import { z } from "zod";

export const apiKeyStatusSchema = z.enum(["active", "inactive", "expired", "revoked"]);
export const apiKeyEnvironmentSchema = z.enum(["test", "live"]);
export const apiKeyScopeSchema = z.string().check(z.regex(/^(?:\*|[a-z0-9]+(?:-[a-z0-9]+)*):(?:\*|view|create|update|delete|import|export|notify)$/));

export const apiKeyRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  name: z.string().min(1).max(200),
  key_hash: z.string().check(z.regex(/^[a-f0-9]{64}$/)),
  key_prefix: z.string().min(6).max(20),
  profile_id: z.uuid(),
  scopes: z.array(apiKeyScopeSchema),
  expires_at: z.iso.datetime().nullable(),
  last_used_at: z.iso.datetime().nullable(),
  is_active: z.boolean(),
  created_by: z.uuid(),
  deleted_at: z.iso.datetime().nullable()
});

export type ApiKeyRecord = z.infer<typeof apiKeyRecordSchema>;
export type ApiKeyStatus = z.infer<typeof apiKeyStatusSchema>;
export type ApiKeyEnvironment = z.infer<typeof apiKeyEnvironmentSchema>;
