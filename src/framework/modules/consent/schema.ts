import { z } from "zod";

export const consentTypeSchema = z.enum([
  "terms_of_service",
  "privacy_policy",
  "cookie_analytics",
  "cookie_functionality",
  "marketing",
  "security"
]);

export const consentRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  user_id: z.string().uuid(),
  consent_type: consentTypeSchema,
  accepted_at: z.string().datetime(),
  revoked_at: z.string().datetime().nullable(),
  document_id: z.string().uuid().nullable(),
  document_version_id: z.string().uuid().nullable(),
  ip_address: z.string().min(1).max(45),
  user_agent: z.string().min(1).max(500),
  metadata: z.record(z.string(), z.unknown())
});

export type ConsentType = z.infer<typeof consentTypeSchema>;
export type ConsentRecord = z.infer<typeof consentRecordSchema>;

export function createConsentRevocationRecord(
  consentInput: ConsentRecord,
  revocation: {
    id: string;
    revokedAt: string;
  }
): ConsentRecord {
  const consent = consentRecordSchema.parse(consentInput);

  if (consent.revoked_at) {
    throw new Error("Consent record is already revoked.");
  }

  return consentRecordSchema.parse({
    ...consent,
    id: revocation.id,
    revoked_at: revocation.revokedAt,
    metadata: {
      ...consent.metadata,
      revoked_from_consent_record_id: consent.id
    }
  });
}
