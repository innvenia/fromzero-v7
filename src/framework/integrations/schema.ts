import { z } from "zod";

import { assertSafeOutboundUrl, redactSensitiveObject } from "./security";

export const integrationProviderSchema = z.enum([
  "stripe",
  "resend",
  "openrouter",
  "inngest",
  "recaptcha",
  "s3",
  "r2",
  "custom"
]);

export const integrationStatusSchema = z.enum(["active", "inactive", "error"]);

export const encryptedCredentialsEnvelopeSchema = z.object({
  ciphertext: z.string().min(24),
  key_id: z.string().min(1).max(120),
  algorithm: z.enum(["aes-256-gcm", "supabase-vault"]),
  redacted_preview: z.record(z.string(), z.unknown()).default({})
}).strict();

export const integrationRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  provider: integrationProviderSchema,
  name: z.string().min(1).max(200),
  config: z.record(z.string(), z.unknown()),
  credentials: encryptedCredentialsEnvelopeSchema,
  status: integrationStatusSchema,
  last_tested_at: z.iso.datetime().nullable(),
  is_active: z.boolean()
}).superRefine((integration, context) => {
  const baseUrl = integration.config.base_url;

  if (typeof baseUrl === "string") {
    try {
      assertSafeOutboundUrl(baseUrl);
    } catch (error) {
      context.addIssue({
        code: "custom",
        message: error instanceof Error ? error.message : "Integration base URL is unsafe."
      });
    }
  }
});

export type IntegrationProvider = z.infer<typeof integrationProviderSchema>;
export type IntegrationStatus = z.infer<typeof integrationStatusSchema>;
export type EncryptedCredentialsEnvelope = z.infer<typeof encryptedCredentialsEnvelopeSchema>;
export type IntegrationRecord = z.infer<typeof integrationRecordSchema>;

export function assertEncryptedCredentialsEnvelope(credentials: unknown): EncryptedCredentialsEnvelope {
  return encryptedCredentialsEnvelopeSchema.parse(credentials);
}

export function buildIntegrationLogMetadata(integration: IntegrationRecord): Record<string, unknown> {
  const parsedIntegration = integrationRecordSchema.parse(integration);

  return redactSensitiveObject({
    integrationId: parsedIntegration.id,
    tenantId: parsedIntegration.tenant_id,
    provider: parsedIntegration.provider,
    name: parsedIntegration.name,
    status: parsedIntegration.status,
    config: parsedIntegration.config,
    credentials: parsedIntegration.credentials
  });
}
