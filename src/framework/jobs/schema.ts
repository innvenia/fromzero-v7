import { z } from "zod";

import { frameworkEventSchema, type FrameworkEvent } from "../events";

export const backgroundJobKindSchema = z.enum(["pg_cron", "inngest"]);
export const backgroundJobStatusSchema = z.enum([
  "queued",
  "running",
  "succeeded",
  "failed",
  "retrying",
  "cancelled"
]);

export const jobRetryPolicySchema = z.object({
  maxAttempts: z.number().int().min(1).max(10),
  backoffSeconds: z.array(z.number().int().positive()).min(1).max(10)
}).superRefine((policy, context) => {
  if (policy.backoffSeconds.length < policy.maxAttempts - 1) {
    context.addIssue({
      code: "custom",
      message: "Retry policy must include enough backoff slots."
    });
  }
});

export const backgroundJobDefinitionSchema = z.object({
  name: z.string().check(z.regex(/^[a-z0-9-]+(?:\.[a-z0-9-]+)*$/)),
  kind: backgroundJobKindSchema,
  trigger: z.string().min(1).max(120),
  idempotent: z.boolean(),
  auditAction: z.string().min(1).max(100),
  retryPolicy: jobRetryPolicySchema,
  description: z.string().min(1).max(300)
});

export const jobRunRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid().nullable(),
  job_name: z.string().min(1).max(120),
  kind: backgroundJobKindSchema,
  status: backgroundJobStatusSchema,
  idempotency_key: z.string().min(16).max(160),
  attempt_number: z.number().int().positive(),
  max_attempts: z.number().int().positive(),
  last_error: z.string().max(1000).nullable(),
  payload: z.record(z.string(), z.unknown()),
  started_at: z.iso.datetime().nullable(),
  completed_at: z.iso.datetime().nullable()
}).superRefine((run, context) => {
  if (run.attempt_number > run.max_attempts) {
    context.addIssue({
      code: "custom",
      message: "Job attempt cannot exceed max attempts."
    });
  }

  if (run.status === "succeeded" && !run.completed_at) {
    context.addIssue({
      code: "custom",
      message: "Succeeded jobs require completed_at."
    });
  }
});

export type BackgroundJobKind = z.infer<typeof backgroundJobKindSchema>;
export type BackgroundJobStatus = z.infer<typeof backgroundJobStatusSchema>;
export type JobRetryPolicy = z.infer<typeof jobRetryPolicySchema>;
export type BackgroundJobDefinition = z.infer<typeof backgroundJobDefinitionSchema>;
export type JobRunRecord = z.infer<typeof jobRunRecordSchema>;

export const defaultJobRetryPolicy = {
  maxAttempts: 4,
  backoffSeconds: [60, 300, 900]
} satisfies JobRetryPolicy;

export const sprintEightInngestJobDefinitions = [
  {
    name: "notification.dispatch",
    kind: "inngest",
    trigger: "notification.requested",
    idempotent: true,
    auditAction: "notification.dispatch",
    retryPolicy: defaultJobRetryPolicy,
    description: "Dispatches notification channels without blocking HTTP requests."
  },
  {
    name: "rule.evaluate",
    kind: "inngest",
    trigger: "rule.evaluate",
    idempotent: true,
    auditAction: "rule.evaluate",
    retryPolicy: defaultJobRetryPolicy,
    description: "Evaluates closed-grammar rules from framework events."
  },
  {
    name: "webhook.deliver",
    kind: "inngest",
    trigger: "webhook.deliver",
    idempotent: true,
    auditAction: "webhook.deliver",
    retryPolicy: defaultJobRetryPolicy,
    description: "Delivers signed outbound webhooks with controlled retry."
  },
  {
    name: "import.process",
    kind: "inngest",
    trigger: "import.confirmed",
    idempotent: true,
    auditAction: "import.process",
    retryPolicy: defaultJobRetryPolicy,
    description: "Processes confirmed CSV/XLSX import jobs asynchronously."
  },
  {
    name: "export.process",
    kind: "inngest",
    trigger: "export.requested",
    idempotent: true,
    auditAction: "export.process",
    retryPolicy: defaultJobRetryPolicy,
    description: "Builds CSV/XLSX export files asynchronously."
  }
] as const satisfies readonly BackgroundJobDefinition[];

export const sprintEightPgCronSchedules = [
  {
    name: "fromzero-expire-export-downloads",
    cron: "45 * * * *",
    functionName: "app_private.expire_export_downloads"
  }
] as const;

export type SprintEightPgCronSchedule = (typeof sprintEightPgCronSchedules)[number];

export type InngestSendResult = {
  ids: string[];
};

export type InngestSendPayload = {
  name: string;
  data: Record<string, unknown>;
  id: string;
};

export type InngestEventClient = {
  send(payload: InngestSendPayload): Promise<InngestSendResult>;
};

export function buildInngestPayload(eventInput: FrameworkEvent): InngestSendPayload {
  const event = frameworkEventSchema.parse(eventInput);

  return {
    name: event.name,
    id: event.idempotency_key,
    data: {
      eventId: event.id,
      tenantId: event.tenant_id,
      actorId: event.actor_id,
      moduleCode: event.module_code,
      entityType: event.entity_type,
      entityId: event.entity_id,
      source: event.source,
      occurredAt: event.occurred_at,
      payload: event.payload
    }
  };
}

export function createInngestEventAdapter(client: InngestEventClient) {
  return {
    provider: "inngest" as const,
    async sendEvent(event: FrameworkEvent) {
      const payload = buildInngestPayload(event);
      const result = await client.send(payload);

      return {
        provider: "inngest" as const,
        eventName: payload.name,
        idempotencyKey: payload.id,
        ids: result.ids
      };
    }
  };
}

export function assertJobCanRetry(input: {
  attemptNumber: number;
  retryPolicy: JobRetryPolicy;
}): true {
  const retryPolicy = jobRetryPolicySchema.parse(input.retryPolicy);

  if (input.attemptNumber >= retryPolicy.maxAttempts) {
    throw new Error("Job retry limit exceeded.");
  }

  return true;
}

export function getNextRetryDelaySeconds(input: {
  attemptNumber: number;
  retryPolicy: JobRetryPolicy;
}): number {
  assertJobCanRetry(input);
  return input.retryPolicy.backoffSeconds[input.attemptNumber - 1] ?? input.retryPolicy.backoffSeconds.at(-1) ?? 60;
}
