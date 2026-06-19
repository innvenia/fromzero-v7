import { describe, expect, it } from "vitest";

import {
  apiEndpointContractSchema,
  sprintEightApiContracts
} from "../../src/framework/api";
import { coreModuleDefinitions } from "../../src/framework/bootstrap";
import {
  assertJobCanRetry,
  buildInngestPayload,
  createInngestEventAdapter,
  defaultJobRetryPolicy,
  getNextRetryDelaySeconds,
  sprintEightInngestJobDefinitions
} from "../../src/framework/jobs";
import {
  assertEncryptedCredentialsEnvelope,
  assertSafeOutboundUrl,
  buildIntegrationLogMetadata,
  integrationRecordSchema
} from "../../src/framework/integrations";
import {
  buildExportFileName,
  buildExportRequestedEvent,
  buildImportConfirmedEvent,
  buildImportPreview,
  buildNotificationFromEvent,
  createExportDownloadIntent,
  createFrameworkEvent,
  doesRuleMatchEvent,
  evaluateRuleCondition,
  importRecordSchema,
  markNotificationRead,
  renderEmailTemplate,
  resolveEmailTemplate,
  resolveImportFileFormat,
  resolveImportProcessingMode,
  ruleRecordSchema,
  signWebhookPayload,
  verifyWebhookSignature,
  webhookRecordSchema,
  buildWebhookDeliveryAttempt,
  shouldDisableWebhook
} from "../../src/framework";

const tenantId = "22222222-2222-4222-8222-222222222222";
const otherTenantId = "33333333-3333-4333-8333-333333333333";
const userId = "11111111-1111-4111-8111-111111111111";
const eventId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const ruleId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const importId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const exportId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const webhookId = "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee";
const integrationId = "ffffffff-ffff-4fff-8fff-ffffffffffff";
const now = new Date("2026-06-19T12:00:00.000Z");
const nowIso = now.toISOString();
const allowedModuleCodes = coreModuleDefinitions.map((moduleDefinition) => moduleDefinition.code);

const encryptedEnvelope = {
  ciphertext: "encrypted-value-with-minimum-length",
  key_id: "vault/default",
  algorithm: "aes-256-gcm" as const,
  redacted_preview: { api_key: "****1234" }
};

const webhookSecretEnvelope = {
  ciphertext: "encrypted-webhook-secret-value",
  key_id: "vault/webhook",
  algorithm: "aes-256-gcm" as const
};

