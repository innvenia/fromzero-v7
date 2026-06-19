import { createHmac, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { assertSafeOutboundUrl } from "../../integrations";

export const webhookDeliveryStatusSchema = z.enum(["delivered", "failed", "retrying"]);

export const encryptedWebhookSecretSchema = z.object({
  ciphertext: z.string().min(24),
  key_id: z.string().min(1).max(120),
  algorithm: z.enum(["aes-256-gcm", "supabase-vault"])
}).strict();

export const webhookRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  name: z.string().min(1).max(200),
  url: z.string().url(),
  secret_encrypted: encryptedWebhookSecretSchema,
  events: z.array(z.string().regex(/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/)).min(1),
  is_active: z.boolean(),
  last_triggered_at: z.string().datetime().nullable(),
  failure_count: z.number().int().nonnegative()
}).superRefine((webhook, context) => {
  try {
    assertSafeOutboundUrl(webhook.url);
  } catch (error) {
    context.addIssue({
      code: "custom",
      message: error instanceof Error ? error.message : "Webhook URL is unsafe."
    });
  }
});

export const webhookDeliveryRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  webhook_id: z.string().uuid(),
  event: z.string().regex(/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/),
  payload: z.record(z.string(), z.unknown()),
  response_status: z.number().int().min(100).max(599).nullable(),
  response_body: z.string().max(1024).nullable(),
  attempt_number: z.number().int().positive(),
  status: webhookDeliveryStatusSchema,
  attempted_at: z.string().datetime(),
  delivered_at: z.string().datetime().nullable()
}).superRefine((delivery, context) => {
  if (delivery.status === "delivered" && delivery.delivered_at === null) {
    context.addIssue({
      code: "custom",
      message: "Delivered webhook deliveries require delivered_at."
    });
  }
});

export type WebhookRecord = z.infer<typeof webhookRecordSchema>;
export type WebhookDeliveryRecord = z.infer<typeof webhookDeliveryRecordSchema>;
export type WebhookDeliveryStatus = z.infer<typeof webhookDeliveryStatusSchema>;

function safeEqualHex(left: string, right: string): boolean {
  if (!/^[a-f0-9]+$/i.test(left) || !/^[a-f0-9]+$/i.test(right)) {
    return false;
  }

  const leftBuffer = Buffer.from(left, "hex");
  const rightBuffer = Buffer.from(right, "hex");

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function parseSignatureHeader(signatureHeader: string) {
  const parts = signatureHeader.split(",");
  const timestampPart = parts.find((part) => part.startsWith("t="));
  const signaturePart = parts.find((part) => part.startsWith("v1="));

  return {
    timestamp: timestampPart ? Number(timestampPart.slice(2)) : Number.NaN,
    signature: signaturePart?.slice(3) ?? ""
  };
}

export function signWebhookPayload(input: {
  payload: string;
  secret: string;
  timestamp: number;
}): string {
  const signature = createHmac("sha256", input.secret)
    .update(`${input.timestamp}.${input.payload}`)
    .digest("hex");

  return `t=${input.timestamp},v1=${signature}`;
}

export function verifyWebhookSignature(input: {
  payload: string;
  signatureHeader: string;
  secret: string;
  now: Date;
  toleranceSeconds: number;
  replayCache?: Set<string>;
}): boolean {
  const { timestamp, signature } = parseSignatureHeader(input.signatureHeader);

  if (!input.secret || !Number.isFinite(timestamp) || !signature) {
    return false;
  }

  const nowSeconds = Math.floor(input.now.getTime() / 1000);

  if (Math.abs(nowSeconds - timestamp) > input.toleranceSeconds) {
    return false;
  }

  const expectedHeader = signWebhookPayload({
    payload: input.payload,
    secret: input.secret,
    timestamp
  });
  const expectedSignature = parseSignatureHeader(expectedHeader).signature;
  const replayKey = `${timestamp}.${signature}`;

  if (!safeEqualHex(expectedSignature, signature)) {
    return false;
  }

  if (input.replayCache?.has(replayKey)) {
    return false;
  }

  input.replayCache?.add(replayKey);
  return true;
}

export function buildWebhookDeliveryAttempt(input: {
  webhook: WebhookRecord;
  event: string;
  payload: Record<string, unknown>;
  attemptNumber: number;
  responseStatus: number | null;
  responseBody: string | null;
  attemptedAt: string;
  id?: string;
}): WebhookDeliveryRecord {
  const webhook = webhookRecordSchema.parse(input.webhook);
  const delivered = input.responseStatus !== null && input.responseStatus >= 200 && input.responseStatus < 300;

  return webhookDeliveryRecordSchema.parse({
    id: input.id ?? globalThis.crypto.randomUUID(),
    tenant_id: webhook.tenant_id,
    webhook_id: webhook.id,
    event: input.event,
    payload: input.payload,
    response_status: input.responseStatus,
    response_body: input.responseBody ? input.responseBody.slice(0, 1024) : null,
    attempt_number: input.attemptNumber,
    status: delivered ? "delivered" : input.attemptNumber >= 3 ? "failed" : "retrying",
    attempted_at: input.attemptedAt,
    delivered_at: delivered ? input.attemptedAt : null
  });
}

export function shouldDisableWebhook(webhookInput: WebhookRecord): boolean {
  const webhook = webhookRecordSchema.parse(webhookInput);

  return webhook.failure_count >= 10;
}
