import { z } from "zod";

import { moduleCodeSchema } from "../../auth/schema";

export const storageBucketValues = [
  "public_assets",
  "private_documents",
  "imports",
  "exports"
] as const;

export const storageBucketSchema = z.enum(storageBucketValues);

export const defaultAllowedMimeTypes = [
  "image/*",
  "application/pdf",
  "text/csv",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel"
] as const;

const blockedMimeTypes = new Set([
  "application/javascript",
  "application/x-javascript",
  "text/html",
  "text/javascript"
]);

export const storageSettingsSchema = z.object({
  allowedMimeTypes: z.array(z.string().min(1)).min(1),
  maxFileSizeMb: z.number().positive(),
  maxStoragePerTenantMb: z.number().positive(),
  imageOptimizationWebp: z.boolean()
});

export const fileRecordSchema = z.object({
  id: z.string().uuid(),
  tenant_id: z.string().uuid(),
  file_name: z.string().min(1).max(300),
  storage_bucket: storageBucketSchema,
  storage_key: z.string().min(1).max(1000).refine((value) => !value.includes(".."), {
    message: "Storage key cannot contain path traversal segments."
  }),
  file_url: z.string().min(1).max(1000),
  file_size: z.number().int().nonnegative().max(Number.MAX_SAFE_INTEGER),
  mime_type: z.string().min(1).max(100),
  entity_type: moduleCodeSchema.nullable(),
  entity_id: z.string().uuid().nullable(),
  is_public: z.boolean(),
  thumbnail_url: z.string().min(1).max(1000).nullable(),
  file_group_id: z.string().uuid(),
  version: z.number().int().positive(),
  previous_version_id: z.string().uuid().nullable(),
  is_current: z.boolean(),
  deleted_at: z.string().datetime().nullable()
}).superRefine((file, context) => {
  if ((file.entity_type === null) !== (file.entity_id === null)) {
    context.addIssue({
      code: "custom",
      message: "File entity_type and entity_id must be both set or both null."
    });
  }
});

export const uploadIntentInputSchema = z.object({
  tenantId: z.string().uuid(),
  userId: z.string().uuid(),
  entityType: moduleCodeSchema,
  entityId: z.string().uuid(),
  fileId: z.string().uuid(),
  fileName: z.string().min(1).max(300),
  mimeType: z.string().min(1).max(100),
  sizeBytes: z.number().int().positive().max(Number.MAX_SAFE_INTEGER),
  isPublic: z.boolean()
});

export type StorageBucket = z.infer<typeof storageBucketSchema>;
export type StorageSettings = z.infer<typeof storageSettingsSchema>;
export type FileRecord = z.infer<typeof fileRecordSchema>;
export type UploadIntentInput = z.infer<typeof uploadIntentInputSchema>;

export type UploadIntent = {
  bucket: StorageBucket;
  storageKey: string;
  fileId: string;
  expiresInSeconds: number;
  expiresAt: string;
  method: "PUT";
};

export type SignedDownloadIntent = {
  bucket: StorageBucket;
  storageKey: string;
  expiresInSeconds: number;
  expiresAt: string;
};

export type StorageBrowserFile = {
  id: string;
  fileName: string;
  storageKey: string;
  version: number;
  isCurrent: boolean;
  sizeBytes: number;
  mimeType: string;
};

export type StorageBrowserNode = {
  entityType: string;
  entityId: string;
  files: StorageBrowserFile[];
};

function mimeTypeMatches(allowedMimeType: string, mimeType: string): boolean {
  if (allowedMimeType.endsWith("/*")) {
    return mimeType.startsWith(`${allowedMimeType.slice(0, -1)}`);
  }

  return allowedMimeType === mimeType;
}

function getSafeExtension(fileName: string): string {
  const extensionMatch = /\.([a-z0-9]{1,16})$/i.exec(fileName.trim());

  return extensionMatch ? `.${extensionMatch[1].toLowerCase()}` : "";
}

function addSeconds(date: Date, seconds: number): string {
  return new Date(date.getTime() + seconds * 1000).toISOString();
}

export function assertMimeTypeAllowed(mimeType: string, allowedMimeTypes: readonly string[]): true {
  if (blockedMimeTypes.has(mimeType)) {
    throw new Error("MIME type is not allowed.");
  }

  if (!allowedMimeTypes.some((allowedMimeType) => mimeTypeMatches(allowedMimeType, mimeType))) {
    throw new Error("MIME type is not allowed.");
  }

  return true;
}

export function assertFileSizeAllowed(sizeBytes: number, maxFileSizeMb: number): true {
  const maxBytes = maxFileSizeMb * 1024 * 1024;

  if (sizeBytes > maxBytes) {
    throw new Error("File exceeds the configured size limit.");
  }

  return true;
}

