import { z } from "zod";

import { frameworkEventSchema, type FrameworkEvent } from "../../events";

export const notificationTypeSchema = z.enum(["system", "tenant", "automation"]);
export const notificationLevelSchema = z.enum(["info", "success", "warning", "critical"]);
export const notificationChannelSchema = z.enum(["in_app", "email", "sms", "whatsapp"]);
export const notificationDeliveryStateSchema = z.enum([
  "pending",
  "delivered",
  "sent",
  "failed",
  "bounced",
  "skipped"
]);

export const notificationRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  user_id: z.uuid(),
  title: z.string().min(1).max(200),
  body: z.string().min(1).max(5000),
  type: notificationTypeSchema,
  level: notificationLevelSchema,
  channels: z.array(notificationChannelSchema).min(1),
  delivery_status: z.record(z.string(), notificationDeliveryStateSchema),
  entity_type: z.string().min(1).max(100).nullable(),
  entity_id: z.uuid().nullable(),
  read_at: z.iso.datetime().nullable(),
  archived_at: z.iso.datetime().nullable()
}).superRefine((notification, context) => {
  if (!notification.channels.includes("in_app")) {
    context.addIssue({
      code: "custom",
      message: "Notifications must always include the in_app channel."
    });
  }

  if (notification.channels.includes("sms") && /<[^>]+>/.test(notification.body)) {
    context.addIssue({
      code: "custom",
      message: "SMS notification bodies cannot include HTML."
    });
  }

  if (notification.channels.includes("sms") && notification.body.length > 160) {
    context.addIssue({
      code: "custom",
      message: "SMS notification bodies cannot exceed 160 characters."
    });
  }

  for (const channel of Object.keys(notification.delivery_status)) {
    if (!notificationChannelSchema.safeParse(channel).success) {
      context.addIssue({
        code: "custom",
        message: "Notification delivery_status contains an unknown channel."
      });
    }
  }
});

export type NotificationType = z.infer<typeof notificationTypeSchema>;
export type NotificationLevel = z.infer<typeof notificationLevelSchema>;
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;
export type NotificationDeliveryState = z.infer<typeof notificationDeliveryStateSchema>;
export type NotificationRecord = z.infer<typeof notificationRecordSchema>;

export function buildNotificationFromEvent(input: {
  event: FrameworkEvent;
  userId: string;
  title: string;
  body: string;
  channels?: NotificationChannel[];
  level?: NotificationLevel;
  id?: string;
}): NotificationRecord {
  const event = frameworkEventSchema.parse(input.event);
  const channels = input.channels ?? ["in_app"];

  return notificationRecordSchema.parse({
    id: input.id ?? globalThis.crypto.randomUUID(),
    tenant_id: event.tenant_id,
    user_id: input.userId,
    title: input.title,
    body: input.body,
    type: event.source === "rule" ? "automation" : "system",
    level: input.level ?? "info",
    channels,
    delivery_status: Object.fromEntries(channels.map((channel) => [channel, "pending"])),
    entity_type: event.entity_type,
    entity_id: event.entity_id,
    read_at: null,
    archived_at: null
  });
}

export function isNotificationVisibleToUser(
  notificationInput: NotificationRecord,
  requester: { tenantId: string; userId: string }
): boolean {
  const notification = notificationRecordSchema.parse(notificationInput);

  return notification.tenant_id === requester.tenantId
    && notification.user_id === requester.userId
    && notification.archived_at === null;
}

export function markNotificationRead(
  notificationInput: NotificationRecord,
  readAt: string
): NotificationRecord {
  const notification = notificationRecordSchema.parse(notificationInput);

  return notificationRecordSchema.parse({
    ...notification,
    read_at: notification.read_at ?? readAt
  });
}
