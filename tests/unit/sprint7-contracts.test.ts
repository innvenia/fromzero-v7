import { describe, expect, it } from "vitest";

import {
  apiEndpointContractSchema,
  sprintSevenApiContracts
} from "../../src/framework/api";
import { coreModuleDefinitions } from "../../src/framework/bootstrap";
import {
  assertBookmarkLimit,
  buildDocumentVersionSnapshot,
  buildStorageBrowserTree,
  consentRecordSchema,
  createConsentRevocationRecord,
  createSignedDownloadIntent,
  createUploadIntent,
  documentRecordSchema,
  documentVersionRecordSchema,
  fileRecordSchema,
  isBookmarkVisibleToUser,
  tagRecordSchema,
  validateTagAttachment
} from "../../src/framework/modules";

const tenantId = "22222222-2222-4222-8222-222222222222";
const otherTenantId = "33333333-3333-4333-8333-333333333333";
const userId = "11111111-1111-4111-8111-111111111111";
const otherUserId = "99999999-9999-4999-8999-999999999999";
const documentId = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
const fileId = "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb";
const fileGroupId = "cccccccc-cccc-4ccc-8ccc-cccccccccccc";
const tagId = "dddddddd-dddd-4ddd-8ddd-dddddddddddd";
const now = new Date("2026-06-19T12:00:00.000Z");

const allowedModuleCodes = coreModuleDefinitions.map((moduleDefinition) => moduleDefinition.code);

const storageSettings = {
  allowedMimeTypes: [
    "image/*",
    "application/pdf",
    "text/csv",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel"
  ],
  maxFileSizeMb: 25,
  maxStoragePerTenantMb: 1024,
  imageOptimizationWebp: false
};

