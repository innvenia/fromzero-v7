import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";

export const bookmarkRecordSchema = z.object({
  id: z.uuid(),
  user_id: z.uuid(),
  tenant_id: z.uuid(),
  entity_type: moduleCodeSchema,
  entity_id: z.uuid(),
  display_label: z.string().min(1).max(200),
  sort_order: z.number().int().nullable(),
  deleted_at: z.iso.datetime().nullable()
});

export type BookmarkRecord = z.infer<typeof bookmarkRecordSchema>;

export function isBookmarkVisibleToUser(
  bookmarkInput: BookmarkRecord,
  context: {
    userId: string;
    tenantId: string;
  }
): boolean {
  const bookmark = bookmarkRecordSchema.parse(bookmarkInput);

  return !bookmark.deleted_at
    && bookmark.user_id === context.userId
    && bookmark.tenant_id === context.tenantId;
}

export function assertBookmarkLimit(currentCount: number, maxCount: number): true {
  if (currentCount >= maxCount) {
    throw new Error("Bookmark limit exceeded.");
  }

  return true;
}
