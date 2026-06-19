import { z } from "zod";

export const invitationStatusValues = ["pending", "accepted", "expired", "revoked"] as const;
export const invitationTypeValues = ["link", "code"] as const;

export const invitationRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  email: z.string().trim().toLowerCase().email(),
  profile_id: z.string().uuid(),
  invited_by: z.string().uuid(),
  token_hash: z.string().regex(/^[a-f0-9]{64}$/),
  invitation_type: z.enum(invitationTypeValues),
  status: z.enum(invitationStatusValues),
  expires_at: z.string().datetime(),
  accepted_at: z.string().datetime().nullable(),
  accepted_by_user_id: z.string().uuid().nullable()
});

export function isInvitationPending(record: Pick<InvitationRecord, "status" | "expires_at">, now = new Date()): boolean {
  return record.status === "pending" && new Date(record.expires_at).getTime() > now.getTime();
}

export type InvitationRecord = z.infer<typeof invitationRecordSchema>;