export function assertTenantStorageQuota(
  currentTenantStorageBytes: number,
  incomingSizeBytes: number,
  maxStoragePerTenantMb: number
): true {
  const maxBytes = maxStoragePerTenantMb * 1024 * 1024;

  if (currentTenantStorageBytes + incomingSizeBytes > maxBytes) {
    throw new Error("Tenant storage quota exceeded.");
  }

  return true;
}

export function resolveStorageBucket(input: Pick<UploadIntentInput, "entityType" | "isPublic">): StorageBucket {
  if (input.isPublic) {
    return "public_assets";
  }

  if (input.entityType === "import") {
    return "imports";
  }

  if (input.entityType === "export") {
    return "exports";
  }

  return "private_documents";
}

export function buildStorageKey(input: {
  bucket: StorageBucket;
  tenantId: string;
  entityType: string;
  entityId: string;
  fileId: string;
  fileName: string;
}): string {
  const extension = getSafeExtension(input.fileName);

  if (input.bucket === "public_assets") {
    return `${input.fileId}${extension}`;
  }

  if (input.bucket === "imports") {
    return `${input.tenantId}/imports/${input.entityId}/${input.fileId}${extension}`;
  }

  if (input.bucket === "exports") {
    return `${input.tenantId}/exports/${input.entityId}/${input.fileId}${extension}`;
  }

  return `${input.tenantId}/${input.entityType}/${input.entityId}/${input.fileId}${extension}`;
}

export function createUploadIntent(input: {
  input: UploadIntentInput;
  settings: StorageSettings;
  currentTenantStorageBytes: number;
  now: Date;
}): UploadIntent {
  const uploadInput = uploadIntentInputSchema.parse(input.input);
  const settings = storageSettingsSchema.parse(input.settings);

  assertMimeTypeAllowed(uploadInput.mimeType, settings.allowedMimeTypes);
  assertFileSizeAllowed(uploadInput.sizeBytes, settings.maxFileSizeMb);
  assertTenantStorageQuota(
    input.currentTenantStorageBytes,
    uploadInput.sizeBytes,
    settings.maxStoragePerTenantMb
  );

  const bucket = resolveStorageBucket(uploadInput);

  return {
    bucket,
    storageKey: buildStorageKey({
      bucket,
      tenantId: uploadInput.tenantId,
      entityType: uploadInput.entityType,
      entityId: uploadInput.entityId,
      fileId: uploadInput.fileId,
      fileName: uploadInput.fileName
    }),
    fileId: uploadInput.fileId,
    expiresInSeconds: 300,
    expiresAt: addSeconds(input.now, 300),
    method: "PUT"
  };
}

export function createSignedDownloadIntent(input: {
  file: FileRecord;
  requesterTenantId: string;
  expiresInSeconds: number;
  now: Date;
}): SignedDownloadIntent {
  const file = fileRecordSchema.parse(input.file);

  if (file.tenant_id !== input.requesterTenantId) {
    throw new Error("File does not belong to the requester tenant.");
  }

  if (file.deleted_at) {
    throw new Error("Deleted files cannot be signed.");
  }

  if (!file.is_current) {
    throw new Error("Only the current file version can be signed.");
  }

  if (input.expiresInSeconds < 60 || input.expiresInSeconds > 3600) {
    throw new Error("Signed URL TTL must be between 60 and 3600 seconds.");
  }

  return {
    bucket: file.storage_bucket,
    storageKey: file.storage_key,
    expiresInSeconds: input.expiresInSeconds,
    expiresAt: addSeconds(input.now, input.expiresInSeconds)
  };
}

export function buildStorageBrowserTree(filesInput: readonly FileRecord[]): StorageBrowserNode[] {
  const groupedFiles = new Map<string, StorageBrowserNode>();

  for (const fileInput of filesInput) {
    const file = fileRecordSchema.parse(fileInput);

    if (file.deleted_at || !file.entity_type || !file.entity_id) {
      continue;
    }

    const groupKey = `${file.entity_type}:${file.entity_id}`;
    const existingNode = groupedFiles.get(groupKey);
    const node = existingNode ?? {
      entityType: file.entity_type,
      entityId: file.entity_id,
      files: []
    };

    node.files.push({
      id: file.id,
      fileName: file.file_name,
      storageKey: file.storage_key,
      version: file.version,
      isCurrent: file.is_current,
      sizeBytes: file.file_size,
      mimeType: file.mime_type
    });

    groupedFiles.set(groupKey, node);
  }

  return [...groupedFiles.values()]
    .sort((left, right) => `${left.entityType}:${left.entityId}`.localeCompare(`${right.entityType}:${right.entityId}`))
    .map((node) => ({
      ...node,
      files: node.files.sort((left, right) => {
        if (left.fileName !== right.fileName) {
          return left.fileName.localeCompare(right.fileName);
        }

        return right.version - left.version;
      })
    }));
}