describe("Sprint 8 events, jobs, integrations and automation contracts", () => {
  it("adds reserved API contracts for event, automation and data exchange modules", () => {
    const parsedContracts = sprintEightApiContracts.map((contract) =>
      apiEndpointContractSchema.parse(contract)
    );

    expect(parsedContracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ basePath: "/api/v1/events", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/jobs", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/notifications", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/rules", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/email-templates", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/integrations", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/webhooks", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/import-jobs", ownerSprint: "Sprint 8" }),
        expect.objectContaining({ basePath: "/api/v1/export-jobs", ownerSprint: "Sprint 8" })
      ])
    );
  });

  it("normalizes framework events into idempotent Inngest payloads", async () => {
    const event = createFrameworkEvent({
      id: eventId,
      name: "task.updated",
      tenant_id: tenantId,
      actor_id: userId,
      module_code: "task",
      entity_type: "task",
      entity_id: "12121212-1212-4212-8212-121212121212",
      source: "user",
      occurred_at: nowIso,
      payload: {
        status: "completed",
        priority: "high"
      }
    });

    const payload = buildInngestPayload(event);

    expect(payload).toEqual(expect.objectContaining({
      name: "task.updated",
      id: event.idempotency_key
    }));
    expect(payload.data).toEqual(expect.objectContaining({
      eventId,
      tenantId,
      moduleCode: "task"
    }));

    const sentPayloads: unknown[] = [];
    const adapter = createInngestEventAdapter({
      async send(payloadToSend) {
        sentPayloads.push(payloadToSend);
        return { ids: ["evt_mock_1"] };
      }
    });

    await expect(adapter.sendEvent(event)).resolves.toEqual({
      provider: "inngest",
      eventName: "task.updated",
      idempotencyKey: event.idempotency_key,
      ids: ["evt_mock_1"]
    });
    expect(sentPayloads).toHaveLength(1);
  });

  it("declares retryable user-triggered workflows separately from pg_cron", () => {
    expect(sprintEightInngestJobDefinitions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "notification.dispatch", kind: "inngest", idempotent: true }),
        expect.objectContaining({ name: "rule.evaluate", kind: "inngest", idempotent: true }),
        expect.objectContaining({ name: "webhook.deliver", kind: "inngest", idempotent: true }),
        expect.objectContaining({ name: "import.process", kind: "inngest", idempotent: true }),
        expect.objectContaining({ name: "export.process", kind: "inngest", idempotent: true })
      ])
    );

    expect(assertJobCanRetry({ attemptNumber: 3, retryPolicy: defaultJobRetryPolicy })).toBe(true);
    expect(getNextRetryDelaySeconds({ attemptNumber: 2, retryPolicy: defaultJobRetryPolicy })).toBe(300);
    expect(() => assertJobCanRetry({ attemptNumber: 4, retryPolicy: defaultJobRetryPolicy }))
      .toThrow("Job retry limit exceeded");
  });

  it("evaluates rules with a closed grammar and loop guard", () => {
    const event = createFrameworkEvent({
      id: eventId,
      name: "task.updated",
      tenant_id: tenantId,
      actor_id: userId,
      module_code: "task",
      entity_type: "task",
      entity_id: "12121212-1212-4212-8212-121212121212",
      source: "user",
      occurred_at: nowIso,
      payload: {
        status: "completed",
        priority: "critical",
        custom_data: { sla_risk: true }
      }
    });

    const rule = ruleRecordSchema.parse({
      id: ruleId,
      tenant_id: tenantId,
      name: "Notify completed critical tasks",
      description: null,
      is_active: true,
      trigger_event: "task.updated",
      trigger_module: "task",
      conditions: {
        operator: "AND",
        conditions: [
          { field: "status", operator: "eq", value: "completed" },
          { field: "priority", operator: "in", value: ["high", "critical"] },
          { field: "custom_data.sla_risk", operator: "eq", value: true }
        ]
      },
      action_type: "send_notification",
      action_config: {
        recipient_user_id: userId,
        recipient_profile_id: null,
        title: "Task completed",
        body: "A critical task was completed.",
        channels: ["in_app"]
      },
      max_retries: 3,
      retry_delay_seconds: 60,
      execution_count: 0,
      last_executed_at: null
    });

    expect(evaluateRuleCondition(rule.conditions, event.payload)).toBe(true);
    expect(doesRuleMatchEvent({ rule, event, allowedModuleCodes })).toBe(true);
    expect(
      doesRuleMatchEvent({
        rule,
        event: { ...event, tenant_id: otherTenantId },
        allowedModuleCodes
      })
    ).toBe(false);
    expect(() =>
      doesRuleMatchEvent({
        rule,
        event: { ...event, payload: { ...event.payload, __rule_run_ids: [rule.id] } },
        allowedModuleCodes
      })
    ).toThrow("Rule loop detected");
    expect(() =>
      ruleRecordSchema.parse({
        ...rule,
        conditions: { field: "status;drop", operator: "eq", value: "completed" }
      })
    ).toThrow();
  });

  it("builds notification records and renders escaped email templates", () => {
    const event = createFrameworkEvent({
      id: eventId,
      name: "notification.requested",
      tenant_id: tenantId,
      actor_id: userId,
      module_code: "notification",
      entity_type: "notification",
      entity_id: "12121212-1212-4212-8212-121212121212",
      source: "rule",
      occurred_at: nowIso,
      payload: {}
    });

    const notification = buildNotificationFromEvent({
      event,
      userId,
      title: "Policy update",
      body: "A policy changed.",
      channels: ["in_app", "email"],
      level: "warning",
      id: "12121212-1212-4212-8212-121212121212"
    });

    expect(notification).toEqual(expect.objectContaining({
      type: "automation",
      delivery_status: {
        in_app: "pending",
        email: "pending"
      }
    }));
    expect(markNotificationRead(notification, nowIso).read_at).toBe(nowIso);

    const templates = [
      {
        id: "23232323-2323-4232-8232-232323232323",
        tenant_id: null,
        code: "policy-update",
        name: "Policy update",
        subject: "Policy {{policy_name}}",
        body_html: "<p>{{user_name}}</p>",
        body_text: "Hi {{user_name}}",
        variables: [
          { name: "policy_name", type: "string", required: true },
          { name: "user_name", type: "string", required: true }
        ],
        is_active: true,
        is_system: true,
        locale: "en"
      },
      {
        id: "34343434-3434-4343-8343-343434343434",
        tenant_id: tenantId,
        code: "policy-update",
        name: "Tenant policy update",
        subject: "Tenant {{policy_name}}",
        body_html: "<p>{{user_name}}</p>",
        body_text: null,
        variables: [
          { name: "policy_name", type: "string", required: true },
          { name: "user_name", type: "string", required: true }
        ],
        is_active: true,
        is_system: false,
        locale: "en"
      }
    ] as const;

    const template = resolveEmailTemplate({
      templates,
      code: "policy-update",
      tenantId,
      locale: "en"
    });

    expect(template.tenant_id).toBe(tenantId);
    expect(
      renderEmailTemplate({
        template,
        data: {
          policy_name: "Security",
          user_name: "<script>alert(1)</script>"
        }
      })
    ).toEqual({
      subject: "Tenant Security",
      html: "<p>&lt;script&gt;alert(1)&lt;/script&gt;</p>",
      text: null
    });
  });

  it("requires encrypted integration credentials and blocks unsafe outbound URLs", () => {
    const integration = integrationRecordSchema.parse({
      id: integrationId,
      tenant_id: tenantId,
      provider: "resend",
      name: "Resend tenant adapter",
      config: {
        base_url: "https://api.resend.com"
      },
      credentials: encryptedEnvelope,
      status: "active",
      last_tested_at: null,
      is_active: true
    });

    expect(assertEncryptedCredentialsEnvelope(integration.credentials).algorithm).toBe("aes-256-gcm");
    expect(buildIntegrationLogMetadata(integration)).toEqual(
      expect.objectContaining({
        credentials: "[redacted]"
      })
    );
    expect(assertSafeOutboundUrl("https://hooks.example.com/path").hostname).toBe("hooks.example.com");
    expect(() => assertSafeOutboundUrl("http://hooks.example.com")).toThrow("Outbound URL must use HTTPS");
    expect(() => assertSafeOutboundUrl("https://127.0.0.1/internal"))
      .toThrow("Outbound URL points to a blocked private host");
  });

  it("signs webhooks, rejects replay, and builds delivery attempts", () => {
    const webhook = webhookRecordSchema.parse({
      id: webhookId,
      tenant_id: tenantId,
      name: "Task webhook",
      url: "https://hooks.example.com/task",
      secret_encrypted: webhookSecretEnvelope,
      events: ["task.updated"],
      is_active: true,
      last_triggered_at: null,
      failure_count: 9
    });
    const payload = JSON.stringify({ event: "task.updated", id: eventId });
    const timestamp = Math.floor(now.getTime() / 1000);
    const secret = "webhook_test_secret";
    const signatureHeader = signWebhookPayload({ payload, secret, timestamp });
    const replayCache = new Set<string>();

    expect(verifyWebhookSignature({
      payload,
      signatureHeader,
      secret,
      now,
      toleranceSeconds: 300,
      replayCache
    })).toBe(true);
    expect(verifyWebhookSignature({
      payload,
      signatureHeader,
      secret,
      now,
      toleranceSeconds: 300,
      replayCache
    })).toBe(false);

    expect(buildWebhookDeliveryAttempt({
      webhook,
      event: "task.updated",
      payload: { id: eventId },
      attemptNumber: 1,
      responseStatus: 500,
      responseBody: "temporary failure",
      attemptedAt: nowIso,
      id: "45454545-4545-4454-8454-454545454545"
    })).toEqual(expect.objectContaining({
      status: "retrying",
      delivered_at: null
    }));
    expect(shouldDisableWebhook({ ...webhook, failure_count: 10 })).toBe(true);
  });

  it("accepts only CSV/XLSX import and export workflows with signed download intent", () => {
    expect(resolveImportFileFormat({
      fileName: "tasks.csv",
      mimeType: "text/csv"
    })).toBe("csv");
    expect(resolveImportFileFormat({
      fileName: "tasks.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    })).toBe("xlsx");
    expect(() => resolveImportFileFormat({
      fileName: "tasks.json",
      mimeType: "application/json"
    })).toThrow("JSON import is not allowed");
    expect(resolveImportProcessingMode(1001)).toBe("inngest");

    const preview = buildImportPreview({
      rows: [
        { Title: "Fix login", Status: "open" },
        { Title: "", Status: "closed" }
      ],
      columnMapping: {
        Title: "title",
        Status: "status"
      },
      requiredFields: ["title", "status"]
    });

    expect(preview.validRowCount).toBe(1);
    expect(preview.errorCount).toBe(1);

    const importRecord = importRecordSchema.parse({
      id: importId,
      tenant_id: tenantId,
      module_code: "task",
      file_name: "tasks.csv",
      file_url: `${tenantId}/imports/${importId}/tasks.csv`,
      file_format: "csv",
      column_mapping: { Title: "title" },
      total_rows: 1001,
      processed_rows: 0,
      success_count: 0,
      error_count: 0,
      errors: [],
      status: "pending",
      started_at: null,
      completed_at: null
    });

    expect(buildImportConfirmedEvent({
      importRecord,
      actorId: userId,
      occurredAt: nowIso
    })).toEqual(expect.objectContaining({
      name: "import.confirmed",
      module_code: "import"
    }));

    const exportFileName = buildExportFileName({
      moduleCode: "task",
      fileFormat: "xlsx",
      createdAt: now
    });

    expect(exportFileName).toBe("task-20260619120000.xlsx");

    const exportRecord = {
      id: exportId,
      tenant_id: tenantId,
      module_code: "task",
      file_name: exportFileName,
      file_url: `${tenantId}/exports/${exportId}/${exportFileName}`,
      file_format: "xlsx",
      filters_applied: { status: "open" },
      total_rows: 25,
      status: "completed",
      download_expires_at: "2026-06-20T12:00:00.000Z",
      started_at: "2026-06-19T11:59:00.000Z",
      completed_at: nowIso
    } as const;

    expect(createExportDownloadIntent({
      exportRecord,
      requesterTenantId: tenantId,
      expiresInSeconds: 3600,
      now
    })).toEqual({
      bucket: "exports",
      storageKey: `${tenantId}/exports/${exportId}/${exportFileName}`,
      expiresInSeconds: 3600,
      expiresAt: "2026-06-19T13:00:00.000Z"
    });
    expect(buildExportRequestedEvent({
      exportRecord,
      actorId: userId,
      occurredAt: nowIso
    }).name).toBe("export.requested");
  });
});
