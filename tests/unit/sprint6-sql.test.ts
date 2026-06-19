import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

import { sprintSixMigration, sprintSixRlsTables } from "../../src/framework/db";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const migrationPath = join(currentDirectory, "..", "..", "supabase", "migrations", sprintSixMigration);
const migrationSql = readFileSync(migrationPath, "utf8");

describe("Sprint 6 SQL contract", () => {
  it("creates billing tables and enables RLS", () => {
    expect(migrationSql).toContain("create table if not exists public.subscriptions");
    expect(migrationSql).toContain("create table if not exists public.statements");
    expect(migrationSql).toContain("create table if not exists public.invoices");

    for (const table of sprintSixRlsTables) {
      expect(migrationSql).toContain(`alter table public.${table} enable row level security;`);
    }
  });

  it("keeps billing writes server-side and blocks anonymous access", () => {
    for (const table of sprintSixRlsTables) {
      expect(migrationSql).toContain(`revoke all on public.${table} from anon;`);
      expect(migrationSql).not.toMatch(new RegExp(`grant\\s+insert\\s+on\\s+public\\.${table}\\s+to\\s+authenticated`, "i"));
      expect(migrationSql).not.toMatch(new RegExp(`grant\\s+update\\s+on\\s+public\\.${table}\\s+to\\s+authenticated`, "i"));
    }
  });

  it("protects immutable invoice content after issue", () => {
    expect(migrationSql).toContain("create or replace function app_private.prevent_invoice_content_mutation()");
    expect(migrationSql).toContain("before update on public.invoices");
    expect(migrationSql).toContain("invoice content is immutable");
  });

  it("defines pg_cron schedules for API key and trial lifecycle jobs", () => {
    expect(migrationSql).toContain("create extension if not exists pg_cron");
    expect(migrationSql).toContain("cron.schedule('fromzero-expire-api-keys'");
    expect(migrationSql).toContain("cron.schedule('fromzero-send-trial-reminders'");
    expect(migrationSql).toContain("cron.schedule('fromzero-expire-trials'");
  });

  it("keeps trial expiration aligned to degrade_to_free when Free exists", () => {
    expect(migrationSql).toContain("app_private.expire_trial_subscriptions()");
    expect(migrationSql).toContain("code = 'free'");
    expect(migrationSql).toContain("is_freemium");
    expect(migrationSql).toContain("'degrade_to_free'");
  });
});