describe("Sprint 7 storage, document and shared-module contracts", () => {
  it("adds reserved API contracts for storage, documents and shared modules", () => {
    const parsedContracts = sprintSevenApiContracts.map((contract) =>
      apiEndpointContractSchema.parse(contract)
    );

    expect(parsedContracts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ basePath: "/api/v1/files", ownerSprint: "Sprint 7" }),
        expect.objectContaining({ basePath: "/api/v1/documents", ownerSprint: "Sprint 7" }),
        expect.objectContaining({ basePath: "/api/v1/tags", ownerSprint: "Sprint 7" }),
        expect.objectContaining({ basePath: "/api/v1/bookmarks", ownerSprint: "Sprint 7" }),
        expect.objectContaining({ basePath: "/api/v1/consent-records", ownerSprint: "Sprint 7" })
      ])
    );
  });

  it("validates upload intents before signed URL generation", () => {
    const intent = createUploadIntent({
      input: {
        tenantId,
        userId,
        entityType: "document",
        entityId: documentId,
        fileId,
        fileName: "policy.final.pdf",
        mimeType: "application/pdf",
        sizeBytes: 1_048_576,
        isPublic: false
      },
      settings: storageSettings,
      currentTenantStorageBytes: 512,
      now
    });

    expect(intent).toEqual({
      bucket: "private_documents",
      storageKey: `${tenantId}/document/${documentId}/${fileId}.pdf`,
      fileId,
      expiresInSeconds: 300,
      expiresAt: "2026-06-19T12:05:00.000Z",
      method: "PUT"
    });

    expect(() =>
      createUploadIntent({
        input: {
          tenantId,
          userId,
          entityType: "document",
          entityId: documentId,
          fileId,
          fileName: "unsafe.html",
          mimeType: "text/html",
          sizeBytes: 10,
          isPublic: false
        },
        settings: storageSettings,
        currentTenantStorageBytes: 0,
        now
      })
    ).toThrow("MIME type is not allowed");

    expect(() =>
      createUploadIntent({
        input: {
          tenantId,
          userId,
          entityType: "document",
          entityId: documentId,
          fileId,
          fileName: "large.pdf",
          mimeType: "application/pdf",
          sizeBytes: 26 * 1024 * 1024,
          isPublic: false
        },
        settings: storageSettings,
        currentTenantStorageBytes: 0,
        now
      })
    ).toThrow("File exceeds the configured size limit");
  });

  it("blocks cross-tenant signed downloads and builds a storage browser tree", () => {
    const currentFile = fileRecordSchema.parse({
      id: fileId,
      tenant_id: tenantId,
      file_name: "policy.final.pdf",
      storage_bucket: "private_documents",
      storage_key: `${tenantId}/document/${documentId}/${fileId}.pdf`,
      file_url: `${tenantId}/document/${documentId}/${fileId}.pdf`,
      file_size: 1_048_576,
      mime_type: "application/pdf",
      entity_type: "document",
      entity_id: documentId,
      is_public: false,
      thumbnail_url: null,
      file_group_id: fileGroupId,
      version: 2,
      previous_version_id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
      is_current: true,
      deleted_at: null
    });

    expect(
      createSignedDownloadIntent({
        file: currentFile,
        requesterTenantId: tenantId,
        expiresInSeconds: 900,
        now
      })
    ).toEqual({
      bucket: "private_documents",
      storageKey: `${tenantId}/document/${documentId}/${fileId}.pdf`,
      expiresInSeconds: 900,
      expiresAt: "2026-06-19T12:15:00.000Z"
    });

    expect(() =>
      createSignedDownloadIntent({
        file: currentFile,
        requesterTenantId: otherTenantId,
        expiresInSeconds: 900,
        now
      })
    ).toThrow("File does not belong to the requester tenant");

    expect(() =>
      createSignedDownloadIntent({
        file: { ...currentFile, is_current: false },
        requesterTenantId: tenantId,
        expiresInSeconds: 900,
        now
      })
    ).toThrow("Only the current file version can be signed");

    expect(buildStorageBrowserTree([currentFile])).toEqual([
      {
        entityType: "document",
        entityId: documentId,
        files: [
          expect.objectContaining({
            id: fileId,
            version: 2,
            isCurrent: true
          })
        ]
      }
    ]);
  });

  it("creates document version snapshots without mutating history", () => {
    const document = documentRecordSchema.parse({
      id: documentId,
      tenant_id: tenantId,
      title: "Security Policy",
      slug: "security-policy",
      content: "Initial content",
      excerpt: "Initial",
      category: "policy",
      status: "draft",
      is_pinned: false,
      published_at: null,
      custom_data: {},
      deleted_at: null
    });

    const version = buildDocumentVersionSnapshot({
      document,
      versionNumber: 1,
      userId,
      changeSummary: "Initial draft",
      createdAt: now
    });

    expect(documentVersionRecordSchema.parse(version)).toEqual(
      expect.objectContaining({
        tenant_id: tenantId,
        document_id: documentId,
        version_number: 1,
        title: "Security Policy",
        change_summary: "Initial draft",
        created_by: userId
      })
    );

    expect(() =>
      buildDocumentVersionSnapshot({
        document,
        versionNumber: 0,
        userId,
        changeSummary: null,
        createdAt: now
      })
    ).toThrow("Document version numbers start at 1");
  });

  it("enforces tenant/user scope for tags, bookmarks and consent records", () => {
    const tag = tagRecordSchema.parse({
      id: tagId,
      tenant_id: tenantId,
      name: "Legal",
      color: "#3B82F6",
      description: null,
      deleted_at: null
    });

    expect(
      validateTagAttachment({
        tag,
        target: {
          tenantId,
          entityType: "document",
          entityId: documentId
        },
        allowedModuleCodes
      })
    ).toBe(true);

    expect(() =>
      validateTagAttachment({
        tag,
        target: {
          tenantId: otherTenantId,
          entityType: "document",
          entityId: documentId
        },
        allowedModuleCodes
      })
    ).toThrow("Tag and target must belong to the same tenant");

    expect(
      isBookmarkVisibleToUser({
        id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        user_id: userId,
        tenant_id: tenantId,
        entity_type: "document",
        entity_id: documentId,
        display_label: "Security Policy",
        sort_order: 1,
        deleted_at: null
      }, { userId, tenantId })
    ).toBe(true);

    expect(
      isBookmarkVisibleToUser({
        id: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
        user_id: userId,
        tenant_id: tenantId,
        entity_type: "document",
        entity_id: documentId,
        display_label: "Security Policy",
        sort_order: 1,
        deleted_at: null
      }, { userId: otherUserId, tenantId })
    ).toBe(false);

    expect(() => assertBookmarkLimit(25, 25)).toThrow("Bookmark limit exceeded");

    const consent = consentRecordSchema.parse({
      id: "ffffffff-ffff-4fff-8fff-ffffffffffff",
      tenant_id: tenantId,
      user_id: userId,
      consent_type: "privacy_policy",
      accepted_at: "2026-06-19T12:00:00.000Z",
      revoked_at: null,
      document_id: documentId,
      document_version_id: null,
      ip_address: "203.0.113.10",
      user_agent: "Vitest",
      metadata: {}
    });

    expect(createConsentRevocationRecord(consent, {
      id: "12121212-1212-4212-8212-121212121212",
      revokedAt: "2026-06-19T13:00:00.000Z"
    })).toEqual(
      expect.objectContaining({
        id: "12121212-1212-4212-8212-121212121212",
        accepted_at: consent.accepted_at,
        revoked_at: "2026-06-19T13:00:00.000Z"
      })
    );
  });
});
