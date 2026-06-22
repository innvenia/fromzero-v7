import { z } from "zod";

export const documentStatusSchema = z.enum(["draft", "published", "archived"]);

export const documentRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  title: z.string().min(1).max(300),
  slug: z.string().check(z.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(300),
  content: z.string().nullable(),
  excerpt: z.string().nullable(),
  category: z.string().min(1).max(100).nullable(),
  status: documentStatusSchema,
  is_pinned: z.boolean(),
  published_at: z.iso.datetime().nullable(),
  custom_data: z.record(z.string(), z.unknown()),
  deleted_at: z.iso.datetime().nullable()
}).superRefine((document, context) => {
  if (document.status === "published" && !document.published_at) {
    context.addIssue({
      code: "custom",
      message: "Published documents require published_at."
    });
  }
});

export const documentVersionRecordSchema = z.object({
  id: z.uuid(),
  tenant_id: z.uuid(),
  document_id: z.uuid(),
  version_number: z.number().int().positive(),
  title: z.string().min(1).max(300),
  slug: z.string().check(z.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).max(300),
  content: z.string().nullable(),
  excerpt: z.string().nullable(),
  category: z.string().min(1).max(100).nullable(),
  status: documentStatusSchema,
  published_at: z.iso.datetime().nullable(),
  change_summary: z.string().min(1).max(500).nullable(),
  created_by: z.uuid(),
  created_at: z.iso.datetime()
});

export type DocumentStatus = z.infer<typeof documentStatusSchema>;
export type DocumentRecord = z.infer<typeof documentRecordSchema>;
export type DocumentVersionRecord = z.infer<typeof documentVersionRecordSchema>;

function createClientSafeUuid(): string {
  return globalThis.crypto.randomUUID();
}

export function buildDocumentVersionSnapshot(input: {
  document: DocumentRecord;
  versionNumber: number;
  userId: string;
  changeSummary: string | null;
  createdAt: Date;
  id?: string;
}): DocumentVersionRecord {
  const document = documentRecordSchema.parse(input.document);

  if (input.versionNumber < 1) {
    throw new Error("Document version numbers start at 1.");
  }

  return documentVersionRecordSchema.parse({
    id: input.id ?? createClientSafeUuid(),
    tenant_id: document.tenant_id,
    document_id: document.id,
    version_number: input.versionNumber,
    title: document.title,
    slug: document.slug,
    content: document.content,
    excerpt: document.excerpt,
    category: document.category,
    status: document.status,
    published_at: document.published_at,
    change_summary: input.changeSummary,
    created_by: input.userId,
    created_at: input.createdAt.toISOString()
  });
}

export function getNextDocumentVersionNumber(versions: readonly DocumentVersionRecord[]): number {
  if (versions.length === 0) {
    return 1;
  }

  return Math.max(...versions.map((version) => documentVersionRecordSchema.parse(version).version_number)) + 1;
}
