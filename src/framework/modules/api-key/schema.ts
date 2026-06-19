import { z } from "zod";

export const apiKeyStatusSchema = z.enum(["active", "inactive", "expired", "revoked"]);
export const apiKeyEnvironmentSchema = z.enum(["test", "live"]);
export const apiKeyScopeSchema = z.string().regex(/^(?:\*|[a-z0-9]+(?:-[a-z0-9]+)*):(?:\*|view|create|update|delete|import|export|notify)$/);

export const apiKeyRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  key_hash: z.string().regex(/^[a-f0-9]{64}$/),
  key_prefix: z.string().min(6).max(20),
  profile_id: z.string().uuid(),
  scopes: z.array(apiKeyScopeSchema),
  expires_at: z.string().datetime().nullable(),
  last_used_at: z.string().datetime().nullable(),
  is_active: z.boolean(),
  created_by: z.string().uuid(),
  deleted_at: z.string().datetime().nullable()
});

export type ApiKeyRecord = z.infer<typeof apiKeyRecordSchema>;
export type ApiKeyStatus = z.infer<typeof apiKeyStatusSchema>;
export type ApiKeyEnvironment = z.infer<typeof apiKeyEnvironmentSchema>;
