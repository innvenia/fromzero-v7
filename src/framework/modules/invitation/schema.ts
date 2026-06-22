import { z } from "zod";

export const invitationStatusValues = ["pending", "accepted", "expired", "revoked"] as const;
export const invitationTypeValues = ["link", "code"] as const;

export const invitationRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  profile_id: z.uuid(),
  invited_by: z.uuid(),
  token_hash: z.string().check(z.regex(/^[a-f0-9]{64}$/)),
  invitation_type: z.enum(invitationTypeValues),
  status: z.enum(invitationStatusValues),
  expires_at: z.iso.datetime(),
  accepted_at: z.iso.datetime().nullable(),
  accepted_by_user_id: z.uuid().nullable()
});

export function isInvitationPending(record: Pick<InvitationRecord, "status" | "expires_at">, now = new Date()): boolean {
  return record.status === "pending" && new Date(record.expires_at).getTime() > now.getTime();
}

export type InvitationRecord = z.infer<typeof invitationRecordSchema>;
