import { z } from "zod";

export const logActionSchema = z.enum([
  "create",
  "update",
  "delete",
  "restore",
  "login",
  "logout",
  "ai.invocation",
  "system_event",
  "subscription.trial_reminder"
]);

export const logRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid().nullable(),
  actor_id: z.string().uuid().nullable(),
  api_key_id: z.string().uuid().nullable(),
  action: logActionSchema.or(z.string().min(1).max(100)),
  entity_type: z.string().max(100).nullable(),
  entity_id: z.string().uuid().nullable(),
  ip_address: z.string().nullable(),
  user_agent: z.string().nullable(),
  timestamp: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown())
});

export type LogRecord = z.infer<typeof logRecordSchema>;
