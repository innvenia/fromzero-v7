import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sprintEightMigration, sprintEightRlsTables } from "../../src/framework/db";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(currentDirectory, "..", "..", "supabase", "migrations", sprintEightMigration);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("Sprint 8 SQL contract", () => {
  it("creates event, job, automation and data exchange tables", () => {
    expect(migrationSql).toContain("create table if not exists public.event_outbox");
    expect(migrationSql).toContain("create table if not exists public.job_runs");
    expect(migrationSql).toContain("create table if not exists public.notifications");
    expect(migrationSql).toContain("create table if not exists public.rules");
    expect(migrationSql).toContain("create table if not exists public.rule_runs");
    expect(migrationSql).toContain("create table if not exists public.email_templates");
    expect(migrationSql).toContain("create table if not exists public.integrations");
    expect(migrationSql).toContain("create table if not exists public.webhooks");
    expect(migrationSql).toContain("create table if not exists public.webhook_deliveries");
    expect(migrationSql).toContain("create table if not exists public.imports");
    expect(migrationSql).toContain("create table if not exists public.exports");
  });

  it("enables RLS and blocks anonymous access", () => {
    for (const table of sprintEightRlsTables) {
      expect(migrationSql).toContain(`alter table public.${table} enable row level security;`);
      expect(migrationSql).toContain(`revoke all on public.${table} from anon;`);
    }
  });

  it("keeps writes server-side for automation and integration tables", () => {
    for (const table of ["event_outbox", "job_runs", "rule_runs", "webhook_deliveries"]) {
      expect(migrationSql).not.toMatch(new RegExp(`grant\\s+insert\\s+on\\s+public\\.${table}\\s+to\\s+authenticated`, "i"));
      expect(migrationSql).not.toMatch(new RegExp(`grant\\s+update\\s+on\\s+public\\.${table}\\s+to\\s+authenticated`, "i"));
    }
  });

  it("requires encrypted credential envelopes and avoids plaintext webhook secrets", () => {
    expect(migrationSql).toContain("app_private.is_encrypted_envelope(credentials)");
    expect(migrationSql).toContain("app_private.is_encrypted_envelope(secret_encrypted)");
    expect(migrationSql).not.toMatch(/secret\s+text\s+not\s+null/i);
  });

  it("allows only CSV/XLSX import/export formats", () => {
    expect(migrationSql).toContain("file_format in ('csv', 'xlsx')");
    expect(migrationSql).not.toContain("file_format in ('csv', 'xlsx', 'json')");
  });

  it("defines pg_cron only for time-based export URL expiry", () => {
    expect(migrationSql).toContain("create extension if not exists pg_cron");
    expect(migrationSql).toContain("create or replace function app_private.expire_export_downloads()");
    expect(migrationSql).toContain("cron.schedule('fromzero-expire-export-downloads'");
  });
});
