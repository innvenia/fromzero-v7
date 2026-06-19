import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sprintSevenMigration, sprintSevenRlsTables } from "../../src/framework/db";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(currentDirectory, "..", "..", "supabase", "migrations", sprintSevenMigration);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("Sprint 7 SQL contract", () => {
  it("creates storage, document and shared-module tables", () => {
    expect(migrationSql).toContain("create table if not exists public.documents");
    expect(migrationSql).toContain("create table if not exists public.document_versions");
    expect(migrationSql).toContain("create table if not exists public.files");
    expect(migrationSql).toContain("create table if not exists public.tags");
    expect(migrationSql).toContain("create table if not exists public.taggables");
    expect(migrationSql).toContain("create table if not exists public.bookmarks");
    expect(migrationSql).toContain("create table if not exists public.consent_records");
  });

  it("enables RLS and explicitly grants authenticated reads", () => {
    for (const table of sprintSevenRlsTables) {
      expect(migrationSql).toContain(`alter table public.${table} enable row level security;`);
      expect(migrationSql).toContain(`revoke all on public.${table} from anon;`);
    }

    expect(migrationSql).toContain("grant select on public.documents, public.document_versions, public.files, public.tags, public.taggables, public.bookmarks, public.consent_records to authenticated;");
    expect(migrationSql).not.toMatch(/grant\s+(insert|update|delete)\s+on\s+public\.files\s+to\s+authenticated/i);
    expect(migrationSql).not.toMatch(/grant\s+(insert|update|delete)\s+on\s+public\.consent_records\s+to\s+authenticated/i);
  });

  it("creates private storage buckets with MIME and size controls", () => {
    expect(migrationSql).toContain("insert into storage.buckets");
    expect(migrationSql).toContain("'private_documents'");
    expect(migrationSql).toContain("'public_assets'");
    expect(migrationSql).toContain("allowed_mime_types");
    expect(migrationSql).toContain("file_size_limit");
  });

  it("keeps document versions and consent records append-only", () => {
    expect(migrationSql).toContain("create or replace function app_private.prevent_append_only_mutation()");
    expect(migrationSql).toContain("before update or delete on public.document_versions");
    expect(migrationSql).toContain("before update or delete on public.consent_records");
  });

  it("defines controlled pg_cron purge with preview logging", () => {
    expect(migrationSql).toContain("create or replace function app_private.purge_soft_deleted_records(preview boolean default true)");
    expect(migrationSql).toContain("records_processed");
    expect(migrationSql).toContain("cron.schedule('fromzero-purge-soft-deletes'");
    expect(migrationSql).toContain("select app_private.purge_soft_deleted_records(false);");
  });
});
