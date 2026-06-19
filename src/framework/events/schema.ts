import { createHash } from "node:crypto";

import { z } from "zod";

import { moduleCodeSchema } from "../auth/schema";

export const frameworkEventSourceSchema = z.enum([
  "system",
  "user",
  "api",
  "job",
  "webhook",
  "import",
  "export",
  "rule"
]);

export const frameworkEventNameSchema = z.string()
  .regex(/^[a-z0-9-]+(?:\.[a-z0-9-]+)+$/)
  .max(120);

const frameworkEventBaseSchema = z.object({
  id: z.string().uuid(),
  name: frameworkEventNameSchema,
  tenant_id: z.string().uuid().nullable(),
  actor_id: z.string().uuid().nullable(),
  module_code: moduleCodeSchema.nullable(),
  entity_type: moduleCodeSchema.nullable(),
  entity_id: z.string().uuid().nullable(),
  source: frameworkEventSourceSchema,
  payload: z.record(z.string(), z.unknown()),
  idempotency_key: z.string().min(16).max(160),
  occurred_at: z.string().datetime()
});

export const frameworkEventSchema = frameworkEventBaseSchema.superRefine((event, context) => {
  if ((event.entity_type === null) !== (event.entity_id === null)) {
    context.addIssue({
      code: "custom",
      message: "Event entity_type and entity_id must be both set or both null."
    });
  }
});

export const createFrameworkEventInputSchema = frameworkEventBaseSchema.omit({
  id: true,
  idempotency_key: true
}).extend({
  id: z.string().uuid().optional(),
  idempotency_key: z.string().min(16).max(160).optional()
});

export type FrameworkEventSource = z.infer<typeof frameworkEventSourceSchema>;
export type FrameworkEvent = z.infer<typeof frameworkEventSchema>;
export type CreateFrameworkEventInput = z.infer<typeof createFrameworkEventInputSchema>;

function stableJson(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableJson(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([leftKey], [rightKey]) => leftKey.localeCompare(rightKey))
      .map(([key, item]) => `${JSON.stringify(key)}:${stableJson(item)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value);
}

export function createEventIdempotencyKey(input: {
  name: string;
  tenantId: string | null;
  entityType: string | null;
  entityId: string | null;
  payload: Record<string, unknown>;
}): string {
  const hash = createHash("sha256")
    .update(stableJson({
      name: input.name,
      tenantId: input.tenantId,
      entityType: input.entityType,
      entityId: input.entityId,
      payload: input.payload
    }))
    .digest("hex");

  return `evt_${hash}`;
}

export function createFrameworkEvent(input: CreateFrameworkEventInput): FrameworkEvent {
  const eventInput = createFrameworkEventInputSchema.parse(input);
  const idempotencyKey = eventInput.idempotency_key ?? createEventIdempotencyKey({
    name: eventInput.name,
    tenantId: eventInput.tenant_id,
    entityType: eventInput.entity_type,
    entityId: eventInput.entity_id,
    payload: eventInput.payload
  });

  return frameworkEventSchema.parse({
    ...eventInput,
    id: eventInput.id ?? globalThis.crypto.randomUUID(),
    idempotency_key: idempotencyKey
  });
}

export function assertEventTenantScope(input: {
  event: FrameworkEvent;
  tenantId: string;
}): true {
  const event = frameworkEventSchema.parse(input.event);

  if (event.tenant_id !== input.tenantId) {
    throw new Error("Event does not belong to the tenant.");
  }

  return true;
}
